'use client';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import {useRouter} from 'next/navigation'

const CalculatedTaxPage = () => {
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [calculatedTax, setCalculatedTax] = useState(0);

  const router = useRouter()

  useEffect(() => {
    const fetchCalculatedTax = async () => {
      try {
        const response = await fetch('/api/calculatedtax');
        if (response.ok) {
          const data = await response.json();
          setTotalIncome(data.totalIncome);
          setTotalExpense(data.totalExpense);
          setCalculatedTax(data.calculatedTax);
        } else {
          toast.error('Failed to fetch calculated tax.');
        }
      } catch (error) {
        console.error('Error fetching calculated tax:', error);
        toast.error('An error occurred while fetching calculated tax.');
      }
    };

    fetchCalculatedTax();
  }, []);

  const handleClick = ()=>{
    router.push('/payments')
  }

  return (
    <div className="container mx-auto p-6">
      <motion.h1
        className="text-4xl font-bold mb-6 text-center text-black"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Calculated Tax
      </motion.h1>

      <motion.div
        className="bg-gradient-to-r from-gray-100 to-gray-200 p-6 rounded-lg shadow-lg mb-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Summary</h2>
        <motion.p
          className="text-lg mb-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <span className="font-bold text-gray-600">Total Income:</span> ${totalIncome.toFixed(2)}
        </motion.p>
        <motion.p
          className="text-lg mb-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <span className="font-bold text-gray-600">Total Expense:</span> ${totalExpense.toFixed(2)}
        </motion.p>
        <motion.p
          className="text-lg font-semibold"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <span className="font-bold text-gray-600">Tax Owed:</span> ${calculatedTax.toFixed(2)}
        </motion.p>
      </motion.div>

      <motion.div
        className="flex justify-center mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <button
          className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform transform hover:scale-105"
          onClick={() => handleClick()}
        >
          Proceed to Payment
        </button>
      </motion.div>
    </div>
  );
};

export default CalculatedTaxPage;