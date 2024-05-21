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
import {
  Button,
  Container,
  Toolbar,
  Typography,
} from '@mui/material';

function App() {
  return (
    <div>
     <Loading/>
     <Notification/>
     <BrowserRouter>
      <Routes>
          <Route path="dashboard/*" element={<Dashboard/>} />
          {/* <Route path="*" element={<Dashboard/>} /> */}

          <Route path="/" element={[
          <div className="welcome_page">
          <NavBar/>
          <Login/>
         </div>
           ]} />
      </Routes>
    </BrowserRouter>
   </div>
  )
}

export default App