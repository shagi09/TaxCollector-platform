'use client';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { PlusIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

const getYear = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).getFullYear();
};

const AVAILABLE_YEARS = [2021, 2022, 2023, 2024, 2025];

const IncomePage = () => {
  const [incomes, setIncomes] = useState([]);
  const [source, setSource] = useState('');
  const [amount, setAmount] = useState('');
  const [paidDate, setPaidDate] = useState('');
  const [receipt, setReceipt] = useState(null);
  const [selectedYear, setSelectedYear] = useState('');

  const router=useRouter()

  const fetchIncomes = async (year) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:7000/api/incomes/${year}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setIncomes(Array.isArray(data.incomes) ? data.incomes : []);
        console.log(data.incomes);
      } else {
        toast.error('Failed to fetch Incomes.');
      }
    } catch (error) {
      console.error('Error fetching Incomes:', error);
      toast.error('An error occurred while fetching Incomes.');
    }
  };

  // Fetch Incomes for selected year
  useEffect(() => {
    if (selectedYear) {
      fetchIncomes(selectedYear);
    }
  }, [selectedYear]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const formData = new FormData();
    formData.append('source', source);
    formData.append('amount', amount);
    formData.append('paidDate', paidDate);
    if (receipt) {
      formData.append('receipt', receipt);
    }

    try {
      const response = await fetch('http://localhost:7000/api/incomes', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const newIncome = await response.json();
        // If the new income is in the selected year, add it to the list
        if (getYear(newIncome.paidDate).toString() === selectedYear.toString()) {
          setIncomes([newIncome, ...incomes]);
        }
        toast.success('Income added successfully!');
        resetForm();
        fetchIncomes(selectedYear); // Refresh list after adding
      } else {
        toast.error('Failed to add Income.');
      }
    } catch (error) {
      console.error('Error adding Income:', error);
      toast.error('An error occurred while adding Income.');
    }
  };

  const resetForm = () => {
    setSource('');
    setAmount('');
    setPaidDate('');
    setReceipt(null);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:7000/api/incomes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setIncomes(incomes.filter((income) => income._id !== id));
        toast.success('Income deleted successfully!');
        fetchIncomes(selectedYear); // Refresh list after deletion
      } else {
        toast.error('Failed to delete Income.');
      }
    } catch (error) {
      console.error('Error deleting Income:', error);
      toast.error('An error occurred while deleting Income.');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Income</h1>

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

      {/* Add Income Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
<select
  value={source}
  onChange={(e) => setSource(e.target.value)}
  className="border rounded-lg p-2"
  required
>
  <option value="">Select Income Source</option>

  <optgroup label="Sales Revenue">
    <option value="Product Sales">Product Sales</option>
    <option value="Service Revenue">Service Revenue</option>
  </optgroup>

  <optgroup label="Recurring Revenue">
    <option value="Subscription Fees">Subscription Fees</option>
    <option value="Membership Dues">Membership Dues</option>
  </optgroup>

  <optgroup label="Investment Income">
    <option value="Interest Income">Interest Income</option>
    <option value="Dividends">Dividends</option>
  </optgroup>

  <optgroup label="Rental Income">
    <option value="Property Rental">Property Rental</option>
  </optgroup>

  <optgroup label="Consulting Revenue">
    <option value="Consulting Fees">Consulting Fees</option>
  </optgroup>

  <optgroup label="Grants and Donations">
    <option value="Government Grants">Government Grants</option>
    <option value="Charitable Donations">Charitable Donations</option>
  </optgroup>

  <optgroup label="Royalties">
    <option value="Intellectual Property">Intellectual Property</option>
  </optgroup>

  <optgroup label="Other Income">
    <option value="Gains from Asset Sales">Gains from Asset Sales</option>
    <option value="Miscellaneous Income">Miscellaneous Income</option>
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
          <input
            type="file"
            onChange={(e) => setReceipt(e.target.files[0])}
            className="border rounded-lg p-2"
          />
        </div>
        <button
          type="submit"
          className="bg-black flex items-center justify-center gap-2 hover:bg-gray-800 text-white rounded-lg px-4 py-2 mt-4"
        >
          <PlusIcon className='w-4 h-4 mr-2'/>
          Add Income
        </button>
      </form>

      {/* Income Records Table */}
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-800 text-white">
            <th className="py-2">Source</th>
            <th className="py-2">Amount</th>
            <th className="py-2">Paid Date</th>
            <th className="py-2">Receipt</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {incomes.map((income) => (
            <tr key={income._id} className="border-b">
              <td className="py-2">{income.source}</td>
              <td className="py-2">${income.amount}</td>
              <td className="py-2">
                {new Date(income.paidDate).toLocaleDateString()}
              </td>
<td className="py-2">
                {income.receiptUrl && (
                  <button
      onClick={() => router.push(`/View/${income.filename}`)}
      className="text-blue-500 underline cursor-pointer"
    >
      View Receipt
    </button>
                )}
              </td>
              <td className="py-2">
                <button
                  onClick={() => handleDelete(income._id)}
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
        onClick={()=>{router.push('/payments')}}
        className="bg-black hover:bg-gray-800 text-white rounded-lg px-4 mr-2 py-2 mt-4"
      >
        Proceed
      </button>
    </div>
  );
};

export default IncomePage;