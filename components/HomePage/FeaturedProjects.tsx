// components/HomePage/FeaturedProjects.tsx
'use client';

import { useRef } from 'react';
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
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0.5]);
  const y = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [50, 0, 0, 20]);

  return (
    <section
      ref={sectionRef}
      className="relative py-20 bg-gradient-to-b from-[#0A0B0E] to-[#0B0F1A] overflow-hidden"
    >
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#8CA0DE]/5 blur-3xl" />
      </div>

      <motion.div
        style={{ opacity, y }}
        className="relative max-w-6xl mx-auto px-6"
      >
        <div className="text-center mb-12">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8CA0DE]">
            Open Source Innovation
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">
            Featured <span className="text-[#8CA0DE]">Projects</span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto mt-2 text-sm">
            Discover projects built by the Tech Rise Africa community
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className="group bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#8CA0DE]/30 transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#1B2A56]/50 flex items-center justify-center group-hover:bg-[#1B2A56] transition-colors">
                    <Code2 className="w-5 h-5 text-[#8CA0DE]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white group-hover:text-[#8CA0DE] transition-colors">
                      {project.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: project.languageColor }}
                      />
                      <span className="text-xs text-white/40">{project.language}</span>
                    </div>
                  </div>
                </div>
                <Sparkles className="w-4 h-4 text-[#8CA0DE]/40 group-hover:text-[#8CA0DE] transition-colors" />
              </div>
              <p className="text-sm text-white/60 mb-4">{project.description}</p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-white/40">
                  <Star className="w-4 h-4" />
                  <span>{project.stars}</span>
                </div>
                <div className="flex items-center gap-1 text-white/40">
                  <GitFork className="w-4 h-4" />
                  <span>{project.forks}</span>
                </div>
                <div className="flex items-center gap-1 text-white/40">
                  <Users className="w-4 h-4" />
                  <span>{project.contributors}</span>
                </div>
                <button className="ml-auto text-[#8CA0DE] hover:text-white transition-colors">
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}