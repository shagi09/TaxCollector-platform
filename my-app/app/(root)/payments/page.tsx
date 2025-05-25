'use client';
import React, { useState } from 'react';

export default function PaymentInterface() {
  const [selectedTaxpayer, setSelectedTaxpayer] = useState('');
  const [taxType, setTaxType] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);

  const taxTypes = [
    { value: 'property', label: 'Property Tax', rate: 0.015, description: 'Annual property tax assessment' },
    { value: 'income', label: 'Income Tax', rate: 0.25, description: 'Personal income tax' },
    { value: 'business', label: 'Business Tax', rate: 0.08, description: 'Business license and operations tax' },
    { value: 'corporate', label: 'Corporate Tax', rate: 0.21, description: 'Corporate income tax' },
  ];

  const outstandingTaxes = [
    { type: 'Property Tax', amount: 2450, dueDate: '2024-03-15', penalty: 125 },
    { type: 'Income Tax', amount: 1200, dueDate: '2024-04-15', penalty: 0 },
    { type: 'Business License', amount: 850, dueDate: '2024-02-28', penalty: 85 },
  ];

  const calculateTax = (income: number, type: string) => {
    const taxTypeObj = taxTypes.find((t) => t.value === type);
    if (!taxTypeObj) return 0;
    return income * taxTypeObj.rate;
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setPaymentComplete(true);
  };

  if (paymentComplete) {
    return (
      <div className="max-w-2xl mx-auto mt-10">
        <div className="bg-white shadow-lg rounded-lg p-8 text-center">
          <div className="flex justify-center mb-4">
            <svg className="w-16 h-16 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
              <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2l4-4" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-4">Your tax payment has been processed successfully.</p>
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Transaction ID:</span>
                <div>TXN-{Math.random().toString(36).substr(2, 9).toUpperCase()}</div>
              </div>
              <div>
                <span className="font-medium">Amount Paid:</span>
                <div>${amount}</div>
              </div>
              <div>
                <span className="font-medium">Payment Method:</span>
                <div>
                  {paymentMethod === 'card'
                    ? 'Credit Card'
                    : paymentMethod === 'bank'
                    ? 'Bank Transfer'
                    : 'Check'}
                </div>
              </div>
              <div>
                <span className="font-medium">Date:</span>
                <div>{new Date().toLocaleDateString()}</div>
              </div>
            </div>
          </div>
          <div className="flex gap-4 justify-center">
            <button className="border px-4 py-2 rounded hover:bg-gray-100">Download Receipt</button>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={() => setPaymentComplete(false)}
            >
              Make Another Payment
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 mt-10">
      <div>
        <h2 className="text-2xl font-bold">Tax Payment System</h2>
        <p className="text-gray-500">Calculate and pay your taxes online</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Tax Calculator */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="mb-4">
            <div className="flex items-center gap-2 text-lg font-semibold mb-1">
              <span>🧮</span> Tax Calculator
            </div>
            <div className="text-gray-500 text-sm">Calculate your tax liability</div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block font-medium mb-1">Taxpayer ID</label>
              <input
                className="border rounded px-3 py-2 w-full"
                placeholder="Enter your taxpayer ID"
                value={selectedTaxpayer}
                onChange={(e) => setSelectedTaxpayer(e.target.value)}
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Tax Type</label>
              <select
                className="border rounded px-3 py-2 w-full"
                value={taxType}
                onChange={(e) => setTaxType(e.target.value)}
              >
                <option value="">Select tax type</option>
                {taxTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label} ({type.rate * 100}%)
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-medium mb-1">Taxable Amount</label>
              <input
                className="border rounded px-3 py-2 w-full"
                type="number"
                placeholder="Enter taxable amount"
                onChange={(e) => {
                  const calculated = calculateTax(Number.parseFloat(e.target.value) || 0, taxType);
                  setAmount(calculated.toFixed(2));
                }}
              />
            </div>
            {amount && (
              <div className="bg-blue-50 p-4 rounded-lg mt-2">
                <div className="text-sm font-medium text-blue-900">Calculated Tax</div>
                <div className="text-2xl font-bold text-blue-900">${amount}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      