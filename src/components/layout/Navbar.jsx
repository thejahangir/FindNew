import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import FindNewLogo from '../../assets/findnew-logo.png';

export default function Navbar() {
 return (
 <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/20">
 <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
 
 {/* Logo */}
 <Link to="/" className="flex items-center gap-3">
 
 <div>
 <img src={FindNewLogo} alt="FindNewLogo" className='logo-findnew' />
 </div>
 </Link>

 {/* Desktop Links */}
 <div className="hidden md:flex items-center gap-8">
 <a href="#features" className="text-sm font-medium text-gray-600 hover:text-brand-blue transition-colors">Features</a>
 <a href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-brand-blue transition-colors">How it works</a>
 <a href="#pricing" className="text-sm font-medium text-gray-600 hover:text-brand-blue transition-colors">Pricing</a>
 </div>

 {/* Actions */}
 <div className="hidden md:flex items-center gap-4">
 <Link 
 to="/auth" 
 className="text-sm font-medium text-brand-dark hover:text-brand-blue transition-colors"
 >
 Login
 </Link>
 <Link 
 to="/auth" 
 className="bg-brand-blue text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition-all hover:shadow-lg hover:shadow-brand-blue/30 active:scale-[0.98]"
 >
 Get Started
 </Link>
 </div>

 {/* Mobile Menu Toggle */}
 <button className="md:hidden p-2 text-gray-600">
 <Menu size={24} />
 </button>

 </div>
 </nav>
 );
}
