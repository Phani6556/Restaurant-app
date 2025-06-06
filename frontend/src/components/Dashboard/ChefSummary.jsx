import React from 'react';

function ChefSummary({ chefs = [] }) {
  
  const sortedChefs = [...chefs].sort((a, b) => b.orderCount - a.orderCount);

  return (
    <div className="table-sec">
      <h3>👨‍🍳 Chef Performance Overview</h3>
      <table className="chef-table">
        <thead>
          <tr>
            <th>Chef Name</th>
            <th>Orders Taken</th>
          </tr>
        </thead>
        <tbody>
          {sortedChefs.map((chef) => (
            <tr key={chef._id}>
              <td>{chef.name}</td>
              <td>{chef.orderCount.toString().padStart(2, '0')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ChefSummary;
