import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/OrdersTable.css';

function OrdersTable() {
  const [tables, setTables] = useState([]);

  useEffect(() => {
    const fetchTables = () => {
      axios.get('http://localhost:8000/api/tables')
        .then(res => setTables(res.data))
        .catch(err => console.error(err));
    };
    fetchTables();

    const interval = setInterval(fetchTables, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="table-section">
      <h3>Tables Overview</h3>
      <hr />
      <div className="calendar-grid">
        {tables.map((table, index) => (
          <div
            key={`${table._id}-${index}`}
            className={`calendar-cell ${table.status === 'Reserved' ? 'reserved' : 'available'}`}
          >
            <div className="table-number">Table {index + 1}</div>
            <div className="status-label">{table.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OrdersTable;
