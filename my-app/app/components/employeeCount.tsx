'use client'
import React, { useState,useEffect } from 'react'
import {toast} from 'react-hot-toast'

const EmployeeCount = () => {
    const [employeeCount,setEmployeeCount]=useState(0);

    useEffect(() => {
        const fetchEmployeeCount = async () => {
          try {
            const response = await fetch('/api/employees'); // Replace with your actual API endpoint
            if (response.ok) {
              const employees = await response.json();
              setEmployeeCount(employees.length); // Assuming the API returns an array of employees
            } else {
              setEmployeeCount(100)
            }
          } catch (error) {
            toast.error('Error fetching employees:', error);
          }
        };
    
        fetchEmployeeCount();
      }, []);


  return (
    <div className="  p-6">
      <div className="bg-gray-100 p-4 rounded-lg shadow-md w-48">
        <h2 className="text-xl font-semibold">Total Employees</h2>
        <p className="text-3xl font-bold">{employeeCount}</p>
      </div>
    </div>
  )
}

export default EmployeeCount
