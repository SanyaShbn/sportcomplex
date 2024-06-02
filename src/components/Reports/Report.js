import {React, useEffect, useState, useCallback} from 'react'
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer'
import logo from "../MainPage/logo.png"
import { SERVER_URL } from '../../constants.js'
import { Font } from '@react-pdf/renderer'
import ClientsTable from './ClientsTable.js'
import TrainingsTable from './TrainingsTable.js'
import FacilitiesTable from './FacilitiesTable.js'
import MembershipsTable from './MembershipsTable.js'
import EmployeesTable from './EmployeesTable.js'
import EventsTable from './EventsTable.js'
import PackagesOfServicesTable from './PackagesOfServicesTable.js'
import TrainingsRegistrationsTable from './TrainingsRegistrationsTable.js'
import SoldMembershipsTable from './SoldMembershipsTable.js'
import { jwtDecode } from 'jwt-decode'

Font.register({
  family: 'Pacifico', 
  src: 'https://fonts.gstatic.com/s/pacifico/v9/fKnfV28XkldRW297cFLeqfesZW2xOQ-xsNqO47m55DA.ttf', 
});

Font.register({
  family: "Roboto",
  src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf"
});

const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      alignItems: 'stretch',
      paddingBottom: 60,
      paddingTop: 30
    },
    footer: {
      fontFamily: "Roboto",
      position: 'absolute',
      fontSize: 8,
      bottom: 30,
      left: 5,
      right: 0,
      color: 'grey',
    },
    pageNumber: {
      position: 'absolute',
      fontSize: 8,
      bottom: 30,
      right: 30,
      color: 'grey',
    },
    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1
    },
    table: { 
      display: "table", 
      width: "auto", 
      borderStyle: "solid", 
      borderWidth: 1, 
      borderRightWidth: 0, 
      borderBottomWidth: 0 
    }, 
    tableRow: { 
      margin: "auto", 
      flexDirection: "row" 
    }, 
    tableCol: { 
      width: "20%", 
      borderStyle: "solid", 
      borderWidth: 1, 
      borderLeftWidth: 0, 
      borderTopWidth: 0 
    }, 
    tableCell: { 
      fontFamily: "Roboto",
      margin: "auto", 
      marginTop: 5, 
      fontSize: 10 
    },
    title: {
      fontSize: 24,
      textAlign: 'center',
      fontFamily: 'Roboto'
    },
    subtitle: {
      fontSize: 18,
      textAlign: 'center',
      fontFamily: 'Roboto'
    },
    text: {
      fontFamily: "Pacifico",
    },
    contentText: { 
      fontFamily: "Roboto",
      marginTop: 5, 
      marginLeft: 20,
      marginRight: 15,
      textAlign:'justify',
      fontSize: 12
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center', 
    },
    logo: {
      margin: 10,
      marginTop: 0,
      width: 30, 
      height: 30,
    },
    diagram: {
      margin: 10,
      width: 500, 
      height: 600,
    },
  });

