import '../../css/styles.css';
import '../../css/output.css';
import { useWeekdayDict, useUnitDict, useSalesAreaDict, useRecipeTypeDict } from '../../hooks/useFetchData.js';
import { useNavigate } from 'react-router-dom';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useEventHandler } from '../../hooks/useEventHandler.js';
import { Header } from './header.jsx';


const KondateMakerContext = createContext();

export function KondateMakerProvider({ children }) {

  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user"))) || {id: "", name: ""};
  // const { buyIngredList, buyIngredListStat } = useBuyIngredList(user);
  // const { recipeList, recipeListStat } = useRecipeList(user);

  const { weekdayDict, weekdayDictStat } = useWeekdayDict();
  const { unitDict, unitDictStat } = useUnitDict();
  const { recipeTypeDict, recipeTypeDictStat } = useRecipeTypeDict();
  const { salesAreaDict, salesAreaDictStat } = useSalesAreaDict();
  const [isMessageVisible, setIsMessageVisible] = useState(true);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  // const [isAddIngred, setIsAddIngred] = useState(false);
  // const [isEditIngred, setIsEditIngred] = useState(false);
  // const [isAddRecipe, setIsAddRecipe] = useState(false);
  // const [isEditRecipe, setIsEditRecipe] = useState(false);
  const [touchTimeout, setTouchTimeout] = useState(null);

  // 右クリックでコンテキストメニュー
  const handleContextMenu = (event, updIndex, switchVisibleAcc) => {
    event.preventDefault();
    switchVisibleAcc(updIndex, "contextMenuVisible", true)
    setMenuPosition({ x: event.clientX, y: event.clientY -50 });
  };

  // タッチ開始（長押し用）
   const handleTouchStart = (event, index, showContextMenu) => {
    const touch = event.touches[0];
    setTouchTimeout(setTimeout(() => {
      setMenuPosition({ x: touch.clientX +50, y: touch.clientY -70 });
      showContextMenu(index, "contextMenuVisible", true);
    }, 500));  // 500ms 長押しでポップアップを表示
  };

  // タッチ終了（長押しキャンセル）
  const handleTouchEnd = () => {
    clearTimeout(touchTimeout);
    window.addEventListener('touchend', handleTouchEnd);
    return () => {
      window.removeEventListener('touchend', handleTouchEnd);
    };
  };

  const closeContextMenu = (switchVisibleAcc) => {
    switchVisibleAcc(null, "contextMenuVisible", false, true);
  }

  return (
    <KondateMakerContext.Provider 
      value={{
        user,
        setUser,
        // menuPlanNm,
        // menuPlanNmStat,
        // selectedPlan, 
        // setSelectedPlan,
        // menuPlanList,
        // menuPlanListStat,
        // menuPlanListMutate,
        // buyIngredList,
        // buyIngredListStat,
        // toweekRecipes,
        // toweekRecipesStat,
        // recipeList,
        // recipeListStat,
        weekdayDict,
        weekdayDictStat,
        recipeTypeDict,
        recipeTypeDictStat,
        unitDict,
        unitDictStat,
        salesAreaDict, 
        salesAreaDictStat,
        menuPosition,
        setMenuPosition,
        isMessageVisible,
        setIsMessageVisible,
        // isAddIngred,
        // setIsAddIngred,
        // isEditIngred,
        // setIsEditIngred,
        // isAddRecipe,
        // setIsAddRecipe,
        // isEditRecipe,
        // setIsEditRecipe,
        touchTimeout,
        setTouchTimeout,
        handleContextMenu,
        handleTouchStart,
        handleTouchEnd,
        closeContextMenu
        // isAddMenuPlan,
        // setisAddMenuPlan,
        // isEditMenuPlan,
        // setIsEditMenuPlan,
        // isAddMenuPlanDet,
        // setIsAddMenuPlanDet,
        // isEditMenuPlanDet,
        // setIsEditMenuPlanDet,
        // incompleteRows,
        // setIncompleteRows,
        // completeRows,
        // setCompleteRows
      }}>
      {children}
    </KondateMakerContext.Provider>
  );
}

export function useKondateMaker() {
  return useContext(KondateMakerContext);
}

export const MemoizedHeader = React.memo(Header);


