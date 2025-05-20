'use client';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const IncomePage = () => {
  const [Incomes, setIncomes] = useState([]); // Initialize as an empty array
  const [amount, setAmount] = useState('');
  const [source, setSource] = useState('');
  const [paidDate, setPaidDate] = useState('');
  const [receipt, setReceipt] = useState(null);

  const router =useRouter()

  // Fetch all Incomes
  useEffect(() => {
    const fetchIncomes = async () => {
      try {
        const response = await fetch('http://localhost:7000/api/incomes');
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data.incomes)) {
            setIncomes(data.incomes); // Ensure data is an array
          } else {
            console.error('Invalid API response:', data);
            setIncomes([]); // Default to an empty array if response is invalid
          }
        } else {
          toast.error('Failed to fetch Incomes.');
        }
      } catch (error) {
        console.error('Error fetching Incomes:', error);
        toast.error('An error occurred while fetching Incomes.');
      }
    };

    fetchIncomes();
  }, []);

  // Handle form submission to create a new Income
  const handleSubmit = async (e) => {
    e.preventDefault();

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
        body: formData,
      });

      if (response.ok) {
        const newIncome = await response.json();
        setIncomes([newIncome, ...Incomes]); // Add new Income to the list
        toast.success('Income added successfully!');
        resetForm();
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

  // Handle deleting an Income
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:7000/api/incomes/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setIncomes(Incomes.filter((Income) => Income._id !== id));
        toast.success('Income deleted successfully!');
      } else {
        toast.error('Failed to delete Income.');
      }
    } catch (error) {
      console.error('Error deleting Income:', error);
      toast.error('An error occurred while deleting Income.');
    }
  };

  const handleClick = ()=>{
    router.push('/expense')

  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Income</h1>

      {/* Add Income Form */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Source"
            value={source}
            onChange={(e) => setSource(e.target.value)}
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
            <th className="py-2 px-4">Source</th>
            <th className="py-2 px-4 ">Amount</th>
            <th className="py-2 px-4">Paid Date</th>
            <th className="py-2 px-4">Receipt</th>
            <th className="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {(Array.isArray(Incomes) ? Incomes : []).map((Income,index) => (
            <tr key={Income._id || index} className="border-b ">
              <td className="py-2 px-4">{Income.source}</td>
              <td className="py-2 px-4">${Income.amount}</td>
              <td className="py-2 px-4">
                {new Date(Income.paidDate).toLocaleDateString()}
              </td>
              <td className="py-2 px-4">
                {Income.receiptUrl && (
                  <a
                    href={Income.receiptUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500"
                  >
                    View Receipt
                  </a>
                )}
              </td>
              <td className="py-2 px-4">
                <button
                  onClick={() => handleDelete(Income._id)}
                  className="bg-red-500 text-white rounded-lg px-2 py-1"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button 
        onClick={()=>handleClick()}
        className="bg-green-500 text-white rounded-lg px-2 py-1 mt-10 ml-260">go to expense</button>

      </div>
    </div>
  );
};

export default IncomePage;