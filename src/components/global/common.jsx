import '../../css/styles.css';
import '../../css/output.css';
import React, { useRef } from 'react';

import * as Const from '../../constants/constants.js';

import { useKondateMaker } from "./global";
import { useEventHandler } from '../../hooks/useEventHandler';
import { useEffect } from 'react';



export const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="loader border-4 border-t-slate-500 border-gray-200 rounded-full w-5 h-5 animate-spin"></div>
    </div>
  );
};

export const ContextMenu = ({ menuList }) => {

  const { menuPosition } = useKondateMaker();

    return (
      <div className="fixed z-10"
          style={{ top: menuPosition.y, left: menuPosition.x}}
      >
        <ul className="border-x border-t border-gray-200 shadow-lg rounded-sm">
          {menuList.map((row) => 
            <ContextMenuRow 
              key={row.textContent}
              textContent={row.textContent} 
              onClick={row.onClick}
            />
          )}
        </ul>
      </div>
    );
  };

export const ContextMenuRow = ({ textContent, onClick }) => {
  return (
    <li 
      className="bg-white text-sm py-2 px-4 rounded-sm cursor-pointer border-b border-b-gray-200 duration-300 hover:bg-gray-100"
      onClick={() => onClick()}
    >
      {textContent}
    </li>
  );
};

export const AddRow = ({ textContent, onClick, cssWidth }) => {
  return (
    <tr className="flex justify-end mt-1">
      <td
        className={`${cssWidth} text-sm text-slate-400 p-3 rounded-sm cursor-pointer hover:shadow-md hover:text-slate-700 hover:bg-white duration-500 ease-in-out`} 
        onClick={onClick}
      >
        <i className="fa-regular fa-square-plus" />{`　${textContent}`}
      </td>
    </tr>
  );
};


