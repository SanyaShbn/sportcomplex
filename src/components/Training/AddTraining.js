import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Select from '@mui/material/Select';
import { FormControl, InputLabel, MenuItem } from '@mui/material';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import InputAdornment from '@mui/material/InputAdornment';
import { SERVER_URL } from '../../constants.js';
import '../CSS/employeeCSS.css';
import '../CSS/table.css';


function AddTraining(props){

  const [complexFacilityId, setComplexFacilityId] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [open, setOpen] = useState(false);
  const [training, setTraining] = useState({
    trainingDateTime: '', cost: ''
  });

  useEffect(() => {
    fetchFacilities();
  }, []);

  const fetchFacilities = () => {
      // const token = sessionStorage.getItem("jwt");
      fetch(SERVER_URL + '/api/view_facilities', {
        // headers: { 'Authorization' : token }
      })
      .then(response => response.json())
      .then(data => setFacilities(data))
      .catch(err => console.error(err));    
    }

  const handleClickOpen = () => {
    setOpen(true);
  };
    
  const handleClose = () => {
    setOpen(false);
    setTraining({
        trainingDateTime: '', cost: ''
    })
  };

  const handleSave = () => {
    props.addTraining(training, complexFacilityId);
    handleClose();
  }

  const handleChange = (event) => {
    setTraining({...training, [event.target.name]: event.target.value});
  }
  return (
    <div>
    <Button className="shine-button" variant="contained" onClick={handleClickOpen}>
      Добавить информацию
    </Button>
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle className='dialog'>Новая тренировка</DialogTitle>
      <DialogContent className='dialog'>
        <Stack spacing={2} mt={1}>
        <TextField type='datetime-local' label="Время проведения" name="trainingDateTime" 
            variant="standard" value={training.trainingDateTime} 
            onChange={handleChange} InputProps={{
              inputProps: {
                inputMode: 'numeric',
              },
              startAdornment: (
                <InputAdornment position="start"> </InputAdornment>
              ),
            }}/>
           <TextField label="Стоимость (бел.руб.)" name="cost"
            variant="standard" value={training.cost} 
            onChange={handleChange}/>
            <FormControl fullWidth>
            <InputLabel>Место проведения</InputLabel>
             <Select
             name='complexFacility'
             autoFocus variant="standard"
             label="Место проведения"
             onChange={(event) => { setComplexFacilityId(event.target.value) }}>
             {facilities.map(facility => (
               <MenuItem key={facility.idComplexFacility}
                value={facility.idComplexFacility}>{facility.facilityType + " №" + facility.idComplexFacility}</MenuItem>
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

export default AddTraining;