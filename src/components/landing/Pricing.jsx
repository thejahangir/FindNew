import React from 'react';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Pricing() {
 const tiers = [
 {
 name: 'Starter',
 price: 'Free',
 description: 'Perfect for small teams making their first few hires.',
 features: [
 'Up to 3 active job postings',
 'Basic AI candidate matching',
 'Email support',
 'Standard ATS features'
 ],
 buttonText: 'Get Started Free',
 buttonStyle: 'bg-white text-brand-dark border-gray-200 hover:bg-gray-50',
 popular: false
 },
 {
 name: 'Pro',
 price: '$49',
 period: '/mo',
 description: 'Everything you need to scale your hiring process fast.',
 features: [
 'Unlimited job postings',
 'Advanced AI sourcing & screening',
 'Automated interview scheduling',
 'Collaborative hiring notes',
 'Priority 24/7 support'
 ],
 buttonText: 'Start Free Trial',
 buttonStyle: 'bg-brand-blue text-white hover:bg-blue-700 border-brand-blue shadow-lg shadow-brand-blue/30',
 popular: true
 },
 {
 name: 'Enterprise',
 price: 'Custom',
 description: 'Advanced features for large organizations with complex needs.',
 features: [
 'Custom AI model training',
 'Dedicated account manager',
 'Advanced analytics & reporting',
 'Custom integrations (API)',
 'SSO & Advanced Security'
 ],
 buttonText: 'Contact Sales',
 buttonStyle: 'bg-brand-dark text-white hover:bg-gray-800 border-brand-dark',
 popular: false
 }
 ];

 return (
 <section id="pricing" className="py-24 bg-white relative">
 <div className="max-w-7xl mx-auto px-6">
 
 <div className="text-center max-w-2xl mx-auto mb-16">
 <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-4">
 Simple, transparent pricing
 </h2>
 <p className="text-lg text-gray-600">
 No hidden fees. No surprise charges. Choose the plan that best fits your growing team.
 </p>
 </div>

 <div className="grid md:grid-cols-3 gap-8 items-start">
 {tiers.map((tier, index) => (
 <div 
 key={index} 
 className={`relative rounded-3xl p-8 border ${tier.popular ? 'border-brand-blue ring-1 ring-brand-blue scale-105 bg-white z-10' : 'border-gray-200 bg-gray-50'} flex flex-col h-full`}
 >
 {tier.popular && (
 <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-brand-blue text-white px-4 py-1 rounded-full text-xs font-bold ">
 Most Popular
 </div>
 )}
 
 <div className="mb-6">
 <h3 className="text-xl font-bold text-gray-900 mb-2">{tier.name}</h3>
 <p className="text-gray-500 text-sm h-10">{tier.description}</p>
 </div>
 
 <div className="mb-8">
 <span className="text-4xl font-extrabold text-gray-900">{tier.price}</span>
 {tier.period && <span className="text-gray-500 font-medium">{tier.period}</span>}
 </div>
 
 <ul className="space-y-4 mb-8 flex-1">
 {tier.features.map((feature, fIndex) => (
 <li key={fIndex} className="flex items-start gap-3">
 <Check size={20} className="text-brand-green flex-shrink-0 mt-0.5" />
 <span className="text-gray-600 text-sm">{feature}</span>
 </li>
 ))}
 </ul>
 
 <Link 
 to="/auth"
 className={`w-full flex justify-center items-center py-3 px-6 rounded-xl font-medium border transition-all active:scale-[0.98] ${tier.buttonStyle}`}
 >
 {tier.buttonText}
 </Link>
 </div>
 ))}
 </div>

 </div>
 </section>
 );
}
