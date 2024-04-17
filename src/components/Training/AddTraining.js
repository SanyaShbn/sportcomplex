import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Select from '@mui/material/Select';
import { FormControl, RadioGroup, FormControlLabel, Radio, InputLabel, MenuItem, FormLabel } from '@mui/material';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { SERVER_URL } from '../../constants.js';
import '../CSS/employeeCSS.css';
import '../CSS/table.css';


function AddTraining(props){

  const [complexFacilityId, setComplexFacilityId] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [open, setOpen] = useState(false);
  const [training, setTraining] = useState({
    name: '', type: 'групповое', capacity: '',  cost: '', clients_amount: 0
  });
  const [isGroup, setIsGroup] = useState(true);

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
      name: '', type: '', capacity: '',  cost: ''
    })
  };

  const handleSave = () => {
    if(training.type === 'персональное'){
      training.capacity = 1
    }
    props.addTraining(training, complexFacilityId);
    handleClose();
  }

  const handleChange = (event) => {
    setTraining({...training, [event.target.name]: event.target.value});
  }

  const handleChangeType = (event) => {
    setTraining({...training, type:event.target.value})
    setIsGroup(event.target.value === 'групповое');
  };

  return (
    <div>
    <Button className="shine-button" variant="contained" onClick={handleClickOpen}>
      Добавить информацию
    </Button>
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle className='dialog'>Новая тренировка</DialogTitle>
      <DialogContent className='dialog'>
        <Stack spacing={2} mt={1}>
          <TextField label="Наименование" name="name"
            variant="standard" value={training.name} 
            onChange={handleChange}/>
            <FormControl>
            <FormLabel id="demo-radio-buttons-group-label">Тип занятия</FormLabel>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              name="radio-buttons-group"
              value={training.type}
              onChange={handleChangeType}
            >
            <FormControlLabel value="групповое" control={<Radio color="primary" />} label="Групповое" />
            <FormControlLabel value="персональное" control={<Radio color="primary" />} label="Персональное" />
            </RadioGroup>
            </FormControl>
            {isGroup && (<TextField label="Емкость (количество человек)" name="capacity"
            variant="standard" value={training.capacity} 
            onChange={handleChange}/>
            )}
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