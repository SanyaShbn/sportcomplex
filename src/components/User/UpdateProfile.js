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

  const [open, setOpen] = useState(false);
  const [user, setUser] = useState({
    firstName: '', surName: '', patrSurName: '', phoneNumber: '', email: '',
    post: '', rights: '', userLogin: '', isUpdate: '',
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
    let userRights;
    switch(props.data.role) {
    case 'ADMIN': userRights = "Полные права в системе: работа со всеми модулями программы"; break;
    case 'MANAGER': userRights = "Доступные модули в режиме чтения: ,\nДоступные модули для редактирования данных:"; break;
    case 'COACH': userRights = "Доступные модули в режиме чтения: ,\nДоступные модули для редактирования данных:"; break;
    case 'MARKETER': userRights = "Доступные модули в режиме чтения: ,\nДоступные модули для редактирования данных:"; break;
    default:
        userRights = "Отсутствуют права для работы в системе";
    }
    setUser({
      firstName: props.data.firstName,
      surName: props.data.surName,
      patrSurName: props.data.patrSurName,
      post: props.data.post,
      phoneNumber: props.data.phoneNumber,
      userLogin: props.data.email,
      email: props.data.email,
      rights: userRights,
      isUpdate: "Просмотр",
     })      
    setOpen(true);
  }


  const handleClose = () => {
    setOpen(false)
    setIsUpdate(false)
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

  const handleChange = (event) => {
    setUser({...user, [event.target.name] : event.target.value});
  }

  const clearValues = () => {
    if (passwordRef.current) {
      passwordRef.current.value = '';
    }
    if (confirmPasswordRef.current) {
      confirmPasswordRef.current.value = '';
    }
  };

  const updateAdmin = () => {
    if(isValid){
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
          message: 'Ошибка редактирования учетной записи! Проверьте корректность ввода данных',
        },});
      }
      else {
        clearValues()
        handleClose()
        props.fetchUser()
        if(password !== '' || user.userLogin !== props.data.userLogin){
        dispatch({ type: 'START_LOADING' });
        sessionStorage.setItem("jwt", "");
        navigate("/", { replace: true })
        dispatch({ type: 'END_LOADING' });
        }
      }
    })
    .catch(err => console.error(err))
  }
  } else{
    dispatch({
      type: 'UPDATE_ALERT',
      payload: {
        open: true,
        severity: 'error',
        message: 'Ошибка редактирования учетной записи! Проверьте корректность ввода данных',
      },});
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
            onChange={handleChange}
        />
        <TextField margin="normal" variant="standard" label="Фамилия"
            InputLabelProps={{
              shrink: true,
            }} name="surName" type="text" fullWidth required value={user.surName}  disabled = {!isUpdate} 
            onChange={handleChange}
        />
        <TextField margin="normal" variant="standard" label="Отчество"
            InputLabelProps={{
              shrink: true,
            }} name="patrSurName" type="text" fullWidth required value={user.patrSurName}  disabled = {!isUpdate} 
            onChange={handleChange}
        />
        {!isUpdate && (
        <TextField margin="normal" variant="standard" label="Должность"
            InputLabelProps={{
              shrink: true,
            }} name="post" type="text" fullWidth required value={user.post}  disabled multiline
        />)}
        {!isUpdate && (
        <TextField margin="normal" variant="standard" label="Права в системе"
            InputLabelProps={{
              shrink: true,
            }} name="post" type="text" fullWidth required value={user.rights}  disabled multiline
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
            onChange={handleChange}
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
          autoFocus
          margin="normal"
          variant="standard"
          name="userPassword"
          label="Новый пароль"
          type={showPassword ? 'text' : 'password'}
          fullWidth
          inputRef={passwordRef}
          inputProps={{ minLength: 5 }}
          onChange={handleChange}
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