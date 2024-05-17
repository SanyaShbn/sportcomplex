import React, { useState, useEffect } from 'react';
import { SERVER_URL } from '../../constants.js';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import { NumberInput } from '../../constants';
import { useValue } from '../../context/ContextProvider';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import FormControl from '@mui/material/FormControl';

function EditFacility(props) {
  const [open, setOpen] = useState(false);
  const [cleanerId, setCleanerId] = useState('');
  const [cleaners, setCleaners] = useState([]);
  const [capacityInputValue, setValue] = React.useState(null);
  const [isNameError, setIsNameError] = useState(false);
  const [facility, setFacility] = useState({
    name: '', trainingsAmount: 0, capacity: '', cleaner: ''
  });
  const {
    dispatch,
  } = useValue();

  useEffect(() => {
    fetchCleaners()
  }, []);

  const cleanersFilterOptions = createFilterOptions({
    matchFrom: 'any',
    stringify: (option) => "Сотрудник обслуживающего персонала №" + option.userId + ": " + option.firstName + " " + option.surName,
  });

  const fetchCleaners= () => {
    // const token = sessionStorage.getItem("jwt");
    fetch(SERVER_URL + '/api/view_cleaners', {
      // headers: { 'Authorization' : token }
    })
    .then(response => response.json())
    .then(data => setCleaners(data))
    .catch(err => console.error(err));    
  }

  const handleNameErrorChange = (event) => {
    const { value } = event.target;
    const isInvalid = value.length < 2 || value[0] !== value[0].toUpperCase() || !/^[\u0400-\u04FF\s]+$/.test(value);
    setIsNameError(isInvalid);
    setFacility({...facility, [event.target.name]: event.target.value});
  };
  const handleClickOpen = () => {
    if(props.data.row.trainingsAmount !== 0){
    dispatch({
      type: 'UPDATE_ALERT',
      payload: {
        open: true,
        severity: 'warning',
        message: 'Внимание! При изменении информации о данном сооружении все тренировочные занятия, которые планировалось проводить в данном сооружении, автоматически отменяются',
      },});
    }
    let idCleaner = props.data.row.cleaner !== 'не назначен' ? props.data.row.cleaner.slice(props.data.row.cleaner.indexOf("№") + 1,
     props.data.row.cleaner.indexOf(":")) : ''
    idCleaner !== '' ? setCleanerId(parseInt(idCleaner)) : setCleanerId(idCleaner) 
    setFacility({
      name: props.data.row.name,
      trainingsAmount: props.data.row.trainingsAmount,
      capacity: props.data.row.capacity,
      cleaner: idCleaner !== '' ? parseInt(idCleaner) : '',
     })      
    setValue(props.data.row.capacity)
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
    setIsNameError(false)
  };

  const handleSave = () => {
    if(facility.name.length === 0 | facility.capacity.length === 0){
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
        props.updateFacility(facility, props.data.id, cleanerId)
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
          <DialogTitle className='dialog'>Обновление информации о сооружении</DialogTitle>
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
          <FormControl fullWidth>
            <Autocomplete
            options={cleaners}
            noOptionsText="Сотрудники обслуживающего персонала не найдены"
            getOptionLabel={(option) => "Сотрудник обслуживающего персонала №" + option.userId + ": " + option.firstName + " " + option.surName}
            value={cleaners.find(cleaner => cleaner.userId === cleanerId)}
            onChange={(event, newValue) => {
             setCleanerId(newValue?.userId);
            }}
            filterOptions={cleanersFilterOptions}
            renderInput={(params) => <TextField {...params} label="Сотрудник обслуживающего персонала" variant="standard" 
            InputProps={{
              ...params.InputProps,
              style: { width: 'auto', minWidth: '300px' },
            }}/>}
            />
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

export default EditFacility;