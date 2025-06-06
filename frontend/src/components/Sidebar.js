import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaTachometerAlt, FaChair, FaUtensils, FaClipboardList } from 'react-icons/fa';
import '../styles/Sidebar.css';

function Sidebar() {
  const [hovered, setHovered] = useState(null);

  return (
    <div className="sidebar">

      <h3 className="sidebar-logo">🍽️</h3>
                 

      <NavLink
        to="/dashboard"
        className="sidebar-link"
        activeclassname="active"
        onMouseEnter={() => setHovered('dashboard')}
        onMouseLeave={() => setHovered(null)}
      >
        <div className="icon-with-tooltip">
          <FaTachometerAlt />
          {hovered === 'dashboard' && <span className="tooltip-text">Dashboard</span>}
        </div>
      </NavLink>

      <NavLink
        to="/tables"
        className="sidebar-link"
        activeclassname="active"
        onMouseEnter={() => setHovered('tables')}
        onMouseLeave={() => setHovered(null)}
      >
        <div className="icon-with-tooltip">
          <FaChair />
          {hovered === 'tables' && <span className="tooltip-text">Tables</span>}
        </div>
      </NavLink>

      <NavLink
        to="/menu"
        className="sidebar-link"
        activeclassname="active"
        onMouseEnter={() => setHovered('menu')}
        onMouseLeave={() => setHovered(null)}
      >
        <div className="icon-with-tooltip">
          <FaUtensils />
          {hovered === 'menu' && <span className="tooltip-text">Menu</span>}
        </div>
      </NavLink>

      <NavLink
        to="/orders"
        className="sidebar-link"
        activeclassname="active"
        onMouseEnter={() => setHovered('orders')}
        onMouseLeave={() => setHovered(null)}
      >
        <div className="icon-with-tooltip">
          <FaClipboardList />
          {hovered === 'orders' && <span className="tooltip-text">Orders</span>}
        </div>
      </NavLink>
    </div>
  );
}

export default Sidebar;
