import { useState } from 'react'
import '../CSS/main.css'
import Header from '../MainPage/Header'
import Sidebar from '../MainPage/Sidebar'
import TrainingTable from './TrainingTable'

function TrainingPage() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false)

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle)
  }

  return (
    <div className='grid-container'>
      <Header OpenSidebar={OpenSidebar}/>
      <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar}/>
      <TrainingTable />
    </div>
  )
}

export default TrainingPage;