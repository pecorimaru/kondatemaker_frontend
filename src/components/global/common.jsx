import '../../css/styles.css';
import '../../css/output.css';

import { DICT_IDX } from "../../constants/constants";

import { useKondateMaker } from "./global";
import { useEventHandler } from '../../hooks/useEventHandler';
import { useEffect, useState } from 'react';



export const LoadingSpinner = () => {
  return (
    // <div className="flex justify-center items-center fixed top-0 left-0 w-full h-full bg-white bg-opacity-80 z-50">
    //   <div className="loader border-8 border-t-8 border-blue-500 border-opacity-10 rounded-full w-16 h-16 animate-spin"></div>  
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
        <ul className=" bg-white border border-gray-300 shadow-lg rounded-md">
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
      className="text-sm py-2 px-4 cursor-pointer border border-b-gray-300 duration-500 hover:bg-blue-100"
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

// export const LoadingDetail = (cssWidth) => {
//   return (
//     <tr className="flex justify-end">
//       <td className={`${cssWidth} py-2`}><LoadingSpinner /></td>
//     </tr>
//   );
// }

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
      className="bg-red-400 text-white font-bold py-2 px-6 rounded-md shadow-md border-b-4 border-red-500 hover:bg-red-400 hover:shadow-lg active:bg-red-400 active:shadow-sm active:border-opacity-0 active:translate-y-1 transition duration-100"
    >
      閉じる
    </button>
  );
};

export const FormSubmitButton = () => {
  return (
    <button
      type="submit"
      className="bg-blue-400 text-white font-bold py-2 px-6 rounded-md shadow-md border-b-4 border-blue-500 ml-2 hover:bg-blue-400 hover:shadow-lg active:bg-blue-400 active:shadow-sm active:border-opacity-0 active:translate-y-1 transition duration-100"
    >
      保存
    </button>
  );
};

export const OptionConstDict = ({ dict }) => {
  return (
    <>
      {Object.entries(dict)?.map((elem, index) => (
        <option key={index} value={elem?.[DICT_IDX.CD]}>{elem?.[DICT_IDX.NM]}</option>   
      ))}
    </>
  );
};

// export const MessageManager = () => {
//   const [message, setMessage] = useState('');

//   const addMessage = () => {
//     setMessage("新しいメッセージが表示されました！");
//   };

//   const closeMessage = () => {
//     setMessage('');
//   };


  

//   return (
//     <div>
//       <button 
//         onClick={addMessage} 
//         onTouchStart={addMessage} 
//         className="bg-blue-500 text-white p-2 rounded cursor-pointer"
//       >
//         メッセージを追加
//       </button>
//       <SlidingMessage message={message} onClose={closeMessage} />
//     </div>
//   );
// };

export const MessageArea = ({message, setIsMessageVisible}) => {

  const { isMessageVisible } = useKondateMaker();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMessageVisible(false); // 一定時間後にメッセージを閉じる
    }, 3000); // 3秒後にメッセージを閉じる

    return () => clearTimeout(timer); // クリーンアップ
  }, [setIsMessageVisible]);

  return (
    <div className="absolute flex justify-center w-full">
      <div>
        <div 
          className={
            `h-20 bg-white max-w-96 w-full mt-4 mx-2 rounded-md shadow-lg transform -translate-x-1/2 transition-all duration-300
            opacity-80 hover:opacity-100
             ${isMessageVisible ? 'animate-slideIn' : 'animate-slideOut'}`
          }
        >
          <div className="text-md p-2 opacity-100">{message}</div>
          <div></div>
        </div>          
      </div>

    </div>
  )
}


