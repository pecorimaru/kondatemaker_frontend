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
    touchStart, 
    touchEnd, 
    showMessage, 
    clearMessage,
    setIsOpeningForm,
    openContextMenu,
    closeContextMenu,
    contextMenuIndex,
    hoveredIndex,
    applyHovered,
    setApplyHovered,
    hoveredRowSetting,
  } = useKondateMaker();
  
  const { ingredUnitConvList, ingredUnitConvListStat, ingredUnitConvListMutate } = useIngredUnitConvList(
    ingred.ingredUnitConvVisible !== null ? ingred?.ingredId : null
  );
  const [ingredUnitConvListDisp, setIngredUnitConvListDisp] = useState();
  const [isAddIngredUnitConv, setIsAddIngredUnitConv] = useState(false);
  const [isEditIngredUnitConv, setIsEditIngredUnitConv] = useState(false);
  const [editIngredUnitConvId, setEditIngredUnitConvId] = useState();
  const [editData, setEditData] = useState(); 
  // const [hoveredIndex, setHoveredIndex] = useState(null);
  // const [applyHovered, setApplyHovered] = useState(false); 

  // データフェッチしたレシピ食材リストを表示用リストにセット
  // ・各画面で同一のキー[contextMenuVisible]を利用することでコンテキストメニューのオープン/クローズ処理を共通化
  useEffect(() => {
    if (!ingredUnitConvListStat.isLoading) {
      setIngredUnitConvListDisp(
        ingredUnitConvList?.map((item) => ({
          ...item,
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
  useEventHandler("click", () => closeContextMenu());
  useEventHandler("scroll", () => closeContextMenu());

  // const handleTouchStart = (e, index) => {
  //   if (index === hoveredIndex) {
  //     setApplyHovered(!applyHovered);
  //   } else {
  //     setHoveredIndex(index);
  //     setApplyHovered(true);
  //   };
  //   touchStart(e, index, switchFlgIngredUnitConvAcc);
  // }

  // const handleTouchEnd = (index) => {
  //   if (ingredUnitConvListDisp[index]?.["contextMenuVisible"]) {setApplyHovered(true)};
  //   touchEnd();
  // };

  // const handleMouseEnter = (index) => {
  //   setApplyHovered(true);
  //   setHoveredIndex(index);
  // };

  const openAddIngredForm = () => {
    // closeContextMenu(switchFlgIngredUnitConvAcc);  // 親明細を持つ明細行のコンテキストは明示的にクローズしないとなぜか消えない
    setIsAddIngredUnitConv(true);
  };

  const openEditIngredForm = (row) => {
    // closeContextMenu(switchFlgIngredUnitConvAcc);  // 親明細を持つ明細行明細のコンテキストは明示的にクローズしないとなぜか消えない
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
      closeIngredUnitConvForm();
    } catch (error) {
      showMessage(error?.response?.data?.detail || error?._messageTimeout || Const.MSG_MISSING_REQUEST, Const.MESSAGE_TYPE.ERROR);
    };
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
      closeIngredUnitConvForm();
    } catch (error) {
      showMessage(error?.response?.data?.detail || error?._messageTimeout || Const.MSG_MISSING_REQUEST, Const.MESSAGE_TYPE.ERROR);
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
                onContextMenu={(e) => openContextMenu(e, index)}
                onTouchStart={(e) => touchStart(e, index)} 
                onTouchEnd={() => touchEnd(index)} 
                onMouseEnter={() => hoveredRowSetting(index)}
                onMouseLeave={() => setApplyHovered(false)}
                className={`detail-table-row ${(applyHovered && index === hoveredIndex) && "group"}`}
              >
                <td className="detail-table-data bg-white w-20 group-hover:bg-blue-100">
                  {!unitDictStat.isLoading ? `${ingred.unitConvWeight} ${unitDict[ingred.buyUnitCd]}` : <LoadingSpinner /> }
                </td>
                <td className="detail-table-data bg-white w-12 group-hover:bg-blue-100">
                ＝
                </td>
                <td className="detail-table-data bg-white w-20 group-hover:bg-blue-100">
                  {!unitDictStat.isLoading ? `${Math.round((row.convRate * ingred.unitConvWeight) * 100) / 100} ${unitDict[row.convUnitCd]}` : <LoadingSpinner /> }

                  {/* gap-1 によって間隔が作られてしまうため最後の<td>タグエリアを間借りする */}
                  {index === contextMenuIndex && 
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
