import React from 'react';
import { MenuItem, FormControl, InputLabel, Select } from '@mui/material';

const MonthsDropdown = ({ onChange }) => {
  const options = [3, 6, 9, 12]; 

  return (
    <FormControl fullWidth>
            <InputLabel>Период времени</InputLabel>
             <Select
              name="facilityType"
              autoFocus variant="standard"
              label="Период времени"
              onChange={onChange}
              defaultValue={3}>
              {options.map(months=> (
               <MenuItem key={months}
                value={months}>{months === 3 ? ("Последние " + months + " месяца"):("Последние " + months + " месяцев")}</MenuItem>
             ))}
            </Select>
      </FormControl>
  );
};

export default MonthsDropdown;
