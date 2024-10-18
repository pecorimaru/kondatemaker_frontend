
import React, { useEffect, useState } from "react";
import { useInitItemsForIngred, useSalesAreaList, useUnitList } from "../../hooks/useglobal";
import { useKondateMaker } from "../global";

export const EditIngred = ({ submitAction, initData, isEditIngredOpen, setIsEditIngredOpen }) => {

  const { user } = useKondateMaker();
  const { unitList, unitListStat } = useUnitList();
  const { salesAreaList, salesAreaListStat } = useSalesAreaList();
  const [ingredNm, setIngredNm] = useState(initData?.ingredNm);
  const [qty, setQty] = useState(initData?.qty);
  const [unitNm, setUnitNm] = useState(initData?.unitNm);
  const [salesAreaNm, setSalesAreaNm] = useState();
//   const [formData, setFormData] = useState()


  const { initItemsForIngred, initItemsForIngredStat } = useInitItemsForIngred(ingredNm, user?.id);
  

  // 単位リストの先頭を設定
  useEffect(() => {
    if(!unitListStat?.isLoading) {
      setUnitNm(unitList[0]?.unitNm);
    }
  }, [unitList, unitListStat?.isLoading]);

  // 売り場リストの先頭を設定
  useEffect(() => {
    if(!salesAreaListStat?.isLoading) {
      setSalesAreaNm(salesAreaList[0]?.nm);
    }
  }, [salesAreaList, salesAreaListStat?.isLoading]);

  // 食材名からの初期値を設定
  useEffect(() => {
    if(!initItemsForIngredStat.isLoading) {
        setUnitNm(initItemsForIngred?.unitNm);
        setSalesAreaNm(initItemsForIngred?.salesAreaNm);
      }
  }, [initItemsForIngred, initItemsForIngredStat]);

//   useEffect(() => {
//     setFormData({
//       ingredNm,
//       qty,
//       unitNm,
//       salesAreaNm
//     })
//   }, [ingredNm, qty, unitNm, salesAreaNm]);

  const handleCloseInputIngred = () => {
    setIsEditIngredOpen({ isOpen: false, recipeIngredId: null });
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(`handleSubmit ${ingredNm}, ${qty}, ${unitNm}, ${salesAreaNm}`)

    submitAction({ ingredNm, qty, unitNm, salesAreaNm });
    setIngredNm("");
    setQty("")
    setUnitNm("");
  };

  // if (!isInputIngredOpen) return null; // モーダルが開かれていない場合は何も表示しない

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        {/* <h2 className="text-lg font-bold mb-4">食材を選択してください</h2> */}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm text-gray-700">食材名:</label>
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
              {unitList?.map((elem, index) => (
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
              {salesAreaList?.map((elem, index) => (
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
