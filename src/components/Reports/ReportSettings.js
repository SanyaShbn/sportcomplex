import React, { useState, useEffect } from 'react'
import { TextField, Button, Radio, RadioGroup, FormControlLabel, FormControl, Stack, Box, Grid, FormLabel } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'

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
  const token = sessionStorage.getItem("jwt");
  const decodedToken = jwtDecode(token);
  const xs = 12
  const sm = decodedToken.roles.toString() === 'ADMIN' ? 3 : 2

  const handleChange = (event) => {
    setData({
      ...data,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault()
    localStorage.removeItem('reportData')
    localStorage.setItem('reportData', JSON.stringify(data))
    // Navigate to the Report page
    navigate('/dashboard/reports/viewReport')
  };

  return (
    <form onSubmit={handleSubmit}>
    <Stack direction="row" spacing={2} mt={1}>
      <TextField name="title" label="Заголовок" value={data.title} required onChange={handleChange} />
      <TextField name="subject" label="Тема" value={data.subject} required onChange={handleChange} />
    </Stack>
    <Stack mt={3}>
      <TextField name="textContent" label="Текстовое содержание отчета" multiline maxRows={50}  value={data.textContent} onChange={handleChange} />
    </Stack>
    <Stack direction="row" spacing={2} mt={1}>
    </Stack>
    <FormControl component="fieldset">
      <FormLabel >Табличные данные</FormLabel>
        <RadioGroup name="option" value={data.option} onChange={handleChange}>
        <Grid container>
        <Grid item xs={xs} sm={sm}>
          <FormControlLabel value="clients" control={<Radio />} label="Клиенты" />
        </Grid>
        {(decodedToken.roles.toString() === "ADMIN" || decodedToken.roles.toString() === "COACH")
         && <Grid item xs={xs} sm={decodedToken.roles.toString() === "COACH" ? 12 : sm }>
          <FormControlLabel value="trainings" control={<Radio />} label="Тренировки" />
        </Grid>}
        {decodedToken.roles.toString() === "ADMIN"&&
        <Grid item xs={xs} sm={sm}>
          <FormControlLabel value="facilities" control={<Radio />} label="Сооружения комплекса" />
        </Grid>}
        {(decodedToken.roles.toString() === "ADMIN" || decodedToken.roles.toString() === "MANAGER")
         && <Grid item xs={xs} sm={decodedToken.roles.toString() === "MANAGER" ? 12 : sm }>
          <FormControlLabel value="memberships" control={<Radio />} label="Абонементы" />
        </Grid>}
        {(decodedToken.roles.toString() === "ADMIN" || decodedToken.roles.toString() === "COACH")
         && <Grid item xs={xs} sm={decodedToken.roles.toString() === "COACH" ? 12 : sm }>
          <FormControlLabel value="events" control={<Radio />} label="График планируемых событий" />
        </Grid>}
        {decodedToken.roles.toString() === "ADMIN" && 
        <Grid item xs={xs} sm={sm}>
          <FormControlLabel value="employees" control={<Radio />} label="Сотрудники" />
        </Grid>}
        {(decodedToken.roles.toString() === "ADMIN" || decodedToken.roles.toString() === "MANAGER")
         && <Grid item xs={xs} sm={decodedToken.roles.toString() === "MANAGER" ? 12 : sm }>
          <FormControlLabel value="service_packages" control={<Radio />} label="Пакеты услуг" />
        </Grid>}
        {(decodedToken.roles.toString() === "ADMIN" || decodedToken.roles.toString() === "COACH")
         && <Grid item xs={xs} sm={decodedToken.roles.toString() === "COACH" ? 12 : sm }>
          <FormControlLabel value="trainings_registrations" control={<Radio />} label="Согласование занятий" />
        </Grid>}
        {(decodedToken.roles.toString() === "ADMIN" || decodedToken.roles.toString() === "MANAGER")
         && <Grid item xs={xs} sm={decodedToken.roles.toString() === "MANAGER" ? 12 : sm }>
          <FormControlLabel value="sold_memberships" control={<Radio />} label="Продажа абонементов" />
        </Grid>}
      </Grid>
        </RadioGroup>
      </FormControl>
    <Box>
      <Button type="submit">Сохранить</Button>
    </Box>
    </form>
  );
};

export default ReportForm;