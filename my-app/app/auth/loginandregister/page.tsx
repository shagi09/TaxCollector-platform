'use client';
import React, { useState } from 'react';
import { FaGooglePlusG, FaFacebookF, FaGithub, FaLinkedinIn } from 'react-icons/fa';

const LoginAndRegister = () => {
  const [isRegistering, setIsRegistering] = useState(false);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-200 to-indigo-100 font-montserrat">
      <div className="relative w-[768px] max-w-full min-h-[480px] bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Sign Up Form */}
        <div className={`absolute top-0 left-1/2 w-1/2 h-full flex flex-col items-center justify-center px-10 transition-all duration-700 z-30
          ${isRegistering ? 'translate-x-0 opacity-100 pointer-events-auto' : 'translate-x-full opacity-0 pointer-events-none'}`}>
          <form className="w-full flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-4">Create Account</h1>
            <div className="flex gap-2 mb-4">
              <a href="#" className="border border-gray-300 rounded-full w-10 h-10 flex items-center justify-center text-indigo-700 hover:bg-indigo-50"><FaGooglePlusG /></a>
              <a href="#" className="border border-gray-300 rounded-full w-10 h-10 flex items-center justify-center text-indigo-700 hover:bg-indigo-50"><FaFacebookF /></a>
              <a href="#" className="border border-gray-300 rounded-full w-10 h-10 flex items-center justify-center text-indigo-700 hover:bg-indigo-50"><FaGithub /></a>
              <a href="#" className="border border-gray-300 rounded-full w-10 h-10 flex items-center justify-center text-indigo-700 hover:bg-indigo-50"><FaLinkedinIn /></a>
            </div>
            <span className="text-xs mb-2 text-gray-500">or use your email for registration</span>
            <input type="text" placeholder="Name" className="mb-2 p-2 rounded w-full bg-gray-100 focus:outline-indigo-400" />
            <input type="email" placeholder="Email" className="mb-2 p-2 rounded w-full bg-gray-100 focus:outline-indigo-400" />
            <input type="password" placeholder="Password" className="mb-2 p-2 rounded w-full bg-gray-100 focus:outline-indigo-400" />
            <button type="button" className="mt-2 bg-indigo-700 text-white px-8 py-2 rounded uppercase font-semibold text-xs hover:bg-indigo-800 transition">Sign Up</button>
          </form>
        </div>
        {/* Sign In Form */}
        <div className={`absolute top-0 left-0 w-1/2 h-full flex flex-col items-center justify-center px-10 transition-all duration-700 z-20
          ${isRegistering ? '-translate-x-full opacity-0 pointer-events-none' : 'translate-x-0 opacity-100 pointer-events-auto'}`}>
          <form className="w-full flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-4">Sign In</h1>
            <div className="flex gap-2 mb-4">
              <a href="#" className="border border-gray-300 rounded-full w-10 h-10 flex items-center justify-center text-indigo-700 hover:bg-indigo-50"><FaGooglePlusG /></a>
              <a href="#" className="border border-gray-300 rounded-full w-10 h-10 flex items-center justify-center text-indigo-700 hover:bg-indigo-50"><FaFacebookF /></a>
              <a href="#" className="border border-gray-300 rounded-full w-10 h-10 flex items-center justify-center text-indigo-700 hover:bg-indigo-50"><FaGithub /></a>
              <a href="#" className="border border-gray-300 rounded-full w-10 h-10 flex items-center justify-center text-indigo-700 hover:bg-indigo-50"><FaLinkedinIn /></a>
            </div>
            <span className="text-xs mb-2 text-gray-500">or use your email password</span>
            <input type="email" placeholder="Email" className="mb-2 p-2 rounded w-full bg-gray-100 focus:outline-indigo-400" />
            <input type="password" placeholder="Password" className="mb-2 p-2 rounded w-full bg-gray-100 focus:outline-indigo-400" />
            <a href="#" className="text-xs text-gray-500 mb-2 hover:underline">Forget Your Password?</a>
            <button type="button" className="mt-2 bg-indigo-700 text-white px-8 py-2 rounded uppercase font-semibold text-xs hover:bg-indigo-800 transition">Sign In</button>
          </form>
        </div>
        {/* Toggle Panel */}
        <div className="absolute top-0 left-1/2 w-1/2 h-full transition-all duration-700 z-40">
          <div className="bg-gradient-to-r from-indigo-500 to-indigo-700 h-full flex flex-col items-center justify-center px-8 text-white rounded-l-[150px] relative">
            {!isRegistering ? (
              <div className="flex flex-col items-center justify-center px-8 text-center">
                <h1 className="text-3xl font-bold mb-2">Hello, Friend!</h1>
                <p className="mb-4">Register with your personal details to use all of site features</p>
                <button
                  className="bg-transparent border border-white text-white px-8 py-2 rounded uppercase font-semibold text-xs hover:bg-white hover:text-indigo-700 transition"
                  type="button"
                  onClick={() => setIsRegistering(true)}
                >
                  Sign Up
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center px-8 text-center">
                <h1 className="text-3xl font-bold mb-2">Welcome Back!</h1>
                <p className="mb-4">Enter your personal details to use all of site features</p>
                <button
                  className="bg-transparent border border-white text-white px-8 py-2 rounded uppercase font-semibold text-xs hover:bg-white hover:text-indigo-700 transition"
                  type="button"
                  onClick={() => setIsRegistering(false)}
                >
                  Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginAndRegister;