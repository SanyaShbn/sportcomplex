
import React from 'react';
import './nav_main.css';
import logo from "./nav_images/logo.png";
import admin_logo from "./nav_images/admin_logo.png";
import employees from "./nav_images/employees.png";
import clients from "./nav_images/clients.png";
import employees_nav_logo from "./nav_images/employees_nav_logo.png";
import ball_image from "./nav_images/ball.png";
import handshake from "./nav_images/handshake.png";


function AdminMain() {

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
   <p className="welcome_phrase">
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
       <img src={admin_logo} className="admin_logos"/>
       <p className="image1_text">Администрирование</p>
   </div> 
   <div className="element_2">
       <img src={employees} className="admin_logos"/>
        <p className="image2_text">Работа с сотрудниками</p>
   </div>
   <div className="element_3">
       <img src={clients} className="admin_logos"/>
       <p className="image3_text">Работа с клиентами</p>
   </div>
</div>
<div className="nav_div_1">
   <img src={employees_nav_logo} className="link_logo"/>
   <a href="service_employees" className="navigation_element">Сотрудники</a>
</div> 
<div className="nav_div_2">
   <img src={handshake} className="link_logo"/>
   <a href="facilities" className="navigation_element">Клиенты</a>
</div>
<div className="nav_div_3">
   <img src={ball_image} className="link_logo"/>
   <a href="facilities" className="navigation_element">Сооружения комплекса</a>
</div>

</div>
  );
}

export default AdminMain;

