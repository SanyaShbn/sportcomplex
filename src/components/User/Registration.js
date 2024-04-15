import { Close, Send } from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  TextField,
  InputAdornment
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom'
import { useValue } from '../../context/ContextProvider';
import PasswordField from './PasswordField';
import { SERVER_URL } from '../../constants';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import {Switch} from '@mui/material';

const Registration = (props) => {

  const {
    dispatch,
  } = useValue();
  const [isRegister, setIsRegister] = useState(false);
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();

  const [open, setOpen] = useState(false);
  const [user, setUser] = useState({
    userLogin: '', 
    userPassword: '',
    status: ''
  });
  let initial_check
  if(props.data && props.data.row && props.data.row.status === "active"){
    initial_check = true;
  }
  else{
    initial_check = false;
  }
  const [state, setState] = useState({
    checked: initial_check,
  });

  // const handleSwitchClick = () => {
  //   if(user.status === "disabled"){
  //     handleClickOpen()
  //   }
  //   else if(user.status === "active"){
  //     props.data.row.status = "blocked"
  //     fetch(SERVER_URL + "/api/users" + props.data.row.userId,
  //       { 
  //         method: 'PUT', 
  //         headers: {
  //         'Content-Type':  'application/json',
  //         // 'Authorization' : token
  //       },
  //       body: JSON.stringify(props.data.row)
  //     })
  //     .then(response => {
  //       if (response.ok) {
  //         dispatch({
  //           type: 'UPDATE_ALERT',
  //           payload: {
  //             open: true,
  //             severity: 'info',
  //             message: 'Учётная запись сотрудника заблокирована',
  //           },});
  //         setState({ ...state, checked: false });
  //       }
  //       else {
  //         alert('Что-то пошло не так!');
  //       }
  //     })
  //     .catch(err => console.error(err))
  //   }
  //   else if(user.status === "blocked"){
  //     props.data.row.status = "active"
  //     fetch(SERVER_URL + "/api/users" + props.data.row.userId,
  //       { 
  //         method: 'PUT', 
  //         headers: {
  //         'Content-Type':  'application/json',
  //         // 'Authorization' : token
  //       },
  //       body: JSON.stringify(props.data.row)
  //     })
  //     .then(response => {
  //       if (response.ok) {
  //         dispatch({
  //           type: 'UPDATE_ALERT',
  //           payload: {
  //             open: true,
  //             severity: 'info',
  //             message: 'Учётная запись сотрудника разблокирована',
  //           },});
  //         setState({ ...state, checked: false });
  //       }
  //       else {
  //         alert('Что-то пошло не так!');
  //       }
  //     })
  //     .catch(err => console.error(err))
  //   }
  // }

  const handleClickOpen = () => {
    setUser({
      userLogin: props.data.row.email,
     })      
    setOpen(true);
  }

  const handleSwitch = () => {
    if(user.status === "active"){
    setState({ ...state, checked: true });
    }
    else{
      setState({ ...state, checked: !state.checked });
      }
  }

  const handleClose = () => {
    setOpen(false)
  };

  const handleCloseAndSwitchOff = () => {
    handleClose()
    handleSwitch()
  }

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
    if (nameRef.current) {
      nameRef.current.value = '';
    }
    if (emailRef.current) {
      emailRef.current.value = '';
    }
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
          setIsRegister(false)
          clearValues()
          handleClose()
      }
    })
    .catch(err => console.error(err))
  }
  }

  const handleRegisterClick = () => {
    register();
  };

    return(
      <div>
      <Switch  
        checked={state.checked}
        onChange={handleSwitch}
        onClick={handleClickOpen}
        inputProps={{ 'aria-label': 'controlled' }}
        />
      <Dialog open={open} onClose={handleCloseAndSwitchOff}>
      <DialogTitle>
        Регистрация
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
          <DialogContentText>
            Пожалуйста, заполните следующие поля:
          </DialogContentText>
          <TextField
            autoFocus={!isRegister}
            margin="normal"
            variant="standard"
            label="Логин"
            InputLabelProps={{
              shrink: true,
            }}
            name="userLogin"
            type="email"
            fullWidth
            inputRef={emailRef}
            required
            value={user.userLogin}
            disabled
            onChange={handleChange}
          />
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
    />
            <PasswordField
              passwordRef={confirmPasswordRef}
              id="confirmPassword"
              label="Подтверждение пароля"
            />
        </DialogContent>
           <DialogActions sx={{ px: '19px' }}>
           <Button variant="contained"
            endIcon={<Send />}
            color="primary" 
            onClick={handleRegisterClick}>
            Зарегистрировать
          </Button>
        </DialogActions>
      </form>
      <DialogActions sx={{ justifyContent: 'left', p: '5px 24px' }}>
        <Button onClick={handleCloseAndSwitchOff}>
          Назад
        </Button>
      </DialogActions>
    </Dialog>
      </div>
    );
  }
export default Registration;