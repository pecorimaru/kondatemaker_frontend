import '../../css/styles.css';
import '../../css/output.css';

import React, { useCallback, useEffect, useState } from "react";
import { decamelizeKeys } from 'humps';

import * as Const from '../../constants/constants.js';

import { useKondateMaker } from '../global/global.jsx';
import { useRecipeList } from '../../hooks/useFetchData.js';
import { useOnClick, useOnScroll } from '../../hooks/useEventHandler.js';

import { RecipeIngred } from "./recipeIngred.jsx";
import { RecipeForm } from '../form/recipeForm.jsx';
import { AddRow, ContextMenu, LoadingSpinner } from '../global/common.jsx';
import { apiClient } from '../../utils/axiosClient.js';


export const Recipe = () => {

  const { user, recipeTypeDict, recipeTypeDictStat, handleContextMenu, handleTouchStart, handleTouchEnd, closeContextMenu } = useKondateMaker();
  const { recipeList, recipeListStat, recipeListMutate } = useRecipeList(user?.id);
  
  const [recipeListDisp, setRecipeListDisp] = useState();
  const [isAddRecipe, setIsAddRecipe] = useState(false);
  const [isEditRecipe, setIsEditRecipe] = useState(false);
  const [editRecipeId, setEditRecipeId] = useState();
  const [editData, setEditData] = useState({ recipeNm: null, recipeNmK: null, recipeType: null, recipeUrl: null });

  // データフェッチしたレシピリストを表示用リストにセット
  // ・各画面で同一のキー[contextMenuVisible]を利用することでコンテキストメニューのオープン/クローズ処理を共通化
  useEffect(() => {
    if (!recipeListStat.isLoading) {
      setRecipeListDisp(
        recipeList
        ?.map((item) => ({
          ...item,
          contextMenuVisible: false,
          recipeIngredVisible: false,
        }))
      )
    };
  }, [recipeList, recipeListStat.isLoading]);

  // 表示用リストで定義したフラグのスイッチング処理
  const flg = { recipeIngredVisible: "recipeIngredVisible"};
  const switchFlgRecipeAcc = useCallback((updIndex, key, flg, isAll=false) => {
    // console.log(`updIndex:${updIndex} key:${key} flg:${flg} isAll:${isAll}`);
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
  useOnClick(() => closeContextMenu(switchFlgRecipeAcc));
  useOnScroll(() => closeContextMenu(switchFlgRecipeAcc));

  const openAddRecipeForm = () => {
    setIsAddRecipe(true);
  };

  const openEditRecipeForm = (row) => {
    setEditRecipeId(row?.recipeId);
    setEditData({ recipeNm: row?.recipeNm, recipeNmK: row?.recipeNmK, recipeType: row?.recipeType, recipeUrl: row?.recipeUrl });
    setIsEditRecipe(true);
  };

  const closeRecipeForm = () => {
    setIsAddRecipe(false);
    setIsEditRecipe(false);
  };

  const submitAddRecipe = async (formData) => {
    console.log(`レシピ追加 レシピ名:${formData?.recipeNm} レシピ名（かな）${formData?.recipeNmK} レシピ種別:${formData?.recipeType} レシピURL:${formData?.recipeUrl}`);
    try {
      const response = await apiClient.post(`${Const.ROOT_URL}/recipe/submitAddRecipe`, { 
        recipeNm: formData?.recipeNm,
        recipeNmK: formData?.recipeNmK,
        recipeType: formData?.recipeType, 
        recipeUrl: formData?.recipeUrl, 
        userId: user?.id 
      });
      const data = await response.data;
      if (data.statusCode === 200) {
        console.log("登録成功", data);
        recipeListMutate([...recipeList, data.newRecipe]);
        setIsAddRecipe(false);
      } else {
        throw new Error(data.message);
      };
    } catch (error) {
      console.error("登録失敗", error);
    };
  };

  const submitEditRecipe = async (formData) => {
    console.log(`レシピ更新 レシピ名:${formData?.recipeNm} レシピ名（かな）${formData?.recipeNmK} レシピ種別:${formData?.recipeType} レシピURL:${formData?.recipeUrl}`);
    try {
      const response = await apiClient.put(`${Const.ROOT_URL}/recipe/submitEditRecipe`, { 
        recipeId: editRecipeId,
        recipeNm: formData?.recipeNm,
        recipeNmK: formData?.recipeNmK,
        recipeType: formData?.recipeType, 
        recipeUrl: formData?.recipeUrl, 
        user_id: user?.id
      });
      const data = await response.data;
      if (data.statusCode === 200) {
        console.log("更新成功", data);
        recipeListMutate(recipeList?.map((item) => (
          item.recipeId === data.newRecipe.recipeId ? data.newRecipe : item
        )));
        setIsEditRecipe(false);
      } else {
        throw new Error(data.message);
      };
    } catch (error) {
      console.error("登録失敗", error);
    };
  };

  const submitDeleteRecipe = async (row) => {
    const deleteable = window.confirm("レシピを削除します。\nよろしいですか？");
    if (deleteable) {
      const queryParams = new URLSearchParams(decamelizeKeys({ recipeId: row?.recipeId, userId: user?.id })).toString();
      try {
        const response = await apiClient.delete(`${Const.ROOT_URL}/recipe/submitDeleteRecipe/queryParams?${queryParams}`);
        const data = await response.data;
        if (data.statusCode === 200) {
          console.log("削除成功", data);
          recipeListMutate(recipeList?.filter((item) => (item.recipeId !== row?.recipeId)));
          closeContextMenu(switchFlgRecipeAcc);
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
            <tr className="header-table-row">
              <th className="header-talbe-data w-56">レシピ</th>
              <th className="header-talbe-data w-16">分類</th>
              <th className="header-talbe-data w-12">食材</th>
            </tr>
          </thead>
          {recipeListDisp?.map((row, index) => (
            // フラグメントで返却するとスマホで[row?.recipeIngredVisible]を非表示に切り替えた際に
            // レイアウトが崩れるため、<tbody>で返却する
            <tbody key={row?.recipeId}>
              <tr  
                onContextMenu={(event) => handleContextMenu(event, index, switchFlgRecipeAcc)}
                onTouchStart={(event) => handleTouchStart(event, index, switchFlgRecipeAcc)} 
                onTouchEnd={handleTouchEnd} 
                className="detail-table-row"
              >
                <td 
                  onClick={row?.recipeUrl ? () => window.open(row?.recipeUrl, '_blank') : null}
                  className={`detail-table-data bg-white w-56 ${!row?.recipeUrl ? "text-slate-700" : "text-blue-500 underline cursor-pointer "}`}
                >
                  {row.recipeNm}
                </td>
                <td className="detail-table-data bg-white w-16">
                  {!recipeTypeDictStat.isLoading ? recipeTypeDict[row?.recipeType] : <LoadingSpinner />}
                </td>
                <td className="detail-table-data bg-white w-12"
                  onClick={() => switchFlgRecipeAcc(index, flg.recipeIngredVisible, !row?.recipeIngredVisible)}
                >
                  <i className="fa-solid fa-angle-down"></i>

                  {/* gap-1 によって間隔が作られてしまうため最後の<td>タグエリアを間借りする */}
                  {row?.contextMenuVisible && 
                    <ContextMenu menuList={[
                      {textContent: "編集", onClick: () => openEditRecipeForm(row, index)},
                      {textContent: "削除", onClick: () => submitDeleteRecipe(row, index)},
                    ]} />
                  }
                </td>
              </tr>
              {row?.recipeIngredVisible && <RecipeIngred recipe={row} />}
            </tbody>
          ))}
          <tbody>
            <AddRow textContent="レシピを追加" onClick={openAddRecipeForm} cssWidth="w-full" />
          </tbody>
        </table>
        {isAddRecipe && <RecipeForm submitAction={submitAddRecipe} closeRecipeForm={closeRecipeForm} />}
        {isEditRecipe && <RecipeForm submitAction={submitEditRecipe} closeRecipeForm={closeRecipeForm} editData={editData} />}
      </div>    
    </div>
  );
};  
