import '../../css/styles.css';
import '../../css/output.css';

import React, { useCallback, useEffect, useState } from "react";
import { decamelizeKeys } from 'humps';
import { FaAngleDown } from "react-icons/fa6";

import * as Const from '../../constants/constants.js';

import { useKondateMaker } from '../global/global.jsx';
import { useIngredList } from '../../hooks/useFetchData.js';
import { useEventHandler } from '../../hooks/useEventHandler.js';

import { AddRow, ContextMenu, LoadingSpinner, TBodyLoading } from '../global/common.jsx';
import { IngredForm } from '../form/ingredForm.jsx';
import { IngredUnitConv } from './ingredUnitConv.jsx';
import { apiClient } from '../../utils/axiosClient.js';


export const Ingred = () => {

  const { 
    unitDict, 
    unitDictStat, 
    salesAreaDict, 
    salesAreaDictStat, 
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
  const { ingredList, ingredListStat, ingredListMutate } = useIngredList();
  
  const [ingredListDisp, setIngredListDisp] = useState();
  const [isAddIngred, setIsAddIngred] = useState(false);
  const [isEditIngred, setIsEditIngred] = useState(false);
  const [editIngredId, setEditIngredId] = useState();
  const [editData, setEditData] = useState({ ingredNm: null, ingredNmK: null, parentIngredNm: null, buyUnitCd: null, salesAreaType: null });
  // const [hoveredIndex, setHoveredIndex] = useState(null);
  // const [applyHovered, setApplyHovered] = useState(false);

  // データフェッチしたレシピリストを表示用リストにセット

  useEffect(() => {
    if (!ingredListStat.isLoading) {
      setIngredListDisp(
        ingredList
        ?.map((item) => ({
          ...item,
          ingredUnitConvVisible: null,
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
  useEventHandler("click", () => closeContextMenu());
  useEventHandler("scroll", () => closeContextMenu());

  // const handleTouchStart = (e, index) => {
  //   if (index === hoveredIndex) {
  //     setApplyHovered(!applyHovered);
  //   } else {
  //     setHoveredIndex(index);
  //     setApplyHovered(true);
  //   };
  //   touchStart(e, index, switchFlgIngredAcc);
  // }

  // const handleTouchEnd = (index) => {
  //   if (ingredListDisp[index]?.["contextMenuVisible"]) {setApplyHovered(true)};
  //   touchEnd();
  // };

  // const handleMouseEnter = (index) => {
  //   setApplyHovered(true);
  //   setHoveredIndex(index);
  // };

  const openAddIngredForm = () => {
    setIsAddIngred(true);
  };

  const openEditIngredForm = (row) => {
    setEditIngredId(row?.ingredId);
    setEditData({ ingredNm: row?.ingredNm, ingredNmK: row?.ingredNmK, parentIngredNm: row?.parentIngredNm, buyUnitCd: row?.buyUnitCd, salesAreaType: row?.salesAreaType });
    setIsEditIngred(true);
  };

  const closeIngredForm = () => {
    setIsAddIngred(false);
    setIsEditIngred(false);
    setIsOpeningForm(false);
  };

  const submitAddIngred = async (formData) => {
    clearMessage();
    console.log(`食材追加 
      食材名:${formData?.ingredNm} 
      食材名（かな）${formData?.ingredNmK} 
      親食材名:${formData?.parentIngredNm} 
      標準単位:${formData?.buyUnitCd} 
      売り場:${formData?.salesAreaType}`
    );
    try {
      const response = await apiClient.post(`${Const.ROOT_URL}/ingred/submitAddIngred`, { 
        ingredNm: formData?.ingredNm,
        ingredNmK: formData?.ingredNmK,
        parentIngredNm: formData?.parentIngredNm, 
        buyUnitCd: formData?.buyUnitCd, 
        salesAreaType: formData?.salesAreaType, 
      });
      const data = await response.data;
      console.log(data.message, data);
      ingredListMutate([...ingredList, data.newIngred]);
      if (!formData?.isRegisterContinue) {setIsAddIngred(false)};
    } catch (error) {
      showMessage(error?.response?.data?.detail || error?._messageTimeout || Const.MSG_MISSING_REQUEST, Const.MESSAGE_TYPE.ERROR);
    };
  };

  const submitEditIngred = async (formData) => {
    clearMessage();
    console.log(`食材編集 
      食材名:${formData?.ingredNm} 
      食材名（かな）:${formData?.ingredNmK} 
      親食材名:${formData?.parentIngredNm} 
      標準単位:${formData?.buyUnitCd} 
      売り場:${formData?.salesAreaType}`
    );
    try {
      const response = await apiClient.put(`${Const.ROOT_URL}/ingred/submitEditIngred`, { 
        ingredId: editIngredId,
        ingredNm: formData?.ingredNm,
        ingredNmK: formData?.ingredNmK,
        parentIngredNm: formData?.parentIngredNm, 
        buyUnitCd: formData?.buyUnitCd, 
        salesAreaType: formData?.salesAreaType, 
      });
      const data = await response.data;
      console.log(data.message, data);
      ingredListMutate(ingredList?.map((item) => (
        item.ingredId === data.editIngred.ingredId ? data.editIngred : item
      )));
      setIsEditIngred(false);
    } catch (error) {
      showMessage(error?.response?.data?.detail || error?._messageTimeout || Const.MSG_MISSING_REQUEST, Const.MESSAGE_TYPE.ERROR);
    };
  };

  const submitDeleteIngred = async (row) => {
    const deleteable = window.confirm("食材を削除します。\nよろしいですか？");
    if (!deleteable) {
      return;
    };
    clearMessage();
    const queryParams = new URLSearchParams(decamelizeKeys({ ingredId: row?.ingredId })).toString();
    try {
      const response = await apiClient.delete(`${Const.ROOT_URL}/ingred/submitDeleteIngred/queryParams?${queryParams}`);
      const data = await response.data;
      console.log(data.message, data);
      ingredListMutate(ingredList?.filter((item) => (item.ingredId !== row?.ingredId)));
    } catch (error) {
      showMessage(error?.response?.data?.detail || error?._messageTimeout || Const.MSG_MISSING_REQUEST, Const.MESSAGE_TYPE.ERROR);
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
          {!ingredListStat.isLoading ?
            <>
              {ingredListDisp?.map((row, index) => (
                // フラグメントで返却するとスマホで[row?.recipeIngredVisible]を非表示に切り替えた際に
                // レイアウトが崩れるため、<tbody>で返却する
                <tbody key={row?.ingredId}>
                  <tr  
                    onContextMenu={(e) => openContextMenu(e, index)}
                    onTouchStart={(e) => touchStart(e, index)} 
                    onTouchEnd={() => touchEnd(index)} 
                    onMouseEnter={() => hoveredRowSetting(index)}
                    onMouseLeave={() => setApplyHovered(false)}
                    className={`detail-table-row ${(applyHovered && index === hoveredIndex) && "group"}`}
                  >
                    <td className="detail-table-data bg-white w-32 group-hover:bg-blue-100">
                      {row?.ingredNm}
                      {/* 個別にtdタグで配置すると[detail-table-row]定義した[gap-1]によって余分な間隔が発生するため
                          onClickイベントが無いtdタグに混在させることで回避。 */}
                      {index === contextMenuIndex && 
                        <ContextMenu menuList={[
                          {textContent: "編集", onClick: () => openEditIngredForm(row, index)},
                          {textContent: "削除", onClick: () => submitDeleteIngred(row)},
                        ]} />
                      }
                    </td>
                    <td className="detail-table-data bg-white w-14 group-hover:bg-blue-100">
                      {!unitDictStat.isLoading ? unitDict[row?.buyUnitCd] : <LoadingSpinner />}
                    </td>
                    <td className="detail-table-data bg-white w-28 group-hover:bg-blue-100">
                      {!salesAreaDictStat.isLoading ? salesAreaDict[row?.salesAreaType] : <LoadingSpinner />}
                    </td>
                    <td 
                      className="detail-table-data bg-white w-12 group-hover:bg-blue-100"
                      onClick={() => switchFlgIngredAcc(index, flg.ingredUnitConvVisible, !row?.ingredUnitConvVisible)}
                    >
                      <FaAngleDown className={`${row?.ingredUnitConvVisible !== null && (row?.ingredUnitConvVisible ? "animate-arrowRotateIn" : "animate-arrowRotateOut")}`}/>
                      {/* <i className="fa-solid fa-angle-down"></i> */}
                    </td>
                  </tr>
                  <IngredUnitConv ingred={row} />
                  {/* {row?.ingredUnitConvVisible && <IngredUnitConv ingred={row} />} */}
                </tbody>
              ))}
              <tbody>
                <AddRow textContent="食材を追加" onClick={openAddIngredForm} cssWidth="w-full" />
              </tbody>
            </>
          :
            <TBodyLoading />
          }
        </table>
        {isAddIngred && <IngredForm submitAction={submitAddIngred} closeIngredForm={closeIngredForm} />}
        {isEditIngred && <IngredForm submitAction={submitEditIngred} closeIngredForm={closeIngredForm} editData={editData} />}
      </div>    
    </div>
  );
};  
