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
      borderTopWidth: 0 
    }, 
    tableColCapacityAndCost: { 
      width: "12.3%", 
      borderStyle: "solid", 
      borderWidth: 1, 
      borderLeftWidth: 0, 
      borderTopWidth: 0 
    }, 
    tableColCoach: { 
      width: "18.3%", 
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

function TrainingsTable({trainings}){
return (
<View style={styles.section}>
        <View style={styles.table}> 
          <View style={styles.tableRow}> 
            <View style={styles.tableCol}> 
              <Text style={styles.tableCell}>Наименование</Text> 
            </View> 
            <View style={styles.tableCol}> 
              <Text style={styles.tableCell}>Тип занятия</Text> 
            </View> 
            <View style={styles.tableColCapacityAndCost}> 
              <Text style={styles.tableCell}>Стоимость (бел.руб.)</Text> 
            </View> 
            <View style={styles.tableColCapacityAndCost}> 
              <Text style={styles.tableCell}>Емкость</Text> 
            </View> 
            <View style={styles.tableCol}> 
              <Text style={styles.tableCell}>Кол-во клиентов</Text> 
            </View> 
            <View style={styles.tableCol}> 
              <Text style={styles.tableCell}>Место проведения</Text> 
            </View> 
            <View style={styles.tableColCoach}> 
              <Text style={styles.tableCell}>Тренер</Text> 
            </View> 
        </View> 
          {trainings.map(training => 
            <View style={styles.tableRow}> 
             <View style={styles.tableCol}> 
                <Text style={styles.tableCell}>{training.name}</Text> 
              </View> 
             <View style={styles.tableCol}> 
                <Text style={styles.tableCell}>{training.type}</Text> 
              </View> 
              <View style={styles.tableColCapacityAndCost}> 
                <Text style={styles.tableCell}>{training.cost}</Text> 
              </View> 
              <View style={styles.tableColCapacityAndCost}> 
                <Text style={styles.tableCell}>{training.capacity}</Text> 
              </View> 
              <View style={styles.tableCol}> 
                <Text style={styles.tableCell}>{training.clients_amount}</Text> 
              </View> 
              <View style={styles.tableCol}> 
                <Text style={styles.tableCell}>{training.complexFacility.name + ' №' + training.complexFacility.idComplexFacility}</Text> 
              </View> 
              <View style={styles.tableColCoach}> 
                <Text style={styles.tableCell}>{training.coach.surName + ' ' + training.coach.firstName + ' (' 
                + training.coach.phoneNumber + ')'}</Text> 
              </View> 
            </View> 
          )}
        </View>
    </View>
    )    
}

export default TrainingsTable;