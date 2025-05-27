'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';

const YEARS = [2021, 2022, 2023, 2024, 2025];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Helper to extract number from MongoDB Decimal128 or return value as is
function getDecimal(val: any) {
  if (val && typeof val === 'object' && '$numberDecimal' in val) {
    return Number(val.$numberDecimal);
  }
  return val ?? 0;
}

export default function TaxpayerDetailPage() {
  const { id } = useParams(); // taxpayer id from route
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState('');
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [payrollAudit, setPayrollAudit] = useState([]);
  const [vatAudit, setVatAudit] = useState([]);
  const [profitTaxAudit, setProfitTaxAudit] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch incomes and expenses by year or by year and month
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    const token = localStorage.getItem('official_token');
    const headers = { Authorization: `Bearer ${token}` };
    console.log(id);

    const fetchData = async () => {
      try {
        // Incomes
        let incomeUrl = month
          ? `http://localhost:7000/api/auditor/income/${id}/${year}/${month}`
          : `http://localhost:7000/api/auditor/income/${id}/${year}`;
        const incomesRes = await axios.get(incomeUrl, { headers });
        setIncomes(incomesRes.data.incomes || []);

        // Expenses
        let expenseUrl = month
          ? `http://localhost:7000/api/auditor/expense/${id}/${year}/${month}`
          : `http://localhost:7000/api/auditor/expense/${id}/${year}`;
        const expensesRes = await axios.get(expenseUrl, { headers });
        console.log(expensesRes);
        setExpenses(expensesRes.data.expenses || []);

        // Payroll Audit
        if (month) {
          const payrollRes = await axios.get(
            `http://localhost:7000/api/auditor/audit/payroll/${id}/${year}/${month}`,
            { headers }
          );
          console.log(payrollRes)
          setPayrollAudit(payrollRes.data.records || []);
        } else {
          setPayrollAudit([]);
        }

        // VAT Audit
        if (month) {
          const vatRes = await axios.get(
            `http://localhost:7000/api/auditor/audit/vat/${id}/${year}/${month}`,
            { headers }
          );
          setVatAudit(vatRes.data.records || []);
        } else {
          setVatAudit([]);
        }

        // Profit Tax Audit (by year only)
        if (!month) {
          const profitRes = await axios.get(
            `http://localhost:7000/api/auditor/audit/profit/${id}/${year}`,
            { headers }
          );
          setProfitTaxAudit(profitRes.data.records || []);
        } else {
          setProfitTaxAudit([]);
        }
      } catch (err) {
        setIncomes([]);
        setExpenses([]);
        setPayrollAudit([]);
        setVatAudit([]);
        setProfitTaxAudit([]);
      }
      setLoading(false);
    };
    fetchData();
  }, [id, year, month]);

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Taxpayer Details</h1>
      <div className="flex gap-4 mb-6">
        <div>
          <label className="font-semibold mr-2">Year:</label>
          <select
            value={year}
            onChange={e => setYear(Number(e.target.value))}
            className="border rounded px-2 py-1"
          >
            {YEARS.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="font-semibold mr-2">Month:</label>
          <select
            value={month}
            onChange={e => setMonth(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="">All</option>
            {MONTHS.map((m, idx) => (
              <option key={m} value={idx + 1}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div>Loading data...</div>
      ) : (
        <>
          <h2 className="text-xl font-semibold mt-6 mb-2">Incomes</h2>
          <table className="min-w-full bg-white shadow rounded mb-6">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-4">Source</th>
                <th className="py-2 px-4">Amount</th>
                <th className="py-2 px-4">VAT</th>
                <th className="py-2 px-4">Month</th>
              </tr>
            </thead>
            <tbody>
              {incomes.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-gray-500">No incomes found.</td>
                </tr>
              ) : (
                incomes.map((inc, idx) => (
                  <tr key={idx} className="border-b">
                    <td className="py-2 px-4">{inc.source || '-'}</td>
                    <td className="py-2 px-4">{getDecimal(inc.amount)}</td>
                    <td className="py-2 px-4">{getDecimal(inc.vat)}</td>
                    <td className="py-2 px-4">{MONTHS[(inc.month || 1) - 1]}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <h2 className="text-xl font-semibold mt-6 mb-2">Expenses</h2>
          <table className="min-w-full bg-white shadow rounded mb-6">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-4">Type</th>
                <th className="py-2 px-4">Amount</th>
                <th className="py-2 px-4">VAT</th>
                <th className="py-2 px-4">Paid Date</th>
                <th className="py-2 px-4">Receipt</th>
                <th className="py-2 px-4">Notes</th>
              </tr>
            </thead>
            <tbody>
              {expenses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-500">No expenses found.</td>
                </tr>
              ) : (
                expenses.map((exp, idx) => (
                  <tr key={exp._id || idx} className="border-b">
                    <td className="py-2 px-4">{exp.type || '-'}</td>
                    <td className="py-2 px-4">{getDecimal(exp.amount)}</td>
                    <td className="py-2 px-4">{getDecimal(exp.vat)}</td>
                    <td className="py-2 px-4">
                      {exp.paidDate ? new Date(exp.paidDate).toLocaleDateString() : '-'}
                    </td>
                    <td className="py-2 px-4">
                      {exp.receiptUrl ? (
                        <a
                          href={`http://localhost:7000${exp.receiptUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          View
                        </a>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="py-2 px-4">{exp.notes || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {month && (
            <>
              <h2 className="text-xl font-semibold mt-6 mb-2">Payroll Audit Records</h2>
              <table className="min-w-full bg-white shadow rounded mb-6">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="py-2 px-4">Amount</th>
                    <th className="py-2 px-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {payrollAudit.length === 0 ? (
                    <tr>
                      <td colSpan={2} className="text-center py-4 text-gray-500">No payroll audit records.</td>
                    </tr>
                  ) : (
                    payrollAudit.map((rec, idx) => (
                      <tr key={idx} className="border-b">
                        <td className="py-2 px-4">{getDecimal(rec.salary)}</td>
                        <td className="py-2 px-4">{rec.date ? new Date(rec.date).toLocaleDateString() : '-'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              <h2 className="text-xl font-semibold mt-6 mb-2">VAT Audit Records</h2>
              <table className="min-w-full bg-white shadow rounded mb-6">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="py-2 px-4">Amount</th>
                    <th className="py-2 px-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {vatAudit.length === 0 ? (
                    <tr>
                      <td colSpan={2} className="text-center py-4 text-gray-500">No VAT audit records.</td>
                    </tr>
                  ) : (
                    vatAudit.map((rec, idx) => (
                      <tr key={idx} className="border-b">
                        <td className="py-2 px-4">{getDecimal(rec.amount)}</td>
                        <td className="py-2 px-4">{rec.date ? new Date(rec.date).toLocaleDateString() : '-'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </>
          )}

          {!month && (
            <>
              <h2 className="text-xl font-semibold mt-6 mb-2">Profit Tax Audit Records</h2>
              <table className="min-w-full bg-white shadow rounded mb-6">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="py-2 px-4">Amount</th>
                    <th className="py-2 px-4">Year</th>
                  </tr>
                </thead>
                <tbody>
                  {profitTaxAudit.length === 0 ? (
                    <tr>
                      <td colSpan={2} className="text-center py-4 text-gray-500">No profit tax audit records.</td>
                    </tr>
                  ) : (
                    profitTaxAudit.map((rec, idx) => (
                      <tr key={idx} className="border-b">
                        <td className="py-2 px-4">{getDecimal(rec.amount)}</td>
                        <td className="py-2 px-4">{rec.year}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </>
          )}
        </>
      )}
    </div>
  );
}