// components/HomePage/FAQ.tsx
'use client';

import { useState, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search, Sparkles } from 'lucide-react';

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
  
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0.5]);
  const y = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [50, 0, 0, 20]);

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section
      ref={sectionRef}
      className="relative py-20 bg-gradient-to-b from-[#0B0F1A] to-[#0A0B0E] overflow-hidden"
    >
      <div className="absolute inset-0">
        <div className="absolute bottom-20 left-20 w-64 h-64 rounded-full bg-[#1B2A56]/20 blur-3xl" />
        <div className="absolute top-20 right-20 w-48 h-48 rounded-full bg-[#8CA0DE]/10 blur-3xl" />
      </div>

      <motion.div
        style={{ opacity, y }}
        className="relative max-w-4xl mx-auto px-6"
      >
        <div className="text-center mb-8">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8CA0DE]">
            FAQ
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mt-2">
            Frequently Asked <span className="text-[#8CA0DE]">Questions</span>
          </h2>
        </div>

        {/* Search */}
        <div className="relative max-w-md mx-auto mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-full bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-[#8CA0DE]/50 outline-none transition-colors"
          />
        </div>

        <div className="space-y-3">
          {filteredFaqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-[#8CA0DE]/30 transition-all duration-300"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
              >
                <span className="text-white font-medium">{faq.question}</span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0 ml-4"
                >
                  <ChevronDown className="w-5 h-5 text-[#8CA0DE]" />
                </motion.div>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 pb-4"
                  >
                    <p className="text-white/60 text-sm leading-relaxed">{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {filteredFaqs.length === 0 && (
          <div className="text-center text-white/40 py-8">
            No questions found matching your search.
          </div>
        )}

        <div className="text-center mt-8">
          <button className="text-[#8CA0DE] hover:text-white transition-colors text-sm font-medium border border-[#1B2A56] px-6 py-2 rounded-full hover:border-[#8CA0DE] transition-all">
            View all FAQs →
          </button>
        </div>
      </motion.div>
    </section>
  );
}