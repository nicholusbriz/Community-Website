// components/HomePage/CommunityFeed.tsx
'use client';

import { useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  MessageCircle, 
  Heart, 
  Share2, 
  User, 
  Clock,
  Send,
  MoreHorizontal,
  Image as ImageIcon,
  Smile,
  TrendingUp,
  Users as UsersIcon,
  Sparkles
} from 'lucide-react';

const feedItems = [
  {
    id: 1,
    user: 'Adebayo O.',
    avatar: 'AO',
    role: 'Senior Developer at Google',
    time: '2 hours ago',
    content: 'Just launched my first open-source project! 🚀 A React library for building African payment integrations. Check it out!',
    likes: 45,
    comments: 12,
    shares: 8,
    tags: ['Open Source', 'React', 'Payments'],
    isOnline: true,
    isVerified: true,
  },
  {
    id: 2,
    user: 'Grace M.',
    avatar: 'GM',
    role: 'Founder of KasiPay',
    time: '4 hours ago',
    content: 'Our startup just raised $500K pre-seed! 🎉 Building the future of logistics globally. Huge thanks to the Developers Ecosystem community for the support!',
    likes: 89,
    comments: 23,
    shares: 34,
    tags: ['Startup', 'Funding', 'Logistics'],
    isOnline: true,
    isVerified: true,
  },
  {
    id: 3,
    user: 'Samuel K.',
    avatar: 'SK',
    role: 'ML Engineer at Microsoft',
    time: '6 hours ago',
    content: 'Free mentorship sessions available for junior developers. PM me if you need guidance! 💪 Let\'s grow together.',
    likes: 67,
    comments: 31,
    shares: 15,
    tags: ['Mentorship', 'Career', 'Support'],
    isOnline: false,
    isVerified: false,
  },
  {
    id: 4,
    user: 'Ngozi A.',
    avatar: 'NA',
    role: 'Community Organizer',
    time: '8 hours ago',
    content: 'Join us at the Lagos Tech Meetup next Saturday! Speakers from Google, Microsoft, and local startups. Register now!',
    likes: 123,
    comments: 45,
    shares: 67,
    tags: ['Events', 'Lagos', 'Networking'],
    isOnline: true,
    isVerified: false,
  },
];

const trendingTopics = [
  '#DevelopersEcosystem',
  '#OpenSource',
  '#GlobalTech',
  '#StartupFunding',
  '#DevCommunity',
];

