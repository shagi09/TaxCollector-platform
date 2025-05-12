'use client';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const IncomePage = () => {
  const [incomeEntries, setIncomeEntries] = useState([]);
  const [amount, setAmount] = useState('');
  const [source, setSource] = useState('');
  const [paidDate, setPaidDate] = useState('');
  const [receipt, setReceipt] = useState(null);

  // Fetch all income records
  useEffect(() => {
    const fetchIncomes = async () => {
      try {
        const response = await fetch('http://localhost:7000/api/incomes');
        if (response.ok) {
          const data = await response.json();
          setIncomeEntries(data.incomes);
        } else {
          toast.error('Failed to fetch income records.');
        }
      } catch (error) {
        console.error('Error fetching incomes:', error);
        toast.error('An error occurred while fetching income records.');
      }
    };

    fetchIncomes();
  }, []);

  // Handle form submission to add a new income
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('amount', amount);
    formData.append('source', source);
    formData.append('paidDate', paidDate);
    if (receipt) {
      formData.append('receipt', receipt);
    }

    try {
      const response = await fetch('http://localhost:7000/api/incomes', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const newIncome = await response.json();
        setIncomeEntries([newIncome.income, ...incomeEntries]); // Add new income to the list
        toast.success('Income added successfully!');
        resetForm();
      } else {
        toast.error('Failed to add income.');
      }
    } catch (error) {
      console.error('Error adding income:', error);
      toast.error('An error occurred while adding income.');
    }
  };

  const resetForm = () => {
    setAmount('');
    setSource('');
    setPaidDate('');
    setReceipt(null);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Income Management</h1>

      {/* Add Income Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border rounded-lg p-2"
            required
          />
          <input
            type="text"
            placeholder="Source"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="border rounded-lg p-2"
            required
          />
          <input
            type="date"
            value={paidDate}
            onChange={(e) => setPaidDate(e.target.value)}
            className="border rounded-lg p-2"
          />
          <input
            type="file"
            onChange={(e) => setReceipt(e.target.files[0])}
            className="border rounded-lg p-2"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white rounded-lg px-4 py-2 mt-4"
        >
          Add Income
        </button>
      </form>

      {/* Income Records Table */}
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-800 text-white">
            <th className="py-2">Amount</th>
            <th className="py-2">Source</th>
            <th className="py-2">Received Date</th>
            <th className="py-2">Receipt</th>
          </tr>
        </thead>
        <tbody>
          {incomeEntries.map((entry) => (
            <tr key={entry._id} className="border-b">
              <td className="py-2">${entry.amount.toFixed(2)}</td>
              <td className="py-2">{entry.source}</td>
              <td className="py-2">
                {new Date(entry.receivedDate).toLocaleDateString()}
              </td>
              <td className="py-2">
                {entry.receiptUrl && (
                  <a
                    href={entry.receiptUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500"
                  >
                    View Receipt
                  </a>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default IncomePage;