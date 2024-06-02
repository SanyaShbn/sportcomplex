import { Close, Send } from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  InputAdornment,
  Stack,
  Tooltip,
  RadioGroup, 
  FormControl, FormControlLabel, Radio
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'
import { useValue } from '../../context/ContextProvider';
import PasswordField from './PasswordField';
import { SERVER_URL } from '../../constants';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { IoIosSettings } from "react-icons/io"
import {
  usePhoneInput
} from 'react-international-phone';
import { PhoneNumberUtil } from 'google-libphonenumber';

function UpdateProfile(props){

  const {
    dispatch,
  } = useValue();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  let navigate = useNavigate();
  const [isValidPassword, setIsValidPassword] = useState(false);
  const [isEmailError, setIsEmailError] = useState(false);
  const [isNameError, setIsNameError] = useState(false);
  const [isSurNameError, setIsSurNameError] = useState(false);
  const [isPatrSurNameError, setIsPatrSurNameError] = useState(false);
  const handleEmailErrorChange = (event) => {
    const { value } = event.target;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsEmailError(!emailRegex.test(value));
    setUser({...user, [event.target.name] : event.target.value});
  };
  const handleNameErrorChange = (event) => {
    const { value } = event.target;
    const isInvalid = value.length < 2 || value[0] !== value[0].toUpperCase() || !/^[\u0400-\u04FF]+$/.test(value);
    setIsNameError(isInvalid);
    setUser({...user, [event.target.name] : event.target.value});
  };
  const handleSurNameErrorChange = (event) => {
    const { value } = event.target;
    const isInvalid = value.length < 2 || value[0] !== value[0].toUpperCase() || !/^[\u0400-\u04FF]+$/.test(value);
    setIsSurNameError(isInvalid);
    setUser({...user, [event.target.name] : event.target.value});
  };
  const handlePatrSurNameErrorChange = (event) => {
    const { value } = event.target;
    const isInvalid = value.length < 2 || value[0] !== value[0].toUpperCase() || !/^[\u0400-\u04FF]+$/.test(value);
    setIsPatrSurNameError(isInvalid);
    setUser({...user, [event.target.name] : event.target.value});
  };

  const handleIsValidPasswordChange = (event) => {
    const { value } = event.target;
    const isInvalid = value.length < 8;
    setIsValidPassword(isInvalid);
    setUser({...user, [event.target.name] : event.target.value});
  };

  const [open, setOpen] = useState(false);
  const [user, setUser] = useState({
    firstName: '', surName: '', patrSurName: '', phoneNumber: '', email: '',
    post: '', userLogin: '', isUpdate: '',
    userPassword: '',
  });

  const {
    inputValue,
    phone,
    handlePhoneValueChange,
  } = usePhoneInput({
    defaultCountry: 'by',
    forceDialCode: true,
    value: props.data.phoneNumber,
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
  const [isUpdate, setIsUpdate] = useState(false);

  const handleClickOpen = () => {
    setUser({
      firstName: props.data.firstName,
      surName: props.data.surName,
      patrSurName: props.data.patrSurName,
      post: props.data.post,
      phoneNumber: props.data.phoneNumber,
      userLogin: props.data.email,
      email: props.data.email,
      isUpdate: "Просмотр",
     })      
    setOpen(true);
  }


  const handleClose = () => {
    setOpen(false)
    setIsUpdate(false)
    setIsValidPassword(false)
    setIsEmailError(false)
    setIsNameError(false)
    setIsSurNameError(false)
    setIsPatrSurNameError(false)
  };

  const location = useLocation();

  useEffect(() => {
    window.history.pushState(null, document.title, window.location.href);
    window.addEventListener('popstate', function(event) {
      window.history.pushState(null, document.title, window.location.href);
    });
  }, [location]);
  
  const [showPassword, setShowPassword] = useState(false);

  const handleClick = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
  };

  const clearValues = () => {
    if (passwordRef.current) {
      passwordRef.current.value = '';
    }
    if (confirmPasswordRef.current) {
      confirmPasswordRef.current.value = '';
    }
  };

  const ClearLocalStorage = () => {
    const reportData = JSON.parse(localStorage.getItem('reportData'));
    if(reportData !== '' && typeof reportData !== 'undefined'){
    reportData.title !== '' && typeof reportData.title !== 'undefined' ? reportData.title = '' : 
    reportData.subject !== '' && typeof reportData.subject !== 'undefined' ? reportData.subject = '' : 
    reportData.textContent !== '' && typeof reportData.textContent !== 'undefined' ? reportData.textContent = '' : 
    reportData.option !== '' && typeof reportData.option !== 'undefined' ? reportData.option = '' : 
    localStorage.removeItem('reportData')
    localStorage.setItem('reportData', JSON.stringify(reportData))
    }
    localStorage.setItem('theme', '')
  }

  const updateAdmin = () => {
    if(user.firstName.length === 0 | user.surName.length === 0 | user.patrSurName.length === 0
      | user.email.length === 0){
      dispatch({
        type: 'UPDATE_ALERT',
        payload: {
          open: true,
          severity: 'error',
          message: 'Заполните обязательные поля',
        },});
    }
    else{
    if(!isValid | isEmailError | isNameError | isSurNameError | isPatrSurNameError){
      dispatch({
        type: 'UPDATE_ALERT',
        payload: {
          open: true,
          severity: 'error',
          message: 'Проверьте корректность ввода данных',
        },});
    }
    else{
    const token = sessionStorage.getItem("jwt");
    const password = passwordRef.current.value;
    const confirmPassword = confirmPasswordRef.current.value;
    if (password !== '' && password !== confirmPassword)
      return dispatch({
        type: 'UPDATE_ALERT',
        payload: {
          open: true,
          severity: 'error',
          message: 'Пароли не совпадают',
        },
      });
    else{
    user.phoneNumber = phone
    dispatch({ type: 'START_LOADING' });
    fetch(SERVER_URL + '/update_admin_profile', {
      method: 'POST',
      headers: { 'Content-Type':'application/json',
                 'Authorization' : token },
      body: JSON.stringify(user)
    })
    .then(response => {
      dispatch({ type: 'END_LOADING' });
      if (!response.ok) {
        dispatch({
        type: 'UPDATE_ALERT',
        payload: {
          open: true,
          severity: 'error',
          message: 'Ошибка! Не удалось обновить данные учетной записи. Возможно, введенное вами значение обновленного адреса '
          + 'электронной почты уже используется другими сотрудниками (или клиентами)',
        },});
      }
      else {
        clearValues()
        handleClose()
        props.fetchUser()
        if(password !== '' || user.userLogin !== props.data.userLogin){
          dispatch({ type: 'START_LOADING' });
          sessionStorage.setItem("jwt", "");
          ClearLocalStorage()
          navigate("/", { replace: true });
          dispatch({ type: 'END_LOADING' });
        }
        else{
          dispatch({
            type: 'UPDATE_ALERT',
            payload: {
              open: true,
              severity: 'success',
              message: 'Данные учетной записи успешно обновлены',
            },});
        }
      }
    })
    .catch(err => console.error(err))
    }  
   }
  }
}

  const handleChangeIsUpdate = (event) => {
    if(props.data.role === 'ADMIN'){
      if(!isUpdate){
      dispatch({
        type: 'UPDATE_ALERT',
        payload: {
          open: true,
          severity: 'warning',
          message: 'При изменении логина или установлении нового пароля текущая сессия работы в системе будет завершена.'
           + ' Вы будете перенаправлены на главную страницу для входа в аккаунт, используя измененные данные',
        },});
      }
    setUser({...user, isUpdate:event.target.value})
    setIsUpdate(event.target.value === 'Редактирование');
    }else{
        dispatch({
            type: 'UPDATE_ALERT',
            payload: {
              open: true,
              severity: 'error',
              message: 'Недостаточный уровень доступа! Вашу учетную запись может редактировать исключительно пользователь с полными правами.' +
               ' Обратитесь к администратору спортивно-оздоровительного комплекса',
            },});
    }
  };

  const handleUpdateClick = () => {
    updateAdmin();
  };

    return(
      <div>
     <Tooltip title="Настройки профиля" sx={{ mt: 1 }}>
      <IconButton onClick={handleClickOpen}>
        <IoIosSettings/>
      </IconButton>
    </Tooltip>
      <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        Профиль пользователя
        <IconButton
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            color: (theme) => theme.palette.grey[500],
          }}
          onClick={handleClose}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <form>
        <DialogContent dividers>
        <Stack spacing={2} mt={1}>
        <TextField margin="normal" variant="standard" label="Имя"
            InputLabelProps={{
              shrink: true,
            }} name="firstName" type="text" fullWidth required value={user.firstName}  disabled = {!isUpdate} 
            error={isNameError} onChange={handleNameErrorChange}
        />
        <TextField margin="normal" variant="standard" label="Фамилия"
            InputLabelProps={{
              shrink: true,
            }} name="surName" type="text" fullWidth required value={user.surName}  disabled = {!isUpdate} 
            error={isSurNameError} onChange={handleSurNameErrorChange}
        />
        <TextField margin="normal" variant="standard" label="Отчество"
            InputLabelProps={{
              shrink: true,
            }} name="patrSurName" type="text" fullWidth required value={user.patrSurName}  disabled = {!isUpdate} 
            error={isPatrSurNameError} onChange={handlePatrSurNameErrorChange}
        />
        {!isUpdate && (
        <TextField margin="normal" variant="standard" label="Должность"
            InputLabelProps={{
              shrink: true,
            }} name="post" type="text" fullWidth required value={user.post}  disabled multiline
        />)}
        {isUpdate && (
         <TextField
           error={!isValid}
           value={inputValue}
           onChange={handlePhoneValueChange}
           label="Номер телефона"
           variant="outlined"
          />)}
          <TextField
            error={isEmailError}
            margin="normal"
            variant="standard"
            label="Логин"
            InputLabelProps={{
              shrink: true,
            }}
            name="userLogin"
            type="email"
            fullWidth
            required
            value={user.userLogin}
            disabled = {!isUpdate} 
            onChange={handleEmailErrorChange}
          />

            <FormControl fullWidth>
            <RadioGroup
              row
              aria-labelledby="demo-radio-buttons-group-label"
              value={user.isUpdate}
              name="radio-buttons-group"
              onChange={handleChangeIsUpdate}
            >
            <FormControlLabel value="Просмотр" control={<Radio />} label="Просмотр" />
            <FormControlLabel value="Редактирование" control={<Radio />} label="Редактирование" />
            </RadioGroup>
            </FormControl>
       {isUpdate && (
          <TextField
          error={isValidPassword}
          autoFocus
          margin="normal"
          variant="standard"
          name="userPassword"
          label="Новый пароль"
          type={showPassword ? 'text' : 'password'}
          fullWidth
          inputRef={passwordRef}
          inputProps={{ minLength: 5 }}
          onChange={handleIsValidPasswordChange}
          InputProps={{
          endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={handleClick} onMouseDown={handleMouseDown}>
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />)}
    {isUpdate && (
            <PasswordField
              passwordRef={confirmPasswordRef}
              id="confirmPassword"
              label="Подтверждение пароля"
            />
    )}
        </Stack>
        </DialogContent>
        {isUpdate && (
           <DialogActions sx={{ px: '19px' }}>
           <Button variant="contained"
            endIcon={<Send />}
            color="primary" 
            onClick={handleUpdateClick}>
            Обновить
          </Button>
        </DialogActions>
        )}
      </form>
      <DialogActions sx={{ justifyContent: 'left', p: '5px 24px' }}>
        <Button onClick={handleClose}>
          Назад
        </Button>
      </DialogActions>
    </Dialog>
      </div>
    );
  }
export default UpdateProfile;