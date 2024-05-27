import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { SERVER_URL } from '../../constants.js';
import { FormControl, RadioGroup, FormControlLabel, Radio, InputLabel, FormLabel } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import { useValue } from '../../context/ContextProvider';
import { NumberInput } from '../../constants';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { jwtDecode } from 'jwt-decode';

function EditTraining(props) {

  const [complexFacilityId, setComplexFacilityId] = useState('');
  const [coachId, setCoachId] = useState('');
  const [facilities, setFacilities] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [open, setOpen] = useState(false);
  const [training, setTraining] = useState({
    name: '', type: '', capacity: '',  cost: '', clients_amount: '', complexFacility: '', coach: ''
  });
  const [isGroup, setIsGroup] = useState(props.data.row.type === "групповое");
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
    if(props.data.row.type !== "групповое"){
      setIsGroup(false)
    }

    let facilityId = props.data.row.complexFacility !== 'не установлено' ? props.data.row.complexFacility.slice(props.data.row.complexFacility.indexOf("№") + 1,
     props.data.row.complexFacility.indexOf(":")) : ''
    let idCoach = props.data.row.coach !== 'не назначен' ? props.data.row.coach.slice(props.data.row.coach.indexOf("№") + 1,
     props.data.row.coach.indexOf(":")) : ''
    facilityId !== '' ? setComplexFacilityId(parseInt(facilityId)) : setComplexFacilityId(facilityId) 
    idCoach !== '' ? setCoachId(parseInt(idCoach)) : setCoachId(idCoach) 
    setTraining({
      name: props.data.row.name,
      type: props.data.row.type,
      capacity: props.data.row.capacity,
      cost: props.data.row.cost,
      clients_amount: props.data.row.clients_amount,
      complexFacility: facilityId !== '' ? parseInt(facilityId) : '',
      coach: idCoach !== '' ? parseInt(idCoach) : '',
     })      
    setCapacityValue(props.data.row.capacity)
    setCostValue(props.data.row.cost)
    if(roles.toString() === 'COACH'){
      setIsCoach(true)
      if(decodedToken.id === idCoach){
        setOpen(true)
        }
        else{
          dispatch({
            type: 'UPDATE_ALERT',
            payload: {
              open: true,
              severity: 'error',
              message: 'Недостаточный уровень доступа. Сотрудник тренерского персонала имеет право редактировать только проводимые лично им тренировки',
            },});
        }
    }else{setOpen(true)}
  }

  const handleClose = () => {
    setOpen(false);
    setIsNameError(false)
  };
  const handleSave = () => {
    if(training.name.length === 0 | typeof coachId === 'undefined' || typeof complexFacilityId === 'undefined'
    || coachId === '' || complexFacilityId === ''
    ){
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
      if(training.type === 'персональное'){
        training.capacity = 1
      } else {training.capacity = capacityInputValue}
      training.cost = costInputValue
      props.updateTraining(training, props.data.id, complexFacilityId, coachId);
      handleClose();
    }
    }
    }
    }
  }

  const handleChangeType = (event) => {
    setTraining({...training, type:event.target.value})
    setIsGroup(event.target.value === 'групповое');
  };

  return(
    <div>
      <IconButton onClick={handleClickOpen}>
        <EditIcon color="primary" />
      </IconButton>
      <Dialog open={open} onClose={handleClose}>
          <DialogTitle className='dialog'>Обновление информации о тренировке</DialogTitle>
          <DialogContent className='dialog'>
        <Stack spacing={2} mt={1}>
        <TextField error={isNameError} label="Наименование" name="name" required
            variant="standard" value={training.name} 
            onChange={handleNameErrorChange}/>
            <FormControl fullWidth>
            <FormLabel id="demo-radio-buttons-group-label">Тип занятия</FormLabel>
            <RadioGroup
              required
              aria-labelledby="demo-radio-buttons-group-label"
              value={training.type}
              name="radio-buttons-group"
              onChange={handleChangeType}
            >
            <FormControlLabel value="групповое" control={<Radio />} label="Групповое" />
            <FormControlLabel value="персональное" control={<Radio />} label="Персональное" />
            </RadioGroup>
            </FormControl>
            {isGroup && (<NumberInput required
            label="Емкость (чел.)"
            placeholder="Емкость (чел.)"
            variant="standard" value={capacityInputValue} 
            onChange={(event, val) => setCapacityValue(val)}/>
            )}
         <FormControl fullWidth sx={{ m: 1 }}>
         <InputLabel error={isCostError} htmlFor="outlined-adornment-amount">Стоимость (бел.руб.)</InputLabel>
          <OutlinedInput
            required
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
            renderInput={(params) => <TextField required {...params} label="Место проведения" variant="standard" 
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
            renderInput={(params) => <TextField required {...params} label="Тренер" variant="standard" 
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

export default EditTraining;