import React, { useState, useEffect } from 'react';
import { SERVER_URL } from '../../constants.js';
import {DataGrid, ruRU} from '@mui/x-data-grid';
import {GridToolbarContainer} from '@mui/x-data-grid';
import {GridToolbarExport} from '@mui/x-data-grid';
import {gridClasses } from '@mui/x-data-grid';
import Snackbar from '@mui/material/Snackbar';
import '../CSS/employeeCSS.css';
import '../CSS/table.css';
import AddEmployeeFacility from './AddEmployeeFacility.js';
import EditEmployeeFacility from './EditEmployeeFacility.js';

function CustomToolbar() {
  return (
    <GridToolbarContainer className={gridClasses.toolbarContainer}>
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}

function EmployeeFacilityTable(){

    const [open, setOpen] = useState(false);
    const [employee_facilities, setEmployeeFacilities] = useState([]);
  
    useEffect(() => {
      fetchEmployeeFacilities();
    }, []);

    const fetchEmployeeFacilities = () => {
      const token = sessionStorage.getItem("jwt");
      fetch(SERVER_URL + '/api/employeeFacilities', {
        headers: { 'Authorization' : token }
      })
      .then(response => response.json())
      .then(data => setEmployeeFacilities(data._embedded.employeeFacilities))
      .catch(err => console.error(err));    
    }
      const onDelClick = (url) => {
        if (window.confirm("ВЫ уверены, что хотите удалить данную связь?")) {
  
          const token = sessionStorage.getItem("jwt");
  
          fetch(url, {
            method: 'DELETE',
            headers: { 'Authorization' : token }
            })
          .then(response => {
            if (response.ok) {
              fetchEmployeeFacilities();
              setOpen(true);
            }
            else {
              alert('Что-то пошло не так!');
            }
          })
          .catch(err => console.error(err))
        }
      }
      const addEmployeeFacility= (employee_facility) => {
  
        const token = sessionStorage.getItem("jwt");
  
        fetch(SERVER_URL + '/api/employeeFacilities',
          { method: 'POST', headers: {
            'Content-Type':'application/json',
            'Authorization' : token
          },
          body: JSON.stringify(employee_facility)
        })
        .then(response => {
          if (response.ok) {
            fetchEmployeeFacilities();
          }
          else {
            alert('Что-то пошло не так!');
          }
        })
        .catch(err => console.error(err))
      }
    
  
      const updateEmployeeFacility = (employee_facility, link) => {
  
        const token = sessionStorage.getItem("jwt");
  
        fetch(link,
          { 
            method: 'PUT', 
            headers: {
            'Content-Type':  'application/json',
            'Authorization' : token
          },
          body: JSON.stringify(employee_facility)
        })
        .then(response => {
          if (response.ok) {
            fetchEmployeeFacilities();
          }
          else {
            alert('Что-то пошло не так!');
          }
        })
        .catch(err => console.error(err))
      }

      const columns = [
        {field: '_links.self.complexFacility.href.facilityType', headerName: 'Сооружение спортивно-оздоровительного комплекса', width: 300},
        {field: '_links.self.serviceEmployee.href.surName', headerName: 'Сотрудник обслуживающего персонала', width: 300},
        {
          field: '_links.employee_facility.href', 
          headerName: '', 
          sortable: false,
          filterable: false,
          width: 100,
          renderCell: row => <EditEmployeeFacility 
                                data={row} 
                                updateEmployeeFacility={updateEmployeeFacility} />
        },
        {
          field: '_links.self.href', 
          headerName: '', 
          width:120,
          sortable: false,
          filterable: false,
          renderCell: row => 
          <button className="shine-button" variant="contained" onClick={() => onDelClick(row.id)}> Удалить </button>
        }
      ];

  // const handleSubmit = () => {
  //   // Отправить данные на бекэнд для сохранения связи
  //   fetch(SERVER_URL + '/api/employeeFacilities', {
  //     method:'POST',
  //     idServiceEmployee: selectedServiceEmployee,
  //     idComplexFacility: selectedComplexFacility
  //   })
  //     .then(response => {
  //       console.log('Связь сохранена успешно');
  //     })
  //     .catch(error => {
  //       console.error('Ошибка при сохранении связи');
  //     });
  // };

  return (
    <main className='info_pages_body'>
    <h1>Графики уборок и обслуживания сооружений комплекса</h1>
  <React.Fragment>
    <AddEmployeeFacility addEmployeeFacility={addEmployeeFacility} />
    <div className="container" style={{ height: 400, width: "100%"}}>
      <DataGrid localeText={ruRU.components.MuiDataGrid.defaultProps.localeText} className="grid_component" 
        columns={columns} 
        rows={employee_facilities} 
        disableSelectionOnClick={true}
        getRowId={row => row._links.self.href}
        {...employee_facilities}
        initialState={{
          ...employee_facilities.initialState,
          pagination: { paginationModel: { pageSize: 5 } },
        }}
        pageSizeOptions={[5, 10, 25]}
        components={{ Toolbar: CustomToolbar }}
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
  );
};

export default EmployeeFacilityTable;