'use client'
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function TaxpayerListPage() {
  const{id}=useParams()
  const [taxpayers, setTaxpayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const router = useRouter();
  

useEffect(() => {
  const fetchTaxpayers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('official_token'); // or 'auditorToken' if you use a different key
      const res = await axios.get('http://localhost:7000/api/auditor/taxpayers', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(res.data)
      setTaxpayers(res.data.data || []);
    } catch (err) {
      setTaxpayers([]);
    }
    setLoading(false);
  };
  fetchTaxpayers();
}, []);

const handleBlacklist = async (userId: string) => {
  try {
    const token = localStorage.getItem('official_token');
    // Use the taxpayer id from the route as userId
    const res = await fetch(
      `http://localhost:7000/api/auditor/blacklist/${userId}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    const data = await res.json();
    if (res.ok) {
      alert('User blacklisted and notified.');
    } else {
      alert(data.message || 'Failed to blacklist user.');
    }
  } catch (err) {
    alert('Failed to blacklist user.');
  }
};

  const filtered = taxpayers.filter(tp =>
    tp.name?.toLowerCase().includes(search.toLowerCase()) ||
    tp.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Taxpayers</h1>
      <input
        className="border px-3 py-2 rounded mb-4 w-full"
        placeholder="Search by name or email"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      {loading ? (
        <div>Loading taxpayers...</div>
      ) : (
        <table className="min-w-full bg-white shadow rounded-lg">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4">Name</th>
              <th className="py-2 px-4">Email</th>
              <th className="py-2 px-4">TIN</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500">
                  No taxpayers found.
                </td>
              </tr>
            ) : (
              filtered.map(tp => (
                <tr key={tp._id} className="border-b">
                  <td className="py-2 px-4">{tp.name}</td>
                  <td className="py-2 px-4">{tp.email}</td>
                  <td className="py-2 px-4">{tp.tin || '-'}</td>
                  <td className="py-2 px-4">
                    <button
                      className="bg-black text-white px-4 py-2 rounded"
                      onClick={() => router.push(`/auditor/dashboard/${tp._id}`)}
                    >
                      View Details
                    </button>
                  </td>
                          <td className="py-2 px-4">
          <button
            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-800"
            onClick={() => handleBlacklist(tp._id)}
          >
            Blacklist
          </button>
        </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}