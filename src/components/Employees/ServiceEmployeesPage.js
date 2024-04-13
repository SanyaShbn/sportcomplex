import { useState } from 'react'
import '../CSS/main.css'
import Header from '../MainPage/Header'
import Sidebar from '../MainPage/Sidebar'
import EmployeeTable from './EmployeeTable'

function ServiceEmployeesPage() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false)

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle)
  }

  return (
    <div className='grid-container'>
      <Header OpenSidebar={OpenSidebar}/>
      <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar}/>
      <EmployeeTable />
    </div>
  )
}

export default ServiceEmployeesPage;