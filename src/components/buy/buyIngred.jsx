import '../../css/styles.css';
import '../../css/output.css';

import { useKondateMaker } from '../global/global.jsx';
import { ContextMenu, LoadingSpinner } from '../global/common.jsx';
import { useState } from 'react';

export const BuyIngred = ({ row, index, submitSwitchCompletion, openEditIngredForm, submitDeleteBuyIngred }) => {

  const { 
    unitDict, 
    unitDictStat, 
    salesAreaDict, 
    salesAreaDictStat, 
    openContextMenu, 
    touchStart, 
    touchEnd,
    contextMenuIndex,
    hoveredIndex,
    applyHovered,
    setApplyHovered,
    hoveredRowSetting,
  } = useKondateMaker();

  const cssColor = row?.isBought ? "bg-slate-300 text-slate-500" : "bg-white text-slate-900";

  const handleOpenEditIngredForm = () => {
    setApplyHovered(false);
    openEditIngredForm(row, index);
  };

  const handleSubmitDeleteBuyIngred = () => {
    setApplyHovered(false);
    submitDeleteBuyIngred(row, index);
  };

  return (
    <tr 
      key={row.buyIngredId} 
      onContextMenu={(e) => openContextMenu(e, index)}
      onTouchStart={(e) => touchStart(e, index)} 
      onTouchEnd={touchEnd} 
      onMouseEnter={() => hoveredRowSetting(index)}
      onMouseLeave={() => setApplyHovered(false)}
      className={`detail-table-row ${(applyHovered && index === hoveredIndex) && "group"}`}
    >
      <td 
        className={`${cssColor} detail-table-data w-8 cursor-pointer group-hover:bg-blue-100`} 
        onClick={() => submitSwitchCompletion(row)}
      >
        <input className="cursor-pointer"
          type="checkbox"
          checked={row.isBought}
          onChange={() => submitSwitchCompletion(row)}
        />
      </td>
      <td className={`${cssColor} detail-table-data w-32 group-hover:bg-blue-100`}>
        {row.ingredNm}
      </td>
      <td className={`${cssColor} detail-table-data w-16 group-hover:bg-blue-100`}>
        {!unitDictStat.isLoading ? 
          `${Math.round(row.qty * 100) / 100} ${unitDict[row.unitCd]}`: <LoadingSpinner />
        }
      </td>
      <td className={`${cssColor} detail-table-data w-28 group-hover:bg-blue-100`}>
        {!salesAreaDictStat.isLoading ? salesAreaDict[row.salesAreaType] : <LoadingSpinner />}

        {/* gap-1 によって間隔が作られてしまうため最後の<td>タグエリアを間借りする */}
        {index === contextMenuIndex && 
          <ContextMenu menuList={[
            {textContent: "編集", onClick: () => handleOpenEditIngredForm()},
            {textContent: "削除", onClick: () => handleSubmitDeleteBuyIngred()},
          ]} />
        }
      </td>
    </tr>
  );
}
