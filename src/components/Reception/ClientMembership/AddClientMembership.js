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
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { jwtDecode } from 'jwt-decode';

function AddClientMembership(props){

  const [membershipId, setMembershipId] = useState('');
  const [clientId, setClientId] = useState('');
  const [memberships, setMemberships] = useState([]);
  const [clients, setClients] = useState([]);
  const [open, setOpen] = useState(false);
  const {
    dispatch,
  } = useValue();
  
  const clientsFilterOptions = createFilterOptions({
    matchFrom: 'any',
    stringify: (option) => "Клиент №" + option.idClient + ": " + option.surName + " " + option.firstName + " " + option.patrSurName + 
    " (" + option.phoneNumber + ")",
  });
  
  const membershipsFilterOptions = createFilterOptions({
    matchFrom: 'any',
    stringify: (option) => "Абонемент №" + option.idSportComplexMembership + ": " + option.name,
  });

  useEffect(() => {
    fetchClients();
    fetchMemberships();
  }, []);

  const fetchClients = () => {
    const token = sessionStorage.getItem("jwt");
    fetch(SERVER_URL + '/api/view_clients', {
      headers: { 'Authorization' : token }
    })
    .then(response => response.json())
    .then(data => setClients(data))
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
        message: 'Недостаточный уровень доступа. Сотрудник тренерского персонала не имеет прав на оформление продаж абонементов (исключительно просмотр)',
      },});
    }
    else{
    setOpen(true);
    }
  };
    
  const handleClose = () => {
    setOpen(false);
    setClientId('')
    setMembershipId('')
  };

  const handleSave = () => {
    if(clientId === '' | membershipId === ''){
      dispatch({
        type: 'UPDATE_ALERT',
        payload: {
          open: true,
          severity: 'error',
          message: 'Заполните обязательные поля!',
        },});
    }
    else{
    props.addClientMembership(membershipId, clientId);
    handleClose();
    }
  }

  return (
    <div>
    <Button className="shine-button" variant="contained" onClick={handleClickOpen}>
      Добавить информацию
    </Button>
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle className='dialog'>Новая продажа абонемента</DialogTitle>
      <DialogContent className='dialog'>
        <Stack spacing={2} mt={1}>
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
         <Button onClick={handleSave}>Добавить</Button>
      </DialogActions>
    </Dialog>            
  </div>
  );
}

export default AddClientMembership;