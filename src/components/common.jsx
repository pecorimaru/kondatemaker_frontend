
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


export const LoadingSpinner = () => {
  return (
    // <div className="flex justify-center items-center fixed top-0 left-0 w-full h-full bg-white bg-opacity-80 z-50">
    //   <div className="loader border-8 border-t-8 border-blue-500 border-opacity-10 rounded-full w-16 h-16 animate-spin"></div>  
    <div className="flex justify-center items-center">
      <div className="loader border-4 border-t-slate-500 border-gray-200 rounded-full w-5 h-5 animate-spin"></div>
    </div>
  );
};










