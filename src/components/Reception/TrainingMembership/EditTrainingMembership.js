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
import { useValue } from '../../../context/ContextProvider.js';
import { NumberInput } from '../../../constants.js';


function EditTrainingMembership(props) {

  const [membershipId, setMembershipId] = useState([]);
  const [trainingId, setTrainingId] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [open, setOpen] = useState(false);
  const [training_membership, setTrainingMembership] = useState({
    visitsAmount: '', sportComplexMembership: '', training: ''
  });
  const [visitsAmountInputValue, setValue] = React.useState(null);
  const {
    dispatch,
  } = useValue();
    
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
      setValue(props.data.row.visitsAmount)
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

  const handleClose = () => {
    setOpen(false);
  };
 
  const handleSave = () => {
    if(trainingId.length === 0 | membershipId.length === 0){
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
            <InputLabel required>Тренировки</InputLabel>
             <Select
             name='training'
             autoFocus variant="standard"
             label="Тренировки"
             value={training_membership.training}
             onChange={handleChangeTraining}>
             {trainings.map(training => {
              return (
               <MenuItem key={training.idTraining}
                value={training.idTraining}>{"Тренировка №" + training.idTraining
                + ". " + training.name}</MenuItem>
              );
            })}
            </Select>
            </FormControl>
            <FormControl fullWidth>
            <InputLabel required>Абонементы</InputLabel>
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