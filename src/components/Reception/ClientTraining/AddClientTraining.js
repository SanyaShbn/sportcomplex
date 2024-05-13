import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Select from '@mui/material/Select';
import { FormControl, InputLabel, MenuItem } from '@mui/material';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { SERVER_URL } from '../../../constants.js';
import '../../CSS/employeeCSS.css';
import '../../CSS/table.css';
import { useValue } from '../../../context/ContextProvider.js';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';


function AddClientTraining(props){

  const [clientId, setClientId] = useState('');
  const [trainingId, setTrainingId] = useState('');
  const [clients, setClients] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [open, setOpen] = useState(false);
  const {
    dispatch,
  } = useValue();

  useEffect(() => {
    fetchTrainings();
    fetchClients();
  }, []);

  const clientsFilterOptions = createFilterOptions({
    matchFrom: 'any',
    stringify: (option) => "Клиент №" + option.idClient + ": " + option.surName + " " + option.firstName + " " + option.patrSurName + 
    " (" + option.phoneNumber + ")",
  });
  
  const trainingsFilterOptions = createFilterOptions({
    matchFrom: 'any',
    stringify: (option) => "Тренировка №" + option.idTraining + ". " + option.name,
  });

  const fetchTrainings = () => {
      // const token = sessionStorage.getItem("jwt");
      fetch(SERVER_URL + '/api/view_trainings', {
        // headers: { 'Authorization' : token }
      })
      .then(response => response.json())
      .then(data => setTrainings(data))
      .catch(err => console.error(err));    
    }

    const fetchClients = () => {
        // const token = sessionStorage.getItem("jwt");
        fetch(SERVER_URL + '/api/view_clients', {
          // headers: { 'Authorization' : token }
        })
        .then(response => response.json())
        .then(data => setClients(data))
        .catch(err => console.error(err));    
      }

  const handleClickOpen = () => {
    fetchTrainings();
    fetchClients();
    setOpen(true);
  };
    
  const handleClose = () => {
    setOpen(false)
    setClientId('')
    setTrainingId('')
  };

  const handleSave = () => {
    if(clientId === '' | trainingId === ''){
      dispatch({
        type: 'UPDATE_ALERT',
        payload: {
          open: true,
          severity: 'error',
          message: 'Заполните обязательные поля!',
        },});
    }
    else{
    props.addClientTraining(trainingId, clientId);
    handleClose();
    }
  }

  return (
    <div>
    <Button className="shine-button" variant="contained" onClick={handleClickOpen}>
      Добавить информацию
    </Button>
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle className='dialog'>Новая продажа услуги</DialogTitle>
      <DialogContent className='dialog'>
        <Stack spacing={2} mt={1}>
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
         <Button onClick={handleSave}>Добавить</Button>
      </DialogActions>
    </Dialog>            
  </div>
  );
}

export default AddClientTraining;