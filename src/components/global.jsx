import '../css/styles.css';
import '../css/output.css';
import { useMenuPlanNm, useMenuPlanList, useToweekRecipes, useRecipeList } from '../hooks/useglobal.js';
import { useNavigate } from 'react-router-dom';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { FooterButton } from './common';


const KondateMakerContext = createContext();

export function KondateMakerProvider({ children }) {

  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user"))) || {id: "", name: ""};
  const {menuPlanNm, menuPlanNmStat} = useMenuPlanNm(user);
  const [selectedPlan, setSelectedPlan] = useState(menuPlanNm);
  const {menuPlanList, menuPlanListStat} = useMenuPlanList(user);
  const {toweekRecipes, toweekRecipesStat} = useToweekRecipes(selectedPlan, user);
  const { recipeList, recipeListStat } = useRecipeList(user);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [isInputIngredOpen, setIsInputIngredOpen] = useState(false);
  const [isEditIngredOpen, setIsEditIngredOpen] = useState({ isOpen: false, recipeIngredId: null });
  const [isInputRecipeOpen, setIsInputRecipeOpen] = useState(false);
  const [isEditRecipeOpen, setIsEditRecipeOpen] = useState(false);

  return (
    <KondateMakerContext.Provider 
      value={{
        user,
        setUser,
        menuPlanNm,
        menuPlanNmStat,
        selectedPlan, 
        setSelectedPlan,
        menuPlanList,
        menuPlanListStat,
        toweekRecipes,
        toweekRecipesStat,
        recipeList,
        recipeListStat,
        menuPosition,
        setMenuPosition,
        isInputIngredOpen,
        setIsInputIngredOpen,
        isEditIngredOpen,
        setIsEditIngredOpen,
        isInputRecipeOpen,
        setIsInputRecipeOpen,
        isEditRecipeOpen,
        setIsEditRecipeOpen
      }}>
      {children}
    </KondateMakerContext.Provider>
  );
}

export function useKondateMaker() {
  return useContext(KondateMakerContext);
}

function Header() {

  const {user, setUser, setSelectedPlan} = useKondateMaker();
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    console.log("Header useEffect");
    const today = new Date();
    const formattedDate = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`;
    setCurrentDate(formattedDate);
  }, [])


  const navigate = useNavigate();
  const handleLogout = () => {
    console.log("logout");
    setUser(null);
    setSelectedPlan(null);
    localStorage.setItem("user", null);
    navigate("/");
  }


  return(
    <div className="fixed flex flex-col items-center justify-center w-full z-10 bg-blue-200 shadow-lg h-14">
      <p>{user?.name}</p>
      <p>{currentDate}</p>
      <button
        className="bg-blue-200 hover:bg-gray-400 text-gray-500 hover:text-white text-xs font-bold py-1 px-3 absolute z-10 right-5 rounded-md transition duration-300"
        onClick={handleLogout}
      >
        ログアウト
      </button>
    </div>
  )

}

export const MemoizedHeader = React.memo(Header);


export const Footer = () => {

  const navigate = useNavigate();

  const onClickToMain = () => {
    navigate("/main");
  }

  const onClickToBuyList = () => {
    navigate("/buyList");
  }

  const onClickRecipe = () => {
    navigate("/recipeList");
  }

  const onClickMenuPlan = () => {
    alert("開発中..");
  }

  return(
    <div className='fixed w-full flex justify-center bg-blue-200 h-20 bottom-0 shadow-md'>
      <div>
        <div className="pt-1.5">
          <FooterButton text="ホーム" icon="fa-regular fa-house mx-2.5" onClick={onClickToMain}/>
          <FooterButton text="買い物" icon="fa-regular fa-cart-shopping mx-2.5" onClick={onClickToBuyList}/>
          <FooterButton text="レシピ" icon="fa-regular fa-utensils mx-2.5" onClick={() => onClickRecipe()}/>
          <FooterButton text="献立" icon="fa-solid fa-clipboard mx-2.5" onClick={() => onClickMenuPlan()}/>
          <FooterButton text="メニュー" icon="fa-solid fa-list mx-2.5" onClick={() => onClickMenuPlan()}/>
        </div>
      </div>
    </div>
  )


}