// filepath: c:\Users\DABC\tax collector\my-app\app\components\SideBar.tsx
import Link from 'next/link';

const DashboardSidebar = () => {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white flex flex-col top-0 sticky">
      <div className="p-4">
        <h2 className="text-2xl font-bold">TaxPay</h2>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-4">
          <li>
            <Link href="/employees" className="hover:underline">
              Employees
            </Link>
          </li>
          <li>
            <Link href="/taxcalculator" className="hover:underline">
              Calculated Tax
            </Link>
          </li>
          <li>
            <Link href="/payments" className="hover:underline">
              Payments
            </Link>
          </li>
          <li>
          <Link href="/income" className="hover:underline">
              Income
            </Link>
          </li>
          <li>
          <Link href="/expense" className="hover:underline">
              Expense
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default DashboardSidebar;