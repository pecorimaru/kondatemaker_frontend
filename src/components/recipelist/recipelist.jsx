
import '../../css/styles.css';
import '../../css/output.css';
import { useEffect, useState } from 'react';
import { useKondateMaker } from '../global';
import { RecipeRow } from './reciperow';



export const RecipeList = () => {

  const { recipeList, recipeListStat } = useKondateMaker();
  const [dispRecipeList, setDispRecipeList] = useState()

  useEffect(() => {
    console.log("rendaring")
    if (!recipeListStat.isLoading) {
      setDispRecipeList(
        recipeList
        ?.map((item, index) => ({
          ...item,
          num: index +1,
          dispIngred: false,
          menuVisible: false
        }))
      )
    }
  }, [recipeList, recipeListStat.isLoading]);




  return(
    <div className="flex justify-center w-full bg-slate-200">
      <div className="mt-16 mb-24">
        <table className="mt-3 text-xs">
          <thead>
            <tr className="flex justify-center text-white gap-1">
              <th className="bg-blue-900 py-2 font-bold shadow-lg w-44">レシピ名</th>
              <th className="bg-blue-900 py-2 font-bold shadow-lg w-16">分類</th>
              <th className="bg-blue-900 py-2 font-bold shadow-lg w-12">リンク</th>
              <th className="bg-blue-900 py-2 font-bold shadow-lg w-12">食材</th>
            </tr>
          </thead>
          <tbody>
            <RecipeRow
              dispRecipeList={dispRecipeList}
              setDispRecipeList={setDispRecipeList}
            />
          </tbody>
        </table>
      </div>    

    </div>
  );
}    


export const ContextMenuRow = ({ label, action }) => {
  return (
    <li 
      className="cursor-pointer py-2 px-4 font-bold duration-500 hover:bg-blue-100"
      onClick={(e) => action(action)}
    >
      {label}
    </li>
  )
}

