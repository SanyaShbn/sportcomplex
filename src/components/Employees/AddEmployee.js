import React, { useState } from 'react';
import '../CSS/employeeCSS.css';
import '../CSS/table.css';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import { MenuItem, FormControl, InputLabel } from '@mui/material';
import Select from '@mui/material/Select';

function AddEmployee(props){
  const [open, setOpen] = useState(false);
  const [employee, setEmployee] = useState({
    firstName: '', surName: '', patrSurName: '', email: '', 
    phoneNumber: '', birthDate:'', post: '', role: ''
  });


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEmployee({
      firstName: '', surName: '', patrSurName: '', email: '', 
      phoneNumber: '', birthDate:'', post: '', role:'', status: ''
    })
  };

  const handleSave = () => {
    switch (employee.post) {
      case 'Сотрудник тренерского персонала':
        employee.role = "COACH";
        break;
      case 'Бухгалтер':
        employee.role = "ACCOUNTANT";
        break;
      case 'Менеджер по клиентам':
        employee.role = "MANAGER";
        break;
      case 'Сотрудник отдела маркетинга':
        employee.role = "MARKETER";
        break;
      case 'Сотрудник обслуживающего персонала':
        employee.role = "CLEANER";
        break;
      default:
        employee.role = "CLEANER";
    }
    employee.status = "disabled"
    props.addEmployee(employee);
    handleClose();
  }

  const handleChange = (event) => {
    setEmployee({...employee, [event.target.name]: event.target.value});
  }
  return (
    <div>
    <Button className="shine-button" variant="contained" onClick={handleClickOpen}>
      Добавить информацию
    </Button>
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle className='dialog'>Новый сотрудник</DialogTitle>
      <DialogContent className='dialog'>
        <Stack spacing={2} mt={1}>
          <TextField label="Имя" name="firstName" autoFocus
            variant="standard" value={employee.firstName} required
            onChange={handleChange}/>
           <TextField label="Фамилия" name="surName"
            variant="standard" value={employee.surName} required
            onChange={handleChange}/>
          <TextField label="Отчество" name="patrSurName" 
            variant="standard" value={employee.patrSurName} required
            onChange={handleChange}/>
          <TextField label="Email" name="email" type="email"
            variant="standard" value={employee.email} required
            onChange={handleChange}/>
          <TextField label="Номер телефона" name="phoneNumber" 
            variant="standard" value={employee.phoneNumber} required
            onChange={handleChange}/>
          <TextField type='date' label="Дата рождения" name="birthDate" 
            variant="standard" value={employee.birthDate} required
            onChange={handleChange} InputProps={{
              inputProps: {
                inputMode: 'numeric',
              },
              startAdornment: (
                <InputAdornment position="start"> </InputAdornment>
              ),
            }}/>
          <FormControl fullWidth>
            <InputLabel>Должность</InputLabel>
             <Select
              name="post"
              value={employee.post}
              autoFocus variant="standard"
              label="Должность"
              required
              onChange={handleChange}>
              <MenuItem value={"Сотрудник тренерского персонала"}>Сотрудник тренерского персонала</MenuItem>
              <MenuItem value={"Бухгалтер"}>Бухгалтер</MenuItem>
              <MenuItem value={"Менеджер по клиентам"}>Менеджер по клиентам</MenuItem>
              <MenuItem value={"Сотрудник отдела маркетинга"}>Сотрудник отдела маркетинга</MenuItem>
              <MenuItem value={"Сотрудник обслуживающего персонала"}>Сотрудник обслуживающего персонала</MenuItem>
            </Select>
            </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions>
         <Button onClick={handleClose}>Отмена</Button>
         <Button onClick={handleSave}>Добавить</Button>
      </DialogActions>
    </Dialog>            
  </div>
  );
}

export default AddEmployee;