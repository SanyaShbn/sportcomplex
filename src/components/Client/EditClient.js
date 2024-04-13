import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';

function EditClient(props) {
  const [open, setOpen] = useState(false);
  const [client, setClients] = useState({
    firstName: '', surName: '', patrSurName: '',  
    phoneNumber: '', email:''
  });

  const handleClickOpen = () => {
    setClients({
      firstName: props.data.row.firstName,
      surName: props.data.row.surName,
      patrSurName: props.data.row.patrSurName,
      phoneNumber: props.data.row.phoneNumber,
      email: props.data.row.email
     })      
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  };
  
  const handleChange = (event) => {
    setClients({...client, 
      [event.target.name]: event.target.value});
  }

  const handleSave = () => {
    props.updateClient(client, props.data.id);
    handleClose();
  }

  return(
    <div>
      <IconButton onClick={handleClickOpen}>
        <EditIcon color="primary" />
      </IconButton>
      <Dialog open={open} onClose={handleClose}>
          <DialogTitle className='dialog'>Обновление информации о клиенте</DialogTitle>
          <DialogContent className='dialog'>
            <Stack spacing={2} mt={1}>
            <TextField label="Имя" name="firstName" autoFocus
            variant="standard" value={client.firstName} 
            onChange={handleChange}/>
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

export default EditClient;