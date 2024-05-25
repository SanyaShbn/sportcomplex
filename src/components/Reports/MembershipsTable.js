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

function MembershipsTable({memberships}){
return (
<View style={styles.section}>
        <View style={styles.table}> 
          <View style={styles.tableRow}> 
            <View style={styles.tableCol}> 
              <Text style={styles.tableCell}>Наименование</Text> 
            </View> 
            <View style={styles.tableCol}> 
              <Text style={styles.tableCell}>Дата истечения срока действия</Text> 
            </View> 
            <View style={styles.tableCol}> 
              <Text style={styles.tableCell}>Стоимость (бел.руб.)</Text> 
            </View> 
            <View style={styles.tableCol}> 
              <Text style={styles.tableCell}>Количество входящих в абонемент посещений</Text> 
            </View> 
        </View> 
          {memberships.map(membership => 
            <View style={styles.tableRow}> 
             <View style={styles.tableCol}> 
                <Text style={styles.tableCell}>{membership.name}</Text> 
              </View> 
             <View style={styles.tableCol}> 
                <Text style={styles.tableCell}>{membership.durationDeadline}</Text> 
              </View> 
              <View style={styles.tableCol}> 
                <Text style={styles.tableCell}>{membership.cost}</Text> 
              </View> 
              <View style={styles.tableCol}> 
                <Text style={styles.tableCell}>{membership.completeVisitsAmount}</Text> 
              </View> 
            </View> 
          )}
        </View>
    </View>
    )    
}

export default MembershipsTable;