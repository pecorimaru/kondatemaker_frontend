import React, { useEffect, useRef, useState } from "react";

import { useKondateMaker } from "../global/global";
import { useRecipeNmSuggestions } from "../../hooks/useFetchData";
import { FormCloseButton, FormSubmitButton, OptionConstDict, Required, SuggestionsInput } from "../global/common";

export const MenuPlanDetForm = ({ submitAction, closeMenuPlanDetForm, editData }) => {
  
  const { weekdayDict, weekdayDictStat, setIsOpeningForm } = useKondateMaker()

  const [weekdayCd, setWeekdayCd] = useState(editData ? editData?.weekdayCd : Object.keys(weekdayDict)[0]);
  const [recipeNm, setRecipeNm] = useState(editData?.recipeNm);

  const { recipeNmSuggestions, recipeNmSuggestionsStat } = useRecipeNmSuggestions(recipeNm);
  const [recipeNmSuggestionsVisible, setRecipeNmSuggestionsVisible] = useState(false);
  const recipeNmRef = useRef(null);
  const recipeNmSuggestionsRef = useRef(null);

  useEffect(() => {setIsOpeningForm(true)}, []);

  const handleRecipeNmChange = (e) => {
    e.preventDefault();
    setRecipeNm(e.target.value);
    setRecipeNmSuggestionsVisible(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitAction({ weekdayCd, recipeNm });
  };

  return (
    <div className="form-bg-layout-base">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
              <label className="block text-sm text-gray-700">曜日<Required/></label>
              <select
                value={weekdayCd}
                onChange={(e) => setWeekdayCd(e.target.value)}
                className="form-input-base"
              >
              {!weekdayDictStat.isLoading && <OptionConstDict dict={weekdayDict} />}
              </select>
            </div>
          <div className="mt-4">
            <label className="block text-sm text-gray-700">レシピ名<Required/></label>
            <input
              type="text"
              id="recipeNm"
              value={recipeNm}
              onChange={handleRecipeNmChange}
              onFocus={() => setRecipeNmSuggestionsVisible(true)}
              className="form-input-base"
              required
              ref={recipeNmRef}
            />
              {!recipeNmSuggestionsStat?.isLoading && recipeNmSuggestionsVisible && (
                <SuggestionsInput
                  suggestions={recipeNmSuggestions}
                  setCallback={setRecipeNm}
                  contentRef={recipeNmRef}
                  suggestionsRef={recipeNmSuggestionsRef}
                  setSuggestionsVisible={setRecipeNmSuggestionsVisible}
                />
              )}

          </div>
          <div className="flex justify-between mt-4">
            <FormCloseButton onClick={closeMenuPlanDetForm} />
            <FormSubmitButton />
          </div>
        </form>
      </div>
    </div>
  );
};
