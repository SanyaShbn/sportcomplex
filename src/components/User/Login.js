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
import { useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const Login = () => {
  const {
    state: { openLogin },
    dispatch,
  } = useValue();
  const [title, setTitle] = useState('Login');
  const [isRegister, setIsRegister] = useState(false);
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  let navigate = useNavigate();

  const handleClose = () => {
    dispatch({ type: 'CLOSE_LOGIN' });
  };

  useEffect(() => {
    isRegister ? setTitle('Регистрация') : setTitle('Аутентификация');
  }, [isRegister]);

  const location = useLocation();

  useEffect(() => {
    window.history.pushState(null, document.title, window.location.href);
    window.addEventListener('popstate', function(event) {
      window.history.pushState(null, document.title, window.location.href);
    });
  }, [location]);

  const [user, setUser] = useState({
    userLogin: '', 
    userPassword: ''
  });
  const [isAuthenticated, setAuth] = useState(false);
  
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
  };
  
  const login = () => {
    dispatch({ type: 'START_LOADING' });
    fetch(SERVER_URL + '/login', {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify(user)
    })
    .then(res => {
      dispatch({ type: 'END_LOADING' });
      const jwtToken = res.headers.get('Authorization');
      if (jwtToken !== null) {
        sessionStorage.setItem("jwt", jwtToken);
        setAuth(true);
      }
      else {
        // setOpen(true);
        dispatch({
          type: 'UPDATE_ALERT',
          payload: {
            open: true,
            severity: 'error',
            message: 'Неверный логин или пароль',
          },});
        dispatch({ type: 'OPEN_LOGIN' });
      }
    })
    .catch(err => console.error(err))
  }

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
      }
    })
    .catch(err => console.error(err))
  }
  }

  const handleRegisterClick = () => {
    register();
  };

  const handleLoginClick = () => {
    login();
  };

  if (isAuthenticated) {
    return navigate("dashboard/main");
  }
  else {  
    return(
      <div>
      <Dialog open={openLogin} onClose={handleClose}>
      <DialogTitle>
        {title}
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
            name="userLogin"
            label="Email"
            type="email"
            fullWidth
            inputRef={emailRef}
            required
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
          {isRegister && (
            <PasswordField
              passwordRef={confirmPasswordRef}
              id="confirmPassword"
              label="Подтверждение пароля"
            />
          )}
        </DialogContent>
        {!isRegister && (
        <DialogActions sx={{ px: '19px' }}>
           <Button variant="contained"
            endIcon={<Send />}
            color="primary" 
            onClick={handleLoginClick}>
            Войти
          </Button>
        </DialogActions>
        )}
        {isRegister && (
           <DialogActions sx={{ px: '19px' }}>
           <Button variant="contained"
            endIcon={<Send />}
            color="primary" 
            onClick={handleRegisterClick}>
            Зарегистрировать
          </Button>
        </DialogActions>
        )}
      </form>
      <DialogActions sx={{ justifyContent: 'left', p: '5px 24px' }}>
        {isRegister
          ? 'Вы зарегестрированы в системе? Войти '
          : "Впервые используете систему? Создайте аккаунт "}
        <Button onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? 'Назад' : 'Регистрация'}
        </Button>
      </DialogActions>
      {/* <DialogActions sx={{ justifyContent: 'center', py: '24px' }}>
        <GoogleOneTapLogin />
      </DialogActions> */}
    </Dialog>
        {/* <Stack spacing={2} alignItems='center' mt={2}>
          <TextField 
            name="userLogin"
            label="Username" 
            onChange={handleChange} />
          <TextField 
            type="password"
            name="userPassword"
            label="Password"
            onChange={handleChange}/>
          <Button 
            variant="outlined" 
            color="primary" 
            onClick={login}>
              Login
          </Button>
        </Stack>
        <Snackbar 
          open={open}
          autoHideDuration={3000}
          onClose={() => setOpen(false)}
          message="Login failed: Check your username and password"
        /> */}
      </div>
    );
  }
}

export default Login;