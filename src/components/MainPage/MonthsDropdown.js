import React from 'react';

const MonthsDropdown = ({ onChange }) => {
  const options = [3, 6, 9, 12]; // Available month options

  return (
    <select onChange={onChange}>
      {options.map((months) => (
        <option key={months} value={months}>
          Последние {months} месяцев
        </option>
      ))}
    </select>
  );
};

export default MonthsDropdown;
