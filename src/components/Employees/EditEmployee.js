import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';

function EditEmployee(props) {
  const [open, setOpen] = useState(false);
  const [employee, setEmployees] = useState({
    firstName: '', surName: '', patrSurName: '',  
    phoneNumber: '', birthDate:'', salary:  '', additionalSalary: ''
  });
    
  const handleClickOpen = () => {
    setEmployees({
      firstName: props.data.row.firstName,
      surName: props.data.row.surName,
      patrSurName: props.data.row.patrSurName,
      phoneNumber: props.data.row.phoneNumber,
      birthDate: props.data.row.birthDate,
      salary: props.data.row.salary,
      additionalSalary: props.data.row.additionalSalary
     })      
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  };
  
  const handleChange = (event) => {
    setEmployees({...employee, 
      [event.target.name]: event.target.value});
  }

  const handleSave = () => {
    props.updateEmployee(employee, props.data.id);
    handleClose();
  }

  return(
    <div>
      <IconButton onClick={handleClickOpen}>
        <EditIcon color="primary" />
      </IconButton>
      <Dialog open={open} onClose={handleClose}>
          <DialogTitle className='dialog'>Обновление информации о сотруднике</DialogTitle>
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
          <TextField type="date" label="Дата рождения" name="birthDate" 
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
            <Button onClick={handleSave}>Сохранить</Button>
          </DialogActions>
        </Dialog>            
    </div>
  );  
}

export default EditEmployee;