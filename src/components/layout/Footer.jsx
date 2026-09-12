import React from 'react';
import { BrainCircuit, MessageSquare, Briefcase, Globe, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import FindNewLogoFooter from '../../assets/findnew-logo-footer.png';

export default function Footer() {
 return (
 <footer className="bg-brand-dark pt-20 pb-10 border-t border-gray-800">
 <div className="max-w-7xl mx-auto px-6">
 
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
 
 {/* Brand & Newsletter Column */}
 <div className="lg:col-span-4">
 <Link to="/" className="flex items-center gap-3 mb-6">
 <div>
 <img src={FindNewLogoFooter} alt="FindNewLogo" className='logo-findnew-footer' />
 </div>
 </Link>
 <p className="text-gray-400 text-sm leading-relaxed mb-8 pr-4">
 The world's most advanced AI-powered applicant tracking system. We help modern teams source, screen, and hire the best talent on autopilot.
 </p>
 
 <div className="space-y-3">
 <h4 className="text-white font-medium text-sm">Subscribe to our newsletter</h4>
 <div className="flex gap-2">
 <input 
 type="email" 
 placeholder="Enter your email" 
 className="bg-gray-800/50 border border-gray-700 text-white text-sm rounded-lg px-4 py-2.5 w-full focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-colors"
 />
 <button className="bg-brand-blue text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors shrink-0">
 Subscribe
 </button>
 </div>
 </div>
 </div>

 {/* Links Columns */}
 <div className="lg:col-span-2 lg:col-start-6">
 <h4 className="text-white font-semibold mb-6">Product</h4>
 <ul className="space-y-4">
 <li><a href="#features" className="text-gray-400 hover:text-white transition-colors text-sm">Features</a></li>
 <li><a href="#pricing" className="text-gray-400 hover:text-white transition-colors text-sm">Pricing</a></li>
 <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Integrations</a></li>
 <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Changelog</a></li>
 </ul>
 </div>

 <div className="lg:col-span-2">
 <h4 className="text-white font-semibold mb-6">Company</h4>
 <ul className="space-y-4">
 <li><a href="#about" className="text-gray-400 hover:text-white transition-colors text-sm">About Us</a></li>
 <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Careers</a></li>
 <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Blog</a></li>
 <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Contact</a></li>
 </ul>
 </div>

 <div className="lg:col-span-2">
 <h4 className="text-white font-semibold mb-6">Legal</h4>
 <ul className="space-y-4">
 <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</a></li>
 <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</a></li>
 <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Cookie Policy</a></li>
 <li><a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Security</a></li>
 </ul>
 </div>

 </div>

 {/* Bottom Bar */}
 <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
 <p className="text-gray-500 text-sm">
 © {new Date().getFullYear()} FindNew AI. All rights reserved.
 </p>
 <div className="flex items-center gap-4">
 <a href="#" className="text-gray-500 hover:text-brand-blue transition-colors p-2">
 <MessageSquare size={20} />
 </a>
 <a href="#" className="text-gray-500 hover:text-brand-blue transition-colors p-2">
 <Briefcase size={20} />
 </a>
 <a href="#" className="text-gray-500 hover:text-white transition-colors p-2">
 <Globe size={20} />
 </a>
 <a href="#" className="text-gray-500 hover:text-white transition-colors p-2">
 <Mail size={20} />
 </a>
 </div>
 </div>

 </div>
 </footer>
 );
}
