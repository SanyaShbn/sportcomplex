import React, { useState, useEffect } from 'react';
import { TextField, Button, Radio, RadioGroup, FormControlLabel, FormControl, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ReportForm = ({ setSelectedButtonLink, link }) => {
    // const token = sessionStorage.getItem("jwt");
    // const decodedToken = jwtDecode(token);
    // const [user, setUser] = useState([]);
    useEffect(() => {
      setSelectedButtonLink(link)
    }, []);

  const [data, setData] = useState({
    title: '',
    subject: '',
    textContent: '',
  });
  const navigate = useNavigate();

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
    navigate('/reports/viewReport')
  };

  return (
    <form onSubmit={handleSubmit}>
    <Stack direction="row" spacing={2} mt={1}>
      <TextField name="title" label="Заголовок" value={data.title} onChange={handleChange} />
      <TextField name="subject" label="Тема" value={data.subject} onChange={handleChange} />
      <FormControl component="fieldset">
        <RadioGroup name="option" value={data.option} onChange={handleChange}>
          <FormControlLabel value="clients" control={<Radio />} label="Клиенты" />
          <FormControlLabel value="trainings" control={<Radio />} label="Тренировки" />
        </RadioGroup>
      </FormControl>
    </Stack>
    <Stack mb={2}>
      <TextField name="textContent" label="Текстовое содержание отчета" multiline maxRows={50}  value={data.textContent} onChange={handleChange} />
    </Stack>
      <Button type="submit">Сохранить</Button>
    </form>
  );
};

export default ReportForm;