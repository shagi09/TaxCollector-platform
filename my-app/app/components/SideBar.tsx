'use client'
import Link from 'next/link';
import { FiUsers, FiCreditCard, FiTrendingUp, FiTrendingDown, FiLogOut } from 'react-icons/fi';
import { TbTax } from "react-icons/tb";

const DashboardSidebar = () => {
  const handleLogout = () => {
    window.location.href = '/auth/login'
  }
  return (
    <div className="w-64 h-screen bg-gray-800 text-white flex flex-col top-0 sticky">
      <div className="p-4">
        <h2 className="text-2xl font-bold">TaxPay</h2>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <Link
              href="/employees"
              className="flex items-center gap-2 p-4 w-full text-left rounded hover:bg-gray-700 transition"
            >
              <FiUsers className="text-xl" />
              <span>Employees</span>
            </Link>
          </li>
          <li>
            <Link
              href="/taxcalculator"
              className="flex items-center gap-2 p-4 w-full text-left rounded hover:bg-gray-700 transition"
            >
              <TbTax className='text-xl'/>
              <span>Profit Tax</span>
            </Link>
          </li>
          <li>
            <Link
              href="/payments"
              className="flex items-center gap-2 p-4 w-full text-left rounded hover:bg-gray-700 transition"
            >
              <FiCreditCard className="text-xl" />
              <span>Payments</span>
            </Link>
          </li>
          <li>
            <Link
              href="/income"
              className="flex items-center gap-2 p-4 w-full text-left rounded hover:bg-gray-700 transition"
            >
              <FiTrendingUp className="text-xl" />
              <span>Income</span>
            </Link>
          </li>
          <li>
            <Link
              href="/expense"
              className="flex items-center gap-2 p-4 w-full text-left rounded hover:bg-gray-700 transition"
            >
              <FiTrendingDown className="text-xl" />
              <span>Expense</span>
            </Link>
          </li>
        </ul>
      </nav>
      <button
        onClick={handleLogout}
        className="mb-10 flex items-center pl-8 gap-2 p-4 w-full text-left rounded hover:bg-gray-700 transition"
      >
        <FiLogOut className="text-xl" />
        <span>Logout</span>
      </button>
    </div>
  );
};

export default DashboardSidebar;