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
import { SERVER_URL } from '../../constants';
import { useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const Login = () => {
  const {
    state: { openLogin },
    dispatch,
  } = useValue();
  const emailRef = useRef();
  const passwordRef = useRef();
  let navigate = useNavigate();

  const handleClose = () => {
    dispatch({ type: 'CLOSE_LOGIN' });
  };

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
        Аутентификация
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
        
        </DialogContent>
        <DialogActions sx={{ px: '19px' }}>
           <Button variant="contained"
            endIcon={<Send />}
            color="primary" 
            onClick={handleLoginClick}>
            Войти
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
}

export default Login;