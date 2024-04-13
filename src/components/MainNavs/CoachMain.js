
import React from 'react';
import './nav_main.css';
import logo from "./nav_images/logo.png";
import training_1 from "./nav_images/training_1.png";
import timetable_1 from "./nav_images/timetable_1.png";
import tennis from "./nav_images/tennis.png";
import training_2 from "./nav_images/training_2.png";
import timetable_2 from "./nav_images/timetable_2.png";
import ball from "./nav_images/ball.png";


function CoachMain() {

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
       <img src={training_1} className="admin_logos"/>
       <p className="image1_text">Планирование занятий</p>
   </div> 
   <div className="element_2">
       <img src={timetable_1} className="admin_logos"/>
        <p className="image2_text">Составление графика тренировок</p>
   </div>
   <div className="element_3">
       <img src={tennis} className="admin_logos"/>
       <p className="image3_text">Залы и иные сооружения комплекса</p>
   </div>
</div>
<div className="nav_div_1">
   <img src={training_2} className="link_logo"/>
   <a href="/service_employees" className="navigation_element">Тренировки</a>
</div> 
<div class="nav_div_2">
         <img src={timetable_2} class="link_logo"/>
        <a href="clients" class={"navigation_element_corp"}>Графики занятий</a>
</div>
<div className="nav_div_3">
   <img src={ball} className="link_logo"/>
   <a href="facilities" className="navigation_element">Сооружения комплекса</a>
</div>
</div>
  );
}

export default CoachMain;

