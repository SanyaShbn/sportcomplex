
import React,  { useEffect, useState } from 'react';
import { SERVER_URL, StyledDataGrid } from '../../constants.js';
import {ruRU} from '@mui/x-data-grid';
import {GridToolbarContainer} from '@mui/x-data-grid';
import {GridToolbarExport} from '@mui/x-data-grid';
import {gridClasses } from '@mui/x-data-grid';
import {Snackbar, Box, Typography} from '@mui/material';
import '../CSS/employeeCSS.css';
import '../CSS/table.css';
import EditClient from './EditClient';
import { grey } from '@mui/material/colors';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

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
  }, []);

    const [clients, setClients] = useState([]);
    const [open, setOpen] = useState(false);
    

    useEffect(() => {
      fetchClients();
    }, []);
  
    const fetchClients = () => {
      // const token = sessionStorage.getItem("jwt");
      fetch(SERVER_URL + '/api/clients', {
        // headers: { 'Authorization' : token }
      })
      .then(response => response.json())
      .then(data => setClients(data._embedded.clients))
      .catch(err => console.error(err));    
    }
    const onDelClick = (url) => {
      if (window.confirm("ВЫ уверены, что хотите удалить запись о клиенте?")) {

        // const token = sessionStorage.getItem("jwt");

        fetch(url, {
          method: 'DELETE',
          // headers: { 'Authorization' : token }
          })
        .then(response => {
          if (response.ok) {
            fetchClients();
            setOpen(true);
          }
          else {
            alert('Что-то пошло не так!');
          }
        })
        .catch(err => console.error(err))
      }
    }

    const updateClient = (client, link) => {

      // const token = sessionStorage.getItem("jwt");

      fetch(link,
        { 
          method: 'PUT', 
          headers: {
          'Content-Type':  'application/json',
          // 'Authorization' : token
        },
        body: JSON.stringify(client)
      })
      .then(response => {
        if (response.ok) {
          fetchClients();
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
      {field: 'email', headerName: 'Email', width: 250},
      {
        field: '_links.employee.href', 
        headerName: '', 
        sortable: false,
        filterable: false,
        width: 100,
        renderCell: row => <EditClient 
                              data={row} 
                              updateClient={updateClient} />
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

export default ClientTable;