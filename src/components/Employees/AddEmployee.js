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

function AddEmployee(props){
  const [open, setOpen] = useState(false);
  const [employee, setEmployee] = useState({
    firstName: '', surName: '', patrSurName: '',  
    phoneNumber: '', birthDate:'', salary:'', additionalSalary:''
  });


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEmployee({
      firstName: '', surName: '', patrSurName: '',  
      phoneNumber: '', birthDate:'', salary:'', additionalSalary:''
    })
  };

  const handleSave = () => {
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
            variant="standard" value={employee.firstName} 
            onChange={handleChange}/>
           <TextField label="Фамилия" name="surName"
            variant="standard" value={employee.surName} 
            onChange={handleChange}/>
          <TextField label="Отчество" name="patrSurName" 
            variant="standard" value={employee.patrSurName} 
            onChange={handleChange}/>
          <TextField label="Номер телефона" name="phoneNumber" 
            variant="standard" value={employee.phoneNumber} 
            onChange={handleChange}/>
          <TextField type='date' label="Дата рождения" name="birthDate" 
            variant="standard" value={employee.birthDate} 
            onChange={handleChange} InputProps={{
              inputProps: {
                inputMode: 'numeric',
              },
              startAdornment: (
                <InputAdornment position="start"> </InputAdornment>
              ),
            }}/>
          <TextField label="Оклад" name="salary"
            variant="standard" value={employee.salary} 
            onChange={handleChange}/>
           <TextField label="Премиальные" name="additionalSalary"
            variant="standard" value={employee.additionalSalary} 
            onChange={handleChange}/>
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