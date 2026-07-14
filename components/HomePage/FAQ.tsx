// components/HomePage/FAQ.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search } from 'lucide-react';

const faqs = [
  {
    question: 'What is Tech Rise Africa?',
    answer: 'Tech Rise Africa is the largest technology community in Africa, connecting developers, innovators, entrepreneurs, and leaders across the continent. We provide mentorship, resources, networking opportunities, and a platform for collaboration and growth.',
  },
  {
    question: 'How do I join the community?',
    answer: 'You can join by clicking the "Join Community" button on our homepage. The process is simple: create an account, fill in your profile, and you\'ll gain access to all our resources, events, and networking opportunities.',
  },
  {
    question: 'Is Tech Rise Africa free to join?',
    answer: 'Yes! Tech Rise Africa is completely free to join. We believe in democratizing access to technology education and opportunities across Africa. Some premium programs and events may have fees, but the core community is free.',
  },
  {
    question: 'What kind of events do you organize?',
    answer: 'We organize a wide range of events including hackathons, workshops, meetups, conferences, and networking sessions. Events are held both virtually and in-person across major African cities.',
  },
  {
    question: 'How can I become a mentor?',
    answer: 'If you have experience in technology and want to give back to the community, you can apply to become a mentor through our mentorship program page. We\'re always looking for experienced professionals to guide the next generation.',
  },
  {
    question: 'What are the learning paths available?',
    answer: 'We offer learning paths in Web Development, Mobile Development, Data Science, AI/ML, Cloud Computing, and more. Each path includes curated resources, projects, and mentorship opportunities.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  
  const sectionRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Only use scroll animations on larger screens
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Apply transforms conditionally
  const opacity = useTransform(
    scrollYProgress, 
    [0, 0.1, 0.9, 1], 
    [0, 1, 1, 0.5]
  );
  
  const y = useTransform(
    scrollYProgress, 
    [0, 0.1, 0.9, 1], 
    [50, 0, 0, 20]
  );

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section
      ref={sectionRef}
      className="relative py-12 sm:py-20 bg-[#0A0B0E] overflow-hidden"
      style={{
        backgroundImage: isMobile 
          ? 'none' 
          : 'linear-gradient(to bottom, #0B0F1A, #0A0B0E)'
      }}
    >
      {/* Background decorations - hidden on mobile */}
      {!isMobile && (
        <div className="absolute inset-0">
          <div className="absolute bottom-20 left-20 w-48 sm:w-64 h-48 sm:h-64 rounded-full bg-[#1B2A56]/20 blur-3xl" />
          <div className="absolute top-20 right-20 w-36 sm:w-48 h-36 sm:h-48 rounded-full bg-[#8CA0DE]/10 blur-3xl" />
        </div>
      )}

      <motion.div
        style={{ 
          opacity: isMobile ? 1 : opacity, 
          y: isMobile ? 0 : y 
        }}
        className="relative max-w-4xl mx-auto px-4 sm:px-6"
      >
        <div className="text-center mb-6 sm:mb-8">
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-[#8CA0DE]">
            FAQ
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mt-2">
            Frequently Asked <span className="text-[#8CA0DE]">Questions</span>
          </h2>
        </div>

        {/* Search */}
        <div className="relative max-w-md mx-auto mb-6 sm:mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-white/30" />
          <input
            type="text"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-full bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-[#8CA0DE]/50 outline-none transition-colors text-xs sm:text-sm"
          />
        </div>

        <div className="space-y-2.5 sm:space-y-3">
          {filteredFaqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl overflow-hidden hover:border-[#8CA0DE]/30 transition-all duration-300"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors gap-2"
              >
                <span className="text-white text-xs sm:text-sm md:text-base font-medium">
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0 ml-2 sm:ml-4"
                >
                  <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-[#8CA0DE]" />
                </motion.div>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-4 sm:px-6 pb-3 sm:pb-4"
                  >
                    <p className="text-white/60 text-xs sm:text-sm leading-relaxed">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {filteredFaqs.length === 0 && (
          <div className="text-center text-white/40 py-6 sm:py-8 text-sm sm:text-base">
            No questions found matching your search.
          </div>
        )}

        <div className="text-center mt-6 sm:mt-8">
          <button className="text-[#8CA0DE] hover:text-white transition-colors text-xs sm:text-sm font-medium border border-[#1B2A56] px-4 sm:px-6 py-1.5 sm:py-2 rounded-full hover:border-[#8CA0DE] transition-all">
            View all FAQs →
          </button>
        </div>
      </motion.div>
    </section>
  );
}