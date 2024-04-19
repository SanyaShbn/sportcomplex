import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import { MenuItem, FormControl, InputLabel } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';

function EditFacility(props) {
  const [open, setOpen] = useState(false);
  const [facility, setFacilities] = useState({
    facilityType: '', trainingsAmount: '', cleaningServiceTime: ''
  });

  const handleClickOpen = () => {
    setFacilities({
      facilityType: props.data.row.facilityType,
      trainingsAmount: props.data.row.trainingsAmount,
      cleaningServiceTime: props.data.row.cleaningServiceTime,
     })      
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  };
  
  const handleChange = (event) => {
    setFacilities({...facility, 
      [event.target.name]: event.target.value});
  }

  const handleSave = () => {
    props.updateFacility(facility, props.data.id);
    handleClose();
  }

  return(
    <div>
      <IconButton onClick={handleClickOpen}>
        <EditIcon color="primary" />
      </IconButton>
      <Dialog open={open} onClose={handleClose}>
          <DialogTitle className='dialog'>Обновление информации о сооружении</DialogTitle>
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
              <MenuItem value={"Спортивный зал"}>Спортивный зал</MenuItem>
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
            <Button onClick={handleSave}>Сохранить</Button>
          </DialogActions>
        </Dialog>            
    </div>
  );  
}

export default EditFacility;