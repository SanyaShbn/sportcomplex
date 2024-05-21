import { React, useEffect } from 'react';
import { useLocation } from 'react-router-dom'
import {
  AppBar,
  Button,
  Container,
  Toolbar,
  Typography,
} from '@mui/material';
import { Lock } from '@mui/icons-material';
import { useValue } from '../context/ContextProvider'

const NavBar = () => {
  const {
    dispatch,
  } = useValue();

  const location = useLocation();

  useEffect(() => {
    window.history.pushState(null, document.title, window.location.href);
    window.addEventListener('popstate', function(event) {
      window.history.pushState(null, document.title, window.location.href);
    });
  }, [location]);

  return (
    <AppBar>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            component="h1"
            noWrap
            sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}
          >
            Добро пожаловать
          </Typography>
          <Typography
            variant="h6"
            component="h1"
            noWrap
            sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}
          >
            Добро пожаловать
          </Typography>
            <Button
              color="inherit"
              startIcon={<Lock />}
              onClick={() => dispatch({ type: 'OPEN_LOGIN' })}
            >
            Войти
            </Button>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default NavBar;