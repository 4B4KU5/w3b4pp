'use client';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// The color spectrum logic based on frequency (simplified for MVP)
const getFrequencyColor = (index: number, total: number) => {
  const hue = (index / total) * 360; // 0 to 360 degrees
  return `hsl(${hue}, 100%, 50%)`;
};

export const RainbowEqualizer = ({ bands = 36, height = 200 }: { bands?: number; height?: number }) => {
  // Mock data for now - will hook into Web Audio API later
  const mockLevels = Array.from({ length: bands }, () => Math.random() * 100);

  return (
    <div className="relative w-full h-full flex items-end justify-center gap-1 p-4 bg-[#050505] rounded-xl border border-cyan-500/20 shadow-[0_0_20px_rgba(0,255,255,0.1)] overflow-hidden">
      {/* Background Circuitry Grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="h-full w-full bg-[linear-gradient(rgba(0,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
      </div>

      {mockLevels.map((level, i) => (
        <motion.div
          key={i}
          className="relative flex flex-col items-center justify-end w-full h-full"
          initial={{ scaleY: 0.1 }}
          animate={{ scaleY: level / 100 }}
          transition={{ duration: 0.1, ease: 'linear' }}
        >
          {/* The Glowing Bar */}
          <div 
            className="w-full rounded-t-sm shadow-[0_0_10px_currentColor] transition-all duration-100"
            style={{ 
              height: '100%', 
              backgroundColor: getFrequencyColor(i, bands),
              boxShadow: `0 0 15px ${getFrequencyColor(i, bands)}`
            }}
          />
          
          {/* Frequency Label (Bottom) */}
          <span className="text-[8px] text-cyan-400 mt-1 font-mono opacity-60">
            {Math.round(20 * Math.pow(2, (i / bands) * 8))}Hz
          </span>
        </motion.div>
      ))}
    </div>
  );
};
