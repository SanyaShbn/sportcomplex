import React,  { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'
import {
  Box,
  Paper,
} from '@mui/material';

import { Backdrop, CircularProgress, Typography } from '@mui/material';
import RevenueChart from './RevenueChart.js';
import RevenueBarChart from './RevenueBarChart.js';
import MonthsDropdown from '../MainPage/MonthsDropdown.js';
import { display } from '@mui/system';

const FinanciesMain = ({ setSelectedLink, link }) => {

  useEffect(() => {
    setSelectedLink(link)
  }, []);

  const location = useLocation();
  const [selectedMonths, setSelectedMonths] = useState(3);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    window.history.pushState(null, document.title, window.location.href);
    window.addEventListener('popstate', function(event) {
      window.history.pushState(null, document.title, window.location.href);
    });
  }, [location]);

  return (

        <div>
        <Typography
        variant="h4"
        component="h4"
        sx={{ textAlign: 'center', mt: 3, mb: 3 }}
        >
        Выручка с продажи абонементов
        </Typography>
        <Paper elevation={3} sx={{ p: 3, gridColumn: '1/3', mb: 2 }}>
        <MonthsDropdown onChange={(e) => setSelectedMonths(Number(e.target.value))} />
        <RevenueChart months={selectedMonths}/>
        </Paper>

        <Paper elevation={3} sx={{ p: 2, gridColumn: '1/3', mb: 2 }}>
        <RevenueBarChart/>
        </Paper>
        </div>

  )
}

export default FinanciesMain