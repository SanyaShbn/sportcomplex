import React from 'react'
import {BsJustify} from 'react-icons/bs'

function Header({OpenSidebar}) {
  return (
    <header className='header'>
        <div className='menu-icon'>
            <BsJustify className='open_bar_icon' onClick={OpenSidebar}/>
        </div>
       
        <div className='header-right'>
             <a className="exit_link">Выход</a>
        </div>
    </header>
  )
}

export default Header