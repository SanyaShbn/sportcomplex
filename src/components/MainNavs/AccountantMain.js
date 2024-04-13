
import React from 'react';
import './nav_main.css';
import logo from "./nav_images/logo.png";
import employees from "./nav_images/employees.png";
import employees_nav_logo from "./nav_images/employees_nav_logo.png";
import salary_1 from "./nav_images/salary_1.png";
import premium_salary_1 from "./nav_images/premium_salary_1.png";
import salary_2 from "./nav_images/salary_2.png";
import premium_salary_2 from "./nav_images/premium_salary_2.png";


function AccountantMain() {

//   const fetchAdminMain = () => {
//     fetch('api/admin')
//   }
  return (
    <div className='admin_main_body'>
       <style>
        @import url('https://fonts.googleapis.com/css2?family=Pacifico&display=swap');
      </style>
    <div className="top">
    <div className="logout"></div>
           <div className="logo_div">
               <img src= {logo} className="logo"/>
           </div>
           <a className="logout_link">Выход</a>
     </div>
<div className="welcome_text">
   <p>
    Добро пожаловать
   </p>
   <p className="info">
    Система управления спортивно-оздоровительным комплексом
    <br/>
    <span className='company_title'>BestSports</span>
   </p>
</div>
<div className="about_us">
   <div className="element_1">
       <img src={salary_1} className="admin_logos"/>
       <p className="image1_text">Система начисления заработной <br/> платы</p>
   </div> 
   <div className="element_2">
       <img src={employees} className="admin_logos"/>
        <p className="image2_text">Работа с сотрудниками</p>
   </div>
   <div className="element_3">
       <img src={premium_salary_1} className="admin_logos"/>
       <p className="image3_text">Система расчёта премиальных</p>
   </div>
</div>
<div className="nav_div_1">
   <img src={salary_2} className="link_logo"/>
   <a href="/service_employees" className="navigation_element">Заработная плата</a>
</div> 
<div className="nav_div_2">
   <img src={employees_nav_logo} className="link_logo"/>
   <a href="facilities" className="navigation_element">Сотрудники</a>
</div>
<div className="nav_div_3">
   <img src={premium_salary_2} className="link_logo"/>
   <a href="facilities" className="navigation_element">Премиальные</a>
</div>
</div>
  );
}

export default AccountantMain;

