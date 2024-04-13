import React, { useState, useEffect } from 'react';
import '../CSS/employeeCSS.css';
import '../CSS/table.css';
import { SERVER_URL } from '../../constants.js';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

function AddEmployeeFacility(props){
  const [open, setOpen] = useState(false);
  const [employee_facility, setEmployeeFacility] = useState({
    serviceEmployee: '', complexFacility: ''
  });

  const [selectedServiceEmployee, setSelectedServiceEmployee] = useState({
    idServiceEmployee: '', firstName: '', surName: '', patrSurName: '',  
    phoneNumber: '', birthDate:'', salary:'', additionalSalary:''
  });
  const [selectedComplexFacility, setSelectedComplexFacility] = useState({
    idComplexFacility: '', facilityType: '', trainingsAmount: '', cleaningServiceTime: ''
  });
  const [employees, setEmployees] = useState([]);
  const [facilities, setFacilities] = useState([]);

  
  useEffect(() => {
    fetchEmployees();
    fetchFacilities();
  }, []);

  const fetchEmployees = () => {
    // const token = sessionStorage.getItem("jwt");
    fetch(SERVER_URL + '/api/serviceEmployees', {
      // headers: { 'Authorization' : token }
    })
    .then(response => response.json())
    .then(data => setEmployees(data._embedded.serviceEmployees))
    .catch(err => console.error(err));    
  }
  const fetchFacilities = () => {
      // const token = sessionStorage.getItem("jwt");
      fetch(SERVER_URL + '/api/complexFacilities', {
        // headers: { 'Authorization' : token }
      })
      .then(response => response.json())
      .then(data => setFacilities(data._embedded.complexFacilities))
      .catch(err => console.error(err));    
    }
  // Open the modal forma
  const handleClickOpen = () => {
    setOpen(true);
  };
    
  // Close the modal form 
  const handleClose = () => {
    setOpen(false);
    setEmployeeFacility({
        serviceEmployee: '', complexFacility: ''
    })
  };

  // Save car and close modal form 
  const handleSave = () => {
    props.addEmployeeFacility(employee_facility);
    handleClose();
  }

  const handleChange = (event) => {
    setEmployeeFacility({...employee_facility, [event.target.name]: event.target.value});
  }
  return (
    <div>
    <Button className="shine-button" variant="contained" onClick={handleClickOpen}>
      Добавить информацию
    </Button>
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle className='dialog'>Новый сотрудник</DialogTitle>
      <DialogContent className='dialog'>
      <Stack spacing={2} mt={1}>
      <select value={employee_facility.serviceEmployee} onChange={handleChange}>
        {employees.map(employee => (
          <option key={employee.idServiceEmployee} value={employee.surName}>{employee.surName}</option>
        ))}
      </select>
      <select value={employee_facility.complexFacility} onChange={handleChange}>
        {facilities.map(facility => (
          <option key={facility.idComplexFacility} value={facility.facilityType}>{facility.facilityType}</option>
        ))}
      </select>
      </Stack>
      </DialogContent>
      <DialogActions>
         <Button onClick={handleClose}>Отмена</Button>
         <Button onClick={handleSave}>Сохранить связь</Button>
      </DialogActions>
    </Dialog>   
    </div>
  );
}
export default  AddEmployeeFacility;