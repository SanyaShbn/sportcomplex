import React from 'react';
import { View, Text, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
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
      width: "17%", 
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
  });

function ClientsTable({clients}){
return(
<View style={styles.section}>
        <View style={styles.table}> 
          <View style={styles.tableRow}> 
            <View style={styles.tableCol}> 
              <Text style={styles.tableCell}>Фамилия</Text> 
            </View> 
            <View style={styles.tableCol}> 
              <Text style={styles.tableCell}>Имя</Text> 
            </View> 
            <View style={styles.tableCol}> 
              <Text style={styles.tableCell}>Отчество</Text> 
            </View> 
            <View style={styles.tableCol}> 
              <Text style={styles.tableCell}>Дата рождения</Text> 
            </View> 
            <View style={styles.tableCol}> 
              <Text style={styles.tableCell}>Номер телефона</Text> 
            </View> 
            <View style={styles.tableCol}> 
              <Text style={styles.tableCell}>Email</Text> 
            </View> 
        </View> 
          {clients.map(client => 
            <View style={styles.tableRow}> 
             <View style={styles.tableCol}> 
                <Text style={styles.tableCell}>{client.surName}</Text> 
              </View> 
             <View style={styles.tableCol}> 
                <Text style={styles.tableCell}>{client.firstName}</Text> 
              </View> 
              <View style={styles.tableCol}> 
                <Text style={styles.tableCell}>{client.patrSurName}</Text> 
              </View> 
              <View style={styles.tableCol}> 
                <Text style={styles.tableCell}>{client.birthDate}</Text> 
              </View> 
              <View style={styles.tableCol}> 
                <Text style={styles.tableCell}>{client.phoneNumber}</Text> 
              </View> 
              <View style={styles.tableCol}> 
                <Text style={styles.tableCell}>{client.email}</Text> 
              </View> 
            </View> 
          )}
        </View>
    </View>   
) 
}

export default ClientsTable;