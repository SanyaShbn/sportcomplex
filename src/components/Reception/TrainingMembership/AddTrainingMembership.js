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
import { useValue } from '../../../context/ContextProvider.js';
import { NumberInput } from '../../../constants.js';

function AddTrainingMembership(props){

  const [membershipId, setMembershipId] = useState('');
  const [trainingId, setTrainingId] = useState('');
  const [memberships, setMemberships] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [open, setOpen] = useState(false);
  const [membership, setMembership] = useState({
    visitsAmount: ''
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
    setOpen(true);
  };
    
  const handleClose = () => {
    setOpen(false);
    setMembership({
        visitsAmount: ''
      })
    setValue(null)
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
            <InputLabel required>Тренировки</InputLabel>
             <Select
             name='training'
             autoFocus variant="standard"
             label="Тренировки"
             value={trainingId} 
             onChange={(event) => { setTrainingId(event.target.value) }}>
              {trainings.map(training => {
              let facility = training.complexFacility && training.complexFacility.facilityType ? training.complexFacility.facilityType : "не установлено";
              return (
               <MenuItem key={training.idTraining}
                value={training.idTraining}>{"Тренировка №" + training.idTraining
                + ". Место проведения: " + facility}</MenuItem>
              );
            })}
            </Select>
            </FormControl>
            <FormControl fullWidth>
            <InputLabel required>Абонементы</InputLabel>
             <Select
             name='client'
             autoFocus variant="standard"
             label="Абонементы"
             value={membershipId} 
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