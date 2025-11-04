import React, { useState, useEffect } from 'react';
import { Heart, Users, Shield, Sparkles, Check, ArrowRight, Menu, X, BookOpen, MessageCircle } from 'lucide-react';

const API_URL = import.meta.env.API_URL || 'https://mindcare-backend-production.up.railway.app/api';

export default function MindCareLanding() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleWaitlistClick = async () => {
    if (email && email.includes('@')) {
      try {
        const response = await fetch(`${API_URL}/api/waitlist/join`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (data.success) {
          setIsSubmitted(true);
          setTimeout(() => {
            setEmail('');
            setIsSubmitted(false);
          }, 3000);
        } else {
          alert(data.message || 'Failed to join waitlist. Please try again.');
        }
      } catch (error) {
        console.error('Error joining waitlist:', error);
        alert('Failed to join waitlist. Please try again.');
      }
    }
  };

  const features = [
    {
      icon: MessageCircle,
      title: "Connect with Verified Therapists",
      description: "Access licensed mental health professionals who understand your cultural context and community, anytime anywhere"
    },
    {
      icon: BookOpen,
      title: "Personal Journaling & Reflection",
      description: "Track your mental wellness journey with private, secure journaling tools designed for growth"
    },
    {
      icon: Users,
      title: "Supportive Communities",
      description: "Join safe spaces where you're understood, valued, and never alone in your healing journey"
    },
    {
      icon: Shield,
      title: "Your Privacy, Protected",
      description: "24/7 access to support with complete anonymity and advanced privacy protection"
    }
  ];

  const services = [
    {
      title: "Professional Therapy",
      description: "One-on-one and group sessions with licensed therapists",
      icon: MessageCircle
    },
    {
      title: "Digital Journaling",
      description: "Private space to reflect, track moods, and monitor progress",
      icon: BookOpen
    },
    {
      title: "Peer Support",
      description: "Connect with others who understand your experiences",
      icon: Users
    },
    {
      title: "Wellness Resources",
      description: "Educational content, podcasts, and self-care tools",
      icon: Sparkles
    }
  ];

  const stats = [
    { number: "24/7", label: "Support Available" },
    { number: "100%", label: "Anonymous" },
    { number: "1000+", label: "Community Members" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" fill="white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                MindCare
              </span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-emerald-600 transition-colors">Features</a>
              <a href="#services" className="text-gray-700 hover:text-emerald-600 transition-colors">Services</a>
              <a href="#about" className="text-gray-700 hover:text-emerald-600 transition-colors">About</a>
              <a href="#waitlist" className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300">
                Join Waitlist
              </a>
            </div>

            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-700"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {isMenuOpen && (
            <div className="md:hidden absolute top-full left-0 w-full bg-white shadow-xl py-6 px-6 space-y-4">
              <a href="#features" className="block text-gray-700 hover:text-emerald-600 transition-colors" onClick={() => setIsMenuOpen(false)}>Features</a>
              <a href="#services" className="block text-gray-700 hover:text-emerald-600 transition-colors" onClick={() => setIsMenuOpen(false)}>Services</a>
              <a href="#about" className="block text-gray-700 hover:text-emerald-600 transition-colors" onClick={() => setIsMenuOpen(false)}>About</a>
              <a href="#waitlist" className="block px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full text-center" onClick={() => setIsMenuOpen(false)}>
                Join Waitlist
              </a>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-100 rounded-full mb-6 animate-fade-in">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-700">Launching Soon</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 bg-clip-text text-transparent leading-tight animate-slide-up">
              Your Mental Wellness Journey Starts Here
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed animate-slide-up" style={{animationDelay: '0.1s'}}>
              Break the silence. Find your community. Heal together. Access culturally relevant mental health support through therapy, journaling, and peer connections.
            </p>

            {/* Waitlist Form */}
            <div id="waitlist" className="max-w-md mx-auto animate-slide-up" style={{animationDelay: '0.2s'}}>
              {!isSubmitted ? (
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 px-6 py-4 rounded-full border-2 border-emerald-200 focus:border-emerald-500 focus:outline-none text-lg text-gray-900 bg-white"
                  />
                  <button
                    onClick={handleWaitlistClick}
                    className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-full font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 whitespace-nowrap"
                  >
                    <span>Join Waitlist</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="px-6 py-4 bg-emerald-100 rounded-full flex items-center justify-center space-x-2 animate-bounce-in">
                  <Check className="w-6 h-6 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">You're on the list! Check your email.</span>
                </div>
              )}
              <p className="text-sm text-gray-500 mt-4">Join 500+ early adopters transforming mental wellness worldwide</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
              {stats.map((stat, idx) => (
                <div key={idx} className="text-center animate-fade-in" style={{animationDelay: `${0.3 + idx * 0.1}s`}}>
                  <div className="text-3xl md:text-4xl font-bold text-emerald-600 mb-2">{stat.number}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-6 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Everything You Need for Mental Wellness
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive tools and support designed to meet you where you are in your healing journey
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, idx) => (
              <div 
                key={idx}
                className="group p-6 rounded-2xl bg-white border-2 border-emerald-100 hover:border-emerald-300 transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <service.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Wellness That Understands You
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              More than an app. A community. A movement towards accessible mental health for everyone.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <div 
                key={idx}
                className="group p-8 rounded-2xl bg-white hover:bg-gradient-to-br hover:from-emerald-50 hover:to-teal-50 border-2 border-emerald-100 hover:border-emerald-300 transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Breaking Barriers, Building Hope
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Mental health challenges affect 1 in 4 people worldwide. Stigma and lack of access keep too many suffering in silence. We're changing that.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                MindCare brings together verified therapists, personal journaling tools, supportive communities, and culturally relevant resources—all in one secure, accessible platform designed for your unique journey.
              </p>
              <div className="space-y-4">
                {[
                  'Safe, anonymous support anytime',
                  'Licensed therapists who understand you',
                  'Private journaling for self-reflection',
                  'Community-driven healing',
                  'Culturally relevant resources'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-emerald-600" />
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl overflow-hidden shadow-2xl">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center text-white p-8">
                    <Heart className="w-24 h-24 mx-auto mb-4" fill="white" />
                    <p className="text-2xl font-bold">Your wellness matters</p>
                    <p className="text-emerald-100 mt-2">Wherever you are</p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-emerald-200 rounded-full blur-3xl opacity-70"></div>
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-teal-200 rounded-full blur-3xl opacity-70"></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-emerald-500 to-teal-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Be Part of the Movement
          </h2>
          <p className="text-xl text-emerald-50 mb-10">
            Join our waitlist and get early access when we launch. Your mental wellness journey begins here.
          </p>
          
          {!isSubmitted ? (
            <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="flex-1 px-6 py-4 rounded-full border-2 border-white/30 bg-white/10 backdrop-blur-sm text-white placeholder-emerald-100 focus:border-white focus:outline-none text-lg caret-white"
              />
              <button
                onClick={handleWaitlistClick}
                className="px-8 py-4 bg-white text-emerald-600 rounded-full font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2 whitespace-nowrap"
              >
                <span>Get Early Access</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="max-w-md mx-auto px-6 py-4 bg-white rounded-full flex items-center justify-center space-x-2 animate-bounce-in">
              <Check className="w-6 h-6 text-emerald-600" />
              <span className="text-emerald-700 font-semibold">Welcome to MindCare! Check your inbox.</span>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 bg-gray-900 text-gray-400">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand Section */}
            <div className="md:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" fill="white" />
                </div>
                <span className="text-xl font-bold text-white">MindCare</span>
              </div>
              <p className="text-sm leading-relaxed">
                Making mental wellness accessible to everyone, everywhere. Your journey to better mental health starts here.
              </p>
              <div className="mt-6">
                <p className="text-sm font-semibold text-white mb-2">Coming Soon</p>
                <p className="text-xs text-gray-500">Join our waitlist for early access</p>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-semibold mb-4">Platform</h3>
              <ul className="space-y-3">
                <li><a href="#features" className="hover:text-emerald-400 transition-colors text-sm">Features</a></li>
                <li><a href="#services" className="hover:text-emerald-400 transition-colors text-sm">Services</a></li>
                <li><a href="#about" className="hover:text-emerald-400 transition-colors text-sm">About Us</a></li>
                <li><a href="#waitlist" className="hover:text-emerald-400 transition-colors text-sm">Join Waitlist</a></li>
              </ul>
            </div>

            {/* Resources (Coming Soon) */}
            <div>
              <h3 className="text-white font-semibold mb-4">Resources</h3>
              <ul className="space-y-3">
                <li><a href="/coming-soon" className="hover:text-emerald-400 transition-colors text-sm flex items-center">Blog <span className="ml-2 text-xs bg-emerald-600 text-white px-2 py-0.5 rounded">Soon</span></a></li>
                <li><a href="/coming-soon" className="hover:text-emerald-400 transition-colors text-sm flex items-center">Help Center <span className="ml-2 text-xs bg-emerald-600 text-white px-2 py-0.5 rounded">Soon</span></a></li>
                <li><a href="/coming-soon" className="hover:text-emerald-400 transition-colors text-sm flex items-center">Community <span className="ml-2 text-xs bg-emerald-600 text-white px-2 py-0.5 rounded">Soon</span></a></li>
                <li><a href="/coming-soon" className="hover:text-emerald-400 transition-colors text-sm flex items-center">Therapist Directory <span className="ml-2 text-xs bg-emerald-600 text-white px-2 py-0.5 rounded">Soon</span></a></li>
              </ul>
            </div>

            {/* Legal & Contact */}
            <div>
              <h3 className="text-white font-semibold mb-4">Legal & Support</h3>
              <ul className="space-y-3">
                <li><a href="/coming-soon" className="hover:text-emerald-400 transition-colors text-sm">Privacy Policy</a></li>
                <li><a href="/coming-soon" className="hover:text-emerald-400 transition-colors text-sm">Terms of Service</a></li>
                <li><a href="/coming-soon" className="hover:text-emerald-400 transition-colors text-sm">Contact Us</a></li>
                <li><a href="mailto:support@mindcare.com" className="hover:text-emerald-400 transition-colors text-sm">support@mindcare.com</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-sm">© 2024 MindCare. All rights reserved.</p>
              <div className="flex items-center space-x-6">
                <a href="/admin" className="text-sm hover:text-emerald-400 transition-colors">Admin Portal</a>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-emerald-400">In Development</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes bounce-in {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out forwards;
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }

        .animate-bounce-in {
          animation: bounce-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
