import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function RevenueChart({ dailyRevenue }) {
  const [chartData, setChartData] = useState({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Revenue',
        data: [0, 0, 0, 0, 0, 0, 0], 
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  });

  useEffect(() => {
   if (dailyRevenue) {
     setChartData(prevData => {
       const updatedDatasets = prevData.datasets.map((dataset) => ({
        ...dataset,
        data: prevData.labels.map((day) => dailyRevenue[day] || 0),
       }));

       return {
         ...prevData,
         datasets: updatedDatasets,
       };
      });
    }
  }, [dailyRevenue]);


  return (
    <div className="card">
      <h3>Revenue</h3>
      <hr />
      <div className="chart-placeholder">
        <Line data={chartData} />
      </div>
    </div>
  );
}

export default RevenueChart;
