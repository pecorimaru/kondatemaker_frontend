import './css/styles.css';
import './css/output.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Footer } from './components/global/footer';
import { useKondateMaker } from './components/global/global';
import { Home } from './components/home/home';
import { Buy } from './components/buy/buy';
import { Login } from './components/login/login';
import { Recipe } from './components/recipe/recipe';
import { MenuPlan } from './components/menuPlan/menuPlan';
import { Ingred } from './components/ingred/ingred';
import { Header } from './components/global/header';
import { UserSetting } from './components/setting/userSetting';
import { GroupSetting } from './components/setting/groupSetting';
import { ResetPassword } from './components/login/resetPassword';
import { SignUp } from './components/login/signUp';
import { Activation } from './components/login/activation';
import { JoinGroup } from './components/setting/joinGroup';


export const  KondateMaker = () => {

  const { isLoggedIn } = useKondateMaker();

  return (
    <>
      <div className="bg-slate-100 h-screen font-sans">
          <Router>
            
            <Header />
            <Routes>
              <Route exact path="/" element={<Login/>} />
              <Route exact path="/resetPassword" element={<ResetPassword/>} />
              <Route exact path="/signUp" element={<SignUp/>} />
              <Route exact path="/home" element={<Home />} />
              <Route exact path="/buy" element={<Buy />} />
              <Route exact path="/menuPlan" element={<MenuPlan />} />
              <Route exact path="/recipe" element={<Recipe />} />
              <Route exact path="/ingred" element={<Ingred />} />
              <Route exact path="/userConfig" element={<UserSetting />} />
              <Route exact path="/groupConfig" element={<GroupSetting />} />
              <Route exact path="/activate" element={<Activation />} />
              <Route exact path="/joinGroup" element={<JoinGroup />} />
            </Routes>
            {isLoggedIn !== null && <Footer />}
          </Router>
      </div>
    </>
  )
}



