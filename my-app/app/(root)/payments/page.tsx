'use client'
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

export default function PaymentInterface() {
  const [taxType, setTaxType] = useState('profit'); // 'profit', 'vat', or 'payroll'
  const [amount, setAmount] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState('');

  useEffect(() => {
    // Fetch the correct amount based on selected tax type
    if (taxType === 'profit') {
      const storedAmount = localStorage.getItem('profitTax');
      if (storedAmount) setAmount(storedAmount);
    } else if (taxType === 'vat') {
      const storedNetVAT = localStorage.getItem('netVAT');
      if (storedNetVAT) setAmount(storedNetVAT);
      setMonth(localStorage.getItem('vatMonth') || '');
      setYear(localStorage.getItem('vatYear') || '');
    } else if (taxType === 'payroll') {
      const storedPayrollAmount=localStorage.getItem('payrollTax')
      // You may want to fetch payroll months and amounts here
      setAmount(storedPayrollAmount)
    }
  }, [taxType]);

const handlePayment = async (e: React.FormEvent) => {
  e.preventDefault();
  const token = localStorage.getItem('token');
  const payrollMonthId = localStorage.getItem('payrollMonthId'); // <-- get from localStorage

  if (!payrollMonthId) {
    toast.error('Payroll Month ID is missing.');
    return;
  }

  setIsProcessing(true);

  const payload = {
    amount,
    email,
    firstName,
    lastName,
    phone,
  };

  const endpoint = `http://localhost:7000/api/payments/payroll/${payrollMonthId}`;

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (res.ok && data.paymentUrl) {
      setRedirectUrl(data.paymentUrl);
      setTimeout(() => {
        window.location.href = data.paymentUrl;
      }, 1500);
    } else {
      toast.error(data.message || 'Payment initialization failed');
    }
  } catch (err) {
    toast.error('Payment initialization failed');
  }
  setIsProcessing(false);
};

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white shadow rounded-lg p-8">
      <h2 className="text-2xl font-bold mb-6">Pay Your Tax with Chapa</h2>
      {redirectUrl ? (
        <div className="text-center py-10">
          <div className="text-green-600 text-xl font-semibold mb-2">Redirecting to payment...</div>
          <div>
            If you are not redirected,{' '}
            <a href={redirectUrl} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">
              click here
            </a>
            .
          </div>
        </div>
      ) : (
        <form onSubmit={handlePayment} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Tax Type</label>
            <select
              className="border rounded px-3 py-2 w-full"
              value={taxType}
              onChange={e => setTaxType(e.target.value)}
            >
              <option value="profit">Profit Tax</option>
              <option value="vat">Net VAT</option>
              <option value="payroll">Payroll Tax</option>
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">First Name</label>
            <input
              className="border rounded px-3 py-2 w-full"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Last Name</label>
            <input
              className="border rounded px-3 py-2 w-full"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Email</label>
            <input
              className="border rounded px-3 py-2 w-full"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Phone Number</label>
            <input
              className="border rounded px-3 py-2 w-full"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              required
            />
          </div>
          {/* Hidden fields for VAT */}
          {taxType === 'vat' && (
            <>
              <input type="hidden" value={month} name="month" />
              <input type="hidden" value={year} name="year" />
            </>
          )}
          {amount && (
            <div className="bg-blue-50 p-4 rounded-lg mt-2">
              <div className="text-sm font-medium text-blue-900">Amount to Pay</div>
              <div className="text-2xl font-bold text-blue-900">ETB {amount}</div>
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-lg font-semibold mt-2 hover:bg-gray-500"
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Pay with Chapa'}
          </button>
        </form>
      )}
    </div>
  );
}