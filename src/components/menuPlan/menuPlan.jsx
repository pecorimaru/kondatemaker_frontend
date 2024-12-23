import '../../css/styles.css';
import '../../css/output.css';

import React, { useCallback, useEffect, useState } from 'react';
import { decamelizeKeys } from 'humps';

import * as Const from '../../constants/constants.js';
import { FaAngleDown } from "react-icons/fa6";

import { useKondateMaker } from '../global/global.jsx';
import { useMenuPlanList } from '../../hooks/useFetchData.js';
import { useEventHandler } from '../../hooks/useEventHandler.js';

import { AddRow, ContextMenu, TBodyLoading } from '../global/common.jsx';
import { MenuPlanDet } from './menuPlanDet';
import { MenuPlanForm } from '../form/menuPlanForm.jsx';
import { apiClient } from '../../utils/axiosClient.js';


export const MenuPlan = () => {

  const { 
    handleContextMenu, 
    touchStart, 
    touchEnd, 
    closeContextMenu, 
    showMessage, 
    clearMessage,
    setIsOpeningForm, 
  } = useKondateMaker();

  const {menuPlanList, menuPlanListStat, menuPlanListMutate} = useMenuPlanList();
  const [menuPlanListDisp, setMenuPlanListDisp] = useState();
  const [isAddMenuPlan, setIsAddMenuPlan] = useState(false);
  const [isEditMenuPlan, setIsEditMenuPlan] = useState(false);
  const [editMenuPlanId, setEditMenuPlanId] = useState();
  const [editData, setEditData] = useState();
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [applyHovered, setApplyHovered] = useState(false);
  
  // データフェッチした献立プランリストを表示用リストにセット
  // ・各画面で同一のキー[contextMenuVisible]を利用することでコンテキストメニューのオープン/クローズ処理を共通化
  useEffect(() => {
    if (!menuPlanListStat.isLoading) {
      setMenuPlanListDisp(
        menuPlanList?.map((item) => ({
          ...item,
          contextMenuVisible: false,
          menuPlanDetVisible: null,
        }))
      );
    };
  }, [menuPlanList, menuPlanListStat.isLoading]);

  // 表示用リストで定義したフラグのスイッチング処理
  const flg = { menuPlanDetVisible: "menuPlanDetVisible" };
  const switchFlgMenuPlanAcc = useCallback((updIndex, key, flg, isAll=false) => {
    // console.log(`switchFlgMenuPlanAcc`, `updIndex:${updIndex} key:${key} flg:${flg} isAll:${isAll}`)
    if (menuPlanList && menuPlanListDisp) {
      setMenuPlanListDisp(
        menuPlanListDisp?.map((item, index) => ({
          ...item,
          [key]: isAll || index === updIndex ? flg : menuPlanListDisp[index]?.[key],
        }))
      );    
    };
  }, [menuPlanList, menuPlanListDisp, setMenuPlanListDisp]);
  
  // 画面クリック or スクロールでコンテキストメニューをクローズ
  useEventHandler("click", () => closeContextMenu(switchFlgMenuPlanAcc));
  useEventHandler("scroll", () => closeContextMenu(switchFlgMenuPlanAcc));

  const handleTouchStart = (e, index) => {
    if (index === hoveredIndex) {
      setApplyHovered(!applyHovered);
    } else {
      setHoveredIndex(index);
      setApplyHovered(true);
    };
    touchStart(e, index, switchFlgMenuPlanAcc);
  };

  const handleTouchEnd = (index) => {
    if (menuPlanListDisp[index]?.["contextMenuVisible"]) {setApplyHovered(true)};
    touchEnd();
  };

  const handleMouseEnter = (index) => {
    setApplyHovered(true);
    setHoveredIndex(index);
  };

  const openAddMenuPlanForm = () => {
    setIsAddMenuPlan(true);
  };

  const openEditMenuPlanForm = (row) => {
    setApplyHovered(false);
    setEditMenuPlanId(row?.menuPlanId);
    setEditData({ menuPlanNm: row?.menuPlanNm, menuPlanNmK: row?.menuPlanNmK });
    setIsEditMenuPlan(true);
  };

  const closeMenuPlanForm = () => {
    setIsAddMenuPlan(false);
    setIsEditMenuPlan(false);
    setIsOpeningForm(false);
  };

  const submitAddMenuPlan = async (formData) => {
    clearMessage();
    console.log(`献立プラン追加 献立名:${formData?.menuPlanNm} 献立名(かな) ${formData?.menuPlanNmK}`);
    try {
      const response = await apiClient.post(`${Const.ROOT_URL}/menuPlan/submitAddMenuPlan`, { 
        menuPlanNm: formData?.menuPlanNm,
        menuPlanNmK: formData?.menuPlanNmK,
      });
      const data = await response.data;
      console.log(data.message, data);
      menuPlanListMutate([...menuPlanList, data?.newMenuPlan]);
      setIsAddMenuPlan(false);
    } catch (error) {
      showMessage(error?.response?.data?.detail || error?._messageTimeout || Const.MSG_MISSING_REQUEST, Const.MESSAGE_TYPE.ERROR);
    };
  };

  const submitEditMenuPlan = async (formData) => {
    clearMessage();
    console.log(`献立プラン編集 献立ID:${editMenuPlanId} 献立名:${formData?.menuPlanNm} 献立名（かな） ${formData?.menuPlanNmK}`);
    try {
      const response = await apiClient.put(`${Const.ROOT_URL}/menuPlan/submitEditMenuPlan`, { 
        menuPlanId: editMenuPlanId,
        menuPlanNm: formData?.menuPlanNm,
        menuPlanNmK: formData?.menuPlanNmK,
      });
      const data = await response.data;
      console.log(data.message, data);
      menuPlanListMutate(menuPlanList?.map((menuPlan) => (
          menuPlan.menuPlanId === data.newMenuPlan.menuPlanId ? data.newMenuPlan : menuPlan
      )));
      setIsEditMenuPlan(false);
    } catch (error) {
      showMessage(error?.response?.data?.detail || error?._messageTimeout || Const.MSG_MISSING_REQUEST, Const.MESSAGE_TYPE.ERROR);
    };
  };

  const submitDeleteMenuPlan = async (row) => {
    clearMessage();
    console.log("献立プラン削除", `献立ID:${row?.menuPlanId}`);
    const deleteable = window.confirm("献立プランを削除します。\n明細も含めてすべて削除されますがよろしいですか？");
    setApplyHovered(false);
    if (!deleteable) {
      return;
    };
    const queryParams = new URLSearchParams(decamelizeKeys({ menuPlanId: row?.menuPlanId })).toString();
    try {
      const response = await apiClient.delete(`${Const.ROOT_URL}/menuPlan/submitDeleteMenuPlan/query_params?${queryParams}`);
      const data = await response.data;
      console.log(data.message, data);
      menuPlanListMutate(menuPlanList?.filter((item) => (item.menuPlanId !== row?.menuPlanId)));
      closeContextMenu(switchFlgMenuPlanAcc);
    } catch (error) {
      showMessage(error?.response?.data?.detail || error?._messageTimeout || Const.MSG_MISSING_REQUEST, Const.MESSAGE_TYPE.ERROR);
    };     
  };

  return(
    <div className="main-container">
      <div className="mt-header-mb-footer">
        <table className="mt-3">
          <thead>
            <tr className="header-table-row">
              <th className={`header-talbe-data w-52`}>献立プラン</th>
              <th className={`header-talbe-data w-12`}>詳細</th>
            </tr>
          </thead>
          {!menuPlanListStat.isLoading ?
            <>
              {menuPlanListDisp?.map((row, index) => (
                // フラグメントで返却するとスマホで[row?.menuPlanDetVisible]を非表示に切り替えた際に
                // レイアウトが崩れるため、<tbody>で返却する
                <tbody key={row?.menuPlanId}>
                  <tr 
                    onContextMenu={(e) => handleContextMenu(e, index, switchFlgMenuPlanAcc)}
                    onTouchStart={(e) => handleTouchStart(e, index)} 
                    onTouchEnd={() => handleTouchEnd(index)} 
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={() => setApplyHovered(false)}
                    className={`detail-table-row ${(applyHovered && index === hoveredIndex) && "group"}`}
                  >
                    <td className={`${applyHovered && "group-hover:bg-blue-100"} detail-table-data bg-white w-52`}>
                      {row?.menuPlanNm}
                      {/* 個別にtdタグで配置すると[detail-table-row]定義した[gap-1]によって余分な間隔が発生するため
                          onClickイベントが無いtdタグに混在させることで回避。 */}
                      {row?.contextMenuVisible && (
                        <ContextMenu menuList={[
                          {textContent: "編集", onClick: () => openEditMenuPlanForm(row, index)},
                          {textContent: "削除", onClick: () => submitDeleteMenuPlan(row, index)},
                        ]} />
                      )}
                    </td>
                    <td 
                      className={`${applyHovered && "group-hover:bg-blue-100"} detail-table-data bg-white w-12`} 
                      onClick={() => switchFlgMenuPlanAcc(index, flg.menuPlanDetVisible, !row?.menuPlanDetVisible)}
                    >
                      <FaAngleDown className={`${row?.menuPlanDetVisible !== null && (row?.menuPlanDetVisible ? "animate-arrowRotateIn" : "animate-arrowRotateOut")}`}/>
                    </td>
                  </tr>
                  <MenuPlanDet menuPlan={row}/>
                </tbody>
              ))}
              <tbody>
                <AddRow textContent="献立プランを追加" onClick={openAddMenuPlanForm} cssWidth="w-full"/>
              </tbody>
            </>
          :
            <TBodyLoading />
          }
        </table>
        {isAddMenuPlan && (<MenuPlanForm submitAction={submitAddMenuPlan} closeMenuPlanForm={closeMenuPlanForm}/>)}
        {isEditMenuPlan && (<MenuPlanForm submitAction={submitEditMenuPlan} closeMenuPlanForm={closeMenuPlanForm} editData={editData}/>)}
      </div>    
    </div>
  );
}    
