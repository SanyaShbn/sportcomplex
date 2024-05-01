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
import { useValue } from '../../context/ContextProvider';
import CurrencyTextField from '@lupus-ai/mui-currency-textfield'

function EditSportComplexMembership(props) {
  const [open, setOpen] = useState(false);
  const [membership, setMembership] = useState({
    name: '', durationDeadline: '', cost: '', completeVisitsAmount: ''
  });
  const [costInputValue, setCostValue] = React.useState(null);
  const [isNameError, setIsNameError] = useState(false);
  const [isDateError, setIsDateError] = useState(false);
  const {
    dispatch,
  } = useValue();

  const handleNameErrorChange = (event) => {
    const { value } = event.target;
    const isInvalid = value.length < 2 || value[0] !== value[0].toUpperCase() || !/^[\u0400-\u04FF\s]+$/.test(value);
    setIsNameError(isInvalid);
    setMembership({...membership, [event.target.name]: event.target.value});
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
    setMembership({
      name: props.data.row.name,
      durationDeadline: props.data.row.durationDeadline,
      cost: props.data.row.cost,
      completeVisitsAmount: props.data.row.completeVisitsAmount,
     })      
    setOpen(true);
    setCostValue(props.data.row.cost)
  }

  const handleClose = () => {
    setOpen(false);
    setIsNameError(false)
    setIsDateError(false)
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
      if(costInputValue < 1){
        dispatch({
          type: 'UPDATE_ALERT',
          payload: {
            open: true,
            severity: 'error',
            message: 'Проверьте корректность ввода данных! Значение стоимости абонемента не может быть столь низкой,'
            +' а также отрицательной',
          },});
      }
      else{
        membership.cost = costInputValue
        props.updateMembership(membership, props.data.id);
        handleClose();
      }
    }
  }
  }

  return(
    <div>
      <IconButton onClick={handleClickOpen}>
        <EditIcon color="primary" />
      </IconButton>
      <Dialog open={open} onClose={handleClose}>
          <DialogTitle className='dialog'>Обновление информации об абонементе</DialogTitle>
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
           <CurrencyTextField
              required
		          label="Стоимость (бел.руб.)"
		          variant="standard"
	          	value={membership.cost}
	          	currencySymbol="BYN"
		          outputFormat="string"
		          onChange={(event, value)=> setCostValue(value)}
            />
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

export default EditSportComplexMembership;