
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
import AddClientTraining from './AddClientTraining.js';
import EditClientTraining from './EditClientTraining.js';
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

const ClientTrainingTable =({ setSelectedButtonLink, link }) => {

  useEffect(() => {
    setSelectedButtonLink(link);
  }, []);


    const [client_trainings, setClientTrainings] = useState([]);
    const [open, setOpen] = useState(false);
    const [rows, setRows] = useState([]);
  
    useEffect(() => {
      fetchClientTrainings();
    }, []);
  
    const fetchClientTrainings = () => {
      // const token = sessionStorage.getItem("jwt");
      fetch(SERVER_URL + '/api/clientTrainings', {
        // headers: { 'Authorization' : token }
      })
      .then(response => response.json())
      .then(data => setClientTrainings(data._embedded.clientTrainings))
      .catch(err => console.error(err));    
    }
    const onDelClick = (id) => {
      if (window.confirm("ВЫ уверены, что хотите удалить запись о согласованном занятии?")) {

        // const token = sessionStorage.getItem("jwt");

        fetch(SERVER_URL + '/api/deleteClientTrainings?id=' + id.slice(id.lastIndexOf("/") + 1), {
          method: 'DELETE',
          // headers: { 'Authorization' : token }
          })
        .then(response => {
          if (response.ok) {
            fetchClientTrainings();
            setOpen(true);
          }
          else {
            alert('Что-то пошло не так!');
          }
        })
        .catch(err => console.error(err))

      }
    }
    const addClientTraining = (trainingId, clientId) => {

      // const token = sessionStorage.getItem("jwt");

      fetch(SERVER_URL + '/api/save_client_training?trainingId=' + trainingId + "&clientId=" + clientId,
        { method: 'POST', headers: {
          'Content-Type':'application/json',
          // 'Authorization' : token
        },
      })
      .then(response => {
        if (response.ok) {
          fetchClientTrainings();
        }
        else {
          alert('Что-то пошло не так!');
        }
      })
      .catch(err => console.error(err))
    }
  

    const updateClientTraining = (link, trainingId, clientId) => {

      // const token = sessionStorage.getItem("jwt");

      fetch(link + '?trainingId=' + trainingId + "&clientId=" + clientId ,
        { 
          method: 'PUT', 
          headers: {
          'Content-Type':  'application/json',
          // 'Authorization' : token
        },
      })
      .then(response => {
        if (response.ok) {
          fetchClientTrainings();
        }
        else {
          alert('Что-то пошло не так!');
        }
      })
      .catch(err => console.error(err))
    }
     
    const fetchTrainings = async (url) => {
      // const token = sessionStorage.getItem("jwt");
      try {
        const config = {
          headers: {
            // 'Authorization' : token
          }
        };
        const response = await axios.get(url, config);
        let facility = await fetchTrainingFacilities(response.data._links.complexFacility.href)
        let id = response.data._links.self.href;
        return "Тренировка №" + id.slice(id.lastIndexOf("/") + 1) + ". Место проведения: "
         + facility;
      } catch (error) {
        console.error('Error fetching trainings:', error);
        return 'N/A';
      }
    };

    const fetchTrainingFacilities = async (url) => {
      // const token = sessionStorage.getItem("jwt");
      try {
        const config = {
          headers: {
            // 'Authorization' : token
          }
        };
        const response = await axios.get(url, config);
        return response.data.facilityType;
      } catch (error) {
        console.error('Error fetching facilities:', error);
        return 'N/A';
      }
    }

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
      {field: 'status', headerName: 'Статус тренировки', width: 160},
      {field: 'client', headerName: 'Клиент, записываемый на тренировку', width: 520},
      {field: 'training', headerName: 'Тренировка', width: 500},
      {
        field: '_links.client_training.href', 
        headerName: '', 
        sortable: false,
        filterable: false,
        width: 100,
        renderCell: row => <EditClientTraining
                              data={row} 
                              updateClientTraining={updateClientTraining} />
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
        const updatedRows = await Promise.all(client_trainings.map(async client_training => ({
          id: client_training._links.clientTraining.href,
          status: client_training.status,
          client: await fetchClients(client_training._links.client.href),
          training: await fetchTrainings(client_training._links.training.href),
        })));
        setRows(updatedRows);
      };
  
      updateRows();
    }, [client_trainings]);


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
      Согласование занятий
    </Typography>
      <main className='info_pages_body'>
    <React.Fragment>
      <AddClientTraining addClientTraining={addClientTraining} />
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
          message="Запись о согласовании занятий удалена"
        />
      </div>
    </React.Fragment>
    </main>
    </Box>
  );
}

export default ClientTrainingTable;