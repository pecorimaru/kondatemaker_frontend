
import React, { useEffect, useState } from "react";

import { useRecipeTypeList } from "../../hooks/useglobal";
import { useKondateMaker } from "../global";

export const InputRecipe = ({ submitAction, editData, setEditData }) => {

  const { setIsInputRecipeOpen, setIsEditRecipeOpen } = useKondateMaker();
  const { recipeTypeList, recipeTypeListStat } = useRecipeTypeList();
  const [recipeNm, setRecipeNm] = useState(editData?.recipeNm);
  const [recipeNmKana, setRecipeNmKana] = useState(editData?.recipeNmKana);
  const [recipeType, setRecipeType] = useState({cd: editData?.recipeType?.cd, nm: editData?.recipeType?.nm});
  const [recipeUrl, setRecipeUrl] = useState(editData?.recipeUrl);
  

  // 自動カナ変換はいったん諦める
  // const recipeNmRef = useRef(null);
  // const recipeNmKanaRef = useRef(null);
  // const [autokana, setAutokana] = useState(null);

  useEffect(() => {
    if(!recipeTypeListStat?.isLoading) {
      console.log(recipeTypeList)
      if(!editData) {
        setRecipeType({cd: recipeTypeList[0]?.cd, nm: recipeTypeList[0]?.nm});
      }
    }
  }, [recipeTypeList, recipeTypeListStat?.isLoading, editData]);


  // 自動カナ変換はいったん諦める
  //   // []を渡し、最初の一回しかレンダリング走らせない
  //   useEffect(() => {
  //     setAutokana(AutoKana.bind('#recipeNm', '#recipeNmKana', { katakana: true }));
  //     console.log(autokana);
  // }, []);

  const onChangeEvent = (e) => {
    setRecipeNm(e.target.value);
    console.log(recipeType)
    console.log(recipeTypeList[0].nm)
    // 自動カナ変換はいったん諦める
    // let name = recipeNmRef.current;
    // let kana = recipeNmKanaRef.current;

    // if (!name) return;
    // name.value = e.target.value;

    // if (!kana) return;
    // kana.value = autokana.getFurigana();
}


  const handleRecipeTypeChange = (e) => {
    console.log(e.target.value)
    console.log(e.target.options[e.target.selectedIndex].text)
    setRecipeType({cd: e.target.value, nm: e.target.options[e.target.selectedIndex].text});
  };

  const handleCloseInputIngred = () => {
    setIsInputRecipeOpen(false);
    setIsEditRecipeOpen(false);
    setEditData({ recipeNm: null, recipeNmKana: null, recipeType: {cd: null, nm: null}, recipeUrl: null });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`handleSubmit ${recipeNm}, ${recipeNmKana}, ${recipeType.cd}, ${recipeUrl}`)

    submitAction({recipeNm, recipeNmKana, recipeType, recipeUrl});
    setRecipeNm("");
    setRecipeNmKana("")
    setRecipeType({cd: "", nm: ""});
    setRecipeUrl("");
    setEditData({ recipeNm: null, recipeNmKana: null, recipeType: {cd: null, nm: null}, recipeUrl: null });
  };



  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-10">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        {/* <h2 className="text-lg font-bold mb-4">食材を選択してください</h2> */}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm text-gray-700">レシピ名:</label>
            <input
              type="text"
              id="recipeNm"
              value={recipeNm}
              onChange={onChangeEvent}
              className="w-full px-3 py-2 border rounded-md text-base"
              // ref={recipeNmRef}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm text-gray-700">レシピ名（カナ）:</label>
            <input
              type="text"
              id="recipeNmKana"
              value={recipeNmKana}
              onChange={(e) => setRecipeNmKana(e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-base"
              required
              // ref={recipeNmKanaRef}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm text-gray-700">レシピ区分:</label>
            <select
              value={recipeType?.cd}
              onChange={handleRecipeTypeChange}
              className="w-full px-3 py-2 border rounded-md text-base"
            >
              {!recipeTypeListStat?.isLoading ? recipeTypeList?.map((elem, index) => (
                <option key={index} value={elem?.cd}>{elem?.nm}</option>  
              )) : null}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm text-gray-700">レシピURL:</label>
            <input
              type="text"
              value={recipeUrl}
              onChange={(e) => setRecipeUrl(e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-base"
            />
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
