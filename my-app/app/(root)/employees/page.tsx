'use client';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { PlusIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

const AVAILABLE_YEARS = [2021, 2022, 2023, 2024, 2025];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const PayrollPage = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [records, setRecords] = useState([]);
  const [totalSalary, setTotalSalary] = useState(0);
  const [totalTax, setTotalTax] = useState(0);
  const [dueDate, setDueDate] = useState('');
  const [taxStatus, setTaxStatus] = useState('');
  const [penalty, setPenalty] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Add Employee Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    employeeName: '',
    description: '',
    salary: '',
  });

  // Fetch payroll summary for selected year and month
  const fetchPayroll = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://localhost:7000/api/payroll/${year}/${month}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        console.log(data)
        setRecords(data.records || []);
        setTotalSalary(data.totalSalary || 0);
        setTotalTax(data.totalTax || 0);
        setDueDate(data.dueDate || '');
        setTaxStatus(data.taxStatus || '');
        setPenalty(data.penalty || 0);

          if (data.payrollMonthId) {
    localStorage.setItem('payrollMonthId', data.payrollMonthId);
  }
      } else {
        setRecords([]);
        setTotalSalary(0);
        setTotalTax(0);
        setDueDate('');
        setTaxStatus('');
        setPenalty(0);
        toast.error('No payroll data found for this period.');
      }
    } catch (error) {
      setRecords([]);
      setTotalSalary(0);
      setTotalTax(0);
      setDueDate('');
      setTaxStatus('');
      setPenalty(0);
      toast.error('Failed to fetch payroll summary.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayroll();
  }, [year, month]);

  // Add new payroll record
  const handleAddEmployee = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:7000/api/payroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newEmployee),
      });

      if (response.ok) {
        toast.success('Payroll record added!');
        setShowAddForm(false);
        setNewEmployee({ employeeName: '', description: '', salary: '' });
        fetchPayroll();
      } else {
        toast.error('Failed to add payroll record.');
      }
    } catch (error) {
      toast.error('An error occurred while adding payroll record.');
    }
  };

  // Delete payroll record
  const handleDelete = async (recordId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:7000/api/payroll/${recordId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        toast.success('Payroll record deleted!');
        setRecords(records.filter((r) => r._id !== recordId));
      } else {
        toast.error('Failed to delete payroll record.');
      }
    } catch (error) {
      toast.error('An error occurred while deleting payroll record.');
    }
  };

  // Load previous month records
  const handleLoadPreviousMonth = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:7000/api/payroll', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        toast.success('Previous month records loaded!');
        fetchPayroll();
      } else {
        toast.error('Failed to load previous month records.');
      }
    } catch (error) {
      toast.error('An error occurred while loading previous month records.');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-black">Payroll Management</h1>
      <div className="flex flex-wrap gap-4 mb-6">
        <div>
          <label className="font-semibold mr-2">Year:</label>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="border rounded-lg p-2"
          >
            {AVAILABLE_YEARS.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="font-semibold mr-2">Month:</label>
          <select
            value={month}
            onChange={(e) => {
              setMonth(Number(e.target.value));
              localStorage.setItem('payrollMonth', e.target.value);
            }}
            className="border rounded-lg p-2"
          >
            {MONTHS.map((m, idx) => (
              <option key={m} value={idx + 1}>{m}</option>
            ))}
          </select>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-black flex items-center justify-center gap-2 hover:bg-gray-800 text-white rounded-lg px-4 py-2 "
        >
          <PlusIcon className='w-4 h-4 mr-2' />
          Add Employee Payroll
        </button>
        <button
          onClick={handleLoadPreviousMonth}
          className="bg-green-500 text-white rounded-lg px-4 py-2"
        >
          Load Previous Month Records
        </button>
      </div>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white shadow rounded-lg p-4">
          <div className="text-gray-500">Total Salary</div>
          <div className="text-2xl font-bold text-blue-700">${totalSalary.toLocaleString()}</div>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <div className="text-gray-500">Total Payroll Tax</div>
          <div className="text-2xl font-bold text-purple-700">${totalTax.toLocaleString()}</div>
        </div>
        <div className="bg-white shadow rounded-lg p-4">
          <div className="text-gray-500">Tax Due Date</div>
          <div className="text-2xl font-bold text-green-700">{dueDate}</div>
        </div>
      </div>
      <div className="mb-4">
        <span className="font-semibold">Tax Status:</span> {taxStatus}
        {penalty > 0 && (
          <span className="ml-4 text-red-600 font-semibold">Penalty: ${penalty.toLocaleString()}</span>
        )}
      </div>

      {loading ? (
        <div className="text-center py-10">Loading payroll records...</div>
      ) : (
        <table className="min-w-full bg-white overflow-hidden mb-8">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="py-2">Name</th>
              <th className="py-2">Salary</th>
              <th className="py-2">Tax</th>
              <th className="py-2">Description</th>
              <th className="py-2">Created At</th>
              <th className="py-2">Actions</th>
              <th className="py-2">Payment</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-4 text-gray-500">
                  No payroll records for this period.
                </td>
              </tr>
            ) : (
              records.map((emp) => (
                <tr key={emp._id} className="border-b">
                  <td className="py-2">{emp.employeeName}</td>
                  <td className="py-2">
                    ${emp.salary?.$numberDecimal ? Number(emp.salary.$numberDecimal).toLocaleString() : emp.salary}
                  </td>
                  <td className="py-2">
                    ${emp.tax?.$numberDecimal ? Number(emp.tax.$numberDecimal).toLocaleString() : emp.tax}
                  </td>
                  <td className="py-2">{emp.description}</td>
                  <td className="py-2">{emp.createdAt ? new Date(emp.createdAt).toLocaleDateString() : ''}</td>
                  <td className="py-2">
                    <button
                      onClick={() => handleDelete(emp._id)}
                      className="text-red-500 ml-2"
                    >
                      Delete
                    </button>
                  </td>
                  <td className="py-2">
                    <button
                      onClick={() => {
                        localStorage.setItem('payrollTax', emp.tax?.$numberDecimal ? emp.tax.$numberDecimal : emp.tax);
                        localStorage.setItem('payrollMonth', month.toString());
                        localStorage.setItem('payrollYear', year.toString());
                        router.push('/payments');
                      }}
                      className="bg-black flex items-center justify-center hover:bg-gray-800 text-white rounded-lg px-4"
                    >
                      Proceed to Payment
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {/* Add Employee Payroll Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add Employee Payroll</h2>
            <form onSubmit={handleAddEmployee}>
              <div className="mb-4">
                <label className="block text-gray-700">Name</label>
                <input
                  type="text"
                  value={newEmployee.employeeName}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, employeeName: e.target.value })
                  }
                  className="border rounded-lg p-2 w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Description</label>
                <input
                  type="text"
                  value={newEmployee.description}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, description: e.target.value })
                  }
                  className="border rounded-lg p-2 w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Salary</label>
                <input
                  type="number"
                  value={newEmployee.salary}
                  onChange={(e) =>
                    setNewEmployee({ ...newEmployee, salary: e.target.value })
                  }
                  className="border rounded-lg p-2 w-full"
                  required
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="bg-gray-500 text-white rounded-lg px-4 py-2 mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white rounded-lg px-4 py-2"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayrollPage;