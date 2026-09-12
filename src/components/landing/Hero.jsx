import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';

export default function Hero() {
 const images = [
 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=2000',
 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=2000',
 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=2000'
 ];

 const [currentImageIndex, setCurrentImageIndex] = useState(0);

 useEffect(() => {
 const interval = setInterval(() => {
 setCurrentImageIndex((prev) => (prev + 1) % images.length);
 }, 5000);
 return () => clearInterval(interval);
 }, [images.length]);

 return (
 <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden min-h-[90vh] flex items-center justify-center">
 
 {/* Background Image Slider */}
 <div className="absolute inset-0 z-0">
 {images.map((src, index) => (
 <div 
 key={index}
 className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out"
 style={{ 
 backgroundImage: `url(${src})`,
 opacity: index === currentImageIndex ? 0.6 : 0 
 }}
 />
 ))}
 {/* Overlay to ensure text readability but keep image visible */}
 <div className="absolute inset-0 bg-gradient-to-b from-gray-50/60 via-white/70 to-white z-0 backdrop-blur-[1px]"></div>
 </div>

 <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
 
 {/* Badge */}
 <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200 text-sm font-medium text-brand-blue mb-8 animate-fade-in shadow-sm">
 <Star size={16} className="fill-brand-blue" />
 <span>The #1 AI-Powered ATS for Modern Teams</span>
 </div>

 {/* Headline */}
 <h1 className="text-5xl md:text-7xl font-bold text-brand-dark mb-8 animate-slide-up" style={{animationDelay: '0.1s'}}>
 Hire the best talent. <br/>
 <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-green">
 On FindNew.
 </span>
 </h1>

 {/* Subheadline */}
 <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto mb-10 animate-fade-in font-medium" style={{animationDelay: '0.3s'}}>
 FindNew uses advanced AI to source, screen, and engage top candidates faster than ever before. Reclaim your time and build your dream team.
 </p>

 {/* CTA Buttons */}
 <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{animationDelay: '0.4s'}}>
 <Link 
 to="/auth" 
 className="w-full sm:w-auto flex items-center justify-center gap-2 bg-brand-dark text-white px-8 py-4 rounded-xl text-lg font-medium hover:bg-gray-800 transition-all hover:shadow-xl hover:shadow-brand-dark/20 active:scale-[0.98]"
 >
 Start Hiring Free
 <ArrowRight size={20} />
 </Link>
 <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white/90 backdrop-blur-sm text-brand-dark border border-gray-200 px-8 py-4 rounded-xl text-lg font-medium hover:bg-gray-50 transition-all active:scale-[0.98]">
 Book a Demo
 </button>
 </div>

 </div>
 </section>
 );
}
