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
      width: "33.3%", 
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

function PackagesOfServicesTable({service_packages}){
return (
<View style={styles.section}>
        <View style={styles.table}> 
          <View style={styles.tableRow}> 
            <View style={styles.tableCol}> 
              <Text style={styles.tableCell}>Количество посещений, входящих в пакет услуг</Text> 
            </View> 
            <View style={styles.tableCol}> 
              <Text style={styles.tableCell}>Абонемент</Text> 
            </View> 
            <View style={styles.tableCol}> 
              <Text style={styles.tableCell}>Услуга</Text> 
            </View> 
        </View> 
          {service_packages.map(service_package => 
            <View style={styles.tableRow}> 
             <View style={styles.tableCol}> 
                <Text style={styles.tableCell}>{service_package.visitsAmount}</Text> 
              </View> 
             <View style={styles.tableCol}> 
                <Text style={styles.tableCell}>{service_package.sportComplexMembership.name}</Text> 
              </View> 
              <View style={styles.tableCol}> 
                <Text style={styles.tableCell}>{service_package.training.name}</Text> 
              </View> 
            </View> 
          )}
        </View>
    </View>
    )    
}

export default PackagesOfServicesTable;