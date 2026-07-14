// components/HomePage/Hero.tsx
'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  ArrowRight, 
  Play, 
  Sparkles,
  ChevronDown
} from 'lucide-react';
import AnimatedBackground from './HeroBackground';
import HeroStats from './HeroStats';

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Hero shrinks and blurs as user scrolls to next section
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.93]);
  const blur = useTransform(scrollYProgress, [0, 0.7], [0, 6]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0.6]);
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '-10%']);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen w-full overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at center, #16223F 0%, #0B0F1A 70%)',
      }}
    >
      <AnimatedBackground />
      
      <motion.div
        style={{ scale, filter: `blur(${blur}px)`, opacity, y }}
        className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 py-20"
      >
        <div className="max-w-6xl w-full mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mb-8"
          >
            <Sparkles className="w-4 h-4 text-[#8CA0DE]" />
            <span className="text-sm text-white/80">Africa's Largest Technology Community</span>
          </motion.div>

          {/* Main Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="space-y-4 mb-8"
          >
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight">
              <span className="text-white">Tech Rise</span>
              <span className="text-[#8CA0DE]"> Africa</span>
            </h1>
            <p className="text-2xl md:text-4xl lg:text-5xl font-semibold text-white/90">
              Learn. Build. Connect. Launch.
            </p>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base md:text-xl text-white/60 max-w-2xl mx-auto mb-10 px-4"
          >
            Join the largest community of developers, innovators, and entrepreneurs
            building the future of technology in Africa.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4 mb-16"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/join"
                className="group inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-white bg-gradient-to-r from-[#1B2A56] to-[#2A3F7A] hover:from-[#2A3F7A] hover:to-[#1B2A56] transition-all duration-300 shadow-xl shadow-[#1B2A56]/30 hover:shadow-2xl"
              >
                Join Community
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/ecosystem"
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-white bg-white/10 border border-white/20 backdrop-blur-sm hover:bg-white/20 transition-all duration-300"
              >
                Explore Ecosystem
              </Link>
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-white bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
            >
              <Play className="w-5 h-5" />
              Watch Demo
            </motion.button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="w-full px-2"
          >
            <HeroStats />
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-1.5"
        >
          <div className="w-1 h-2 rounded-full bg-white/40" />
        </motion.div>
      </motion.div>
    </section>
  );
}