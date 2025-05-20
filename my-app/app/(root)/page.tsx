'use client'
import { useState } from "react";
import { Bell, User, Settings, CreditCard, Calculator, PlusCircle, FileText } from "lucide-react";
import { motion } from "framer-motion";
import { Bar, Pie } from "react-chartjs-2";
import { useRouter } from "next/navigation";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip as ChartTooltip,
  Legend,
  ArcElement,
} from "chart.js";


ChartJS.register(BarElement, CategoryScale, LinearScale, ChartTooltip, Legend, ArcElement);

const pieData = {
  labels: ["Paid", "Owed"],
  datasets: [
    {
      data: [1200, 3000],
      backgroundColor: ["#22c55e", "#ef4444"],
      borderWidth: 0,
    },
  ],
};

const barData = {
  labels: ["Jan", "Feb", "Mar", "Apr"],
  datasets: [
    {
      label: "Tax",
      data: [400, 800, 1000, 600],
      backgroundColor: "#3b82f6",
      borderRadius: 6,
      barPercentage: 0.6,
    },
  ],
};

const barOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    tooltip: { enabled: true },
  },
  scales: {
    x: { grid: { display: false } },
    y: { grid: { color: "#eee" } },
  },
};

const pieOptions = {
  responsive: true,
  plugins: {
    legend: { display: true, position: "bottom" },
    tooltip: { enabled: true },
  },
};

export default function Dashboard() {
  const router =useRouter()
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Navigation */}
      <nav className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tax Dashboard</h1>
        <div className="flex items-center gap-4">
          <Bell className="text-gray-600" />
          <User className="text-gray-600" />
        </div>
      </nav>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="rounded-lg border bg-white p-4 shadow">
          <h3 className="text-sm text-gray-500">Total Taxes Owed</h3>
          <p className="text-xl font-bold text-red-500">$3,000</p>
        </div>
        <div className="rounded-lg border bg-white p-4 shadow">
          <h3 className="text-sm text-gray-500">Total Taxes Paid</h3>
          <p className="text-xl font-bold text-green-500">$1,200</p>
        </div>
        <div className="rounded-lg border bg-white p-4 shadow">
          <h3 className="text-sm text-gray-500">Upcoming Deadlines</h3>
          <p className="text-xl font-bold text-yellow-500">3 Due</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-4 mb-6">
        <button onClick={()=>router.push('/taxcalculator')}
        className="flex gap-2 rounded px-4 py-2 font-semibold bg-blue-500 text-white hover:bg-blue-600 transition">
          <Calculator className="w-4 h-4" /> Calculate Tax
        </button>
        <button onClick={()=>router.push('/payments')}
         className="flex gap-2 rounded px-4 py-2 font-semibold bg-green-500 text-white hover:bg-green-600 transition">
          <CreditCard className="w-4 h-4" /> Make a Payment
        </button>
        <button onClick={()=>router.push('/income')} 
        className="flex gap-2 rounded px-4 py-2 font-semibold bg-gray-800 text-white hover:bg-gray-900 transition">
          <PlusCircle className="w-4 h-4" /> Add Income/Expense
        </button>
      </div>

      {/* Recent Activity */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Recent Activity</h2>
        <ul className="bg-white rounded-xl shadow divide-y divide-gray-100">
          <li className="p-4">💳 Payment of $500 made on 2025-05-01</li>
          <li className="p-4">📝 Tax return submitted for Q1</li>
          <li className="p-4">⏰ Reminder: Tax payment due in 5 days</li>
        </ul>
      </div>

      {/* Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="rounded-lg border bg-white p-4 shadow">
          <h3 className="text-md font-medium mb-4">Tax Payments Over Time</h3>
          <div className="w-full h-52">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>
        <div className="rounded-lg border bg-white p-4 shadow">
          <h3 className="text-md font-medium mb-4">Tax Breakdown</h3>
          <div className="w-full h-52 flex items-center justify-center">
            <Pie data={pieData} options={pieOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}