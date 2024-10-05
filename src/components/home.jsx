import '../css/styles.css';
import '../css/output.css';
import { useEffect, useState } from 'react';
// import { DayRecipeRow, MainLabel, MainRecipe } from './common';
import { useKondateMaker } from './global.jsx';
import * as Const from '../constants/constants.js';
import { refreshToweekPlan } from '../requests/requests.js';


export const Home = () => {
 
  const {
    menuPlanNm,
    menuPlanNmStat,
    setSelectedPlan, 
  } = useKondateMaker();
  

  useEffect(() => {
    console.log(`menuPlanNmStat isLoading:${menuPlanNmStat?.isLoading}`)
    if (menuPlanNm) {
      setSelectedPlan(menuPlanNm)
    }
  }, [menuPlanNm, menuPlanNmStat?.isLoading, setSelectedPlan]); 

  return(
    <div className="flex items-center justify-center h-screen w-full text-sm" style={{height: "calc(100vh - 80px)"}}>
      <div>
        <div>
          <div className="flex justify-center items-center pt-4">
            <table>
              <tbody>
                <ToweekMenuPlanRow />
              </tbody>
            </table>
          </div>
          <div className="flex justify-center items-center mt-4">
            <table>
              <tbody>
                <DayRecipeRow weekdayCd={Const.WEEK_SUNDAY} />
                <DayRecipeRow weekdayCd={Const.WEEK_MONDAY} />
                <DayRecipeRow weekdayCd={Const.WEEK_TUESDAY} />
                <DayRecipeRow weekdayCd={Const.WEEK_WEDNESDAY} />
                <DayRecipeRow weekdayCd={Const.WEEK_THURSDAY} />
                <DayRecipeRow weekdayCd={Const.WEEK_FIRDAY} />
                <DayRecipeRow weekdayCd={Const.WEEK_SATURDAY} />
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}


const ToweekMenuPlanRow = () => {

  const {
    user,
    selectedPlan, 
    setSelectedPlan, 
    menuPlanList, 
  } = useKondateMaker();

  const [isOpenMenuPlan, setIsOpenMenuPlan] = useState(false);

  const handleOptMenuPlanClick = async (option) => {
    
  const changeable = window.confirm("今週の献立を変更すると追加した食材や購入状況がクリアされます。\nよろしいですか？")
  
  if (changeable) {

    setSelectedPlan(option);
    setIsOpenMenuPlan(false);

    // 選択したプランに基づいてワーク情報を洗い替えする
    refreshToweekPlan(option, user?.id)
  }
};

  return (
    <tr className="flex justify-center gap-2">
      <td className={`px-4 py-2 font-bold text-center shadow-lg w-28 text-white bg-blue-900`}>今週の献立</td>
      <td className="bg-white p-0 w-44 shadow-md relative">
      <button className="px-4 py-2 font-bold text-center w-44 absolute z-0" onClick={() => setIsOpenMenuPlan(!isOpenMenuPlan)}>
        {!selectedPlan ? "Loading" : selectedPlan}
      </button>
      <i className="fa-solid fa-caret-down py-2 cursor-pointer w-4 absolute z-10 right-1" onClick={() => setIsOpenMenuPlan(!isOpenMenuPlan)}></i>
      {isOpenMenuPlan && (
        <ul className="absolute bg-white border mt-1 rounded-md shadow-lg w-44">
          {menuPlanList?.map((option, index) => (
            <li
              key={index}
              className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
              onClick={() => handleOptMenuPlanClick(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </td>
  </tr>
  )
}

const DayRecipeRow = ({ weekdayCd }) => {

  const { toweekRecipes, toweekRecipesStat } = useKondateMaker();

  return (
    <tr className="flex justify-center gap-2 mt-1">
      {/* <td></td> */}
      <td className={`${Const.DAYWISE_ITEMS[weekdayCd]?.bgColor} text-slate-700 px-4 py-2 font-bold text-center shadow-md w-28`}>{Const.DAYWISE_ITEMS[weekdayCd]?.weekday}</td>
      <td className="bg-white px-4 py-2 font-bold text-center shadow-md w-44">{toweekRecipesStat?.isLoading ? "Loading" : toweekRecipes?.[weekdayCd]?.name}</td>
    </tr>
  )

}