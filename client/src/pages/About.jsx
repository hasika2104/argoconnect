import React from 'react';
import { ShieldCheck, Heart, Users, Leaf, Award, MapPin } from 'lucide-react';

const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold text-green-700 uppercase tracking-widest bg-green-50 px-3.5 py-1.5 rounded-full border border-green-200">
          About Argoconnect
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
          Empowering Indian Farmers Through Direct Cloud Technology
        </h1>
        <p className="text-sm text-gray-600 leading-relaxed">
          Argoconnect is a next-generation agricultural marketplace designed to directly bridge rural farmers with urban consumers, restaurants, and retail buyers across Andhra Pradesh and Telangana.
        </p>
      </div>

      {/* Mission Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-3">
          <div className="w-12 h-12 bg-green-100 text-green-700 rounded-2xl flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-gray-900 text-base">Direct Farmer Trade</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Eliminating middleman exploitation so farmers earn 100% fair prices for their hard work and harvest.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-3">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center">
            <MapPin className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-gray-900 text-base">Hyper-Local Proximity</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Location-aware matching ensures buyers receive fresh produce harvested just hours before delivery.
          </p>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-3">
          <div className="w-12 h-12 bg-green-100 text-green-700 rounded-2xl flex items-center justify-center">
            <Leaf className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-gray-900 text-base">Telugu AI Crop Care</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Our AI Assistant provides guidance in native Telugu and English for soil care, fertilizers, and organic farming.
          </p>
        </div>
      </div>

    </div>
  );
};

export default About;
