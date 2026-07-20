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
  Sparkles,
  User,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const projects = [
  {
    id: 1,
    name: 'AfriPay',
    description: 'Open-source payment processing for African businesses',
    stars: 234,
    forks: 67,
    contributors: 45,
    language: 'TypeScript',
    languageColor: '#8CA0DE',
    owner: 'Sarah K.',
    ownerImage: null,
    ownerId: '1',
    slug: 'afripay',
  },
  {
    id: 2,
    name: 'KasiConnect',
    description: 'Community networking platform for local businesses',
    stars: 189,
    forks: 34,
    contributors: 28,
    language: 'Python',
    languageColor: '#8CA0DE',
    owner: 'James M.',
    ownerImage: null,
    ownerId: '2',
    slug: 'kasiconnect',
  },
  {
    id: 3,
    name: 'EduLink Africa',
    description: 'Connecting students with educational resources',
    stars: 312,
    forks: 89,
    contributors: 67,
    language: 'JavaScript',
    languageColor: '#8CA0DE',
    owner: 'Amina D.',
    ownerImage: null,
    ownerId: '3',
    slug: 'edulink-africa',
  },
  {
    id: 4,
    name: 'HealthBridge',
    description: 'Telemedicine platform for remote African communities',
    stars: 456,
    forks: 123,
    contributors: 89,
    language: 'React',
    languageColor: '#8CA0DE',
    owner: 'David O.',
    ownerImage: null,
    ownerId: '4',
    slug: 'healthbridge',
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
        <div className="text-center mb-6 sm:mb-12 px-4">
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-[#8CA0DE]">
            Open Source Innovation
          </span>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mt-2 leading-tight">
            Featured <span className="text-[#8CA0DE]">Projects</span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto mt-2 text-xs sm:text-sm leading-relaxed">
            Discover projects built by the Developers Ecosystem community
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
              className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-[#8CA0DE]/30 transition-all duration-300 cursor-pointer shadow-lg shadow-black/10 backdrop-blur-md"
            >
              {/* Card Header - Clickable for project details */}
              <Link href={`/projects/${project.slug}`} className="block p-3 sm:p-4 md:p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-xl bg-[#1B2A56]/50 flex items-center justify-center group-hover:bg-[#1B2A56] transition-colors">
                      <Code2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-[#8CA0DE]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-xs sm:text-sm md:text-base text-white group-hover:text-[#8CA0DE] transition-colors">
                        {project.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: project.languageColor }}
                        />
                        <span className="text-[9px] sm:text-[10px] sm:text-xs text-white/40">
                          {project.language}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-[#8CA0DE]/40 group-hover:text-[#8CA0DE] transition-colors flex-shrink-0" />
                </div>
                <p className="text-[10px] sm:text-xs md:text-sm text-white/60 mb-2 sm:mb-3 md:mb-4 leading-relaxed">
                  {project.description}
                </p>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 text-[10px] sm:text-xs md:text-sm">
                  <div className="flex items-center gap-1 text-white/40">
                    <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                    <span>{project.stars}</span>
                  </div>
                  <div className="flex items-center gap-1 text-white/40">
                    <GitFork className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                    <span>{project.forks}</span>
                  </div>
                  <div className="flex items-center gap-1 text-white/40">
                    <Users className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
                    <span>{project.contributors}</span>
                  </div>
                </div>
              </Link>

              {/* Card Footer - Owner Profile Section */}
              <div className="border-t border-white/10 bg-white/5 px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                <div className="flex items-center justify-between">
                  {/* Owner Profile - Clickable */}
                  <Link 
                    href={`/developers/${project.ownerId}`}
                    className="flex items-center gap-2 sm:gap-3 group/profile hover:bg-white/10 rounded-lg px-2 py-1 transition-colors"
                  >
                    {/* Owner Avatar */}
                    <div className="relative w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full overflow-hidden flex-shrink-0">
                      {project.ownerImage ? (
                        <Image
                          src={project.ownerImage}
                          alt={project.owner || 'Owner avatar'}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-xs sm:text-sm font-bold">
                          {project.owner?.[0]?.toUpperCase() || 'U'}
                        </div>
                      )}
                    </div>

                    {/* Owner Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="text-xs sm:text-sm font-medium text-white group-hover/profile:text-[#8CA0DE] transition-colors">
                          {project.owner}
                        </span>
                        <User className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-white/40" />
                      </div>
                      <p className="text-[9px] sm:text-[10px] sm:text-xs text-white/40">Project Owner</p>
                    </div>

                    {/* External Link Icon */}
                    <ExternalLink className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4 text-white/40 group-hover/profile:text-[#8CA0DE] transition-colors" />
                  </Link>

                  {/* View Project Button */}
                  <Link 
                    href={`/projects/${project.slug}`}
                    className="text-xs sm:text-sm font-medium text-[#8CA0DE] hover:text-white transition-colors flex items-center gap-1"
                  >
                    View
                    <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}