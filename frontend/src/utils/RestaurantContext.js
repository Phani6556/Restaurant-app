import { createContext, useEffect, useState } from 'react';
import axios from 'axios';

export const RestaurantContext = createContext();

export const RestaurantProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [tables, setTables] = useState([]);
  const apiUrl = process.env.REACT_APP_API_URL;


  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/orders`);
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

  const fetchTables = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/tables`);
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
