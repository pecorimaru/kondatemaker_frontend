import { decamelizeKeys } from 'humps';
import useSWR from 'swr'
import * as Const from '../constants/constants.js';
import { fetcher, hasNullOrUndefined } from '../utils/requestutils.js';

/**
 * useSWR を用いたデータフェッチ用フック
 * params に null or undifined が含まれる場合：null
 * params が 0 件の場合：クエリパラメータを省略
 * @param  {string} key    - エンドポイント
 * @param  {object} params - パラメータ
 * @returns { data, error, isLoading } 戻り値の説明を書く
 */
export function useFetchData(key, params) {

  let fetchUrl;

  if (hasNullOrUndefined(params)) {
    fetchUrl = null;
  } else if (Object.keys(params).length === 0) {
    fetchUrl = `${Const.ROOT_URL}/${key}`;
  } else {
    const queryParams = new URLSearchParams(params).toString();
    fetchUrl = `${Const.ROOT_URL}/${key}/queryParams?${queryParams}`;
  }
  return useSWR(fetchUrl, fetcher);
};

export function useUnitDict() {
  const { data, error, isLoading } = useFetchData("const/unitDict", {});
  return { unitDict: data, unitDictStat: { error, isLoading } };
};

export function useRecipeTypeDict() {
  const { data, error, isLoading } = useFetchData("const/recipeTypeDict", {})
  return { recipeTypeDict: data, recipeTypeDictStat: { error, isLoading } };
}

export function useSalesAreaDict() {
  const { data, error, isLoading } = useFetchData("const/salesAreaDict", {});
  return { salesAreaDict: data, salesAreaDictStat: { error, isLoading } };
};

export function useWeekdayDict() {
  const { data, error, isLoading } = useFetchData("const/weekdayDict", {});
  return { weekdayDict: data, weekdayDictStat: { error, isLoading } };
};

export function useLoginUser(isLoggedIn) {
  const { data, error, isLoading, mutate } = useFetchData("setting/loginUser", decamelizeKeys({ isLoggedIn }));
  return { loginUser: data, loginUserStat: { error, isLoading }, loginUserMutate: mutate };  
}

export function useCurrentGroup(isLoggedIn) {
  const { data, error, isLoading, mutate } = useFetchData("setting/currentGroup", decamelizeKeys({ isLoggedIn }));
  return { currentGroup: data, currentGroupStat: { error, isLoading }, currentGroupMutate: mutate };  
}

export function useGroupList() {
  const { data, error, isLoading, mutate } = useFetchData("setting/groupList", {});
  return { groupList: data, groupListStat: { error, isLoading }, groupListMutate: mutate };
};

export function useGroupMemberList() {
  const { data, error, isLoading, mutate } = useFetchData("setting/groupMemberList", {});
  return { groupMemberList: data, groupMemberListStat: { error, isLoading }, groupMemberListMutate: mutate };
};

export function useIngredList() {
  const { data, error, isLoading, mutate } = useFetchData("ingred/ingredList", {});
  return { ingredList: data, ingredListStat: { error, isLoading }, ingredListMutate: mutate };
};

export function useIngredUnitConvList(ingredId) {
  const { data, error, isLoading, mutate } = useFetchData("ingred/ingredUnitConvList", decamelizeKeys({ ingredId }));
  return { ingredUnitConvList: data, ingredUnitConvListStat: { error, isLoading }, ingredUnitConvListMutate: mutate };
};

export function useIngredNmSuggestions(inputValue) {
  const { data, error, isLoading } = useFetchData("ingredForm/ingredNmSuggestions", decamelizeKeys({ inputValue }));
  return { ingredNmSuggestions: data, ingredNmSuggestionsStat: { error, isLoading } };
};

export function useDefaultSetsByIngred(ingredNm) {
  const { data, error, isLoading } = useFetchData("ingredForm/defaultSetsByIngred", decamelizeKeys({ ingredNm }));
  return { defaultSetsByIngred: data, defaultSetsByIngredStat: { error, isLoading } };
};

export function useUnitDictByIngred(ingredNm) {
  const { data, error, isLoading } = useFetchData("ingredForm/unitDictByIngred", decamelizeKeys({ ingredNm }));
  return { unitDictByIngred: data, unitDictByIngredStat: { error, isLoading } };
};

export function useRecipeList() {
  const { data, error, isLoading, mutate } = useFetchData("recipe/recipeList", {});
  return { recipeList: data, recipeListStat: { error, isLoading }, recipeListMutate: mutate };
};

export function useRecipeNmSuggestions(inputValue) {
  const { data, error, isLoading } = useFetchData("recipeForm/recipeNmSuggestions", decamelizeKeys({ inputValue }));
  return { recipeNmSuggestions: data, recipeNmSuggestionsStat: { error, isLoading } };
};

export function useRecipeIngredList(recipeId) {
  const { data, error, isLoading, mutate } = useFetchData("recipe/recipeIngredList", decamelizeKeys({ recipeId }));
  return { recipeIngredList: data, recipeIngredListStat: { error, isLoading } , recipeIngredListMutate: mutate};
};

export function useMenuPlanList() {
    const { data, error, isLoading, mutate } = useFetchData("menuPlan/menuPlanList", {});
    return { menuPlanList: data, menuPlanListStat: { error, isLoading }, menuPlanListMutate: mutate };
  };

export function useMenuPlanDetList(menuPlanId) {
  const { data, error, isLoading, mutate } = useFetchData("menuPlan/menuPlanDetList", decamelizeKeys({ menuPlanId }));
  return { menuPlanDetList: data, menuPlanDetListStat: { error, isLoading }, menuPlanDetListMutate: mutate };
  };

export function useSelectedPlan() {
  const { data, error, isLoading, mutate } = useFetchData("home/slectedPlan", {});
  return { selectedPlan: data, selectedPlanStat: { error, isLoading }, selectedPlanMutate: mutate };
};

export function useToweekMenuPlanDetListDict() {
const { data, error, isLoading, mutate } = useFetchData("home/toweekMenuPlanDetListDict", {});
return { toweekMenuPlanDetListDict: data, toweekMenuPlanDetListDictStat: { error, isLoading }, toweekMenuPlanDetListDictMutate: mutate };
};

export function useBuyIngredList() {
const { data, error, isLoading, mutate } = useFetchData("buy/buyIngredList", {});
return { buyIngredList: data, buyIngredListStat: { error, isLoading }, buyIngredListMutate: mutate };
};





  