export const SuggestionsInput = ({ 
  suggestions, 
  setCallback, 
  contentRef,
  suggestionsRef,
  setSuggestionsVisible,
  setIsContentChanged, 
}) => {

  const handleSuggestionClick = (suggestion) => {
    setCallback(suggestion);
    if (typeof setSuggestionsVisible === 'function') {
      setSuggestionsVisible(false);
    };
    if (typeof setIsContentChanged === 'function') {
      setIsContentChanged(true);
    };
  };

  // 入力候補 or 対象項目以外を押下した場合に入力候補エリアを非表示
  const handleClickOutside = (e) => {
    if ((!suggestionsRef?.current?.contains(e.target)) && (!contentRef?.current?.contains(e.target))) {
      if (typeof setSuggestionsVisible === 'function') {
        setSuggestionsVisible(false);
      };
    };
  };
  useEventHandler("mousedown", handleClickOutside);

  return (
    <div 
      className="relative"
      ref={suggestionsRef}
    >
      <ul className="absolute text-xs w-full bg-white border border-gray-300 z-10 rounded-md shadow-lg">
        {suggestions?.map((item, index) => (
          <li
            className="px-3 py-2 cursor-pointer hover:bg-gray-200"
            key={index} 
            onClick={() => handleSuggestionClick(item)}
            tabIndex={0}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export const FormCloseButton = ({ onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="bg-red-400 text-white py-2 px-6 rounded-sm shadow-md border-b-4 border-red-500 hover:bg-red-400 hover:shadow-lg active:bg-red-400 active:shadow-sm active:border-opacity-0 active:translate-y-0.5 transition duration-100"
    >
      閉じる
    </button>
  );
};

export const FormSubmitButton = ({ textContent }) => {
  return (
    <button
      type="submit"
      className="bg-blue-400 text-white py-2 px-6 rounded-sm shadow-md border-b-4 border-blue-500 ml-2 hover:bg-blue-400 hover:shadow-lg active:bg-blue-400 active:shadow-sm active:border-opacity-0 active:translate-y-0.5 transition duration-100"
    >
      {textContent ? textContent : "保存"}
    </button>
  );
};

export const OptionConstDict = ({ dict }) => {
  return (
    <>
      {Object.entries(dict)?.map((elem, index) => (
        <option key={index} value={elem?.[Const.DICT_IDX.CD]}>{elem?.[Const.DICT_IDX.NM]}</option>   
      ))}
    </>
  );
};

export const TBodyLoading = () => {
  return (
    <tbody className="flex justify-center">
      <tr className="pt-4">
        <td>
          <LoadingSpinner />
        </td>
      </tr>
    </tbody>
  )
}

export const MessageArea = () => {

  const { messageContent, messageType, messageVisible, setMessageVisible } = useKondateMaker();
  const timerRef = useRef(null);

  useEffect(() => {
    if (messageVisible) {
      timerRef.current = setTimeout(() => {
        setMessageVisible(false);
      }, 3000);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      } 
    };

  }, [messageVisible, setMessageVisible]);


  const handleMouseEnter = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  const handleMouseLeave = () => {
    // クローズボタンによってマウスが離れた場合は再カウントしない
    if (messageVisible) {
      timerRef.current = setTimeout(() => {
        setMessageVisible(false);
      }, 3000);
    }
  };

  const handleClose = () => {
    setMessageVisible(false);
    clearTimeout(timerRef.current);
  };

  return (
    <div className={`absolute flex justify-center w-96 mt-8 z-0 ${!messageVisible && "pointer-events-none"}`}>
      <div 
        className={
          `bg-white h-24 max-w-96 w-full mt-8 rounded-sm shadow-lg transform -translate-x-1/2 transition-all duration-300
          opacity-90 hover:opacity-100
            ${messageVisible ? 'animate-slideIn' : 'animate-slideOut'}`
        }
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex h-full opacity-100">
          <div className="pt-2  mx-2 text-lg">
              {messageType === Const.MESSAGE_TYPE.INFO ? 
                <i className="text-green-500 fa-solid fa-circle-check" />
              : messageType === Const.MESSAGE_TYPE.WARN ?
                <i class="text-amber-500 fa-solid fa-circle-exclamation"></i>
              : messageType === Const.MESSAGE_TYPE.ERROR &&
                <i className="text-red-500 fa-solid fa-circle-xmark" />
              }
          </div>  
          <div className="pt-2.5 w-full">
            <span>
              {messageContent?.includes("\n") ?
                <>
                  {messageContent.split("\n").map((line, index, arr) => (
                    <React.Fragment key={index}>
                      {line}
                      {index < arr.length - 1 && <br />} {/* 改行がある場合のみ <br /> */}
                    </React.Fragment>
                  ))}
                </>
                :
                <>{messageContent}</>
              }
            </span>
          </div>
          <div className="mt-2 mx-2 text-lg text-slate-700 opacity-50 hover:opacity-100 hover:cursor-pointer">
            <i 
              className="fa-solid fa-circle-xmark"
              onClick={() => handleClose()}
            />
          </div>  
        </div>
      </div>
    </div>
  )
}


export const ButtonContinueWithGooble = ({ getGoogleAuth, isGoogleLoading }) => {
  return (
    <button 
      onClick={getGoogleAuth}
      className={`white-button-base flex items-center w-full h-14 text-slate-700 rounded-sm ${isGoogleLoading && "justify-center"}`}
    >
      {isGoogleLoading ? <LoadingSpinner /> : 
        <div className="flex items-center">
          <svg className="mx-4" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25" viewBox="0 0 120 120">
            <path d="M107.145,55H100H87.569H60v18h27.569c-1.852,5.677-5.408,10.585-10.063,14.118 C72.642,90.809,66.578,93,60,93c-12.574,0-23.278-8.002-27.299-19.191C31.6,70.745,31,67.443,31,64 c0-3.839,0.746-7.505,2.101-10.858C37.399,42.505,47.823,35,60,35c7.365,0,14.083,2.75,19.198,7.273l13.699-13.21 C84.305,20.969,72.736,16,60,16c-18.422,0-34.419,10.377-42.466,25.605C14,48.291,12,55.912,12,64c0,7.882,1.9,15.32,5.267,21.882 C25.223,101.389,41.372,112,60,112c12.382,0,23.668-4.688,32.182-12.386C101.896,90.831,108,78.128,108,64 C108,60.922,107.699,57.917,107.145,55z" opacity=".35"></path><path fill="#44bf00" d="M17.267,81.882C25.223,97.389,41.372,108,60,108c12.382,0,23.668-4.688,32.182-12.386L77.506,83.118 C72.642,86.809,66.577,89,60,89c-12.574,0-23.278-8.002-27.299-19.191L17.267,81.882z"></path><path d="M77.506,83.118c-0.684,0.553-1.685,1.158-2.398,1.638l14.711,12.846 c0.807-0.641,1.6-1.298,2.363-1.988L77.506,83.118z" opacity=".35"></path><path fill="#0075ff" d="M92.182,95.614C101.896,86.83,108,74.128,108,60c0-3.078-0.301-6.083-0.855-9H100H87.569H60v18 h27.569c-1.852,5.677-5.408,10.585-10.063,14.118L92.182,95.614z"></path><path d="M32.701,69.809L17.267,81.882c0.486,0.948,1.004,1.877,1.551,2.787l15.3-11.576 C33.63,72.181,33.05,70.804,32.701,69.809z" opacity=".35"></path><path fill="#ffc400" d="M17.267,81.882C13.9,75.32,12,67.882,12,60c0-8.088,2-15.709,5.534-22.395l15.568,11.537 C31.746,52.496,31,56.161,31,60c0,3.443,0.6,6.745,1.701,9.809L17.267,81.882z"></path><path d="M17.534,37.605c-0.482,0.844-1.169,2.36-1.564,3.251l16.059,11.491 c0.299-1.095,0.653-2.167,1.072-3.205L17.534,37.605z" opacity=".35"></path><path fill="#ff1200" d="M33.101,49.142C37.399,38.505,47.823,31,60,31c7.365,0,14.083,2.75,19.198,7.273l13.699-13.21 C84.305,16.969,72.736,12,60,12c-18.422,0-34.419,10.377-42.466,25.605L33.101,49.142z"></path>
          </svg>
          <span>Googleで続ける</span>
        </div>
      }
    </button>
  );
};

export const Required = () => {
  return <span className="text-red-500 text-md">＊</span>;
};