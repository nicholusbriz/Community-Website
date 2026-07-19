// components/HomePage/FooterCTA.tsx
'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function FooterCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 1.02]);
  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0.5, 1, 1, 0.8]);

  return (
    <section
      ref={sectionRef}
      className="relative py-16 sm:py-20 md:py-24 lg:py-32 overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at center, #16223F 0%, #0B0F1A 100%)',
      }}
    >
      {/* Background effects */}
      <motion.div
        className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#8CA0DE]/10 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[#1B2A56]/30 blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        style={{ scale, opacity }}
        className="relative max-w-4xl mx-auto px-6 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 mb-4 sm:mb-6 shadow-lg shadow-black/20">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#8CA0DE]" />
            <span className="text-xs sm:text-sm text-white/80 font-medium">Join the movement</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight">
            Ready to be part of <br />
            <span className="text-[#8CA0DE]">the global tech revolution?</span>
          </h2>

          <p className="text-white/60 text-sm sm:text-base md:text-lg max-w-2xl mx-auto mb-6 sm:mb-8 md:mb-10 leading-relaxed">
            Join thousands of developers, innovators, and leaders building the future
            of technology globally. Your journey starts here.
          </p>

          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 px-4">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/join"
                className="inline-flex items-center gap-2 px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-full font-semibold text-[#0B0F1A] bg-white hover:shadow-xl transition-all duration-300 text-sm sm:text-base shadow-lg shadow-black/20"
              >
                Join Community
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-full font-semibold text-white bg-white/10 border border-white/20 backdrop-blur-md hover:bg-white/20 hover:border-white/30 transition-all duration-300 shadow-lg shadow-black/10 text-sm sm:text-base"
              >
                Learn More
              </Link>
            </motion.div>
          </div>

          {/* Stats footer */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 pt-8 border-t border-white/5"
          >
            <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 max-w-xs sm:max-w-md mx-auto">
              <div>
                <div className="text-lg sm:text-xl font-bold text-[#8CA0DE]">26K+</div>
                <div className="text-[10px] sm:text-xs text-white/40">Members</div>
              </div>
              <div>
                <div className="text-lg sm:text-xl font-bold text-[#8CA0DE]">65+</div>
                <div className="text-[10px] sm:text-xs text-white/40">Countries</div>
              </div>
              <div>
                <div className="text-lg sm:text-xl font-bold text-[#8CA0DE]">1.2K+</div>
                <div className="text-[10px] sm:text-xs text-white/40">Projects</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}