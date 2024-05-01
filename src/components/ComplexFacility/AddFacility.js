import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import '../CSS/employeeCSS.css';
import '../CSS/table.css';
import { useValue } from '../../context/ContextProvider';

import { NumberInput } from '../../constants';

function AddFacility(props){
  const [open, setOpen] = useState(false);
  const [isNameError, setIsNameError] = useState(false);
  const [capacityInputValue, setValue] = React.useState(null);
  const [facility, setFacility] = useState({
    name: '', trainingsAmount: 0, capacity: ''
  });
  const {
    dispatch,
  } = useValue();
  // Open the modal form
  const handleClickOpen = () => {
    setOpen(true);
    setIsNameError(false)
  };
    
  const handleNameErrorChange = (event) => {
    const { value } = event.target;
    const isInvalid = value.length < 2 || value[0] !== value[0].toUpperCase() || !/^[\u0400-\u04FF\s]+$/.test(value);
    setIsNameError(isInvalid);
    setFacility({...facility, [event.target.name]: event.target.value});
  };
  // Close the modal form 
  const handleClose = () => {
    setOpen(false);
    setValue(null);
    setFacility({
        name: '', trainingsAmount: 0, capacity: '',
    })
  };

  // Save car and close modal form 
  const handleSave = () => {
    if(facility.name.length === 0 | capacityInputValue === null){
      dispatch({
        type: 'UPDATE_ALERT',
        payload: {
          open: true,
          severity: 'error',
          message: 'Заполните обязательные поля!',
        },});
    }
    else{
    if(capacityInputValue < 1 | capacityInputValue > 50){
      dispatch({
        type: 'UPDATE_ALERT',
        payload: {
          open: true,
          severity: 'error',
          message: 'Проверьте корректность ввода данных! Вместимость какого-либо из сооружений не может принимать значение менее 1, ' 
          + "либо более 50",
        },});
    }
    else{
      if(isNameError){
        dispatch({
          type: 'UPDATE_ALERT',
          payload: {
            open: true,
            severity: 'error',
            message: 'Проверьте корректность ввода данных!'
          },});
      }
      else{
        facility.capacity = capacityInputValue
        props.addFacility(facility);
        handleClose();
      }
    }
    }
  }

  return (
    <div>
    <Button className="shine-button" variant="contained" onClick={handleClickOpen}>
      Добавить информацию
    </Button>
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle className='dialog'>Новое сооружение</DialogTitle>
      <DialogContent className='dialog'>
        <Stack spacing={2} mt={1}>
        <TextField error={isNameError} label="Наименование" name="name" autoFocus
            variant="standard" value={facility.name} required
            onChange={handleNameErrorChange}/>
         <NumberInput
            required
            label="Вместимость (чел.)"
            placeholder="Вместимость (чел.)"
            variant="standard" value={capacityInputValue} 
            onChange={(event, val) => setValue(val)}/>
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

export default AddFacility;