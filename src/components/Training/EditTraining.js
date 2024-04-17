import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import { SERVER_URL } from '../../constants.js';
import { FormControl, RadioGroup, FormControlLabel, Radio, InputLabel, MenuItem, FormLabel } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';

function EditTraining(props) {

  const [complexFacilityId, setComplexFacilityId] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [open, setOpen] = useState(false);
  const [training, setTraining] = useState({
    name: '', type: '', capacity: '',  cost: '', complexFacility: '', clients_amount: ''
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
    let id = props.data.row.complexFacility.slice(props.data.row.complexFacility.lastIndexOf("№") + 1)
    setComplexFacilityId(parseInt(id))
    setTraining({
      name: props.data.row.name,
      type: props.data.row.type,
      capacity: props.data.row.capacity,
      cost: props.data.row.cost,
      clients_amount: props.data.row.clients_amount,
      complexFacility: parseInt(id),
     })      
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  };
  
  const handleChange = (event) => {
    setTraining({...training, 
      [event.target.name]: event.target.value});
  }

  const handleChangeComplexFacility = (event) => {
    setComplexFacilityId(event.target.value)
    setTraining({...training, 
      [event.target.name]: event.target.value});
  }
 
  const handleSave = () => {
    if(training.type === 'персональное'){
      training.capacity = 1
    }
    props.updateTraining(training, props.data.id, complexFacilityId);
    handleClose();
  }

  const handleChangeType = (event) => {
    setTraining({...training, type:event.target.value})
    setIsGroup(event.target.value === 'групповое');
  };

  return(
    <div>
      <IconButton onClick={handleClickOpen}>
        <EditIcon color="primary" />
      </IconButton>
      <Dialog open={open} onClose={handleClose}>
          <DialogTitle className='dialog'>Обновление информации о тренировке</DialogTitle>
          <DialogContent className='dialog'>
        <Stack spacing={2} mt={1}>
        <TextField label="Наименование" name="name"
            variant="standard" value={training.name} 
            onChange={handleChange}/>
            <FormControl fullWidth>
            <FormLabel id="demo-radio-buttons-group-label">Тип занятия</FormLabel>
            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              value={training.type}
              name="radio-buttons-group"
              onChange={handleChangeType}
            >
            <FormControlLabel value="групповое" control={<Radio />} label="Групповое" />
            <FormControlLabel value="персональное" control={<Radio />} label="Персональное" />
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
             value={training.complexFacility}
             onChange={handleChangeComplexFacility}>
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
         <Button onClick={handleSave}>Сохранить</Button>
      </DialogActions>
        </Dialog>            
    </div>
  );  
}

export default EditTraining;