const Report = ({ setSelectedButtonLink, link }) => {
  
    const token = sessionStorage.getItem("jwt");
    const decodedToken = jwtDecode(token);
    const [user, setUser] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
  
    const fetchUser = useCallback(async () => {
      setIsLoading(true)
      const response = await fetch(SERVER_URL + '/api/user_profile?userLogin=' + decodedToken.sub, {
        headers: { 'Authorization' : token }
      });
      const data = await response.json();
      setUser(data);
      setIsLoading(false);
    }, [decodedToken.sub, token]);

  const data = JSON.parse(localStorage.getItem('reportData'));
  const [clients, setClients] = useState([])
  const [trainings, setTrainings] = useState([])
  const [facilities, setFacilities] = useState([])
  const [memberships, setMemberships] = useState([])
  const [events, setEvents] = useState([])
  const [employees, setEmployees] = useState([])
  const [client_trainings, setClientTrainings] = useState([])
  const [training_memberships, setTrainingMemberships] = useState([])
  const [client_memberships, setClinetMemberships] = useState([])
  const option = data && data.option ? data.option : ''

  const ChooseWichDataToFetch = useCallback(() =>{
    if(option && option !== '' && option.length !== 0){
    switch (option) {
      case 'clients':
        fetchClients()
        break;
      case 'trainings':
        fetchTrainings()
        break;
      case 'facilities':
        fetchFacilities()
        break;
        case 'memberships':
        fetchMemberships()
        break;
      case 'events':
        fetchEvents()
        break;
      case 'employees':
        fetchEmployees()
        break;
        case 'service_packages':
        fetchTrainingMemberships()
        break;
      case 'trainings_registrations':
        fetchClientTrainings()
        break;
      case 'sold_memberships':
        fetchClientMemberships()
        break;
      default: break;
    }
  }
  }, [option])
  
  useEffect(() => {
    setSelectedButtonLink(link)
    fetchUser()
    ChooseWichDataToFetch()
  }, [setSelectedButtonLink, link, fetchUser, ChooseWichDataToFetch]);

  const fetchClients = () => {
    setIsLoading(true)
    const token = sessionStorage.getItem("jwt")
    fetch(SERVER_URL + '/api/view_clients', {
      headers: { 'Authorization' : token }
    })
    .then(response => response.json())
    .then(data => {
      setClients(data)
      setIsLoading(false)
    })
    .catch(err => console.error(err));    
  }
  const fetchTrainings = () => {
    setIsLoading(true)
    const token = sessionStorage.getItem("jwt");
    const decodedToken = jwtDecode(sessionStorage.getItem("jwt"))
    let url
    if(decodedToken.roles.toString() !== 'COACH'){
      url = SERVER_URL + '/api/view_trainings'
    }else{
      url = SERVER_URL + '/api/view_coach_trainings?userLogin=' + decodedToken.sub
    }
    fetch(url, {
      headers: { 'Authorization' : token }
    })
    .then(response => response.json())
    .then(data => {
      setTrainings(data)
      setIsLoading(false)
    })
    .catch(err => console.error(err));    
  }

  const fetchFacilities = () => {
    setIsLoading(true)
    const token = sessionStorage.getItem("jwt");
    fetch(SERVER_URL + '/api/view_facilities', {
      headers: { 'Authorization' : token }
    })
    .then(response => response.json())
    .then(data => {
      setFacilities(data)
      setIsLoading(false)
  })
    .catch(err => console.error(err));    
  }

  const fetchMemberships = () => {
    setIsLoading(true)
    const token = sessionStorage.getItem("jwt");
    fetch(SERVER_URL + '/api/view_memberships', {
      headers: { 'Authorization' : token }
    })
    .then(response => response.json())
    .then(data => {
      setMemberships(data)
      setIsLoading(false)
  })
    .catch(err => console.error(err));    
  }

  const fetchEvents = () => {
    setIsLoading(true)
    const token = sessionStorage.getItem("jwt");
    const decodedToken = jwtDecode(sessionStorage.getItem("jwt"))
    let url
    if(decodedToken.roles.toString() !== 'COACH'){
      url = SERVER_URL + '/api/events'
    }else{
      url = SERVER_URL + '/api/coach_events?userLogin=' + decodedToken.sub
    }
    fetch(url, {
      headers: { 'Authorization' : token }
    })
    .then(response => response.json())
    .then(data => {
      setEvents(data)
      setIsLoading(false)
  })
    .catch(err => console.error(err));    
  }

  const fetchEmployees = () => {
    setIsLoading(true)
    const token = sessionStorage.getItem("jwt");
    fetch(SERVER_URL + '/api/view_all_employees', {
      headers: { 'Authorization' : token }
    })
    .then(response => response.json())
    .then(data =>{
       setEmployees(data)
       setIsLoading(false)
  })
    .catch(err => console.error(err));    
  }

  const fetchClientTrainings = () => {
    setIsLoading(true)
    const token = sessionStorage.getItem("jwt");
    const decodedToken = jwtDecode(sessionStorage.getItem("jwt"))
    let url
    if(decodedToken.roles.toString() !== 'COACH'){
      url = SERVER_URL + '/api/all_client_trainings'
    }else{
      url = SERVER_URL + '/api/coach_client_trainings?userLogin=' + decodedToken.sub
    }
    fetch(url, {
      headers: { 'Authorization' : token }
    })
    .then(response => response.json())
    .then(data => {
      setClientTrainings(data)
      setIsLoading(false)
  })
    .catch(err => console.error(err));    
  }

  const fetchTrainingMemberships = () => {
    setIsLoading(true)
    const token = sessionStorage.getItem("jwt");
    fetch(SERVER_URL + '/training_memberships', {
      headers: { 'Authorization' : token }
    })
    .then(response => response.json())
    .then(data => {
      setTrainingMemberships(data)
      setIsLoading(false)
  })
    .catch(err => console.error(err));    
  }

  const fetchClientMemberships = () => {
    setIsLoading(true)
    const token = sessionStorage.getItem("jwt");
    fetch(SERVER_URL + '/client_memberships', {
      headers: { 'Authorization' : token }
    })
    .then(response => response.json())
    .then(data => {
      setClinetMemberships(data)
      setIsLoading(false)
  })
    .catch(err => console.error(err));    
  }

  return (
  <Document title={data !== '' && typeof data !== 'undefined' ?
  data.title : ''} subject={data !== '' && typeof data !== 'undefined' ? data.subject : ''} author={user.surName + ' ' + user.firstName + ' ' + user.patrSurName}>
  {isLoading ? (
      // If the data is still loading, render a loading message or spinner
      <p></p>
    ) : (
    <Page size="A4" style={styles.page} >
      <View style={styles.row}>
        <Image
          style={styles.logo}
          src={logo}
        />
        <Text style={styles.text}>BestSports</Text>
      </View>
      <View>
      <Text style={styles.title}>ОТЧЕТ</Text>
      <Text style={styles.subtitle}>{data !== '' && typeof data !== 'undefined' ? data.subject : ''}</Text>
      <Text style={styles.contentText}>{data !== '' && typeof data !== 'undefined' ? data.textContent : ''}</Text> 
      </View>
      <View>
      {option && option !== '' && option.length !== 0 && (
      <>
      {option === 'clients' && <ClientsTable clients={clients} />}
      {option === 'trainings' && <TrainingsTable trainings={trainings} />}
      {option === 'facilities' && <FacilitiesTable facilities={facilities} />}
      {option === 'memberships' && <MembershipsTable memberships={memberships} />}
      {option === 'employees' && <EmployeesTable employees={employees}/>}
      {option === 'events' && <EventsTable events={events} />}
      {option === 'service_packages' && <PackagesOfServicesTable service_packages={training_memberships}/>}
      {option === 'trainings_registrations' && <TrainingsRegistrationsTable trainings_registrations={client_trainings} />}
      {option === 'sold_memberships' && <SoldMembershipsTable sold_memberships={client_memberships}/>}
      </>
      )}
      </View>
        <View>
      </View>
         <Text style={styles.footer} fixed>
       Автор: {user.surName + ' ' + user.firstName + ' ' + user.patrSurName} | Дата создания: {new Date().toLocaleDateString()}
      </Text>
      <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
       `${pageNumber} / ${totalPages}`
      )} fixed />
    </Page>
     )}
  </Document>
)
}

export default Report;