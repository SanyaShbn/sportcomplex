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
import PieMembershipsCost from './PieMembershipsCost.js';
import MonthsDropdown from './MonthsDropdown.js';
import { Backdrop, CircularProgress } from '@mui/material';

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
  const [selectedMonths, setSelectedMonths] = useState(3);

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
  useEffect(() => {
    window.history.pushState(null, document.title, window.location.href);
    window.addEventListener('popstate', function(event) {
      window.history.pushState(null, document.title, window.location.href);
    });
  }, [location]);

  return (
    <main className='main-container'>
    {isLoading ? (
      <Backdrop open={true} sx={{ zIndex: (theme) => theme.zIndex.modal + 1 }}>
        <CircularProgress sx={{ color: 'white' }} />
      </Backdrop>
    ):(
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
        <Paper elevation={3} sx={{ p: 3, gridColumn: '1/3' }}>
        <MonthsDropdown onChange={(e) => setSelectedMonths(Number(e.target.value))} />
        <SoldMembershipsAreaChart  months={selectedMonths} />
        </Paper>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
        <Paper elevation={3} sx={{ p: 2, gridColumn: '1/3' }}>
        <PieMembershipsCost/>
        </Paper>
        </Box>
        </div>
        </>
  )}
    </main>
  )
}

export default Home