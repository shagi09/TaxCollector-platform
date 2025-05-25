'use client';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { BarChart2, DollarSign, TrendingUp, ArrowDownCircle, DollarSignIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

const AVAILABLE_YEARS = [2021, 2022, 2023, 2024, 2025];

const ProfitTaxPage = () => {
  const [loading, setLoading] = useState(true);
  const [taxData, setTaxData] = useState({
    totalIncome: 0,
    totalExpense: 0,
    profit: 0,
    tax: 0,
  });
  const [selectedYear, setSelectedYear] = useState(AVAILABLE_YEARS[AVAILABLE_YEARS.length - 1].toString());
  const router = useRouter();

  useEffect(() => {
    if (!selectedYear) return;
    const fetchProfitTax = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:7000/api/profitTax/${selectedYear}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setTaxData(data);
        } else {
          toast.error('Failed to fetch profit tax data.');
        }
      } catch (error) {
        toast.error('An error occurred while fetching profit tax.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfitTax();
  }, [selectedYear]);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 text-center text-black flex items-center justify-center gap-2">
        <BarChart2 className="w-8 h-8" /> Profit Tax Summary
      </h1>
      <div className="flex justify-center mb-8">
        <label className="mr-2 font-semibold">Select Year:</label>
        <select
          value={selectedYear}
          onChange={e => setSelectedYear(e.target.value)}
          className="border rounded-lg p-2"
        >
          {AVAILABLE_YEARS.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center">
            <DollarSign className="w-10 h-10 text-green-500 mb-2" />
            <div className="text-lg font-semibold text-gray-700">Total Income</div>
            <div className="text-2xl font-bold text-green-700 mt-2">
              ${taxData.totalIncome.toLocaleString()}
            </div>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center">
            <ArrowDownCircle className="w-10 h-10 text-red-500 mb-2" />
            <div className="text-lg font-semibold text-gray-700">Total Expenses</div>
            <div className="text-2xl font-bold text-red-700 mt-2">
              ${taxData.totalExpense.toLocaleString()}
            </div>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center">
            <TrendingUp className="w-10 h-10 text-blue-500 mb-2" />
            <div className="text-lg font-semibold text-gray-700">Profit</div>
            <div className={`text-2xl font-bold mt-2 ${taxData.profit >= 0 ? 'text-blue-700' : 'text-red-700'}`}>
              ${taxData.profit.toLocaleString()}
            </div>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center">
            <BarChart2 className="w-10 h-10 text-purple-500 mb-2" />
            <div className="text-lg font-semibold text-gray-700">Profit Tax</div>
            <div className="text-2xl font-bold text-purple-700 mt-2">
              ${taxData.tax.toLocaleString()}
            </div>
          </div>
        </div>
      )}
      <div className='flex justify-center'>
        <button
          type="button"
          onClick={() => {
            localStorage.setItem('profitTax', taxData.tax);
            router.push('/payments');
          }}
          className="bg-black flex gap-4 justify-center items-center hover:bg-gray-800 text-white rounded-lg px-4 mr-2 py-4 mt-8 w-96"
        >
          <DollarSignIcon className='w-4 h-4' />
          proceed to payment
        </button>
      </div>
    </div>
  );
};

export default ProfitTaxPage;