import * as Const from '../constants/constants.js';
import React, { useEffect, useState } from "react";
import { useInitItemsForIngred, useSalesAreaList, useUnitList } from "../hooks/useGlobal";
import { useKondateMaker } from "./global";

export const InputIngred = ({ isInputIngredOpen, setIsInputIngredOpen, handleCloseInputIngred, onSubmit }) => {

  const { user } = useKondateMaker();
  const { unitList, unitListStat } = useUnitList();
  const { salesAreaList, salesAreaListStat } = useSalesAreaList();
  const [ingredNm, setIngredNm] = useState("");
  const [qty, setQty] = useState();
  const [unitNm, setUnitNm] = useState("");
  const [salesAreaNm, setSalesAreaNm] = useState("");
  const { initItemsForIngred, initItemsForIngredStat } = useInitItemsForIngred(ingredNm, user.id);

  useEffect(() => {
    if(!unitListStat.isLoading) {
      setUnitNm(unitList[0]?.unitNm);
    }
  }, [unitList]);

  useEffect(() => {
    if(!salesAreaListStat.isLoading) {
      setSalesAreaNm(salesAreaList[0]?.nm);
    }
  }, [salesAreaList]);

  useEffect(() => {
    if(!initItemsForIngredStat.isLoading) {
      if(initItemsForIngred?.unitNm) {
        setUnitNm(initItemsForIngred?.unitNm);
      }

      if(initItemsForIngred?.salesAreaNm) {
        setSalesAreaNm(initItemsForIngred?.salesAreaNm);
      }
    }
  }, [initItemsForIngredStat]);



  if (!isInputIngredOpen) return null; // モーダルが開かれていない場合は何も表示しない




  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(`${ingredNm}, ${qty}, ${unitNm}, ${user?.id}`)
    // フォームの送信処理を実装（例: 保存する、APIに送信するなど）
    try {
      const response = await fetch(`${Const.ROOT_URL}/inputIngred/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ingredNm, qty, unitNm, salesAreaNm, userId: user?.id }),
      });    
      const data = await response.json();
      console.log(data)
      onSubmit({ ingred_nm: data?.detail.ingred_nm, qty: data?.detail.qty, unit_nm: data?.detail.unit_nm, sales_area_nm: data?.detail.sales_area_nm });
    } catch (error) {
      console.log(error.message)
    } finally {
    }
    
    setIngredNm("");
    setQty("")
    setUnitNm("");
    setIsInputIngredOpen(false); // モーダルを閉じる
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        {/* <h2 className="text-lg font-bold mb-4">食材を選択してください</h2> */}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm text-gray-700">テスト食材名:</label>
            <input
              type="text"
              value={ingredNm}
              onChange={(e) => setIngredNm(e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-base"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm text-gray-700">必要量:</label>
            <input
              type="number"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-base"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm text-gray-700">単位:</label>
            <select
              value={unitNm}
              onChange={(e) => setUnitNm(e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-base"
            >
              {unitList.map((elem, index) => (
                <option key={index} value={elem?.unitNm}>{elem?.unitNm}</option>  
              ))}

            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm text-gray-700">売り場:</label>
            <select
              value={salesAreaNm}
              onChange={(e) => setSalesAreaNm(e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-base"
            >
              {salesAreaList.map((elem, index) => (
                <option key={index} value={elem?.nm}>{elem?.nm}</option>  
              ))}

            </select>
          </div>


          <div className="flex justify-between mt-3">
            <button
              type="button"
              onClick={handleCloseInputIngred}
              className="bg-red-400 text-white font-bold py-2 px-6 rounded-md shadow-md border-b-4 border-red-500 hover:bg-red-400 hover:shadow-lg active:bg-red-400 active:shadow-sm active:border-opacity-0 active:translate-y-1 transition duration-100"
            >
              閉じる
            </button>
            <button
              type="submit"
              className="bg-blue-400 text-white font-bold py-2 px-6 rounded-md shadow-md border-b-4 border-blue-500 ml-2 hover:bg-blue-400 hover:shadow-lg active:bg-blue-400 active:shadow-sm active:border-opacity-0 active:translate-y-1 transition duration-100"
            >
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
