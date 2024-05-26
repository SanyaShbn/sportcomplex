import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { FormControl } from '@mui/material';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { SERVER_URL } from '../../../constants.js';
import '../../CSS/employeeCSS.css';
import '../../CSS/table.css';
import { useValue } from '../../../context/ContextProvider.js';
import { NumberInput } from '../../../constants.js';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { jwtDecode } from 'jwt-decode';

function AddTrainingMembership(props){

  const [membershipId, setMembershipId] = useState('');
  const [trainingId, setTrainingId] = useState('');
  const [memberships, setMemberships] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [open, setOpen] = useState(false);
  const [membership, setMembership] = useState({
    visitsAmount: ''
  });
  const [visitsAmountInputValue, setValue] = useState(null);

  const {
    dispatch,
  } = useValue();

const membershipsFilterOptions = createFilterOptions({
  matchFrom: 'any',
  stringify: (option) => "Абонемент №" + option.idSportComplexMembership + ": " + option.name,
});

const trainingsFilterOptions = createFilterOptions({
  matchFrom: 'any',
  stringify: (option) => "Тренировка №" + option.idTraining + ". " + option.name,
});

  useEffect(() => {
    fetchTrainings();
    fetchMemberships();
  }, []);

  const fetchTrainings = () => {
    const token = sessionStorage.getItem("jwt");
    fetch(SERVER_URL + '/api/view_trainings', {
      headers: { 'Authorization' : token }
    })
    .then(response => response.json())
    .then(data => setTrainings(data))
    .catch(err => console.error(err));    
  }

    const fetchMemberships = () => {
        const token = sessionStorage.getItem("jwt");
        fetch(SERVER_URL + '/api/view_memberships', {
          headers: { 'Authorization' : token }
        })
        .then(response => response.json())
        .then(data => setMemberships(data))
        .catch(err => console.error(err));    
      }

  const handleClickOpen = () => {
    if(jwtDecode(sessionStorage.getItem("jwt")).roles.toString() === 'COACH'){
      dispatch({
        type: 'UPDATE_ALERT',
        payload: {
        open: true,
        severity: 'error',
        message: 'Недостаточный уровень доступа. Сотрудник тренерского персонала не имеет прав на формирование пакетов услуг (исключительно просмотр)',
      },});
    }
    else{
    setOpen(true)
    }
  };
    
  const handleClose = () => {
    setOpen(false);
    setMembership({
        visitsAmount: ''
      })
    setValue(null)
    setTrainingId('')
    setMembershipId('')
  };

  const handleSave = () => {
    if(trainingId === '' | membershipId.length === ''){
      dispatch({
        type: 'UPDATE_ALERT',
        payload: {
          open: true,
          severity: 'error',
          message: 'Заполните обязательные поля!',
        },});
    }
    else{
    if(visitsAmountInputValue < 1 | visitsAmountInputValue > 30){
      dispatch({
        type: 'UPDATE_ALERT',
        payload: {
          open: true,
          severity: 'error',
          message: 'Проверьте корректность ввода данных! Количество входящих в абонемент услуг не может принимать значение менее 1, ' 
          + "либо более 30",
        },});
    }
    else{
    membership.visitsAmount = visitsAmountInputValue
    props.addTrainingMembership(membership, trainingId, membershipId);
    handleClose();
    }
  }
  }

  return (
    <div>
    <Button className="shine-button" variant="contained" onClick={handleClickOpen}>
      Добавить информацию
    </Button>
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle className='dialog'>Новый пакет услуг</DialogTitle>
      <DialogContent className='dialog'>
        <Stack spacing={2} mt={1}>
           <NumberInput
            label="Количество занятий в пакете"
            placeholder="Количество занятий в пакете"
            variant="standard" value={visitsAmountInputValue} 
            onChange={(event, val) => setValue(val)}/>
            <FormControl fullWidth>
            <Autocomplete
            options={trainings}
            noOptionsText="Тренировки не найдены"
            getOptionLabel={(option) => "Тренировка №" + option.idTraining + ". " + option.name}
            value={trainings.find(training => training.idTraining  === trainingId)}
            onChange={(event, newValue) => {
             setTrainingId(newValue?.idTraining);
            }}
            filterOptions={trainingsFilterOptions}
            renderInput={(params) => <TextField {...params} label="Тренировки" variant="standard" 
            InputProps={{
              ...params.InputProps,
              style: { width: 'auto', minWidth: '300px' },
            }}/>}
            />
            </FormControl>
            <FormControl fullWidth>
            <Autocomplete
            options={memberships}
            noOptionsText="Абонементы не найдены"
            getOptionLabel={(option) => "Абонемент №" + option.idSportComplexMembership + ": " + option.name}
            value={memberships.find(membership => membership.idSportComplexMembership === membershipId)}
            onChange={(event, newValue) => {
             setMembershipId(newValue?.idSportComplexMembership);
            }}
            filterOptions={membershipsFilterOptions}
            renderInput={(params) => <TextField {...params} label="Абонементы" variant="standard" 
            InputProps={{
              ...params.InputProps,
              style: { width: 'auto', minWidth: '300px' },
            }}/>}
            />
           </FormControl>
        </Stack>
      </DialogContent>
      <DialogActions>
         <Button onClick={handleClose} >Отмена</Button>
         <Button onClick={handleSave}>Добавить</Button>
      </DialogActions>
    </Dialog>            
  </div>
  );
}

export default AddTrainingMembership;