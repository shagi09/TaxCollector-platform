'use client';
import React, { useEffect, useState } from 'react';
import {useRouter} from 'next/navigation'
import {DollarSignIcon} from 'lucide-react'

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];
const YEARS = [2021, 2022, 2023, 2024, 2025];

export default function VATSummaryPage() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [vatSummary, setVatSummary] = useState([]);
  const [loading, setLoading] = useState(false);

  const router=useRouter()

  useEffect(() => {
    const fetchVAT = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:7000/api/vat/${selectedYear}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          console.log(data)
          setVatSummary(data.summary || []);
        } else {
          setVatSummary([]);
        }
      } catch {
        setVatSummary([]);
      }
      setLoading(false);
    };
    fetchVAT();
  }, [selectedYear]);

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">VAT Summary by Month</h1>
      <div className="mb-6 flex items-center gap-2">
        <label className="font-semibold">Year:</label>
        <select
          value={selectedYear}
          onChange={e => setSelectedYear(Number(e.target.value))}
          className="border rounded px-3 py-2"
        >
          {YEARS.map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>
      {loading ? (
        <div className="text-center py-10">Loading VAT summary...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded-lg">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="py-2 px-4">Month</th>
                <th className="py-2 px-4">Income VAT</th>
                <th className="py-2 px-4">Expense VAT</th>
                <th className="py-2 px-4">Net VAT</th>
              </tr>
            </thead>
            <tbody>
  {vatSummary.length === 0 ? (
    <tr>
      <td colSpan={5} className="text-center py-4 text-gray-500">
        No VAT data found for {selectedYear}.
      </td>
    </tr>
  ) : (
    vatSummary.map((row, idx) => (
      <tr key={row.month} className="border-b">
        <td className="py-2 px-4">{MONTHS[row.month - 1]}</td>
        <td className="py-2 px-4 text-green-700 font-semibold">
          {row.incomeVAT.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </td>
        <td className="py-2 px-4 text-red-700 font-semibold">
          {row.expenseVAT.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </td>
        <td className={`py-2 px-4 font-bold ${row.netVAT >= 0 ? 'text-blue-700' : 'text-red-700'}`}>
          {row.netVAT.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </td>
        <td className="py-2 px-4">
          <button
            type="button"
            onClick={() => {
              localStorage.setItem('netVAT', row.netVAT);
              localStorage.setItem('vatMonth', row.month);
              localStorage.setItem('vatYear', selectedYear);
              localStorage.setItem('vatId', row.vatId)
              router.push('/payments');
            }}
            className="bg-black hover:bg-gray-500 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <DollarSignIcon className="w-4 h-4" />
            Pay
          </button>
        </td>
      </tr>
    ))
  )}
</tbody>
          </table>
        </div>
      )}
      
    </div>
  );
}