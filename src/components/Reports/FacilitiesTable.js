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
      width: "25%", 
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

function FacilitiesTable({facilities}){
return (
<View style={styles.section}>
        <View style={styles.table}> 
          <View style={styles.tableRow}> 
            <View style={styles.tableCol}> 
              <Text style={styles.tableCell}>Наименование</Text> 
            </View> 
            <View style={styles.tableCol}> 
              <Text style={styles.tableCell}>Количество запланированных тренировок в помещении</Text> 
            </View> 
            <View style={styles.tableCol}> 
              <Text style={styles.tableCell}>Вместимость помещения (чел.)</Text> 
            </View> 
            <View style={styles.tableCol}> 
              <Text style={styles.tableCell}>Сотрудник обслуживающего персонала</Text> 
            </View> 
        </View> 
          {facilities.map(facility => 
            <View style={styles.tableRow}> 
             <View style={styles.tableCol}> 
                <Text style={styles.tableCell}>{facility.name}</Text> 
              </View> 
             <View style={styles.tableCol}> 
                <Text style={styles.tableCell}>{facility.trainingsAmount}</Text> 
              </View> 
              <View style={styles.tableCol}> 
                <Text style={styles.tableCell}>{facility.capacity}</Text> 
              </View> 
              <View style={styles.tableCol}> 
                <Text style={styles.tableCell}>{facility.cleaner.surName + ' ' + facility.cleaner.firstName + ' (' 
                + facility.cleaner.phoneNumber + ')'}</Text> 
              </View> 
            </View> 
          )}
        </View>
    </View>
    )    
}

export default FacilitiesTable;