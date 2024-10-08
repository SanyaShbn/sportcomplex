
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
import { useValue } from '../../../context/ContextProvider.js';
import { jwtDecode } from 'jwt-decode';

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
  });

  const {
    dispatch,
  } = useValue();

    const [training_memberships, setTrainingMemberships] = useState([]);
    const [delOpen, setDelOpen] = useState(false);
    const [addOpen, setAddOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [rows, setRows] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [rowIdToDelete, setRowIdToDelete] = useState([]);
    const [loading, setLoading] = useState(true);
    const customLocaleText = {
      noRowsLabel: loading ? 'Загрузка...' : 'Нет данных',
    };
  
    useEffect(() => {
      fetchTrainingMemberships();
    }, []);
  
    const fetchTrainingMemberships = () => {
      const token = sessionStorage.getItem("jwt");
      fetch(SERVER_URL + '/api/trainingMemberships', {
        headers: { 'Authorization' : token }
      })
      .then(response => response.json())
      .then(data => {
        const sortedTrainingMemberships = data._embedded.trainingMemberships.sort((a, b) => a._links.self.href.slice(a._links.self.href.lastIndexOf('/') + 1) 
        - b._links.self.href.slice(b._links.self.href.lastIndexOf('/') + 1) );
        setTrainingMemberships(sortedTrainingMemberships)
        sortedTrainingMemberships.length !== 0 ? setLoading(true) : setLoading(false)
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
          message: 'Недостаточный уровень доступа. Сотрудник тренерского персонала не имеет прав на редактирование информации о пакетах услуг (исключительно просмотр)',
        },});
      }
      else{
      setDialogOpen(true)
      setRowIdToDelete(id)}
    }

    const handleConfirmDelete = (id) => {

        const token = sessionStorage.getItem("jwt");

        fetch(SERVER_URL + '/api/deleteTrainingMembership?id=' + id.slice(id.lastIndexOf("/") + 1), {
          method: 'DELETE',
          headers: { 'Authorization' : token }
          })
        .then(response => {
          if (response.ok) {
            fetchTrainingMemberships();
            setDelOpen(true);
          }
          else {
            alert('Что-то пошло не так!');
          }
          setDialogOpen(false)
        })
        .catch(err => console.error(err))

}

    const addTrainingMembership = (membership, trainingId, membershipId) => {

      const token = sessionStorage.getItem("jwt");

      fetch(SERVER_URL + '/api/save_training_membership?trainingId=' + trainingId + "&membershipId=" + membershipId,
        { method: 'POST', headers: {
          'Content-Type':'application/json',
          'Authorization' : token
        },
        body: JSON.stringify(membership)
      })
      .then(response => {
        if (response.ok) {
          fetchTrainingMemberships();
          setAddOpen(true)
        }
        else {
          if(response.status === 400){
            dispatch({
              type: 'UPDATE_ALERT',
              payload: {
                open: true,
                severity: 'error',
                message: 'Выбранная услуга уже включена в выбранный абонемент. Проверьте корректность ввода данных',
              },
            });
          }
          else{
            dispatch({
            type: 'UPDATE_ALERT',
            payload: {
              open: true,
              severity: 'error',
              message: 'Не удалось добавить новую запись. Проверьте корректность ввода данных!',
            },});
        }
      }
      })
      .catch(err => console.error(err))
    }
  

    const updateTrainingMembership = (link, trainingId, membershipId, updatedVisitsAmount) => {

      const token = sessionStorage.getItem("jwt");

      fetch(link + '?trainingId=' + trainingId + "&membershipId=" + membershipId + "&visitsAmount=" + updatedVisitsAmount,
        { 
          method: 'PUT', 
          headers: {
          'Content-Type':  'application/json',
          'Authorization' : token
        },
      })
      .then(response => {
        if (response.ok) {
          fetchTrainingMemberships();
          setEditOpen(true)
        }
        else {
          if(response.status === 400){
          dispatch({
            type: 'UPDATE_ALERT',
            payload: {
              open: true,
              severity: 'error',
              message: 'Выбранная услуга уже включена в выбранный абонемент. Проверьте корректность ввода данных',
            },
          });
        }
          else{
            dispatch({
            type: 'UPDATE_ALERT',
            payload: {
              open: true,
              severity: 'error',
              message: 'Не удалось сохранить изменения. Проверьте корректность ввода данных',
            },});
        }
      }
      })
      .catch(err => console.error(err))
    }
     
    const fetchTrainings = async (url) => {
      const token = sessionStorage.getItem("jwt");
      try {
        const config = {
          headers: {
            'Authorization' : token
          }
        };
        const response = await axios.get(url, config);
        let id = response.data._links.self.href;
        return "Тренировка №" + id.slice(id.lastIndexOf("/") + 1) + ". "
        + response.data.name;
      } catch (error) {
        return 'N/A';
      }
    };

    const fetchMemberships = async (url) => {
      const token = sessionStorage.getItem("jwt");
        try {
          const config = {
            headers: {
              'Authorization' : token
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
        <StyledDataGrid localeText={{...ruRU.components.MuiDataGrid.defaultProps.localeText, ...customLocaleText}} className="grid_component" 
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
          message="Запись о пакете услуг удалена"
        />
        <Snackbar
          open={addOpen}
          autoHideDuration={2000}
          onClose={() => setAddOpen(false)}
          message="Запись о новом пакете услуг успешно добавлена"
        />
        <Snackbar
          open={editOpen}
          autoHideDuration={2000}
          onClose={() => setEditOpen(false)}
          message="Информация о пакете услуг успешно обновлена"
        />
      </div>
    </React.Fragment>
    </main>
    </Box>
  );
}

export default TrainingMembershipTable;