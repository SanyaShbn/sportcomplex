import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Select from '@mui/material/Select';
import { MenuItem, FormControl, InputLabel } from '@mui/material';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import InputAdornment from '@mui/material/InputAdornment';
import '../CSS/employeeCSS.css';
import '../CSS/table.css';

function AddFacility(props){
  const [open, setOpen] = useState(false);
  const [facility, setFacility] = useState({
    facilityType: '', trainingsAmount: 0, cleaningServiceTime: ''
  });


  // Open the modal form
  const handleClickOpen = () => {
    setOpen(true);
  };
    
  // Close the modal form 
  const handleClose = () => {
    setOpen(false);
    setFacility({
        facilityType: '', trainingsAmount: 0, cleaningServiceTime: ''
    })
  };

  // Save car and close modal form 
  const handleSave = () => {
    props.addFacility(facility);
    handleClose();
  }

  const handleChange = (event) => {
    setFacility({...facility, [event.target.name]: event.target.value});
  }
  return (
    <div>
    <Button className="shine-button" variant="contained" onClick={handleClickOpen}>
      Добавить информацию
    </Button>
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle className='dialog'>Новое сооружение</DialogTitle>
      <DialogContent className='dialog'>
        <Stack spacing={2} mt={1}>
        <FormControl fullWidth>
            <InputLabel>Тип сооружениия</InputLabel>
             <Select
              name="facilityType"
              value={facility.facilityType}
              autoFocus variant="standard"
              label="Тип сооружения"
              onChange={handleChange}>
              <MenuItem value={"Тренажёрный зал"}>Спортивный зал</MenuItem>
              <MenuItem value={"Бассейн"}>Бассейн</MenuItem>
              <MenuItem value={"Велотрек"}>Велотрек</MenuItem>
              <MenuItem value={"Открытый стадион"}>Открытый стадион</MenuItem>
            </Select>
        </FormControl>
            <TextField type='datetime-local' label="Время уборки и обслуживания" name="cleaningServiceTime" 
            variant="standard" value={facility.cleaningServiceTime} 
            onChange={handleChange} InputProps={{
              inputProps: {
                inputMode: 'numeric',
              },
              startAdornment: (
                <InputAdornment position="start"> </InputAdornment>
              ),
            }}/>
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

export default AddFacility;