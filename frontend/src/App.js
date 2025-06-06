import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard.jsx';
import Tables from './pages/Tables';
import Orders from './pages/Orders.jsx';
import Menu from './pages/Menu';
import Sidebar from './components/Sidebar';
import MainPage from './pages/Main Page.jsx'; 
function App() {
  return (
    <Router>
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div style={{ marginLeft: '200px', padding: '20px', width: '100%' }}>
          <Routes>
            <Route path="/" element={<MainPage />} /> 
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tables" element={<Tables />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/menu" element={<Menu />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
