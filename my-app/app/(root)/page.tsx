'use client'
import { useState, useEffect } from "react";
import { Bell, User, CreditCard, Calculator, PlusCircle,X } from "lucide-react";
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

const YEARS = [2021, 2022, 2023, 2024, 2025];
const CURRENT_YEAR = new Date().getFullYear();

export default function Dashboard() {
  const router = useRouter();
  const [profitTaxByYear, setProfitTaxByYear] = useState(Array(YEARS.length).fill(0));
  const [loading, setLoading] = useState(false);
  const [showProfile,setShowProfile]=useState(false)
    const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false)

    const [currentProfitTax, setCurrentProfitTax] = useState(0);
  const [currentPayrollTax, setCurrentPayrollTax] = useState(0);

  useEffect(() => {
  const fetchProfitTaxByYear = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const results = [];
    let profitTaxThisYear = 0; // <-- Declare this!
    for (let i = 0; i < YEARS.length; i++) {
      try {
        const res = await fetch(`http://localhost:7000/api/profitTax/${YEARS[i]}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          const tax = data.tax || 0;
          console.log(tax)
          results.push(tax);
          if (YEARS[i] === CURRENT_YEAR) profitTaxThisYear = tax;
        } else {
          results.push(0);
        }
      } catch {
        results.push(0);
      }
    }
    setProfitTaxByYear(results);
    setCurrentProfitTax(profitTaxThisYear); // <-- Now this works!
    setLoading(false);
  };
  fetchProfitTaxByYear();

  const fetchPayrollTax = async () => {
    try {
      const token = localStorage.getItem('token');
      for (let m = 1; m <= 12; m++) {
        const res = await fetch(`http://localhost:7000/api/payroll/${CURRENT_YEAR}/${m}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setCurrentPayrollTax(data.totalTax);
        console.log(data)
        }
      }

    } catch {
      setCurrentPayrollTax(0);
    }
  };
  fetchPayrollTax();
}, []);


    const handleUserClick = async () => {
    setShowProfile(true);
    setProfileLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:7000/api/taxpayer', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        console.log(data)
        setProfile(data);
      } else {
        setProfile(null);
      }
    } catch {
      setProfile(null);
    }
    setProfileLoading(false);
  };


  const barData = {
    labels: YEARS.map(String),
    datasets: [
      {
        label: "Profit Tax",
        data: profitTaxByYear,
        backgroundColor: "#3b82f6",
        borderRadius: 6,
        barPercentage: 0.6,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Navigation */}
      <nav className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tax Dashboard</h1>
        <div className="flex items-center gap-4">
          <Bell className="text-gray-600" />
          <button onClick={handleUserClick}>
            <User className="text-gray-600" />
          </button>
        </div>
      </nav>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="rounded-lg border bg-white p-4 shadow">
          <h3 className="text-sm text-gray-500">Profit Tax ({CURRENT_YEAR})</h3>
          <p className="text-xl font-bold text-blue-600">
            {currentProfitTax.toLocaleString(undefined, { style: 'currency', currency: 'USD' })}
          </p>
        </div>
        <div className="rounded-lg border bg-white p-4 shadow">
          <h3 className="text-sm text-gray-500">Payroll Tax ({CURRENT_YEAR})</h3>
          <p className="text-xl font-bold text-purple-600">
            {currentPayrollTax.toLocaleString(undefined, { style: 'currency', currency: 'USD' })}
          </p>
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
          <h3 className="text-md font-medium mb-4">Profit Tax By Year</h3>
          <div className="w-full h-52">
            {loading ? (
              <span className="text-gray-400">Loading chart...</span>
            ) : (
              <Bar data={barData} options={barOptions} />
            )}
          </div>
        </div>
        <div className="rounded-lg border bg-white p-4 shadow">
          <h3 className="text-md font-medium mb-4">Tax Breakdown</h3>
          <div className="w-full h-52 flex items-center justify-center">
            <Pie data={pieData} options={pieOptions} />
          </div>
        </div>
      </div>
          {showProfile && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative animate-fade-in">
      <button
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 transition"
        onClick={() => setShowProfile(false)}
        aria-label="Close profile"
      >
        <X className="w-6 h-6" />
      </button>
      <div className="flex flex-col items-center mb-4">
        <div className="bg-blue-100 rounded-full p-3 mb-2">
          <User className="w-10 h-10 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-blue-700 mb-1">Profile</h2>
        <div className="text-gray-500 text-sm mb-2">Taxpayer Information</div>
      </div>
      {profileLoading ? (
        <div className="flex justify-center items-center py-8">
          <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></span>
        </div>
      ) : profile ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-700 w-36">Name:</span>
            <span className="text-gray-900">{profile.name || '-'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-700 w-36">Email:</span>
            <span className="text-gray-900">{profile.email || '-'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-700 w-36">TIN:</span>
            <span className="text-gray-900">{profile.tin || '-'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-700 w-36">Business Permit:</span>
            {profile.businessPermitUrl && profile.businessPermitUrl !== '-' ? (
              <a
                href={profile.businessPermitUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                View Permit
              </a>
            ) : (
              <span className="text-gray-900">-</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-700 w-36">Business Name:</span>
            <span className="text-gray-900">{profile.businessName || '-'}</span>
          </div>
        </div>
      ) : (
        <div className="text-red-500 text-center py-8">Failed to load profile.</div>
      )}
    </div>
    <style jsx global>{`
      .animate-fade-in {
        animation: fadeIn 0.3s ease;
      }
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px);}
        to { opacity: 1; transform: translateY(0);}
      }
    `}</style>
  </div>
)}
</div>
  )

}