// components/HomePage/EcosystemSection.tsx
'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  Users, 
  GraduationCap, 
  Briefcase, 
  Building2, 
  Lightbulb, 
  Rocket,
  Code2,
  Sparkles,
  GitBranch,
  Zap
} from 'lucide-react';

interface EcosystemNode {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
  description: string;
  stats: string;
}

const ecosystemNodes: EcosystemNode[] = [
  { 
    id: 'center', 
    label: 'Tech Rise Africa', 
    icon: Sparkles, 
    color: '#8CA0DE',
    description: 'The heart of Africa\'s tech ecosystem',
    stats: '26,000+ Members'
  },
  { 
    id: 'developers', 
    label: 'Developers', 
    icon: Code2, 
    color: '#8CA0DE',
    description: 'Building the future, one line at a time',
    stats: '12,000+ Active'
  },
  { 
    id: 'students', 
    label: 'Students', 
    icon: GraduationCap, 
    color: '#8CA0DE',
    description: 'Learning and growing together',
    stats: '8,000+ Enrolled'
  },
  { 
    id: 'startups', 
    label: 'Startups', 
    icon: Rocket, 
    color: '#8CA0DE',
    description: 'Launching the next big thing',
    stats: '400+ Founded'
  },
  { 
    id: 'mentors', 
    label: 'Mentors', 
    icon: Users, 
    color: '#8CA0DE',
    description: 'Guiding the next generation',
    stats: '600+ Mentors'
  },
  { 
    id: 'companies', 
    label: 'Companies', 
    icon: Briefcase, 
    color: '#8CA0DE',
    description: 'Hiring and partnering',
    stats: '80+ Partners'
  },
  { 
    id: 'universities', 
    label: 'Universities', 
    icon: Building2, 
    color: '#8CA0DE',
    description: 'Academic excellence',
    stats: '50+ Connected'
  },
  { 
    id: 'projects', 
    label: 'Projects', 
    icon: Lightbulb, 
    color: '#8CA0DE',
    description: 'Open source innovation',
    stats: '1,200+ Projects'
  },
];

// Node connections - all strings now
const connections: [string, string, number][] = [
  ['center', 'developers', 1],
  ['center', 'students', 2],
  ['center', 'startups', 3],
  ['center', 'mentors', 4],
  ['center', 'companies', 5],
  ['center', 'universities', 6],
  ['center', 'projects', 7],
  ['developers', 'projects', 8],
  ['startups', 'projects', 9],
  ['students', 'universities', 10],
  ['developers', 'mentors', 11],
  ['startups', 'mentors', 12],
  ['startups', 'companies', 13],
];

