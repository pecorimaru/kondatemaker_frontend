import './css/styles.css';
import './css/output.css';
import { Footer, MemoizedHeader } from './components/global';
import { Home } from './components/home';
import { BuyList } from './components/buylist';
import { Login } from './components/login';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { RecipeList } from './components/recipelist/recipelist';


export const  KondateMaker = () => {

  return (
    <>
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
              exact path="/buyList" 
              element={
                <>
                  <MemoizedHeader />
                  <BuyList />
                  <Footer />
                </>
              } 
            />
            <Route 
              exact path="/recipeList" 
              element={
                <>
                  <MemoizedHeader />
                  <RecipeList />
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



