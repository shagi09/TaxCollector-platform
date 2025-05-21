'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';

const AuditDashboard = () => {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchReceipts = async () => {
      const response = await axios.get('/api/receipts'); // Replace with your API endpoint
      setReceipts(response.data);
      setLoading(false);
    };
    fetchReceipts();
  }, []);

  const filteredReceipts = receipts.filter(receipt =>
    receipt.userName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <header>
        <h1 className="text-2xl font-bold mb-4">Receipts</h1>
      </header>
      <main>
        <div className="bg-gray-100 p-4 mb-4 rounded-lg">
          <h2 className="text-lg font-semibold">Summary Statistics</h2>
          <p>Total Receipts: {receipts.length}</p>
        </div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by user name"
            className="p-2 border border-gray-300 rounded w-full"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
        <table className="min-w-full bg-white border border-gray-300 rounded-lg">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">User Name</th>
              <th className="p-2 border">Receipt Type</th>
              <th className="p-2 border">Amount</th>
              <th className="p-2 border">Upload Date</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Receipt</th> {/* New column */}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="text-center p-4">Loading...</td></tr>
            ) : (
              filteredReceipts.map(receipt => (
                <tr key={receipt.id}>
                  <td className="p-2 border">{receipt.userName}</td>
                  <td className="p-2 border">{receipt.type}</td>
                  <td className="p-2 border">${receipt.amount}</td>
                  <td className="p-2 border">{new Date(receipt.uploadDate).toLocaleDateString()}</td>
                  <td className="p-2 border">{receipt.status}</td>
                  <td className="p-2 border">
                    <a href={receipt.receiptUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                      View Receipt
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </main>
    </div>
  );
};

export default AuditDashboard;