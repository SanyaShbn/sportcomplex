import { React, useEffect } from 'react';
import { useLocation } from 'react-router-dom'
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material';
import { Lock, Menu } from '@mui/icons-material';
import { useValue } from '../context/ContextProvider'
import UserIcons from './User/UserIcons'

const NavBar = () => {
  const {
    state: { currentUser },
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
          <Box sx={{ mr: 1 }}>
            <IconButton size="large" color="inherit">
              <Menu />
            </IconButton>
          </Box>
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
            YRW
          </Typography>
          {!currentUser ? (
            <Button
              color="inherit"
              startIcon={<Lock />}
              onClick={() => dispatch({ type: 'OPEN_LOGIN' })}
            >
            Войти
            </Button>
          ) : (
            <UserIcons />
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default NavBar;