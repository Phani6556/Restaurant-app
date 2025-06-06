import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Tables.css';
import { FaTrash } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 
import { io } from 'socket.io-client';

function Tables() {
  const [tables, setTables] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [newTable, setNewTable] = useState({ name: '', chairs: 1, status: 'Available' });
  const apiUrl = process.env.REACT_APP_API_URL;

  

  useEffect(() => {
    fetchTables();
  }, []);
  useEffect(() => {
   const apiUrl = process.env.REACT_APP_API_URL;
  const socket = io('apiUrl');
  socket.on('tableStatusUpdated', ({ tableId, status }) => {
    setTables(prev =>
      prev.map(table =>
        table._id === tableId ? { ...table, status } : table
      )
    );
  });

  return () => socket.disconnect();
}, []);


  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearch(searchInput);
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  const fetchTables = () => {
    axios.get('${apiUrl}/api/tables')
      .then(res => setTables(res.data))
      .catch(err => {
        console.error(err);
        toast.error('Failed to fetch tables.');
      });
  };

  const handleAddTable = () => {
    const { name, chairs } = newTable;
    if (chairs > 0) {
      const tableName = name.trim() !== '' ? name : `Table ${tables.length + 1}`;
      axios.post('${apiUrl}/api/tables', {
        name: tableName,
        chairs,
        status: 'Available',
      }).then(() => {
        fetchTables();
        toast.success('Table added!');
        setNewTable({ name: '', chairs: 1, status: 'Available' });
      }).catch(() => toast.error('Failed to add table.'));
    } else {
      toast.warning('Number of chairs must be at least 1');
    }
  };

  const handleDeleteTable = (id) => {
    if (window.confirm('Delete this table?')) {
      axios.delete('${apiUrl}/api/tables/${id}`)
        .then(() => {
          fetchTables();
          toast.success('Table deleted.');
        })
        .catch(() => toast.error('Failed to delete table.'));
    }
  };

  const toggleStatus = (table) => {
    const newStatus = table.status === 'Available' ? 'Reserved' : 'Available';
    axios.patch('${apiUrl}'/api/tables/${table._id}/status`, { status: newStatus })
      .then(() => {
        fetchTables();
        toast.info(`Status changed to ${newStatus}`);
      })
      .catch(() => toast.error('Failed to update status.'));
  };

  const filteredTables = tables.filter(table => {
    const matchesSearch = table.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || table.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="tables-container">
      <ToastContainer position="bottom-right" autoClose={2500} />
      <main className="main-content">
        <div className="controls">
          <div className="filter-group">
            <label htmlFor="statusFilter">Status</label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="All">All</option>
              <option value="Available">Available</option>
              <option value="Reserved">Reserved</option>
            </select>
          </div>

          <div className="search-group">
            <label htmlFor="searchInput">Search</label>
            <input
              id="searchInput"
              className="search-input"
              type="text"
              placeholder="Search by table name or number"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
            />
          </div>
        </div>

        <h2>Tables</h2>

        <div className="table-grid">
          {filteredTables.map((table, index) => (
            <div key={`${table._id}-${index}`} className="table-card">
              <div className="table-header">
                <span className="table-number">Table {index + 1}</span>
                <button className="delete-btn" onClick={() => handleDeleteTable(table._id)}>
                  <FaTrash />
                </button>
              </div>
              <div className="table-name">#️⃣ {table.name}</div>
              <div className="table-details">🪑 {table.chairs} chairs</div>
              <div
                className={`table-status ${table.status.toLowerCase()}`}
                onClick={() => toggleStatus(table)}
                title="Click to toggle status"
              >
                {table.status}
              </div>
            </div>
          ))}

          <div className="table-card add-new">
            <h4>Add Table</h4>
            <input
              type="text"
              placeholder="Table name (optional)"
              value={newTable.name}
              onChange={e => setNewTable({ ...newTable, name: e.target.value })}
            />
            <input
              type="number"
              min="1"
              placeholder="Chairs"
              value={newTable.chairs}
              onChange={e => setNewTable({ ...newTable, chairs: +e.target.value })}
            />
            <button onClick={handleAddTable}>Create</button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Tables;
