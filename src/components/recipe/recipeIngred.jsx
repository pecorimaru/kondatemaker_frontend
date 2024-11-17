import '../../css/styles.css';
import '../../css/output.css';

import { useCallback, useEffect, useState } from 'react';
import { decamelizeKeys } from 'humps';

import * as Const from '../../constants/constants.js';

import { useKondateMaker } from '../global/global.jsx';
import { useOnClick, useOnScroll } from '../../hooks/useEventHandler.js';
import { useRecipeIngredList } from '../../hooks/useFetchData.js';

import { LoadingSpinner, AddRow, ContextMenu } from '../global/common.jsx';
import { IngredSelectForm } from '../form/ingredSelectForm.jsx';
import { apiClient } from '../../utils/axiosClient.js';


export const RecipeIngred = ({ recipe }) => {

  const { user, unitDict, unitDictStat, handleContextMenu, handleTouchStart, handleTouchEnd, closeContextMenu } = useKondateMaker();
  const { recipeIngredList, recipeIngredListStat, recipeIngredListMutate } = useRecipeIngredList(recipe?.recipeId);
  
  const [recipeIngredListDisp, setRecipeIngredListDisp] = useState();
  const [isAddIngred, setIsAddIngred] = useState(false);
  const [isEditIngred, setIsEditIngred] = useState(false);
  const [editRecipeIngredId, setEditRecipeIngredId] = useState();
  const [editData, setEditData] = useState();  

  // データフェッチしたレシピ食材リストを表示用リストにセット
  // ・各画面で同一のキー[contextMenuVisible]を利用することでコンテキストメニューのオープン/クローズ処理を共通化
  useEffect(() => {
    if (!recipeIngredListStat.isLoading) {
      setRecipeIngredListDisp(
        recipeIngredList?.map((item) => ({
          ...item,
          contextMenuVisible: false,
        }))
      );
    }
  }, [recipeIngredList, recipeIngredListStat.isLoading]);
  
   // 表示用リストで定義したフラグのスイッチング処理
   const switchFlgRecipeIngredAcc = useCallback((updIndex, key, flg, isAll=false) => {
    //  console.log(`updIndex:${updIndex} key:${key} flg:${flg} isAll:${isAll}`);
     if (recipeIngredList && recipeIngredListDisp) {
      setRecipeIngredListDisp(
        recipeIngredListDisp?.map((item, index) => ({
           ...item,
           [key]: isAll || index === updIndex ? flg : recipeIngredListDisp[index]?.[key],
         }))
       );    
     };
   }, [recipeIngredList, recipeIngredListDisp, setRecipeIngredListDisp]);

  // 画面クリック or スクロールでコンテキストメニューをクローズ
  useOnClick(() => closeContextMenu(switchFlgRecipeIngredAcc));
  useOnScroll(() => closeContextMenu(switchFlgRecipeIngredAcc));

  const openAddIngredForm = () => {
    closeContextMenu(switchFlgRecipeIngredAcc);  // 親明細を持つ明細行のコンテキストは明示的にクローズしないとなぜか消えない
    setIsAddIngred(true);
  };

  const openEditIngredForm = (row) => {
    console.log("row", row)
    console.log("edit", { ingredNm: row?.ingredNm, qty: row?.qty, unitCd: row?.unitCd, salesAreaType: row?.salesAreaType })
    closeContextMenu(switchFlgRecipeIngredAcc);  // 親明細を持つ明細行明細のコンテキストは明示的にクローズしないとなぜか消えない
    setEditRecipeIngredId(row?.recipeIngredId);
    setEditData({ ingredNm: row?.ingredNm, qty: row?.qty, unitCd: row?.unitCd, salesAreaType: row?.salesAreaType });
    setIsEditIngred(true);
  };

  const closeIngredForm = () => {
    setIsAddIngred(false);
    setIsEditIngred(false);
  };

  const submitAddRecipeIngred = async (formData) => {
    console.log(`レシピ食材追加 レシピID:${recipe?.recipeId} 食材名:${formData?.ingredNm} 必要量:${formData?.qty} 単位コード:${formData?.unitCd} 売り場区分${formData?.salesAreaType}`);
    try {
      const response = await apiClient.post(`${Const.ROOT_URL}/recipe/submitAddRecipeIngred`, { 
        recipeId: recipe?.recipeId,
        ingredNm: formData?.ingredNm,
        qty: formData?.qty, 
        unitCd: formData?.unitCd, 
        userId: user?.id 
      });
      const data = await response.data;
      if (data.statusCode === 200) {
        console.log("登録成功", data);
        recipeIngredListMutate([...recipeIngredList, data.newRecipeIngred]);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("登録失敗", error);
    }
    setIsAddIngred(false);
  };

  const submitEditRecipeIngred = async (formData) => {
    console.log(`レシピ食材更新 レシピ食材ID${editRecipeIngredId} レシピID:${recipe?.recipeId} 食材名:${formData?.ingredNm} 必要量:${formData?.qty} 単位コード:${formData?.unitCd} 売り場区分${formData?.salesAreaType}`);
      try {
        const response = await apiClient.put(`${Const.ROOT_URL}/recipe/submitEditRecipeIngred`, { 
          recipeIngredId: editRecipeIngredId,
          ingredNm: formData?.ingredNm,
          qty: formData?.qty, 
          unitCd: formData?.unitCd,
          userId: user?.id
        });
        const data = await response.data;
        if (data.statusCode === 200) {
          console.log("更新成功", data);
          recipeIngredListMutate(recipeIngredList.map((item) => (
            item?.recipeIngredId === editRecipeIngredId ? data.newRecipeIngred : item
          )));

        } else {
          throw new Error(data.message);
        }
      } catch (error) {
        console.error("更新失敗", error);
      }        
    setIsEditIngred (false);
  };

  const submitDeleteRecipeIngred = async (row) => {
    const deleteable = window.confirm("食材を削除します。\nよろしいですか？");
    if (deleteable) {
      const queryParams = new URLSearchParams(decamelizeKeys({ recipeIngredId: row?.recipeIngredId })).toString();
      try {
        const response = await apiClient.delete(`${Const.ROOT_URL}/recipe/submitDeleteRecipeIngred/query_params?${queryParams}`);
        const data = await response.data;
        if (data.statusCode === 200) {
          console.log("削除成功", data);
          recipeIngredListMutate(recipeIngredList.filter((item) => item.recipeIngredId !== row.recipeIngredId));
        } else {
          throw new Error(data.message);
        }
      } catch (error) {
        console.error("削除失敗", error);
      }        
    }
    closeContextMenu(switchFlgRecipeIngredAcc);
  };

  if (recipeIngredListStat.isLoading) {
    return (
      <tr className="flex justify-end">
        <td className="w-53 py-2"><LoadingSpinner /></td>
      </tr>
    )
  };

  return (
    <tr>
      <td>
        <table className="flex justify-end">
          <tbody>
            {recipeIngredListDisp?.map((row, index) => 
              <tr 
                key={row.recipeIngredId} 
                onContextMenu={(event) => handleContextMenu(event, index, switchFlgRecipeIngredAcc)}
                onTouchStart={(event) => handleTouchStart(event, index, switchFlgRecipeIngredAcc)} 
                onTouchEnd={handleTouchEnd} 
                className="detail-table-row"
              >
                <td className="detail-table-data bg-white w-36">
                  {row.ingredNm}
                </td>
                <td className="detail-table-data bg-white w-16">
                  {!unitDictStat.isLoading ? `${row.qty} ${unitDict[row.unitCd]}` : <LoadingSpinner />}

                  {/* gap-1 によって間隔が作られてしまうため最後の<td>タグエリアを間借りする */}
                  {row.contextMenuVisible && 
                    <ContextMenu menuList={[
                      {textContent: "編集", onClick: () => openEditIngredForm(row)},
                      {textContent: "削除", onClick: () => submitDeleteRecipeIngred(row, index)}
                    ]}/> 
                  }
                </td>
              </tr>
            )}
            <AddRow textContent="食材を追加" onClick={openAddIngredForm} cssWidth="w-53" />
          </tbody>
        </table>
        {isAddIngred && 
          <IngredSelectForm 
            prevScreenType={Const.PREV_SCREEN_TYPE.RECIPE_INGRED} 
            submitAction={submitAddRecipeIngred} 
            closeIngredForm={closeIngredForm} 
          />
        }
        {isEditIngred && 
          <IngredSelectForm 
            prevScreenType={Const.PREV_SCREEN_TYPE.RECIPE_INGRED} 
            submitAction={submitEditRecipeIngred} 
            closeIngredForm={closeIngredForm} 
            editData={editData} 
          />
        }
      </td>
    </tr>
  );
};
