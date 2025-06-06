import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import {
  MdOutlineRestaurantMenu,
  MdAttachMoney,
  MdFastfood,
  MdPeopleAlt,
} from 'react-icons/md';

const socket = io('http://localhost:8000');

function Metrics() {
  const [metrics, setMetrics] = useState({
    totalChefs: 0,
    totalRevenue: 0,
    totalOrders: 0,
    totalClients: 0,
  });

  const fetchMetrics = async () => {
    const res = await axios.get('http://localhost:8000/api/dashboard/metrics');
    setMetrics(res.data);
  };

  useEffect(() => {
    fetchMetrics();

    socket.on('orderUpdate', (order) => {
      fetchMetrics();
    });

    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    fetch('http://localhost:8000/api/dashboard/clients/count')
      .then(res => res.json())
      .then(data => {
        setMetrics(prev => ({ ...prev, totalClients: data.totalClients }));
      });
  }, []);

  const metricItems = [
    {
      icon: <MdOutlineRestaurantMenu />,
      label: 'Total Chefs',
      value: metrics.totalChefs,
    },
    {
      icon: <MdAttachMoney />,
      label: 'Total Revenue',
      value: `₹${metrics.totalRevenue}`,
    },
    {
      icon: <MdFastfood />,
      label: 'Total Orders',
      value: metrics.totalOrders,
    },
    {
      icon: <MdPeopleAlt />,
      label: 'Total Clients',
      value: metrics.totalClients,
    },
  ];

  return (
    <div className="metrics">
      {metricItems.map((item, index) => (
        <div className="metric-card" key={index}>
          <div className="metric-icon">{item.icon}</div>
          <div className="metric-value">{item.value}</div>
          <div className="metric-label">{item.label}</div>
        </div>
      ))}
    </div>
  );
}

export default Metrics;
