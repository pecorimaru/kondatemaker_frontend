import '../../css/styles.css';
import '../../css/output.css';

import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

import * as Const from '../../constants/constants.js';

import { useKondateMaker } from '../global/global.jsx';
import { useMenuPlanList, useSelectedPlan, useToweekMenuPlanDetListDict } from '../../hooks/useFetchData.js';
import { useEventHandler } from '../../hooks/useEventHandler.js';
import { LoadingSpinner } from '../global/common.jsx';
import { ToweekMenuPlanDet } from './toweekMenuPlanDet.jsx';
import { apiClient } from '../../utils/axiosClient.js';


export const Home = () => {
 
  const { user, weekdayDict, weekdayDictStat } = useKondateMaker();

  const { selectedPlan, selectedPlanStat, selectedPlanMutate } = useSelectedPlan(user?.id);
  const { menuPlanList, menuPlanListStat } = useMenuPlanList(user?.id);

  // 献立プラン曜日毎明細リスト
  // 曜日をキーとして献立プラン明細をリスト形式で格納
  // データイメージ
  // ・[日] [レシピ１, レシピ２, ...]
  // ・[月] [レシピ１, レシピ２, ...]
  // 　...
  const { toweekMenuPlanDetListDict, toweekMenuPlanDetListDictStat, toweekMenuPlanDetListDictMutate } = useToweekMenuPlanDetListDict(user?.id);
  
  const [selectedPlanDisp, setSelectedPlanDisp] = useState({ menuPlanId: null, menuPlanNm: ""});
  const [toweekMenuPlanDetListDictDisp, setToweekMenuPlanDetListDictDisp] = useState();
  const [isMenuPlanComboBoxOpen, setIsMenuPlanComboBoxOpen] = useState(false);
  const menuPlanComboBoxRef = useRef(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // データフェッチした選択中献立プランを表示用変数にセット
  useEffect(() => {
    if(!selectedPlanStat?.isLoading) {
      if (selectedPlan) {
        setSelectedPlanDisp(selectedPlan);
      } else {
        setSelectedPlanDisp({ menuPlanId: null, menuPlanNm: "未選択"});
      }
    };
  }, [selectedPlan, selectedPlanStat?.isLoading, setSelectedPlanDisp]); 

  // データフェッチした献立プラン曜日毎明細リストを表示用リストにセット
  useEffect(() => {
    if(!toweekMenuPlanDetListDictStat?.isLoading) {
      setToweekMenuPlanDetListDictDisp(toweekMenuPlanDetListDict);
    };
  }, [toweekMenuPlanDetListDict, toweekMenuPlanDetListDictStat?.isLoading, setToweekMenuPlanDetListDictDisp]); 

  const handleMenuPlanComboBoxClick = async (menuPlan) => {
    setIsMenuPlanComboBoxOpen(false);
    if (selectedPlan.menuPlanId === menuPlan.menuPlanId) {
      setIsMenuPlanComboBoxOpen(false);
      return;
    };
    const changeable = window.confirm("今週の献立を変更すると追加した食材や購入状況がクリアされます。\nよろしいですか？");
    if (!changeable) {
      return;
    };

    setSelectedPlanDisp({ menuPlanId: menuPlan.menuPlanId, menuPlanNm: menuPlan.menuPlanNm });
    setIsRefreshing(true)
    try {
      const response = await apiClient.put(`${Const.ROOT_URL}/home/submitRecreateToweekMenuPlan`, { selectedPlanId: menuPlan.menuPlanId, userId: user?.id });
      const data  = response.data;
      console.log("更新成功", data);
      selectedPlanMutate({ menuPlanId: menuPlan.menuPlanId, menuPlanNm: menuPlan.menuPlanNm });
      toweekMenuPlanDetListDictMutate(data.newToweekMenuPlanDetListDict);
    } catch (error) {
      console.error("更新失敗", error);
    } finally {
      setIsRefreshing(false);
    };

  };

  // 入力候補 or レシピ名 以外を押下した場合に入力候補エリアを非表示
  const handleClickOutside = (e) => {
    if (!menuPlanComboBoxRef?.current.contains(e.target)) {
      setIsMenuPlanComboBoxOpen(false);
    };
  };
  useEventHandler("mousedown", handleClickOutside);

  return(
    <div className="flex items-center justify-center h-screen w-full" style={{height: "calc(100vh - 80px)"}}>
      <table>
        <tbody>
          <tr className="flex justify-center gap-1.5">
            <td className="text-center py-2.5 w-28 text-base text-white bg-blue-900 shadow-lg rounded-sm">
              今週の献立
            </td>
            <td 
              className="flex justify-between w-48 bg-white shadow-md rounded-sm"
              onClick={() => setIsMenuPlanComboBoxOpen(!isMenuPlanComboBoxOpen)}
              ref={menuPlanComboBoxRef}
            >
              <button className="py-2 w-full">
                {!selectedPlanStat.isLoading ? selectedPlanDisp?.menuPlanNm : <LoadingSpinner /> }
              </button>
              <div className="flex items-center w-6 cursor-pointer z-10">
                  <i className="fa-solid fa-caret-down" />
              </div>
              {isMenuPlanComboBoxOpen && (
                <ul className="absolute w-48 bg-white border rounded-md shadow-lg">
                  {!menuPlanListStat.isLoading ? menuPlanList?.map((menuPlan, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                    onClick={() => handleMenuPlanComboBoxClick(menuPlan)}
                  >
                    {menuPlan.menuPlanNm}
                  </li>
                  )): <li className="flex justify-center items-center h-10"><LoadingSpinner /></li>}
                </ul>
              )}
            </td>
          </tr>
          {!weekdayDictStat.isLoading && Object.entries(weekdayDict)?.map((weekday) => (
            <React.Fragment key={weekday[Const.DICT_IDX.CD]}>
              <ToweekMenuPlanDet weekdayCd={weekday[Const.DICT_IDX.CD]} toweekMenuPlanDetListDictDisp={toweekMenuPlanDetListDictDisp} toweekMenuPlanDetListDictMutate={toweekMenuPlanDetListDictMutate} isRefreshing={isRefreshing} />
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};
