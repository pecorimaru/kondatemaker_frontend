import '../../css/styles.css';
import '../../css/output.css';

import { useKondateMaker } from '../global/global.jsx';
import { ContextMenu, LoadingSpinner } from '../global/common.jsx';
import { useState } from 'react';

export const BuyIngred = ({ row, index, switchFlgBuyIngredAcc, submitSwitchCompletion, openEditIngredForm, submitDeleteBuyIngred }) => {

  const { 
    unitDict, 
    unitDictStat, 
    salesAreaDict, 
    salesAreaDictStat, 
    handleContextMenu, 
    touchStart, 
    touchEnd,
  } = useKondateMaker();

  const [isHovered, setIsHovered] = useState(false);
  const cssColor = row?.isBought ? "bg-slate-300 text-slate-500" : "bg-white text-slate-900";

  const handleTouchStart = (e) => {
    setIsHovered(!isHovered);
    touchStart(e, index, switchFlgBuyIngredAcc);
  }

  const handleOpenEditIngredForm = () => {
    setIsHovered(false);
    openEditIngredForm(row, index);
  };

  const handleSubmitDeleteBuyIngred = () => {
    setIsHovered(false);
    submitDeleteBuyIngred(row, index);
  };

  return (
    <tr 
      key={row.buyIngredId} 
      onContextMenu={(e) => handleContextMenu(e, index, switchFlgBuyIngredAcc)}
      onTouchStart={(e) => handleTouchStart(e)} 
      onTouchEnd={touchEnd} 
      onScroll={touchEnd}
      className={"detail-table-row"}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <td 
        className={`${cssColor} ${isHovered && "bg-blue-100"} detail-table-data w-8 cursor-pointer`} 
        onClick={() => submitSwitchCompletion(row)}
      >
        <input className="cursor-pointer"
          type="checkbox"
          checked={row.isBought}
          onChange={() => submitSwitchCompletion(row)}
        />
      </td>
      <td className={`${cssColor} ${isHovered && "bg-blue-100"} detail-table-data w-32`}>
        {row.ingredNm}
      </td>
      <td className={`${cssColor} ${isHovered && "bg-blue-100"} detail-table-data w-16`}>
        {!unitDictStat.isLoading ? 
          `${Math.round(row.qty * 100) / 100} ${unitDict[row.unitCd]}`: <LoadingSpinner />
        }
      </td>
      <td className={`${cssColor} ${isHovered && "bg-blue-100"} detail-table-data w-28`}>
        {!salesAreaDictStat.isLoading ? salesAreaDict[row.salesAreaType] : <LoadingSpinner />}

        {/* gap-1 によって間隔が作られてしまうため最後の<td>タグエリアを間借りする */}
        {row.contextMenuVisible && 
          <ContextMenu menuList={[
            {textContent: "編集", onClick: () => handleOpenEditIngredForm()},
            {textContent: "削除", onClick: () => handleSubmitDeleteBuyIngred()},
          ]} />
        }
      </td>
    </tr>
  );
}
