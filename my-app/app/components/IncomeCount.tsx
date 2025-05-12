'use client'
import React from 'react'
import { useState,useEffect } from 'react';
import {toast} from 'react-hot-toast'

const IncomeCount = () => {
  const [incomeCount,setIncomeCount]=useState(0);

        
  useEffect(() => {
    const fetchIncomeCount = async () => {
      try {
        const response = await fetch('/api/employees'); // Replace with your actual API endpoint
        if (response.ok) {
          const employees = await response.json();
          setIncomeCount(employees.length); // Assuming the API returns an array of employees
        } else {
          setIncomeCount(100)
        }
      } catch (error) {
        toast.error('Error fetching income:', error);
      }
    };

    fetchIncomeCount();
  }, []);
  return (
    <div>
          <div className="p-6">
            <div className="bg-gray-100 p-4 rounded-lg shadow-md w-48">
              <h2 className="text-xl font-semibold">Total Income</h2>
              <p className="text-3xl font-bold">{incomeCount}</p>
            </div>
          </div>
        
      
      
    </div>
  )
}

export default IncomeCount
