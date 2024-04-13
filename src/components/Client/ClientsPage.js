import { useState } from 'react'
import '../CSS/main.css'
import Header from '../MainPage/Header'
import Sidebar from '../MainPage/Sidebar'
import ClientTable from './ClientTable'

function ClientsPage() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false)

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle)
  }

  return (
    <div className='grid-container'>
      <Header OpenSidebar={OpenSidebar}/>
      <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar}/>
      <ClientTable />
    </div>
  )
}

export default ClientsPage;