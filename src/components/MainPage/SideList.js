import {BsFillPersonVcardFill, BsPeopleFill, BsReception4} from "react-icons/bs"
import {IoIosFitness} from "react-icons/io"
import {MdOutlineSportsGymnastics, MdCardMembership, MdAttachMoney} from "react-icons/md"
import { FaCalendarAlt } from "react-icons/fa"
import { BiSolidReport } from "react-icons/bi"
import { GrDomain } from "react-icons/gr";
import Scheduler from "../Scheduler/Scheduler"
import { useTheme } from '@mui/material/styles';
import { SERVER_URL } from '../../constants.js';
// import Badge from '@mui/material/Badge';
import {
    Avatar,
    Box,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    styled,
    Tooltip,
    Typography,
} from '@mui/material';
import {
ChevronLeft,
Logout,
} from '@mui/icons-material';
import MuiDrawer from '@mui/material/Drawer';
import { useMemo, useState, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Home from './Home';
import EmployeeTable from '../Employees/EmployeeTable'
import ClientTable from "../Client/ClientTable"
import ComplexFacilityTable from "../ComplexFacility/ComplexFacilitytable"
import TrainingTable from "../Training/TrainingTable"
import SportComplexMembershipTable from "../SportComplexMembership/SportComplexMembershipTable"
import ReceptionButtonsList from "./ReceptionButtonsList"
import SetTheme from "../Scheduler/SetTheme"
import Registration from "../User/Registration"
import UpdateProfile from "../User/UpdateProfile.js"
import { blue } from '@mui/material/colors';
import { jwtDecode } from 'jwt-decode';
import FinanciesMain from "../Financies/FinanciesMain.js"
import { useValue } from '../../context/ContextProvider'
import ReportViewer from '../Reports/ReportViewer.js'
import Designer from '../Reports/ReportDesigner'
  
  const drawerWidth = 250;


  // const StyledBadge = styled(Badge)(({ theme }) => ({
  //   '& .MuiBadge-badge': {
  //     backgroundColor: '#44b700',
  //     color: '#44b700',
  //     boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
  //     '&::after': {
  //       position: 'absolute',
  //       top: 0,
  //       left: 0,
  //       width: '100%',
  //       height: '100%',
  //       borderRadius: '50%',
  //       animation: 'ripple 1.2s infinite ease-in-out',
  //       border: '1px solid currentColor',
  //       content: '""',
  //     },
  //   },
  //   '@keyframes ripple': {
  //     '0%': {
  //       transform: 'scale(.8)',
  //       opacity: 1,
  //     },
  //     '100%': {
  //       transform: 'scale(2.4)',
  //       opacity: 0,
  //     },
  //   },
  // }));
  
  const openedMixin = (theme) => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
  });
  
  const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
      width: `calc(${theme.spacing(8)} + 1px)`,
    },
  });
  
  const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  }));
  
  const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== 'open',
  })(({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }));
  
  const SideList = ({ open, setOpen }) => {
    const {
      dispatch,
    } = useValue();
    const handleLogout = () => {
    dispatch({ type: 'START_LOADING' });

    setTimeout(() => {
      dispatch({ type: 'END_LOADING' });
      sessionStorage.setItem("jwt", "");
      navigate("/", { replace: true });
    }, 1000);
    }
  
    const [selectedLink, setSelectedLink] = useState('');
    // const token = sessionStorage.getItem("jwt");
    // const decodedToken = jwtDecode(token);
    // const [user, setUser] = useState([]);
    // const [profileIcon, setProfileIcon] = useState([]);

    // useEffect(() => {
    //   fetchUser();
    // }, []);
  
    // const fetchUser = () => {
    //   fetch(SERVER_URL + '/api/user_profile?userLogin=' + decodedToken.sub, {
    //     headers: { 'Authorization' : token }
    //   })
    //   .then(response => response.json())
    //   .then(data => {setUser(data); setProfileIcon(data.firstName[0] + data.surName[0])})
    //   .catch(err => console.error(err));    
    // }

    const list = useMemo(
      () => {
        
        let componentsToShow = [
        {
          title: 'Главная страница',
          icon: <GrDomain />,
          link: 'main',
          component: <Home {...{ setSelectedLink, link: 'main' }} />,
        },
        {
          title: 'Сотрудники',
          icon: <BsPeopleFill />,
          link: 'service_employees',
          component: <EmployeeTable {...{ setSelectedLink, link: 'service_employees' }} />,
        },
        {
          title: 'Клиенты',
          icon: <BsFillPersonVcardFill/>,
          link: 'clients',
          component: <ClientTable {...{ setSelectedLink, link: 'clients' }}/>,
        },
        {
          title: 'Сооружения комплекса',
          icon: <IoIosFitness />,
          link: 'complex_facilities',
          component: <ComplexFacilityTable {...{ setSelectedLink, link: 'complex_facilities' }}/>,
        },
        {
          title: 'Тренировки',
          icon: <MdOutlineSportsGymnastics />,
          link: 'trainings',
          component: <TrainingTable {...{ setSelectedLink, link: 'trainings' }}/>,
        },
        {
          title: 'Расписание',
          icon: <FaCalendarAlt />,
          link: 'shedule',
          component:
          <div>
          <div>
          <SetTheme/>
          </div>
          <div> 
          <Scheduler {...{ setSelectedLink, link: 'shedule' }}/>
          </div>
          </div>
        },
          {
            title: 'Абонементы',
            icon: <MdCardMembership />,
            link: 'memberships',
            component: <SportComplexMembershipTable {...{ setSelectedLink, link: 'memberships' }}/>,
          },
          {
            title: 'Выручка',
            icon: <MdAttachMoney />,
            link: 'financies',
            component: <FinanciesMain {...{ setSelectedLink, link: 'financies' }}/>,
          },
          {
            title: 'Рецепция',
            icon: <BsReception4 />,
            link: 'reception/*',
            component: <ReceptionButtonsList {...{ setSelectedLink, link: 'reception/*' }}/>,
          },
          {
            title: 'Отчеты',
            icon: <BiSolidReport />,
            link: 'reports',
            component: <Designer {...{ setSelectedLink, link: 'reports' }}/>,
          },
      ];

      // if (roles.toString() == 'ADMIN') {
      //   componentsToShow.push(
      //     {
      //       title: 'Сотрудники',
      //       icon: <BsPeopleFill />,
      //       link: 'service_employees',
      //       component: <EmployeeTable {...{ setSelectedLink, link: 'service_employees' }} />,
      //     },
      //   );
      // }

 return componentsToShow;
});

//  return componentsToShow; 
// }, [roles]); - для авторизации

    const navigate = useNavigate();
    const theme = useTheme();
    let color = theme.palette.mode;
    return (
      <>
        <Drawer variant="permanent" open={open}>
          <DrawerHeader>
            <IconButton onClick={() => setOpen(false)}>
              <ChevronLeft />
            </IconButton>
          </DrawerHeader>
          <Divider />
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
                  selected={selectedLink === item.link}
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
                    sx={{ opacity: open ? 1 : 0 }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
          <Box sx={{ mx: 'auto', mt: 3, mb: 1 }}>
            {/* <Tooltip title={''}>   title либо подписать, либо Tooltip убрать вообще!!!! */} 
              {/* <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
              >  */}
              
              {/* профиль пользователя */}
              {/* <Avatar
                sx={{ bgcolor: color!=='dark' ? blue[500] : "null" }}
                {...(open && { sx: { width: 60, height: 60, bgcolor: color!=='dark' ? blue[500] : "null" }})}
              >{profileIcon}</Avatar>  */}
              {/* профиль пользователя */}
              
              {/* </StyledBadge> */}
            {/* </Tooltip> */}
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            {open && <Typography>{}</Typography>}
            <Typography variant="body2">{}</Typography>
            {open && (
              <Typography variant="body2">{}</Typography>
            )}
              {/* <UpdateProfile data={user} fetchUser={fetchUser}/> */}
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            {open && <Typography>{}</Typography>}
            <Typography variant="body2">{}</Typography>
            {open && (
              <Typography variant="body2">{}</Typography>
            )}
            <Tooltip title="Выйти" sx={{ mt: 1 }}>
              <IconButton onClick={handleLogout}>
                <Logout/>
              </IconButton>
            </Tooltip>
          </Box>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <DrawerHeader />
          <Routes>
            {list.map((item) => (
              <Route key={item.title} path={item.link} element={item.component} />
            ))}
          </Routes>
        </Box>
      </>
    );
  };
  
  export default SideList;