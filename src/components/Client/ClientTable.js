
import React,  { useEffect, useState } from 'react';
import { SERVER_URL, StyledDataGrid } from '../../constants.js';
import {ruRU} from '@mui/x-data-grid';
import {GridToolbarContainer} from '@mui/x-data-grid';
import {GridToolbarExport} from '@mui/x-data-grid';
import {gridClasses } from '@mui/x-data-grid';
import {Snackbar, Box, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button} from '@mui/material';
import '../CSS/employeeCSS.css';
import '../CSS/table.css';
import EditClient from './EditClient';
import AddClient from './AddClient.js';
import { grey } from '@mui/material/colors';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { useValue } from '../../context/ContextProvider';
import { jwtDecode } from 'jwt-decode';

function CustomToolbar() {
  return (
    <GridToolbarContainer className={gridClasses.toolbarContainer}>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

const ClientTable = ({ setSelectedLink, link }) => {

  useEffect(() => {
    setSelectedLink(link);
  });

  const {
    dispatch,
  } = useValue();

    const [clients, setClients] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [rowIdToDelete, setRowIdToDelete] = useState([]);
    const [delOpen, setDelOpen] = useState(false);
    const [addOpen, setAddOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    

    useEffect(() => {
      fetchClients();
    }, []);
  
    const fetchClients = () => {
      const token = sessionStorage.getItem("jwt");
      fetch(SERVER_URL + '/api/clients', {
        headers: { 'Authorization' : token }
      })
      .then(response => response.json())
      .then(data => {
        const sortedClietns = data._embedded.clients.sort((a, b) => a._links.self.href.slice(a._links.self.href.lastIndexOf('/') + 1) 
        - b._links.self.href.slice(b._links.self.href.lastIndexOf('/') + 1) );
        setClients(sortedClietns)
    })
      .catch(err => console.error(err));    
    }
    const onDelClick = (id) => {
      if(jwtDecode(sessionStorage.getItem("jwt")).roles.toString() === 'COACH'){
        dispatch({
          type: 'UPDATE_ALERT',
          payload: {
          open: true,
          severity: 'error',
          message: 'Недостаточный уровень доступа. Сотрудник тренерского персонала не имеет прав на редактирование данных клиентов (исключительно просмотр)',
        },});
      }else{
      setDialogOpen(true)
      setRowIdToDelete(id)
      }
    }
    
    const handleConfirmDelete = (url) => {
      const token = sessionStorage.getItem("jwt");
    
      fetch(url, {
        method: 'DELETE',
        headers: { 'Authorization' : token }
      })
      .then(response => {
        if (response.ok) {
          fetchClients()
          setDelOpen(true)
        }
        else {
          alert('Что-то пошло не так!');
        }
        setDialogOpen(false)
      })
      .catch(err => console.error(err))
      setDialogOpen(false);
    };

    const addClient = (client) => {

      const token = sessionStorage.getItem("jwt");

      fetch(SERVER_URL + '/api/clients',
        { method: 'POST', headers: {
          'Content-Type':'application/json',
          'Authorization' : token
        },
        body: JSON.stringify(client)
      })
      .then(response => {
        if (response.ok) {
          fetchClients()
          setAddOpen(true)
        }
        else {
          dispatch({
            type: 'UPDATE_ALERT',
            payload: {
              open: true,
              severity: 'error',
              message: 'Ошибка! Новую запись о клиенте не удалось создать. Возможно, введенные вами значения адреса электронной '
              + 'почты или номера телефона уже используются другими клиентами (или сотрудниками)',
            },});
        }
      })
      .catch(err => console.error(err))
    }

    const updateClient = (client, link) => {

      const token = sessionStorage.getItem("jwt");

      fetch(link,
        { 
          method: 'PUT', 
          headers: {
          'Content-Type':  'application/json',
          'Authorization' : token
        },
        body: JSON.stringify(client)
      })
      .then(response => {
        if (response.ok) {
          fetchClients()
          setEditOpen(true)
        }
        else {
          dispatch({
            type: 'UPDATE_ALERT',
            payload: {
              open: true,
              severity: 'error',
              message: 'Ошибка! Не удалось обновить данные о клиенте. Возможно, введенные вами значения адреса электронной '
              + 'почты или номера телефона уже используются другими клиентами (или сотрудниками)',
            },});
        }
      })
      .catch(err => console.error(err))
    }
     
    const columns = [
      {field: 'firstName', headerName: 'Имя', width: 200},
      {field: 'surName', headerName: 'Фамилия', width: 200},
      {field: 'patrSurName', headerName: 'Отчество', width: 200},
      {field: 'birthDate', headerName: 'Дата рождения', width: 200},
      {field: 'phoneNumber', headerName: 'Номер телефона', width: 250},
      {field: 'email', headerName: 'Email', width: 250},
      {
        field: '_links.client.href', 
        headerName: '', 
        sortable: false,
        filterable: false,
        width: 60,
        renderCell: row => <EditClient 
                              data={row} 
                              updateClient={updateClient} />
      },
      {
        field: '_links.self.href', 
        headerName: '', 
        width: 60,
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
        <DialogTitle id="alert-dialog-title">{"ВЫ уверены, что хотите удалить запись о клиенте?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Запись о клиенте будет безвозвратно удалена
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="primary">
            Отменить
          </Button>
          <Button onClick={() => handleConfirmDelete(rowIdToDelete)} color="primary" autoFocus>
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
      </div>
      },
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
      Клиенты
    </Typography>
    <main className='info_pages_body'>
    <React.Fragment>
    <AddClient addClient={addClient} />
      <div className="container" style={{ height: 400, width: "100%"}}>
        <StyledDataGrid  localeText={ruRU.components.MuiDataGrid.defaultProps.localeText} className="grid_component" 
          columns={columns} 
          rows={clients} 
          disableSelectionOnClick={true}
          getRowId={row => row._links.self.href}
          {...clients}
          initialState={{
            ...clients.initialState,
            pagination: { paginationModel: { pageSize: 5 } },
          }}
          pageSizeOptions={[5, 10, 25]}
          components={{ Toolbar: CustomToolbar }}
          sx={{
            [`& .${gridClasses.row}`]: {
              bgcolor: (theme) =>
                theme.palette.mode === 'light' ? grey[200] : grey[900],
            },
          }}
        />
        <Snackbar
          open={delOpen}
          autoHideDuration={2000}
          onClose={() => setDelOpen(false)}
          message="Запись о клиенте удалена"
        />
        <Snackbar
          open={addOpen}
          autoHideDuration={2000}
          onClose={() => setAddOpen(false)}
          message="Запись о новом клиенте успешно добавлена"
        />
        <Snackbar
          open={editOpen}
          autoHideDuration={2000}
          onClose={() => setEditOpen(false)}
          message="Информация о клиенте успешно обновлена"
        />
      </div>
    </React.Fragment>
    </main>
    </Box>
  );
}

export default ClientTable;