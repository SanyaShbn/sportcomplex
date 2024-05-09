import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Select from '@mui/material/Select';
import { FormControl, RadioGroup, FormControlLabel, Radio, InputLabel, MenuItem, FormLabel } from '@mui/material';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { SERVER_URL } from '../../constants.js';
import { useValue } from '../../context/ContextProvider';
import { NumberInput } from '../../constants';
import '../CSS/employeeCSS.css';
import '../CSS/table.css';
import CurrencyTextField from '@lupus-ai/mui-currency-textfield'


function AddTraining(props){

  const [complexFacilityId, setComplexFacilityId] = useState([]);
  const [coachId, setCoachId] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [open, setOpen] = useState(false);
  const [training, setTraining] = useState({
    name: '', type: 'групповое', capacity: '',  cost: '', clients_amount: 0
  });
  const [isGroup, setIsGroup] = useState(true);
  const [capacityInputValue, setCapacityValue] = React.useState(null);
  const [costInputValue, setCostValue] = React.useState(null);
  const [isNameError, setIsNameError] = useState(false);
  const {
    dispatch,
  } = useValue();

  useEffect(() => {
    fetchFacilities()
    fetchCoaches()
  }, []);

  const handleNameErrorChange = (event) => {
    const { value } = event.target;
    const isInvalid = value.length < 2 || value[0] !== value[0].toUpperCase() || !/^[\u0400-\u04FF\s]+$/.test(value);
    setIsNameError(isInvalid);
    setTraining({...training, [event.target.name]: event.target.value});
  };
  const fetchFacilities = () => {
      // const token = sessionStorage.getItem("jwt");
      fetch(SERVER_URL + '/api/view_facilities', {
        // headers: { 'Authorization' : token }
      })
      .then(response => response.json())
      .then(data => setFacilities(data))
      .catch(err => console.error(err));    
    }

    const fetchCoaches= () => {
      // const token = sessionStorage.getItem("jwt");
      fetch(SERVER_URL + '/api/view_coaches', {
        // headers: { 'Authorization' : token }
      })
      .then(response => response.json())
      .then(data => setCoaches(data))
      .catch(err => console.error(err));    
    }

  const handleClickOpen = () => {
    setTraining({
      ...training, type: 'групповое'
    })
    setIsGroup(true)
    setOpen(true);
  };
    
  const handleClose = () => {
    setOpen(false);
    setTraining({
      name: '', type: '', capacity: '',  cost: ''
    })
    setCapacityValue(null)
    setCostValue(null)
    setIsNameError(false)
  };

  const handleSave = () => {
    if(training.name.length === 0 | coachId.length === 0 | complexFacilityId.length === 0){
      dispatch({
        type: 'UPDATE_ALERT',
        payload: {
          open: true,
          severity: 'error',
          message: 'Заполните обязательные поля!',
        },});
    }
    else{
      if(isNameError){
        dispatch({
          type: 'UPDATE_ALERT',
          payload: {
            open: true,
            severity: 'error',
            message: 'Проверьте корректность ввода данных!',
          },});
      }
    else{
    if(costInputValue < 1){
      dispatch({
        type: 'UPDATE_ALERT',
        payload: {
          open: true,
          severity: 'error',
          message: 'Проверьте корректность ввода данных! Значение стоимости услуги (тренировочного занятия) не может быть столь низкой,'
          +' а также отрицательной',
        },});
    }
    else{
    if(training.type !== 'персональное' && capacityInputValue < 2 | capacityInputValue > 50){
      dispatch({
        type: 'UPDATE_ALERT',
        payload: {
          open: true,
          severity: 'error',
          message: 'Проверьте корректность ввода данных! Емкость занятия/услуги (количество человек, которое могут посетить данное ' + 
          'занятие/приобрести услугу одновременно) не может принимать значения менее 2, либо более 50',
        },});
    }
    else {
    if(training.type === 'групповое'){
      training.capacity = capacityInputValue
    }
    else{training.capacity = 1}
    training.cost = costInputValue
    props.addTraining(training, complexFacilityId, coachId);
    handleClose()
    setCoachId('')
    setComplexFacilityId('')
    }
  }
  }
  }
  }

  const handleChangeType = (event) => {
    setTraining({...training, type:event.target.value})
    setIsGroup(event.target.value === 'групповое');
  };

  return (
    <div>
    <Button className="shine-button" variant="contained" onClick={handleClickOpen}>
      Добавить информацию
    </Button>
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle className='dialog'>Новая тренировка</DialogTitle>
      <DialogContent className='dialog'>
        <Stack spacing={2} mt={1}>
          <TextField error={isNameError} label="Наименование" name="name" required
            variant="standard" value={training.name} 
            onChange={handleNameErrorChange}/>
            <FormControl>
            <FormLabel id="demo-radio-buttons-group-label">Тип занятия</FormLabel>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              name="radio-buttons-group"
              value={training.type}
              onChange={handleChangeType}
            >
            <FormControlLabel value="групповое" control={<Radio color="primary" />} label="Групповое" />
            <FormControlLabel value="персональное" control={<Radio color="primary" />} label="Персональное" />
            </RadioGroup>
            </FormControl>
            {isGroup && ( <NumberInput required
            label="Емкость (чел.)"
            placeholder="Емкость (чел.)"
            variant="standard" value={capacityInputValue} 
            onChange={(event, val) => setCapacityValue(val)}/>
            )}
             <CurrencyTextField
              required
		          label="Стоимость (бел.руб.)"
		          variant="standard"
	          	value={costInputValue}
	          	currencySymbol="BYN"
		          outputFormat="string"
		          onChange={(event, value)=> setCostValue(value)}
            />
            <FormControl fullWidth>
            <InputLabel required>Место проведения</InputLabel>
             <Select
             name='complexFacility'
             autoFocus variant="standard"
             label="Место проведения"
             onChange={(event) => { setComplexFacilityId(event.target.value) }}>
             {facilities.map(facility => (
               <MenuItem key={facility.idComplexFacility}
                value={facility.idComplexFacility}>{"Сооружение №" + facility.idComplexFacility + ": " + facility.name}</MenuItem>
             ))}
            </Select>
            </FormControl>
            <FormControl fullWidth>
            <InputLabel required>Тренер</InputLabel>
             <Select
             name='coach'
             autoFocus variant="standard"
             label="Тренер"
             onChange={(event) => { setCoachId(event.target.value) }}>
             {coaches.map(coach => (
               <MenuItem key={coach.userId}
                value={coach.userId}>{"Тренер №" + coach.userId + ": " + coach.firstName + " " + coach.surName}</MenuItem>
             ))}
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

export default AddTraining;