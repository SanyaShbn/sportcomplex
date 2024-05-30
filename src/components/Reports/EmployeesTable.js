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
      width: "14.3%", 
      borderStyle: "solid", 
      borderWidth: 1, 
      borderLeftWidth: 0, 
      borderTopWidth: 0,
    }, 
    tableColDateBirth:{
      width: "7.3%", 
      borderStyle: "solid", 
      borderWidth: 1, 
      borderLeftWidth: 0, 
      borderTopWidth: 0,
    },
    tableColPost:{
      width: "20.8%",
      borderStyle: "solid", 
      borderWidth: 1, 
      borderLeftWidth: 0, 
      borderTopWidth: 0, 
    },
    tableColPhone:{
      width: "11.5%",
      borderStyle: "solid", 
      borderWidth: 1, 
      borderLeftWidth: 0, 
      borderTopWidth: 0, 
    },
    tableColEmail:{
      width: "17.5%",
      borderStyle: "solid", 
      borderWidth: 1, 
      borderLeftWidth: 0, 
      borderTopWidth: 0, 
    },
    tableCell: { 
      fontFamily: "Roboto",
      fontSize: 8,
      wordBreak: 'break-all'
    },

  });

function EmployeesTable({employees}){
return (
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
            <View style={styles.tableColDateBirth}> 
              <Text style={styles.tableCell}>Дата рождения</Text> 
            </View> 
            <View style={styles.tableColPhone}> 
              <Text style={styles.tableCell}>Номер телефона</Text> 
            </View> 
            <View style={styles.tableColEmail}> 
              <Text style={styles.tableCell}>Email</Text> 
            </View> 
            <View style={styles.tableColPost}> 
              <Text style={styles.tableCell}>Должность</Text> 
            </View> 
        </View> 
          {employees.map(employee => 
            <View style={styles.tableRow}> 
             <View style={styles.tableCol}> 
                <Text style={styles.tableCell}>{employee.surName}</Text> 
              </View> 
             <View style={styles.tableCol}> 
                <Text style={styles.tableCell}>{employee.firstName}</Text> 
              </View> 
              <View style={styles.tableCol}> 
                <Text style={styles.tableCell}>{employee.patrSurName}</Text> 
              </View> 
              <View style={styles.tableColDateBirth}> 
                <Text style={styles.tableCell}>{employee.birthDate}</Text> 
              </View> 
              <View style={styles.tableColPhone}> 
                <Text style={styles.tableCell}>{employee.phoneNumber}</Text> 
              </View> 
              <View style={styles.tableColEmail}> 
                <Text style={styles.tableCell}>{employee.email}</Text> 
              </View> 
              <View style={styles.tableColPost}> 
                <Text style={styles.tableCell}>{employee.post}</Text> 
              </View> 
            </View> 
          )}
        </View>
    </View>
    )    
}

export default EmployeesTable;