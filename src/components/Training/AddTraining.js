import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { FormControl, RadioGroup, FormControlLabel, Radio, InputLabel, FormLabel } from '@mui/material';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { SERVER_URL } from '../../constants.js';
import { useValue } from '../../context/ContextProvider';
import { NumberInput } from '../../constants';
import '../CSS/employeeCSS.css';
import '../CSS/table.css';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { jwtDecode } from 'jwt-decode';


function AddTraining(props){

  const [complexFacilityId, setComplexFacilityId] = useState('');
  const [coachId, setCoachId] = useState('');
  const [facilities, setFacilities] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [open, setOpen] = useState(false);
  const [training, setTraining] = useState({
    name: '', type: 'групповое', capacity: '',  cost: '', clients_amount: 0
  });
  const [isGroup, setIsGroup] = useState(true);
  const [capacityInputValue, setCapacityValue] = React.useState(null);
  const [costInputValue, setCostValue] = useState('');
  const [isNameError, setIsNameError] = useState(false);
  const [isCostError, setIsCostError] = useState(false);
  const [isCoach, setIsCoach] = useState(false);
  const {
    dispatch,
  } = useValue();

  useEffect(() => {
    fetchFacilities()
    fetchCoaches()
  }, []);

  const facilitiesFilterOptions = createFilterOptions({
    matchFrom: 'any',
    stringify: (option) => "Сооружение №" + option.idComplexFacility + ": " + option.name,
  });
  
  const coachesFilterOptions = createFilterOptions({
    matchFrom: 'any',
    stringify: (option) => "Тренер №" + option.userId + ": " + option.firstName + " " + option.surName,
  });

  const handleCostErrorChange = (event) => {
    const { value } = event.target;
    const isInvalid = value < 5 || value > 100
    setIsCostError(isInvalid);
    const re = /^[0-9]*\.?[0-9]{0,2}$/;
    if (event.target.value === '' || re.test(event.target.value)) {
        setCostValue(event.target.value);
    }
  };
  const handleNameErrorChange = (event) => {
    const { value } = event.target;
    const isInvalid = value.length < 2 || value[0] !== value[0].toUpperCase() || !/^[\u0400-\u04FF\s]+$/.test(value);
    setIsNameError(isInvalid);
    setTraining({...training, [event.target.name]: event.target.value});
  };
  const fetchFacilities = () => {
      const token = sessionStorage.getItem("jwt");
      fetch(SERVER_URL + '/api/view_facilities', {
        headers: { 'Authorization' : token }
      })
      .then(response => response.json())
      .then(data => setFacilities(data))
      .catch(err => console.error(err));    
    }

    const fetchCoaches= () => {
      const token = sessionStorage.getItem("jwt");
      fetch(SERVER_URL + '/api/view_coaches', {
        headers: { 'Authorization' : token }
      })
      .then(response => response.json())
      .then(data => setCoaches(data))
      .catch(err => console.error(err));    
    }

  const handleClickOpen = () => {
    const token = sessionStorage.getItem("jwt");
    const decodedToken = jwtDecode(token);
    const roles = decodedToken.roles
    setTraining({
      ...training, type: 'групповое'
    })
    setIsGroup(true)
    if(roles.toString() === 'COACH'){
      setCoachId(parseInt(decodedToken.id))
      setIsCoach(true)
    }
    setOpen(true)
  };
    
  const handleClose = () => {
    setOpen(false);
    setTraining({
      name: '', type: '', capacity: '',  cost: ''
    })
    setCapacityValue(null)
    setCostValue('')
    setIsNameError(false)
    setCoachId('')
    setComplexFacilityId('')
  };

  const handleSave = () => {
    if(training.name.length === 0 | coachId === '' | complexFacilityId === ''){
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
      if(costInputValue < 5 | costInputValue > 100){
        dispatch({
          type: 'UPDATE_ALERT',
          payload: {
            open: true,
            severity: 'error',
            message: 'Проверьте корректность ввода данных! Значение стоимости занятия не соответствует рыночным стандартам' 
            + ' (рекомендуемые значения: от 5 до 100 бел.руб.)',
          },});
    }
    else{
    const facility = facilities.find(facility => facility.idComplexFacility === complexFacilityId)
    const capacity = facility.capacity
    if(training.type !== 'персональное' && (capacityInputValue < 2 | capacityInputValue > 50 | capacityInputValue > capacity)){
      dispatch({
        type: 'UPDATE_ALERT',
        payload: {
          open: true,
          severity: 'error',
          message: capacityInputValue < 2 | capacityInputValue > 50 ? 'Проверьте корректность ввода данных! Емкость занятия/услуги (количество человек, которое могут посетить данное ' + 
          'занятие/приобрести услугу одновременно) не может принимать значения менее 2, либо более 50' :
          'Проверьте корректность ввода данных! Емкость занятия/услуги (количество человек, которое могут посетить данное ' + 
          'занятие/приобрести услугу одновременно) не может принимать большее значение, чем вместимость сооружения, в котором планируется проводить занятие',
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
          <FormControl fullWidth>
            <Autocomplete
            options={facilities}
            noOptionsText="Сооружения не найдены"
            getOptionLabel={(option) => "Сооружение №" + option.idComplexFacility + ": " + option.name}
            value={facilities.find(facility => facility.idComplexFacility === complexFacilityId)}
            onChange={(event, newValue) => {
             setComplexFacilityId(newValue?.idComplexFacility);
            }}
            filterOptions={facilitiesFilterOptions}
            renderInput={(params) => <TextField {...params} label="Место проведения" variant="standard" 
            InputProps={{
              ...params.InputProps,
              style: { width: 'auto', minWidth: '300px' },
            }}/>}
            />
          </FormControl>
            <FormControl fullWidth>
            <Autocomplete
            options={coaches}
            readOnly={isCoach}
            noOptionsText="Тренеры не найдены"
            getOptionLabel={(option) => "Тренер №" + option.userId + ": " + option.firstName + " " + option.surName}
            value={coaches.find(coach => coach.userId === coachId)}
            onChange={(event, newValue) => {
             setCoachId(newValue?.userId);
            }}
            filterOptions={coachesFilterOptions}
            renderInput={(params) => <TextField {...params} label="Тренер" variant="standard" 
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
         <Button onClick={handleSave}>Добавить</Button>
      </DialogActions>
    </Dialog>            
  </div>
  );
}

export default AddTraining;