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
import CurrencyTextField from '@lupus-ai/mui-currency-textfield'
import { useValue } from '../../context/ContextProvider';
import { NumberInput } from '../../constants';

function EditTraining(props) {

  const [complexFacilityId, setComplexFacilityId] = useState([]);
  const [coachId, setCoachId] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [open, setOpen] = useState(false);
  const [training, setTraining] = useState({
    name: '', type: '', capacity: '',  cost: '', clients_amount: '', complexFacility: '', coach: ''
  });
  const [isGroup, setIsGroup] = useState(true);
  const [capacityInputValue, setCapacityValue] = React.useState(null);
  const [costInputValue, setCostValue] = React.useState(null);
  
  const {
    dispatch,
  } = useValue();

  useEffect(() => {
    fetchFacilities()
    fetchCoaches()
  }, []);

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
    let facilityId = props.data.row.complexFacility.slice(props.data.row.complexFacility.lastIndexOf("№") + 1)
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
  };
  
  const handleChange = (event) => {
    setTraining({...training, 
      [event.target.name]: event.target.value});
  }

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
      if(training.type !== 'персональное' && (capacityInputValue < 2 | capacityInputValue > 50)){
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
      if(training.type === 'персональное'){
        training.capacity = 1
      } else {training.capacity = capacityInputValue}
      training.cost = costInputValue
      props.updateTraining(training, props.data.id, complexFacilityId, coachId);
      handleClose();
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
        <TextField label="Наименование" name="name"
            variant="standard" value={training.name} 
            onChange={handleChange}/>
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
            {isGroup && (<NumberInput
            label="Емкость (чел.)"
            placeholder="Емкость (чел.)"
            variant="standard" value={capacityInputValue} 
            onChange={(event, val) => setCapacityValue(val)}/>
            )}
             <CurrencyTextField
		          label="Стоимость (бел.руб.)"
		          variant="standard"
	          	value={training.cost}
	          	currencySymbol="BYN"
		          outputFormat="string"
		          onChange={(event, value)=> setCostValue(value)}
            />
            <FormControl fullWidth>
            <InputLabel>Место проведения</InputLabel>
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
            <InputLabel>Тренер</InputLabel>
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