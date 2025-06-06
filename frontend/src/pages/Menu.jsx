import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Menu.css';

const categories = ['Drink', 'Burger', 'Pizza', 'French Fries', 'Veggies'];

function Menu() {
  const [items, setItems] = useState([]);
  
  const [selectedCategory, setSelectedCategory] = useState('Drink');
  const apiUrl = process.env.REACT_APP_API_URL;


  useEffect(() => {
    axios.get(`${apiUrl}/api/menu`)
      .then(res => setItems(res.data))
      .catch(err => console.error('Menu fetch error:', err));
  }, []);

 const importAll = (r) => {
    let images = {};
    r.keys().forEach((key) => {
      const fileName = key.replace('./', '');
      images[fileName] = r(key);
    });
    return images;
  };

  const images = importAll(require.context('../assets', false, /\.(png|jpg|svg)$/));
  const filteredItems = items.filter(i => i.category === selectedCategory);

  return (
    <div className="menu-container">
      <h2>Menu</h2>

      <div className="category-buttons">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={selectedCategory === cat ? 'active' : ''}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="item-grid">
        {filteredItems.map(item => (
          <div key={item._id} className="item-card">
            {item.image && (
              <img  src={images[item.image] || images['default.jpg']} alt={item.name} className="item-image" />
            )}
            <div className="item-details">
              <strong>{item.name}</strong><br />
              ₹{item.price}<br />
             
            </div>
          </div>
        ))}
      </div>

      
      
    </div>
  );
}

export default Menu;
