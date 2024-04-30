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
import { NumberInput } from '../../constants';
import { useValue } from '../../context/ContextProvider';

function EditFacility(props) {
  const [open, setOpen] = useState(false);
  const [capacityInputValue, setValue] = React.useState(null);
  const [facility, setFacility] = useState({
    name: '', trainingsAmount: 0, capacity: ''
  });
  const {
    dispatch,
  } = useValue();
  const handleClickOpen = () => {
    dispatch({
      type: 'UPDATE_ALERT',
      payload: {
        open: true,
        severity: 'warning',
        message: 'Внимание! При изменении информации о данном сооружении все тренировочные занятия, которые планировалось проводить в данном сооружении, автоматически отменяются',
      },});
    setFacility({
      name: props.data.row.name,
      trainingsAmount: props.data.row.trainingsAmount,
      capacity: props.data.row.capacity,
     })      
    setValue(props.data.row.capacity)
    setOpen(true);
  }

  const handleClose = () => {
    setOpen(false);
  };
  
  const handleChange = (event) => {
    setFacility({...facility, 
      [event.target.name]: event.target.value});
  }

  const handleSave = () => {
    if(capacityInputValue < 1 | capacityInputValue > 50){
      dispatch({
        type: 'UPDATE_ALERT',
        payload: {
          open: true,
          severity: 'error',
          message: 'Проверьте корректность ввода данных! Вместимость какого-либо из сооружений не может принимать значение менее 1, ' 
          + "либо более 50",
        },});
    }
    else{
    facility.capacity = capacityInputValue
    props.updateFacility(facility, props.data.id);
    handleClose();
    }
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
          <TextField label="Наименование" name="name" autoFocus
            variant="standard" value={facility.name} 
            onChange={handleChange}/>
             <NumberInput
              label="Вместимость (чел.)"
              placeholder="Вместимость (чел.)"
              variant="standard" value={capacityInputValue} 
              onChange={(event, val) => setValue(val)}/>
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