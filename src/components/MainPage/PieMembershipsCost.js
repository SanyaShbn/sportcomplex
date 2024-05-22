import { Box, Stack, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import { SERVER_URL } from '../../constants.js';

const COLORS = ['#00C49F', '#0088FE', '#FFBB28', '#FF8042'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};
export default function PieMembershipsCost() {
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
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        flexWrap: 'wrap',
      }}
    >
      <PieChart width={200} height={200}>
        <Pie
          data={costGroups}
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={80}
          fill="#8884d8"
          dataKey="qty"
        >
          {costGroups.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
      <Stack gap={2}>
        <Typography variant="h6">Стоимость абонементов</Typography>
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          {COLORS.map((color, i) => (
            <Stack key={color} alignItems="center" spacing={1}>
              <Box sx={{ width: 20, height: 20, background: color }} />
              <Typography variant="body2" sx={{ opacity: 0.7 }}>
                {costGroups[i]?.name}
              </Typography>
            </Stack>
          ))}
        </Box>
      </Stack>
    </Box>
  );
}