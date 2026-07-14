// components/HomePage/PartnerNetwork.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'framer-motion';

const partners = [
  { name: 'Google', color: '#8CA0DE' },
  { name: 'Microsoft', color: '#8CA0DE' },
  { name: 'GitHub', color: '#8CA0DE' },
  { name: 'MongoDB', color: '#8CA0DE' },
  { name: 'Supabase', color: '#8CA0DE' },
  { name: 'AWS', color: '#8CA0DE' },
  { name: 'Flutter', color: '#8CA0DE' },
  { name: 'Vercel', color: '#8CA0DE' },
  { name: 'OpenAI', color: '#8CA0DE' },
];

export default function PartnerNetwork() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0.5]);
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [50, 0, 0, -20]);

  return (
    <section
      ref={sectionRef}
      className="relative py-12 sm:py-20 bg-[#0A0B0E] border-y border-white/5 overflow-hidden"
    >
      {/* Animated background glow */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-[#1B2A56]/20 via-transparent to-[#1B2A56]/20"
        style={{ opacity }}
      />
      
      <motion.div
        style={{ opacity, y }}
        className="relative max-w-6xl mx-auto px-6"
      >
        <div className="text-center mb-8 sm:mb-12">
          <p className="text-xs sm:text-sm font-medium text-white/40 uppercase tracking-wider">
            Trusted by leading technology companies
          </p>
          <motion.div
            className="h-[2px] w-16 sm:w-20 mx-auto mt-3 sm:mt-4 bg-gradient-to-r from-transparent via-[#8CA0DE] to-transparent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-6 px-4">
          {partners.map((partner, index) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              whileHover={{ scale: 1.08, y: -4 }}
              onHoverStart={() => setActiveIndex(index)}
              onHoverEnd={() => setActiveIndex(null)}
              className="relative group"
            >
              <div className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-white/5 border border-white/10 hover:border-[#8CA0DE]/30 transition-all duration-300 backdrop-blur-md shadow-lg shadow-black/10">
                <span 
                  className="font-semibold text-xs sm:text-sm transition-colors duration-300"
                  style={{
                    color: activeIndex === index ? partner.color : 'rgba(255,255,255,0.6)',
                  }}
                >
                  {partner.name}
                </span>
              </div>
              
              {/* Connection line animation on hover */}
              {activeIndex === index && (
                <motion.div
                  layoutId="partner-line"
                  className="absolute -bottom-1 left-1/2 w-8 h-[2px] bg-[#8CA0DE]"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                  style={{ x: '-50%' }}
                />
              )}
            </motion.div>
          ))}
        </div>

        {/* Animated connection lines between logos */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ opacity }}
        >
          <svg className="w-full h-full">
            <motion.line
              x1="20%"
              y1="40%"
              x2="80%"
              y2="40%"
              stroke="#8CA0DE"
              strokeWidth="0.5"
              strokeDasharray="4 8"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: 0.5 }}
              opacity={0.2}
            />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}