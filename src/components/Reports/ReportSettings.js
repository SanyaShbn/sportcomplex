import React, { useState, useEffect } from 'react'
import { TextField, Button, Radio, RadioGroup, FormControlLabel, FormControl, Stack, Box, Paper, Grid, FormLabel } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import domToImage from 'dom-to-image'
import MonthsDropdown from '../MainPage/MonthsDropdown'
import PieMembershipsCost from '../MainPage/PieMembershipsCost'
import SoldMembershipsAreaChart from '../MainPage/SoldMembershipsAreaChart'
import RevenueChart from '../Financies/RevenueChart'
import html2canvas from 'html2canvas'

const ReportForm = ({ setSelectedButtonLink, link }) => {
    // const token = sessionStorage.getItem("jwt");
    // const decodedToken = jwtDecode(token);
    // const [user, setUser] = useState([]);
    useEffect(() => {
      setSelectedButtonLink(link)
    }, []);

  const current_data = JSON.parse(localStorage.getItem('reportData'))
  const [data, setData] = useState({
    title: current_data.title,
    subject: current_data.subject,
    textContent: current_data.textContent,
    option: current_data.option
  });
  const navigate = useNavigate()
  const [selectedMonths, setSelectedMonths] = useState(3)
  const [revenueOpen, setRevenueOpen] = useState(false)
  const [costValueOpen, setCostValueOpen] = useState(false)
  const [amountValueOpen, setAmountValueOpen] = useState(false)
  const [selectedMonthOpen, setSelectedMonthOpen] = useState(false)
  const [idToGenerateImage, setIdToGenerateImage] = useState('')

  useEffect(() => {
    if (idToGenerateImage) {
      generateImage(idToGenerateImage);
    }
  }, [idToGenerateImage]);

  const generateImage = (id) => {
    const node = document.getElementById(id)
    html2canvas(node)
      .then((canvas) => {
        const dataUrl = canvas.toDataURL()
        localStorage.removeItem('diagramImgUrl')
        localStorage.setItem('diagramImgUrl', JSON.stringify(dataUrl))
      })
      .catch((error) => {
        console.error('Error generating image:', error);
      });
  }

  const handleChange = (event) => {
    setData({
      ...data,
      [event.target.name]: event.target.value
    });
  };

  const handleChangeDiagram = (event) => {
    setData({
      ...data,
      [event.target.name]: event.target.value
    });
    let id = ''
    switch(event.target.value){
      case 'revenue':
        setRevenueOpen(true)
        setSelectedMonthOpen(true)
        setAmountValueOpen(false)
        setCostValueOpen(false)
        id = 'revenueId'
        break;
      case 'costValue':
        setCostValueOpen(true)
        setSelectedMonthOpen(false)
        setAmountValueOpen(false)
        setRevenueOpen(false)
        id = 'costValueId'
        break;
      case 'amountValue':
        setAmountValueOpen(true)
        setSelectedMonthOpen(true)
        setCostValueOpen(false)
        setRevenueOpen(false)
        id = 'amountValueId'
        break;
      default:break;
    }
    if(id !== ''){
      setIdToGenerateImage(id);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault()
    localStorage.removeItem('reportData')
    localStorage.setItem('reportData', JSON.stringify(data))
    // Navigate to the Report page
    navigate('/reports/viewReport')
  };

  return (
    <form onSubmit={handleSubmit}>
    <Stack direction="row" spacing={2} mt={1}>
      <TextField name="title" label="Заголовок" value={data.title} onChange={handleChange} />
      <TextField name="subject" label="Тема" value={data.subject} onChange={handleChange} />
      <FormControl component="fieldset">
      <FormLabel >Тип отчета</FormLabel>
        <RadioGroup name="option" value={data.option} onChange={handleChange}>
        <Grid container>
        <Grid item xs={4}>
          <FormControlLabel value="clients" control={<Radio />} label="Клиенты" />
        </Grid>
        <Grid item xs={4}>
          <FormControlLabel value="trainings" control={<Radio />} label="Тренировки" />
        </Grid>
        <Grid item xs={4}>
          <FormControlLabel value="facilities" control={<Radio />} label="Сооружения комплекса" />
        </Grid>
        <Grid item xs={4}>
          <FormControlLabel value="memberships" control={<Radio />} label="Абонементы" />
        </Grid>
        <Grid item xs={4}>
          <FormControlLabel value="events" control={<Radio />} label="График планируемых событий" />
        </Grid>
        <Grid item xs={4}>
          <FormControlLabel value="employees" control={<Radio />} label="Сотрудники" />
        </Grid>
        <Grid item xs={4}>
          <FormControlLabel value="service_packages" control={<Radio />} label="Пакеты услуг" />
        </Grid>
        <Grid item xs={4}>
          <FormControlLabel value="trainings_registrations" control={<Radio />} label="Согласование занятий" />
        </Grid>
        <Grid item xs={4}>
          <FormControlLabel value="sold_memberships" control={<Radio />} label="Продажа абонементов" />
        </Grid>
      </Grid>
        </RadioGroup>
      </FormControl>
    </Stack>
    <Stack mb={2}>
      <TextField name="textContent" label="Текстовое содержание отчета" multiline maxRows={50}  value={data.textContent} onChange={handleChange} />
    </Stack>
    <Stack direction="row" spacing={2} mt={1}>
      <FormControl component="fieldset">
        <RadioGroup name="Диаграмма" value={data.option_diagram} onChange={handleChangeDiagram}>
          <FormControlLabel value="revenue" control={<Radio />} label="Показатель выручки с продажи абонементов" />
          <FormControlLabel value="costValue" control={<Radio />} label="Показатель соотношения стоимости предлагаемых абонементов"/>
          <FormControlLabel value="amountValue" control={<Radio />} label="Количество проданных абонементов"/>
        </RadioGroup>
      </FormControl>
    </Stack>
    {selectedMonthOpen && (<MonthsDropdown onChange={(e) => setSelectedMonths(Number(e.target.value))} />)}
    {amountValueOpen && (<Paper id='amountValueId' elevation={3} sx={{ p: 3 }}>
      <SoldMembershipsAreaChart months={selectedMonths} /></Paper>)}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
        {costValueOpen && (<div id='costValueId'><PieMembershipsCost/></div>)}
        {revenueOpen && (<div id='revenueId'><RevenueChart months={selectedMonths}/></div>)}
    </Box>
      <Button type="submit">Сохранить</Button>
    </form>
  );
};

export default ReportForm;