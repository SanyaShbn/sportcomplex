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
  FormControl, FormControlLabel, Radio, InputLabel, MenuItem, FormLabel
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom'
import { useValue } from '../../context/ContextProvider';
import PasswordField from './PasswordField';
import { SERVER_URL } from '../../constants';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { IoIosSettings } from "react-icons/io"

function UpdateProfile(props){

  const {
    dispatch,
  } = useValue();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();

  const [open, setOpen] = useState(false);
  const [user, setUser] = useState({
    firstName: '', surName: '', patrSurName: '',
    post: '', rights: '', userLogin: '', isUpdate: '',
  });

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
      userLogin: props.data.email,
      rights: userRights,
      isUpdate: "Просмотр",
     })      
    setOpen(true);
  }


  const handleClose = () => {
    setOpen(false)
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

  const register = () => {
    const password = passwordRef.current.value;
    const confirmPassword = confirmPasswordRef.current.value;
    if (password !== confirmPassword)
      return dispatch({
        type: 'UPDATE_ALERT',
        payload: {
          open: true,
          severity: 'error',
          message: 'Пароли не совпадают',
        },
      });
    else{
    dispatch({ type: 'START_LOADING' });
    fetch(SERVER_URL + '/register', {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
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
          message: 'Логин или пароль уже испольуются в системе',
        },});
      }
      else {
        dispatch({
          type: 'UPDATE_ALERT',
          payload: {
            open: true,
            severity: 'success',
            message: 'Новая учётная запись успешно создана',
          },});
          clearValues()
          handleClose()
          props.data.row.status = "active"
      }
    })
    .catch(err => console.error(err))
  }
  }

  const handleChangeIsUpdate = (event) => {
    if(props.data.role === 'ADMIN'){
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

  const handleRegisterClick = () => {
    register();
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
        {!isUpdate && (
        <TextField margin="normal" variant="standard" label="Имя"
            InputLabelProps={{
              shrink: true,
            }} name="firstName" type="text" fullWidth required value={user.firstName}  disabled
        />)}
        {!isUpdate && (
        <TextField margin="normal" variant="standard" label="Фамилия"
            InputLabelProps={{
              shrink: true,
            }} name="surName" type="text" fullWidth required value={user.surName}  disabled
        /> )}
        {!isUpdate && (
        <TextField margin="normal" variant="standard" label="Отчество"
            InputLabelProps={{
              shrink: true,
            }} name="patrSurName" type="text" fullWidth required value={user.patrSurName}  disabled
        />)}
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
        {!isUpdate && (
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
            disabled
          />)}

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
          label="Пароль"
          type={showPassword ? 'text' : 'password'}
          fullWidth
          inputRef={passwordRef}
          inputProps={{ minLength: 5 }}
          required
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
           <DialogActions sx={{ px: '19px' }}>
           <Button variant="contained"
            endIcon={<Send />}
            color="primary" 
            onClick={handleRegisterClick}>
            Обновить
          </Button>
        </DialogActions>
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