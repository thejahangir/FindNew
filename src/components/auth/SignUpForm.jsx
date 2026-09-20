import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';

export default function SignUpForm({ setView }) {
 return (
 <div className="animate-fade-in">
 <div className="text-center mb-8">
 <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
 <p className="text-gray-500 text-sm">Join FindNew and revolutionize your hiring.</p>
 </div>

 <form className="space-y-4">
 <div className="space-y-1">
 <label className="text-sm font-medium text-gray-700">Full Name</label>
 <div className="relative">
 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
 <User size={18} className="text-gray-400" />
 </div>
 <input
 type="text"
 className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-colors bg-white"
 placeholder="John Doe"
 required
 />
 </div>
 </div>

 <div className="space-y-1">
 <label className="text-sm font-medium text-gray-700">Email address</label>
 <div className="relative">
 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
 <Mail size={18} className="text-gray-400" />
 </div>
 <input
 type="email"
 className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-colors bg-white"
 placeholder="you@company.com"
 required
 />
 </div>
 </div>

 <div className="space-y-1">
 <label className="text-sm font-medium text-gray-700">Password</label>
 <div className="relative">
 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
 <Lock size={18} className="text-gray-400" />
 </div>
 <input
 type="password"
 className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-colors bg-white"
 placeholder="Create a strong password"
 required
 />
 </div>
 </div>

 <button
 type="submit"
 className="w-full flex items-center justify-center gap-2 bg-brand-green text-white py-2.5 rounded-xl text-sm font-medium hover:bg-green-700 transition-all hover:shadow-lg hover:shadow-brand-green/30 mt-2 active:scale-[0.98]"
 >
 Sign Up Free
 <ArrowRight size={16} />
 </button>
 </form>

 <div className="mt-8 text-center text-sm text-gray-600">
 Already have an account?{' '}
 <button
 onClick={() => setView('login')}
 className="font-medium text-brand-blue hover:text-blue-700 transition-colors"
 >
 Sign in
 </button>
 </div>
 </div>
 );
}
