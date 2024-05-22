import {React, useEffect, useState} from 'react'
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer'
import logo from "../MainPage/logo.png"
import { SERVER_URL } from '../../constants.js'
import { Font } from '@react-pdf/renderer'
import PieMembershipsCost from '../MainPage/PieMembershipsCost.js'
import ClientTable from '../Client/ClientTable.js'

Font.register({
  family: 'Pacifico', 
  src: 'http://fonts.gstatic.com/s/pacifico/v9/fKnfV28XkldRW297cFLeqfesZW2xOQ-xsNqO47m55DA.ttf', 
});

Font.register({
  family: 'Roboto', 
  src: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu72xKKTU1Kvnz.woff2', 
});

const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      backgroundColor: '#E4E4E4',
      alignItems: 'stretch',
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
    text: {
      fontFamily: "Pacifico",
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center', 
    },
    logo: {
      margin: 10,
      width: 30, 
      height: 30,
    },
  });

const Report = ({ setSelectedLink, link }) => {

  useEffect(() => {
    setSelectedLink(link)
  }, []);

  useEffect(() => {
    fetchClients()
  }, []);

  const [clients, setClients] = useState([])

  const fetchClients = () => {
    // const token = sessionStorage.getItem("jwt")
    fetch(SERVER_URL + '/api/view_clients', {
      // headers: { 'Authorization' : token }
    })
    .then(response => response.json())
    .then(data => setClients(data))
    .catch(err => console.error(err));    
  }

  return (
  <Document title='document' subject='document' author={''}>
    <Page size="A4" style={styles.page} >
      <View style={styles.row}>
        <Image
          style={styles.logo}
          src={logo}
        />
        <Text style={styles.text}>BestSports</Text>
      </View>
      <View style={styles.section}>
        <View style={styles.table}> 
          <View style={styles.tableRow}> 
            <View style={styles.tableCol}> 
              <Text style={styles.tableCell}>Имя</Text> 
            </View> 
            <View style={styles.tableCol}> 
              <Text style={styles.tableCell}>Email</Text> 
            </View> 
          </View> 
          {clients.map(client => 
            <View style={styles.tableRow}> 
              <View style={styles.tableCol}> 
                <Text style={styles.tableCell}>{client.firstName}</Text> 
              </View> 
              <View style={styles.tableCol}> 
                <Text style={styles.tableCell}>{client.email}</Text> 
              </View> 
            </View> 
          )}
        </View>
        <Text>Author: Alex</Text>
      </View>
    </Page>
  </Document>
)
}

export default Report;