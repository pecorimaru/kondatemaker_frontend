import { useNavigate } from "react-router-dom";


export const Footer = () => {

  const navigate = useNavigate();

  const onClickFooterButton = (basePath) => {
      navigate(basePath);        
  };

  return(
    <div className='fixed w-full flex justify-center border-t-slate-600 bg-blue-200 h-20 bottom-0'>
        <div className="pt-1.5 ">
          <FooterButton textContent="ホーム" icon="fa-regular fa-house mx-2.5" onClick={() => onClickFooterButton("/home")}/>
          <FooterButton textContent="買い物" icon="fa-regular fa-cart-shopping mx-2.5" onClick={() => onClickFooterButton("/buy")}/>
          <FooterButton textContent="献立" icon="fa-solid fa-clipboard mx-2.5" onClick={() => onClickFooterButton("/menuPlan")}/>
          <FooterButton textContent="レシピ" icon="fa-regular fa-utensils mx-2.5" onClick={() => onClickFooterButton("/recipe")}/>
          <FooterButton textContent="食材" icon="fa-solid fa-carrot mx-2.5" onClick={() => onClickFooterButton("/ingred")}/>
        </div>
    </div>
  );
};


  const FooterButton = ({ textContent, icon, onClick }) => {

    return (
      <div className="inline-block">
          <p className="text-slate-700 flex justify-center text-xs">{textContent}</p>
          <button 
            className={`${icon} bg-blue-400 text-white font-bold mt-0.5 py-3 px-3.5 rounded-md shadow-sm border-b-4 border-blue-500 hover:bg-blue-400 hover:shadow-xl active:bg-blue-400 hover:text-slate-200  active:shadow-sm active:border-opacity-0 active:translate-y-0.5 transition duration-100`}
            onClick={onClick}
          />
          {/* </button> */}
      </div>
    );
  };
  