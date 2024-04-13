import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Select from '@mui/material/Select';
import { FormControl, InputLabel, MenuItem, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { SERVER_URL } from '../../../constants.js';
import '../../CSS/employeeCSS.css';
import '../../CSS/table.css';


function AddTrainingMembership(props){

  const [membershipId, setMembershipId] = useState([]);
  const [trainingId, setTrainingId] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [open, setOpen] = useState(false);
  const [membership, setMembership] = useState({
    visitsAmount: ''
  });

  useEffect(() => {
    fetchTrainings();
    fetchMemberships();
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

    const fetchMemberships = () => {
        // const token = sessionStorage.getItem("jwt");
        fetch(SERVER_URL + '/api/view_memberships', {
          // headers: { 'Authorization' : token }
        })
        .then(response => response.json())
        .then(data => setMemberships(data))
        .catch(err => console.error(err));    
      }

  const handleClickOpen = () => {
    setOpen(true);
  };
    
  const handleClose = () => {
    setOpen(false);
    setMembership({
        visitsAmount: ''
      })
  };

  const handleSave = () => {
    props.addTrainingMembership(membership, trainingId, membershipId);
    handleClose();
  }

  const handleChange = (event) => {
    setMembership({...membership, 
      [event.target.name]: event.target.value});
  }

  return (
    <div>
    <Button className="shine-button" variant="contained" onClick={handleClickOpen}>
      Добавить информацию
    </Button>
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle className='dialog'>Новый пакет тренировок</DialogTitle>
      <DialogContent className='dialog'>
        <Stack spacing={2} mt={1}>
            <TextField label="Количество занятий в пакете" name="visitsAmount" autoFocus
            variant="standard" value={membership.visitsAmount} 
            onChange={handleChange}/>
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
            <InputLabel>Абонементы</InputLabel>
             <Select
             name='client'
             autoFocus variant="standard"
             label="Абонементы"
             onChange={(event) => { setMembershipId(event.target.value) }}>
             {memberships.map(membership => (
               <MenuItem key={membership.idSportComplexMembership}
                value={membership.idSportComplexMembership}>{"Абонемент №" + membership.idSportComplexMembership + ": " + membership.name}</MenuItem>
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

export default AddTrainingMembership;