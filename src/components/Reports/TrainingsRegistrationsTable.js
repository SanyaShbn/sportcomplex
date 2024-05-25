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
      width: "50%", 
      borderStyle: "solid", 
      borderWidth: 1, 
      borderLeftWidth: 0, 
      borderTopWidth: 0 
    }, 
    tableCell: { 
      fontFamily: "Roboto",
      margin: 2, 
      marginTop: 5, 
      fontSize: 8 
    },
  });

function TrainingsRegistrationsTable({trainings_registrations}){
return (
<View style={styles.section}>
        <View style={styles.table}> 
          <View style={styles.tableRow}> 
            <View style={styles.tableCol}> 
              <Text style={styles.tableCell}>Клиент</Text> 
            </View> 
            <View style={styles.tableCol}> 
              <Text style={styles.tableCell}>Услуга</Text> 
            </View> 
        </View> 
          {trainings_registrations.map(trainings_registration => 
            <View style={styles.tableRow}> 
            <View style={styles.tableCol}> 
                <Text style={styles.tableCell}>{trainings_registration.client.surName + ' ' + trainings_registration.client.firstName + ' (' 
                + trainings_registration.client.phoneNumber + ')'}</Text> 
            </View> 
            <View style={styles.tableCol}> 
                <Text style={styles.tableCell}>{trainings_registration.training.name}</Text> 
              </View> 
            </View> 
          )}
        </View>
    </View>
    )    
}

export default TrainingsRegistrationsTable;