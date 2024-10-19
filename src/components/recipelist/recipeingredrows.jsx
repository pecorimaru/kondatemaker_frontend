import axios from 'axios';
import * as Const from '../../constants/constants.js';
import { ContextMenuRow } from "./recipelist";

import { useCallback, useEffect, useState } from 'react';
import { mutate } from 'swr';
import { useKondateMaker } from '../global.jsx';
import { InputIngred } from '../inputform/inputingred.jsx';
import { useRecipeIngredList } from '../../hooks/useglobal.js';
import { LoadingSpinner } from '../common.jsx';
import { EditIngred } from '../inputform/editingred.jsx';
import { decamelizeKeys } from 'humps';


export const RecipeIngredRows = ({ recipeRow }) => {

  const { user, setMenuPosition, isInputIngredOpen, setIsInputIngredOpen, isEditIngredOpen , setIsEditIngredOpen } = useKondateMaker();
  const { recipeIngredList, recipeIngredListStat } = useRecipeIngredList(recipeRow?.recipeId);


  const [editInitData, setEditInitData] = useState();
  const [touchTimeout, setTouchTimeout] = useState(null);
  const [dispRecipeIngredList, setDispRecipeIngredList] = useState(
    recipeIngredList?.map((item, index) => ({
      ...item,
      num: index +1,
      menuVisible: false,
    }))
  );

  // レシピ食材リストの更新
  useEffect(() => {
    console.log("レシピ食材リストの更新");
    if (!recipeIngredListStat.isLoading) {
      setDispRecipeIngredList(
        recipeIngredList?.map((item, index) => ({
          ...item,
          num: index +1,
          menuVisible: false,
        }))
      );
    }
  }, [recipeIngredList, recipeIngredListStat.isLoading]);
  
  const showRecipeIngredContextMenu = (updIndex) => {
    console.log(updIndex);
    setDispRecipeIngredList(
      recipeIngredList?.map((item, index) => ({
        ...item,
        num: index +1,
        menuVisible: index === updIndex ? true : false,
      }))
    );
  };
  
  const closeRecipeIngredContextMenu = useCallback(() => {
    setDispRecipeIngredList(
      recipeIngredList?.map((item, index) => ({
        ...item,
        num: index +1,
        menuVisible: false,
      }))
    )
  }, [recipeIngredList]);

  const submitAddRecipeIngred = async (formData) => {

    console.log(`submitAddBuyIngred ${recipeRow?.recipeId} ${formData?.ingredNm}, ${formData?.qty}, ${formData?.unitNm}, ${formData?.salesAreaNm}`)
    try {
      const response = await axios.post(`${Const.ROOT_URL}/recipeList/submitAddRecipeIngred`, { 
        recipeId: recipeRow?.recipeId,
        ingredNm: formData?.ingredNm,
        qty: formData?.qty, 
        unitNm: formData?.unitNm, 
        userId: user?.id 
      });
      const data = await response.data;
      if (data.statusCode === 200) {
        console.log(data)
        const key = `${Const.ROOT_URL}/recipeList/recipeIngredList/query_params?recipe_id=${recipeRow?.recipeId}`;
        mutate(key, recipeIngredList, { revalidate: true });
        // appendRecipeIngred(data?.newRecipeIngred);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("登録失敗", error);
    }
    setIsInputIngredOpen(false);
  };

  const submitEditRecipeIngred = async (formData) => {
    console.log(`submitEditRecipeIngred ${formData?.ingredNm}, ${formData?.qty}, ${formData?.unitNm}`)

      try {
        const response = await axios.put(`${Const.ROOT_URL}/recipeList/submitEditRecipeIngred`, { 
          recipeIngredId: isEditIngredOpen?.recipeIngredId,
          ingredNm: formData?.ingredNm,
          qty: formData?.qty, 
          unitNm: formData?.unitNm,
          userId: user?.id
        });
        const data = await response.data;
        if (data.statusCode === 200) {
          console.log(data.message)
          console.log(`recipe_id:${recipeRow?.recipeId} `)
          const key = `${Const.ROOT_URL}/recipeList/recipeIngredList/query_params?recipe_id=${recipeRow?.recipeId}`;
          mutate(key, recipeIngredList, { revalidate: true });

        } else {
          throw new Error(data.message);
        }
      } catch (error) {
        console.error("更新失敗", error);
      }        
    // }
    setIsEditIngredOpen ({ isOpen: false, recipeIngredId: null });
  };

  const submitDeleteRecipeIngred = async (row, index) => {

    console.log(row?.recipeIngredId)
    const deleteable = window.confirm("食材を削除します。\nよろしいですか？")
    if (deleteable) {

      const queryParams = new URLSearchParams(decamelizeKeys({ recipeIngredId: row?.recipeIngredId })).toString();
      try {
        const response = await axios.delete(`${Const.ROOT_URL}/recipeList/submitDeleteRecipeIngred/query_params?${queryParams}`);
        const data = await response.data;
        if (data.statusCode === 200) {
          // spliceRecipeIngred(index);
          console.log(data.message)
          console.log(`recipe_id:${recipeRow?.recipeId} index:${index}`)
          const key = `${Const.ROOT_URL}/recipeList/recipeIngredList/query_params?recipe_id=${row?.recipeId}`;
          mutate(key, recipeIngredList, { revalidate: true });
        } else {
          throw new Error(data.message);
        }
      } catch (error) {
        console.error("削除失敗", error);
      }        
    }

    closeRecipeIngredContextMenu();
  };

  // レシピ食材_コンテキストメニュークローズ
  useEffect(() => {
    window.addEventListener('click', closeRecipeIngredContextMenu);
    return () => {
      window.removeEventListener('click', closeRecipeIngredContextMenu);
    };
  }, [closeRecipeIngredContextMenu]);


  
  const openAddInputIngred = () => {
    setIsInputIngredOpen(true);
  };


  const openEditInputIngred = (row, updIndex) => {
    console.log(`モーダルオープン_レシピ食材ID：${updIndex}`)
    setIsEditIngredOpen({ isOpen: true, recipeIngredId: row?.recipeIngredId });
    setEditInitData(JSON.parse(JSON.stringify(row)));
  };


  // 右クリックでコンテキストメニュー
  const handleContextMenu = (event, updIndex) => {
    event.preventDefault();
    console.log("contextmenu");
    showRecipeIngredContextMenu(updIndex)
    setMenuPosition({ x: event.clientX, y: event.clientY -50 });
  };
  
  // タッチ開始（長押し用）
  const handleContextMenuTouchStart = (event, index) => {
    const touch = event.touches[0];
    setTouchTimeout(setTimeout(() => {
      setMenuPosition({ x: touch.clientX +50, y: touch.clientY -70 });
      showRecipeIngredContextMenu(index);
    }, 500));  // 500ms 長押しでポップアップを表示
  };

  // タッチ終了（長押しキャンセル）
  const handleContextMenuTouchEnd = () => {
    clearTimeout(touchTimeout);  // タッチが終了した場合はタイマーをリセット
    window.addEventListener('touchend', handleContextMenuTouchEnd);
    return () => {
      window.removeEventListener('touchend', handleContextMenuTouchEnd);
    };
  };

  const baseClass = "bg-white py-2 font-bold shadow-lg duration-500 hover:bg-blue-100";

  return (
    <>
      {recipeIngredListStat.isLoading ? <LoadingSpinner /> : dispRecipeIngredList?.map((row, index) => 
        <div className="flex justify-end ">
          <tr 
            key={row?.recipe_ingred_id} 
            onContextMenu={(event) => handleContextMenu(event, index)}
            onTouchStart={(event) => handleContextMenuTouchStart(event, index)} 
            onTouchEnd={handleContextMenuTouchEnd} 
            className="flex justify-end text-slate-700 text-center gap-1 mt-1 w-53 select-none"
          >
            {row?.menuVisible ? 
              <RecipeIngredContextMenu 
                row={row}
                index={index}
                openEditInputIngred={openEditInputIngred}
                submitDeleteRecipeIngred={submitDeleteRecipeIngred}
              /> 
            : null}
            <td className={`${baseClass} w-36`}>{row?.ingredNm}</td>
            <td className={`${baseClass} w-16`}>{`${row?.qty} ${row?.unitNm}`}</td>
          </tr>
        </div>
      )
      }
      {recipeIngredListStat.isLoading ? null :
        <tr className="flex justify-end text-slate-400 mt-1">
          <td 
            className="px-3 py-2 font-bold cursor-pointer w-53 transition-all duration-500 ease-in-out transform hover:scale-100 hover:shadow-md hover:text-slate-700 hover:bg-white" 
            onClick={openAddInputIngred}
          >
          <i className="fa-regular fa-square-plus"></i>　食材を追加
          </td>
        </tr>
      }
      {isInputIngredOpen ? <InputIngred submitAction={submitAddRecipeIngred} />: null}
      {isEditIngredOpen?.isOpen ? <EditIngred submitAction={submitEditRecipeIngred} initData={editInitData} isEditIngredOpen={isEditIngredOpen} setIsEditIngredOpen={setIsEditIngredOpen} />: null}

    </>
    );
  }
  
  export const RecipeIngredContextMenu = ({ row, index, openEditInputIngred, submitDeleteRecipeIngred}) => {

    const { menuPosition } = useKondateMaker();

    // const openEditInputIngred = () => {
    //   console.log(`モーダルオープン_レシピ食材ID：${updIndex} ${row.recipe_ingred_id}`);
    //   setDispRecipeIngredList(
    //     recipeIngredList?.map((item, index) => ({
    //       ...item,
    //       num: index +1,
    //       menuVisible: false,
    //       isEditIngredOpen: index === updIndex ? true : false
    //     }))
    //   );
    //   setEditInitData(JSON.parse(JSON.stringify(row)));
    // };

    
    // submitDeleteRecipeIngredを直接呼び出すとイベント伝播するので、handleEditClickを定義
    const handleEditClick = (e) => {
      openEditInputIngred(row, index);
    };
  
    const handleDeleteClick = (e) => {
      submitDeleteRecipeIngred(row, index);
    };

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