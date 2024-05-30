import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { SERVER_URL } from '../../../constants.js';
import {FormControl } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import { useValue } from '../../../context/ContextProvider.js';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { NumberInput } from '../../../constants.js';
import { jwtDecode } from 'jwt-decode';

function EditClientTraining(props) {

    const [clientId, setClientId] = useState('');
    const [trainingId, setTrainingId] = useState('');
    const [clients, setClients] = useState([]);
    const [trainings, setTrainings] = useState([]);
    const [open, setOpen] = useState(false);
    const {
      dispatch,
    } = useValue();
    const [signingsAmountInputValue, setValue] = useState(null);

    const clientsFilterOptions = createFilterOptions({
      matchFrom: 'any',
      stringify: (option) => "Клиент №" + option.idClient + ": " + option.surName + " " + option.firstName + " " + option.patrSurName + 
      " (" + option.phoneNumber + ")",
    });
    
    const trainingsFilterOptions = createFilterOptions({
      matchFrom: 'any',
      stringify: (option) => "Тренировка №" + option.idTraining + ". " + option.name,
    });

  useEffect(() => {
    fetchTrainings();
    fetchClients();
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

  const fetchClients = () => {
      const token = sessionStorage.getItem("jwt");
      fetch(SERVER_URL + '/api/view_clients', {
        headers: { 'Authorization' : token }
      })
      .then(response => response.json())
      .then(data => setClients(data))
      .catch(err => console.error(err));    
    }

  const handleClickOpen = () => {  
    if(jwtDecode(sessionStorage.getItem("jwt")).roles.toString() === 'MANAGER'){
      dispatch({
        type: 'UPDATE_ALERT',
        payload: {
        open: true,
        severity: 'error',
        message: 'Недостаточный уровень доступа. Менеджер по клиентам не имеет прав на согласование занятий (исключительно просмотр)',
      },});
    }
    else{
    let id_client = props.data.row.client.slice(props.data.row.client.indexOf("№") + 1, props.data.row.client.indexOf(":"))
    let id_training = props.data.row.training.slice(props.data.row.training.indexOf("№") + 1, props.data.row.training.indexOf("."))
    setClientId(parseInt(id_client))
    setTrainingId(parseInt(id_training))   
    setValue(props.data.row.signingsAmount)
    fetchTrainings();
    fetchClients();
    setOpen(true);
    }
  }

  const handleClose = () => {
    setOpen(false)
    setTrainingId('')
    setClientId('')
  };
 
  const handleSave = () => {
    if(clientId === '' || trainingId === '' || typeof clientId === 'undefined' || typeof trainingId === 'undefined'){
      dispatch({
        type: 'UPDATE_ALERT',
        payload: {
          open: true,
          severity: 'error',
          message: 'Заполните обязательные поля!',
        },});
    }
    else{
      if(signingsAmountInputValue < 1){
      dispatch({
        type: 'UPDATE_ALERT',
        payload: {
          open: true,
          severity: 'error',
          message: 'Проверьте корректность ввода данных! Планируемое количество посещений не может принимать значение менее 1',
        },});
    }
    else{
    props.updateClientTraining(props.data.id, trainingId, clientId, signingsAmountInputValue);
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
          <DialogTitle className='dialog'>Обновление информации о продаже</DialogTitle>
          <DialogContent className='dialog'>
        <Stack spacing={2} mt={1}>
        <FormControl fullWidth>
            <NumberInput
            label="Планируемое количество посещений"
            placeholder="Планируемое количество посещений"
            variant="standard" value={signingsAmountInputValue} 
            onChange={(event, val) => setValue(val)}/>
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
            options={clients}
            noOptionsText="Клиенты не найдены"
            getOptionLabel={(option) => "Клиент №" + option.idClient + ": " + option.surName + " " + option.firstName + " " + option.patrSurName + 
            " (" + option.phoneNumber + ")"}
            value={clients.find(client => client.idClient  === clientId)}
            onChange={(event, newValue) => {
             setClientId(newValue?.idClient);
            }}
            filterOptions={clientsFilterOptions}
            renderInput={(params) => <TextField {...params} label="Клиенты" variant="standard" 
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

export default EditClientTraining;