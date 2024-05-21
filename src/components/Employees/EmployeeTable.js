
import React,  { useEffect, useState } from 'react';
import { SERVER_URL, StyledDataGrid } from '../../constants.js';
import {ruRU, gridClasses} from '@mui/x-data-grid';
import {GridToolbarContainer} from '@mui/x-data-grid';
import {GridToolbarExport} from '@mui/x-data-grid';
import {Snackbar, Box, Typography,  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button} from '@mui/material';
import '../CSS/employeeCSS.css';
import '../CSS/table.css';
import AddEmployee from './AddEmployee';
import { grey } from '@mui/material/colors';
import EditEmployee from './EditEmployee';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Registration from "../User/Registration.js";
import { useValue } from '../../context/ContextProvider';

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

  const {
    dispatch,
  } = useValue();

    const [users, setUsers] = useState([]);
    const [delOpen, setDelOpen] = useState(false);
    const [addOpen, setAddOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [rowIdToDelete, setRowIdToDelete] = useState([]);

    useEffect(() => {
      fetchUsers();
    }, []);
  
    const fetchUsers = () => {
      // const token = sessionStorage.getItem("jwt");
      fetch(SERVER_URL + '/api/users', {
        // headers: { 'Authorization' : token }
      })
      .then(response => response.json())
      .then(data => {
        const nonAdminUsers = data._embedded.users.filter(user => user.role !== "ADMIN");
        const sortedNonAdminUsers = nonAdminUsers.sort((a, b) => a._links.self.href.slice(a._links.self.href.lastIndexOf('/') + 1) 
        - b._links.self.href.slice(b._links.self.href.lastIndexOf('/') + 1) );
        setUsers(sortedNonAdminUsers);
      }
      )
      .catch(err => console.error(err));    
    }

    const onDelClick = (id) => {
      setDialogOpen(true);
      setRowIdToDelete(id)
    }

    const handleConfirmDelete  = (url) => {

        // const token = sessionStorage.getItem("jwt");

        fetch(url, {
          method: 'DELETE',
          // headers: { 'Authorization' : token }
          })
        .then(response => {
          if (response.ok) {
            fetchUsers();
            setDelOpen(true);
            setDialogOpen(false)
          }
          else {
            alert('Что-то пошло не так!');
          }
        })
        .catch(err => console.error(err))
}


    const handleConfirmDeleteCoachOrCleaner = (id, role) => {
        // const token = sessionStorage.getItem("jwt");

        fetch(SERVER_URL + '/api/delete_coach_or_cleaner?employee_id=' + id.slice(id.lastIndexOf('/') + 1), {
          method: 'DELETE',
          // headers: { 'Authorization' : token }
          })
        .then(response => {
          if (response.ok) {
            fetchUsers();
            setDelOpen(true);
            role === 'COACH' ?
            dispatch({
              type: 'UPDATE_ALERT',
              payload: {
                open: true,
                severity: 'info',
                message: 'Необходимо назначить новых сотрудников тренерского персонала для занятий, которые планировалось' + 
                ' проводить под руководством сотрудника, запись о котором была вами удалена (если таковые занятия имеются)',
              },}) : 
              dispatch({
                type: 'UPDATE_ALERT',
                payload: {
                  open: true,
                  severity: 'info',
                  message: 'Необходимо назначить новых сотрудников обслуживающего персонала для тех сооружений комплекса, уборку которых' + 
                  ' должен был проводить сотрудник, запись о котором была вами удалена (если таковые сооружения имеются)',
                },})
            setDialogOpen(false)
          }
          else {
            alert('Что-то пошло не так!');
          }
        })
        .catch(err => console.error(err))
  }

    const addEmployee = (user) => {

      // const token = sessionStorage.getItem("jwt");

      fetch(SERVER_URL + '/api/users',
        { method: 'POST', headers: {
          'Content-Type':'application/json',
          // 'Authorization' : token
        },
        body: JSON.stringify(user)
      })
      .then(response => {
        if (response.ok) {
          fetchUsers();
          setAddOpen(true)
        }
        else {
          dispatch({
            type: 'UPDATE_ALERT',
            payload: {
              open: true,
              severity: 'error',
              message: 'Ошибка! Новую запись о сотруднике не удалось создать. Возможно, введенные вами значения адреса электронной '
              + 'почты или номера телефона уже используются другими сотрудниками (или клиентами)',
            },});
        }
      })
      .catch(err => console.error(err))
    }
  

    const updateEmployee = (user, link) => {
      let url
      user.role === 'MANAGER' ? url = link : 
      url = SERVER_URL + '/api/update_coach_or_cleaner?employee_id=' + link.slice(link.lastIndexOf('/') + 1)
      // const token = sessionStorage.getItem("jwt");

      fetch(url,
        { 
          method: 'PUT', 
          headers: {
          'Content-Type':  'application/json',
          // 'Authorization' : token
        },
        body: JSON.stringify(user)
      })
      .then(response => {
        if (response.ok) {
          fetchUsers();
          setEditOpen(true)
        }
        else {
          dispatch({
            type: 'UPDATE_ALERT',
            payload: {
              open: true,
              severity: 'error',
              message: 'Ошибка! Не удалось обновить данные о сотруднике. Возможно, введенные вами значения адреса электронной '
              + 'почты или номера телефона уже используются другими сотрудниками (или клиентами)',
            },});
        }
      })
      .catch(err => console.error(err))
    }
    
    const columns = [
      {field: 'firstName', headerName: 'Имя', width: 100},
      {field: 'surName', headerName: 'Фамилия', width: 150},
      {field: 'patrSurName', headerName: 'Отчество', width: 150},
      {field: 'email', headerName: 'Email', width: 200},
      {field: 'phoneNumber', headerName: 'Номер телефона', width: 180},
      {field: 'birthDate', headerName: 'Дата рождения', width: 140},
      {field: 'post', headerName: 'Должность', width: 270},
      {
        field: '_links.employee.href', 
        headerName: '', 
        sortable: false,
        filterable: false,
        width: 50,
        renderCell: row => <EditEmployee 
                              data={row} 
                              updateEmployee={updateEmployee} />
      },
      {
        field: '_links.self.href', 
        headerName: '', 
        width: 50,
        sortable: false,
        filterable: false,
        renderCell: row => 
        <div>
        <IconButton onClick={() => onDelClick(row.id)}>
          <DeleteIcon color="error" />
        </IconButton>
        <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{
          '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.2)', 
          },
        }}
      >
        <DialogTitle id="alert-dialog-title">{"ВЫ уверены, что хотите удалить запись о сотруднике?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Запись о сотруднике будет безвозвратно удалена
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="primary">
            Отменить
          </Button>
          <Button onClick={() => { row.row.role === "MANAGER"  ? handleConfirmDelete(rowIdToDelete):
            handleConfirmDeleteCoachOrCleaner(rowIdToDelete, row.row.role)}} color="primary" autoFocus>
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
      </div>
      },
      {
        field: 'account', 
        headerName: 'Учётная запись', 
        width:150,
        sortable: false,
        filterable: false,
        renderCell: row =>
        row.row.role !== "CLEANER" ? <Registration data={row} /> : null
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
          rows={users} 
          disableSelectionOnClick={true}
          getRowId={row => row._links.self.href}
          {...users}
          initialState={{
            ...users.initialState,
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
          open={delOpen}
          autoHideDuration={2000}
          onClose={() => setDelOpen(false)}
          message="Запись о сотруднике удалена"
        />
        <Snackbar
          open={addOpen}
          autoHideDuration={2000}
          onClose={() => setAddOpen(false)}
          message="Запись о новом сотруднике успешно добавлена"
        />
        <Snackbar
          open={editOpen}
          autoHideDuration={2000}
          onClose={() => setEditOpen(false)}
          message="Информация о сотруднике успешно обновлена"
        />
      </div>
    </React.Fragment>
    </main>
    </Box>
  );
}

export default EmployeeTable;