
import React,  { useEffect, useState } from 'react';
import { SERVER_URL, StyledDataGrid } from '../../constants.js';
import {ruRU} from '@mui/x-data-grid';
import {GridToolbarContainer} from '@mui/x-data-grid';
import {GridToolbarExport} from '@mui/x-data-grid';
import {gridClasses } from '@mui/x-data-grid';
import {Snackbar, Box, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button} from '@mui/material';
import '../CSS/employeeCSS.css';
import '../CSS/table.css';
import AddFacility from './AddFacility.js';
import EditFacility from './EditFacility.js';
import { grey } from '@mui/material/colors';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { useValue } from '../../context/ContextProvider';

function CustomToolbar() {
  return (
    <GridToolbarContainer className={gridClasses.toolbarContainer}>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

const ComplexFacilityTable = ({ setSelectedLink, link }) => {

  useEffect(() => {
    setSelectedLink(link);
  }, []);

  const {
    dispatch,
  } = useValue();

    const [facilities, setFacilities] = useState([]);
    const [open, setOpen] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
  
    useEffect(() => {
      fetchFacilities();
    }, []);
  
    const fetchFacilities = () => {
      // const token = sessionStorage.getItem("jwt");
      fetch(SERVER_URL + '/api/complexFacilities', {
        // headers: { 'Authorization' : token }
      })
      .then(response => response.json())
      .then(data => setFacilities(data._embedded.complexFacilities))
      .catch(err => console.error(err));    
    }
    const onDelClick = () => {
      setDialogOpen(true);
    }
    
    const handleConfirmDelete = (url, trainingsAmount) => {
      // const token = sessionStorage.getItem("jwt");
    
      fetch(url, {
        method: 'DELETE',
        // headers: { 'Authorization' : token }
      })
      .then(response => {
        if (response.ok) {
          if(trainingsAmount !== 0){
          dispatch({
            type: 'UPDATE_ALERT',
            payload: {
              open: true,
              severity: 'info',
              message: 'Необходимо назначить новые места проведения для занятий, которые планировалось провести в сооружении,' +
               'запись о котором была вами удалена',
            },});
          }
          fetchFacilities();
          setOpen(true);
        }
        else {
          alert('Что-то пошло не так!');
        }
        setDialogOpen(false)
      })
      .catch(err => console.error(err))
      setDialogOpen(false);
    };
     
    const addFacility = (facility) => {

      // const token = sessionStorage.getItem("jwt");

      fetch(SERVER_URL + '/api/complexFacilities',
        { method: 'POST', headers: {
          'Content-Type':'application/json',
          // 'Authorization' : token
        },
        body: JSON.stringify(facility)
      })
      .then(response => {
        if (response.ok) {
          fetchFacilities();
        }
        else {
          alert('Что-то пошло не так!');
        }
      })
      .catch(err => console.error(err))
    }
  

    const updateFacility = (facility, link) => {

      // const token = sessionStorage.getItem("jwt");

      fetch(link,
        { 
          method: 'PUT', 
          headers: {
          'Content-Type':  'application/json',
          // 'Authorization' : token
        },
        body: JSON.stringify(facility)
      })
      .then(response => {
        if (response.ok) {
          fetchFacilities();
        }
        else {
          alert('Что-то пошло не так!');
        }
      })
      .catch(err => console.error(err))
    }
    
    const columns = [
      {field: 'name', headerName: 'Наименование', width: 300},
      {field: 'trainingsAmount', headerName: 'Количество тренировок', width: 300},
      {field: 'capacity', headerName: 'Вместимость (чел.)', width: 400},
      {
        field: '_links.facility.href', 
        headerName: '', 
        sortable: false,
        filterable: false,
        width: 100,
        renderCell: row => <EditFacility 
                              data={row} 
                              updateFacility={updateFacility} />
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
        <DialogTitle id="alert-dialog-title">{"ВЫ уверены, что хотите удалить запись о сооружении комплекса?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Запись о сооружении будет безвозвратно удалена
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="primary">
            Отменить
          </Button>
          <Button onClick={() => handleConfirmDelete(row.id, row.row.trainingsAmount)} color="primary" autoFocus>
            Удалить
          </Button>
        </DialogActions>
      </Dialog>
      </div>
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
      Сооружения спортивно-оздоровительного комплекса
    </Typography>
      <main className='info_pages_body'>
    <React.Fragment>
      <AddFacility addFacility={addFacility} />
      <div className="container" style={{ height: 400, width: "100%"}}>
        <StyledDataGrid localeText={ruRU.components.MuiDataGrid.defaultProps.localeText} className="grid_component" 
          columns={columns} 
          rows={facilities} 
          disableSelectionOnClick={true}
          getRowId={row => row._links.self.href}
          {...facilities}
          initialState={{
            ...facilities.initialState,
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
          message="Запись о сооружении удалена"
        />
      </div>
    </React.Fragment>
    </main>
    </Box>
  );
}

export default ComplexFacilityTable;