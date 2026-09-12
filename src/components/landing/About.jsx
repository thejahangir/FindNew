import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function About() {
 const points = [
 "Reduce time-to-hire by 60%",
 "Eliminate manual resume parsing",
 "Discover hidden talent in your ATS",
 "Mitigate unconscious bias in screening"
 ];

 return (
 <section id="about" className="py-24 bg-gray-50 border-t border-gray-100">
 <div className="max-w-7xl mx-auto px-6">
 <div className="flex flex-col lg:flex-row items-center gap-16">
 
 {/* Left Text Content */}
 <div className="lg:w-1/2">
 <h2 className="text-sm font-bold text-brand-blue uppercase mb-3">About FindNew</h2>
 <h3 className="text-3xl md:text-4xl font-bold text-brand-dark mb-6 leading-tight">
 Recruitment is broken. <br /> We're fixing it with AI.
 </h3>
 <p className="text-lg text-gray-600 mb-8 leading-relaxed">
 Traditional applicant tracking systems are just digital filing cabinets. FindNew is an active intelligence that works alongside your team. By automating the tedious parts of sourcing and screening, we let recruiters do what they do best: build relationships with incredible people.
 </p>
 
 <div className="space-y-4 mb-10">
 {points.map((point, index) => (
 <div key={index} className="flex items-center gap-3">
 <CheckCircle2 size={20} className="text-brand-green flex-shrink-0" />
 <span className="text-gray-700 font-medium">{point}</span>
 </div>
 ))}
 </div>
 
 <button className="text-brand-blue font-semibold hover:text-blue-800 flex items-center gap-2 transition-colors">
 Read our full story <span aria-hidden="true">&rarr;</span>
 </button>
 </div>

 {/* Right Visual Image */}
 <div className="lg:w-1/2 w-full">
 <div className="relative rounded-3xl overflow-hidden shadow-2xl">
 <img 
 src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=1200" 
 alt="Team collaborating in a modern office" 
 className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
 />
 <div className="absolute inset-0 bg-gradient-to-tr from-brand-blue/20 to-transparent pointer-events-none"></div>
 </div>
 </div>

 </div>
 </div>
 </section>
 );
}
