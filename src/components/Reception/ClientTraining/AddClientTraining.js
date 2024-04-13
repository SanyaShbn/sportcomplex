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


function AddClientTraining(props){

  const [clientId, setClientId] = useState([]);
  const [trainingId, setTrainingId] = useState([]);
  const [clients, setClients] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [open, setOpen] = useState(false);

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
    setOpen(true);
  };
    
  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    props.addClientTraining(trainingId, clientId);
    handleClose();
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
            <InputLabel>Тренировки</InputLabel>
             <Select
             name='training'
             autoFocus variant="standard"
             label="Тренировки"
             onChange={(event) => { setTrainingId(event.target.value) }}>
             {trainings.map(training => (
               <MenuItem key={training.idTraining}
                value={training.idTraining}>{"Тренировка №" + training.idTraining
                + ". Место проведения: " + training.complexFacility.facilityType}</MenuItem>
             ))}
            </Select>
            </FormControl>
            <FormControl fullWidth>
            <InputLabel>Клиенты</InputLabel>
             <Select
             name='client'
             autoFocus variant="standard"
             label="Клиенты"
             onChange={(event) => { setClientId(event.target.value) }}>
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
         <Button onClick={handleSave}>Добавить</Button>
      </DialogActions>
    </Dialog>            
  </div>
  );
}

export default AddClientTraining;