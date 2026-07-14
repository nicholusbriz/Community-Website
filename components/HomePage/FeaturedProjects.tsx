// components/HomePage/FeaturedProjects.tsx
'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Star, 
  GitFork, 
  Users, 
  Code2,
  ExternalLink,
  Sparkles
} from 'lucide-react';

const projects = [
  {
    id: 1,
    name: 'AfriPay',
    description: 'Open-source payment processing for African businesses',
    stars: 234,
    forks: 67,
    contributors: 45,
    language: 'TypeScript',
    languageColor: '#3178C6',
  },
  {
    id: 2,
    name: 'KasiConnect',
    description: 'Community networking platform for local businesses',
    stars: 189,
    forks: 34,
    contributors: 28,
    language: 'Python',
    languageColor: '#3572A5',
  },
  {
    id: 3,
    name: 'EduLink Africa',
    description: 'Connecting students with educational resources',
    stars: 312,
    forks: 89,
    contributors: 67,
    language: 'JavaScript',
    languageColor: '#F7DF1E',
  },
  {
    id: 4,
    name: 'HealthBridge',
    description: 'Telemedicine platform for remote African communities',
    stars: 456,
    forks: 123,
    contributors: 89,
    language: 'React',
    languageColor: '#61DAFB',
  },
];

export default function FeaturedProjects() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0.5]);
  const y = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [50, 0, 0, 20]);

  return (
    <section
      ref={sectionRef}
      className="relative py-12 sm:py-20 bg-[#0A0B0E] overflow-hidden"
      style={{
        backgroundImage: isMobile 
          ? 'none' 
          : 'linear-gradient(to bottom, #0A0B0E, #0B0F1A)'
      }}
    >
      {/* Background decoration - hidden on mobile */}
      {!isMobile && (
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full bg-[#8CA0DE]/5 blur-3xl" />
        </div>
      )}

      <motion.div
        style={{ 
          opacity: isMobile ? 1 : opacity, 
          y: isMobile ? 0 : y 
        }}
        className="relative max-w-6xl mx-auto px-4 sm:px-6"
      >
        <div className="text-center mb-8 sm:mb-12">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8CA0DE]">
            Open Source Innovation
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mt-2">
            Featured <span className="text-[#8CA0DE]">Projects</span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto mt-2 text-xs sm:text-sm px-4">
            Discover projects built by the Tech Rise Africa community
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={!isMobile ? { y: -4 } : {}}
              className="group bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 hover:border-[#8CA0DE]/30 transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#1B2A56]/50 flex items-center justify-center group-hover:bg-[#1B2A56] transition-colors">
                    <Code2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#8CA0DE]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base text-white group-hover:text-[#8CA0DE] transition-colors">
                      {project.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full flex-shrink-0"
                        style={{ backgroundColor: project.languageColor }}
                      />
                      <span className="text-[10px] sm:text-xs text-white/40">
                        {project.language}
                      </span>
                    </div>
                  </div>
                </div>
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-[#8CA0DE]/40 group-hover:text-[#8CA0DE] transition-colors flex-shrink-0" />
              </div>
              <p className="text-xs sm:text-sm text-white/60 mb-3 sm:mb-4">
                {project.description}
              </p>
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm">
                <div className="flex items-center gap-1 text-white/40">
                  <Star className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>{project.stars}</span>
                </div>
                <div className="flex items-center gap-1 text-white/40">
                  <GitFork className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>{project.forks}</span>
                </div>
                <div className="flex items-center gap-1 text-white/40">
                  <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>{project.contributors}</span>
                </div>
                <button className="ml-auto text-[#8CA0DE] hover:text-white transition-colors">
                  <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}