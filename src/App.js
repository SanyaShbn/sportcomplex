import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';
import './App.css';
import Dashboard from './components/MainPage/Dashboard';
import Loading from './components/Loading';
import Notification from './components/Notification';
import Login from './components/User/Login';
import NavBar from './components/NavBar';
import logo from '../src/components/MainPage/logo.png';

function App() {

  return (
    <div>
     <Loading/>
     <Notification/>
     <BrowserRouter>
      <Routes>
          <Route path="dashboard/*" element={<Dashboard/>} />
          <Route path="/" element={
          <div key="NavBarAndLogin" className="welcome_page">
          <NavBar/>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
            <img className="welcome_logo" src={logo} alt="" />
            <span className='welcome_company_title'>BestSports</span>
          </div>
          <Login/>
         </div>
          } />
      </Routes>
    </BrowserRouter>
   </div>
  )
}

export default App