
import React,  { useEffect, useState } from 'react';
import axios from 'axios';
import { SERVER_URL, StyledDataGrid } from '../../../constants.js';
import {ruRU} from '@mui/x-data-grid';
import {GridToolbarContainer} from '@mui/x-data-grid';
import {GridToolbarExport} from '@mui/x-data-grid';
import {gridClasses } from '@mui/x-data-grid';
import {Snackbar, Box, Typography} from '@mui/material';
import '../../CSS/employeeCSS.css';
import '../../CSS/table.css';
import AddClientMembership from './AddClientMembership.js';
import EditClientMembership from './EditClientMembership.js';
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

const ClientMembershipTable = ({ setSelectedButtonLink, link }) => {

  useEffect(() => {
    setSelectedButtonLink(link);
  }, []);


    const [client_memberships, setClientMemberships] = useState([]);
    const [open, setOpen] = useState(false);
    const [rows, setRows] = useState([]);
  
    useEffect(() => {
      fetchClientMemberships();
    }, []);
  
    const fetchClientMemberships = () => {
      // const token = sessionStorage.getItem("jwt");
      fetch(SERVER_URL + '/api/clientMemberships', {
        // headers: { 'Authorization' : token }
      })
      .then(response => response.json())
      .then(data => setClientMemberships(data._embedded.clientMemberships))
      .catch(err => console.error(err));    
    }
    const onDelClick = (id) => {
      if (window.confirm("ВЫ уверены, что хотите удалить запись о продаже абонемента?")) {

        // const token = sessionStorage.getItem("jwt");

        fetch(SERVER_URL + '/api/deleteClientMemberships?id=' + id.slice(id.lastIndexOf("/") + 1), {
          method: 'DELETE',
          // headers: { 'Authorization' : token }
          })
        .then(response => {
          if (response.ok) {
            fetchClientMemberships();
            setOpen(true);
          }
          else {
            alert('Что-то пошло не так!');
          }
        })
        .catch(err => console.error(err))

      }
    }
    const addClientMembership = (membershipId, clientId) => {

      // const token = sessionStorage.getItem("jwt");

      fetch(SERVER_URL + '/api/save_client_membership?membershipId=' + membershipId + "&clientId=" + clientId,
        { method: 'POST', headers: {
          'Content-Type':'application/json',
          // 'Authorization' : token
        },
      })
      .then(response => {
        if (response.ok) {
          fetchClientMemberships();
        }
        else {
          alert('Что-то пошло не так!');
        }
      })
      .catch(err => console.error(err))
    }
  

    const updateClientMembership = (link, membershipId, clientId) => {

      // const token = sessionStorage.getItem("jwt");

      fetch(link + '?membershipId=' + membershipId + "&clientId=" + clientId ,
        { 
          method: 'PUT', 
          headers: {
          'Content-Type':  'application/json',
          // 'Authorization' : token
        },
      })
      .then(response => {
        if (response.ok) {
          fetchClientMemberships();
        }
        else {
          alert('Что-то пошло не так!');
        }
      })
      .catch(err => console.error(err))
    }
     
    const fetchMemberships = async (url) => {
      // const token = sessionStorage.getItem("jwt");
      try {
        const config = {
          headers: {
            // 'Authorization' : token
          }
        };
          const response = await axios.get(url, config);
          let id = response.data._links.self.href
          return "Абонемент №" + id.slice(id.lastIndexOf("/") + 1) + ": " + response.data.name;
        } catch (error) {
          console.error('Error fetching memberships:', error);
          return 'N/A';
        }
    };

    const fetchClients = async (url) => {
      // const token = sessionStorage.getItem("jwt");
      try {
        const config = {
          headers: {
            // 'Authorization' : token
          }
        };
          const response = await axios.get(url, config);
          let id = response.data._links.self.href
          return "Клиент №" + id.slice(id.lastIndexOf("/") + 1) + ": " + response.data.surName + " " + response.data.firstName + " " + response.data.patrSurName + 
          " (" + response.data.phoneNumber + ")";
        } catch (error) {
          console.error('Error fetching clients:', error);
          return 'N/A';
        }
      };


    const columns = [
      {field: 'sportComplexMembership', headerName: 'Наименование приобретаемого абонемента', width: 600},
      {field: 'client', headerName: 'Клиент, приобретающий абонемент', width: 580},
      {
        field: '_links.client_membership.href', 
        headerName: '', 
        sortable: false,
        filterable: false,
        width: 100,
        renderCell: row => <EditClientMembership
                              data={row} 
                              updateClientMembership={updateClientMembership} />
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
    
    useEffect(() => {
      const updateRows = async () => {
        const updatedRows = await Promise.all(client_memberships.map(async client_membership => ({
          id: client_membership._links.clientMembership.href,
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
          open={open}
          autoHideDuration={2000}
          onClose={() => setOpen(false)}
          message="Запись о продаже абонемента удалена"
        />
      </div>
    </React.Fragment>
    </main>
    </Box>
  );
}

export default ClientMembershipTable;