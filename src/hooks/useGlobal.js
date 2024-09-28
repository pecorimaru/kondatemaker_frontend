import { useFetchData } from "../utils/hooksutils";

export function useMenuPlanNm(user) {
    const { data, error, isLoading } = useFetchData("home/menuPlanNm", { user_id: user?.id })
    return { menuPlanNm: data, menuPlanNmStat: { error, isLoading } };
  }
  
export function useMenuPlanList(user) {
    const { data, error, isLoading } = useFetchData("home/menuPlanList", { user_id: user?.id })
    return { menuPlanList: data, menuPlanListStat: { error, isLoading } };
  }

export function useToweekRecipes(selectedPlan, user) {
  const { data, error, isLoading } = useFetchData("home/toweekRecipes", { selected_plan: selectedPlan, user_id: user?.id })
  return { toweekRecipes: data, toweekRecipesStat: { error, isLoading } };
}

export function useBuyIngreds(user) {
const { data, error, isLoading } = useFetchData("buyList/buyIngreds", { user_id: user?.id })
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
  const { data, error, isLoading } = useFetchData("inputIngred/initItemsForIngred", { ingredNm, userId })
  return { initItemsForIngred: data, initItemsForIngredStat: { error, isLoading } };
}
