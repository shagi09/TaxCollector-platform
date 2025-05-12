'use client';
import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { toast } from 'react-hot-toast';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Chart = () => {
  const [incomeCount, setIncomeCount] = useState(0);

  useEffect(() => {
    const fetchIncomeCount = async () => {
      try {
        const response = await fetch('/api/income'); // Replace with your actual API endpoint
        if (response.ok) {
          const data = await response.json();
          setIncomeCount(100); // Assuming the API returns { totalIncome: number }
        } else {
          toast.error('Failed to fetch income count.');
        }
      } catch (error) {
        console.error('Error fetching income count:', error);
        toast.error('An error occurred while fetching income count.');
      }
    };

    fetchIncomeCount();
  }, []);

  const data = {
    labels: ['Income'],
    datasets: [
      {
        label: 'Amount',
        data: [incomeCount],
        backgroundColor: ['#4CAF50'], // Green for income
        borderColor: ['#388E3C'],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Income',
      },
    },
  };

  return (
    <div className="p-6">
      <div className="bg-gray-100 p-4 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Income Chart</h2>
        <Bar data={data} options={options} />
      </div>
    </div>
  );
};

export default Chart;