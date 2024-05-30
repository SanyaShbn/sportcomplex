
import React,  { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { SERVER_URL, StyledDataGrid } from '../../constants.js';
import {ruRU} from '@mui/x-data-grid';
import {GridToolbarContainer} from '@mui/x-data-grid';
import {GridToolbarExport} from '@mui/x-data-grid';
import {gridClasses } from '@mui/x-data-grid';
import {Snackbar, Box, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button} from '@mui/material';
import '../CSS/employeeCSS.css';
import '../CSS/table.css';
import AddTraining from './AddTraining';
import EditTraining from './EditTraining';
import { grey } from '@mui/material/colors';
import { useValue } from '../../context/ContextProvider';
import { jwtDecode } from 'jwt-decode';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

function CustomToolbar() {
  return (
    <GridToolbarContainer className={gridClasses.toolbarContainer}>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

const TrainingTable = ({ setSelectedLink, link }) => {

  useEffect(() => {
    setSelectedLink(link);
  });

    const {
      dispatch,
    } = useValue();
    const [trainings, setTrainings] = useState([]);
    const [rowIdToDelete, setRowIdToDelete] = useState([]);
    const [delOpen, setDelOpen] = useState(false);
    const [addOpen, setAddOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [rows, setRows] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);

    const token = sessionStorage.getItem("jwt")
    const decodedToken = jwtDecode(token)
  
    useEffect(() => {
      fetchTrainings();
    });
  
    const fetchTrainings = () => {
      fetch(SERVER_URL + '/api/trainings', {
        headers: { 'Authorization' : token }
      })
      .then(response => response.json())
      .then(data => {
        const sortedTrainings = data._embedded.trainings.sort((a, b) => a._links.self.href.slice(a._links.self.href.lastIndexOf('/') + 1) 
        - b._links.self.href.slice(b._links.self.href.lastIndexOf('/') + 1) );
        setTrainings(sortedTrainings)
    })
      .catch(err => console.error(err)); 
  }

  const onDelClick = (id) => {
    setDialogOpen(true);
    setRowIdToDelete(id);
  }

    const handleConfirmDelete = (url) => {

        fetch(url + "?userLogin=" + decodedToken.sub, {
          method: 'DELETE',
          headers: { 'Authorization' : token }
          })
        .then(response => {
          if (response.ok) {
            fetchTrainings();
            setDelOpen(true);
          }
          else {
            if(decodedToken.roles.toString() === "COACH"){
            dispatch({
              type: 'UPDATE_ALERT',
              payload: {
                open: true,
                severity: 'error',
                message: 'Недостаточный уровень доступа. Сотрудник тренерского персонала имеет право редактировать только проводимые лично им тренировки',
              },});
            }
          }
          setDialogOpen(false)
        })
        .catch(err => console.error(err))
    }
    const addTraining = (training, complexFacilityId, userId) => {

      fetch(SERVER_URL + '/api/save_trainings?complexFacilityId='+ complexFacilityId + "&userId=" + userId,
        { method: 'POST', headers: {
          'Content-Type':'application/json',
          'Authorization' : token
        },
        body: JSON.stringify(training)
      })
      .then(response => {
        if (response.ok) {
          fetchTrainings();
          setAddOpen(true)
        }
        else {
          dispatch({
            type: 'UPDATE_ALERT',
            payload: {
              open: true,
              severity: 'error',
              message: 'Не удалось сохранить изменения. Тренировка с установленным наименованием уже существует (данное поле должно быть уникальным)',
            },})
        }
      })
      .catch(err => console.error(err))
    }

    const updateTraining = (training, link, complexFacilityId, userId) => {
      const trainingProperties = [training.cost, training.name, training.capacity, training.type];
      fetch(link + '?complexFacilityId='+ complexFacilityId + "&userId=" + userId,
        { 
          method: 'PUT', 
          headers: {
          'Content-Type':  'application/json',
          'Authorization' : token
        },
        body: JSON.stringify(trainingProperties)
      })
      .then(response => {
        if (response.ok) {
          fetchTrainings();
          setEditOpen(true)
        }
        else {
          dispatch({
            type: 'UPDATE_ALERT',
            payload: {
              open: true,
              severity: 'error',
              message: 'Не удалось сохранить изменения. Тренировка с установленным новым наименованием уже существует (данное поле должно быть уникальным)',
            },})
        }
      })
      .catch(err => console.error(err))
    }
 
    const columns = [
      {field: 'name', headerName: 'Наименование', width: 180},
      {field: 'type', headerName: 'Тип занятия', width: 120},
      {field: 'cost', headerName: 'Стоимость (бел.руб.)', width: 180},
      {field: 'capacity', headerName: 'Емкость', width: 100},
      {field: 'clients_amount', headerName: 'Кол-во клиентов', width: 180},
      {field: 'complexFacility', headerName: 'Место проведения', width: 270},
      {field: 'coach', headerName: 'Тренер', width: 290},
      {
        field: '_links.training.href', 
        headerName: '', 
        sortable: false,
        filterable: false,
        width: 50,
        renderCell: row => <EditTraining
                              data={row} 
                              updateTraining={updateTraining} />
      },
      {
        field: '_links.self.href', 
        headerName: '', 
        width:60,
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
        <DialogTitle id="alert-dialog-title">{"ВЫ уверены, что хотите удалить запись о тренировке?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Запись запись о тренировке будет безвозвратно удалена
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

    const fetchComplexFacility = useCallback(async (url) => {
      try {
        const config = {
          headers: {
            'Authorization' : token
          }
        };
        const response = await axios.get(url, config);
        let id = response.data._links.self.href;
        return "Сооружение №" + id.slice(id.lastIndexOf("/") + 1) + ": " + response.data.name ;
      } catch (error) {
        return 'не установлено';
      }
    }, [token]); 
    
    const fetchCoach = useCallback(async (url) => {
      try {
        const config = {
          headers: {
            'Authorization' : token
          }
        };
        const response = await axios.get(url, config);
        let id = response.data._links.self.href;
        return "Тренер №" + id.slice(id.lastIndexOf("/") + 1) + ": " + response.data.surName + " " + response.data.firstName;
      } catch (error) {
        return 'не назначен';
      }
    }, [token]);
    
    useEffect(() => {
      const updateRows = async () => {
        const updatedRows = await Promise.all(trainings.map(async training => ({
          id: training._links.self.href,
          name: training.name,
          type: training.type,
          capacity: training.capacity,
          clients_amount: training.clients_amount,
          cost: training.cost,
          complexFacility: await fetchComplexFacility(training._links.complexFacility.href),
          coach: await fetchCoach(training._links.coach.href),
        })));
        setRows(updatedRows);
      };
    
      updateRows();
    }, [trainings, fetchCoach, fetchComplexFacility]);
    
    useEffect(() => {
      const updateRows = async () => {
        const updatedRows = await Promise.all(trainings.map(async training => ({
          id: training._links.self.href,
          name: training.name,
          type: training.type,
          capacity: training.capacity,
          clients_amount: training.clients_amount,
          cost: training.cost,
          complexFacility: await fetchComplexFacility(training._links.complexFacility.href),
          coach: await fetchCoach(training._links.coach.href),
        })));
        setRows(updatedRows);
      };
  
      updateRows();
    }, [trainings, fetchCoach, fetchComplexFacility]);


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
      Тренировки
    </Typography>
      <main className='info_pages_body'>
    <React.Fragment>
      <AddTraining addTraining={addTraining} />
      <div className="container" style={{ height: 400, width: "100%"}}>
        <StyledDataGrid localeText={ruRU.components.MuiDataGrid.defaultProps.localeText} className="grid_component" 
          columns={columns} 
          rows={rows} 
          disableSelectionOnClick={true}
          getRowId={row => row.id}
          {...trainings}
          initialState={{
            ...trainings.initialState,
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
          message="Запись о тренировке удалена"
        />
        <Snackbar
          open={addOpen}
          autoHideDuration={2000}
          onClose={() => setAddOpen(false)}
          message="Запись о новой тренировке успешно добавлена"
        />
        <Snackbar
          open={editOpen}
          autoHideDuration={2000}
          onClose={() => setEditOpen(false)}
          message="Информация о тренировке успешно обновлена"
        />
      </div>
    </React.Fragment>
    </main>
    </Box>
  );
}

export default TrainingTable;