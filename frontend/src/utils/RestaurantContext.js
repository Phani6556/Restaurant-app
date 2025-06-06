import { createContext, useEffect, useState } from 'react';
import axios from 'axios';

export const RestaurantContext = createContext();

export const RestaurantProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [tables, setTables] = useState([]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

  const fetchTables = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/tables');
      setTables(response.data);
    } catch (error) {
      console.error('Failed to fetch tables:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchTables();

    const interval = setInterval(() => {
      fetchOrders();
      fetchTables();
    }, 5000); // 

    return () => clearInterval(interval);
  }, []);

  return (
    <RestaurantContext.Provider value={{ orders, tables, setOrders, setTables }}>
      {children}
    </RestaurantContext.Provider>
  );
};
