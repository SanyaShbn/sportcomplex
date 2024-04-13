import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';

function EditSportComplexMembership(props) {
  const [open, setOpen] = useState(false);
  const [membership, setMembership] = useState({
    name: '', durationDeadline: '', cost: '', completeVisitsAmount: ''
  });
    
  const handleClickOpen = () => {
    setMembership({
      name: props.data.row.name,
      durationDeadline: props.data.row.durationDeadline,
      cost: props.data.row.cost,
      completeVisitsAmount: props.data.row.completeVisitsAmount,
     })      
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  };
  
  const handleChange = (event) => {
    setMembership({...membership, 
      [event.target.name]: event.target.value});
  }

  const handleSave = () => {
    props.updateMembership(membership, props.data.id);
    handleClose();
  }

  return(
    <div>
      <IconButton onClick={handleClickOpen}>
        <EditIcon color="primary" />
      </IconButton>
      <Dialog open={open} onClose={handleClose}>
          <DialogTitle className='dialog'>Обновление информации об абонементе</DialogTitle>
          <DialogContent className='dialog'>
            <Stack spacing={2} mt={1}>
            <TextField label="Наименование" name="name" autoFocus
            variant="standard" value={membership.name} 
            onChange={handleChange}/>
           <TextField type='date' label="Дата окончания срока действия" name="durationDeadline"
            variant="standard" value={membership.durationDeadline} 
            onChange={handleChange} InputProps={{
                inputProps: {
                  inputMode: 'numeric',
                },
                startAdornment: (
                  <InputAdornment position="start"> </InputAdornment>
                ),
              }}/>
          <TextField label="Стоимость" name="cost" 
            variant="standard" value={membership.cost} 
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

export default EditSportComplexMembership;