export default function EcosystemSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });
  const [visibleNodes, setVisibleNodes] = useState<string[]>(['center']);
  const [activeConnections, setActiveConnections] = useState<string[]>([]);

  // Animate nodes appearing sequentially when section comes into view
  useEffect(() => {
    if (!isInView) return;

    let currentIndex = 0;
    const totalNodes = ecosystemNodes.length;
    
    const interval = setInterval(() => {
      currentIndex++;
      if (currentIndex >= totalNodes) {
        clearInterval(interval);
        return;
      }
      
      const newVisible = ecosystemNodes.slice(0, currentIndex + 1).map(n => n.id);
      setVisibleNodes(newVisible);
      
      // Update connections - filter using string comparison
      const active = connections
        .filter(([from, to]) => newVisible.includes(from) && newVisible.includes(to))
        .map(([from, to]) => `${from}-${to}`);
      setActiveConnections(active);
    }, 400);

    return () => clearInterval(interval);
  }, [isInView]);

  // Get node position for SVG
  const getNodePosition = (id: string): { x: number; y: number } => {
    const positions: Record<string, { x: number; y: number }> = {
      center: { x: 50, y: 50 },
      developers: { x: 25, y: 30 },
      students: { x: 20, y: 65 },
      startups: { x: 75, y: 30 },
      mentors: { x: 80, y: 65 },
      companies: { x: 65, y: 80 },
      universities: { x: 35, y: 80 },
      projects: { x: 50, y: 18 },
    };
    return positions[id] || { x: 50, y: 50 };
  };

  const isNodeVisible = (id: string) => visibleNodes.includes(id);
  const isConnectionActive = (from: string, to: string) => 
    activeConnections.includes(`${from}-${to}`) || activeConnections.includes(`${to}-${from}`);

  return (
    <section
      ref={sectionRef}
      className="relative py-16 sm:py-24 bg-gradient-to-b from-[#0B0F1A] to-[#0A0B0E] overflow-hidden"
    >
      <div className="relative w-full max-w-5xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12 px-4"
        >
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-[#8CA0DE]">
            The Ecosystem
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mt-2 leading-tight">
            One Community. <span className="text-[#8CA0DE]">Infinite Possibilities.</span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto mt-2 text-xs sm:text-sm leading-relaxed">
            An interconnected network of developers, innovators, and leaders driving
            Africa's technology revolution forward.
          </p>
        </motion.div>

        {/* SVG Ecosystem Visualization */}
        <motion.div 
          className="relative w-full aspect-square max-w-lg sm:max-w-xl md:max-w-2xl mx-auto"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <svg viewBox="0 0 400 400" className="w-full h-full">
            {/* Connection lines */}
            {connections.map(([from, to, index]) => {
              const fromPos = getNodePosition(from);
              const toPos = getNodePosition(to);
              const active = isConnectionActive(from, to);
              const visible = isNodeVisible(from) && isNodeVisible(to);

              // Calculate positions
              const x1 = fromPos.x * 4;
              const y1 = fromPos.y * 4;
              const x2 = toPos.x * 4;
              const y2 = toPos.y * 4;

              return (
                <motion.line
                  key={`${from}-${to}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#8CA0DE"
                  strokeWidth={active ? 2 : 0.5}
                  opacity={visible ? (active ? 0.6 : 0.1) : 0}
                  initial={{ pathLength: 0 }}
                  animate={{ 
                    pathLength: visible && active ? 1 : 0,
                  }}
                  transition={{ 
                    duration: 0.8, 
                    delay: index * 0.05,
                    ease: 'easeInOut'
                  }}
                  strokeLinecap="round"
                />
              );
            })}

            {/* Nodes */}
            {ecosystemNodes.map((node) => {
              const pos = getNodePosition(node.id);
              const visible = isNodeVisible(node.id);
              const Icon = node.icon;
              const isCenter = node.id === 'center';
              
              // Calculate positions
              const cx = pos.x * 4;
              const cy = pos.y * 4;
              const radius = isCenter ? 28 : 18;
              const glowRadius = isCenter ? 50 : 30;
              const iconSize = isCenter ? 24 : 16;
              const iconOffset = isCenter ? 12 : 8;
              const labelY = cy + (isCenter ? 50 : 35);
              const statsY = cy + 70;

              return (
                <g key={node.id}>
                  {/* Glow */}
                  <motion.circle
                    cx={cx}
                    cy={cy}
                    r={glowRadius}
                    fill={node.color}
                    opacity={visible ? 0.1 : 0}
                    animate={visible ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  />
                  
                  {/* Node circle */}
                  <motion.circle
                    cx={cx}
                    cy={cy}
                    r={radius}
                    fill={node.color}
                    opacity={visible ? 1 : 0}
                    initial={{ scale: 0 }}
                    animate={visible ? { scale: 1 } : { scale: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  />
                  
                  {/* Inner glow */}
                  <motion.circle
                    cx={cx}
                    cy={cy}
                    r={isCenter ? 8 : 5}
                    fill="rgba(255,255,255,0.5)"
                    opacity={visible ? 0.4 : 0}
                    animate={visible ? { 
                      scale: [1, 1.3, 1],
                      opacity: [0.4, 0.8, 0.4]
                    } : {}}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  />

                  {/* Icon */}
                  {visible && (
                    <motion.g
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      <Icon 
                        x={cx - iconOffset}
                        y={cy - iconOffset}
                        width={iconSize}
                        height={iconSize}
                        color="white"
                        opacity={0.9}
                      />
                    </motion.g>
                  )}

                  {/* Label */}
                  <motion.text
                    x={cx}
                    y={labelY}
                    textAnchor="middle"
                    className="text-xs font-medium fill-white"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: visible ? 0.9 : 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    style={{ fontSize: isCenter ? 10 : 8 }}
                  >
                    {node.label}
                  </motion.text>

                  {/* Stats - only for center node */}
                  {visible && isCenter && (
                    <motion.text
                      x={cx}
                      y={statsY}
                      textAnchor="middle"
                      className="text-[8px] fill-[#8CA0DE]"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      {node.stats}
                    </motion.text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Stats overlay */}
          <motion.div
            className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 bg-white/5 backdrop-blur-md rounded-lg px-3 py-2 border border-white/10 shadow-lg shadow-black/10"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.8 }}
          >
            <div className="flex items-center gap-2 text-white/40 text-[10px] sm:text-xs">
              <GitBranch className="w-3 h-3" />
              <span>Connections: {activeConnections.length}</span>
            </div>
            <div className="flex items-center gap-2 text-white/40 text-[10px] sm:text-xs mt-1">
              <Zap className="w-3 h-3" />
              <span>Nodes: {visibleNodes.length}</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}