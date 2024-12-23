
import React, { useEffect, useState } from "react";

import * as Const from '../../constants/constants.js';

import { FormCloseButton, FormSubmitButton, LoadingSpinner, OptionConstDict } from "../global/common";
import { useKondateMaker } from "../global/global";

export const IngredUnitConvForm = ({ ingred, submitAction, closeIngredUnitConvForm, editData }) => {

  const { unitDict, setIsOpeningForm } = useKondateMaker();
  const [convUnitCd, setFromUnitCd] = useState(editData ? editData?.convUnitCd : Object.keys(unitDict)[0]);
  const [convRate, setConvRate] = useState(editData?.convRate * ingred.unitConvWeight);
  const [excConvRate, setExcConvRate] = useState(editData?.convWeight / editData?.convRate);
  const [convUnitWeight] = useState(editData?.convWeight);
  const [formToggle, setFormToggle] = useState(ingred.unitConvWeight === Const.UNIT_CONV_TYPE_100_COMP ? true : false);

  useEffect(() => {setIsOpeningForm(true)}, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    submitAction({ convUnitCd, convRate });
  };

  return (
    <div className="form-bg-layout-base">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-end">
          <div className="inline-block">
            <button 
              className={`fa-solid fa-arrow-right-arrow-left bg-lime-400 text-white mt-0.5 py-2 px-2 rounded-md shadow-sm border-b-4 border-lime-500 hover:bg-lime-400 hover:shadow-lg active:shadow-sm active:border-opacity-0 active:translate-y-0.5 transition duration-100`}
              onClick={() => setFormToggle(!formToggle)}
            />
          </div>
        </div>
        <form 
          onSubmit={handleSubmit}
        >    
          {formToggle ?
            <ConvUnitToStandardUnit
              ingred={ingred}
              convUnitCd={convUnitCd}
              setFromUnitCd={setFromUnitCd}
              convRate={convRate}
              setConvRate={setConvRate}
              excConvRate={excConvRate}
              setExcConvRate={setExcConvRate}
              convUnitWeight={convUnitWeight}
            /> :
            <StandardUnitToConvUnit
              ingred={ingred}
              convUnitCd={convUnitCd}
              setFromUnitCd={setFromUnitCd}
              convRate={convRate}
              setConvRate={setConvRate}
              excConvRate={excConvRate}
              setExcConvRate={setExcConvRate}
            />}
          <div className="flex justify-between mt-4">
            <FormCloseButton onClick={closeIngredUnitConvForm} />
            <FormSubmitButton />
          </div>
        </form>
      </div>
    </div>
  );
};



// 例：かぼちゃは1個あたり1200g
const ConvUnitToStandardUnit = ({ ingred, convUnitCd, setFromUnitCd, setConvRate, excConvRate, setExcConvRate, convUnitWeight }) => {

  const { unitDict, unitDictStat } = useKondateMaker();

  const handleConvRateChange = (e) => {
    e.preventDefault();
    setExcConvRate(e.target.value);
    setConvRate(ingred.unitConvWeight / e.target.value);
  };

  return (
    <div>
      <div className="mt-4 text-lg">
        <div>
          {`${ingred.ingredNm} は`}
        </div>
        <div className="flex items-center mt-2">
          <span className="mx-2 text-center w-8">{convUnitWeight ? convUnitWeight : 1}</span>
          <select
            id="convUnitCd"
            value={convUnitCd}
            onChange={(e) => setFromUnitCd(e.target.value)}
            className="form-input-base w-28"
          >
            {!unitDictStat.isLoading && <OptionConstDict dict={unitDict} />}
          </select>  
          <span className="pl-2 w-16">あたり</span>
        </div>
      </div>
      <div className="flex items-center mt-2 ">
        <span className="mx-2 w-8" />
        <input
          type="number"
          id="excConvRate"
          value={excConvRate}
          onChange={(e) => handleConvRateChange(e)}
          className="form-input-base w-36"
          step="0.1"
        />
        <span className="pl-2 w-14">
          {unitDict[ingred.buyUnitCd]}
        </span>
      </div>
    </div>
  )
};

// かぼちゃは100gあたり0.83個
const StandardUnitToConvUnit = ({ ingred, convUnitCd, setFromUnitCd, convRate, setConvRate, excConvRate, setExcConvRate }) => {

  const { unitDict, unitDictStat } = useKondateMaker();

  const handleConvRateChange = (e) => {
    e.preventDefault();
    setConvRate(e.target.value);
    setExcConvRate(ingred.unitConvWeight / e.target.value);
  };

  return (
    <div className="mx-0.5">
      <div className="text-lg">
        {!unitDictStat.isLoading  ? `${ingred.ingredNm} は ${ingred.unitConvWeight} ${unitDict[ingred.buyUnitCd]} あたり` : <LoadingSpinner />}
      </div>
      <div className="flex justify-between gap-1 mt-2">
        <input
          type="number"
          id="convRate"
          value={convRate}
          onChange={(e) => handleConvRateChange(e)}
          className="form-input-base w-32"
          step="0.1"
        />
        <select
          id="convRate"
          value={convUnitCd}
          onChange={(e) => setFromUnitCd(e.target.value)}
          className="form-input-base w-28"
        >
          {!unitDictStat.isLoading && <OptionConstDict dict={unitDict} />}
        </select>
      </div>
    </div>
  );
};