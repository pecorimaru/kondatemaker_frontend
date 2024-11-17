import '../../css/styles.css';
import '../../css/output.css';

import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { decamelizeKeys } from 'humps';

import * as Const from '../../constants/constants.js';

import { useKondateMaker } from '../global/global.jsx';
import { useBuyIngredList } from '../../hooks/useFetchData.js';
import { IngredSelectForm } from '../form/ingredSelectForm.jsx';
import { BuyIngred } from './buyIngred.jsx';
import { AddRow } from '../global/common.jsx';
import { useEventHandler } from '../../hooks/useEventHandler.js';
import { apiClient } from '../../utils/axiosClient.js';

export const Buy = () => {

  const { user, closeContextMenu } = useKondateMaker();
  const { buyIngredList, buyIngredListStat, buyIngredListMutate } = useBuyIngredList(user?.id);

  const [incompleteList, setIncompleteList] = useState();
  const [completeList, setCompleteList] = useState();
  const [editBuyIngredId, setEditBuyIngredId] = useState();
  const [editData, setEditData] = useState({ ingredNm: null, qty: null, unitNm: null, salesAreaType: null });

  const [isAddIngred, setIsAddIngred] = useState(false);
  const [isEditIngred, setIsEditIngred] = useState(false);

  // データフェッチしたレシピリストを表示用リストにセット
  // ・各画面で同一のキー[contextMenuVisible]を利用することでコンテキストメニューのオープン/クローズ処理を共通化
  useEffect(() => {
    if (!buyIngredListStat?.isLoading) {
      setIncompleteList(
        buyIngredList
        ?.filter(buyIngredList => buyIngredList.boughtFlg === "F")
        ?.map((item, index) => ({
          ...item,
          num: index +1,
          isBought: false,
          contextMenuVisible: false
        }))
      );
      setCompleteList(
        buyIngredList
        ?.filter(buyIngredList => buyIngredList.boughtFlg === "T")
        ?.map((item, index) => ({
          ...item,
          num: buyIngredList?.filter(buyIngredList => buyIngredList.boughtFlg === "F")?.length + index +1,
          isBought: true,
          contextMenuVisible: false
        }))
      );
    };
  }, [buyIngredList, buyIngredListStat?.isLoading, setIncompleteList, setCompleteList]);

    // 表示用リストで定義したフラグのスイッチング処理（未完了）
  const switchFlgIncompleteAcc = useCallback((updIndex, key, flg, isAll=false) => {
    // console.log(`switchFlgIncompleteAcc updIndex:${updIndex} key:${key} flg:${flg} isAll:${isAll}`)
    if (incompleteList) {
      setIncompleteList(
        incompleteList?.map((item, index) => ({
          ...item,
          [key]: isAll || index === updIndex ? flg : incompleteList[index]?.[key],
        }))
      );    
    };
  }, [incompleteList, setIncompleteList]);

  // 表示用リストで定義したフラグのスイッチング処理（完了済）
  const switchFlgCompleteAcc = useCallback((updIndex, key, flg, isAll=false) => {
    // console.log(`switchFlgCompleteAcc updIndex:${updIndex} key:${key} flg:${flg} isAll:${isAll}`)
    if (completeList) {
      setCompleteList(
        completeList?.map((item, index) => ({
          ...item,
          [key]: isAll || index === updIndex ? flg : completeList[index]?.[key],
        }))
      );    
    };
  }, [completeList, setCompleteList]);

  // *********************************************
  // ■ 画面クリック時のコンテキストメニュークローズ処理について ■
  // 通常はuseCloseContextMenu(closeContextMenu, switchFlgXXXXAcc)で定義するが
  // それに合わせてbuyIngredコンポーネント内でswitchFlgXXXXAccを定義して
  // 未完行、完了済行にて再帰的に利用すると、完了済側のコンテキストメニューが閉じられない不具合が発生する。
  // 原因不明だが、buyList内でそれぞれswitchFlgXXXXAccを定義し
  // 例外的にコンテキストメニュークローズ用のイベントハンドラも独自に実装することで回避する。
  // *********************************************
  const handleCloseContext = () => {
    closeContextMenu(switchFlgCompleteAcc);
    closeContextMenu(switchFlgIncompleteAcc);
  }
  useEventHandler("click", handleCloseContext);
  useEventHandler("scroll", handleCloseContext);

  // ☑ 押下時処理
  const submitSwitchCompletion = (row) => {
    // パフォーマンス向上のため、DB更新前に状態変数を更新する
    const stillIncomplete = incompleteList?.filter((item) => (item.buyIngredId !== row?.buyIngredId))
    const stillComplete = completeList?.filter((item) => (item.buyIngredId !== row?.buyIngredId))
    const changeToIncomplete = row?.isBought ? [{ ...row, isBought: !row?.isBought }] : [] 
    const changeToComplete = !row?.isBought ? [{ ...row, isBought: !row?.isBought }] : [] 
    setCompleteList([...stillComplete, ...changeToComplete]);
    setIncompleteList([...stillIncomplete, ...changeToIncomplete]);

    const boughtFlg = !row?.isBought ? "T" : "F";
    apiClient.put(`${Const.ROOT_URL}/buy/submitSwitchCompletion`, decamelizeKeys({ buyIngredId: row?.buyIngredId, boughtFlg }))
      .then(response => {
        const data  = response.data
        console.log("切り替え成功", data);
        buyIngredListMutate(buyIngredList?.map((item) => (
          item.buyIngredId === data.newBuyIngred.buyIngredId ? data.newBuyIngred : item          
        )), { revalidate: false });
      })
      .catch(error => {
        console.error("切り替え失敗", error);    
      });
  };

  const openAddIngredForm = () => {
    setIsAddIngred(true);
  };

  const openEditIngredForm = (row) => {
    setIsEditIngred(true);
    setEditBuyIngredId(row?.buyIngredId);
    setEditData({ ingredNm: row?.ingredNm, qty: row?.qty, unitCd: row?.unitCd, salesAreaType: row?.salesAreaType });
  };

  const closeIngredForm = () => {
    setIsAddIngred(false);
    setIsEditIngred(false);
  };

  const submitAddBuyIngred = async (formData) => {
    console.log(`購入食材追加 食材名:${formData?.ingredNm} 必要量:${formData?.qty} 単位:${formData?.unitCd} 売り場:${formData?.salesAreaType}`)
    try {
      const response = await apiClient.post(`${Const.ROOT_URL}/buy/submitAddBuyIngred`, { 
        ingredNm: formData?.ingredNm,
        qty: formData?.qty, 
        unitCd: formData?.unitCd, 
        salesAreaType: formData?.salesAreaType, 
        userId: user?.id 
      });
      const data = response.data;
      if (data.statusCode === 200) {
        console.log("登録成功", data)
        buyIngredListMutate([...buyIngredList, data?.newBuyIngred]);
        setIsAddIngred(false);
      } else {
        throw new Error(data.message);
      };
    } catch (error) {
      console.error("登録失敗", error);
    };
  };

  const submitEditBuyIngred = async (formData) => {
    console.log(`購入食材更新 食材名:${formData?.ingredNm} 必要量:${formData?.qty} 単位:${formData?.unitCd} 売り場:${formData?.salesAreaType}`)
      try {
        const response = await apiClient.put(`${Const.ROOT_URL}/buy/submitEditBuyIngred`, { 
          buyIngredId: editBuyIngredId,
          ingredNm: formData?.ingredNm,
          qty: formData?.qty, 
          unitCd: formData?.unitCd,
          salesAreaType: formData?.salesAreaType,
          userId: user?.id
        });
        const data = await response.data;
        if (data.statusCode === 200) {
          console.log("更新成功", data);
          buyIngredListMutate(buyIngredList?.map((item) => (
            item?.buyIngredId === data?.newBuyIngred?.buyIngredId ? data?.newBuyIngred : item
          )));
          setIsEditIngred(false);
        } else {
          throw new Error(data?.message);
        };
      } catch (error) {
        console.error("更新失敗", error);
      };        
  };

  const submitDeleteBuyIngred = async (row) => {
    const deleteable = window.confirm(`食材を削除します。\nよろしいですか？ \n${row?.ingredNm}`);
    if (deleteable) {
      const query_params = new URLSearchParams(decamelizeKeys({ buyIngredId: row?.buyIngredId, userId: user?.id })).toString();
      try {
        const response = await apiClient.delete(`${Const.ROOT_URL}/buy/submitDeleteBuyIngred/queryParams?${query_params}`);
        const data = await response.data;
        if (data.statusCode === 200) {
          console.log("削除成功", data);
          buyIngredListMutate(buyIngredList?.filter((item) => (item?.buyIngredId !== row?.buyIngredId)));
        } else {
          throw new Error(data.message);
        };
      } catch (error) {
        console.error("削除失敗", error);
      };        
    };
  };

  return(
    <div className="main-container">
      <div className="mt-header-mb-footer">
        <table className="mt-3">
          <thead>
            <tr className="header-table-row">
              <th className="header-talbe-data w-8"><i className="fa-solid fa-check"></i></th>
              <th className="header-talbe-data w-32">食材</th>
              <th className="header-talbe-data w-16">数量</th>
              <th className="header-talbe-data w-28">売り場</th>
            </tr>
          </thead>
          <tbody>
            {incompleteList
              ?.sort((a, b) => {
                if (a?.salesAreaSeq !== b?.salesAreaSeq) {
                  return a.salesAreaSeq - b.salesAreaSeq
                }
                return a.num - b.num
              })?.map((row, index) => (
                <BuyIngred
                  key={row.buyIngredId}  //警告対策＠コンポーネントでは使用しない
                  row={row}
                  index={index}
                  switchFlgBuyIngredAcc={switchFlgIncompleteAcc}
                  submitSwitchCompletion={submitSwitchCompletion}
                  openEditIngredForm={openEditIngredForm}
                  submitDeleteBuyIngred={submitDeleteBuyIngred}
                />
              ))
            }
            <AddRow textContent="食材を追加" onClick={openAddIngredForm} cssWidth="w-full" />
            {completeList?.length > 0 && 
              <tr className="mt-1">
                <td className="text-sm text-slate-400 px-3 pt-2"><i className="fa-solid fa-check"></i>　完了済の項目</td>
              </tr>
            }
            {completeList
              // 1.売り場順序 2.取得順序でソート
              ?.sort((a, b) => {
                if (a?.salesAreaSeq !== b?.salesAreaSeq) {
                  return a.salesAreaSeq - b.salesAreaSeq
                }
                return a.num - b.num
              })?.map((row, index) => (
                <BuyIngred
                  key={row.buyIngredId}  // key:警告対策＠コンポーネントでは使用しない
                  row={row}
                  index={index}
                  switchFlgBuyIngredAcc={switchFlgCompleteAcc}
                  submitSwitchCompletion={submitSwitchCompletion}
                  openEditIngredForm={openEditIngredForm}
                  submitDeleteBuyIngred={submitDeleteBuyIngred}
                />
              ))
            }
          </tbody>
        </table>
        {isAddIngred && 
          <IngredSelectForm 
            prevScreenType={Const.PREV_SCREEN_TYPE.BUY} 
            submitAction={submitAddBuyIngred} 
            closeIngredForm={closeIngredForm} 
          />
        }
        {isEditIngred && 
          <IngredSelectForm 
            prevScreenType={Const.PREV_SCREEN_TYPE.BUY} 
            submitAction={submitEditBuyIngred} 
            closeIngredForm={closeIngredForm} 
            editData={editData} 
          />
        }
      </div>    
    </div>
  );
}    
