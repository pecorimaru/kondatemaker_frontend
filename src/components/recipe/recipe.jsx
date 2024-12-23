import '../../css/styles.css';
import '../../css/output.css';

import React, { useCallback, useEffect, useState } from "react";
import { decamelizeKeys } from 'humps';
import { FaAngleDown } from "react-icons/fa6";

import * as Const from '../../constants/constants.js';

import { useKondateMaker } from '../global/global.jsx';
import { useRecipeList } from '../../hooks/useFetchData.js';
import { useEventHandler } from '../../hooks/useEventHandler.js';

import { RecipeIngred } from "./recipeIngred.jsx";
import { RecipeForm } from '../form/recipeForm.jsx';
import { AddRow, ContextMenu, LoadingSpinner, TBodyLoading } from '../global/common.jsx';
import { apiClient } from '../../utils/axiosClient.js';


export const Recipe = () => {

  const { 
    recipeTypeDict, 
    recipeTypeDictStat, 
    handleContextMenu, 
    touchStart, 
    touchEnd, 
    closeContextMenu, 
    showMessage, 
    clearMessage,
    setIsOpeningForm, 
  } = useKondateMaker();

  const { recipeList, recipeListStat, recipeListMutate } = useRecipeList();
  const [recipeListDisp, setRecipeListDisp] = useState();
  const [isAddRecipe, setIsAddRecipe] = useState(false);
  const [isEditRecipe, setIsEditRecipe] = useState(false);
  const [editRecipeId, setEditRecipeId] = useState();
  const [editData, setEditData] = useState({ recipeNm: null, recipeNmK: null, recipeType: null, recipeUrl: null });
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [applyHovered, setApplyHovered] = useState(false);

  // データフェッチしたレシピリストを表示用リストにセット
  // ・各画面で同一のキー[contextMenuVisible]を利用することでコンテキストメニューのオープン/クローズ処理を共通化
  useEffect(() => {
    if (!recipeListStat.isLoading) {
      setRecipeListDisp(
        recipeList
        ?.map((item) => ({
          ...item,
          contextMenuVisible: false,
          recipeIngredVisible: null,  // 初期表示でアニメーションを実行させないためにnullをセット
        }))
      );
    };
  }, [recipeList, recipeListStat.isLoading]);

  // 表示用リストで定義したフラグのスイッチング処理
  const flg = { recipeIngredVisible: "recipeIngredVisible"};
  const switchFlgRecipeAcc = useCallback((updIndex, key, flg, isAll=false) => {
    if (recipeList && recipeListDisp) {
      setRecipeListDisp(
        recipeListDisp?.map((item, index) => ({
          ...item,
          [key]: isAll || index === updIndex ? flg : recipeListDisp[index]?.[key],
        }))
      );    
    };
  }, [recipeList, recipeListDisp, setRecipeListDisp]);

  // 画面クリック or スクロールでコンテキストメニューをクローズ
  useEventHandler("click", () => closeContextMenu(switchFlgRecipeAcc));
  useEventHandler("scroll", () => closeContextMenu(switchFlgRecipeAcc));

  const handleTouchStart = (e, index) => {
    if (index === hoveredIndex) {
      setApplyHovered(!applyHovered);
    } else {
      setHoveredIndex(index);
      setApplyHovered(true);
    };
    touchStart(e, index, switchFlgRecipeAcc);
  }

  const handleTouchEnd = (index) => {
    if (recipeListDisp[index]?.["contextMenuVisible"]) {setApplyHovered(true)};
    touchEnd();
  };

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
    setApplyHovered(true)
  }

  const openAddRecipeForm = () => {
    setIsAddRecipe(true);
  };

  const openEditRecipeForm = (row) => {
    setApplyHovered(false);
    setEditRecipeId(row?.recipeId);
    setEditData({ recipeNm: row?.recipeNm, recipeNmK: row?.recipeNmK, recipeType: row?.recipeType, recipeUrl: row?.recipeUrl });
    setIsEditRecipe(true);
  };

  const closeRecipeForm = () => {
    setIsAddRecipe(false);
    setIsEditRecipe(false);
    setIsOpeningForm(false);
  };

  const submitAddRecipe = async (formData) => {
    clearMessage();
    console.log(`レシピ追加 レシピ名:${formData?.recipeNm} レシピ名（かな）${formData?.recipeNmK} レシピ種別:${formData?.recipeType} レシピURL:${formData?.recipeUrl}`);
    try {
      const response = await apiClient.post(`${Const.ROOT_URL}/recipe/submitAddRecipe`, { 
        recipeNm: formData?.recipeNm,
        recipeNmK: formData?.recipeNmK,
        recipeType: formData?.recipeType, 
        recipeUrl: formData?.recipeUrl, 
      });
      const data = await response.data;
      console.log(data.message, data);
      recipeListMutate([...recipeList, data.newRecipe]);
      setIsAddRecipe(false);
    } catch (error) {
      showMessage(error?.response?.data?.detail || error?._messageTimeout || Const.MSG_MISSING_REQUEST, Const.MESSAGE_TYPE.ERROR);
    };
  };

  const submitEditRecipe = async (formData) => {
    clearMessage();
    console.log(`レシピ更新 レシピ名:${formData?.recipeNm} レシピ名（かな）${formData?.recipeNmK} レシピ種別:${formData?.recipeType} レシピURL:${formData?.recipeUrl}`);
    try {
      const response = await apiClient.put(`${Const.ROOT_URL}/recipe/submitEditRecipe`, { 
        recipeId: editRecipeId,
        recipeNm: formData?.recipeNm,
        recipeNmK: formData?.recipeNmK,
        recipeType: formData?.recipeType, 
        recipeUrl: formData?.recipeUrl, 
      });
      const data = await response.data;
      console.log(data.message, data);
      recipeListMutate(recipeList?.map((item) => (
        item.recipeId === data.newRecipe.recipeId ? data.newRecipe : item
      )));
      setIsEditRecipe(false);
    } catch (error) {
      showMessage(error?.response?.data?.detail || error?._messageTimeout || Const.MSG_MISSING_REQUEST, Const.MESSAGE_TYPE.ERROR);
    };
  };

  const submitDeleteRecipe = async (row) => {
    clearMessage();
    const deleteable = window.confirm("レシピを削除します。\nよろしいですか？");
    if (!deleteable) {
      return;
    }
    const queryParams = new URLSearchParams(decamelizeKeys({ recipeId: row?.recipeId })).toString();
    try {
      const response = await apiClient.delete(`${Const.ROOT_URL}/recipe/submitDeleteRecipe/queryParams?${queryParams}`);
      const data = await response.data;
      console.log(data.message, data);
      recipeListMutate(recipeList?.filter((item) => (item.recipeId !== row?.recipeId)));
      closeContextMenu(switchFlgRecipeAcc);
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
              <th className="header-talbe-data w-56">レシピ</th>
              <th className="header-talbe-data w-16">分類</th>
              <th className="header-talbe-data w-12">食材</th>
            </tr>
          </thead>
          {!recipeListStat.isLoading ? 
            <>
              {recipeListDisp?.map((row, index) => (
                // フラグメントで返却するとスマホで[row?.recipeIngredVisible]を非表示に切り替えた際に
                // レイアウトが崩れるため、<tbody>で返却する
                <tbody key={row?.recipeId}>
                  <tr  
                    onContextMenu={(e) => handleContextMenu(e, index, switchFlgRecipeAcc)}
                    onTouchStart={(e) => handleTouchStart(e, index)} 
                    onTouchEnd={() => handleTouchEnd(index)} 
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={() => setApplyHovered(false)}
                    className={`detail-table-row ${(applyHovered && index === hoveredIndex) && "group"}`}
                  >
                    <td 
                      className="detail-table-data bg-white w-56 group-hover:bg-blue-100"
                    >
                      <span 
                        onClick={row?.recipeUrl ? () => window.open(row?.recipeUrl, '_blank') : null}
                        className={`${!row?.recipeUrl ? "text-slate-700" : "text-blue-500 underline cursor-pointer"}`}
                      >
                        {row.recipeNm}
                      </span>
                    </td>
                    <td className="detail-table-data bg-white w-16 group-hover:bg-blue-100">
                      {!recipeTypeDictStat.isLoading ? recipeTypeDict[row?.recipeType] : <LoadingSpinner />}
                      {/* 個別にtdタグで配置すると[detail-table-row]定義した[gap-1]によって余分な間隔が発生するため
                          onClickイベントが無いtdタグに混在させることで回避。 */}
                      {row?.contextMenuVisible && 
                        <ContextMenu menuList={[
                          {textContent: "編集", onClick: () => openEditRecipeForm(row, index)},
                          {textContent: "削除", onClick: () => submitDeleteRecipe(row, index)},
                        ]} />
                      }
                    </td>
                    <td 
                      className="detail-table-data bg-white w-12 group-hover:bg-blue-100"
                      onClick={() => switchFlgRecipeAcc(index, flg.recipeIngredVisible, !row?.recipeIngredVisible)}
                    >
                      <FaAngleDown className={`${row?.recipeIngredVisible !== null && (row?.recipeIngredVisible ? "animate-arrowRotateIn" : "animate-arrowRotateOut")}`}/>
                    </td>
                  </tr>
                  <RecipeIngred recipe={row} />
                    {/* {row?.recipeIngredVisible && <RecipeIngred recipe={row} />} */}
                </tbody>
              ))}
              <tbody>
                <AddRow textContent="レシピを追加" onClick={openAddRecipeForm} cssWidth="w-full" />
              </tbody>
            </>
          :
            <TBodyLoading />
          }
        </table>
        {isAddRecipe && <RecipeForm submitAction={submitAddRecipe} closeRecipeForm={closeRecipeForm} />}
        {isEditRecipe && <RecipeForm submitAction={submitEditRecipe} closeRecipeForm={closeRecipeForm} editData={editData} />}
      </div>    
    </div>
  );
};  
