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
import { MenuItem, FormControl, InputLabel } from '@mui/material';
import Select from '@mui/material/Select';
import { useValue } from '../../context/ContextProvider';

function EditEmployee(props) {
  const [open, setOpen] = useState(false);
  const [employee, setEmployees] = useState({
    firstName: '', surName: '', patrSurName: '', email: '', 
    phoneNumber: '', birthDate:'', post: '', role: '', status: ''
  });
  const {
    dispatch,
  } = useValue();
    
  const handleClickOpen = () => {
    if(props.data.row.status !== "disabled"){
    dispatch({
      type: 'UPDATE_ALERT',
      payload: {
        open: true,
        severity: 'warning',
        message: 'Внимание! При изменении данных сотрудника его учётная запись будет деактивирована. В дальнейшем сотруднику необходимо будет предоставить новый пароль для доступа к системе',
      },});
    }
    setEmployees({
      firstName: props.data.row.firstName,
      surName: props.data.row.surName,
      patrSurName: props.data.row.patrSurName,
      email: props.data.row.email,
      phoneNumber: props.data.row.phoneNumber,
      birthDate: props.data.row.birthDate,
      post: props.data.row.post
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
            <Button onClick={handleSave}>Сохранить</Button>
          </DialogActions>
        </Dialog>            
    </div>
  );  
}

export default EditEmployee;