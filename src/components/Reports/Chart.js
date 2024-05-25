import React, { useState, useEffect } from 'react'
import { Text, View, Document, StyleSheet } from '@react-pdf/renderer'
import { SERVER_URL } from '../../constants'
import { Font } from '@react-pdf/renderer'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
Font.register({
    family: "Roboto",
    src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf"
  });

const styles = StyleSheet.create({
  bar: {
    height: 10,
    marginTop: 2,
  },
  label: {
    fontFamily: "Roboto",
    fontSize: 10,
  },
});

export default function Chart() {
  const [memberships, setMemberships] = useState([]);
  const fetchMemberships = () => {
    // const token = sessionStorage.getItem("jwt");
    fetch(SERVER_URL + '/api/sportComplexMemberships', {
      // headers: { 'Authorization' : token }
    })
    .then(response => response.json())
    .then(data => setMemberships(data._embedded.sportComplexMemberships))
    .catch(err => console.error(err));    
  }

  const [costGroups, setCostGroups] = useState([]);

  useEffect(() => {
    fetchMemberships();
  }, []); 

  useEffect(() => {
    let lessThan50 = 0,
    between50And100 = 0,
    between100And200 = 0,
    moreThan200 = 0;
  memberships.forEach((membership) => {
    if (membership.cost < 50) return lessThan50++;
    if (membership.cost <= 100) return between50And100++;
    if (membership.cost <= 200) return between100And200++;
    moreThan200++;
  });
  setCostGroups([
    { name: 'Менее 50 бел.руб.', qty: lessThan50 },
    { name: 'От 50 до 100 бел.руб.', qty: between50And100 },
    { name: 'От 100 до 200 бел.руб.', qty: between100And200 },
    { name: 'Более 200 бел.руб.', qty: moreThan200 },
  ]);
}, [memberships]);

const total = costGroups.reduce((sum, group) => sum + group.qty, 0);
const chartWidth = 200;

  return (
    <Document>
    {costGroups.length > 0 ? costGroups.map((group, index) => (
      <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ ...styles.bar, width: (group.qty / total) * chartWidth, backgroundColor: COLORS[index % COLORS.length] }} />
        <Text style={styles.label}>{group.name} ({group.qty})</Text>
      </View>
    )) : null}
  </Document>
  );
}
