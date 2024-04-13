import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import { SERVER_URL } from '../../../constants.js';
import {FormControl, InputLabel, MenuItem, TextField} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';

function EditTrainingMembership(props) {

  const [membershipId, setMembershipId] = useState([]);
  const [trainingId, setTrainingId] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [open, setOpen] = useState(false);
  const [updatedVisitsAmount, setVisitsAmount] = useState([]);
  const [training_membership, setTrainingMembership] = useState({
    visitsAmount: '', sportComplexMembership: '', training: ''
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
      let id_membership = props.data.row.sportComplexMembership.slice(props.data.row.sportComplexMembership.indexOf("№") + 1, 
      props.data.row.sportComplexMembership.indexOf(":"))
      let id_training = props.data.row.training.slice(props.data.row.training.indexOf("№") + 1, props.data.row.training.indexOf("."))
      setMembershipId(parseInt(id_membership))
      setTrainingId(parseInt(id_training))
      setTrainingMembership({
        visitsAmount: props.data.row.visitsAmount,
        sportComplexMembership: parseInt(id_membership),
        training: parseInt(id_training),
      })          
      setOpen(true);
      }
      
  const handleChangeMembership = (event) => {
    setMembershipId(event.target.value) 
    setTrainingMembership({...training_membership, 
      [event.target.name]: event.target.value});
  }

  const handleChangeTraining = (event) => {
    setTrainingId(event.target.value) 
    setTrainingMembership({...training_membership, 
      [event.target.name]: event.target.value});
  }

  const handleChangeAmount= (event) => {
    setVisitsAmount(event.target.value)
    setTrainingMembership({...training_membership, 
      [event.target.name]: event.target.value});
  }

  const handleClose = () => {
    setOpen(false);
  };
 
  const handleSave = () => {
    if (updatedVisitsAmount !== " " && updatedVisitsAmount.length !== 0){
      props.updateTrainingMembership(props.data.id, trainingId, membershipId, updatedVisitsAmount)
      setVisitsAmount(" ")
    } 
    else{
      props.updateTrainingMembership(props.data.id, trainingId, membershipId, props.data.row.visitsAmount);
    }
    handleClose();
  }

  return(
    <div>
      <IconButton onClick={handleClickOpen}>
        <EditIcon color="primary" />
      </IconButton>
      <Dialog open={open} onClose={handleClose}>
          <DialogTitle className='dialog'>Обновление информации о пакете тренировок</DialogTitle>
          <DialogContent className='dialog'>
        <Stack spacing={2} mt={1}>
            <TextField label="Количество занятий в пакете" name="visitsAmount" autoFocus
            variant="standard" value={training_membership.visitsAmount} 
            onChange={handleChangeAmount}/>
            <FormControl fullWidth>
            <InputLabel>Тренировки</InputLabel>
             <Select
             name='training'
             autoFocus variant="standard"
             label="Тренировки"
             value={training_membership.training}
             onChange={handleChangeTraining}>
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
             name='sportComplexMembership'
             autoFocus variant="standard"
             label="Абонементы"
             value={training_membership.sportComplexMembership}
             onChange={handleChangeMembership}>
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
         <Button onClick={handleSave}>Сохранить</Button>
      </DialogActions>
        </Dialog>            
    </div>
  );  
}

export default EditTrainingMembership;