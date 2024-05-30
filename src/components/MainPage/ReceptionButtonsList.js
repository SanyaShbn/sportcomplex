import { BiSolidPurchaseTag, BiTask } from "react-icons/bi";
import { LuPackage2 } from "react-icons/lu";
import {
    Box,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import { useMemo, useState, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import TrainingMembershipTable from "../Reception/TrainingMembership/TrainingMembershipTable"
import ClientTrainingTable from "../Reception/ClientTraining/ClientTrainingTable"
import ClientMembershipTable from "../Reception/ClientMembership/ClientMembershipTable"
  
  const ReceptionButtonsList = ({ open, setSelectedLink, link}) => {
  
    const [selectedButtonLink, setSelectedButtonLink] = useState('');
    
  useEffect(() => {
    setSelectedLink(link);
  });

    const list = useMemo(
      () => [
        {
          title: 'Пакеты услуг',
          icon: <LuPackage2 />,
          link: 'training_memberships',
          component: <TrainingMembershipTable {...{ setSelectedButtonLink, link: 'training_memberships' }} />,
        },
        {
          title: 'Согласование занятий',
          icon: <BiTask />,
          link: 'client_trainings',
          component: <ClientTrainingTable {...{ setSelectedButtonLink, link: 'client_trainings' }} />,
        },
        {
          title: 'Продажа абонементов',
          icon: <BiSolidPurchaseTag/>,
          link: 'client_memberships',
          component: <ClientMembershipTable {...{ setSelectedButtonLink, link: 'client_memberships' }}/>,
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
  
  export default ReceptionButtonsList;