// components/HomePage/HeroBackground.tsx
'use client';

import { useEffect, useRef } from 'react';

export default function HeroBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const container = canvas.parentElement;
    if (!container) return;

    let width = container.clientWidth;
    let height = window.innerHeight;
    let frame = 0;
    let animationId: number;
    
    const resizeCanvas = () => {
      if (!container) return;
      width = container.clientWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    
    resizeCanvas();

    // Particles
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      opacity: number;
      pulse: number;
    }> = [];

    const numParticles = Math.min(150, Math.floor((width * height) / 8000));

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.1,
        pulse: Math.random() * Math.PI * 2,
      });
    }

    // Nodes
    const nodes: Array<{ x: number; y: number; radius: number; color: string }> = [
      { x: width * 0.5, y: height * 0.5, radius: 25, color: '#8CA0DE' },
      { x: width * 0.3, y: height * 0.4, radius: 15, color: '#6C8BCF' },
      { x: width * 0.7, y: height * 0.4, radius: 15, color: '#4A7FC7' },
      { x: width * 0.25, y: height * 0.65, radius: 12, color: '#3A6FB7' },
      { x: width * 0.75, y: height * 0.65, radius: 12, color: '#5A8FCF' },
      { x: width * 0.45, y: height * 0.75, radius: 10, color: '#7A9FDF' },
      { x: width * 0.55, y: height * 0.25, radius: 10, color: '#4A7FC7' },
    ];

    const connections: Array<[number, number]> = [
      [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6],
      [1, 3], [1, 4], [2, 4], [2, 6], [3, 5], [4, 5], [5, 6],
    ];

    const draw = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      // Aurora effect
      const auroraGrad = ctx.createRadialGradient(
        width * 0.2 + Math.sin(frame * 0.002) * 100,
        height * 0.3 + Math.cos(frame * 0.003) * 80,
        0,
        width * 0.2 + Math.sin(frame * 0.002) * 100,
        height * 0.3 + Math.cos(frame * 0.003) * 80,
        width * 0.6
      );
      auroraGrad.addColorStop(0, 'rgba(27, 42, 86, 0.15)');
      auroraGrad.addColorStop(0.5, 'rgba(140, 160, 222, 0.08)');
      auroraGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = auroraGrad;
      ctx.fillRect(0, 0, width, height);

      // Second aurora
      const auroraGrad2 = ctx.createRadialGradient(
        width * 0.8 + Math.cos(frame * 0.0025) * 150,
        height * 0.2 + Math.sin(frame * 0.002) * 100,
        0,
        width * 0.8 + Math.cos(frame * 0.0025) * 150,
        height * 0.2 + Math.sin(frame * 0.002) * 100,
        width * 0.5
      );
      auroraGrad2.addColorStop(0, 'rgba(140, 160, 222, 0.1)');
      auroraGrad2.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = auroraGrad2;
      ctx.fillRect(0, 0, width, height);

      // Draw connections
      connections.forEach(([a, b]) => {
        const nodeA = nodes[a];
        const nodeB = nodes[b];
        const dx = nodeB.x - nodeA.x;
        const dy = nodeB.y - nodeA.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const maxDist = Math.min(width, height) * 0.4;
        const opacity = Math.max(0, 1 - distance / maxDist) * 0.4;

        const gradient = ctx.createLinearGradient(nodeA.x, nodeA.y, nodeB.x, nodeB.y);
        gradient.addColorStop(0, `rgba(140, 160, 222, ${opacity * 0.5})`);
        gradient.addColorStop(0.5, `rgba(140, 160, 222, ${opacity})`);
        gradient.addColorStop(1, `rgba(140, 160, 222, ${opacity * 0.5})`);

        ctx.beginPath();
        ctx.moveTo(nodeA.x, nodeA.y);
        ctx.lineTo(nodeB.x, nodeB.y);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.5;
        ctx.shadowColor = 'rgba(140, 160, 222, 0.3)';
        ctx.shadowBlur = 10;
        ctx.stroke();
        ctx.shadowBlur = 0;
      });

      // Draw nodes
      nodes.forEach((node, index) => {
        const glow = ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, node.radius * 3
        );
        glow.addColorStop(0, `rgba(140, 160, 222, 0.3)`);
        glow.addColorStop(1, `rgba(140, 160, 222, 0)`);
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * 3, 0, Math.PI * 2);
        ctx.fill();

        const pulse = 1 + Math.sin(frame * 0.02 + index) * 0.05;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * pulse, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.shadowColor = 'rgba(140, 160, 222, 0.5)';
        ctx.shadowBlur = 20;
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fill();

        if (index === 0) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.font = 'bold 14px Inter, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('Tech Rise Africa', node.x, node.y - node.radius - 12);
        }
      });

      // Draw particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += 0.02;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        const opacity = p.opacity * (0.7 + 0.3 * Math.sin(p.pulse));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * (0.8 + 0.2 * Math.sin(p.pulse)), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(140, 160, 222, ${opacity})`;
        ctx.shadowColor = 'rgba(140, 160, 222, 0.2)';
        ctx.shadowBlur = 5;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      resizeCanvas();
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ background: 'transparent' }}
    />
  );
}