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

function EditClientMembership(props) {

    const [membershipId, setMembershipId] = useState([]);
    const [clientId, setClientId] = useState([]);
    const [memberships, setMemberships] = useState([]);
    const [clients, setClients] = useState([]);
    const [open, setOpen] = useState(false);
    const [client_membership, setClientMembership] = useState({
      sportComplexMembership: '', client: ''
    });
    const {
      dispatch,
    } = useValue();

    useEffect(() => {
      fetchClients();
      fetchMemberships();
    }, []);
  
    const fetchClients = () => {
      // const token = sessionStorage.getItem("jwt");
      fetch(SERVER_URL + '/api/view_clients', {
        // headers: { 'Authorization' : token }
      })
      .then(response => response.json())
      .then(data => setClients(data))
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
      let id_client = props.data.row.client.slice(props.data.row.client.indexOf("№") + 1, props.data.row.client.indexOf(":"))
      let id_membership = props.data.row.sportComplexMembership.slice(props.data.row.sportComplexMembership.indexOf("№") + 1, 
      props.data.row.sportComplexMembership.indexOf(":"))
      setMembershipId(parseInt(id_membership))
      setClientId(parseInt(id_client))
      setClientMembership({
        sportComplexMembership: parseInt(id_membership),
        client: parseInt(id_client),
       })  
      setOpen(true);
    }

    const handleChangeMembership = (event) => {
      setMembershipId(event.target.value) 
      setClientMembership({...client_membership, 
        [event.target.name]: event.target.value});
    }
    const handleChangeClient = (event) => {
      setClientId(event.target.value)
      setClientMembership({...client_membership, 
        [event.target.name]: event.target.value});
    }

  const handleClose = () => {
    setOpen(false);
  };
 
  const handleSave = () => {
    if(clientId.length === 0 | membershipId.length === 0){
      dispatch({
        type: 'UPDATE_ALERT',
        payload: {
          open: true,
          severity: 'error',
          message: 'Заполните обязательные поля!',
        },});
    }
    else{
    props.updateClientMembership(props.data.id, membershipId, clientId);
    handleClose();
    }
  }

  return(
    <div>
      <IconButton onClick={handleClickOpen}>
        <EditIcon color="primary" />
      </IconButton>
      <Dialog open={open} onClose={handleClose}>
          <DialogTitle className='dialog'>Обновление информации о продаже абонемента</DialogTitle>
          <DialogContent className='dialog'>
        <Stack spacing={2} mt={1}>
        <FormControl fullWidth>
            <InputLabel required>Клиенты</InputLabel>
             <Select
             name='client'
             autoFocus variant="standard"
             label="Клиенты"
             value={client_membership.client}
             onChange={handleChangeClient}>
             {clients.map(client => (
               <MenuItem key={client.idClient}
                value={client.idClient}>{"Клиент №" + client.idClient + ": " + client.surName + " " + client.firstName + " " + client.patrSurName + 
                " (" + client.phoneNumber + ")"}</MenuItem>
             ))}
            </Select>
            </FormControl>
            <FormControl fullWidth>
            <InputLabel required>Абонементы</InputLabel>
             <Select
             name='sportComplexMembership'
             autoFocus variant="standard"
             label="Абонементы"
             value={client_membership.sportComplexMembership}
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

export default EditClientMembership;