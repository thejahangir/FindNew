import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bot, Sparkles, BrainCircuit, ArrowLeft } from 'lucide-react';
import LoginForm from '../components/auth/LoginForm';
import SignUpForm from '../components/auth/SignUpForm';
import ForgotPasswordForm from '../components/auth/ForgotPasswordForm';
import AuthBg from '../assets/auth-bg.jpg';

export default function AuthPage() {
 const [view, setView] = useState('login'); // 'login', 'signup', 'forgot'

 return (
 <div className="min-h-screen flex w-full bg-white overflow-hidden">
 
 {/* Left Panel - Branding & Visuals (Hidden on small screens) */}
 <div 
 className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden bg-brand-dark"
 style={{
 backgroundImage: `linear-gradient(to bottom right, rgba(23, 32, 51, 0.9), rgba(22, 163, 74, 0.4)), url(${AuthBg})`,
 backgroundSize: 'cover',
 backgroundPosition: 'center',
 }}
 >
 {/* Abstract Background Shapes */}
 <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
 <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-white/10 blur-3xl"></div>
 <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-brand-dark/20 blur-3xl"></div>
 </div>

 {/* Brand Header */}
 <div className="relative z-10 flex items-center gap-3 text-white">
 <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm border border-white/20">
 <BrainCircuit size={32} className="text-white" />
 </div>
 <span className="text-3xl font-bold ">FindNew</span>
 </div>

 {/* Value Proposition */}
 <div className="relative z-10 max-w-xl text-white">
 <h1 className="text-5xl font-bold leading-tight mb-6 animate-slide-up">
 Hire Smarter, <br/> Scale Faster with AI.
 </h1>
 <p className="text-lg text-white/80 mb-8 animate-fade-in" style={{animationDelay: '0.2s'}}>
 FindNew revolutionizes applicant tracking by leveraging advanced AI to find, engage, and hire the world's best talent effortlessly.
 </p>
 
 <div className="flex items-center gap-4 text-sm font-medium animate-fade-in" style={{animationDelay: '0.4s'}}>
 <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
 <Sparkles size={16} className="text-brand-green" />
 <span>AI-Powered Matching</span>
 </div>
 <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
 <Bot size={16} className="text-brand-blue" />
 <span>Automated Screening</span>
 </div>
 </div>
 </div>

 {/* Footer/Trust */}
 <div className="relative z-10 text-white/60 text-sm">
 © 2026 FindNew AI. All rights reserved.
 </div>
 </div>

 {/* Right Panel - Auth Forms */}
 <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative bg-white">
 
 {/* Back to Home Link */}
 <Link 
 to="/" 
 className="absolute top-6 right-8 flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#212b36] transition-colors"
 >
 <ArrowLeft size={16} />
 Back to Home
 </Link>

 <div className="w-full max-w-md relative z-10 p-8 sm:p-10 animate-fade-in">
 
 {/* Mobile Header (Only visible on small screens) */}
 <div className="lg:hidden flex items-center gap-3 text-brand-dark mb-8 justify-center">
 <div className="p-2 bg-brand-blue/10 rounded-xl text-brand-blue">
 <BrainCircuit size={28} />
 </div>
 <span className="text-2xl font-bold ">FindNew</span>
 </div>

 {/* Dynamic Form Rendering */}
 {view === 'login' && <LoginForm setView={setView} />}
 {view === 'signup' && <SignUpForm setView={setView} />}
 {view === 'forgot' && <ForgotPasswordForm setView={setView} />}
 
 </div>
 </div>
 </div>
 );
}
