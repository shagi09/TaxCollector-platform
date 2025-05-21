'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const Dashboard = () => {
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    totalIncome: 0,
    totalExpenses: 0,
    pendingAudits: 0,
  });
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const router=useRouter()

  useEffect(() => {
    const fetchMetrics = async () => {
      const response = await axios.get('/api/metrics'); // Replace with your API endpoint for metrics
      setMetrics(response.data);
    };

    const fetchReceipts = async () => {
      const response = await axios.get('/api/receipts'); // Replace with your API endpoint for receipts
      setReceipts(response.data);
      setLoading(false);
    };

    fetchMetrics();
    fetchReceipts();
  }, []);

  const filteredReceipts = receipts.filter(receipt =>
    receipt.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <header>
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      </header>
      <main>
        {/* Overview Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-100 h-[250px] flex justify-center items-center p-4 rounded-lg shadow">
            <h2 className="font-semibold">Total Users</h2>
            <p className="text-2xl">{metrics.totalUsers}</p>
          </div>
          <div className="bg-green-100 h-[250px] flex justify-center items-center p-4 rounded-lg shadow">
            <h2 className="font-semibold">Total Income</h2>
            <p className="text-2xl">${metrics.totalIncome}</p>
          </div>
          <div className="bg-red-100 flex justify-center items-center p-4 rounded-lg shadow">
            <h2 className="font-semibold">Total Expenses</h2>
            <p className="text-2xl">${metrics.totalExpenses}</p>
          </div>
          <div className="bg-yellow-100 flex justify-center items-center h-[250px] p-4 rounded-lg shadow">
            <h2 className="font-semibold">Pending Audits</h2>
            <p className="text-2xl">{metrics.pendingAudits}</p>
          </div>
        </div>
                <button 
        onClick={()=>router.push('/auditor/receipts')}
        className="bg-green-500 text-white rounded-lg px-4 py-4 mt-5 text-2xl ml-260">see receipts</button>

      </main>
    </div>
  );
};

export default Dashboard;