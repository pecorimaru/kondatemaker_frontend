import { decamelizeKeys } from 'humps';

import { useFetchData } from "../utils/hooksutils";

export function useMenuPlanNm(user) {
    const { data, error, isLoading } = useFetchData("home/menuPlanNm", decamelizeKeys({ userId: user?.id }))
    return { menuPlanNm: data, menuPlanNmStat: { error, isLoading } };
  }
  
export function useMenuPlanList(user) {
    const { data, error, isLoading } = useFetchData("home/menuPlanList", decamelizeKeys({ userId: user?.id }))
    return { menuPlanList: data, menuPlanListStat: { error, isLoading } };
  }

export function useToweekRecipes(selectedPlan, user) {
  const { data, error, isLoading } = useFetchData("home/toweekRecipes", decamelizeKeys({ selectedPlan, userId: user?.id }))
  return { toweekRecipes: data, toweekRecipesStat: { error, isLoading } };
}

export function useBuyIngreds(user) {
const { data, error, isLoading } = useFetchData("buyList/buyIngreds", decamelizeKeys({ userId: user?.id }))
return { buyIngreds: data, buyIngredsStat: { error, isLoading } };
}

export function useUnitList() {
  const { data, error, isLoading } = useFetchData("inputIngred/unitList", {})
  return { unitList: data, unitListStat: { error, isLoading } };
}

export function useSalesAreaList() {
  const { data, error, isLoading } = useFetchData("inputIngred/salesAreaList", {})
  return { salesAreaList: data, salesAreaListStat: { error, isLoading } };
}

export function useInitItemsForIngred(ingredNm, userId) {
  const { data, error, isLoading } = useFetchData("inputIngred/initItemsForIngred", decamelizeKeys({ ingredNm, userId }))
  return { initItemsForIngred: data, initItemsForIngredStat: { error, isLoading } };
}

export function useRecipeList(user) {
  const { data, error, isLoading } = useFetchData("recipeList/recipeList", decamelizeKeys({ userId: user?.id }))
  return { recipeList: data, recipeListStat: { error, isLoading } };
}

export function useRecipeIngredList(recipeId) {
  const { data, error, isLoading } = useFetchData("recipeList/recipeIngredList", decamelizeKeys({ recipeId }))
  return { recipeIngredList: data, recipeIngredListStat: { error, isLoading } };
}

export function useRecipeTypeList() {
  const { data, error, isLoading } = useFetchData("inputRecipe/recipeTypeList", {})
  return { recipeTypeList: data, recipeTypeListStat: { error, isLoading } };
}
