import '../../css/styles.css';
import '../../css/output.css';

import React, { useRef, useState } from "react";

import { useKondateMaker } from "../global/global";
import { useEventHandler } from "../../hooks/useEventHandler";
import { useIngredNmSuggestions } from "../../hooks/useFetchData";

import { FormCloseButton, FormSubmitButton, OptionConstDict, SuggestionsInput } from "../global/common";


export const IngredForm = ({ submitAction, closeIngredForm, editData }) => {

  const { user, unitDict, unitDictStat, salesAreaDict, salesAreaDictStat } = useKondateMaker();

  const [ingredNm, setIngredNm] = useState(editData?.ingredNm);
  const [ingredNmK, setIngredNmK] = useState(editData?.ingredNmK);
  const [parentIngredNm, setParentIngredNm] = useState(editData?.parentIngredNm);
  const [standardUnitCd, setStandardUnitCd] = useState(editData ? editData?.standardUnitCd : Object.keys(unitDict)[0]);
  const [salesAreaType, setSalesAreaType] = useState(editData ? editData?.salesAreaType : Object.keys(salesAreaDict)[0]);
  const { ingredNmSuggestions, ingredNmSuggestionsStat } = useIngredNmSuggestions(parentIngredNm, user?.id);
  const [ingredNmSuggestionsVisible, setIngredNmSuggestionsVisible] = useState(false);
  
  const parentIngredNmRef = useRef(null);
  const ingredNmSuggestionsRef = useRef(null);

  const handleParentIngredNmChange = (e) => {
    e.preventDefault();
    setParentIngredNm(e.target.value);
    setIngredNmSuggestionsVisible(true);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    submitAction({ ingredNm, ingredNmK, parentIngredNm, standardUnitCd, salesAreaType });
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
            <label className="block text-sm text-gray-700">食材名:</label>
            <input
              type="text"
              value={ingredNm}
              onChange={(e) => setIngredNm(e.target.value)}
              className="form-input-base"
              required
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm text-gray-700">食材名（かな）:</label>
            <input
              type="text"
              value={ingredNmK}
              onChange={(e) => setIngredNmK(e.target.value)}
              className="form-input-base"
              required
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm text-gray-700">購入食材名:</label>
            <input
              type="text"
              value={parentIngredNm}
              onFocus={() => setIngredNmSuggestionsVisible(true)}
              onChange={handleParentIngredNmChange}
              className="form-input-base"
              required
            />
          </div>
          {!ingredNmSuggestionsStat?.isLoading && ingredNmSuggestionsVisible && (
            <SuggestionsInput
              suggestions={ingredNmSuggestions}
              setCallback={(suggestion) => setParentIngredNm(suggestion)}
              contentRef={parentIngredNmRef}
              suggestionsRef={ingredNmSuggestionsRef}
              setSuggestionsVisible={setIngredNmSuggestionsVisible}
            />
          )}

          <div className="mt-4">
            <label className="block text-sm text-gray-700">標準単位:</label>
            <select
              value={standardUnitCd}
              onChange={(e) => setStandardUnitCd(e.target.value)}
              className="form-input-base"
            >
              {!unitDictStat.isLoading && <OptionConstDict dict={unitDict} />}
            </select>
          </div>

          <div className="mt-4">
            <label className="block text-sm text-gray-700">売り場:</label>
            <select
              value={salesAreaType}
              onChange={(e) => setSalesAreaType(e.target.value)}
              className="form-input-base"
            >
              {!salesAreaDictStat.isLoading && <OptionConstDict dict={salesAreaDict} />}
            </select>
          </div>
          <div className="flex justify-between mt-4">
            <FormCloseButton onClick={closeIngredForm} />
            <FormSubmitButton />
          </div>
        </form>
      </div>
    </div>
  );
};
