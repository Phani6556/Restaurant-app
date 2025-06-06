import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

import Metrics from '../components/Dashboard/Metrics';
import OrderSummary from '../components/Dashboard/OrderSummary';
import RevenueChart from '../components/Dashboard/RevenueChart';
import ChefSummary from '../components/Dashboard/ChefSummary';
import OrdersTable from '../components/Dashboard/OrdersTable';

import '../styles/Dashboard.css';

function Dashboard() {
  const [analyticsType, setAnalyticsType] = useState('');
  const [orders] = useState([]);
  const [chefs, setChefs] = useState([]);
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [summaryData, setSummaryData] = useState(null);
  const [dailyRevenue, setDailyRevenue] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiUrl = process.env.REACT_APP_API_URL;


  const fetchTables = async () => {
    try {
      const res = await axios.get('${apiUrl}/api/tables');
      setTables(res.data);
    } catch (err) {
      console.error('Error loading tables:', err);
      setError('Failed to load tables.');
    }
  };

 const fetchFilteredData = useCallback(async () => {
   try {
     const res = await axios.get('${apiUrl}/api/dashboard/chef-summary');
     console.log('👨‍🍳 Chef Summary API response:', res.data);
     setChefs(res.data.chefs || []);
   } catch (err) {
     console.error('Error fetching filtered data:', err);
     setError('Failed to load chef summary.');
   }
  }, []);

  const fetchSummary = async () => {
    try {
      const res = await axios.get('${apiUrl}/api/dashboard/order-summary');
      setSummaryData(res.data);
    } catch (err) {
      console.error('Error fetching summary data:', err);
      setError('Failed to load order summary.');
    }
  };

  const fetchDailyRevenue = async () => {
    try {
      const res = await axios.get('${apiUrl}/api/dashboard/daily-revenue');
      setDailyRevenue(res.data);
    } catch (err) {
      console.error('Error fetching daily revenue:', err);
      setError('Failed to load daily revenue.');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchTables(),
        fetchFilteredData(),
        fetchSummary(),
        fetchDailyRevenue(),
      ]);
      setLoading(false);
    };
    loadData();
  }, [fetchFilteredData]);

 useEffect(() => {
   const apiUrl = process.env.REACT_APP_API_URL;
   const socket = io(apiUrl);

   socket.on('orderUpdate', () => {
      console.log('📡 orderUpdate received');
     fetchFilteredData();
     fetchSummary();
     fetchDailyRevenue();
    });

    socket.on('tableStatusUpdated', () => fetchTables());

    socket.on('chefSummaryUpdated', () => {
     console.log('📡 chefSummaryUpdated received');
     fetchFilteredData();
    });

   return () => socket.disconnect();
  }, [fetchFilteredData]);


  if (loading) return <div className="dashboard">Loading dashboard...</div>;
  if (error) return <div className="dashboard error">⚠️ {error}</div>;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="filter-dropdown">
          <select value={analyticsType} onChange={(e) => setAnalyticsType(e.target.value)}>
            <option value="">Filter...</option>
            <option value="daily">Daily Summary</option>
            <option value="revenue">Daily Revenue</option>
            <option value="orders">Orders Table</option>
            <option value="chefs">Chef Summary</option>
          </select>
        </div>
      </div>

      <h2>Analytics</h2>
      <Metrics />

      <div className="summary-container">
        {!analyticsType && (
          <>
            <OrderSummary orders={summaryData} />
            <RevenueChart dailyRevenue={dailyRevenue} />
            <OrdersTable
              orders={orders}
              tables={tables}
              selectedDay={selectedTable}
              setSelectedDay={setSelectedTable}
            />
            <ChefSummary chefs={chefs} orders={orders} />
          </>
        )}

        {analyticsType === 'daily' && <OrderSummary orders={summaryData} />}
        {analyticsType === 'revenue' && <RevenueChart dailyRevenue={dailyRevenue} />}
        {analyticsType === 'orders' && (
          <OrdersTable
            orders={orders}
            tables={tables}
            selectedDay={selectedTable}
            setSelectedDay={setSelectedTable}
          />
        )}
        {analyticsType === 'chefs' && <ChefSummary chefs={chefs}  />}
      </div>
    </div>
  );
}

export default Dashboard;
