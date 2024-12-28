import '../../css/styles.css';
import '../../css/output.css';

import React, { useCallback, useEffect, useRef, useState } from 'react';

import * as Const from '../../constants/constants.js';

import { useRecipeNmSuggestions } from '../../hooks/useFetchData.js';
import { useKondateMaker } from '../global/global.jsx';
import { useEventHandler } from '../../hooks/useEventHandler.js';

import { ContextMenu, LoadingSpinner, SuggestionsInput } from '../global/common.jsx';
import { apiClient } from '../../utils/axiosClient.js';
import { decamelizeKeys } from 'humps';


function getEditingToweekMenuPlanDet(toweekMenuPlanDetListDisp) {
  const toweekMenuPlanDet = toweekMenuPlanDetListDisp.filter((item) => item.isEditing);
  return toweekMenuPlanDet ? toweekMenuPlanDet[0] : undefined;
};

export const ToweekMenuPlanDet = ({ weekdayCd, toweekMenuPlanDetListDictDisp, toweekMenuPlanDetListDictMutate, isRefreshing }) => {

  const { 
    openContextMenu, 
    closeContextMenu, 
    touchStart, 
    touchEnd, 
    showMessage, 
    clearMessage,
    contextMenuIndex,
  } = useKondateMaker();
  const [toweekMenuPlanDetListDisp, setToweekMenuPlanDetListDisp] = useState();

  const [befRecipeNm, setBefRecipeNm] = useState("");            // 更新チェック用（編集によって値が変わった場合のみ、データ更新）
  const [recipeNmEditing, setRecipeNmEditing] = useState("");    // 対象明細の入力候補を表示するために使用
  const [isEditing, setIsEditing] = useState(false);             // 明細ごとの編集フラグ変更時にフォーカスするためのフラグ
  const recipeNmRef = useRef(null);
  const recipeNmSuggestionsRef = useRef(null);
  const { recipeNmSuggestions } = useRecipeNmSuggestions(recipeNmEditing);

  
  // 献立プラン明細リストを表示用リストにセット
  useEffect(() => {
    console.log("toweekMenuPlanDetListDictDisp", toweekMenuPlanDetListDictDisp);
    if(toweekMenuPlanDetListDictDisp) {
      setToweekMenuPlanDetListDisp(
        toweekMenuPlanDetListDictDisp[weekdayCd]?.map((item) => ({
          ...item,
          isEditing: false,
          isAlert: false,
        }))
      );
    };
  }, [toweekMenuPlanDetListDictDisp, setToweekMenuPlanDetListDisp, weekdayCd]);

  // 表示用リストで定義したフラグのスイッチング処理
  const flg = { 
    recipeNmSuggestionsVisible: "recipeNmSuggestionsVisible",
    isEditing: "isEditing",
    isAlert: "isAlert",
  };
  const switchFlgToweekMenuPlanAcc = useCallback((updIndex, key, flg, isAll=false) => {
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
  useEventHandler("click", () => closeContextMenu());
  useEventHandler("scroll", () => closeContextMenu());
  
  // 編集時に対象項目にフォーカス
  useEffect(() => {if (isEditing && recipeNmRef.current) {recipeNmRef.current.focus()}}, [isEditing]);

  const handleEditClick = (row, index) => {
    switchFlgToweekMenuPlanAcc(index, flg.isEditing, true);
    setRecipeNmEditing(row.recipeNm);    // 入力候補表示用
    setBefRecipeNm(row.recipeNm)  // 変更確認用
    setIsEditing(true);
  };

  const handleAddRecipeNmChange = (e) => {
    e.preventDefault();
    const changedRecipeNm = e.target.value;
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
  
    // 編集中ではない場合
    if (!isEditing) {
      return;
    };

    // 編集中の項目もしくは入力候補を押下した場合
    if (((recipeNmRef?.current?.contains(e.target)) || recipeNmSuggestionsRef?.current?.contains(e.target))) {
      return;
    };

    // 編集中の献立明細を取得（新規追加の場合はundifined）
    const editToweekMenuPlanDet = getEditingToweekMenuPlanDet(toweekMenuPlanDetListDisp);

    // 編集したレシピ名が入力候補に存在
    const recipeNmExists = recipeNmSuggestions?.includes(recipeNmEditing)

    // 編集したレシピ名が空白ではない場合
    if (recipeNmEditing) {
      // 編集したレシピが存在する場合
      if (recipeNmExists) {
        // 新規 or 更新
        if (editToweekMenuPlanDet) {      
          submitEditToweekMenuPlanDet(recipeNmEditing);
        } else {
          submitAddToweekMenuPlanDet(recipeNmEditing);
        };
      };
    } else {
      // 編集によって空白にした場合は既存のレシピを削除
      if(befRecipeNm) {
        submitDeleteToweekMenuPlanDet(editToweekMenuPlanDet);
      };
    };
    setToweekMenuPlanDetListDisp(
      toweekMenuPlanDetListDisp?.map((item) => ({
        ...item,
        isEditing: item.isEditing ? false : item.isEditing,
        isAlert: item.isEditing ? recipeNmEditing && !recipeNmExists : item.isAlert,
      }))
    );
    setIsEditing(false);
    setBefRecipeNm("");
  };
  useEventHandler("mousedown", handleClickOutside);

  // 入力候補押下時（編集時）
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

  // 入力候補押下時（新規登録時）
  const handleAddSuggestionClick = (suggestion) => {
    submitAddToweekMenuPlanDet(suggestion);
    setIsEditing(false);
  };


  const submitAddToweekMenuPlanDet = async (recipeNm) => {
    const addable = window.confirm("追加内容を買い物リストに反映します。\nよろしいですか？");
    if (!addable) {
      return;
    };
    clearMessage();
    console.log(`今週献立明細追加 レシピ名:${recipeNm}`);
    try {
      const response = await apiClient.post(`${Const.ROOT_URL}/home/submitAddToweekMenuPlanDet`, { 
        recipeNm: recipeNm,
        weekdayCd: weekdayCd,
      });
      const data = await response.data;
      console.log(data.message, data);
      toweekMenuPlanDetListDictMutate(data.toweekMenuPlanDetListDict);
    } catch (error) {
      showMessage(error?.response?.data?.detail || error?._messageTimeout || Const.MSG_MISSING_REQUEST, Const.MESSAGE_TYPE.ERROR);
    };
    setRecipeNmEditing("");
  };

  const submitEditToweekMenuPlanDet = async (recipeNm) => {
    if (recipeNmEditing === befRecipeNm) {
      return;
    };
    const editable = window.confirm("更新内容を買い物リストに反映します。\nよろしいですか？");
    if (!editable) {
      return;
    };
    clearMessage();
    const editMenuPlanDet = getEditingToweekMenuPlanDet(toweekMenuPlanDetListDisp);
    console.log(`今週献立明細編集 今週献立明細ID:${editMenuPlanDet.toweekMenuPlanDetId} レシピ名:${recipeNm}`);
    try {
      const response = await apiClient.put(`${Const.ROOT_URL}/home/submitEditToweekMenuPlanDet`, { 
        toweekMenuPlanDetId: editMenuPlanDet.toweekMenuPlanDetId,
        recipeNm: recipeNm,
      });
      const data = await response.data;
      console.log(data.message, data);
      toweekMenuPlanDetListDictMutate(data.toweekMenuPlanDetListDict);
    } catch (error) {
      showMessage(error?.response?.data?.detail || error?._messageTimeout || Const.MSG_MISSING_REQUEST, Const.MESSAGE_TYPE.ERROR);
    };
    setRecipeNmEditing("");
  };


  const submitDeleteToweekMenuPlanDet = async (row) => {
    const deleteable = window.confirm("献立明細を削除します。\nよろしいですか？");
    if (!deleteable) {
      return;
    };
    clearMessage();
    const queryParams = new URLSearchParams(decamelizeKeys({ toweekMenuPlanDetId: row?.toweekMenuPlanDetId })).toString();
    try {
      const response = await apiClient.delete(`${Const.ROOT_URL}/home/submitDeleteToweekMenuPlanDet/query_params?${queryParams}`);
      const data = await response.data;
      console.log(data.message, data);
      toweekMenuPlanDetListDictMutate();
    } catch (error) {
      showMessage(error?.response?.data?.detail || error?._messageTimeout || Const.MSG_MISSING_REQUEST, Const.MESSAGE_TYPE.ERROR);
    }        
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
              onContextMenu={(e) => openContextMenu(e, row?.toweekMenuPlanDetId)}
              onTouchStart={(e) => touchStart(e, row?.toweekMenuPlanDetId)} 
              onTouchEnd={touchEnd} 
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
              {row?.toweekMenuPlanDetId === contextMenuIndex && <ContextMenu menuList={[
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