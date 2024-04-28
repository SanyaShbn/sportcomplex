import moment from 'moment';
import 'moment/locale/ru';
import { useEffect, useState } from 'react';
import { SERVER_URL } from '../../constants.js';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import MonthsDropdown from './MonthsDropdown.js';


const today = new Date();
const tempData = [];

export default function SoldMembershipsAreaChart() {
const [selectedMonths, setSelectedMonths] = useState(5);
const [client_memberships, setClientMemberships] = useState([]);
const [data, setData] = useState([]);

for (let i = 0; i < selectedMonths; i++) {
    const date = new Date(
      today.getFullYear(),
      today.getMonth() - (selectedMonths - (i + 1))
    );
    tempData.push({
      date,
      name: moment(date).locale('ru').format('MMM YYYY'),
      clientMemberships: 0
    });
  }
const fetchClientMemberships = () => {
    // const token = sessionStorage.getItem("jwt");
    fetch(SERVER_URL + '/api/clientMemberships', {
      // headers: { 'Authorization' : token }
    })
    .then(response => response.json())
    .then(data => setClientMemberships(data._embedded.clientMemberships))
    .catch(err => console.error(err));    
  }

  useEffect(() => {
    fetchClientMemberships();
  }, [selectedMonths]); 

  useEffect(() => {
    for (let i = 0; i < selectedMonths; i++) {
      tempData[i].clientMemberships = 0;
    }
    client_memberships.forEach((client_membership) => {
      for (let i = 0; i < selectedMonths; i++) {
        if (moment(tempData[i].date).isSame(client_membership?.soldAt, 'month'))
          return tempData[i].clientMemberships++;
      }
    });
    tempData.sort((a, b) => a.date - b.date);
    setData([...tempData]);
  }, [client_memberships]);

  return (
    <div style={{ width: '100%', height: 300, minWidth: 250 }}>
    <MonthsDropdown onChange={(e) => setSelectedMonths(Number(e.target.value))} />
      <ResponsiveContainer>
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: 0,
            bottom: 0,
          }}
        >
          <XAxis dataKey="name"/>
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="clientMemberships"
            name="Проданные абонементы"
            stackId="1"
            stroke="#8884d8"
            fill="#8884d8"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}