import '../css/styles.css';
import '../css/output.css';
import { useEffect, useState } from 'react';
import { InputIngred } from './inputingred';
import { useKondateMaker } from './global';
import { switchCompletionState } from '../requests/requests';
import { useBuyIngreds } from '../hooks/useglobal';

export const BuyList = () => {

  const { user } = useKondateMaker();
  const { buyIngreds, buyIngredsStat } = useBuyIngreds(user);
  const [incompleteRows, setIncompleteRows] = useState();    // 未完リスト
  const [completeRows, setCompleteRows] = useState();        // 完了済リスト


  useEffect(() => {

    if (!buyIngredsStat.isLoading) {

      setIncompleteRows(
        buyIngreds
        ?.filter(buyIngreds => buyIngreds.bought_flg === "F")
        ?.map((item, index) => ({
          ...item,
          num: index +1,
          checked: false
        }))
      )

      console.log(buyIngreds?.filter(buyIngreds => buyIngreds.bought_flg === "F")?.length)

      setCompleteRows(
        buyIngreds
        ?.filter(buyIngreds => buyIngreds.bought_flg === "T")
        ?.map((item, index) => ({
          ...item,
          num: buyIngreds?.filter(buyIngreds => buyIngreds.bought_flg === "F")?.length + index +1,
          checked: true
        }))
      )

    }

  }, [buyIngreds, buyIngredsStat.isLoading]);

  const handleCheckboxChange = (index, isChecked) => {


    if (isChecked) {
      // チェックした行を完了済リストに追加
      const selectedRow = incompleteRows[index];
      setCompleteRows([...completeRows, { ...selectedRow, checked: true}]);

      // チェックした行を未完リストから除外
      const newIncompleteRows = [...incompleteRows];
      newIncompleteRows.splice(index, 1);
      setIncompleteRows(newIncompleteRows);
      console.log(selectedRow?.buy_ingreds_id)
      switchCompletionState(selectedRow?.buy_ingreds_id, "T")

    } else {
      // チェックした行を未完リストに追加      
      const selectedRow = completeRows[index];      
      setIncompleteRows([...incompleteRows, { ...selectedRow, checked: false }]);

      // チェックした行を完了済リストから除外
      const newCompleteRows = [...completeRows];
      newCompleteRows.splice(index, 1);
      setCompleteRows(newCompleteRows);

      switchCompletionState(selectedRow?.buy_ingreds_id, "F")
    }

  }

  const [isInputIngredOpen, setIsInputIngredOpen] = useState(false);

  const handleOpenInputIngred = () => {
    setIsInputIngredOpen(true);
  };

  const handleCloseInputIngred = () => {
    setIsInputIngredOpen(false);
  };

  const handleSubmit = (data) => {
    setIncompleteRows([...incompleteRows, { checked: false, ingred_nm: data.ingred_nm, qty: data.qty, unit_nm: data.unit_nm, sales_area_nm: data.sales_area_nm }]);

    console.log(data)
    setIsInputIngredOpen(false); // モーダルを閉じる
  };



  return(
    <div className="flex justify-center w-full bg-slate-200">
      <div className="mt-16 mb-24">
        <table className="mt-3 text-xs">
          <thead>
            <tr className="flex justify-center text-white gap-1">
              <th className="bg-blue-900 py-1 font-bold shadow-lg w-8"><i className="fa-solid fa-check"></i></th>
              <th className="bg-blue-900 px-1 py-1 font-bold shadow-lg w-32">食材</th>
              <th className="bg-blue-900 px-1 py-1 font-bold shadow-lg w-16">必要量</th>
              <th className="bg-blue-900 px-1 py-1 font-bold shadow-lg w-28">売り場</th>
            </tr>
          </thead>
          <tbody>
            {incompleteRows
              ?.sort((a, b) => {
                if (a?.sales_area_seq !== b?.sales_area_seq) {
                  return a.sales_area_seq - b.sales_area_seq
                }
                return a.num - b.num
              })
              ?.map((row, index) => 

            /* {buyIngreds.map((buyIngreds, index) =>   */
            (
              <BuyIngredRow
                row={row}
                index={index}
                isComplete={false}
                handleCheckboxChange={handleCheckboxChange}
              />
            ))}
            <tr className="text-slate-400 mt-1 transition-all duration-500 ease-in-out transform hover:scale-100 hover:shadow-md hover:text-slate-700 hover:bg-white">
              <td 
                className="px-3 py-2 font-bold cursor-pointer" 
                onClick={handleOpenInputIngred}
              >
                <i className="fa-regular fa-square-plus"></i>　食材を追加
              </td>
            </tr>
            <tr className="text-slate-400 mt-1">
              {0 < completeRows?.length ? <td className="px-3 pt-2 font-bold"><i className="fa-solid fa-check"></i>　完了済の項目</td> :null}
            </tr>
            {completeRows
              // 1.売り場順序 2.取得順序でソート
              ?.sort((a, b) => {
                if (a?.sales_area_seq !== b?.sales_area_seq) {
                  return a.sales_area_seq - b.sales_area_seq
                }
                return a.num - b.num
              })
              
              ?.map((row, index) => 
            (
              <BuyIngredRow
                row={row}
                index={index}
                isComplete={true}
                handleCheckboxChange={handleCheckboxChange}
              />
            ))}
          </tbody>
        </table>
        <InputIngred 
          isInputIngredOpen={isInputIngredOpen} 
          setIsInputIngredOpen={setIsInputIngredOpen} 
          handleCloseInputIngred={handleCloseInputIngred} 
          onSubmit={handleSubmit} 
        />
      </div>    
    </div>
  );
}    

export const BuyIngredRow = ({ row, index, isComplete, handleCheckboxChange }) => {

  const colorClass = isComplete ? "bg-slate-300 text-slate-500" : "bg-white";
  const baseClass = "py-2 font-bold text-center shadow-lg";

  return (
    <tr 
      key={row?.buy_ingreds_id} 
      className="flex justify-center text-slate-700 gap-1 my-1 transition-all duration-500 ease-in-out transform hover:scale-105"
    >
      <td 
        className={`${colorClass} px-1 pt-2.5 py-2 font-bold cursor-pointer text-center shadow-lg w-8`} 
        onClick={() => handleCheckboxChange(index, !row.checked)}
      >
        <input className="cursor-pointer"
          type="checkbox"
          checked={row.checked}
          onChange={() => handleCheckboxChange(index, !row.checked)}
        />
      </td>
      <td className={`${baseClass} ${colorClass} w-32`}>{row.ingred_nm}</td>
      <td className={`${baseClass} ${colorClass} w-16`}>{`${row.qty} ${row.unit_nm}`}</td>
      <td className={`${baseClass} ${colorClass} w-28`}>{row.sales_area_nm}</td>
    </tr>
  );
}