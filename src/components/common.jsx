import { useToweekRecipes } from "../hooks/useGlobal";
import { useKondateMaker } from "./global";
import * as Const from '../constants/constants.js';

export const FooterButton = ({ text, icon, onClick }) => {

  return (
    <div className="inline-block">
        <p className="text-slate-700 flex justify-center text-xs">{text}</p>
        <button 
          className={`${icon} bg-blue-400 text-white font-bold mt-0.5 py-3 px-3.5 rounded-md shadow-sm border-b-4 border-blue-500 hover:bg-blue-400 hover:shadow-xl active:bg-blue-400 hover:text-slate-200  active:shadow-sm active:border-opacity-0 active:translate-y-0.5 transition duration-100`}
          onClick={onClick}
        >
        </button>
    </div>
  );
}

export const BasicButton = ({ text, icon, onClick }) => {

  return (
    <>
      <button 
        className={`${icon} bg-blue-400 text-white font-bold py-2 px-6 rounded-md shadow-md border-b-4 border-blue-500 hover:bg-blue-400 hover:shadow-lg active:bg-blue-400 active:shadow-sm active:border-opacity-0 active:translate-y-1 transition duration-100`}
        onClick={onClick}
      >
        {text}
      </button>
    </>
  );
}

export const MainLabel = ({ textColor, bgColor, text}) => {
  const baseClass = "px-4 py-2 font-bold text-center shadow-lg w-28";
  return (
    <td className={`${baseClass} ${textColor} ${bgColor}`}>{text}</td>
  );
}

export const MainRecipe = ({text}) => {
  return (
    <td className="bg-white px-4 py-2 font-bold text-center shadow-md w-44">{text}</td>
  );
}






export const MainComboBox = ({text}) => {
  return (
    <td className="bg-white px-4 py-2 font-bold text-center shadow-md w-44">{text}</td>
  );
}




