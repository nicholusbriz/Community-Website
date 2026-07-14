// components/HomePage/HeroStats.tsx
'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Users, Globe, FolderGit2, GraduationCap, Briefcase, Calendar } from 'lucide-react';

const targets = {
  members: 26000,
  countries: 65,
  projects: 1200,
  mentors: 600,
  partners: 80,
  events: 350,
};

export default function HeroStats() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const [counts, setCounts] = useState({
    members: 0,
    countries: 0,
    projects: 0,
    mentors: 0,
    partners: 0,
    events: 0,
  });

  useEffect(() => {
    if (!inView) return;
    let startTime: number | null = null;
    let animationId: number;
    const duration = 2000;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setCounts({
        members: Math.floor(targets.members * eased),
        countries: Math.floor(targets.countries * eased),
        projects: Math.floor(targets.projects * eased),
        mentors: Math.floor(targets.mentors * eased),
        partners: Math.floor(targets.partners * eased),
        events: Math.floor(targets.events * eased),
      });

      if (progress < 1) {
        animationId = requestAnimationFrame(animate);
      }
    };

    animationId = requestAnimationFrame(animate);
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [inView]);

  const stats = [
    { value: counts.members, label: 'Members', icon: Users, suffix: '+' },
    { value: counts.countries, label: 'Countries', icon: Globe, suffix: '+' },
    { value: counts.projects, label: 'Projects', icon: FolderGit2, suffix: '+' },
    { value: counts.mentors, label: 'Mentors', icon: GraduationCap, suffix: '+' },
    { value: counts.partners, label: 'Partners', icon: Briefcase, suffix: '+' },
    { value: counts.events, label: 'Events', icon: Calendar, suffix: '+' },
  ];

  return (
    <div ref={ref} className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: index * 0.08 }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-1 text-2xl md:text-3xl font-bold text-white">
            <stat.icon className="w-4 h-4 md:w-5 md:h-5 text-[#8CA0DE]" />
            <span>{stat.value.toLocaleString()}</span>
            <span>{stat.suffix}</span>
          </div>
          <p className="text-xs md:text-sm text-white/50 mt-1">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  );
}