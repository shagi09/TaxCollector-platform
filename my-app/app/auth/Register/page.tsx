'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {toast} from 'react-hot-toast'

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    tin: '',
    email: '',
    password: '',
    businessName: '',
    businessPermitUrl: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router=useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const response = await fetch('http://localhost:7000/api/auth/taxpayer/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) {
        toast.error(data.error || 'Signup failed');
      } else {
        toast.success(data.message || 'Signup successful!');
        setForm({
          name: '',
          tin: '',
          email: '',
          password: '',
          businessName: '',
          businessPermitUrl: '',
        });
        router.push('/')
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-400 items-center justify-center">
      <div className="flex flex-col  items-center gap-12 w-full max-w-4xl p-6">
        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md flex flex-col gap-3"
        >
          <h2 className="text-3xl font-extrabold mb-2 text-center text-blue-700">Sign Up</h2>
          <p className="text-center text-gray-500 mb-4">Create your TaxPay account</p>
          <input
            name="name"
            type="text"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            className="mb-1 p-2 border border-blue-200 rounded-lg w-full focus:ring-2 focus:ring-blue-400"
          />
          <input
            name="tin"
            type="text"
            placeholder="TIN"
            value={form.tin}
            onChange={handleChange}
            required
            className="mb-1 p-2 border border-blue-200 rounded-lg w-full focus:ring-2 focus:ring-blue-400"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="mb-1 p-2 border border-blue-200 rounded-lg w-full focus:ring-2 focus:ring-blue-400"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="mb-1 p-2 border border-blue-200 rounded-lg w-full focus:ring-2 focus:ring-blue-400"
          />
          <input
            name="businessName"
            type="text"
            placeholder="Business Name"
            value={form.businessName}
            onChange={handleChange}
            className="mb-1 p-2 border border-blue-200 rounded-lg w-full focus:ring-2 focus:ring-blue-400"
          />
          <input
            name="businessPermitUrl"
            type="text"
            placeholder="Business Permit URL"
            value={form.businessPermitUrl}
            onChange={handleChange}
            className="mb-1 p-2 border border-blue-200 rounded-lg w-full focus:ring-2 focus:ring-blue-400"
          />
          {error && <p className="text-red-600 mb-2 text-center">{error}</p>}
          {success && <p className="text-green-600 mb-2 text-center">{success}</p>}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-800 transition"
          >
            Sign Up
          </button>
          <p className="text-center text-gray-500 mt-2">
            Already have an account?{' '}
            <a href="/auth/Login" className="text-blue-600 hover:underline font-semibold">
              Sign In
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;