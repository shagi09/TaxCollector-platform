'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import {FaGoogle,FaGithub,FaEye,FaEyeSlash} from 'react-icons/fa'

const Login = () => {
  const [tin, setTin] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await signIn('credentials', {
        redirect: false,
        tin,
        password,
      });

      if (result?.error) {
        setError(result.error);
      } else {
        // Redirect to the homepage or dashboard
        window.location.href = '/';
      }
    } catch (err) {
      console.error('Login failed:', err);
      setError('An unexpected error occurred.');
    }
  };

  return (
    <div className="flex gap-4 items-center justify-center min-h-screen bg-gray-400">
      <div className="hidden md:block">
        {/* Add your illustration here */}
        <img src="/illustration.png" alt="Illustration" className="w-full max-w-md" />
      </div>
      <div className="flex flex-col max-w-md w-full p-8 bg-white rounded-4xl shadow-md">
        <h1 className="mt-2 text-center font-bold text-4xl text-gray-600">Sign In</h1>
        <form onSubmit={handleSubmit} className="mt-6">
          <input
            placeholder="TIN"
            type="number"
            id="tin"
            value={tin}
            onChange={(e) => setTin(e.target.value)}
            required
            className="mt-1 p-2 border text-gray-600 border-gray-300 rounded-4xl w-full"
          />

<div className="relative mt-4">
  <input
    placeholder="Password"
    type={passwordVisible ? 'text' : 'password'} // Toggle input type
    id="password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    required
    className="p-2 pr-10 border text-gray-600 border-gray-300 rounded-4xl w-full"
  />
  <button
    type="button"
    onClick={() => setPasswordVisible(!passwordVisible)} // Toggle visibility
    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
  >
    {passwordVisible ? <FaEyeSlash /> : <FaEye />}
  </button>
</div>
          {error && <p className="mt-2 text-red-600 text-center">{error}</p>}
          <button type="submit" className="w-full mt-6 p-2 bg-blue-600 text-white rounded-4xl hover:bg-blue-500">
            Sign In
          </button>
          <p className="mt-4 text-center">
            <a href="#" className="text-blue-600 hover:underline">
              Forgot password?
            </a>
          </p>
        </form>
        <div className="mt-6 text-center ">
          <p className="text-blue-600">Or</p>
          <button
            className="text-gray-600 w-full mt-2 flex items-center justify-center gap-2 hover:underline"
            onClick={() => signIn('google')}
          >
            <FaGoogle className="text-blue-500" />
            Sign in with Google
          </button>
          <button
            className="text-gray-600 w-full mt-4 flex items-center justify-center gap-2 hover:underline"
            onClick={() => signIn('github')}
          >
            <FaGithub className="text-gray-800" />
            Sign in with GitHub
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;