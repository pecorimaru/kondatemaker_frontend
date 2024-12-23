
import React, { useEffect, useState } from "react";

import { useKondateMaker } from "../global/global.jsx";
import { FormCloseButton, FormSubmitButton, OptionConstDict, Required } from "../global/common.jsx";


export const RecipeForm = ({ submitAction, closeRecipeForm, editData }) => {

  const { recipeTypeDict, recipeTypeDictStat, setIsOpeningForm } = useKondateMaker();
  
  const [recipeNm, setRecipeNm] = useState(editData?.recipeNm);
  const [recipeNmK, setRecipeNmK] = useState(editData?.recipeNmK);
  const [recipeType, setRecipeType] = useState(editData ? editData?.recipeType : Object.keys(recipeTypeDict)[0]);
  const [recipeUrl, setRecipeUrl] = useState(editData?.recipeUrl);
  
  useEffect(() => {setIsOpeningForm(true)}, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    submitAction({recipeNm, recipeNmK, recipeType, recipeUrl});
  };

  return (
    <div className="form-bg-layout-base">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <label className="block text-sm text-gray-700">レシピ名<Required/></label>
            <input
              type="text"
              id="recipeNm"
              value={recipeNm}
              onChange={(e) => setRecipeNm(e.target.value)}
              className="form-input-base"
              required
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm text-gray-700">レシピ名（かな）</label>
            <input
              type="text"
              id="recipeNmK"
              value={recipeNmK}
              onChange={(e) => setRecipeNmK(e.target.value)}
              className="form-input-base"
              required
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm text-gray-700">レシピ区分<Required/></label>
            <select
              value={recipeType}
              onChange={(e) => setRecipeType(e.target.value)}
              className="form-input-base"
            >
              {!recipeTypeDictStat.isLoading && <OptionConstDict dict={recipeTypeDict} />}
            </select>
          </div>

          <div className="mt-4">
            <label className="block text-sm text-gray-700">レシピURL</label>
            <input
              type="text"
              value={recipeUrl}
              onChange={(e) => setRecipeUrl(e.target.value)}
              className="form-input-base"
            />
          </div>

          <div className="flex justify-between mt-4">
            <FormCloseButton onClick={closeRecipeForm} />
            <FormSubmitButton />
          </div>
        </form>
      </div>
    </div>
  );
};
