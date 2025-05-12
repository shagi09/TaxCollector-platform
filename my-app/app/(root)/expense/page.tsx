'use client';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const ExpensePage = () => {
  const [expenses, setExpenses] = useState([]);
  const [type, setType] = useState('');
  const [amount, setAmount] = useState('');
  const [paidDate, setPaidDate] = useState('');
  const [notes, setNotes] = useState('');
  const [receipt, setReceipt] = useState(null);

  // Fetch all expenses
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await fetch('http://localhost:7000/api/expenses');
        if (response.ok) {
          const data = await response.json();
          setExpenses(data);
        } else {
          toast.error('Failed to fetch expenses.');
        }
      } catch (error) {
        console.error('Error fetching expenses:', error);
        toast.error('An error occurred while fetching expenses.');
      }
    };

    fetchExpenses();
  }, []);

  // Handle form submission to create a new expense
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('type', type);
    formData.append('amount', amount);
    formData.append('paidDate', paidDate);
    formData.append('notes', notes);
    if (receipt) {
      formData.append('receipt', receipt);
    }

    try {
      const response = await fetch('http://localhost:7000/api/expenses', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const newExpense = await response.json();
        setExpenses([newExpense, ...expenses]); // Add new expense to the list
        toast.success('Expense added successfully!');
        resetForm();
      } else {
        toast.error('Failed to add expense.');
      }
    } catch (error) {
      console.error('Error adding expense:', error);
      toast.error('An error occurred while adding expense.');
    }
  };

  const resetForm = () => {
    setType('');
    setAmount('');
    setPaidDate('');
    setNotes('');
    setReceipt(null);
  };

  // Handle deleting an expense
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:7000/api/expenses/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setExpenses(expenses.filter((expense) => expense._id !== id));
        toast.success('Expense deleted successfully!');
      } else {
        toast.error('Failed to delete expense.');
      }
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast.error('An error occurred while deleting expense.');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Expense </h1>

      {/* Add Expense Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="border rounded-lg p-2"
            required
          />
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border rounded-lg p-2"
            required
          />
          <input
            type="date"
            value={paidDate}
            onChange={(e) => setPaidDate(e.target.value)}
            className="border rounded-lg p-2"
          />
          <textarea
            placeholder="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
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
          Add Expense
        </button>
      </form>

      {/* Expense Records Table */}
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-800 text-white">
            <th className="py-2">Type</th>
            <th className="py-2">Amount</th>
            <th className="py-2">Paid Date</th>
            <th className="py-2">Notes</th>
            <th className="py-2">Receipt</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense._id} className="border-b">
              <td className="py-2">{expense.type}</td>
              <td className="py-2">${expense.amount}</td>
              <td className="py-2">
                {new Date(expense.paidDate).toLocaleDateString()}
              </td>
              <td className="py-2">{expense.notes}</td>
              <td className="py-2">
                {expense.receiptUrl && (
                  <a
                    href={expense.receiptUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500"
                  >
                    View Receipt
                  </a>
                )}
              </td>
              <td className="py-2">
                <button
                  onClick={() => handleDelete(expense._id)}
                  className="bg-red-500 text-white rounded-lg px-2 py-1"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExpensePage;