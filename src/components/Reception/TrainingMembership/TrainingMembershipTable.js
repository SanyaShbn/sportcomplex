
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
import AddTrainingMembership from './AddTrainingMembership.js';
import EditTrainingMembership from './EditTrainingMembership.js';
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

const TrainingMembershipTable = ({ setSelectedButtonLink, link }) => {

  useEffect(() => {
    setSelectedButtonLink(link);
  }, []);


    const [training_memberships, setTrainingMemberships] = useState([]);
    const [open, setOpen] = useState(false);
    const [rows, setRows] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
  
    useEffect(() => {
      fetchTrainingMemberships();
    }, []);
  
    const fetchTrainingMemberships = () => {
      // const token = sessionStorage.getItem("jwt");
      fetch(SERVER_URL + '/api/trainingMemberships', {
        // headers: { 'Authorization' : token }
      })
      .then(response => response.json())
      .then(data => setTrainingMemberships(data._embedded.trainingMemberships))
      .catch(err => console.error(err));    
    }

    const onDelClick = () => {
      setDialogOpen(true);
    }

    const handleConfirmDelete = (id) => {

        // const token = sessionStorage.getItem("jwt");

        fetch(SERVER_URL + '/api/deleteTrainingMembership?id=' + id.slice(id.lastIndexOf("/") + 1), {
          method: 'DELETE',
          // headers: { 'Authorization' : token }
          })
        .then(response => {
          if (response.ok) {
            fetchTrainingMemberships();
            setOpen(true);
          }
          else {
            alert('Что-то пошло не так!');
          }
          setDialogOpen(false)
        })
        .catch(err => console.error(err))

}

    const addTrainingMembership = (membership, trainingId, membershipId) => {

      // const token = sessionStorage.getItem("jwt");

      fetch(SERVER_URL + '/api/save_training_membership?trainingId=' + trainingId + "&membershipId=" + membershipId,
        { method: 'POST', headers: {
          'Content-Type':'application/json',
          // 'Authorization' : token
        },
        body: JSON.stringify(membership)
      })
      .then(response => {
        if (response.ok) {
          fetchTrainingMemberships();
        }
        else {
          alert('Что-то пошло не так!');
        }
      })
      .catch(err => console.error(err))
    }
  

    const updateTrainingMembership = (link, trainingId, membershipId, updatedVisitsAmount) => {

      // const token = sessionStorage.getItem("jwt");

      fetch(link + '?trainingId=' + trainingId + "&membershipId=" + membershipId + "&visitsAmount=" + updatedVisitsAmount,
        { 
          method: 'PUT', 
          headers: {
          'Content-Type':  'application/json',
          // 'Authorization' : token
        },
      })
      .then(response => {
        if (response.ok) {
          fetchTrainingMemberships();
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
        let facilityType = facility && facility ? facility : "не установлено"
        let id = response.data._links.self.href;
        return "Тренировка №" + id.slice(id.lastIndexOf("/") + 1) + ". Место проведения: "
        + facilityType;
      } catch (error) {
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
        return 'N/A';
      }
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
          let id = response.data._links.self.href;
          return "Абонемент №" + id.slice(id.lastIndexOf("/") + 1) + ": " + response.data.name;
        } catch (error) {
          return 'N/A';
        }
      };


    const columns = [
      {field: 'visitsAmount', headerName: 'Количество тренировок, входящих в услугу', width: 370},
      {field: 'sportComplexMembership', headerName: 'Наименование абонемента', width: 350},
      {field: 'training', headerName: 'Тренировка', width: 450},
      {
        field: '_links.training_membership.href', 
        headerName: '', 
        sortable: false,
        filterable: false,
        width: 100,
        renderCell: row => <EditTrainingMembership
                              data={row} 
                              updateTrainingMembership={updateTrainingMembership} />
      },
      {
        field: '_links.self.href', 
        headerName: '', 
        width:120,
        sortable: false,
        filterable: false,
        renderCell: row => 
        <div>
        <IconButton onClick={() => onDelClick()}>
          <DeleteIcon color="error" />
        </IconButton>
        <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"ВЫ уверены, что хотите удалить тренировки, входящие в абонемент?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Запись о тренировках, входящих в абонемент, будет безвозвратно удалена
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="primary">
            Отменить
          </Button>
          <Button onClick={() => handleConfirmDelete(row.id)} color="primary" autoFocus>
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
      </div>
      }
    ];
    
    useEffect(() => {
      const updateRows = async () => {
        const updatedRows = await Promise.all(training_memberships.map(async training_membership => ({
          id: training_membership._links.trainingMembership.href,
          visitsAmount: training_membership.visitsAmount,
          sportComplexMembership: await fetchMemberships(training_membership._links.sportComplexMembership.href),
          training: await fetchTrainings(training_membership._links.training.href),
        })));
        setRows(updatedRows);
      };
  
      updateRows();
    }, [training_memberships]);


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
    Пакеты услуг  
    </Typography>
      <main className='info_pages_body'>
    <React.Fragment>
      <AddTrainingMembership addTrainingMembership={addTrainingMembership} />
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
          message="Запись о пакете тренировок удалена"
        />
      </div>
    </React.Fragment>
    </main>
    </Box>
  );
}

export default TrainingMembershipTable;