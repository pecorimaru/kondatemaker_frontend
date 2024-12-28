import '../../css/styles.css';
import '../../css/output.css';

import * as Const from '../../constants/constants.js';

import React, { useEffect, useRef, useState } from "react";

import { useKondateMaker } from "../global/global";
import { useEventHandler } from "../../hooks/useEventHandler";
import { useDefaultSetsByIngred, useIngredNmSuggestions, useUnitDictByIngred } from "../../hooks/useFetchData";

import { FormCloseButton, FormSubmitButton, LoadingSpinner, OptionConstDict, Required, SuggestionsInput } from "../global/common";


export const IngredSelectForm = ({ prevScreenType, submitAction, closeIngredForm, editData }) => {

  const { salesAreaDict, salesAreaDictStat, setIsOpeningForm } = useKondateMaker();

  const [ingredNm, setIngredNm] = useState(editData?.ingredNm);
  const [qty, setQty] = useState(editData?.qty);
  const { unitDictByIngred, unitDictByIngredStat } = useUnitDictByIngred(ingredNm ?? "");
  const [unitCd, setUnitCd] = useState(editData ? editData?.unitCd : !unitDictByIngredStat.isLoading && Object.keys(unitDictByIngred)[0]);
  const [salesAreaType, setSalesAreaType] = useState(editData ? editData?.salesAreaType : Object.keys(salesAreaDict)[0]);

  const { defaultSetsByIngred, defaultSetsByIngredStat } = useDefaultSetsByIngred(ingredNm);
  const { ingredNmSuggestions, ingredNmSuggestionsStat } = useIngredNmSuggestions(ingredNm);
  const [ingredNmSuggestionsVisible, setIngredNmSuggestionsVisible] = useState(false);
  const [isRegisterContinue, setIsRegisterContinue] = useState(false);
  
  const ingredNmRef = useRef(null);
  const ingredNmSuggestionsRef = useRef(null);

  // 食材名以外の項目を変更してもデフォルト値更新の処理が動作してしまうため、フラグで管理
  const [isIngredNmChanged, setIsIngredNmChanged] = useState(false);

  useEffect(() => {setIsOpeningForm(true)}, []);

  // 食材名を変更した場合に単位と売り場の初期値を更新
  useEffect(() => {
    if(!defaultSetsByIngredStat.isLoading) {
      if(isIngredNmChanged) {
        if(defaultSetsByIngred?.unitCd) {
          setUnitCd(defaultSetsByIngred?.unitCd);
        };
        if(defaultSetsByIngred?.salesAreaType) {
          setSalesAreaType(defaultSetsByIngred?.salesAreaType);
        };
        setIsIngredNmChanged(false);
      };
    };
  }, [defaultSetsByIngred, defaultSetsByIngredStat, isIngredNmChanged]);

  const clearForm = () => {
    setIngredNm("");
    setQty("");
    setUnitCd(Object.keys(unitDictByIngred)[0]);
    setSalesAreaType(Object.keys(salesAreaDict)[0]);
  }

  const handleIngredNmChange = (e) => {
    e.preventDefault();
    setIngredNm(e.target.value);
    setIsIngredNmChanged(true);
    setIngredNmSuggestionsVisible(true);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("isRegisterContinue", isRegisterContinue)
    submitAction({ ingredNm, qty, unitCd, salesAreaType, isRegisterContinue }, clearForm);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      if (ingredNmSuggestionsVisible) {
        setIngredNmSuggestionsVisible(false);
      } else {
        closeIngredForm();
      };
    };
  };
  useEventHandler("keydown", handleKeyDown)
  
  return (
    <div 
      className="form-bg-layout-base"
    >
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <form onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm text-gray-700">食材名<Required/></label>
            <input
              type="text"
              value={ingredNm}
              onChange={handleIngredNmChange}
              onFocus={() => setIngredNmSuggestionsVisible(true)}
              className="form-input-base"
              required
              ref={ingredNmRef}
            />
          </div>
          {!ingredNmSuggestionsStat?.isLoading && ingredNmSuggestionsVisible && (
            <SuggestionsInput
              suggestions={ingredNmSuggestions}
              setCallback={(suggestion) => setIngredNm(suggestion)}
              setIsContentChanged={setIsIngredNmChanged}
              contentRef={ingredNmRef}
              suggestionsRef={ingredNmSuggestionsRef}
              setSuggestionsVisible={setIngredNmSuggestionsVisible}
            />
          )}

          <div className="mt-4">
            <label className="block text-sm text-gray-700">
              必要量{prevScreenType === Const.PREV_SCREEN_TYPE.RECIPE_INGRED && <Required />}
            </label>
            <input
              type="number"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              className="form-input-base"
              step="0.1"
              required={prevScreenType === Const.PREV_SCREEN_TYPE.RECIPE_INGRED ? true : false}
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm text-gray-700">
              単位{prevScreenType === Const.PREV_SCREEN_TYPE.RECIPE_INGRED && <Required />}
            </label>
            {!unitDictByIngredStat.isLoading ?
              <select
                value={unitCd}
                onChange={(e) => setUnitCd(e.target.value)}
                className="form-input-base"
                required={prevScreenType === Const.PREV_SCREEN_TYPE.RECIPE_INGRED ? true : false}
              >
                <OptionConstDict dict={unitDictByIngred}/>
              </select>
            :
              <div className="form-input-base">
                <LoadingSpinner />
              </div>
            }
          </div>

          <div className="mt-4">
            <label className="block text-sm text-gray-700">売り場</label>
            <select
              value={salesAreaType}
              onChange={(e) => setSalesAreaType(e.target.value)}
              className={`form-input-base ${prevScreenType === Const.PREV_SCREEN_TYPE.RECIPE_INGRED && "bg-slate-200 text-slate-900"}`}
              disabled={prevScreenType === Const.PREV_SCREEN_TYPE.RECIPE_INGRED}
            >
              {!salesAreaDictStat.isLoading && <OptionConstDict dict={salesAreaDict} />}
            </select>
          </div>

          {editData === undefined &&
            <div className="mt-4">
              <label className="text-md text-gray-700">
                <input
                  type="checkbox"
                  checked={isRegisterContinue}
                  onChange={() => setIsRegisterContinue(!isRegisterContinue)}
                />
                <span className="ml-2">続けて登録</span>
              </label>
            </div>
          }

          <div className="flex justify-between mt-8">
            <FormCloseButton onClick={closeIngredForm} />
            <FormSubmitButton />
          </div>
        </form>
      </div>
    </div>
  );
};
