import React, { useState } from 'react';
import '../CSS/employeeCSS.css';
import '../CSS/table.css';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import InputAdornment from '@mui/material/InputAdornment';
import { useValue } from '../../context/ContextProvider';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

function AddSportComplexMembership(props){
  const [open, setOpen] = useState(false);
  const [membership, setMembership] = useState({
    name: '', durationDeadline: '', cost: '', completeVisitsAmount: ''
  });
  const [costInputValue, setCostValue] = useState('');
  const [isNameError, setIsNameError] = useState(false);
  const [isDateError, setIsDateError] = useState(false);
  const [isCostError, setIsCostError] = useState(false);
  const {
    dispatch,
  } = useValue();

  const handleNameErrorChange = (event) => {
    const { value } = event.target;
    const isInvalid = value.length < 2 || value[0] !== value[0].toUpperCase() || !/^[\u0400-\u04FF\s]+$/.test(value);
    setIsNameError(isInvalid);
    setMembership({...membership, [event.target.name]: event.target.value});
  };
  const handleCostErrorChange = (event) => {
    const { value } = event.target;
    const isInvalid = value < 15 || value > 300
    setIsCostError(isInvalid);
    const re = /^[0-9]*\.?[0-9]{0,2}$/;
    if (event.target.value === '' || re.test(event.target.value)) {
        setCostValue(event.target.value);
    }
  };
  const handleDateErrorChange = (event) => {
    const inputDate = new Date(event.target.value);
    const today = new Date();
    const weekFromToday = new Date();
    weekFromToday.setDate(today.getDate() + 7);

    if(inputDate < weekFromToday) {
      setIsDateError(true);
    } else {
      setIsDateError(false);
    }
    setMembership({...membership, [event.target.name]: event.target.value});
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setMembership({
        name: '', durationDeadline: '', cost: '', completeVisitsAmount: ''
    })
    setIsNameError(false)
    setIsDateError(false)
    setIsCostError(false)
    setCostValue('')
  };

  const handleSave = () => {
    if(membership.name.length === 0 | membership.durationDeadline.length === 0){
      dispatch({
        type: 'UPDATE_ALERT',
        payload: {
          open: true,
          severity: 'error',
          message: 'Заполните обязательные поля',
        },});
    }
    else{
    if(isNameError | isDateError){
      dispatch({
        type: 'UPDATE_ALERT',
        payload: {
          open: true,
          severity: 'error',
          message: 'Проверьте корректность ввода данных',
        },});
    }
    else{
      if(costInputValue < 15 | costInputValue > 300){
        dispatch({
          type: 'UPDATE_ALERT',
          payload: {
            open: true,
            severity: 'error',
            message: 'Проверьте корректность ввода данных! Значение стоимости абонемента не соответствует рыночным стандартам' 
            + ' (рекомендуемые значения: от 15 до 300 бел.руб.)',
          },});
      }
      else{
        membership.cost = costInputValue
        props.addMembership(membership);
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
      <DialogTitle className='dialog'>Новый абонемент</DialogTitle>
      <DialogContent className='dialog'>
        <Stack spacing={2} mt={1}>
          <TextField error={isNameError} required label="Наименование" name="name" autoFocus
            variant="standard" value={membership.name} 
            onChange={handleNameErrorChange}/>
           <TextField  error={isDateError} required type='date' label="Дата окончания действия" name="durationDeadline"
            helperText="Срок действия абонемента должен быть не менее недели" variant="standard"
             value={membership.durationDeadline} 
            onChange={handleDateErrorChange}
            InputProps={{
                inputProps: {
                  inputMode: 'numeric',
                },
                startAdornment: (
                  <InputAdornment position="start"> </InputAdornment>
                ),
              }}/>
          <FormControl fullWidth sx={{ m: 1 }}>
          <InputLabel error={isCostError} htmlFor="outlined-adornment-amount">Стоимость (бел.руб.)</InputLabel>
          <OutlinedInput
            error={isCostError}
            id="outlined-adornment-amount"
            value={costInputValue}
            onChange={handleCostErrorChange}
            startAdornment={<InputAdornment position="start">BYN</InputAdornment>}
            label="Стоимость (бел.руб.)"
          />
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

export default AddSportComplexMembership;