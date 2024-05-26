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

export default function RevenueChart({ months }) {
const [client_memberships, setClientMemberships] = useState([]);
const [data, setData] = useState([]);
const today = new Date();
const tempData = [];
for (let i = 0; i < months; i++) {
  const date = new Date(
    today.getFullYear(),
    today.getMonth() - (months - (i + 1))
  );
  tempData.push({
    date,
    name: moment(date).locale('ru').format('MMM YYYY'),
    clientMemberships: 0
  });
}

const fetchClientMemberships = () => {
    const token = sessionStorage.getItem("jwt");
    fetch(SERVER_URL + '/api/clientMemberships', {
      headers: { 'Authorization' : token }
    })
    .then(response => response.json())
    .then(data => setClientMemberships(data._embedded.clientMemberships))
    .catch(err => console.error(err));    
  }

  useEffect(() => {
    fetchClientMemberships();
  }, []); 

  useEffect(() => {
    for (let i = 0; i < months; i++) {
      tempData[i].clientMemberships = 0;
    }
    client_memberships.forEach((client_membership) => {
      for (let i = 0; i < months; i++) {
        if (moment(tempData[i].date).isSame(client_membership?.soldAt, 'month'))
          return tempData[i].clientMemberships += client_membership.revenue;
      }
    });
    tempData.sort((a, b) => a.date - b.date);
    setData([...tempData]);
  }, [client_memberships, months]);

  return (
    <div style={{ width: '100%', height: 500, minWidth: 250 }}>
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
          <Tooltip formatter={(value) => `${value} бел.руб.`} />
          <Area
            type="monotone"
            dataKey="clientMemberships"
            name="Выручка (бел.руб.)"
            stackId="1"
            stroke="#8884d8"
            fill="#8884d8"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}