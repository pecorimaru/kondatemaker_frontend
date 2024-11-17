import '../../css/styles.css';
import '../../css/output.css';

import React, { useCallback, useEffect, useState } from "react";
import { decamelizeKeys } from 'humps';

import * as Const from '../../constants/constants.js';

import { useKondateMaker } from '../global/global.jsx';
import { useIngredList } from '../../hooks/useFetchData.js';
import { useOnClick, useOnScroll } from '../../hooks/useEventHandler.js';

import { AddRow, ContextMenu, LoadingSpinner } from '../global/common.jsx';
import { IngredForm } from '../form/ingredForm.jsx';
import { IngredUnitConv } from './ingredUnitConv.jsx';
import { apiClient } from '../../utils/axiosClient.js';



export const Ingred = () => {

  const { user, unitDict, unitDictStat, salesAreaDict, salesAreaDictStat, handleContextMenu, handleTouchStart, handleTouchEnd, closeContextMenu } = useKondateMaker();
  const { ingredList, ingredListStat, ingredListMutate } = useIngredList(user?.id);
  
  const [ingredListDisp, setIngredListDisp] = useState();
  const [isAddIngred, setIsAddIngred] = useState(false);
  const [isEditIngred, setIsEditIngred] = useState(false);
  const [editIngredId, setEditIngredId] = useState();
  const [editData, setEditData] = useState({ ingredNm: null, ingredNmK: null, parentIngredNm: null, standardUnitCd: null, salesAreaType: null });

  // データフェッチしたレシピリストを表示用リストにセット
  // ・各画面で同一のキー[contextMenuVisible]を利用することでコンテキストメニューのオープン/クローズ処理を共通化
  useEffect(() => {
    if (!ingredListStat.isLoading) {
      setIngredListDisp(
        ingredList
        ?.map((item) => ({
          ...item,
          contextMenuVisible: false,
          ingredUnitConvVisible: false,
        }))
      )
    };
  }, [ingredList, ingredListStat.isLoading]);

  // 表示用リストで定義したフラグのスイッチング処理
  const flg = { ingredUnitConvVisible: "ingredUnitConvVisible"};
  const switchFlgIngredAcc = useCallback((updIndex, key, flg, isAll=false) => {
    if (ingredList && ingredListDisp) {
      setIngredListDisp(
        ingredListDisp?.map((item, index) => ({
          ...item,
          [key]: isAll || index === updIndex ? flg : ingredListDisp[index]?.[key],
        }))
      );    
    };
  }, [ingredList, ingredListDisp, setIngredListDisp]);

  // 画面クリック or スクロールでコンテキストメニューをクローズ
  useOnClick(() => closeContextMenu(switchFlgIngredAcc));
  useOnScroll(() => closeContextMenu(switchFlgIngredAcc));

  const openAddIngredForm = () => {
    setIsAddIngred(true);
  };

  const openEditIngredForm = (row) => {
    setEditIngredId(row?.ingredId);
    setEditData({ ingredNm: row?.ingredNm, ingredNmK: row?.ingredNmK, parentIngredNm: row?.parentIngredNm, standardUnitCd: row?.standardUnitCd, salesAreaType: row?.salesAreaType });
    setIsEditIngred(true);
  };

  const closeIngredForm = () => {
    setIsAddIngred(false);
    setIsEditIngred(false);
  };

  const submitAddIngred = async (formData) => {
    console.log(`食材追加 
      食材名:${formData?.ingredNm} 
      食材名（かな）${formData?.ingredNmK} 
      親食材名:${formData?.parentIngredNm} 
      標準単位:${formData?.standardUnitCd} 
      売り場:${formData?.salesAreaType}`
    );

    try {
      const response = await apiClient.post(`${Const.ROOT_URL}/ingred/submitAddIngred`, { 
        ingredNm: formData?.ingredNm,
        ingredNmK: formData?.ingredNmK,
        parentIngredNm: formData?.parentIngredNm, 
        standardUnitCd: formData?.standardUnitCd, 
        salesAreaType: formData?.salesAreaType, 
        userId: user?.id 
      });
      const data = await response.data;
      if (data.statusCode === 200) {
        console.log("登録成功", data);
        ingredListMutate([...ingredList, data.newIngred]);
        setIsAddIngred(false);
      } else {
        throw new Error(data.message);
      };
    } catch (error) {
      console.error("登録失敗", error);
    };
  };

  const submitEditIngred = async (formData) => {
    console.log(`食材編集 
      食材名:${formData?.ingredNm} 
      食材名（かな）:${formData?.ingredNmK} 
      親食材名:${formData?.parentIngredNm} 
      標準単位:${formData?.standardUnitCd} 
      売り場:${formData?.salesAreaType}`
    );
    try {
      const response = await apiClient.put(`${Const.ROOT_URL}/ingred/submitEditIngred`, { 
        ingredId: editIngredId,
        ingredNm: formData?.ingredNm,
        ingredNmK: formData?.ingredNmK,
        parentIngredNm: formData?.parentIngredNm, 
        standardUnitCd: formData?.standardUnitCd, 
        salesAreaType: formData?.salesAreaType, 
        userId: user?.id 
      });
      const data = await response.data;
      if (data.statusCode === 200) {
        console.log("更新成功", data);
        ingredListMutate(ingredList?.map((item) => (
          item.ingredId === data.editIngred.ingredId ? data.editIngred : item
        )));
        setIsEditIngred(false);
      } else {
        throw new Error(data.message);
      };
    } catch (error) {
      console.error("登録失敗", error);
    };
  };

  const submitDeleteIngred = async (row) => {
    const deleteable = window.confirm("食材を削除します。\nよろしいですか？");
    if (deleteable) {
      const queryParams = new URLSearchParams(decamelizeKeys({ ingredId: row?.ingredId, userId: user?.id })).toString();
      try {
        const response = await apiClient.delete(`${Const.ROOT_URL}/ingred/submitDeleteIngred/queryParams?${queryParams}`);
        const data = await response.data;
        if (data.statusCode === 200) {
          console.log("削除成功", data);
          ingredListMutate(ingredList?.filter((item) => (item.ingredId !== row?.ingredId)));
          closeContextMenu(switchFlgIngredAcc);
        } else {
          throw new Error(data.message);
        };
      } catch (error) {
        console.error("削除失敗", error);
      }        
    };
  };

  return(
    <div className="main-container">
      <div className="mt-header-mb-footer">
        <table className="mt-3">
          <thead>
            <tr className="header-table-row items-center">
              <th className="bg-blue-900 font-bold shadow-lg rounded-sm py-3.5 w-32">食材名</th>
              <th className="bg-blue-900 font-bold shadow-lg rounded-sm py-1 w-14">購入<br />単位</th>
              <th className="bg-blue-900 font-bold shadow-lg rounded-sm py-3.5 w-28">売り場</th>
              <th className="bg-blue-900 font-bold shadow-lg rounded-sm py-1 w-12">単位<br />変換</th>
            </tr>
          </thead>
          {ingredListDisp?.map((row, index) => (
            // フラグメントで返却するとスマホで[row?.recipeIngredVisible]を非表示に切り替えた際に
            // レイアウトが崩れるため、<tbody>で返却する
            <tbody key={row?.ingredId}>
              <tr  
                onContextMenu={(event) => handleContextMenu(event, index, switchFlgIngredAcc)}
                onTouchStart={(event) => handleTouchStart(event, index, switchFlgIngredAcc)} 
                onTouchEnd={handleTouchEnd} 
                className="detail-table-row"
              >
                <td className="detail-table-data bg-white w-32">
                  {row?.ingredNm}
                </td>
                <td className="detail-table-data bg-white w-14">
                  {!unitDictStat.isLoading ? unitDict[row?.standardUnitCd] : <LoadingSpinner />}
                </td>
                <td className="detail-table-data bg-white w-28">
                  {!salesAreaDictStat.isLoading ? salesAreaDict[row?.salesAreaType] : <LoadingSpinner />}
                </td>
                <td 
                  className="detail-table-data bg-white w-12"
                  onClick={() => switchFlgIngredAcc(index, flg.ingredUnitConvVisible, !row?.ingredUnitConvVisible)}
                >
                  <i className="fa-solid fa-angle-down"></i>

                  {/* gap-1 によって間隔が作られてしまうため最後の<td>タグエリアを間借りする */}
                  {row?.contextMenuVisible && 
                    <ContextMenu menuList={[
                      {textContent: "編集", onClick: () => openEditIngredForm(row, index)},
                      {textContent: "削除", onClick: () => submitDeleteIngred(row, index)},
                    ]} />
                  }
                </td>
              </tr>
              {row?.ingredUnitConvVisible && <IngredUnitConv ingred={row} />}
            </tbody>
          ))}
          <tbody>
            <AddRow textContent="食材を追加" onClick={openAddIngredForm} cssWidth="w-full" />
          </tbody>
        </table>
        {isAddIngred && <IngredForm submitAction={submitAddIngred} closeIngredForm={closeIngredForm} />}
        {isEditIngred && <IngredForm submitAction={submitEditIngred} closeIngredForm={closeIngredForm} editData={editData} />}
      </div>    
    </div>
  );
};  
