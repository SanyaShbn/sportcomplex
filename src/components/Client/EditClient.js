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
import { MenuItem, FormControl, InputLabel } from '@mui/material';
import Select from '@mui/material/Select';
import { useValue } from '../../context/ContextProvider';
import {
  usePhoneInput
} from 'react-international-phone';
import { PhoneNumberUtil } from 'google-libphonenumber';
import { jwtDecode } from 'jwt-decode';

function EditClient(props) {
  const [open, setOpen] = useState(false);
  const [isEmailError, setIsEmailError] = useState(false);
  const [isNameError, setIsNameError] = useState(false);
  const [isSurNameError, setIsSurNameError] = useState(false);
  const [isPatrSurNameError, setIsPatrSurNameError] = useState(false);
  const [isBirthDateError, setIsBirthDateError] = useState(false);
  const [client, setClient] = useState({
    firstName: '', surName: '', patrSurName: '', birthDate:'', phoneNumber: '', email: ''
  });
  const {
    dispatch,
  } = useValue();
  const handleEmailErrorChange = (event) => {
    const { value } = event.target;
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z]+\.[A-Za-z]{2,}$/;
    const cyrillicPattern = /[А-Яа-яЁё]/; 
    const isCyrillic = cyrillicPattern.test(value);
    setIsEmailError(!emailRegex.test(value) || isCyrillic);
    setClient({...client, [event.target.name]: value});
  };
  const handleNameErrorChange = (event) => {
    const { value } = event.target;
    const isInvalid = value.length < 2 || value[0] !== value[0].toUpperCase() || !/^[\u0400-\u04FF]+$/.test(value);
    setIsNameError(isInvalid);
    setClient({...client, [event.target.name]: event.target.value});
  };
  const handleSurNameErrorChange = (event) => {
    const { value } = event.target;
    const isInvalid = value.length < 2 || value[0] !== value[0].toUpperCase() || !/^[\u0400-\u04FF]+$/.test(value);
    setIsSurNameError(isInvalid);
    setClient({...client, [event.target.name]: event.target.value});
  };
  const handlePatrSurNameErrorChange = (event) => {
    const { value } = event.target;
    const isInvalid = value.length < 2 || value[0] !== value[0].toUpperCase() || !/^[\u0400-\u04FF]+$/.test(value);
    setIsPatrSurNameError(isInvalid);
    setClient({...client, [event.target.name]: event.target.value});
  };
  const handleBirthDateErrorChange = (event) => {
    const { value } = event.target;
    const birthDate = new Date(value);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    const isInvalid = age < 18;

    setIsBirthDateError(isInvalid);
    setClient({...client, [event.target.name]: event.target.value});
  };
  const {
    inputValue,
    phone,
    handlePhoneValueChange,
  } = usePhoneInput({
    defaultCountry: 'by',
    forceDialCode: true,
    value: props.data.row.phoneNumber,
  });

  const phoneUtil = PhoneNumberUtil.getInstance();

  const isPhoneValid = (phone) => {
    try {
      return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
    } catch (error) {
      return false;
    }
  };
  const isValid = isPhoneValid(phone);
    
  const handleClickOpen = () => {
    if(jwtDecode(sessionStorage.getItem("jwt")).roles.toString() === 'COACH'){
      dispatch({
        type: 'UPDATE_ALERT',
        payload: {
        open: true,
        severity: 'error',
        message: 'Недостаточный уровень доступа. Сотрудник тренерского персонала не имеет прав на редактирование данных клиентов (исключительно просмотр)',
      },});
    }
  else{
    setClient({
      firstName: props.data.row.firstName,
      surName: props.data.row.surName,
      patrSurName: props.data.row.patrSurName,
      email: props.data.row.email,
      phoneNumber: props.data.row.phoneNumber,
      birthDate: props.data.row.birthDate
     })      
    setOpen(true);
  }
  }

  const handleClose = () => {
    setOpen(false);
    setIsEmailError(false)
    setIsNameError(false)
    setIsSurNameError(false)
    setIsPatrSurNameError(false)
    setIsBirthDateError(false)
  };

  const handleSave = () => {
    if(client.firstName.length === 0 | client.surName.length === 0 | client.patrSurName.length === 0
      | client.email.length === 0 | client.birthDate.length === 0){
      dispatch({
        type: 'UPDATE_ALERT',
        payload: {
          open: true,
          severity: 'error',
          message: 'Заполните обязательные поля',
        },});
    }
    else{
    if(!isValid | isEmailError | isNameError | isSurNameError | isPatrSurNameError | isBirthDateError){
      dispatch({
        type: 'UPDATE_ALERT',
        payload: {
          open: true,
          severity: 'error',
          message: 'Проверьте корректность ввода данных',
        },});
    }
    else{
    client.phoneNumber = phone
    props.updateClient(client, props.data.id);
    handleClose();
    }
  }
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
          <TextField error={isNameError} label="Имя" name="firstName" autoFocus
            variant="standard" value={client.firstName} required
            onChange={handleNameErrorChange}/>
           <TextField error={isSurNameError} label="Фамилия" name="surName"
            variant="standard" value={client.surName} required
            onChange={handleSurNameErrorChange}/>
          <TextField error={isPatrSurNameError} label="Отчество" name="patrSurName" 
            variant="standard" value={client.patrSurName} required
            onChange={handlePatrSurNameErrorChange}/>
          <TextField error={isBirthDateError} type='date' label="Дата рождения" name="birthDate" 
            variant="standard" value={client.birthDate} required helperText="В системе могут быть зарегестрированы только совершеннолетние клиенты"
            onChange={handleBirthDateErrorChange} InputProps={{
              inputProps: {
                inputMode: 'numeric',
              },
              startAdornment: (
                <InputAdornment position="start"> </InputAdornment>
              ),
          }}/>
          <TextField
           error={!isValid}
           value={inputValue}
           required
           onChange={handlePhoneValueChange}
           label="Номер телефона"
           variant="outlined"
          />
          <TextField error = {isEmailError} label="Email" name="email" type="email"
            variant="standard" value={client.email} required
            onChange={handleEmailErrorChange}/>
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