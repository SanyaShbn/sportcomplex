
import React,  { useEffect, useState } from 'react';
import { SERVER_URL, StyledDataGrid } from '../../constants.js';
import {ruRU, gridClasses} from '@mui/x-data-grid';
import {GridToolbarContainer} from '@mui/x-data-grid';
import {GridToolbarExport} from '@mui/x-data-grid';
import {Snackbar, Box, Typography} from '@mui/material';
import '../CSS/employeeCSS.css';
import '../CSS/table.css';
import AddEmployee from './AddEmployee';
import { grey } from '@mui/material/colors';
import EditEmployee from './EditEmployee';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

function CustomToolbar() {
  return (
    <GridToolbarContainer className={gridClasses.toolbarContainer}>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

const EmployeeTable = ({ setSelectedLink, link }) => {

  useEffect(() => {
    setSelectedLink(link);
  }, []);

    const [employees, setEmployees] = useState([]);
    const [open, setOpen] = useState(false);
  
    useEffect(() => {
      fetchEmployees();
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
    const onDelClick = (url) => {
      if (window.confirm("ВЫ уверены, что хотите удалить запись о сотруднике обслуживающего персонала?")) {

        // const token = sessionStorage.getItem("jwt");

        fetch(url, {
          method: 'DELETE',
          // headers: { 'Authorization' : token }
          })
        .then(response => {
          if (response.ok) {
            fetchEmployees();
            setOpen(true);
          }
          else {
            alert('Что-то пошло не так!');
          }
        })
        .catch(err => console.error(err))
      }
    }
    const addEmployee = (employee) => {

      // const token = sessionStorage.getItem("jwt");

      fetch(SERVER_URL + '/api/serviceEmployees',
        { method: 'POST', headers: {
          'Content-Type':'application/json',
          // 'Authorization' : token
        },
        body: JSON.stringify(employee)
      })
      .then(response => {
        if (response.ok) {
          fetchEmployees();
        }
        else {
          alert('Что-то пошло не так!');
        }
      })
      .catch(err => console.error(err))
    }
  

    const updateEmployee = (employee, link) => {

      // const token = sessionStorage.getItem("jwt");

      fetch(link,
        { 
          method: 'PUT', 
          headers: {
          'Content-Type':  'application/json',
          // 'Authorization' : token
        },
        body: JSON.stringify(employee)
      })
      .then(response => {
        if (response.ok) {
          fetchEmployees();
        }
        else {
          alert('Что-то пошло не так!');
        }
      })
      .catch(err => console.error(err))
    }
    
    const columns = [
      {field: 'firstName', headerName: 'Имя', width: 100},
      {field: 'surName', headerName: 'Фамилия', width: 150},
      {field: 'patrSurName', headerName: 'Отчество', width: 150},
      {field: 'phoneNumber', headerName: 'Номер телефона', width: 200},
      {field: 'birthDate', headerName: 'Дата рождения', width: 170},
      {field: 'salary', headerName: 'Оклад(бел.руб.)', width: 200},
      {field: 'additionalSalary', headerName: 'Премиальные(бел.руб.)', width: 200},
      {
        field: '_links.employee.href', 
        headerName: '', 
        sortable: false,
        filterable: false,
        width: 100,
        renderCell: row => <EditEmployee 
                              data={row} 
                              updateEmployee={updateEmployee} />
      },
      {
        field: '_links.self.href', 
        headerName: '', 
        width:120,
        sortable: false,
        filterable: false,
        renderCell: row => 
        <IconButton onClick={() => onDelClick
          (row.id)}>
          <DeleteIcon color="error" />
        </IconButton>
      }
    ];
    
  return (
    <Box
    sx={{
      height: 400,
      width: '100%',
    }}
  >
    <Typography
      variant="h4"
      component="h4"
      sx={{ textAlign: 'center', mt: 3, mb: 3 }}
    >
      Сотрудники спортивно-оздоровительного комплекса
    </Typography>
    <main className='info_pages_body'>
    <React.Fragment>
      <AddEmployee addEmployee={addEmployee} />
      <div className="container" style={{ height: 400, width: "100%"}}>
        <StyledDataGrid localeText={ruRU.components.MuiDataGrid.defaultProps.localeText} className="grid_component" 
          columns={columns} 
          rows={employees} 
          disableSelectionOnClick={true}
          getRowId={row => row._links.self.href}
          {...employees}
          initialState={{
            ...employees.initialState,
            pagination: { paginationModel: { pageSize: 5 } },
          }}
          pageSizeOptions={[5, 10, 25]}
          components={{ Toolbar: CustomToolbar }}
          sx={{
            [`& .${gridClasses.row}`]: {
              bgcolor: (theme) =>
                theme.palette.mode === 'light' ? grey[200] : grey[900],
            },
          }}/>
        <Snackbar
          open={open}
          autoHideDuration={2000}
          onClose={() => setOpen(false)}
          message="Запись о сотруднике удалена"
        />
      </div>
    </React.Fragment>
    </main>
    </Box>
  );
}

export default EmployeeTable;