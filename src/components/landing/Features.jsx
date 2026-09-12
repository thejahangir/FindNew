import React from 'react';
import { Bot, Zap, Users, Sparkles } from 'lucide-react';

export default function Features() {
 const features = [
 {
 icon: <Bot size={24} className="text-brand-blue" />,
 title: 'AI Candidate Sourcing',
 description: 'Our AI scans millions of profiles across the web to find passive candidates that perfectly match your job descriptions.',
 bgColor: 'bg-blue-50',
 },
 {
 icon: <Zap size={24} className="text-brand-green" />,
 title: 'Automated Screening',
 description: 'Instantly parse resumes and rank candidates based on skills, experience, and cultural fit without human bias.',
 bgColor: 'bg-green-50',
 },
 {
 icon: <Users size={24} className="text-brand-dark" />,
 title: 'Collaborative Hiring',
 description: 'Keep your entire hiring team in the loop with shared notes, interview scorecards, and automated scheduling.',
 bgColor: 'bg-gray-100',
 },
 {
 icon: <Sparkles size={24} className="text-purple-500" />,
 title: 'Smart Engagement',
 description: 'Generate hyper-personalized outreach emails using AI to drastically improve response rates from top talent.',
 bgColor: 'bg-purple-50',
 }
 ];

 return (
 <section id="features" className="py-24 bg-white relative">
 <div className="max-w-7xl mx-auto px-6">
 
 <div className="text-center max-w-2xl mx-auto mb-16">
 <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-4">
 Everything you need to scale your team
 </h2>
 <p className="text-lg text-gray-600">
 FindNew combines traditional ATS features with cutting-edge AI to streamline your entire recruitment pipeline.
 </p>
 </div>

 <div className="grid md:grid-cols-2 gap-8">
 {features.map((feature, index) => (
 <div 
 key={index} 
 className="p-8 rounded-3xl border border-gray-100 hover:shadow-xl hover:shadow-gray-200/50 transition-all group bg-white"
 >
 <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${feature.bgColor} transition-transform group-hover:scale-110`}>
 {feature.icon}
 </div>
 <h3 className="text-xl font-semibold text-brand-dark mb-3">
 {feature.title}
 </h3>
 <p className="text-gray-600 leading-relaxed">
 {feature.description}
 </p>
 </div>
 ))}
 </div>

 </div>
 </section>
 );
}
