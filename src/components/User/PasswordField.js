import { Visibility, VisibilityOff } from '@mui/icons-material';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import React, { useState } from 'react';

const PasswordField = ({
  passwordRef,
  id = 'userPassword',
  label = 'Пароль',
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClick = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
  };

  return (
    <TextField
      autoFocus
      margin="normal"
      variant="standard"
      id={id}
      label={label}
      name='userPassword'
      type={showPassword ? 'text' : 'password'}
      fullWidth
      inputRef={passwordRef}
      inputProps={{ minLength: 5 }}
      required
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
  );
};

export default PasswordField;