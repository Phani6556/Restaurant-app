import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';

function OrderSummary({ orders }) {
  const [data, setData] = useState([]);
  const COLORS = ['#4caf50', '#2196f3', '#ff9800'];
  

  useEffect(() => {
    if (orders) {
      setData([
        { name: 'Served', value: orders.served || 0 },
        { name: 'Dine In', value: orders.dineIn || 0 },
        { name: 'Take Away', value: orders.takeAway || 0 },
      ]);
    }
  }, [orders]);

  const total = data.reduce((sum, item) => sum + item.value, 0);

  const getPercentage = (val) =>
    total === 0 ? '0%' : `${Math.round((val / total) * 100)}%`;

  return (
    <div className="card">
      <h3>Order Summary</h3>
      <hr />
      <div className="summary-boxes">
        {data.map((item, i) => (
          <div key={i} className="summary-box">
            <div>{item.value.toString().padStart(2, '0')}</div>
            <div>{item.name}</div>
          </div>
        ))}
      </div>

      <div className="summary-chart" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <PieChart width={180} height={180}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={60}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>

        <div style={{ fontSize: '0.9rem' }}>
          {data.map((entry, index) => (
            <div key={entry.name} style={{ marginBottom: '6px' }}>
              <span style={{ color: COLORS[index], fontWeight: 'bold' }}>{entry.name}</span> ({getPercentage(entry.value)})
              <div style={{
                backgroundColor: '#eee',
                height: '6px',
                borderRadius: '5px',
                marginTop: '2px',
                width: '100px',
                overflow: 'hidden'
              }}>
                <div style={{
                  backgroundColor: COLORS[index],
                  width: getPercentage(entry.value),
                  height: '100%'
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default OrderSummary;
