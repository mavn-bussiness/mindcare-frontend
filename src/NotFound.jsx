import React from 'react';
import { Heart, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center px-6">
      <div className="max-w-2xl mx-auto text-center">
        {/* Logo */}
        <div className="flex items-center justify-center space-x-2 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
            <Heart className="w-7 h-7 text-white" fill="white" />
          </div>
          <span className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            MindCare
          </span>
        </div>

        {/* 404 Message */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
            404
          </h1>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            This page is still under construction. We're working hard to bring you more features!
          </p>
        </div>

        {/* Coming Soon Features */}
        <div className="bg-white/50 rounded-2xl p-8 mb-8 border-2 border-emerald-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Coming Soon</h3>
          <div className="grid md:grid-cols-2 gap-4 text-left">
            {[
              'Privacy Policy & Terms of Service',
              'Contact & Support Center',
              'Blog & Wellness Resources',
              'Community Guidelines',
              'Therapist Directory',
              'FAQ & Help Center'
            ].map((item, idx) => (
              <div key={idx} className="flex items-center space-x-2 text-gray-700">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/"
            className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            <Home className="w-5 h-5" />
            <span>Go Home</span>
          </a>
          <a
            href="/#waitlist"
            className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-white text-emerald-600 border-2 border-emerald-500 rounded-full font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Join Waitlist</span>
          </a>
        </div>

        {/* Support Message */}
        <p className="mt-8 text-gray-500">
          Need immediate support? <a href="mailto:support@mindcare.com" className="text-emerald-600 hover:text-emerald-700 font-semibold">Contact us</a>
        </p>
      </div>
    </div>
  );
}
