import React,  { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'
import {
  Box,
  Paper,
  Typography,
} from '@mui/material';
import 
{ BsPeopleFill, BsFillPersonVcardFill}
 from 'react-icons/bs'
 import {MdCardMembership} from "react-icons/md"
 import { SERVER_URL } from '../../constants.js';
import SoldMembershipsAreaChart from './SoldMembershipsAreaChart.js';
import { useValue } from '../../context/ContextProvider';
import PieMembershipsCost from './PieMembershipsCost.js'

const Home = ({ setSelectedLink, link }) => {

  useEffect(() => {
    setSelectedLink(link);
    fetchClients();
    fetchUsers();
    fetchMemberships();
  }, []);

  
  const location = useLocation();
  const [users, setUsers] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = () => {
    // const token = sessionStorage.getItem("jwt");
    fetch(SERVER_URL + '/api/users', {
      // headers: { 'Authorization' : token }
    })
    .then(response => response.json())
    .then(data => {
      setUsers(data._embedded.users)
      setIsLoading(false)
    })
    .catch(err => console.error(err));    
  }
  const fetchMemberships = () => {
    // const token = sessionStorage.getItem("jwt");
    fetch(SERVER_URL + '/api/sportComplexMemberships', {
      // headers: { 'Authorization' : token }
    })
    .then(response => response.json())
    .then(data => {
      setMemberships(data._embedded.sportComplexMemberships)
      setIsLoading(false)
    })
    .catch(err => console.error(err));    
  }
  const fetchClients = () => {
    // const token = sessionStorage.getItem("jwt");
    fetch(SERVER_URL + '/api/clients', {
      // headers: { 'Authorization' : token }
    })
    .then(response => response.json())
    .then(data => {
      setClients(data._embedded.clients)
      setIsLoading(false)
    })
    .catch(err => console.error(err));    
  }
  const {
    dispatch,
  } = useValue();
  useEffect(() => {
    window.history.pushState(null, document.title, window.location.href);
    window.addEventListener('popstate', function(event) {
      window.history.pushState(null, document.title, window.location.href);
    });
  }, [location]);

    const data = [
        {
          name: 'Page A',
          uv: 4000,
          pv: 2400,
          amt: 2400,
        },
        {
          name: 'Page B',
          uv: 3000,
          pv: 1398,
          amt: 2210,
        },
        {
          name: 'Page C',
          uv: 2000,
          pv: 9800,
          amt: 2290,
        },
        {
          name: 'Page D',
          uv: 2780,
          pv: 3908,
          amt: 2000,
        },
        {
          name: 'Page E',
          uv: 1890,
          pv: 4800,
          amt: 2181,
        },
        {
          name: 'Page F',
          uv: 2390,
          pv: 3800,
          amt: 2500,
        },
        {
          name: 'Page G',
          uv: 3490,
          pv: 4300,
          amt: 2100,
        },
      ];
     

  return (
    <main className='main-container'>
    {/* {isLoading ? (
      <p></p>
    ):( */}
        <>
        <div className='main-cards'>
        <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6">АБОНЕМЕНТЫ</Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <MdCardMembership size={70} sx={{ height: 100, width: 100, opacity: 0.3, mr: 1 }} />
          <Typography variant="h4">{memberships.length}</Typography>
        </Box>
        </Paper>
        <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6">КЛИЕНТЫ</Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <BsFillPersonVcardFill size={70} sx={{ height: 100, width: 100, opacity: 0.3, mr: 1 }} />
          <Typography variant="h4">{clients.length}</Typography>
        </Box>
        </Paper>
        <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6">ПОЛЬЗОВАТЕЛИ</Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <BsPeopleFill  size={70} sx={{ height: 100, width: 100, opacity: 0.3, mr: 1 }} />
          <Typography variant="h4">{users.length}</Typography>
        </Box>
        </Paper>
        <Paper elevation={3} sx={{ p: 2, gridColumn: '1/3' }}>
        <PieMembershipsCost />
        </Paper>
        <Paper elevation={3} sx={{ p: 3, gridColumn: '1/3' }}>
        <SoldMembershipsAreaChart/>
        </Paper>
        </div>
        </>
{/* )} */}
    </main>
  )
}

export default Home