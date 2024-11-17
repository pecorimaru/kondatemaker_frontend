import './css/styles.css';
import './css/output.css';
import { Footer } from './components/global/footer';
import { MemoizedHeader } from './components/global/global';
import { Home } from './components/home/home';
import { Buy } from './components/buy/buy';
import { Login } from './components/login/login';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Recipe } from './components/recipe/recipe';
import { MenuPlan } from './components/menuPlan/menuPlan';
import { Ingred } from './components/ingred/ingred';


export const  KondateMaker = () => {

  return (
    <>
      <div className="bg-slate-100 h-screen font-sans">
        <Router>
          <Routes>
            <Route 
              exact path="/" 
              element={
                <Login />} />
            <Route 
              exact path="/home" 
              element={
                <div>
                  <MemoizedHeader />
                  <Home />
                  <Footer />
                </div>
              } 
            />
            <Route 
              exact path="/buy" 
              element={
                <>
                  <MemoizedHeader />
                  <Buy />
                  <Footer />
                </>
              } 
            />
            <Route 
              exact path="/menuPlan" 
              element={
                <>
                  <MemoizedHeader />
                  <MenuPlan />
                  <Footer />
                </>
              } 
            />
            <Route 
              exact path="/recipe" 
              element={
                <>
                  <MemoizedHeader />
                  <Recipe />
                  <Footer />
                </>
              } 
            />
            <Route 
              exact path="/ingred" 
              element={
                <>
                  <MemoizedHeader />
                  <Ingred />
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



