'use client';

import { useState, useEffect } from 'react';
import Image from "next/image";
import { Menu, X } from 'lucide-react';
import { motion } from 'framer-motion';
import RotatingEarth from '../components/RotatingEarth';

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({ width: 800, height: 600 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const updateDimensions = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    // Simulate page loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white font-sans relative">
      {/* Loading Screen */}
      {isLoading && (
        <motion.div 
          className="fixed inset-0 z-[100] bg-[#0A0A0F] flex items-center justify-center"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="text-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <Image
                src="/community-website-logo.png"
                alt="Community Ecosystem Logo"
                width={80}
                height={80}
                className="rounded-lg"
                loading="eager"
              />
            </div>
            <motion.h1 
              className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#A78BFA] to-[#8B5CF6] bg-clip-text text-transparent"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Community Ecosystem
            </motion.h1>
            <motion.div 
              className="mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="w-48 h-1 bg-[#8B5CF6]/20 rounded-full mx-auto overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA]"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.2, delay: 0.6 }}
                />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}

      {/* Fixed Globe Background */}
      <div className="fixed inset-0 z-0 flex items-center justify-center pointer-events-none">
        <div className="w-full h-full flex items-center justify-center opacity-50">
          <RotatingEarth width={windowDimensions.width} height={windowDimensions.height} className="w-full h-full" />
        </div>
      </div>
      
      {/* Dark overlay for better content readability */}
      <div className="fixed inset-0 bg-[#0A0A0F]/50 z-0 pointer-events-none" />
      
      {/* Navigation */}
      <nav className="border-b border-[#8B5CF6]/20 bg-[#0A0A0F]/80 backdrop-blur-sm fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Image
                src="/community-website-logo.png"
                alt="Community Ecosystem Logo"
                width={40}
                height={40}
                className="rounded-lg"
                loading="eager"
              />
              <span className="font-semibold text-xl">Community Ecosystem</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <button className="text-gray-400 hover:text-white transition-colors">Features</button>
              <button className="text-gray-400 hover:text-white transition-colors">About</button>
              <button className="text-gray-400 hover:text-white transition-colors">Contact</button>
              <a href="/dashboard" className="bg-[#8B5CF6] text-white px-4 py-2 rounded-lg hover:bg-[#7C3AED] transition-colors shadow-lg shadow-[#8B5CF6]/25">
                Dashboard
              </a>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden bg-[#8B5CF6] p-2 rounded-lg shadow-lg"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#12121A] border-t border-[#8B5CF6]/20">
            <div className="px-4 py-4 space-y-2">
              <a
                href="/dashboard"
                className="block w-full text-left px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </a>
              <button
                className="block w-full text-left px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </button>
              <button
                className="block w-full text-left px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </button>
              <button
                className="block w-full text-left px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <motion.section 
        className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Build Stronger Communities
            <span className="block bg-gradient-to-r from-[#A78BFA] to-[#8B5CF6] bg-clip-text text-transparent">Together</span>
          </motion.h1>
          <motion.p 
            className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            A comprehensive platform where members can collaborate, learn, communicate, manage projects, 
            share knowledge, and participate in community activities.
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <a href="/dashboard" className="bg-[#8B5CF6] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#7C3AED] transition-colors shadow-lg shadow-[#8B5CF6]/25 text-center">
              Get Started
            </a>
            <a href="/dashboard" className="border border-[#8B5CF6]/30 bg-white/5 text-gray-200 px-8 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors backdrop-blur-sm text-center">
              Learn More
            </a>
          </motion.div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        className="py-16 px-4 sm:px-6 lg:px-8 bg-[#12121A]/30 backdrop-blur-sm relative z-10"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            className="text-3xl sm:text-4xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Platform Features
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature Cards */}
            {[
              { icon: "👤", title: "User Authentication", desc: "Secure registration and login system" },
              { icon: "📋", title: "Project Management", desc: "Create and manage community projects" },
              { icon: "💬", title: "Community Forum", desc: "Discussion boards and community posts" },
              { icon: "📅", title: "Events Management", desc: "Organize and manage community events" },
              { icon: "📚", title: "Learning Resources", desc: "Share educational content and resources" },
              { icon: "💬", title: "Team Chat", desc: "Real-time communication tools" },
              { icon: "👥", title: "User Profiles", desc: "Personalized user profiles" },
              { icon: "✅", title: "Task Assignment", desc: "Assign and track tasks within teams" },
              { icon: "📊", title: "Admin Dashboard", desc: "Administrative control panel" },
              { icon: "📈", title: "Reports & Analytics", desc: "Data insights and reporting" },
            ].map((feature, index) => (
              <motion.a
                key={index}
                href="/dashboard"
                className="bg-[#0A0A0F]/40 border border-[#8B5CF6]/30 rounded-xl p-6 text-left hover:shadow-lg hover:shadow-[#8B5CF6]/20 hover:border-[#8B5CF6]/60 transition-all cursor-pointer group backdrop-blur-md"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="font-semibold text-lg mb-2 group-hover:text-[#A78BFA] transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm">{feature.desc}</p>
              </motion.a>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Actors Section */}
      <motion.section 
        className="py-16 px-4 sm:px-6 lg:px-8 bg-[#12121A]/20 backdrop-blur-sm relative z-10"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            className="text-3xl sm:text-4xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Who Can Use Our Platform
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { role: "Visitor", desc: "Browse and explore community content" },
              { role: "Member", desc: "Full access to community features" },
              { role: "Team Leader", desc: "Manage projects and assign tasks" },
              { role: "Administrator", desc: "Full system control and oversight" },
            ].map((actor, index) => (
              <motion.a
                key={index}
                href="/dashboard"
                className="bg-[#0A0A0F]/40 border border-[#8B5CF6]/30 rounded-xl p-6 text-center hover:shadow-lg hover:shadow-[#8B5CF6]/20 hover:border-[#8B5CF6]/60 transition-all cursor-pointer group backdrop-blur-md"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
              >
                <div className="w-16 h-16 bg-[#8B5CF6]/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[#8B5CF6]/20 transition-colors">
                  <span className="text-2xl">👤</span>
                </div>
                <h3 className="font-semibold text-lg mb-2 group-hover:text-[#A78BFA] transition-colors">
                  {actor.role}
                </h3>
                <p className="text-gray-400 text-sm">{actor.desc}</p>
              </motion.a>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white relative z-10"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            className="text-3xl sm:text-4xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Ready to Build Your Community?
          </motion.h2>
          <motion.p 
            className="text-lg mb-8 opacity-90"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Join us in creating a professional community platform that showcases collaboration and teamwork.
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <a href="/dashboard" className="bg-[#0A0A0F] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#12121A] transition-colors shadow-lg text-center">
              Register Now
            </a>
            <a href="/dashboard" className="border border-white/30 bg-transparent text-white px-8 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors backdrop-blur-sm text-center">
              Contact Us
            </a>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer 
        className="border-t border-[#8B5CF6]/20 bg-[#0A0A0F] py-8 px-4 sm:px-6 lg:px-8 relative z-10"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p>&copy; 2026 Community Ecosystem Website. System Analysis & Design Project.</p>
        </div>
      </motion.footer>
    </div>
  );
}
