// components/HomePage/EventsTimeline.tsx
'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Calendar, 
  MapPin, 
  Users, 
  Clock,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const events = [
  {
    id: 1,
    title: 'Tech Rise Africa Annual Summit 2026',
    date: 'December 15-17, 2026',
    time: '9:00 AM - 6:00 PM',
    location: 'Nairobi, Kenya',
    attendees: 2500,
    type: 'Conference',
    speakers: ['Dr. Jane Doe', 'John Kamau', 'Sarah Mwangi'],
    isPast: false,
  },
  {
    id: 2,
    title: 'AI & Machine Learning Workshop',
    date: 'December 20, 2026',
    time: '2:00 PM - 5:00 PM',
    location: 'Lagos, Nigeria',
    attendees: 150,
    type: 'Workshop',
    speakers: ['Dr. Adebayo O.', 'Grace Mwangi'],
    isPast: false,
  },
  {
    id: 3,
    title: 'Open Source Hackathon',
    date: 'January 5-7, 2027',
    time: '10:00 AM - 4:00 PM',
    location: 'Cape Town, South Africa',
    attendees: 300,
    type: 'Hackathon',
    speakers: ['Samuel Kariuki', 'Ngozi A.', 'Peter Ochieng'],
    isPast: false,
  },
];

export default function EventsTimeline() {
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
      className="relative py-12 sm:py-20 bg-gradient-to-b from-[#0B0F1A] to-[#0A0B0E] overflow-hidden"
    >
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-[#1B2A56]/20 blur-3xl" />
        <div className="absolute bottom-20 right-20 w-48 h-48 rounded-full bg-[#8CA0DE]/10 blur-3xl" />
      </div>

      <motion.div
        style={{ opacity, y }}
        className="relative max-w-5xl mx-auto px-6"
      >
        <div className="text-center mb-8 sm:mb-12 px-4">
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-[#8CA0DE]">
            Events
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mt-2 leading-tight">
            Upcoming <span className="text-[#8CA0DE]">Events</span> Across Africa
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto mt-2 text-xs sm:text-sm leading-relaxed">
            Join thousands of developers, innovators, and leaders at our events
          </p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-3 sm:left-4 top-0 bottom-0 w-px bg-gradient-to-b from-[#8CA0DE] via-[#4A7FC7] to-transparent" />

          <div className="space-y-6 sm:space-y-8 pl-10 sm:pl-12">
            {events.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {/* Timeline dot */}
                <div className="absolute -left-[34px] sm:-left-10 top-0 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-[#1B2A56] border-2 border-[#8CA0DE] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#8CA0DE]" />
                </div>

                <div className="group bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6 hover:border-[#8CA0DE]/30 transition-all duration-300 hover:bg-white/10 shadow-lg shadow-black/10 backdrop-blur-md">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-[10px] sm:text-xs font-medium px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-[#1B2A56] text-[#8CA0DE] border border-[#1B2A56]">
                          {event.type}
                        </span>
                        {!event.isPast && (
                          <span className="text-[10px] sm:text-xs font-medium px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-[#8CA0DE]/20 text-[#8CA0DE] border border-[#8CA0DE]/20">
                            Upcoming
                          </span>
                        )}
                      </div>
                      <h3 className="text-base sm:text-lg font-semibold text-white group-hover:text-[#8CA0DE] transition-colors">
                        {event.title}
                      </h3>
                      <div className="space-y-1 mt-2">
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-white/60">
                          <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#8CA0DE]" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-white/60">
                          <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#8CA0DE]" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-white/60">
                          <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#8CA0DE]" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-white/60">
                          <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#8CA0DE]" />
                          <span>{event.attendees.toLocaleString()} attending</span>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-1">
                        {event.speakers.map((speaker) => (
                          <span
                            key={speaker}
                            className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-white/5 text-white/40 border border-white/5"
                          >
                            {speaker}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button className="flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#8CA0DE] text-[#0A0B0E] font-medium hover:bg-white transition-colors text-[10px] sm:text-xs md:text-sm flex items-center gap-1 shadow-lg shadow-black/20">
                      Register
                      <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <button className="text-[#8CA0DE] hover:text-white transition-colors text-xs sm:text-sm font-medium border border-[#1B2A56] px-4 sm:px-6 py-1.5 sm:py-2 rounded-full hover:border-[#8CA0DE] transition-all">
              View all events →
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}