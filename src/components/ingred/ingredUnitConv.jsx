import '../../css/styles.css';
import '../../css/output.css';

import { useCallback, useEffect, useState } from 'react';
import { decamelizeKeys } from 'humps';

import * as Const from '../../constants/constants.js';

import { useKondateMaker } from '../global/global.jsx';
import { useEventHandler } from '../../hooks/useEventHandler.js';
import { useIngredUnitConvList } from '../../hooks/useFetchData.js';

import { LoadingSpinner, AddRow, ContextMenu } from '../global/common.jsx';
import { IngredUnitConvForm } from '../form/ingredUnitConvForm.jsx';
import { apiClient } from '../../utils/axiosClient.js';


export const IngredUnitConv = ({ ingred }) => {

  const { 
    unitDict, 
    unitDictStat, 
    handleContextMenu, 
    touchStart, 
    touchEnd, 
    closeContextMenu, 
    showMessage, 
    clearMessage,
    setIsOpeningForm,
  } = useKondateMaker();
  
  const { ingredUnitConvList, ingredUnitConvListStat, ingredUnitConvListMutate } = useIngredUnitConvList(
    ingred.ingredUnitConvVisible !== null ? ingred?.ingredId : null
  );
  const [ingredUnitConvListDisp, setIngredUnitConvListDisp] = useState();
  const [isAddIngredUnitConv, setIsAddIngredUnitConv] = useState(false);
  const [isEditIngredUnitConv, setIsEditIngredUnitConv] = useState(false);
  const [editIngredUnitConvId, setEditIngredUnitConvId] = useState();
  const [editData, setEditData] = useState();  

  // データフェッチしたレシピ食材リストを表示用リストにセット
  // ・各画面で同一のキー[contextMenuVisible]を利用することでコンテキストメニューのオープン/クローズ処理を共通化
  useEffect(() => {
    if (!ingredUnitConvListStat.isLoading) {
      setIngredUnitConvListDisp(
        ingredUnitConvList?.map((item) => ({
          ...item,
          contextMenuVisible: false,
        }))
      );
    }
  }, [ingredUnitConvList, ingredUnitConvListStat.isLoading]);
  
   // 表示用リストで定義したフラグのスイッチング処理
   const switchFlgIngredUnitConvAcc = useCallback((updIndex, key, flg, isAll=false) => {
     if (ingredUnitConvList && ingredUnitConvListDisp) {
      setIngredUnitConvListDisp(
        ingredUnitConvListDisp?.map((item, index) => ({
           ...item,
           [key]: isAll || index === updIndex ? flg : ingredUnitConvListDisp[index]?.[key],
         }))
       );    
     };
   }, [ingredUnitConvList, ingredUnitConvListDisp, setIngredUnitConvListDisp]);

  // 画面クリック or スクロールでコンテキストメニューをクローズ
  useEventHandler("click", () => closeContextMenu(switchFlgIngredUnitConvAcc));
  useEventHandler("scroll", () => closeContextMenu(switchFlgIngredUnitConvAcc));

  const openAddIngredForm = () => {
    closeContextMenu(switchFlgIngredUnitConvAcc);  // 親明細を持つ明細行のコンテキストは明示的にクローズしないとなぜか消えない
    setIsAddIngredUnitConv(true);
  };

  const openEditIngredForm = (row) => {
    closeContextMenu(switchFlgIngredUnitConvAcc);  // 親明細を持つ明細行明細のコンテキストは明示的にクローズしないとなぜか消えない
    setEditIngredUnitConvId(row?.ingredUnitConvId);
    setEditData({ convUnitCd: row?.convUnitCd, convRate: row?.convRate, convWeight: row?.convWeight });
    setIsEditIngredUnitConv(true);
  };

  const closeIngredUnitConvForm = () => {
    setIsAddIngredUnitConv(false);
    setIsEditIngredUnitConv(false);
    setIsOpeningForm(false);
  };

  const submitAddIngredUnitConv = async (formData) => {
    clearMessage();
    console.log(`食材単位変換追加 食材ID:${ingred?.ingredId} 変換単位:${formData?.convUnitCd} 変換率:${formData?.convRate}`);
    try {
      const response = await apiClient.post(`${Const.ROOT_URL}/ingred/submitAddIngredUnitConv`, { 
        ingredId: ingred?.ingredId,
        convUnitCd: formData?.convUnitCd,
        convRate: formData?.convRate / ingred.unitConvWeight, 
      });
      const data = await response.data;
      console.log(data.message, data);
      ingredUnitConvListMutate([...ingredUnitConvList, data.newIngredUnitConv]);
    } catch (error) {
      showMessage(error?.response?.data?.detail || error?._messageTimeout || Const.MSG_MISSING_REQUEST, Const.MESSAGE_TYPE.ERROR);
    }
    setIsAddIngredUnitConv(false);
  };

  const submitEditIngredUnitConv = async (formData) => {
    clearMessage();
    console.log(`食材単位変換編集 食材ID:${ingred?.ingredId} 変換単位:${formData?.convUnitCd} 変換率:${formData?.convRate} `);
    try {
      const response = await apiClient.put(`${Const.ROOT_URL}/ingred/submitEditIngredUnitConv`, { 
        ingredUnitConvId: editIngredUnitConvId,
        ingredId: ingred?.ingredId,
        convUnitCd: formData?.convUnitCd,
        convRate: formData?.convRate / ingred.unitConvWeight, 
      });
      const data = await response.data;
      console.log(data.message, data);
      ingredUnitConvListMutate(ingredUnitConvList.map((item) => (
        item?.ingredUnitConvId === editIngredUnitConvId ? data.newIngredUnitConv : item
      )));
    } catch (error) {
      showMessage(error?.response?.data?.detail || error?._messageTimeout || Const.MSG_MISSING_REQUEST, Const.MESSAGE_TYPE.ERROR);
    } finally {   
      setIsEditIngredUnitConv(false);
    };
  };

  const submitDeleteIngredUnitConv = async (row) => {
    const deleteable = window.confirm("食材を削除します。\nよろしいですか？");
    if (!deleteable) {
      return;
    };
    clearMessage();
    const queryParams = new URLSearchParams(decamelizeKeys({ ingredUnitConvId: row?.ingredUnitConvId })).toString();
    try {
      const response = await apiClient.delete(`${Const.ROOT_URL}/ingred/submitDeleteIngredUnitConv/query_params?${queryParams}`);
      const data = await response.data;
      console.log(data.message, data);
      ingredUnitConvListMutate(ingredUnitConvList.filter((item) => item.ingredUnitConvId !== row.ingredUnitConvId));
    } catch (error) {
      showMessage(error?.response?.data?.detail || error?._messageTimeout || Const.MSG_MISSING_REQUEST, Const.MESSAGE_TYPE.ERROR);
    } finally {
      closeContextMenu(switchFlgIngredUnitConvAcc);
    };
  };

  if (ingredUnitConvListStat.isLoading) {
    return (
      <>
        {ingred.ingredUnitConvVisible &&
          <tr className="flex justify-end">
            <td className="w-54 py-2"><LoadingSpinner /></td>
          </tr>
        }
    </>
    )
  };

  return (
    <tr>
      <td>
        <table className="flex justify-end overflow-hidden">
          <tbody
            style={{
              height: `${ingred.ingredUnitConvVisible ? ingredUnitConvList?.length * 44 + 48 : 0}px`,
              transition: 'height 0.3s ease',
            }}
          >
            {ingredUnitConvListDisp?.map((row, index) => 
              <tr 
                key={row.ingredUnitConvId} 
                onContextMenu={(event) => handleContextMenu(event, index, switchFlgIngredUnitConvAcc)}
                onTouchStart={(event) => touchStart(event, index, switchFlgIngredUnitConvAcc)} 
                onTouchEnd={touchEnd} 
                className="detail-table-row"
              >
                <td className="detail-table-data bg-white w-20">
                  {!unitDictStat.isLoading ? `${ingred.unitConvWeight} ${unitDict[ingred.buyUnitCd]}` : <LoadingSpinner /> }
                </td>
                <td className="detail-table-data bg-white w-12">
                ＝
                </td>
                <td className="detail-table-data bg-white w-20">
                  {!unitDictStat.isLoading ? `${Math.round((row.convRate * ingred.unitConvWeight) * 100) / 100} ${unitDict[row.convUnitCd]}` : <LoadingSpinner /> }

                  {/* gap-1 によって間隔が作られてしまうため最後の<td>タグエリアを間借りする */}
                  {row.contextMenuVisible && 
                    <ContextMenu menuList={[
                      {textContent: "編集", onClick: () => openEditIngredForm(row)},
                      {textContent: "削除", onClick: () => submitDeleteIngredUnitConv(row, index)}
                    ]}/> 
                  }
                </td>
              </tr>
            )}
            <AddRow textContent="単位変換を追加" onClick={openAddIngredForm} cssWidth="w-54" />
          </tbody>
        </table>
        {isAddIngredUnitConv && <IngredUnitConvForm ingred={ingred} submitAction={submitAddIngredUnitConv} closeIngredUnitConvForm={closeIngredUnitConvForm} />}
        {isEditIngredUnitConv && <IngredUnitConvForm ingred={ingred} submitAction={submitEditIngredUnitConv} closeIngredUnitConvForm={closeIngredUnitConvForm} editData={editData} />}
      </td>
    </tr>
  );
};
