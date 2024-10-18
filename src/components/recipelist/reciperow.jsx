import axios from 'axios';
import { decamelizeKeys } from 'humps';
import * as Const from '../../constants/constants.js';
import { useCallback, useEffect, useState } from "react";
import { ContextMenuRow } from "./recipelist";
import { RecipeIngredRows } from "./recipeingredrows.jsx";
import { useKondateMaker } from '../global.jsx';
import { InputRecipe } from '../inputform/inputrecipe.jsx';
import { mutate } from 'swr';



export const RecipeRow = ({ dispRecipeList, setDispRecipeList }) => {

  const { user, recipeList, menuPosition, setMenuPosition, isInputRecipeOpen, setIsInputRecipeOpen, isEditRecipeOpen, setIsEditRecipeOpen } = useKondateMaker();
  const [touchTimeout, setTouchTimeout] = useState(null);
  const [editRecipeId, setEditRecipeId] = useState(null);
  const [editData, setEditData] = useState({ recipeNm: null, recipeNmKana: null, recipeType: {cd: null, nm: null}, recipeUrl: null });

  const showRecipeContextMenu = (updIndex) => {
    setDispRecipeList(
      recipeList
      ?.map((item, index) => ({
        ...item,
        num: index +1,
        dispIngred: dispRecipeList[index].dispIngred,
        menuVisible: index === updIndex ? true : false
      }))
    )
  }

  // const spliceRecipe = (index) => {
  //   const newRecipeList = [...dispRecipeList];
  //   newRecipeList.splice(index, 1);
  //   setDispRecipeList(
  //     {
  //       ...newRecipeList,
  //       num: dispRecipeList.length + 1,
  //       dispIngred: false,
  //       menuVisible: false
  //     }
  //   );
  // }

  const closeRecipeContextMenu = useCallback(() => {
    // 初回表示時にはrecipeListがないので、recipeListがある場合に限り、dispRecipeListを更新する
    if (recipeList && dispRecipeList) {
      setDispRecipeList(
        recipeList
        ?.map((item, index) => ({
          ...item,
          num: index +1,
          dispIngred: dispRecipeList[index].dispIngred,
          menuVisible: false
        }))
      );
    }
  }, [recipeList, dispRecipeList, setDispRecipeList]);

  const switchDispIngred = (updIndex, dispIngred) => {
    setDispRecipeList(
      recipeList
      ?.map((item, index) => ({
        ...item,
        num: index +1,
        dispIngred: index === updIndex ? dispIngred : dispRecipeList[index].dispIngred,
        menuVisible: false
      }))
    );
  };

  const openAddInputRecipe = () => {
    setIsInputRecipeOpen(true);
  };

  const openEditInputRecipe = (row, index) => {
    console.log(`openEditInputRecipe ${row?.recipeId} ${index}`)
    setIsEditRecipeOpen(true);
  };

  const handleRecipeContextMenu = (event, updIndex) => {
    event.preventDefault();
    showRecipeContextMenu(updIndex)
    setMenuPosition({ x: event.clientX, y: event.clientY -50 });
  };

  // タッチ開始（長押し用）
  const handleRecipeTouchStart = (event, index) => {
    const touch = event.touches[0];
    setTouchTimeout(setTimeout(() => {
      setMenuPosition({ x: touch.clientX +50, y: touch.clientY -70 });
      showRecipeContextMenu(index);
    }, 500));
  };

  // タッチ終了（長押しキャンセル）
  const handleRecipeTouchEnd = () => {
    clearTimeout(touchTimeout);
    window.addEventListener('touchend', handleRecipeTouchEnd);
    return () => {
      window.removeEventListener('touchend', handleRecipeTouchEnd);
    };
  };



  useEffect(() => {
    window.addEventListener('click', closeRecipeContextMenu);
    return () => {
      window.removeEventListener('click', closeRecipeContextMenu);
    };
  }, [closeRecipeContextMenu]);

  const submitAddRecipe = async (formData) => {

    console.log(`submitAddRecipe ${formData?.recipeNm}, ${formData?.recipeNmKana}, ${formData?.recipeType}, ${formData?.recipeUrl}`)
    try {

      const response = await axios.post(`${Const.ROOT_URL}/recipeList/submitAddRecipe`, { 
        recipeNm: formData?.recipeNm,
        recipeNmKana: formData?.recipeNmKana,
        recipeType: formData?.recipeType, 
        recipeUrl: formData?.recipeUrl, 
        userId: user?.id 
      });
      const data = await response.data;
      if (data.statusCode === 200) {
        console.log(data)
        const key = `${Const.ROOT_URL}/recipeList/recipeList/query_params?user_id=${user?.id}`;
        mutate(key, recipeList, { revalidate: true });
        // appendRecipeIngred(data?.newRecipeIngred);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("登録失敗", error);
    }
    setIsInputRecipeOpen(false);
  };

  const submitEditRecipe = async (formData) => {

    console.log(`submitEditRecipe ${editRecipeId}`)
    console.log(`submitEditRecipe ${formData?.recipeNm}, ${formData?.recipeNmKana}, ${formData?.recipeType}, ${formData?.recipeUrl}`)
    try {

      const response = await axios.put(`${Const.ROOT_URL}/recipeList/submitEditRecipe`, { 
        recipeId: editRecipeId,
        recipeNm: formData?.recipeNm,
        recipeNmKana: formData?.recipeNmKana,
        recipeType: formData?.recipeType, 
        recipeUrl: formData?.recipeUrl, 
        user_id: user?.id
      });
      const data = await response.data;
      if (data.statusCode === 200) {
        console.log(data)
        const key = `${Const.ROOT_URL}/recipeList/recipeList/query_params?user_id=${user?.id}`;
        mutate(key, recipeList, { revalidate: true });
        // appendRecipeIngred(data?.newRecipeIngred);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("登録失敗", error);
    }
    setIsEditRecipeOpen(false);
  };

  const submitDeleteRecipe = async (row, index) => {

    const request = decamelizeKeys({ 
      recipeId: row?.recipeId,
      userId: user?.id 
    })

    const deleteable = window.confirm("レシピを削除します。\nよろしいですか？")
    console.log("request", request)
    if (deleteable) {
      const queryParams = new URLSearchParams(decamelizeKeys({ recipeId: row?.recipeId, userId: user?.id })).toString();
      try {
        const response = await axios.delete(`${Const.ROOT_URL}/recipeList/submitDeleteRecipe/queryParams?${queryParams}`)
        const data = await response.data;
        if (data.statusCode === 200) {
          console.log(data)
          // spliceRecipe(index);
          console.log(data.message)
          console.log(`recipe_id:${row?.recipeId} index:${index}`)
          const key = `${Const.ROOT_URL}/recipeList/recipeList/query_params/?user_id=${user?.id}`;
          mutate(key, recipeList, { revalidate: true });
          
        } else {
          throw new Error(data.message);
        }
      } catch (error) {
        console.error("削除失敗", error);
      }        
    }

    closeRecipeContextMenu();
  };

  const baseClass = "bg-white py-2 font-bold text-center shadow-lg duration-500 hover:bg-blue-100";
  
    return (
      <>
            {dispRecipeList?.map((row, index) => 
                (
              <div className="mb-1">
                <tr 
                  key={row?.recipe_id} 
                  onContextMenu={(event) => handleRecipeContextMenu(event, index)}
                  onTouchStart={(event) => handleRecipeTouchStart(event, index)} 
                  onTouchEnd={handleRecipeTouchEnd} 
                  className="relative flex justify-center text-slate-700 text-center gap-1 mt-1 select-none"
                >
                  {row?.menuVisible ? <RecipeContextMenu menuPosition={menuPosition} row={row} index={index} setEditRecipeId={setEditRecipeId} setEditData={setEditData} openEditInputRecipe={openEditInputRecipe} submitDeleteRecipe={submitDeleteRecipe} /> : null}
          
                  <td className={`${baseClass} w-44`}>{row?.recipeNm}</td>
                  <td className={`${baseClass} w-16`}>{row?.recipeType?.nm}</td>
                  <td className={`${baseClass} w-12`}>〇</td>
                  <td className={`${baseClass} w-12` } onClick={() => switchDispIngred(index, !row?.dispIngred)}><i class="fa-solid fa-angle-down"></i></td>
                </tr>
                {row?.dispIngred ? <RecipeIngredRows recipeRow={row}/>: null}
            </div>))}
            <tr className="text-slate-400 mt-1 transition-all duration-500 ease-in-out transform hover:scale-100 hover:shadow-md hover:text-slate-700 hover:bg-white">
              <td 
                className="px-3 py-2 font-bold cursor-pointer" 
                onClick={openAddInputRecipe}
              >
                <i className="fa-regular fa-square-plus"></i>　レシピを追加
              </td>
            </tr>
            {isInputRecipeOpen ? <InputRecipe submitAction={submitAddRecipe} setEditData={setEditData}/>: null}
            {isEditRecipeOpen ? <InputRecipe submitAction={submitEditRecipe} editData={editData} setEditData={setEditData} />: null}
        </>

    );
  }

  export const RecipeContextMenu = ({ menuPosition, row, index, setEditRecipeId, setEditData, openEditInputRecipe, submitDeleteRecipe }) => {

    const handleEditClick = (e) => {
      openEditInputRecipe(row, index);
    };
  
    const handleDeleteClick = (e) => {
      submitDeleteRecipe(row, index);
    };

    useEffect(() => {
      setEditRecipeId(row?.recipeId);
      setEditData({ recipeNm: row?.recipeNm, recipeNmKana: row?.recipeNmKana, recipeType: row?.recipeType, recipeUrl: row?.recipeUrl });
    }, [row, setEditRecipeId, setEditData]);

    return (
      <ul 
        className="fixed bg-white border border-gray-300 shadow-lg rounded-md z-10" 
        style={{ top: menuPosition.y, left: menuPosition.x}} // クリック位置に表示
      >
        <ContextMenuRow label="編集" action={handleEditClick} />
        <ContextMenuRow label="削除" action={handleDeleteClick} />
      </ul>
    )
  }