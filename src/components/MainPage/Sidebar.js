import React from 'react'
import 
{BsFillPersonVcardFill, BsPeopleFill, BsReception4}
 from "react-icons/bs"
 import {IoIosFitness} from "react-icons/io"
 import {MdOutlineSportsGymnastics, MdCardMembership, MdAttachMoney} from "react-icons/md"
 import { FaTruckLoading } from "react-icons/fa"
 import { CiDiscount1 } from "react-icons/ci"
 import { GrDomain } from "react-icons/gr";
 import logo from '../MainNavs/nav_images/logo.png'

function Sidebar({openSidebarToggle, OpenSidebar}) {
  return (
    <aside id="sidebar" className={openSidebarToggle ? "sidebar-responsive": ""}>
        <style>
        @import url('https://fonts.googleapis.com/css2?family=Pacifico&display=swap');
        </style>
        <div className='sidebar-title'>
            <div className='sidebar-brand'>
              <img src= {logo} className='system_logo'/>
              <span className='icon close_icon' onClick={OpenSidebar}>X</span>
              <br/>
              <span className='company_title'>BestSports</span>
            </div>
        </div>

        <ul className='sidebar-list'>
            <li className='sidebar-list-item'>
                <a href="main">
                    <GrDomain className='icon'/> Главная страница
                </a>
            </li>
            <li className='sidebar-list-item'>
                <a href="service_employees">
                    <BsPeopleFill className='icon'/> Сотрудники
                </a>
            </li>
            <li className='sidebar-list-item'>
                <a href="clients">
                    <BsFillPersonVcardFill className='icon'/> Клиенты
                </a>
            </li>
            <li className='sidebar-list-item'>
                <a href="complex_facilities">
                    <IoIosFitness className='icon'/> Сооружения комплекса
                </a>
            </li>
            <li className='sidebar-list-item'>
                <a href="trainings">
                    <MdOutlineSportsGymnastics className='icon'/> Тренировки
                </a>
            </li>
            <li className='sidebar-list-item'>
                <a href="">
                    <FaTruckLoading className='icon'/> Поставщики
                </a>
            </li>
            <li className='sidebar-list-item'>
                <a href="">
                    <CiDiscount1 className='icon'/> Акции
                </a>
            </li>
            <li className='sidebar-list-item'>
                <a href="">
                    <MdCardMembership className='icon'/> Абонементы
                </a>
            </li>
            <li className='sidebar-list-item'>
                <a href="">
                    <MdAttachMoney className='icon'/> Финансы
                </a>
            </li>
            <li className='sidebar-list-item'>
                <a href="">
                    <BsReception4 className='icon'/> Рецепция
                </a>
            </li>
        </ul>
    </aside>
  )
}

export default Sidebar