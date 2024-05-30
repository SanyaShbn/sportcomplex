
import React,  { useEffect, useState } from 'react';
import axios from 'axios';
import { SERVER_URL, StyledDataGrid } from '../../../constants.js';
import {ruRU} from '@mui/x-data-grid';
import {GridToolbarContainer} from '@mui/x-data-grid';
import {GridToolbarExport} from '@mui/x-data-grid';
import {gridClasses } from '@mui/x-data-grid';
import {Snackbar, Box, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button} from '@mui/material';
import '../../CSS/employeeCSS.css';
import '../../CSS/table.css';
import AddClientMembership from './AddClientMembership.js';
import EditClientMembership from './EditClientMembership.js';
import { grey } from '@mui/material/colors';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { useValue } from '../../../context/ContextProvider.js';
import { jwtDecode } from 'jwt-decode';

function CustomToolbar() {
  return (
    <GridToolbarContainer className={gridClasses.toolbarContainer}>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

const ClientMembershipTable = ({ setSelectedButtonLink, link }) => {

  useEffect(() => {
    setSelectedButtonLink(link);
  });


    const [client_memberships, setClientMemberships] = useState([]);
    const [delOpen, setDelOpen] = useState(false);
    const [addOpen, setAddOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [rows, setRows] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [rowIdToDelete, setRowIdToDelete] = useState([]);
    const {
      dispatch,
    } = useValue();
  
    useEffect(() => {
      fetchClientMemberships();
    }, []);
  
    const fetchClientMemberships = () => {
      const token = sessionStorage.getItem("jwt");
      fetch(SERVER_URL + '/api/clientMemberships', {
        headers: { 'Authorization' : token }
      })
      .then(response => response.json())
      .then(data => {
        const sortedClientMemberships = data._embedded.clientMemberships.sort((a, b) => a._links.self.href.slice(a._links.self.href.lastIndexOf('/') + 1) 
        - b._links.self.href.slice(b._links.self.href.lastIndexOf('/') + 1) );
        setClientMemberships(sortedClientMemberships)
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
          message: 'Недостаточный уровень доступа. Сотрудник тренерского персонала не имеет прав на редактирование информации о продажах абонементов (исключительно просмотр)',
        },});
      }
      else{
      setDialogOpen(true)
      setRowIdToDelete(id)
      }
    }

    const handleConfirmDelete = (id) => {

        const token = sessionStorage.getItem("jwt");

        fetch(SERVER_URL + '/api/deleteClientMemberships?id=' + id.slice(id.lastIndexOf("/") + 1), {
          method: 'DELETE',
          headers: { 'Authorization' : token }
          })
        .then(response => {
          if (response.ok) {
            fetchClientMemberships();
            setDelOpen(true);
          }
          else {
            alert('Что-то пошло не так!');
          }
          setDialogOpen(false)
        })
        .catch(err => console.error(err))
   }

    const addClientMembership = (membershipId, clientId) => {

      const token = sessionStorage.getItem("jwt");

      fetch(SERVER_URL + '/api/save_client_membership?membershipId=' + membershipId + "&clientId=" + clientId,
        { method: 'POST', headers: {
          'Content-Type':'application/json',
          'Authorization' : token
        },
      })
      .then(response => {
        if (response.ok) {
          fetchClientMemberships();
          setAddOpen(true)
        }
        else {
          dispatch({
            type: 'UPDATE_ALERT',
            payload: {
              open: true,
              severity: 'error',
              message: 'Не удалось добавить новую запись. Проверьте корректность ввода данных',
            },});
        }
      })
      .catch(err => console.error(err))
    }
  

    const updateClientMembership = (link, membershipId, clientId) => {

      const token = sessionStorage.getItem("jwt");

      fetch(link + '?membershipId=' + membershipId + "&clientId=" + clientId ,
        { 
          method: 'PUT', 
          headers: {
          'Content-Type':  'application/json',
          'Authorization' : token
        },
      })
      .then(response => {
        if (response.ok) {
          fetchClientMemberships();
          setEditOpen(true)
        }
        else {
          dispatch({
            type: 'UPDATE_ALERT',
            payload: {
              open: true,
              severity: 'error',
              message: 'Не удалось сохранить изменения. Проверьте корректность ввода данных',
            },});
        }
      })
      .catch(err => console.error(err))
    }
     
    const fetchMemberships = async (url) => {
      const token = sessionStorage.getItem("jwt");
      try {
        const config = {
          headers: {
            'Authorization' : token
          }
        };
          const response = await axios.get(url, config);
          let id = response.data._links.self.href
          return "Абонемент №" + id.slice(id.lastIndexOf("/") + 1) + ": " + response.data.name;
        } catch (error) {
          return 'N/A';
        }
    };

    const fetchClients = async (url) => {
      const token = sessionStorage.getItem("jwt");
      try {
        const config = {
          headers: {
            'Authorization' : token
          }
        };
          const response = await axios.get(url, config);
          let id = response.data._links.self.href
          return "Клиент №" + id.slice(id.lastIndexOf("/") + 1) + ": " + response.data.surName + " " + response.data.firstName + " " + response.data.patrSurName + 
          " (" + response.data.phoneNumber + ")";
        } catch (error) {
          return 'N/A';
        }
      };


    const columns = [
      {field: 'sportComplexMembership', headerName: 'Наименование приобретаемого абонемента', width: 400},
      {field: 'client', headerName: 'Клиент, приобретающий абонемент', width: 530},
      {field: 'soldAt', headerName: 'Дата и время продажи', width: 220},
      {field: 'revenue', headerName: 'Выручка (бел.руб.)', width: 150},
      {
        field: '_links.client_membership.href', 
        headerName: '', 
        sortable: false,
        filterable: false,
        width: 50,
        renderCell: row => <EditClientMembership
                              data={row} 
                              updateClientMembership={updateClientMembership} />
      },
      {
        field: '_links.self.href', 
        headerName: '', 
        width:50,
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
        <DialogTitle id="alert-dialog-title">{"ВЫ уверены, что хотите удалить запись о продаже абонемента?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Запись о продаже абонемента будет безвозвратно удалена
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
      }
    ];
    
    useEffect(() => {
      const updateRows = async () => {
        const updatedRows = await Promise.all(client_memberships.map(async client_membership => ({
          id: client_membership._links.clientMembership.href,
          soldAt: client_membership.soldAt,
          revenue: client_membership.revenue,
          client: await fetchClients(client_membership._links.client.href),
          sportComplexMembership: await fetchMemberships(client_membership._links.sportComplexMembership.href),
        })));
        setRows(updatedRows);
      };
  
      updateRows();
    }, [client_memberships]);


  return (
    <Box
    sx={{
      height: 400,
      width: '100%',
    }}
  >
    <Typography
      variant="h5"
      component="h5"
      sx={{ textAlign: 'center', mt: 3, mb: 3 }}
    >
      Продажа абонементов
    </Typography>
      <main className='info_pages_body'>
    <React.Fragment>
      <AddClientMembership addClientMembership={addClientMembership} />
      <div className="container" style={{ height: 400, width: "100%"}}>
        <StyledDataGrid localeText={ruRU.components.MuiDataGrid.defaultProps.localeText} className="grid_component" 
          columns={columns} 
          rows={rows} 
          disableSelectionOnClick={true}
          getRowId={row => row.id}
          {...rows}
          initialState={{
            ...rows.initialState,
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
          message="Запись о продаже абонемента удалена"
        />
        <Snackbar
          open={addOpen}
          autoHideDuration={2000}
          onClose={() => setAddOpen(false)}
          message="Запись о новой продаже абонемента успешно добавлена"
        />
        <Snackbar
          open={editOpen}
          autoHideDuration={2000}
          onClose={() => setEditOpen(false)}
          message="Информация о продаже абонемента успешно обновлена"
        />
      </div>
    </React.Fragment>
    </main>
    </Box>
  );
}

export default ClientMembershipTable;