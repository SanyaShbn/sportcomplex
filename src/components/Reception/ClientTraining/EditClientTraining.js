import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import { SERVER_URL } from '../../../constants.js';
import {FormControl, InputLabel, MenuItem} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import { useValue } from '../../../context/ContextProvider.js';

function EditClientTraining(props) {

    const [clientId, setClientId] = useState([]);
    const [trainingId, setTrainingId] = useState([]);
    const [clients, setClients] = useState([]);
    const [trainings, setTrainings] = useState([]);
    const [open, setOpen] = useState(false);
    const [client_training, setClientTraining] = useState({
      status: '', client: '', training: ''
    });
    const {
      dispatch,
    } = useValue();

  useEffect(() => {
    fetchTrainings();
    fetchClients();
  }, []);

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
    let id_client = props.data.row.client.slice(props.data.row.client.indexOf("№") + 1, props.data.row.client.indexOf(":"))
    let id_training = props.data.row.training.slice(props.data.row.training.indexOf("№") + 1, props.data.row.training.indexOf("."))
    setClientId(parseInt(id_client))
    setTrainingId(parseInt(id_training))
    setClientTraining({
      status: props.data.row.status,
      client: parseInt(id_client),
      training: parseInt(id_training),
     })     
    fetchTrainings();
    fetchClients();
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false)
    setTrainingId('')
    setClientId('')
  };

  const handleChangeTraining = (event) => {
    setTrainingId(event.target.value) 
    setClientTraining({...client_training, 
      [event.target.name]: event.target.value});
  }
  const handleChangeClient = (event) => {
    setClientId(event.target.value)
    setClientTraining({...client_training, 
      [event.target.name]: event.target.value});
  }
 
  const handleSave = () => {
    if(clientId.length === 0 | trainingId.length === 0){
      dispatch({
        type: 'UPDATE_ALERT',
        payload: {
          open: true,
          severity: 'error',
          message: 'Заполните обязательные поля!',
        },});
    }
    else{
    props.updateClientTraining(props.data.id, trainingId, clientId);
    handleClose();
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
            <InputLabel required>Тренировки</InputLabel>
             <Select
             name='training'
             autoFocus variant="standard"
             label="Тренировки"
             value={client_training.training}
             onChange={handleChangeTraining}>
             {trainings.map(training => {
              if (training.capacity > training.clients_amount) {
                  let facility = training.complexFacility && training.complexFacility.facilityType ? training.complexFacility.facilityType : "не установлено";
                  return (
                   <MenuItem key={training.idTraining}
                    value={training.idTraining}>{"Тренировка №" + training.idTraining
                    + ". Место проведения: " + facility}</MenuItem>
                  );
              }
              return null;
            })}
            </Select>
            </FormControl>
            <FormControl fullWidth>
            <InputLabel required>Клиенты</InputLabel>
             <Select
             name='client'
             autoFocus variant="standard"
             label="Клиенты"
             value={client_training.client}
             onChange={handleChangeClient}>
             {clients.map(client => (
               <MenuItem key={client.idClient}
                value={client.idClient}>{"Клиент №" + client.idClient + ": " + client.surName + " " + client.firstName + " " + client.patrSurName + 
                " (" + client.phoneNumber + ")"}</MenuItem>
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

export default EditClientTraining;