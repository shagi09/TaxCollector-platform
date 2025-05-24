'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

const RegisterAuditor = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  try {
    const token = localStorage.getItem('official_token'); // or whatever key you use
    const response = await fetch('http://localhost:7000/api/official/register-auditor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });
    const data = await response.json();
    if (!response.ok) {
      toast.error(data.error || 'Signup failed');
    } else {
      toast.success(data.message || 'Official registered!');
      setForm({ name: '', email: '', password: '' });
    }
  } catch (err) {
    toast.error('An unexpected error occurred.');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-400">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md flex flex-col gap-3"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">Register Auditor</h2>
        <input
          name="name"
          type="text"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
          className="p-2 border border-blue-200 rounded w-full"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="p-2 border border-blue-200 rounded w-full"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="p-2 border border-blue-200 rounded w-full"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-700 text-white py-2 rounded font-semibold hover:bg-blue-800 transition"
        >
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>

      </form>
    </div>
  );
};

export default  RegisterAuditor;