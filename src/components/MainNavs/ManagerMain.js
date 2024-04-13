
import React from 'react';
import './nav_main.css';
import logo from "./nav_images/logo.png";
import clients from "./nav_images/clients.png";
import handshake from "./nav_images/handshake.png";
import corp_client_1 from "./nav_images/corp_client_1.png";
import supplier_1 from "./nav_images/supplier_1.png";
import corp_client_2 from "./nav_images/corp_client_2.png";
import supplier_2 from "./nav_images/supplier_2.png";


function ManagerMain() {

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
       <img src={clients} className="admin_logos"/>
       <p className="image1_text">Работа с клиентами</p>
   </div> 
   <div className="element_2">
       <img src={corp_client_1} className="admin_logos"/>
        <p className="image2_text">Обслуживание корпоративных <br/>клиентов</p>
   </div>
   <div className="element_3">
       <img src={supplier_1} className="admin_logos"/>
       <p className="image3_text">Работа с поставщиками</p>
   </div>
</div>
<div className="nav_div_1">
   <img src={handshake} className="link_logo"/>
   <a href="/service_employees" className="navigation_element">Клиенты</a>
</div> 
<div class="nav_div_2">
         <img src={corp_client_2} class="link_logo"/>
        <a href="clients" class={"navigation_element_corp"}>Корпоративные клиенты</a>
</div>
<div className="nav_div_3">
   <img src={supplier_2} className="link_logo"/>
   <a href="facilities" className="navigation_element">Поставщики</a>
</div>
</div>
  );
}

export default ManagerMain;

