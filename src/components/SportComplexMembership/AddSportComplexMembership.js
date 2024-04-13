import React, { useState } from 'react';
import '../CSS/employeeCSS.css';
import '../CSS/table.css';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import InputAdornment from '@mui/material/InputAdornment';

function AddSportComplexMembership(props){
  const [open, setOpen] = useState(false);
  const [membership, setMembership] = useState({
    name: '', durationDeadline: '', cost: '', completeVisitsAmount: ''
  });


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setMembership({
        name: '', durationDeadline: '', cost: '', completeVisitsAmount: ''
    })
  };

  const handleSave = () => {
    props.addMembership(membership);
    handleClose();
  }

  const handleChange = (event) => {
    setMembership({...membership, [event.target.name]: event.target.value});
  }
  return (
    <div>
    <Button className="shine-button" variant="contained" onClick={handleClickOpen}>
      Добавить информацию
    </Button>
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle className='dialog'>Новый абонемент</DialogTitle>
      <DialogContent className='dialog'>
        <Stack spacing={2} mt={1}>
          <TextField label="Наименование" name="name" autoFocus
            variant="standard" value={membership.name} 
            onChange={handleChange}/>
           <TextField type='date' label="Дата окончания действия" name="durationDeadline"
            variant="standard" value={membership.durationDeadline} 
            onChange={handleChange}
            InputProps={{
                inputProps: {
                  inputMode: 'numeric',
                },
                startAdornment: (
                  <InputAdornment position="start"> </InputAdornment>
                ),
              }}/>
          <TextField label="Стоимость (бел.руб.)" name="cost" 
            variant="standard" value={membership.cost} 
            onChange={handleChange}/>
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

export default AddSportComplexMembership;