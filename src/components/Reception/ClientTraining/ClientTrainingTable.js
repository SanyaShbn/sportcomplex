
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
import AddClientTraining from './AddClientTraining.js';
import EditClientTraining from './EditClientTraining.js';
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

const ClientTrainingTable =({ setSelectedButtonLink, link }) => {

  useEffect(() => {
    setSelectedButtonLink(link);
  });

  const {
    dispatch,
  } = useValue();

    const [client_trainings, setClientTrainings] = useState([]);
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
      fetchClientTrainings();
    }, []);
  
    const fetchClientTrainings = () => {
      const token = sessionStorage.getItem("jwt");
      fetch(SERVER_URL + '/api/clientTrainings', {
        headers: { 'Authorization' : token }
      })
      .then(response => response.json())
      .then(data => {
        const sortedClientTrainings = data._embedded.clientTrainings.sort((a, b) => a._links.self.href.slice(a._links.self.href.lastIndexOf('/') + 1) 
        - b._links.self.href.slice(b._links.self.href.lastIndexOf('/') + 1) );
        setClientTrainings(sortedClientTrainings)
        sortedClientTrainings.length !== 0 ? setLoading(true) : setLoading(false)
        
    })
      .catch(err => console.error(err));    
    }

    const onDelClick = (id) => {
      if(jwtDecode(sessionStorage.getItem("jwt")).roles.toString() === 'MANAGER'){
        dispatch({
          type: 'UPDATE_ALERT',
          payload: {
          open: true,
          severity: 'error',
          message: 'Недостаточный уровень доступа. Менеджер по клиентам не имеет прав на удаление информации о согласованных занятиях (исключительно просмотр)',
        },});
      }
      else{
      setDialogOpen(true);
      setRowIdToDelete(id)
      }
    }

    const handleConfirmDelete = (id) => {

        const token = sessionStorage.getItem("jwt")
        const decodedToken = jwtDecode(token)

        fetch(SERVER_URL + '/api/deleteClientTrainings?id=' + id.slice(id.lastIndexOf("/") + 1) + "&userLogin=" + decodedToken.sub, {
          method: 'DELETE',
          headers: { 'Authorization' : token }
          })
        .then(response => {
          if (response.ok) {
            fetchClientTrainings();
            setDelOpen(true);
          }
          else {
            dispatch({
              type: 'UPDATE_ALERT',
              payload: {
                open: true,
                severity: 'error',
                message: 'Недостаточный уровень доступа. Сотрудник тренерского персонала имеет право редактировать данные о согласовании проводимых лично им занятий',
              },
            });
          }
          setDialogOpen(false)
        })
        .catch(err => console.error(err))

}

    const addClientTraining = (trainingId, clientId, signingsAmount) => {

      const token = sessionStorage.getItem("jwt")
      const decodedToken = jwtDecode(token)

      fetch(SERVER_URL + '/api/save_client_training?trainingId=' + trainingId + "&clientId=" + clientId + "&signingsAmount=" + signingsAmount
      + "&userLogin=" + decodedToken.sub,
        { method: 'POST', headers: {
          'Content-Type':'application/json',
          'Authorization' : token
        },
      })
      .then(response => {
        if (response.ok) {
          response.json().then(data => {
            if (data.clients_amount === data.capacity) {
              dispatch({
                type: 'UPDATE_ALERT',
                payload: {
                  open: true,
                  severity: 'info',
                  message: 'Достигнуто максимально допустимое количество клиентов для записи на тренировку №' + data.idTraining + 
                  ". Для записи других клиентов необходимо будет отменить занятия для одного из уже записанных клиентов",
                },
              });
            }
            fetchClientTrainings();
            setAddOpen(true)
          });
        } else {
          if(response.status === 400){
            dispatch({
              type: 'UPDATE_ALERT',
              payload: {
                open: true,
                severity: 'error',
                message: 'Выбранный клиент уже записан на соответствующую выбранную тренировку. Вы можете лишь изменить количество занятий, на которое данный клиент записан',
              },
            });
          }
          else{
            if(response.status === 500){
              dispatch({
                type: 'UPDATE_ALERT',
                payload: {
                  open: true,
                  severity: 'error',
                  message: 'На выбранную тренировку уже записано максимально допустимое количество клиентов',
                },
              });
            }else{
              if(response.status === 401){
                dispatch({
                  type: 'UPDATE_ALERT',
                  payload: {
                    open: true,
                    severity: 'error',
                    message: 'Для записи на выбранную тренировку у выбранного клиента нет оснований '
                     + '(клиенту необходимо приобрести абонемент, который включает в себя выбранную услугу)',
                  },
                });
              }
            else{
              if(response.status === 402){
                dispatch({
                  type: 'UPDATE_ALERT',
                  payload: {
                    open: true,
                    severity: 'error',
                    message: 'Планируемое количество посещений клиентом данного тренировочного занятия превышает включенное в приобретенный клиентом абонемент количество посещений',
                  },
                });
              }
              else{
                if(response.status === 404){
                  dispatch({
                    type: 'UPDATE_ALERT',
                    payload: {
                      open: true,
                      severity: 'error',
                      message: 'Недостаточный уровень доступа. Сотрудник тренерского персонала имеет право согласовывать только проводимые лично им занятия',
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
            }
          }
          }
        }
      })
      .catch(err => console.error(err))
    }
  

    const updateClientTraining = (link, trainingId, clientId, signingsAmount) => {

      const token = sessionStorage.getItem("jwt")
      const decodedToken = jwtDecode(token)

      fetch(link + '?trainingId=' + trainingId + "&clientId=" + clientId + "&signingsAmount=" + signingsAmount
       + "&userLogin=" + decodedToken.sub,
        { 
          method: 'PUT', 
          headers: {
          'Content-Type':  'application/json',
          'Authorization' : token
        },
      })
      .then(response => {
        if (response.ok) {
          response.json().then(data => {
            if (data.clients_amount === data.capacity) {
              dispatch({
                type: 'UPDATE_ALERT',
                payload: {
                  open: true,
                  severity: 'info',
                  message: 'Достигнуто максимально допустимое количество клиентов для записи на тренировку №' + data.idTraining + 
                  '. Для записи других клиентов необходимо будет отменить занятия для одного из уже записанных клиентов',
                },
              });
            }
            fetchClientTrainings();
            setEditOpen(true)
          });
        } else {
          if(response.status === 400){
            dispatch({
              type: 'UPDATE_ALERT',
              payload: {
                open: true,
                severity: 'error',
                message: 'Выбранный клиент уже записан на соответствующую выбранную тренировку. Вы можете лишь изменить количество занятий, на которое данный клиент записан',
              },
            });
          }
          else{
            if(response.status === 500){
              dispatch({
                type: 'UPDATE_ALERT',
                payload: {
                  open: true,
                  severity: 'error',
                  message: 'На выбранную тренировку уже записано максимально допустимое количество клиентов',
                },
              });
            }else{
              if(response.status === 401){
                dispatch({
                  type: 'UPDATE_ALERT',
                  payload: {
                    open: true,
                    severity: 'error',
                    message: 'Для записи на выбранную тренировку у выбранного клиента нет оснований '
                     + '(клиенту необходимо приобрести абонемент, который включает в себя выбранную услугу)',
                  },
                });
              }
              else{
                if(response.status === 402){
                  dispatch({
                    type: 'UPDATE_ALERT',
                    payload: {
                      open: true,
                      severity: 'error',
                      message: 'Планируемое количество посещений клиентом данного тренировочного занятия превышает включенное в приобретенный клиентом абонемент количество посещений',
                    },
                  });
                }
                else{
                  if(response.status === 404){
                    dispatch({
                      type: 'UPDATE_ALERT',
                      payload: {
                        open: true,
                        severity: 'error',
                        message: 'Недостаточный уровень доступа. Сотрудник тренерского персонала имеет право редактировать данные о согласовании проводимых лично им занятий',
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
            }
          }
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
        return "Тренировка №" + id.slice(id.lastIndexOf("/") + 1) + ". " + response.data.name
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
      {field: 'client', headerName: 'Клиент, записываемый на тренировку', width: 480},
      {field: 'training', headerName: 'Тренировка', width: 350},
      {field: 'signingsAmount', headerName: 'Планируемое количество посещений', width: 310},
      {
        field: '_links.client_training.href', 
        headerName: '', 
        sortable: false,
        filterable: false,
        width: 80,
        renderCell: row => <EditClientTraining
                              data={row} 
                              updateClientTraining={updateClientTraining} />
      },
      {
        field: '_links.self.href', 
        headerName: '', 
        width: 80,
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
        <DialogTitle id="alert-dialog-title">{"ВЫ уверены, что хотите удалить запись о согласованном занятии?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Запись о согласованном занятии будет безвозвратно удалена
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
        const updatedRows = await Promise.all(client_trainings.map(async client_training => ({
          id: client_training._links.clientTraining.href,
          signingsAmount: client_training.signingsAmount,
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
          message="Запись о согласовании занятий удалена"
        />
        <Snackbar
          open={addOpen}
          autoHideDuration={2000}
          onClose={() => setAddOpen(false)}
          message="Запись о новом согласовании занятий успешно добавлена"
        />
        <Snackbar
          open={editOpen}
          autoHideDuration={2000}
          onClose={() => setEditOpen(false)}
          message="Информация о согласовании занятий успешно обновлена"
        />
      </div>
    </React.Fragment>
    </main>
    </Box>
  );
}

export default ClientTrainingTable;