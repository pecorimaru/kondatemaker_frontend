import '../../css/styles.css';
import '../../css/output.css';

import { useKondateMaker } from '../global/global.jsx';
import { ContextMenu, LoadingSpinner } from '../global/common.jsx';

export const BuyIngred = ({ row, index, switchFlgBuyIngredAcc, submitSwitchCompletion, openEditIngredForm, submitDeleteBuyIngred }) => {

  const { unitDict, unitDictStat, salesAreaDict, salesAreaDictStat, handleContextMenu, handleTouchStart, handleTouchEnd } = useKondateMaker();
  const cssColor = row?.isBought ? "bg-slate-300 text-slate-500" : "bg-white text-slate-900";

  return (
    <tr 
      key={row.buyIngredId} 
      onContextMenu={(event) => handleContextMenu(event, index, switchFlgBuyIngredAcc)}
      onTouchStart={(event) => handleTouchStart(event, index, switchFlgBuyIngredAcc)} 
      onTouchEnd={handleTouchEnd} 
      onScroll={handleTouchEnd}
      className={`detail-table-row`}
    >
      <td 
        className={`${cssColor} detail-table-data w-8 cursor-pointer`} 
        onClick={() => submitSwitchCompletion(row)}
      >
        <input className="cursor-pointer"
          type="checkbox"
          checked={row.isBought}
          onChange={() => submitSwitchCompletion(row)}
        />
      </td>
      <td className={`${cssColor} detail-table-data w-32`}>
        {row.ingredNm}
      </td>
      <td className={`${cssColor} detail-table-data w-16`}>
        {!unitDictStat.isLoading ? 
          `${Math.round(row.qty * 100) / 100} ${unitDict[row.unitCd]}`: <LoadingSpinner />
        }
      </td>
      <td className={`${cssColor} detail-table-data w-28`}>
        {!salesAreaDictStat.isLoading ? salesAreaDict[row.salesAreaType] : <LoadingSpinner />}

        {/* gap-1 によって間隔が作られてしまうため最後の<td>タグエリアを間借りする */}
        {row.contextMenuVisible && 
          <ContextMenu menuList={[
            {textContent: "編集", onClick: () => openEditIngredForm(row, index)},
            {textContent: "削除", onClick: () => submitDeleteBuyIngred(row, index)},
          ]} />
        }
      </td>
    </tr>
  );
}
