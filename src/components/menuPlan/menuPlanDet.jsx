import '../../css/styles.css';
import '../../css/output.css';

import { useCallback, useEffect, useState } from 'react';
import { decamelizeKeys } from 'humps';

import * as Const from '../../constants/constants.js';
import { useKondateMaker } from '../global/global.jsx';
import { useEventHandler } from '../../hooks/useEventHandler.js';
import { useMenuPlanDetList } from '../../hooks/useFetchData.js';

import { AddRow, ContextMenu, LoadingSpinner } from '../global/common.jsx';
import { MenuPlanDetForm } from '../form/menuPlanDetForm.jsx';
import { apiClient } from '../../utils/axiosClient.js';

export const MenuPlanDet = ({ menuPlan }) => {

  const { 
    weekdayDict, 
    weekdayDictStat, 
    handleContextMenu, 
    touchStart, 
    touchEnd,
    closeContextMenu, 
    showMessage, 
    clearMessage,
    setIsOpeningForm,
  } = useKondateMaker();
  
  const { menuPlanDetList, menuPlanDetListStat, menuPlanDetListMutate } = useMenuPlanDetList(
    menuPlan.menuPlanDetVisible !== null ? menuPlan?.menuPlanId : null
  );
  const [menuPlanDetListDisp, setMenuPlanDetListDisp] = useState();
  const [isAddMenuPlanDet, setIsAddMenuPlanDet] = useState(false);
  const [isEditMenuPlanDet, setIsEditMenuPlanDet] = useState(false);
  const [editMenuPlanDetId, setEditMenuPlanDetId] = useState(null);
  const [editData, setEditData] = useState();
  
  // データフェッチした献立プラン明細リストを表示用リストにセット
  // ・各画面で同一のキー[contextMenuVisible]を利用することでコンテキストメニューのオープン/クローズ処理を共通化
  useEffect(() => {
    if (!menuPlanDetListStat.isLoading) {
      setMenuPlanDetListDisp(
        menuPlanDetList?.map((item) => ({
          ...item,
          contextMenuVisible: false,
        }))
      );
    }
  }, [menuPlanDetList, menuPlanDetListStat.isLoading]);

  // 表示用リストで定義したフラグのスイッチング処理
  const switchFlgMenuPlanDetAcc = useCallback((updIndex, key, flg, isAll=false) => {
    // console.log(`updIndex:${updIndex} key:${key} flg:${flg} isAll:${isAll}`);
    if (menuPlanDetList && menuPlanDetListDisp) {
      setMenuPlanDetListDisp(
        menuPlanDetListDisp?.map((item, index) => ({
          ...item,
          [key]: isAll || index === updIndex ? flg : menuPlanDetListDisp[index]?.[key],
        }))
      );    
    };
  }, [menuPlanDetList, menuPlanDetListDisp, setMenuPlanDetListDisp]);

  // 画面クリック or スクロールでコンテキストメニューをクローズ
  useEventHandler("click", () => closeContextMenu(switchFlgMenuPlanDetAcc));
  useEventHandler("scroll", () => closeContextMenu(switchFlgMenuPlanDetAcc));

  const submitAddMenuPlanDet = async (formData) => {
    clearMessage();
    console.log(`献立明細追加 献立ID:${menuPlan?.menuPlanId} 曜日:${formData?.weekdayCd} レシピ名:${formData?.recipeNm}`);
    try {
      const response = await apiClient.post(`${Const.ROOT_URL}/menuPlan/submitAddMenuPlanDet`, { 
        menuPlanId: menuPlan?.menuPlanId,
        weekdayCd: formData?.weekdayCd,
        recipeNm: formData?.recipeNm, 
      });
      const data = await response.data;
      console.log(data.message, data);
      menuPlanDetListMutate([...menuPlanDetList, data.newMenuPlanDet]);
      setIsAddMenuPlanDet(false);
    } catch (error) {
      showMessage(error?.response?.data?.detail || error?._messageTimeout || Const.MSG_MISSING_REQUEST, Const.MESSAGE_TYPE.ERROR);
    };
  };

  const openAddMenuPlanDetForm = () => {
    closeContextMenu(switchFlgMenuPlanDetAcc);    // 親明細を持つ明細行のコンテキストは明示的にクローズしないとなぜか消えない
    setIsAddMenuPlanDet(true);
  };

  const openEditMenuPlanDetForm = (row) => {
    console.log("editData", { weekdayCd: row?.weekdayCd, recipeNm: row?.recipeNm })
    closeContextMenu(switchFlgMenuPlanDetAcc);    // 親明細を持つ明細行のコンテキストは明示的にクローズしないとなぜか消えない
    setEditMenuPlanDetId(row?.menuPlanDetId);
    setEditData({ weekdayCd: row?.weekdayCd, recipeNm: row?.recipeNm });
    setIsEditMenuPlanDet(true);
  };

  const closeMenuPlanDetForm = () => {    
    setIsAddMenuPlanDet(false);
    setIsEditMenuPlanDet(false);
    setIsOpeningForm(false);
  };

  const submitEditMenuPlanDet = async (formData) => {
    clearMessage();
    console.log(`献立明細更新 献立ID:${menuPlan?.menuPlanId} 曜日:${formData?.weekdayCd}, レシピ名:${formData?.recipeNm}`);
    try {
      const response = await apiClient.put(`${Const.ROOT_URL}/menuPlan/submitEditMenuPlanDet`, { 
        menuPlanDetId: editMenuPlanDetId,
        weekdayCd: formData?.weekdayCd,
        recipeNm: formData?.recipeNm, 
      });
      const data = await response.data;
      console.log(data.message, data);
      menuPlanDetListMutate(menuPlanDetList?.map((item) => (
        item.menuPlanDetId === data.newMenuPlanDet.menuPlanDetId ? data.newMenuPlanDet : item
      )));
    } catch (error) {
      showMessage(error?.response?.data?.detail || error?._messageTimeout || Const.MSG_MISSING_REQUEST, Const.MESSAGE_TYPE.ERROR);
    }        
    setIsEditMenuPlanDet(false);
  };

  const submitDeleteMenuPlanDet = async (row) => {
    console.log("menuPlanDetId", row?.menuPlanDetId);
    const deleteable = window.confirm("献立明細を削除します。\nよろしいですか？");
    if (!deleteable) {
      return;
    };
    clearMessage();
    const queryParams = new URLSearchParams(decamelizeKeys({ menuPlanDetId: row?.menuPlanDetId })).toString();
    try {
      const response = await apiClient.delete(`${Const.ROOT_URL}/menuPlan/submitDeleteMenuPlanDet/query_params?${queryParams}`);
      const data = await response.data;
      console.log(data.message, data);
      menuPlanDetListMutate(menuPlanDetList?.filter((item) => (item.menuPlanDetId !== row?.menuPlanDetId)));
    } catch (error) {
      showMessage(error?.response?.data?.detail || error?._messageTimeout || Const.MSG_MISSING_REQUEST, Const.MESSAGE_TYPE.ERROR);
    };
    closeContextMenu(switchFlgMenuPlanDetAcc);
  };

  if (menuPlanDetListStat.isLoading) {
    return (
      <>
        {menuPlan.menuPlanDetVisible &&
          <tr>
            <td className="flex justify-end">
              <div className="w-61 py-2"><LoadingSpinner /></div>
            </td>
          </tr>
        }
      </>
    )
  };

  return (
    <tr>
      <td>
        <table className="flex justify-end overflow-hidden">
            <tbody
              style={{
                height: `${menuPlan.menuPlanDetVisible ? menuPlanDetList?.length * 44 + 48 : 0}px`,
                transition: 'height 0.3s ease',
              }}
            >
            {menuPlanDetListDisp?.map((row, index) =>             
              <tr 
                key={row.menuPlanDetId} 
                onContextMenu={(event) => handleContextMenu(event, index, switchFlgMenuPlanDetAcc)}
                onTouchStart={(event) => touchStart(event, index, switchFlgMenuPlanDetAcc)} 
                onTouchEnd={touchEnd} 
                className="detail-table-row"
              >
                <td className={`detail-table-data w-16 ${Const.DAYWISE_ITEMS[row.weekdayCd]?.bgColor}`}>
                  {!weekdayDictStat.isLoading ? weekdayDict[row.weekdayCd] : <LoadingSpinner />}
                </td>
                <td className="detail-table-data bg-white w-44">
                  {`${row.recipeNm}`}

                  {/* gap-1 によって間隔が作られてしまうため最後の<td>タグエリアを間借りする */}
                  {row.contextMenuVisible &&
                    <ContextMenu menuList={[
                      {textContent: "編集", onClick: () => openEditMenuPlanDetForm(row)},
                      {textContent: "削除", onClick: () => submitDeleteMenuPlanDet(row)},
                    ]} />
                  }
                </td>
              </tr>
            )}
            <AddRow textContent="献立を追加" onClick={openAddMenuPlanDetForm} cssWidth="w-61" />
          </tbody>
        </table>
        {isAddMenuPlanDet && <MenuPlanDetForm submitAction={submitAddMenuPlanDet} closeMenuPlanDetForm={closeMenuPlanDetForm} />}
        {isEditMenuPlanDet && <MenuPlanDetForm submitAction={submitEditMenuPlanDet} closeMenuPlanDetForm={closeMenuPlanDetForm} editData={editData} />}
      </td>
    </tr>
  );
};
  