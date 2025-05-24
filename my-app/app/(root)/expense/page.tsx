'use client';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import {PlusIcon} from 'lucide-react'

const getYear = (dateString: string) => {
  if (!dateString) return '';
  return new Date(dateString).getFullYear();
};

const AVAILABLE_YEARS = [2021, 2022, 2023, 2024, 2025];

const ExpensePage = () => {
  const [expenses, setExpenses] = useState([]);
  const [type, setType] = useState('');
  const [amount, setAmount] = useState('');
  const [paidDate, setPaidDate] = useState('');
  const [notes, setNotes] = useState('');
  const [receipt, setReceipt] = useState(null);
  const [selectedYear, setSelectedYear] = useState('');


      const fetchExpenses = async (year) => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(
          `http://localhost:7000/api/expenses/${selectedYear}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setExpenses(Array.isArray(data.expenses) ? data.expenses : []);
        } else {
          toast.error('Failed to fetch expenses.');
        }
      } catch (error) {
        console.error('Error fetching expenses:', error);
        toast.error('An error occurred while fetching expenses.');
      }
    };

  // Fetch expenses for selected year
  useEffect(() => {
    if (!selectedYear) return;
    fetchExpenses(selectedYear)

  }, [selectedYear]);

  // Handle form submission to create a new expense
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

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
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const newExpense = await response.json();
        // If the new expense is in the selected year, add it to the list
        if (getYear(newExpense.paidDate).toString() === selectedYear.toString()) {
          setExpenses([newExpense, ...expenses]);
        }
        toast.success('Expense added successfully!');
        resetForm();
        fetchExpenses(selectedYear)
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
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:7000/api/expenses/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setExpenses(expenses.filter((expense) => expense._id !== id));
        toast.success('Expense deleted successfully!');
        fetchExpenses(selectedYear)
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
      <h1 className="text-2xl font-bold mb-4">Expense</h1>

      {/* Year Selector */}
      <div className="mb-4">
        <label className="mr-2 font-semibold">Select Year:</label>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          className="border rounded-lg p-2"
        >
          <option value="">Select year</option>
          {AVAILABLE_YEARS.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* Add Expense Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="border rounded-lg p-2"
            required
          >
            <option value="">Select Category</option>
            <optgroup label="Operating Expenses">
              <option value="Rent or Lease">Rent or Lease</option>
              <option value="Utilities">Utilities</option>
              <option value="Salaries and Wages">Salaries and Wages</option>
              <option value="Office Supplies">Office Supplies</option>
            </optgroup>
            <optgroup label="Cost of Goods Sold (COGS)">
              <option value="Raw Materials">Raw Materials</option>
              <option value="Manufacturing Costs">Manufacturing Costs</option>
            </optgroup>
            <optgroup label="Marketing and Advertising">
              <option value="Promotional Materials">Promotional Materials</option>
              <option value="Marketing Campaigns">Marketing Campaigns</option>
            </optgroup>
            <optgroup label="Depreciation and Amortization">
              <option value="Depreciation">Depreciation</option>
              <option value="Amortization">Amortization</option>
            </optgroup>
            <optgroup label="Research and Development (R&D)">
              <option value="Product Development">Product Development</option>
            </optgroup>
            <optgroup label="Administrative Expenses">
              <option value="Legal and Professional Fees">Legal and Professional Fees</option>
              <option value="Insurance">Insurance</option>
            </optgroup>
            <optgroup label="Travel and Meals">
              <option value="Travel Expenses">Travel Expenses</option>
            </optgroup>
            <optgroup label="Interest Expense">
              <option value="Loan Interest">Loan Interest</option>
            </optgroup>
          </select>

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
          className="bg-black flex items-center justify-center a gap-2 hover:bg-gray-800 text-white rounded-lg px-4 py-2 mt-4"
        ><PlusIcon className=' w-4 h-4 mr-2'/>
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
              <button
          type="button"
          className="bg-black hover:bg-gray-800 text-white rounded-lg px-4 mr-2 py-2 mt-4"
        >
          proceed
        </button>
    </div>
  );
};

export default ExpensePage;