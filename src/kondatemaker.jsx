import './css/styles.css';
import './css/output.css';
import { useState } from 'react';
import { Footer, MemoizedHeader } from './components/global';
import { Home } from './components/home';
import { BuyList } from './components/buylist';
import { Login } from './components/login';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';


export const  KondateMaker = () => {

  // const [user, setUser] = useState({id: "", name: ""});
  // const [menuPlanData, setMenuPlanData] = useState({menuPlanNm: "", menuPlanList: ""});
  // const {selectedPlan, setSelectedPlan, menuPlanData, setMenuPlanData} = useKondateMaker();
  // const [menuPlanList, setMenuPlanList] = useState([]);
  // const [toweekRecipes, setToweekRecipes] = useState({"日": "", "月": "", "火": "", "水": "", "木": "", "金": "", "土": ""});


  


  return (
    <>
      <h1>test</h1>
      <div className="bg-slate-200 h-screen font-sans">
        <Router>
          <Routes>
            <Route 
              exact path="/" 
              element={
                <Login />} />
            <Route 
              exact path="/main" 
              element={
                <div>
                  <MemoizedHeader />
                  <Home />
                  <Footer />
                </div>
              } 
            />
            <Route 
              exact path="/buylist" 
              element={
                <>
                  <MemoizedHeader />
                  <BuyList />
                  <Footer />
                </>
              } 
            />
          </Routes>
        </Router>
      </div>
    </>
  )
}



