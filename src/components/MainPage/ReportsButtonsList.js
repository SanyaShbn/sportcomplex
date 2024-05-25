import { BiTask } from "react-icons/bi"
import { LuPackage2 } from "react-icons/lu"
import {
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from '@mui/material'
import { useMemo, useState, useEffect } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'
import Report from "../Reports/Report"
import ReportSettings from "../Reports/ReportSettings"
import { PDFViewer } from '@react-pdf/renderer'
  
const ReportsButtonsList = ({ open, setSelectedLink, link}) => {
  
  const [selectedButtonLink, setSelectedButtonLink] = useState('');
    
  useEffect(() => {
    setSelectedLink(link);
  }, []);

    const list = useMemo(
      () => [
        {
          title: 'Настройка',
          icon: <LuPackage2 />,
          link: 'reportSettings',
          component: <ReportSettings {...{ setSelectedButtonLink, link: 'reportSettings' }} />,
        },
        {
          title: 'Просмотр',
          icon: <BiTask />,
          link: 'viewReport',
          component:
          <PDFViewer style={{ flex: 1, height: '100vh', width: '100%' }}>
            <Report {...{ setSelectedButtonLink, link: 'viewReport' }}/>
          </PDFViewer>
        },
      ],
      []
    );
    const navigate = useNavigate();
    return (
      <>
          <List>
            {list.map((item) => (
              <ListItem key={item.title} disablePadding sx={{ display: 'block' }}>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                  }}
                  onClick={() => navigate(item.link)}
                  selected={selectedButtonLink === item.link}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.title}
                    sx={{
                        margin: 1
                      }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Routes>
            {list.map((item) => (
              <Route key={item.title} path={item.link} element={item.component} />
            ))}
          </Routes>
        </Box>
      </>
    );
  };
  
  export default ReportsButtonsList;