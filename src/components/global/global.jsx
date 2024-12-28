import '../../css/styles.css';
import '../../css/output.css';
import { useWeekdayDict, useUnitDict, useSalesAreaDict, useRecipeTypeDict, useCurrentGroup, useLoginUser } from '../../hooks/useFetchData.js';
import React, { createContext, useCallback, useContext, useState } from 'react';
import { Header } from './header.jsx';


const KondateMakerContext = createContext();

export function KondateMakerProvider({ children }) {

  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("isLoggedIn") || null);
  const { loginUser, loginUserStat, loginUserMutate } = useLoginUser(isLoggedIn || null);
  const { currentGroup, currentGroupStat, currentGroupMutate } = useCurrentGroup(isLoggedIn || null);
  const { weekdayDict, weekdayDictStat } = useWeekdayDict();
  const { unitDict, unitDictStat } = useUnitDict();
  const { recipeTypeDict, recipeTypeDictStat } = useRecipeTypeDict();
  const { salesAreaDict, salesAreaDictStat } = useSalesAreaDict();
  const [messageContent, setMessageContent] = useState("");
  const [messageType, setMessageType] = useState("");
  const [messageVisible, setMessageVisible] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [touchTimeout, setTouchTimeout] = useState(null);
  const [isOpeningForm, setIsOpeningForm] = useState(false);
  const [contextMenuIndex, setContextMenuIndex] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [applyHovered, setApplyHovered] = useState(false);

  // タッチ開始（長押し用）
   const touchStart = (e, index) => {

    if (index === hoveredIndex) {
      setApplyHovered(!applyHovered);
    } else {
      setHoveredIndex(index);
      setApplyHovered(true);
    };

    const touch = e.touches[0];
    setTouchTimeout(setTimeout(() => {
      const x = window.innerWidth - touch.clientX < 82 ? window.innerWidth -62 : touch.clientX +20 ;
      setMenuPosition({ x: x, y: touch.clientY -70 });
      // showContextMenu(index, "contextMenuVisible", true);
      setContextMenuIndex(index);
    }, 500));  // 500ms 長押しでポップアップを表示
  };

  // タッチ終了（長押しキャンセル）
  const touchEnd = (index) => {
    if (index === contextMenuIndex) {setApplyHovered(true)};
    clearTimeout(touchTimeout);
    window.addEventListener('touchend', touchEnd);
    return () => {
      window.removeEventListener('touchend', touchEnd);
    };
  };

  // 右クリックでコンテキストメニュー
  const openContextMenu = (e, index) => {
    e.preventDefault();
    // switchVisibleAcc(updIndex, "contextMenuVisible", true)
    setContextMenuIndex(index);
    setMenuPosition({ x: e.clientX, y: e.clientY -50 });
  };
  
  const closeContextMenu = () => {
    setContextMenuIndex(null);
  };

  const hoveredRowSetting = (index) => {
    setHoveredIndex(index);
    setApplyHovered(true);
  };

  const showMessage = (content, type) => {
    setMessageContent(content);
    setMessageType(type);
    setMessageVisible(true);
  }

  const clearMessage = () => {
    setMessageContent(null);
    setMessageType(null);
  }


  return (
    <KondateMakerContext.Provider 
      value={{
        loginUser,
        loginUserStat,
        loginUserMutate,
        currentGroup,
        currentGroupStat,
        currentGroupMutate,
        weekdayDict,
        weekdayDictStat,
        recipeTypeDict,
        recipeTypeDictStat,
        unitDict,
        unitDictStat,
        salesAreaDict, 
        salesAreaDictStat,
        menuPosition,
        setMenuPosition,
        messageContent,
        setMessageContent,
        messageType,
        setMessageType,
        messageVisible,
        setMessageVisible,
        isLoggedIn,
        setIsLoggedIn,
        isOpeningForm,
        setIsOpeningForm,
        touchTimeout,
        setTouchTimeout,
        contextMenuIndex,
        setContextMenuIndex,
        hoveredIndex,
        setHoveredIndex,
        applyHovered,
        setApplyHovered,
        touchStart,
        touchEnd,
        openContextMenu,
        closeContextMenu,
        showMessage,
        clearMessage,
        hoveredRowSetting,
      }}>
      {children}
    </KondateMakerContext.Provider>
  );
}

export function useKondateMaker() {
  return useContext(KondateMakerContext);
}

export const MemoizedHeader = React.memo(Header);


