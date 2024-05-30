import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { SERVER_URL } from '../../../constants.js';
import {FormControl, TextField} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import { useValue } from '../../../context/ContextProvider.js';
import { NumberInput } from '../../../constants.js';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { jwtDecode } from 'jwt-decode';

function EditTrainingMembership(props) {

  const [membershipId, setMembershipId] = useState('');
  const [trainingId, setTrainingId] = useState('');
  const [memberships, setMemberships] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [open, setOpen] = useState(false);
  const [visitsAmountInputValue, setValue] = React.useState(null);
  const {
    dispatch,
  } = useValue();
    
  useEffect(() => {
    fetchTrainings();
    fetchMemberships();
  }, []);

  const membershipsFilterOptions = createFilterOptions({
    matchFrom: 'any',
    stringify: (option) => "Абонемент №" + option.idSportComplexMembership + ": " + option.name,
  });
  
  const trainingsFilterOptions = createFilterOptions({
    matchFrom: 'any',
    stringify: (option) => "Тренировка №" + option.idTraining + ". " + option.name,
  });

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
          message: 'Недостаточный уровень доступа. Сотрудник тренерского персонала не имеет прав на редактирование информации о пакетах услуг (исключительно просмотр)',
        },});
      }
      else{let id_membership = props.data.row.sportComplexMembership.slice(props.data.row.sportComplexMembership.indexOf("№") + 1, 
      props.data.row.sportComplexMembership.indexOf(":"))
      let id_training = props.data.row.training.slice(props.data.row.training.indexOf("№") + 1, props.data.row.training.indexOf("."))
      setMembershipId(parseInt(id_membership))
      setTrainingId(parseInt(id_training))       
      setOpen(true);
      setValue(props.data.row.visitsAmount)
      }
    }

  const handleClose = () => {
    setOpen(false);
  };
 
  const handleSave = () => {
    if(trainingId === '' || membershipId === '' || typeof membershipId === 'undefined' || typeof trainingId === 'undefined'){
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
    props.updateTrainingMembership(props.data.id, trainingId, membershipId, visitsAmountInputValue);
  
    handleClose();
  }
  }
  }

  return(
    <div>
      <IconButton onClick={handleClickOpen}>
        <EditIcon color="primary" />
      </IconButton>
      <Dialog open={open} onClose={handleClose}>
          <DialogTitle className='dialog'>Обновление информации о пакете услуг</DialogTitle>
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
         <Button onClick={handleClose}>Отмена</Button>
         <Button onClick={handleSave}>Сохранить</Button>
      </DialogActions>
        </Dialog>            
    </div>
  );  
}

export default EditTrainingMembership;