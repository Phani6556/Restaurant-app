import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import '../styles/Orders.css';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [tables, setTables] = useState([]);
  const [chefs, setChefs] = useState([]);
  const apiUrl = process.env.REACT_APP_API_URL;


  useEffect(() => {
    fetchChefs();
    fetchTables();
    const interval = setInterval(fetchTables, 5000); 
    return () => clearInterval(interval);
  }, []);

 const fetchChefs = async () => {
    try {
      const res = await axios.get('${apiUrl}/api/dashboard/chef-summary');
      setChefs(res.data.chefs);
    } catch (err) {
       console.error('Error fetching chefs:', err);
    }
  };


  const fetchTables = async () => {
    try {
      const res = await axios.get('${apiUrl}/api/tables');
      setTables(res.data);
    } catch (err) {
      console.error('Error fetching tables:', err);
    }
  };

  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_URL;
    const socket = io('apiUrl'); // for socket.io
      socket.on('orderUpdate', (newOrder) => {
        setOrders(prevOrders => {
          const exists = prevOrders.some(o => o._id === newOrder._id);
           if (exists) {
           return prevOrders.map(o => o._id === newOrder._id ? newOrder : o);
           } else {
          return [newOrder, ...prevOrders];
          }
        });
      });

    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000); 
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('${apiUrl}/api/orders');
      const normalized = res.data.map(order => ({
        ...order,
        type: order.type || order.orderType || '',
        tableId: order.tableId || null,
        tableNumber: typeof order.tableId === 'object' && order.tableId !== null
          ? order.tableId.name || order.tableId.tableNumber || ''
          : order.tableNumber || '',
        status: order.status || ''
      }));
      setOrders(normalized);
    } catch (err) {
      console.error('Error fetching orders:', err.response?.data || err.message);
    }
  };

  const handleTogglePicked = async (orderId) => {
    const order = orders.find(o => o._id === orderId);
    if (!order) return;

    let newStatus;
    if (order.type === 'Take Away') {
      newStatus = order.status === 'Picked Up' ? 'Not Picked Up' : 'Picked Up';
    } else {
      newStatus = 'Served';
    }

    try {
      const res = await axios.put('${apiUrl}/api/orders/${orderId}`, { status: newStatus });
      setOrders(prev => prev.map(o => o._id === orderId ? {
        ...res.data,
        type: res.data.type || res.data.orderType || '',
        tableId: res.data.tableId || null,
        tableNumber: typeof res.data.tableId === 'object' && res.data.tableId !== null
          ? res.data.tableId.name || res.data.tableId.tableNumber || ''
          : res.data.tableNumber || '',
        status: res.data.status || ''
      } : o));
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const getMinutesPassed = (createdAt) => {
    return Math.floor((Date.now() - new Date(createdAt)) / 60000);
  };

  const assignTable = async (orderId, tableId) => {
    try {
         const table = tables.find(t => t._id === tableId);
       if (!table) return;

           await axios.put('${apiUrl}/api/orders/${orderId}/assign-table`, {
        tableNumber: table.tableNumber,
       });

     await axios.patch('${apiUrl}/api/tables/${tableId}/status`, { status: 'Reserved' });

      fetchOrders();
      fetchTables();
    } catch (err) {
      console.error('Failed to assign table and update status:', err);
    }
  };

  const assignChef = async (orderId, chefId) => {
    try {
      await axios.put('${apiUrl}/api/orders/${orderId}/assign-chef`, { chefId });
      fetchOrders();
      fetchChefs();
    } catch (err) {
      console.error('Failed to assign chef:', err);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchType = typeFilter === 'All' || order.type === typeFilter;
    const matchStatus =
      statusFilter === 'All' ||
      (order.status?.toLowerCase().includes(statusFilter.toLowerCase())) ||
      (statusFilter === 'Order Done' && order.status === 'Done');
    return matchType && matchStatus;
  });

  return (
    <div className="orders-container">
      <div className="orders-filters">
        <label>
          Type:
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="All">All</option>
            <option value="Dine In">Dine In</option>
            <option value="Take Away">Take Away</option>
          </select>
        </label>
        <label>
          Status:
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="All">All</option>
            <option value="Processing">Processing</option>
            <option value="Order Done">Order Done</option>
            <option value="Served">Served</option>
            <option value="Picked Up">Picked Up</option>
            <option value="Not Picked Up">Not Picked Up</option>
          </select>
        </label>
      </div>

      {filteredOrders.map(order => {
        const minutesPassed = getMinutesPassed(order.createdAt);
        const assignedTable = typeof order.tableId === 'object' ? order.tableId : null;
        const tableStatus = assignedTable
          ? tables.find(t => t._id === assignedTable._id)?.status || 'Unknown'
          : null;

        return (
          <div className={`order-card-ui ${order.status?.toLowerCase().replace(" ", "-")}`} key={order._id}>
            <div className="order-header">
              <div className="assignments">
                {order.type === 'Dine In' && !order.tableId && (
                  <select onChange={(e) => assignTable(order._id, e.target.value)} defaultValue="">
                    <option value="" disabled>Assign Table</option>
                    {tables.filter(t => t.status === 'Available').map(t => (
                      <option key={t._id} value={t._id}>
                        Table {t.tableNumber}
                      </option>
                    ))}
                  </select>
                )}

                {!order.chef && (
                 <select onChange={(e) => assignChef(order._id, e.target.value)} defaultValue="">
                    <option value="" disabled>Assign Chef</option>
                    {chefs
                     .sort((a, b) => (a.orderCount ?? a.orderTaken ?? 0) - (b.orderCount ?? b.orderTaken ?? 0))
                     .map((c,idx) => (
                    <option key={`${c._id}-${idx}`} value={c._id}>
                       {c.name} ({c.orderCount} {c.orderCount === 1 ? 'order' : 'orders'})
                    </option>
                   ))}

                  </select>
                )}

              </div>

              <div>
                <h3>🍽️ #{order.orderNumber || ''}</h3>
                {order.type === 'Dine In' && (
                  <p>
                    Table: {order.tableNumber || 'Unassigned'}
                    {tableStatus && (
                      <span className={`table-status-indicator ${tableStatus.toLowerCase()}`}>
                        ({tableStatus})
                      </span>
                    )}
                  </p>
                )}
                <p>{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                <p>{order.items.length} Item{order.items.length > 1 ? 's' : ''}</p>
              </div>

              <div className="status-badge-top">
                {order.type === 'Dine In' ? (
                  minutesPassed < 20 && order.status === 'Processing' ? (
                    <>
                      <p>Dine In</p>
                      <p>Ongoing: {20 - minutesPassed} Min</p>
                    </>
                  ) : (
                    <>
                      <p>Done</p>
                      <p>Served</p>
                    </>
                  )
                ) : (
                  minutesPassed < 20 && order.status === 'Processing' ? (
                    <>
                      <p>Take Away</p>
                      <p>Not Picked Up</p>
                    </>
                  ) : (
                    <>
                      <p>Take Away</p>
                      <p
                        style={{ cursor: 'pointer', textDecoration: 'underline' }}
                        onClick={() => handleTogglePicked(order._id)}>
                        {order.status}
                      </p>
                    </>
                  )
                )}
              </div>
            </div>

            <div className="order-items-box">
              <ul>
                {order.items.map((item, idx) => (
                  <li key={idx}>{item.quantity} x {item.name}</li>
                ))}
              </ul>
            </div>

            <div className="order-footer">
              <div className={`order-status ${order.status?.toLowerCase().replace(" ", "-")}`}>
                {minutesPassed < 20 && order.status === 'Processing' ? (
                  <>
                    <span>Processing</span> ⏳
                  </>
                ) : (
                  <>
                    <span>Order Done</span> ✅
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Orders;
