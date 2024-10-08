
import React,  { useEffect, useState } from 'react';
import { SERVER_URL, StyledDataGrid } from '../../constants.js';
import {ruRU, gridClasses} from '@mui/x-data-grid';
import {GridToolbarContainer} from '@mui/x-data-grid';
import {GridToolbarExport} from '@mui/x-data-grid';
import {Snackbar, Box, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button} from '@mui/material';
import '../CSS/employeeCSS.css';
import '../CSS/table.css';
import AddSportComplexMembership from './AddSportComplexMembership.js';
import { grey } from '@mui/material/colors';
import EditSportComplexMembership from './EditSportComplexMembership.js';
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

const SportComplexMembershipTable = ({ setSelectedLink, link }) => {

  useEffect(() => {
    setSelectedLink(link);
  });

    const [memberships, setMemberships] = useState([]);
    const [delOpen, setDelOpen] = useState(false);
    const [addOpen, setAddOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [rowIdToDelete, setRowIdToDelete] = useState([]);
    const [loading, setLoading] = useState(true);
    const customLocaleText = {
      noRowsLabel: loading ? 'Загрузка...' : 'Нет данных',
    };

    const {
      dispatch,
    } = useValue();
  
    useEffect(() => {
      fetchMemberships();
    }, []);
  
    const fetchMemberships = () => {
      const token = sessionStorage.getItem("jwt");
      fetch(SERVER_URL + '/api/sportComplexMemberships', {
        headers: { 'Authorization' : token }
      })
      .then(response => response.json())
      .then(data => {
        const sortedMemberships = data._embedded.sportComplexMemberships.sort((a, b) => a._links.self.href.slice(a._links.self.href.lastIndexOf('/') + 1) 
        - b._links.self.href.slice(b._links.self.href.lastIndexOf('/') + 1) );
        setMemberships(sortedMemberships)
        sortedMemberships.length !== 0 ? setLoading(true) : setLoading(false)
    })
      .catch(err => console.error(err));    
    }

    const onDelClick = (id) => {
      setDialogOpen(true);
      setRowIdToDelete(id)
    }

    const handleConfirmDelete = (url) => {

        const token = sessionStorage.getItem("jwt");

        fetch(url, {
          method: 'DELETE',
          headers: { 'Authorization' : token }
          })
        .then(response => {
          if (response.ok) {
            fetchMemberships();
            setDelOpen(true);
          }
          else {
            alert('Что-то пошло не так!');
          }
          setDialogOpen(false)
        })
        .catch(err => console.error(err))
}

    const addMembership = (membership) => {

      const token = sessionStorage.getItem("jwt");

      fetch(SERVER_URL + '/api/sportComplexMemberships',
        { method: 'POST', headers: {
          'Content-Type':'application/json',
          'Authorization' : token
        },
        body: JSON.stringify(membership)
      })
      .then(response => {
        if (response.ok) {
          fetchMemberships();
          setAddOpen(true)
        }
        else {
          dispatch({
            type: 'UPDATE_ALERT',
            payload: {
              open: true,
              severity: 'error',
              message: 'Не удалось добавить новую запись. Абонемент с установленным наименованием уже существует (данное поле должно быть уникальным)',
            },})
        }
      })
      .catch(err => console.error(err))
    }
  

    const updateMembership = (membership, link) => {

      const token = sessionStorage.getItem("jwt");

      fetch(link,
        { 
          method: 'PUT', 
          headers: {
          'Content-Type':  'application/json',
          'Authorization' : token
        },
        body: JSON.stringify(membership)
      })
      .then(response => {
        if (response.ok) {
          fetchMemberships();
          setEditOpen(true)
        }
        else {
          dispatch({
            type: 'UPDATE_ALERT',
            payload: {
              open: true,
              severity: 'error',
              message: 'Не удалось сохранить изменения. Абонемент с установленным новым наименованием уже существует (данное поле должно быть уникальным)',
            },})
        }
      })
      .catch(err => console.error(err))
    }
    
    const columns = [
      {field: 'name', headerName: 'Наименование', width: 300},
      {field: 'durationDeadline', headerName: 'Дата истечения', width: 250},
      {field: 'cost', headerName: 'Стоимость (бел.руб.)', width: 250},
      {field: 'completeVisitsAmount', headerName: 'Количество входящих в абонемент занятий', width: 400},
      {
        field: '_links.membership.href', 
        headerName: '', 
        sortable: false,
        filterable: false,
        width: 100,
        renderCell: row => <EditSportComplexMembership
                              data={row} 
                              updateMembership={updateMembership} />
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
        <DialogTitle id="alert-dialog-title">{"ВЫ уверены, что хотите удалить запись об абонементе?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Запись об абонементе будет безвозвратно удалена
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
      Абонементы
    </Typography>
    <main className='info_pages_body'>
    <React.Fragment>
      <AddSportComplexMembership addMembership={addMembership} />
      <div className="container" style={{ height: 400, width: "100%"}}>
        <StyledDataGrid localeText={{...ruRU.components.MuiDataGrid.defaultProps.localeText, ...customLocaleText}} className="grid_component" 
          columns={columns} 
          rows={memberships} 
          disableSelectionOnClick={true}
          getRowId={row => row._links.self.href}
          {...memberships}
          initialState={{
            ...memberships.initialState,
            pagination: { paginationModel: { pageSize: 5 } },
          }}
          pageSizeOptions={[5, 10, 25]}
          components={{ Toolbar: CustomToolbar }}
          sx={{
            [`& .${gridClasses.row}`]: {
              bgcolor: (theme) =>
                theme.palette.mode === 'light' ? grey[200] : grey[900],
            },
          }}/>
        <Snackbar
          open={delOpen}
          autoHideDuration={2000}
          onClose={() => setDelOpen(false)}
          message="Запись об абонементе удалена"
        />
        <Snackbar
          open={addOpen}
          autoHideDuration={2000}
          onClose={() => setAddOpen(false)}
          message="Запись о новом абонементе успешно добавлена"
        />
        <Snackbar
          open={editOpen}
          autoHideDuration={2000}
          onClose={() => setEditOpen(false)}
          message="Информация об абонементе успешно обновлена"
        />
      </div>
    </React.Fragment>
    </main>
    </Box>
  );
}

export default SportComplexMembershipTable;