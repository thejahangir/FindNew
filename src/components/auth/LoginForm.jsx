import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LoginForm({ setView }) {
 const navigate = useNavigate();
 const [email, setEmail] = useState('');
 const [password, setPassword] = useState('');
 const [showPassword, setShowPassword] = useState(false);
 const [errors, setErrors] = useState({});

 const validate = () => {
 const newErrors = {};
 if (!email) {
 newErrors.email = 'Email address is required';
 } else if (!/\S+@\S+\.\S+/.test(email)) {
 newErrors.email = 'Email must be a valid email address';
 }
 
 if (!password) {
 newErrors.password = 'Password is required';
 }
 
 setErrors(newErrors);
 return Object.keys(newErrors).length === 0;
 };

 const handleQuickLogin = (type) => {
 let creds = { email: '', password: 'password123' };
 if (type === 'Agencies') creds.email = 'agency@findnew.com';
 else if (type === 'Corporate') creds.email = 'corporate@findnew.com';
 else if (type === 'Super Admin') creds.email = 'admin@findnew.com';
 
 setEmail(creds.email);
 setPassword(creds.password);
 setErrors({});
 };

 const handleSubmit = (e) => {
 e.preventDefault();
 if (validate()) {
 let userType = 'User';
 if (email === 'agency@findnew.com') userType = 'Agencies';
 if (email === 'corporate@findnew.com') userType = 'Corporate';
 if (email === 'admin@findnew.com') userType = 'Super Admin';
 
 console.log('Login attempt', { email, password, userType });
 navigate('/dashboard', { state: { userType } });
 }
 };

 return (
 <div className="w-full animate-fade-in">
 <div className="mb-8">
 <h4 className="text-[1.5rem] font-bold text-[#212b36] mb-3">Sign in to FindNew</h4>
 <p className="text-[0.875rem] text-black">
 New user?{' '}
 <button onClick={() => setView('signup')} className="text-[#00A76F] font-semibold hover:underline transition-all">
 Create an account
 </button>
 </p>
 </div>

 <form onSubmit={handleSubmit} noValidate className="space-y-4">
 <div className="flex flex-col">
 <div className="relative">
 <input
 type="email"
 id="email"
 value={email}
 onChange={(e) => {
 setEmail(e.target.value);
 if (errors.email) setErrors({ ...errors, email: null });
 }}
 className={`block w-full px-3 py-2.5 text-sm text-[#212b36] bg-transparent rounded-md border appearance-none focus:outline-none focus:ring-0 transition-colors peer ${errors.email ? 'border-[#FF5630] focus:border-[#FF5630] hover:border-[#FF5630]' : 'border-gray-300 focus:border-[#212b36] hover:border-gray-900'}`}
 placeholder=" "
 />
 <label 
 htmlFor="email"
 className={`absolute text-sm duration-200 transform -translate-y-1/2 scale-[0.80] top-0 z-10 origin-[0] bg-white px-1.5 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-0 peer-focus:scale-[0.80] peer-focus:-translate-y-1/2 left-2.5 pointer-events-none ${errors.email ? 'text-[#FF5630] peer-focus:text-[#FF5630]' : 'text-black peer-focus:text-[#212b36]'}`}
 >
 Email address
 </label>
 </div>
 <div className="min-h-[20px] mt-1 ml-3.5 flex items-start">
 {errors.email && <p className="text-[#FF5630] text-xs animate-fade-in">{errors.email}</p>}
 </div>
 </div>

 <div className="flex flex-col">
 <div className="relative">
 <input
 type={showPassword ? "text" : "password"}
 id="password"
 value={password}
 onChange={(e) => {
 setPassword(e.target.value);
 if (errors.password) setErrors({ ...errors, password: null });
 }}
 className={`block w-full pl-3 pr-9 py-2.5 text-sm text-[#212b36] bg-transparent rounded-md border appearance-none focus:outline-none focus:ring-0 transition-colors peer ${errors.password ? 'border-[#FF5630] focus:border-[#FF5630] hover:border-[#FF5630]' : 'border-gray-300 focus:border-[#212b36] hover:border-gray-900'}`}
 placeholder=" "
 />
 <label 
 htmlFor="password"
 className={`absolute text-sm duration-200 transform -translate-y-1/2 scale-[0.80] top-0 z-10 origin-[0] bg-white px-1.5 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-0 peer-focus:scale-[0.80] peer-focus:-translate-y-1/2 left-2.5 pointer-events-none ${errors.password ? 'text-[#FF5630] peer-focus:text-[#FF5630]' : 'text-black peer-focus:text-[#212b36]'}`}
 >
 Password
 </label>
 <button 
 type="button"
 onClick={() => setShowPassword(!showPassword)}
 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
 >
 {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
 </button>
 </div>
 <div className="min-h-[20px] mt-1 ml-3.5 flex items-start">
 {errors.password && <p className="text-[#FF5630] text-xs animate-fade-in">{errors.password}</p>}
 </div>
 </div>

 <div className="flex items-center justify-end mt-2">
 <button
 type="button"
 onClick={() => setView('forgot')}
 className="text-[0.875rem] text-[#212b36] underline hover:no-underline font-medium transition-all"
 >
 Forgot password?
 </button>
 </div>

 <button
 type="submit"
 className="w-full flex items-center justify-center bg-[#212b36] text-white py-2.5 rounded-md text-sm font-bold hover:bg-[#454f5b] transition-all shadow-[0_8px_16px_0_rgba(33,43,54,0.24)] hover:shadow-[0_8px_16px_0_rgba(33,43,54,0.48)] active:scale-[0.98] mt-3 cursor-pointer"
 >
 Sign in
 </button>

 <div className="mt-8 relative">
 <div className="absolute inset-0 flex items-center">
 <div className="w-full border-t border-gray-200"></div>
 </div>
 <div className="relative flex justify-center text-sm">
 <span className="px-2 bg-white text-black text-xs font-semibold ">Quick Login Demo</span>
 </div>
 </div>

 <div className="flex flex-wrap justify-center gap-3 mt-4">
 <button 
 type="button" 
 onClick={() => handleQuickLogin('Agencies')} 
 className="text-xs font-bold text-[#00A76F] hover:bg-[#00A76F]/10 px-3 py-1.5 rounded-md transition-colors border border-[#00A76F]/20 cursor-pointer"
 >
 Agencies
 </button>
 <button 
 type="button" 
 onClick={() => handleQuickLogin('Corporate')} 
 className="text-xs font-bold text-[#1890FF] hover:bg-[#1890FF]/10 px-3 py-1.5 rounded-md transition-colors border border-[#1890FF]/20 cursor-pointer"
 >
 Corporate
 </button>
 <button 
 type="button" 
 onClick={() => handleQuickLogin('Super Admin')} 
 className="text-xs font-bold text-[#7A0C2E] hover:bg-[#7A0C2E]/10 px-3 py-1.5 rounded-md transition-colors border border-[#7A0C2E]/20 cursor-pointer"
 >
 Super Admin
 </button>
 </div>
 </form>
 </div>
 );
}
