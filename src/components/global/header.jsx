import { useEffect, useState } from "react";
import { useKondateMaker } from "./global";
import { useNavigate } from "react-router-dom";


export const Header = () => {

    const {user, setUser} = useKondateMaker();
    const [currentDate, setCurrentDate] = useState("");
  
    useEffect(() => {
      const today = new Date();
      const formattedDate = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`;
      setCurrentDate(formattedDate);
    }, [])
  
  
    const navigate = useNavigate();
    const handleLogout = () => {
      console.log("logout");
      setUser(null);
      localStorage.setItem("user", null);
      navigate("/");
    }
  
  
    return(
      <div className="fixed flex flex-col items-center justify-center w-full z-10 bg-blue-200 shadow-lg h-14">
        <p>{user?.nm}</p>
        <p>{currentDate}</p>
        <button
          className="bg-blue-200 hover:bg-gray-400 text-gray-500 hover:text-white text-xs font-bold py-1 px-3 absolute z-10 right-5 rounded-md transition duration-300"
          onClick={handleLogout}
        >
          ログアウト
        </button>
      </div>
    )
  
  }