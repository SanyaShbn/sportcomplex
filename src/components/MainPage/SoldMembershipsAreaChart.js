import moment from 'moment';
import 'moment/locale/ru';
import { useEffect, useState, useMemo } from 'react';
import { SERVER_URL } from '../../constants.js';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

export default function SoldMembershipsAreaChart({ months }) {
const [client_memberships, setClientMemberships] = useState([]);
const [data, setData] = useState([]);

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

  const tempData = useMemo(() => {
    const data = [];
    const today = new Date();
    for (let i = 0; i < months; i++) {
      const date = new Date(
        today.getFullYear(),
        today.getMonth() - (months - (i + 1))
      );
      data.push({
        date,
        name: moment(date).locale('ru').format('MMM YYYY'),
        clientMemberships: 0
      });
    }
    return data;
  }, [months]);
  
  useEffect(() => {
    const data = [...tempData];
    for (let i = 0; i < months; i++) {
      data[i].clientMemberships = 0;
    }
    client_memberships.forEach((client_membership) => {
      for (let i = 0; i < months; i++) {
        if (moment(data[i].date).isSame(client_membership?.soldAt, 'month'))
          return data[i].clientMemberships++;
      }
    });
    data.sort((a, b) => a.date - b.date);
    setData(data);
  }, [client_memberships, months, tempData]);

  return (
    <div style={{ width: '100%', height: 300, minWidth: 250 }}>
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