import '../../css/styles.css';
import '../../css/output.css';
import { useWeekdayDict, useUnitDict, useSalesAreaDict, useRecipeTypeDict, useCurrentGroup, useLoginUser } from '../../hooks/useFetchData.js';
import React, { createContext, useContext, useState } from 'react';
import { Header } from './header.jsx';


const KondateMakerContext = createContext();

export function KondateMakerProvider({ children }) {

  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem("isLoggedIn") || null);
  const { loginUser, loginUserStat, loginUserMutate } = useLoginUser(localStorage.getItem("isLoggedIn") || null);
  const { currentGroup, currentGroupStat, currentGroupMutate } = useCurrentGroup(localStorage.getItem("isLoggedIn") || null);
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

  // 右クリックでコンテキストメニュー
  const handleContextMenu = (event, updIndex, switchVisibleAcc) => {
    event.preventDefault();
    switchVisibleAcc(updIndex, "contextMenuVisible", true)
    setMenuPosition({ x: event.clientX, y: event.clientY -50 });
  };

  // タッチ開始（長押し用）
   const touchStart = (e, index, showContextMenu) => {
    const touch = e.touches[0];
    setTouchTimeout(setTimeout(() => {
      // setMenuPosition({ x: 313, y: 315 });
      const x = window.innerWidth - touch.clientX < 82 ? window.innerWidth -62 : touch.clientX +20 ;
      setMenuPosition({ x: x, y: touch.clientY -70 });
      showContextMenu(index, "contextMenuVisible", true);
    }, 500));  // 500ms 長押しでポップアップを表示
  };

  // タッチ終了（長押しキャンセル）
  const touchEnd = () => {
    clearTimeout(touchTimeout);
    window.addEventListener('touchend', touchEnd);
    return () => {
      window.removeEventListener('touchend', touchEnd);
    };
  };

  const closeContextMenu = (switchVisibleAcc) => {
    switchVisibleAcc(null, "contextMenuVisible", false, true);
  }

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
        handleContextMenu,
        touchStart,
        touchEnd,
        closeContextMenu,
        showMessage,
        clearMessage
      }}>
      {children}
    </KondateMakerContext.Provider>
  );
}

export function useKondateMaker() {
  return useContext(KondateMakerContext);
}

export const MemoizedHeader = React.memo(Header);