export default function CommunityFeed() {
  const [likedPosts, setLikedPosts] = useState<number[]>([]);
  const [showComment, setShowComment] = useState<number | null>(null);
  const [commentText, setCommentText] = useState('');
  
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0.5]);
  const y = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [50, 0, 0, 20]);

  const toggleLike = (id: number) => {
    setLikedPosts(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-12 sm:py-20 bg-gradient-to-b from-[#0B0F1A] to-[#0A0B0E] overflow-hidden"
    >
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-[#8CA0DE]/5 blur-3xl" />
        <div className="absolute bottom-20 left-20 w-48 h-48 rounded-full bg-[#1B2A56]/20 blur-3xl" />
      </div>

      <motion.div
        style={{ opacity, y }}
        className="relative max-w-4xl mx-auto px-6"
      >
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 px-4">
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-[#8CA0DE]">
            Live Community
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mt-2 leading-tight">
            What's happening in the <span className="text-[#8CA0DE]">ecosystem</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main feed */}
          <div className="lg:col-span-2 space-y-4">
            {/* Stories bar */}
            <motion.div
              className="flex gap-2 sm:gap-3 p-3 sm:p-4 rounded-2xl bg-white/5 border border-white/10 overflow-x-auto backdrop-blur-md shadow-lg shadow-black/10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {feedItems.slice(0, 5).map((item, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 text-center cursor-pointer group"
                >
                  <div className="relative">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#8CA0DE] flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg shadow-black/20">
                      <span className="text-white font-semibold text-xs sm:text-sm">{item.avatar}</span>
                    </div>
                    {item.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#8CA0DE] border-2 border-[#0A0B0E]" />
                    )}
                  </div>
                  <p className="text-[10px] sm:text-xs text-white/40 mt-1 truncate w-12 sm:w-14">
                    {item.user.split(' ')[0]}
                  </p>
                </div>
              ))}
              <div className="flex-shrink-0 text-center cursor-pointer">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center hover:border-[#8CA0DE] transition-colors">
                  <span className="text-white/40 text-xl sm:text-2xl">+</span>
                </div>
                <p className="text-[10px] sm:text-xs text-white/40 mt-1">More</p>
              </div>
            </motion.div>

            {/* Posts */}
            {feedItems.map((item, index) => {
              const isLiked = likedPosts.includes(item.id);
              
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group bg-white/5 border border-white/10 rounded-2xl p-3 sm:p-4 md:p-5 hover:bg-white/10 transition-all duration-300 hover:border-[#8CA0DE]/30 shadow-lg shadow-black/10 backdrop-blur-md"
                >
                  <div className="flex items-start gap-3">
                    <div className="relative flex-shrink-0">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#8CA0DE] flex items-center justify-center shadow-lg shadow-black/20">
                        <span className="text-white font-semibold text-xs sm:text-sm">{item.avatar}</span>
                      </div>
                      {item.isOnline && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#8CA0DE] border-2 border-[#0A0B0E]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-white text-xs sm:text-sm">{item.user}</span>
                        {item.isVerified && (
                          <Sparkles className="w-3 h-3 text-[#8CA0DE]" />
                        )}
                        <span className="text-white/40 text-xs">•</span>
                        <span className="text-white/40 text-xs">{item.role}</span>
                        <span className="text-white/40 text-xs">•</span>
                        <span className="text-white/30 text-xs flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {item.time}
                        </span>
                      </div>
                      <p className="text-white/80 text-xs sm:text-sm leading-relaxed mt-1">
                        {item.content}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-[#1B2A56]/50 text-[#8CA0DE] border border-[#1B2A56] cursor-pointer hover:bg-[#1B2A56] transition-colors"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 sm:gap-6 mt-2 sm:mt-3 text-[10px] sm:text-xs">
                        <button
                          onClick={() => toggleLike(item.id)}
                          className={`flex items-center gap-1 transition-colors ${
                            isLiked ? 'text-[#8CA0DE]' : 'text-white/40 hover:text-[#8CA0DE]'
                          }`}
                        >
                          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isLiked ? 'fill-[#8CA0DE]' : ''}`} />
                          <span>{isLiked ? item.likes + 1 : item.likes}</span>
                        </button>
                        <button
                          onClick={() => setShowComment(showComment === item.id ? null : item.id)}
                          className="flex items-center gap-1 text-white/40 hover:text-[#8CA0DE] transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          <span>{item.comments}</span>
                        </button>
                        <button className="flex items-center gap-1 text-white/40 hover:text-[#8CA0DE] transition-colors">
                          <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          <span>{item.shares}</span>
                        </button>
                        <button className="text-white/30 hover:text-white/60 transition-colors ml-auto">
                          <MoreHorizontal className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </button>
                      </div>

                      {/* Comment input */}
                      {showComment === item.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-3 pt-3 border-t border-white/5"
                        >
                          <div className="flex items-center gap-2">
                            <div className="flex-1 flex items-center gap-2 bg-white/5 rounded-full px-2.5 sm:px-3 py-1 sm:py-1.5 border border-white/10 focus-within:border-[#8CA0DE]/50 transition-colors">
                              <input
                                type="text"
                                placeholder="Write a comment..."
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                className="flex-1 bg-transparent text-white text-xs sm:text-sm outline-none"
                              />
                              <button className="text-white/30 hover:text-white/60 transition-colors">
                                <Smile className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                              </button>
                              <button className="text-white/30 hover:text-white/60 transition-colors">
                                <ImageIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                              </button>
                            </div>
                            <button className="p-1 sm:p-1.5 rounded-full bg-[#8CA0DE] text-[#0A0B0E] hover:bg-white transition-colors shadow-lg shadow-black/20">
                              <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center"
            >
              <button className="text-[#8CA0DE] hover:text-white transition-colors text-xs sm:text-sm font-medium">
                View all activity →
              </button>
            </motion.div>
          </div>

          {/* Sidebar - Trending */}
          <div className="space-y-4">
            <motion.div
              className="p-3 sm:p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-lg shadow-black/10"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#8CA0DE]" />
                <span className="text-xs sm:text-sm font-semibold text-white">Trending</span>
              </div>
              <div className="space-y-2">
                {trendingTopics.map((topic, index) => (
                  <div
                    key={topic}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <span className="text-xs sm:text-sm text-white/60 hover:text-white transition-colors">
                      {topic}
                    </span>
                    <span className="text-[10px] sm:text-xs text-white/30">
                      #{index + 1}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="p-3 sm:p-4 rounded-2xl bg-gradient-to-br from-[#1B2A56] to-[#0A0B0E] border border-[#8CA0DE]/20 shadow-xl shadow-[#1B2A56]/30"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <UsersIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#8CA0DE]" />
                <span className="text-xs sm:text-sm font-semibold text-white">Community Stats</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">Online Now</span>
                  <span className="text-[#8CA0DE]">2,847</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">New Posts Today</span>
                  <span className="text-white">342</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/40">New Members</span>
                  <span className="text-[#8CA0DE]">127</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}