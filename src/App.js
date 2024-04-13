
// import React from 'react';
// import './App.css';
// import Login from './components/Authentication/Login';
// import AdminMain from './components/MainNavs/AdminMain';
// import EmployeeTable from './components/Employees/EmployeeTable';
// import AccountantMain from './components/MainNavs/AccountantMain';
// import ManagerMain from './components/MainNavs/ManagerMain';
// import CoachMain from './components/MainNavs/CoachMain';
// import MarketerMain from './components/MainNavs/MarketerMain';

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//           <Route path="/" element={<AdminMain/> } />
//           <Route path="service_employees" element={<EmployeeTable />} />
//           <Route path="admin_main" element={<AdminMain />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;


import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';
import './App.css';
// import Main from './components/MainPage/Main'
// import ServiceEmployeesPage from './components/Employees/ServiceEmployeesPage'
// import ComplexfacilitiesPage from './components/ComplexFacility/ComplexFacilitiesPage'
// import EmployeeFacilityPage from './components/ServiceEmployee_ComplexFacility/EmployeeFacilityPage';
// import TrainingPage from './components/Training/TrainingsPage';
// import ClientsPage from './components/Client/ClientsPage';
import Dashboard from './components/MainPage/Dashboard';
import Loading from './components/Loading';
import Notification from './components/Notification';

import Login from './components/User/Login';
import NavBar from './components/NavBar';

function App() {
  return (
    <div>
     <Loading/>
     <Notification/>
     <BrowserRouter>
      <Routes>
          <Route path="dashboard/*" element={<Dashboard/>} />
          {/* <Route path="service_employees" element={<ServiceEmployeesPage />} />
          <Route path="complex_facilities" element={<ComplexfacilitiesPage />} />
          <Route path="trainings" element={<TrainingPage />} />
          <Route path="clients" element={<ClientsPage  />} />
          <Route path="test" element={<EmployeeFacilityPage  />} />
          <Route path="main" element={<Main />} /> */}

          <Route path="*" element={<Dashboard/>} />
{/* 
          <Route path="/" element={[<NavBar/>, <Login/>]} /> */}
      </Routes>
    </BrowserRouter>
   </div>
  )
}

export default App