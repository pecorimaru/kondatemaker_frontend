import '../../css/styles.css';
import '../../css/output.css';

import React, { useCallback, useEffect, useState } from 'react';
import { decamelizeKeys } from 'humps';

import * as Const from '../../constants/constants.js';

import { useKondateMaker } from '../global/global.jsx';
import { useMenuPlanList } from '../../hooks/useFetchData.js';
import { useEventHandler } from '../../hooks/useEventHandler.js';

import { AddRow, ContextMenu } from '../global/common.jsx';
import { MenuPlanDet } from './menuPlanDet';
import { MenuPlanForm } from '../form/menuPlanForm.jsx';
import { apiClient } from '../../utils/axiosClient.js';


export const MenuPlan = () => {

  const { user, handleContextMenu, handleTouchStart, handleTouchEnd, closeContextMenu } = useKondateMaker();
  const {menuPlanList, menuPlanListStat, menuPlanListMutate} = useMenuPlanList(user?.id);

  const [menuPlanListDisp, setMenuPlanListDisp] = useState();
  const [isAddMenuPlan, setIsAddMenuPlan] = useState(false);
  const [isEditMenuPlan, setIsEditMenuPlan] = useState(false);
  const [editMenuPlanId, setEditMenuPlanId] = useState();
  const [editData, setEditData] = useState();
  
  // データフェッチした献立プランリストを表示用リストにセット
  // ・各画面で同一のキー[contextMenuVisible]を利用することでコンテキストメニューのオープン/クローズ処理を共通化
  useEffect(() => {
    if (!menuPlanListStat.isLoading) {
      setMenuPlanListDisp(
        menuPlanList?.map((item) => ({
          ...item,
          contextMenuVisible: false,
          menuPlanDetVisible: false,
        }))
      );
    };
  }, [menuPlanList, menuPlanListStat.isLoading]);

  // 表示用リストで定義したフラグのスイッチング処理
  const flg = { menuPlanDetVisible: "menuPlanDetVisible" };
  const switchFlgMenuPlanAcc = useCallback((updIndex, key, flg, isAll=false) => {
    // console.log(`updIndex:${updIndex} key:${key} flg:${flg} isAll:${isAll}`);
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

  const openAddMenuPlanForm = () => {
    setIsAddMenuPlan(true);
  };

  const openEditMenuPlanForm = (row) => {
    setEditMenuPlanId(row?.menuPlanId);
    setEditData({ menuPlanNm: row?.menuPlanNm, menuPlanNmK: row?.menuPlanNmK });
    setIsEditMenuPlan(true);
  };

  const closeMenuPlanForm = () => {
    setIsAddMenuPlan(false);
    setIsEditMenuPlan(false);
  };

  const submitAddMenuPlan = async (formData) => {
    console.log(`献立プラン追加 献立名:${formData?.menuPlanNm} 献立名(かな) ${formData?.menuPlanNmK}`);
    try {
      const response = await apiClient.post(`${Const.ROOT_URL}/menuPlan/submitAddMenuPlan`, { 
        menuPlanNm: formData?.menuPlanNm,
        menuPlanNmK: formData?.menuPlanNmK,
        userId: user?.id 
      });
      const data = await response.data;
      if (data.statusCode === 200) {
        console.log("登録成功", data);
        menuPlanListMutate([...menuPlanList, data?.newMenuPlan]);
        setIsAddMenuPlan(false);
      } else {
        throw new Error(data.message);
      };
    } catch (error) {
      console.error("登録失敗", error);
    };
  };

  const submitEditMenuPlan = async (formData) => {
    console.log(`献立プラン編集 献立ID:${editMenuPlanId} 献立名:${formData?.menuPlanNm} 献立名（かな） ${formData?.menuPlanNmK}`);
      try {
        const response = await apiClient.put(`${Const.ROOT_URL}/menuPlan/submitEditMenuPlan`, { 
          menuPlanId: editMenuPlanId,
          menuPlanNm: formData?.menuPlanNm,
          menuPlanNmK: formData?.menuPlanNmK,
          userId: user?.id 
        });
        const data = await response.data;
        if (data.statusCode === 200) {
          console.log("更新成功", data);
          menuPlanListMutate(menuPlanList?.map((menuPlan) => (
              menuPlan.menuPlanId === data.newMenuPlan.menuPlanId ? data.newMenuPlan : menuPlan
          )));
          setIsEditMenuPlan(false);
        } else {
          throw new Error(data.message);
        };
      } catch (error) {
        console.error("更新失敗", error);
      };
  };

  const submitDeleteMenuPlan = async (row) => {
    console.log("献立プラン削除", `献立ID:${row?.menuPlanId}`);
    const deleteable = window.confirm("献立プランを削除します。\n明細も含めてすべて削除されますがよろしいですか？");
    if (deleteable) {
      const queryParams = new URLSearchParams(decamelizeKeys({ menuPlanId: row?.menuPlanId })).toString();
      try {
        const response = await apiClient.delete(`${Const.ROOT_URL}/menuPlan/submitDeleteMenuPlan/query_params?${queryParams}`);
        const data = await response.data;
        if (data.statusCode === 200) {
          console.log("登録成功", data);
          menuPlanListMutate(menuPlanList?.filter((item) => (item.menuPlanId !== row?.menuPlanId)));
          closeContextMenu(switchFlgMenuPlanAcc);
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
              <th className={`header-talbe-data w-52`}>献立プラン</th>
              <th className={`header-talbe-data w-12`}>詳細</th>
            </tr>
          </thead>
          {menuPlanListDisp?.map((row, index) => (
            // フラグメントで返却するとスマホで[row?.recipeIngredVisible]を非表示に切り替えた際に
            // レイアウトが崩れるため、<tbody>で返却する
            <tbody key={row?.menuPlanId}>
              <tr 
                onContextMenu={(event) => handleContextMenu(event, index, switchFlgMenuPlanAcc)}
                onTouchStart={(event) => handleTouchStart(event, index, switchFlgMenuPlanAcc)} 
                onTouchEnd={handleTouchEnd} 
                className="detail-table-row"
              >
                <td className={`detail-table-data bg-white w-52`}>
                  {row?.menuPlanNm}
                </td>
                <td 
                  className={`detail-table-data bg-white w-12`} 
                  onClick={() => switchFlgMenuPlanAcc(index, flg.menuPlanDetVisible, !row?.menuPlanDetVisible)}
                >
                  <i className="fa-solid fa-angle-down"></i>
                </td>
                <td>
                  {row?.contextMenuVisible && (
                    <ContextMenu menuList={[
                      {textContent: "編集", onClick: () => openEditMenuPlanForm(row, index)},
                      {textContent: "削除", onClick: () => submitDeleteMenuPlan(row, index)},
                    ]} />
                  )}
                </td>
              </tr>
              {row?.menuPlanDetVisible && (<MenuPlanDet menuPlan={row}/>)}
            </tbody>
          ))}
          <tbody>
            <AddRow textContent="献立プランを追加" onClick={openAddMenuPlanForm} cssWidth="w-full"/>
          </tbody>
        </table>
        {isAddMenuPlan && (<MenuPlanForm submitAction={submitAddMenuPlan} closeMenuPlanForm={closeMenuPlanForm}/>)}
        {isEditMenuPlan && (<MenuPlanForm submitAction={submitEditMenuPlan} closeMenuPlanForm={closeMenuPlanForm} editData={editData}/>)}
      </div>    
    </div>
  );
}    
