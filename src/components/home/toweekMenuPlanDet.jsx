import '../../css/styles.css';
import '../../css/output.css';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';

import * as Const from '../../constants/constants.js';

import { useRecipeNmSuggestions } from '../../hooks/useFetchData.js';
import { useKondateMaker } from '../global/global.jsx';
import { useEventHandler, useOnClick, useOnScroll } from '../../hooks/useEventHandler.js';

import { ContextMenu, LoadingSpinner, SuggestionsInput } from '../global/common.jsx';
import { apiClient } from '../../utils/axiosClient.js';
import { decamelizeKeys } from 'humps';


function getEditingToweekMenuPlanDet(toweekMenuPlanDetListDisp) {
  const toweekMenuPlanDet = toweekMenuPlanDetListDisp.filter((item) => item.isEditing == true);
  return toweekMenuPlanDet ? toweekMenuPlanDet[0] : undefined;
};

export const ToweekMenuPlanDet = ({ weekdayCd, toweekMenuPlanDetListDictDisp, toweekMenuPlanDetListDictMutate, isRefreshing }) => {

  const { user, handleContextMenu, handleTouchStart, handleTouchEnd, closeContextMenu } = useKondateMaker();
  const [toweekMenuPlanDetListDisp, setToweekMenuPlanDetListDisp] = useState();

  const [recipeNm, setRecipeNm] = useState("")                   // 未定時の値セット用
  const [befRecipeNm, setBefRecipeNm] = useState("");            // 更新チェック用（編集によって値が変わった場合のみ、データ更新）
  const [recipeNmEditing, setRecipeNmEditing] = useState("");    // 対象明細の入力候補を表示するために使用
  const [isEditing, setIsEditing] = useState(false);             // 明細ごとの編集フラグ変更時にフォーカスするためのフラグ
  const recipeNmRef = useRef(null);
  const recipeNmSuggestionsRef = useRef(null);

  const { recipeNmSuggestions, recipeNmSuggestionsStat } = useRecipeNmSuggestions(recipeNmEditing, user?.id);

  
  // 献立プラン明細リストを表示用リストにセット
  // ・各画面で同一のキー[contextMenuVisible]を利用することでコンテキストメニューのオープン/クローズ処理を共通化
  useEffect(() => {
    if(toweekMenuPlanDetListDictDisp) {
      setToweekMenuPlanDetListDisp(
        toweekMenuPlanDetListDictDisp[weekdayCd]?.map((item) => ({
          ...item,
          contextMenuVisible: false,
          isEditing: false,
          isAlert: false,
        }))
      );
    };
  }, [toweekMenuPlanDetListDictDisp, setToweekMenuPlanDetListDisp]);

  // 表示用リストで定義したフラグのスイッチング処理
  const flg = { 
    recipeNmSuggestionsVisible: "recipeNmSuggestionsVisible",
    isEditing: "isEditing",
    isAlert: "isAlert",
  };
  const switchFlgToweekMenuPlanAcc = useCallback((updIndex, key, flg, isAll=false) => {
    // console.log(`updIndex:${updIndex} key:${key} flg:${flg} isAll:${isAll}`);
    if (toweekMenuPlanDetListDictDisp && toweekMenuPlanDetListDisp) {
      setToweekMenuPlanDetListDisp(
        toweekMenuPlanDetListDisp?.map((item, index) => ({
          ...item,
          [key]: isAll || index === updIndex ? flg : toweekMenuPlanDetListDisp[index]?.[key],
        }))
      );    
    };
  }, [toweekMenuPlanDetListDictDisp, toweekMenuPlanDetListDisp, setToweekMenuPlanDetListDisp]);
  
  // 画面クリック or スクロールでコンテキストメニューをクローズ
  useOnClick(() => closeContextMenu(switchFlgToweekMenuPlanAcc));
  useOnScroll(() => closeContextMenu(switchFlgToweekMenuPlanAcc));
  
  // 編集時に対象項目にフォーカス
  useEffect(() => {
    if (isEditing && recipeNmRef.current) {
      recipeNmRef.current.focus();
    };
  }, [isEditing]);

  const handleEditClick = (row, index) => {
    switchFlgToweekMenuPlanAcc(index, flg.isEditing, true);
    setRecipeNmEditing(row.recipeNm);    // 入力候補表示用
    setBefRecipeNm(row.recipeNm)  // 変更確認用
    setIsEditing(true);
  };

  const handleAddRecipeNmChange = (e) => {
    e.preventDefault();
    const changedRecipeNm = e.target.value;
    // setRecipeNm(changedRecipeNm)
    setRecipeNmEditing(changedRecipeNm);    
  };

  const handleEditRecipeNmChange = (e, row) => {
    e.preventDefault();
    const changedRecipeNm = e.target.value;
    setRecipeNmEditing(changedRecipeNm);    
    setToweekMenuPlanDetListDisp(
      toweekMenuPlanDetListDisp?.map((item) => ({
        ...item,
        recipeNm: item?.recipeId === row?.recipeId ? e.target.value : item?.recipeNm
      }))
    );
  };

  // 入力候補 or 対象項目以外を押下した場合に入力候補エリアを非表示
  const handleClickOutside = (e) => {
  
    if (!isEditing) {
      return;
    };

    if ((recipeNmSuggestionsRef?.current?.contains(e.target)) || (recipeNmRef?.current?.contains(e.target))) {
      return;
    };

    const editToweekMenuPlanDet = getEditingToweekMenuPlanDet(toweekMenuPlanDetListDisp);
    const recipeNmExist = recipeNmSuggestions?.includes(recipeNmEditing)

    if (recipeNmEditing) {
      if (recipeNmExist) {
        if (editToweekMenuPlanDet) {      
          submitEditToweekMenuPlanDet(recipeNmEditing);
        } else {
          submitAddToweekMenuPlanDet(recipeNmEditing);
        };
      };
    } else {
      if(befRecipeNm) {
        submitDeleteToweekMenuPlanDet(editToweekMenuPlanDet);
      };
    };
    setToweekMenuPlanDetListDisp(
      toweekMenuPlanDetListDisp?.map((item) => ({
        ...item,
        isEditing: item.isEditing ? false : item.isEditing,
        isAlert: item.isEditing ? recipeNmEditing && !recipeNmExist : item.isAlert,
      }))
    );
    setIsEditing(false);
    setBefRecipeNm("");
  };
  useEventHandler("mousedown", handleClickOutside);


  const handleEditSuggestionClick = (suggestion, row) => {
    submitEditToweekMenuPlanDet(suggestion);
    // 一度に複数の要素を更新するため、switchFlgToweekMenuPlanAccは使用しない
    setToweekMenuPlanDetListDisp(
      toweekMenuPlanDetListDisp?.map((item) => ({
        ...item,
        recipeNm: item?.recipeId === row?.recipeId ? suggestion : item?.recipeNm,
        isEditing: item?.recipeId === row?.recipeId ? false : item?.isEditing,
        isAlert: item?.isEditing ? false : item?.isAlert,
      }))
    );
    setIsEditing(false);
    setBefRecipeNm("");
  };

  const handleAddSuggestionClick = (suggestion) => {
    submitAddToweekMenuPlanDet(suggestion);
    setIsEditing(false);
  };


  const submitAddToweekMenuPlanDet = async (recipeNm) => {

    const addable = window.confirm("追加内容を買い物リストに反映します。\nよろしいですか？");
    if (!addable) {
      return;
    };

    console.log(`今週献立明細追加 レシピ名:${recipeNm}`);
    try {
      const response = await apiClient.post(`${Const.ROOT_URL}/home/submitAddToweekMenuPlanDet`, { 
        recipeNm: recipeNm,
        weekdayCd: weekdayCd,
        userId: user?.id 
      });
      const data = await response.data;
      if (data.statusCode === 200) {
        console.log("更新成功", data);
      } else {
        throw new Error(data.message);
      };
    } catch (error) {
      console.error("更新失敗", error);
    };
    setRecipeNmEditing("");
  };

  const submitEditToweekMenuPlanDet = async (recipeNm) => {

    if (recipeNmEditing === befRecipeNm) {
      return;
    }

    const editable = window.confirm("更新内容を買い物リストに反映します。\nよろしいですか？");
    if (!editable) {
      return;
    };

    const editMenuPlanDet = getEditingToweekMenuPlanDet(toweekMenuPlanDetListDisp);
    console.log(`今週献立明細編集 今週献立明細ID:${editMenuPlanDet.toweekMenuPlanDetId} レシピ名:${recipeNm}`);
    try {
      const response = await apiClient.put(`${Const.ROOT_URL}/home/submitEditToweekMenuPlanDet`, { 
        toweekMenuPlanDetId: editMenuPlanDet.toweekMenuPlanDetId,
        recipeNm: recipeNm,
        userId: user?.id 
      });
      const data = await response.data;
      if (data.statusCode === 200) {
        console.log("更新成功", data);
      } else {
        throw new Error(data.message);
      };
    } catch (error) {
      console.error("更新失敗", error);
    };
    setRecipeNmEditing("");
  };


  const submitDeleteToweekMenuPlanDet = async (row) => {

    const deleteable = window.confirm("献立明細を削除します。\nよろしいですか？");
    if (!deleteable) {
      return;
    };

    const queryParams = new URLSearchParams(decamelizeKeys({ toweekMenuPlanDetId: row?.toweekMenuPlanDetId, userId: user?.id })).toString();
    try {
      const response = await apiClient.delete(`${Const.ROOT_URL}/home/submitDeleteToweekMenuPlanDet/query_params?${queryParams}`);
      const data = await response.data;
      if (data.statusCode === 200) {
        console.log("削除成功", data);
        toweekMenuPlanDetListDictMutate();
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("削除失敗", error);
    }        
    closeContextMenu(switchFlgToweekMenuPlanAcc);
    setRecipeNmEditing("");
  };

  if (!toweekMenuPlanDetListDictDisp) {
    return;
  };
  
  return (
    <>
      <tr className="flex justify-center gap-1.5 mt-1.5 text-base">
        <td className={`flex items-center justify-center text-slate-700 px-2 py-2 shadow-md w-28 rounded-sm ${Const.DAYWISE_ITEMS[weekdayCd]?.bgColor}`}>
          {Const.DAYWISE_ITEMS[weekdayCd]?.weekday}
        </td>
        <td>
          {isRefreshing || toweekMenuPlanDetListDisp?.length <= 0 ? 
            <>
              {isRefreshing ? 
                <div className="weekday-recipe-data-base">
                  <LoadingSpinner />
                </div>
              :
                <div>
                  <input
                    type="text"
                    id="recipeNm"
                    value={recipeNmEditing}
                    className="weekday-recipe-data-base"
                    onClick={() => setIsEditing(true)}
                    onChange={(e) => handleAddRecipeNmChange(e)}
                    placeholder="未定"
                    ref={recipeNmRef}
                  />  
                  {recipeNmSuggestions?.length > 0 &&
                    <SuggestionsInput
                      suggestions={recipeNmSuggestions}
                      setCallback={(suggestions) => handleAddSuggestionClick(suggestions)}
                      contentRef={recipeNmRef}
                      suggestionsRef={recipeNmSuggestionsRef}
                    />
                  }
                </div> 
              }
            </>
          : toweekMenuPlanDetListDisp?.map((row, index) => (
            <div 
              key={index} 
              className={`bg-white ${index > 0 && "mt-1.5"}`}  // １つの曜日に複数のレシピがある場合のみ、mt-1.5を指定
              onContextMenu={(e) => handleContextMenu(e, index, switchFlgToweekMenuPlanAcc)}
              onTouchStart={(e) => handleTouchStart(e, index, switchFlgToweekMenuPlanAcc)} 
              onTouchEnd={handleTouchEnd} 
            >
              {row?.isEditing ?
                <>
                  <input
                    type="text"
                    id="recipeNm"
                    value={row?.recipeNm}
                    onChange={(e) => handleEditRecipeNmChange(e, row)}
                    className="weekday-recipe-data-base"
                    placeholder="未定"
                    ref={recipeNmRef}
                  />
                  {recipeNmSuggestions?.length > 0 &&
                    <SuggestionsInput
                      suggestions={recipeNmSuggestions}
                      setCallback={(suggestions) => handleEditSuggestionClick(suggestions, row)}
                      contentRef={recipeNmRef}
                      suggestionsRef={recipeNmSuggestionsRef}
                    />
                  }
                </>
              :
                <div
                  onClick={row?.recipeUrl ? () => window.open(row?.recipeUrl, '_blank') : null}
                  id="recipeNm"
                  className={
                    `weekday-recipe-data-base 
                    ${!row?.recipeNm ? "text-gray-400" : !row?.recipeUrl ? "text-slate-700" : "text-blue-500 underline cursor-pointer "}
                    ${row?.isAlert && "bg-red-100 "} `}
                >
                  {row?.recipeNm ? row?.recipeNm : "未定"}
                </div>
              }
              {row?.contextMenuVisible && <ContextMenu menuList={[
                { textContent: "編集", onClick: () => handleEditClick(row, index) },
                { textContent: "削除", onClick: () => submitDeleteToweekMenuPlanDet(row) },
              ]} />}
            </div>
          ))}
        </td>
      </tr>
    </>
  );
};