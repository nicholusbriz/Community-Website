// components/HomePage/SuccessStories.tsx
'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  Quote, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  Award,
  Briefcase,
  GraduationCap
} from 'lucide-react';

const stories = [
  {
    id: 1,
    name: 'Adebayo Ogunlesi',
    role: 'Senior Developer at Google',
    content: 'Tech Rise Africa transformed my career. The mentorship program connected me with industry leaders who helped me grow from a junior developer to leading teams at Google.',
    rating: 5,
    avatar: 'AO',
    achievement: 'Google Promotion',
    company: 'Google',
    tag: 'Career Growth',
  },
  {
    id: 2,
    name: 'Grace Mwangi',
    role: 'Founder of KasiPay',
    content: 'The startup ecosystem at Tech Rise Africa is unmatched. We found our first investors, built our MVP, and launched to 10K users in just 6 months.',
    rating: 5,
    avatar: 'GM',
    achievement: '$500K Raised',
    company: 'KasiPay',
    tag: 'Startup Success',
  },
  {
    id: 3,
    name: 'Samuel Kariuki',
    role: 'ML Engineer at Microsoft',
    content: 'I learned more in one year with Tech Rise Africa than in my entire university education. The hands-on projects and community support are incredible.',
    rating: 5,
    avatar: 'SK',
    achievement: 'Microsoft Hire',
    company: 'Microsoft',
    tag: 'Career Change',
  },
  {
    id: 4,
    name: 'Ngozi Adebayo',
    role: 'PhD Candidate in AI',
    content: 'The research community and mentorship I found here guided my journey to pursuing a PhD in AI. I now contribute to cutting-edge research in natural language processing.',
    rating: 5,
    avatar: 'NA',
    achievement: 'PhD Scholarship',
    company: 'Stanford',
    tag: 'Education',
  },
];

export default function SuccessStories() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0.5]);
  const y = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [50, 0, 0, 20]);

  const next = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % stories.length);
  };

  const prev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + stories.length) % stories.length);
  };

  // Auto-play
  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, []);

  const story = stories[currentIndex];
  const Icon = story.tag === 'Career Growth' ? Award : 
              story.tag === 'Startup Success' ? Briefcase : 
              GraduationCap;

  return (
    <section
      ref={sectionRef}
      className="relative py-20 bg-gradient-to-b from-[#0A0B0E] to-[#0B0F1A] overflow-hidden"
    >
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-[#8CA0DE]/5 blur-3xl" />
      </div>

      <motion.div
        style={{ opacity, y }}
        className="relative max-w-4xl mx-auto px-6"
      >
        <div className="text-center mb-8">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8CA0DE]">
            Success Stories
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">
            Our <span className="text-[#8CA0DE]">Community</span> in Action
          </h2>
        </div>

        <div className="relative">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              initial={{ opacity: 0, x: direction * 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -direction * 50 }}
              transition={{ duration: 0.5 }}
              className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 hover:border-[#8CA0DE]/30 transition-all duration-300"
            >
              <div className="flex flex-col items-center text-center">
                {/* Quote icon */}
                <Quote className="w-12 h-12 text-[#8CA0DE]/30 mb-4" />

                {/* Content */}
                <p className="text-white/80 text-lg md:text-xl leading-relaxed max-w-2xl">
                  "{story.content}"
                </p>

                {/* Avatar & Info */}
                <div className="flex items-center gap-4 mt-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#1B2A56] to-[#8CA0DE] flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-semibold text-xl">{story.avatar}</span>
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold text-white text-lg">{story.name}</h4>
                    <p className="text-white/60 text-sm">{story.role}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Icon className="w-4 h-4 text-[#8CA0DE]" />
                      <span className="text-sm text-[#8CA0DE]">{story.achievement}</span>
                    </div>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex gap-1 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-[#8CA0DE] text-[#8CA0DE]" />
                  ))}
                </div>

                {/* Tag */}
                <div className="mt-4">
                  <span className="text-xs px-3 py-1 rounded-full bg-[#1B2A56] text-[#8CA0DE] border border-[#1B2A56]">
                    {story.tag}
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={prev}
              className="p-2 rounded-full border border-white/20 hover:border-[#8CA0DE] hover:bg-[#8CA0DE]/10 transition-all duration-300"
            >
              <ChevronLeft className="w-5 h-5 text-white/60" />
            </button>
            <div className="flex items-center gap-2">
              {stories.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDirection(index > currentIndex ? 1 : -1);
                    setCurrentIndex(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex ? 'w-8 bg-[#8CA0DE]' : 'bg-white/20'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="p-2 rounded-full border border-white/20 hover:border-[#8CA0DE] hover:bg-[#8CA0DE]/10 transition-all duration-300"
            >
              <ChevronRight className="w-5 h-5 text-white/60" />
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}