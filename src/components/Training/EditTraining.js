import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import { SERVER_URL } from '../../constants.js';
import { FormControl, RadioGroup, FormControlLabel, Radio, InputLabel, MenuItem, FormLabel } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import { useValue } from '../../context/ContextProvider';
import { NumberInput } from '../../constants';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

function EditTraining(props) {

  const [complexFacilityId, setComplexFacilityId] = useState([]);
  const [coachId, setCoachId] = useState([]);
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
  
  const {
    dispatch,
  } = useValue();

  useEffect(() => {
    fetchFacilities()
    fetchCoaches()
  }, []);

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
    if(props.data.row.type !== "групповое"){
      setIsGroup(false)
    }
    let facilityId = props.data.row.complexFacility.slice(props.data.row.complexFacility.indexOf("№") + 1,
     props.data.row.complexFacility.indexOf(":"))
    let idCoach = props.data.row.coach.slice(props.data.row.coach.indexOf("№") + 1, props.data.row.coach.indexOf(":"))
    setComplexFacilityId(parseInt(facilityId))
    setCoachId(parseInt(idCoach))
    setTraining({
      name: props.data.row.name,
      type: props.data.row.type,
      capacity: props.data.row.capacity,
      cost: props.data.row.cost,
      clients_amount: props.data.row.clients_amount,
      complexFacility: parseInt(facilityId),
      coach: parseInt(idCoach),
     })      
    setCapacityValue(props.data.row.capacity)
    setCostValue(props.data.row.cost)
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
    setIsNameError(false)
  };

  const handleChangeComplexFacility = (event) => {
    setComplexFacilityId(event.target.value)
    setTraining({...training, 
      [event.target.name]: event.target.value});
  }
 
  const handleChangeCoach = (event) => {
    setCoachId(event.target.value)
    setTraining({...training, 
      [event.target.name]: event.target.value});
  }
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
            error={isCostError}
            id="outlined-adornment-amount"
            value={costInputValue}
            onChange={handleCostErrorChange}
            startAdornment={<InputAdornment position="start">BYN</InputAdornment>}
            label="Стоимость (бел.руб.)"
          />
          </FormControl>
            <FormControl fullWidth>
            <InputLabel required>Место проведения</InputLabel>
             <Select
             name='complexFacility'
             autoFocus variant="standard"
             label="Место проведения"
             value={training.complexFacility}
             onChange={handleChangeComplexFacility}>
             {facilities.map(facility => (
               <MenuItem key={facility.idComplexFacility}
                value={facility.idComplexFacility}>{"Сооружение №" + facility.idComplexFacility + ": " + facility.name}</MenuItem>
             ))}
            </Select>
            </FormControl>
            <FormControl>
            <InputLabel required>Тренер</InputLabel>
             <Select
             name='coach'
             autoFocus variant="standard"
             label="Тренер"
             value={training.coach}
             onChange={handleChangeCoach}>
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
         <Button onClick={handleSave}>Сохранить</Button>
      </DialogActions>
        </Dialog>            
    </div>
  );  
}

export default EditTraining;