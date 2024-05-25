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

function EventsTable({events}){
return (
<View style={styles.section}>
        <View style={styles.table}> 
          <View style={styles.tableRow}> 
            <View style={styles.tableCol}> 
              <Text style={styles.tableCell}>Наименование</Text> 
            </View> 
            <View style={styles.tableCol}> 
              <Text style={styles.tableCell}>Дата и время начала</Text> 
            </View> 
            <View style={styles.tableCol}> 
              <Text style={styles.tableCell}>Дата и время окончания</Text> 
            </View> 
            <View style={styles.tableCol}> 
              <Text style={styles.tableCell}>Тип события</Text> 
            </View> 
        </View> 
          {events.map(event => 
            <View style={styles.tableRow}> 
             <View style={styles.tableCol}> 
                <Text style={styles.tableCell}>{event.text}</Text> 
              </View> 
             <View style={styles.tableCol}> 
                <Text style={styles.tableCell}>{event.start_date}</Text> 
              </View> 
              <View style={styles.tableCol}> 
                <Text style={styles.tableCell}>{event.end_date}</Text> 
              </View> 
              <View style={styles.tableCol}> 
                <Text style={styles.tableCell}>{event.data_type}</Text> 
              </View> 
            </View> 
          )}
        </View>
    </View>
    )    
}

export default EventsTable;