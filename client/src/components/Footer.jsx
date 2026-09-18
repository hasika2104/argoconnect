import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, Shield, Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Col 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-green-600 flex items-center justify-center text-white">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">Argoconnect</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Direct cloud-based farmer marketplace empowering rural agriculture across Andhra Pradesh & Telangana. Fresh, transparent, and direct from farm to home.
            </p>
            <div className="flex items-center gap-2 text-xs text-green-400 font-medium">
              <Shield className="w-4 h-4" /> 100% Certified Farmers & Secure Transactions
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider">Marketplace</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/marketplace" className="hover:text-green-400 transition">All Produce</Link></li>
              <li><Link to="/marketplace?category=Vegetables" className="hover:text-green-400 transition">Fresh Vegetables</Link></li>
              <li><Link to="/marketplace?category=Fruits" className="hover:text-green-400 transition">Seasonal Fruits</Link></li>
              <li><Link to="/marketplace?category=Grains" className="hover:text-green-400 transition">Organic Grains & Pulses</Link></li>
              <li><Link to="/marketplace?category=Spices" className="hover:text-green-400 transition">Guntur Spices</Link></li>
            </ul>
          </div>

          {/* Col 3: Smart AI Assistant & Resources */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider">AI Assistant</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/ai-assistant" className="hover:text-green-400 transition">తెలుగు ఫార్మింగ్ ఏఐ (Telugu AI)</Link></li>
              <li><Link to="/ai-assistant" className="hover:text-green-400 transition">Crop Advisory & Fertilizers</Link></li>
              <li><Link to="/about" className="hover:text-green-400 transition">How Argoconnect Works</Link></li>
              <li><Link to="/contact" className="hover:text-green-400 transition">Farmer Registration Guide</Link></li>
            </ul>
          </div>

          {/* Col 4: Contact & Office */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider">Contact Us</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-green-500" />
                <span>Agricultural Hub, Tenali, Guntur Dist, AP</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-green-500" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-green-500" />
                <span>support@argoconnect.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 Argoconnect Inc. All rights reserved.</p>
          <p className="flex items-center gap-1 mt-2 sm:mt-0">
            Made with <Heart className="w-3.5 h-3.5 text-red-500 fill-current" /> for Indian Farmers & Consumers
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
