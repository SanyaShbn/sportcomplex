import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import './login.css';
import EmployeeTable from '../Employees/EmployeeTable.js';
import AdminMain from '../MainNavs/AdminMain.js';

function Login() {
  const [user, setUser] = useState({
    user_login: '', 
    user_password: ''
  });
  const [isAuthenticated, setAuth] = useState(false);
  const [open, setOpen] = useState(false);
  
  const handleChange = (event) => {
    setUser({...user, [event.target.name] : event.target.value});
  }
  
  const login = () => {
    fetch('login',{
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify(user)
    })
    .then(res => {
      const jwtToken = res.headers.get('Authorization');
      if (jwtToken !== null) {
        sessionStorage.setItem("jwt", jwtToken);
          console.log(user);
          setAuth(true);
      }
      else {
        setOpen(true);
      }
    })
    .catch(err => console.error(err))
  }

  if (isAuthenticated) {
    return <EmployeeTable />;
  }
  else {  
    return(
      <div className="login-page">
         <style>
              @import url('https://fonts.googleapis.com/css2?family=Pacifico&display=swap');
         </style>
         <h1 className='title'>BestSports</h1>
        <Stack display='inline-block' spacing={2} alignItems='center' className='input_background'>
          <TextField 
            name="user_login"
            label="Логин" 
            className="login_page_field"
            onChange={handleChange} />
            <br/>
          <TextField 
            type="password"
            name="user_password"
            label="Пароль"
            className="login_page_field"
            onChange={handleChange}/>
            <br/>
            <br/>
           <Button className="login-button" variant="contained" onClick={login}> Войти </Button>
           <br/>
           <a className='register-link' href=''> Впревые в системе? Зарегестрироваться</a>
        </Stack>
        <Snackbar 
          open={open}
          autoHideDuration={3000}
          onClose={() => setOpen(false)}
          message="Ошибка аутентификации: Неверный логин или пароль"
        />
      </div>
    );
  }
}

export default Login;