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

function SoldMembershipsTable({sold_memberships}){
return (
<View style={styles.section}>
        <View style={styles.table}> 
          <View style={styles.tableRow}> 
            <View style={styles.tableCol}> 
              <Text style={styles.tableCell}>Абонемент</Text> 
            </View> 
            <View style={styles.tableCol}> 
              <Text style={styles.tableCell}>Клиент</Text> 
            </View> 
            <View style={styles.tableCol}> 
              <Text style={styles.tableCell}>Дата продажи</Text> 
            </View> 
            <View style={styles.tableCol}> 
              <Text style={styles.tableCell}>Выручка с продажи (бел.руб.)</Text> 
            </View> 
        </View> 
          {sold_memberships.map(sold_membership => 
            <View style={styles.tableRow}> 
             <View style={styles.tableCol}> 
                <Text style={styles.tableCell}>{sold_membership.sportComplexMembership.name}</Text> 
              </View> 
             <View style={styles.tableCol}> 
                <Text style={styles.tableCell}>{sold_membership.client.surName + ' ' + sold_membership.client.firstName + ' (' 
                + sold_membership.client.phoneNumber + ')'}</Text> 
              </View> 
              <View style={styles.tableCol}> 
                <Text style={styles.tableCell}>{sold_membership.soldAt}</Text> 
              </View> 
              <View style={styles.tableCol}> 
                <Text style={styles.tableCell}>{sold_membership.revenue}</Text> 
              </View> 
            </View> 
          )}
        </View>
    </View>
    )    
}

export default SoldMembershipsTable;