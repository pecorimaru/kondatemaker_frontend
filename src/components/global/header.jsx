import * as Const from '../../constants/constants.js';
import { apiClient } from '../../utils/axiosClient.js';
import { useEffect, useState } from "react";
import { useKondateMaker } from "./global";
import { useNavigate } from "react-router-dom";
import { LoadingSpinner, MessageArea } from "./common";


export const Header = () => {

    const {
      loginUser, 
      loginUserStat, 
      currentGroup, 
      currentGroupStat, 
      isLoggedIn, 
      messageVisible, 
      setMessageVisible,
      isOpeningForm,
    } = useKondateMaker();

    const [currentDate, setCurrentDate] = useState("");
    const [menuListVisible, setMenuListVisible] = useState(null);
    const [menuIconHover, setMenuIconHover] = useState(false);
    const [menuListHover, setMenuListHover] = useState(false);
    const [dispUserGroupFlg, setDispUserGroupFlg] = useState(true);
  
    useEffect(() => {
      const today = new Date();
      const formattedDate = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`;
      setCurrentDate(formattedDate);
    }, [])

    const handleMouseEnter = () => {
      if (!isOpeningForm) {
        setMenuListVisible(true);
        setMenuIconHover(true);
      };
    };
  
    const handleMouseLeave = () => {
      setMenuIconHover(false);
      if (!menuListHover) setMenuListVisible(false);
    };  
  
    return(
      <>
        <div className="fixed flex items-center justify-center w-full z-20 bg-blue-200 shadow-lg h-14">
          <div className="flex justify-center absolute w-full">
            <div>
              <div 
                className="text-center select-none cursor-default"
                onClick={() => setDispUserGroupFlg(!dispUserGroupFlg)}
              >{
                isLoggedIn && 
                  dispUserGroupFlg ?
                    (!loginUserStat.isLoading ? loginUser?.userNm : <LoadingSpinner />)
                  :
                    (!currentGroupStat.isLoading ? currentGroup?.groupNm : <LoadingSpinner />)
                  }
              </div>
              <div className="text-center">{currentDate}</div>
            </div>
          </div>
          <div 
            className="absolute text-gray-500 py-3.5  right-16 z-0 cursor-pointer rounded-sm transition duration-300 hover:text-gray-400"
            onClick={() => setMessageVisible(true)}
          >
            <i className="text-xl fa-solid fa-message" />
          </div>
          {isLoggedIn &&
            <div
              className={`absolute text-gray-500 py-3 px-5 right-0 z-0 rounded-sm transition duration-300 ${menuListVisible && "bg-blue-300"}`}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onTouchStart={() => setMenuListVisible(!menuListVisible)}
            >
              <i className="text-2xl fa-solid fa-bars" />
            </div>
          }
          {messageVisible !== null && <MessageArea />}
        </div>
        {menuListVisible !== null && <HeaderMenu menuIconHover={menuIconHover} menuListVisible={menuListVisible} setMenuListVisible={setMenuListVisible} setMenuListHover={setMenuListHover}/>}
      </>
    )
  
  }

  export const HeaderMenu = ({ menuIconHover, menuListVisible, setMenuListVisible, setMenuListHover }) => {

    const { isLoggedIn, setIsLoggedIn, showMessage, clearMessage } = useKondateMaker();
    const navigate = useNavigate();
 
    const handleMenuRow = (url) => {
      setMenuListVisible(false);
      navigate(url);
    }

    const handleLogout = async () => {
      clearMessage();
      localStorage.removeItem("token");
      localStorage.removeItem("isLoggedIn");
      setIsLoggedIn(false);
      setMenuListVisible(false);
      window.location.href = '/';
      await apiClient.post(`${Const.ROOT_URL}/setting/logout`)
        .catch(error => {
          showMessage(error?.response?.data?.detail || error?._messageTimeout || Const.MSG_MISSING_REQUEST, Const.MESSAGE_TYPE.ERROR);
        });
    };
  
    // 他のタブでログアウトを検知
    window.addEventListener("storage", (event) => {
      console.log("catch logout event");
      if (event.key === "isLoggedIn" && !isLoggedIn) {
        localStorage.removeItem("token");
        localStorage.removeItem("isLoggedIn");
        window.location.href = "/"; // 必要に応じてリダイレクト
      }
    });

    const handleMouseEnter = () => {
      setMenuListHover(true);
      setMenuListVisible(true);
    };  

    const handleMouseLeave = () => {
      setMenuListHover(false);
      if (!menuIconHover) { 
        setMenuListVisible(false);
      }
    };  

    return (
      <div 
        className={`
          header-menu fixed max-w-48 w-2/3 right-0 z-10 shadow-lg rounded-sm
          ${menuListVisible ? 'animate-slideIn' : 'animate-slideOut'}
        `}
      >
        <ul
          className="mt-14"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <HeaderMenuRow textContent={"ユーザー設定"} icon={"fa-solid fa-user"} onClick={() => handleMenuRow("/userConfig")} />
          <HeaderMenuRow textContent={"グループ設定"} icon={"fa-solid fa-users"} onClick={() => handleMenuRow("/groupConfig")} />
          <HeaderMenuRow textContent={"ログアウト"} icon={"fa-solid fa-right-from-bracket"} onClick={() => handleLogout()}/>
        </ul>
      </div>
    );
  
  };
  
  const HeaderMenuRow = ({ textContent, icon, onClick }) => {
  
    return (
      <li 
        className="flex items-center border-b bg-white border-slate-200 h-12 w-full transition-opacity duration-300 hover:bg-gray-100 hover:cursor-pointer"
        onClick={onClick}
      >
        <i className={`w-8 px-3 ${icon}`}></i>
        <span className="px-3">{textContent}</span>
      </li>
    );
  
  }