
import React, { useEffect, useState } from "react";
import { FormCloseButton, FormSubmitButton, Required } from "../global/common";
import { useKondateMaker } from "../global/global";

export const MenuPlanForm = ({ submitAction, closeMenuPlanForm, editData }) => {

  const { setIsOpeningForm } = useKondateMaker();
  const [menuPlanNm, setMenuPlanNm] = useState(editData?.menuPlanNm);
  const [menuPlanNmK, setMenuPlanNmK] = useState(editData?.menuPlanNmK);
  
  useEffect(() => {setIsOpeningForm(true)}, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    submitAction({ menuPlanNm, menuPlanNmK });
  };

  return (
    <div className="form-bg-layout-base">
      <div className="bg-white p-6 rounded-lg shadow-lg">

        <form onSubmit={handleSubmit}>
          <div className="mt-4">
            <label className="block text-sm text-gray-700">献立プラン名<Required/></label>
            <input
              type="text"
              id="menuPlanNm"
              value={menuPlanNm}
              onChange={(e) => setMenuPlanNm(e.target.value)}
              className="form-input-base"
              required
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm text-gray-700">献立プラン名（かな）</label>
            <input
              type="text"
              id="menuPlanNmK"
              value={menuPlanNmK}
              onChange={(e) => setMenuPlanNmK(e.target.value)}
              className="form-input-base"
            />
          </div>

          <div className="flex justify-between mt-4">
            <FormCloseButton onClick={closeMenuPlanForm} />
            <FormSubmitButton />
          </div>
        </form>
      </div>
    </div>
  );
};
