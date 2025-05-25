'use client';
import React, { useEffect, useState } from 'react';

const TaxPayersPage = () => {
  const [taxPayers, setTaxPayers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTaxPayers = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:7000/api/auditor/taxpayers', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setTaxPayers(Array.isArray(data.taxpayers) ? data.taxpayers : []);
        }
      } catch (error) {
        // Optionally handle error
      } finally {
        setLoading(false);
      }
    };
    fetchTaxPayers();
  }, []);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Registered Taxpayers</h1>
      {loading ? (
        <div className="text-center py-10">Loading taxpayers...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded-lg">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="py-2 px-4">Name</th>
                <th className="py-2 px-4">Email</th>
                <th className="py-2 px-4">TIN</th>
                <th className="py-2 px-4">Business Name</th>
                <th className="py-2 px-4">Address</th>
              </tr>
            </thead>
            <tbody>
              {taxPayers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-500">
                    No taxpayers found.
                  </td>
                </tr>
              ) : (
                taxPayers.map((tp) => (
                  <tr key={tp._id} className="border-b">
                    <td className="py-2 px-4">{tp.name}</td>
                    <td className="py-2 px-4">{tp.email}</td>
                    <td className="py-2 px-4">{tp.tin || '-'}</td>
                    <td className="py-2 px-4">{tp.phone || '-'}</td>
                    <td className="py-2 px-4">{tp.address || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TaxPayersPage;