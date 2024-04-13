
import React from 'react';
import './nav_main.css';
import logo from "./nav_images/logo.png";
import promotion_1 from "./nav_images/promotion_1.png";
import promotion_2 from "./nav_images/promotion_2.png";
import discount_1 from "./nav_images/discount_1.png";
import discount_2 from "./nav_images/discount_2.png";
import sertificate_1 from "./nav_images/sertificate_1.png";
import sertificate_2 from "./nav_images/sertificate_2.png";

function MarketerMain() {

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
       <img src={promotion_1} className="admin_logos"/>
       <p className="image1_text">Назначение акционных услуг</p>
   </div> 
   <div className="element_2">
       <img src={discount_1} className="admin_logos"/>
        <p className="image2_text">Управление системой скидок</p>
   </div>
   <div className="element_3">
       <img src={sertificate_1} className="admin_logos"/>
       <p className="image3_text">Работа с абонементами и сертификатами</p>
   </div>
</div>
<div className="nav_div_1">
   <img src={promotion_2} className="link_logo"/>
   <a href="/service_employees" className="navigation_element"><br/>Акции</a>
</div> 
<div class="nav_div_2">
         <img src={discount_2} class="link_logo"/>
        <a href="clients" class={"navigation_element_corp"}><br/>Скидки</a>
</div>
<div className="nav_div_3">
   <img src={sertificate_2} className="link_logo"/>
   <a href="facilities" className="navigation_element"><br/>Сертификаты</a>
</div>
</div>
  );
}

export default MarketerMain;

