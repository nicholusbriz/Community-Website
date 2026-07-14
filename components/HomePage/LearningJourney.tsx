// components/HomePage/LearningJourney.tsx
'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  Code2, 
  BookOpen, 
  GitBranch, 
  Users, 
  Briefcase, 
  Rocket,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

const steps = [
  {
    id: 'start',
    title: 'Start Your Journey',
    description: 'Join the community and set your learning goals',
    icon: BookOpen,
    color: '#8CA0DE',
    duration: '2 weeks',
  },
  {
    id: 'learn',
    title: 'Learn the Fundamentals',
    description: 'Master core concepts through structured paths',
    icon: Code2,
    color: '#6C8BCF',
    duration: '3 months',
  },
  {
    id: 'build',
    title: 'Build Projects',
    description: 'Apply your skills to real-world projects',
    icon: GitBranch,
    color: '#4A7FC7',
    duration: '2 months',
  },
  {
    id: 'collaborate',
    title: 'Collaborate with Peers',
    description: 'Join open source and team projects',
    icon: Users,
    color: '#5A8FCF',
    duration: 'Ongoing',
  },
  {
    id: 'mentor',
    title: 'Get Mentorship',
    description: 'Learn from experienced professionals',
    icon: Users,
    color: '#3A6FB7',
    duration: '1 month+',
  },
  {
    id: 'career',
    title: 'Launch Your Career',
    description: 'Find internships, jobs, and opportunities',
    icon: Briefcase,
    color: '#7A9FDF',
    duration: '3 months',
  },
  {
    id: 'launch',
    title: 'Launch Your Startup',
    description: 'Build and scale your own company',
    icon: Rocket,
    color: '#8CA0DE',
    duration: 'Ongoing',
  },
];

export default function LearningJourney() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  return (
    <section
      ref={sectionRef}
      className="py-24 bg-gradient-to-b from-[#0A0B0E] to-[#0B0F1A]"
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8CA0DE]">
            Your Journey
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">
            Become an African <span className="text-[#8CA0DE]">Tech Leader</span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto mt-2 text-sm">
            Follow our structured path from beginner to industry leader.
          </p>
        </motion.div>

        {/* Steps timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#8CA0DE] via-[#4A7FC7] to-transparent" />

          <div className="space-y-8 pl-16">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.08 }}
                  className="relative group"
                >
                  {/* Timeline dot */}
                  <div className="absolute -left-[60px] top-0 w-4 h-4 rounded-full bg-[#1B2A56] border-2 border-[#8CA0DE] flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-[#8CA0DE]" />
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#8CA0DE]/30 transition-all duration-300 hover:bg-white/10">
                    <div className="flex flex-wrap items-start gap-4">
                      <div className="flex-shrink-0">
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: `${step.color}30` }}
                        >
                          <Icon className="w-6 h-6" style={{ color: step.color }} />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold text-white" style={{ color: step.color }}>
                            {step.title}
                          </h3>
                          <span className="text-xs px-2 py-1 rounded-full bg-white/5 text-white/40 border border-white/5">
                            {step.duration}
                          </span>
                        </div>
                        <p className="text-sm text-white/60 mt-1">{step.description}</p>
                        <div className="mt-2 flex items-center gap-2 text-xs text-white/30">
                          <span>Step {index + 1} of {steps.length}</span>
                          <span>•</span>
                          <CheckCircle className="w-3 h-3 text-[#8CA0DE]" />
                          <span>In progress</span>
                        </div>
                      </div>
                      <button className="flex-shrink-0 text-[#8CA0DE] hover:text-white transition-colors text-sm">
                        Learn More →
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Final CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="ml-16"
            >
              <div className="p-6 rounded-2xl bg-gradient-to-r from-[#1B2A56] to-[#2A3F7A] border border-[#8CA0DE]/20 text-center">
                <p className="text-white font-semibold">Ready to start your journey?</p>
                <button className="mt-3 px-6 py-2 rounded-full bg-[#8CA0DE] text-[#0A0B0E] font-medium hover:bg-white transition-colors text-sm inline-flex items-center gap-2">
                  Join Now
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}