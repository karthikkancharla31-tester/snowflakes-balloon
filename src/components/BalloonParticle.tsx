import { BalloonData } from '../types';

interface BalloonParticleProps {
  data: BalloonData;
}

export default function BalloonParticle({ data }: BalloonParticleProps) {
  // Dimensions
  const width = data.size;
  const height = data.size * 1.35; // golden ratio oval height
  
  return (
    <div
      id={`balloon-${data.id}`}
      style={{
        position: 'absolute',
        left: `${data.x}%`,
        top: `${data.y}vh`,
        width: `${width}px`,
        height: `${height + 55}px`, // spacious room for ribbon dangling string
        opacity: data.opacity,
        zIndex: 40,
        pointerEvents: 'none',
        transform: `translate(-50%, -50%) rotate(${data.rotation}deg)`,
        willChange: 'transform, top, left',
      }}
      className="select-none flex flex-col items-center justify-start transition-opacity duration-200"
    >
      <svg
        viewBox="0 0 100 180" // generous viewBox to accommodate ribbon and string
        className="w-full h-full drop-shadow-[0_4px_12px_rgba(0,0,0,0.2)]"
      >
        <defs>
          {/* Elegant 3D Radial Gradient for natural light reflection */}
          <radialGradient id={`balloon-grad-${data.id}`} cx="35%" cy="30%" r="55%" fx="35%" fy="30%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
            <stop offset="45%" stopColor={data.color} />
            <stop offset="100%" stopColor={darkenColor(data.color)} />
          </radialGradient>
        </defs>

        {/* Balloon Main Oval Body */}
        <path
          d="M 50 15 
             C 18 15, 12 60, 12 75 
             C 12 95, 25 118, 50 120 
             C 75 118, 88 95, 88 75 
             C 88 60, 82 15, 50 15 Z"
          fill={`url(#balloon-grad-${data.id})`}
        />

        {/* Glossy Curved Highlight */}
        <ellipse
          cx="34"
          cy="40"
          rx="10"
          ry="15"
          transform="rotate(-15, 34, 40)"
          fill="#ffffff"
          opacity="0.32"
        />

        {/* Balloon Bottom Knot */}
        <path
          d="M 45 119 L 55 119 L 57 127 L 43 127 Z"
          fill={darkenColor(data.color)}
        />

        {/* Ribbon String */}
        <path
          d={`M 50 126 
             Q ${50 + data.stringAngle} 142, 50 152 
             T ${50 - data.stringAngle / 2} 175`}
          stroke="#cbd5e1" // modern clean cool-gray string
          strokeWidth="1.75"
          fill="none"
          strokeLinecap="round"
          opacity="0.65"
        />
      </svg>
    </div>
  );
}

// Simple color utilities to darken pastel colors on-the-fly for gradients and knots
function darkenColor(hex: string): string {
  const colorMap: { [key: string]: string } = {
    '#cbd5e1': '#475569', // slate
    '#a7f3d0': '#047857', // sage green
    '#fecdd3': '#be123c', // rose
    '#bfdbfe': '#1d4ed8', // steel blue
    '#ddd6fe': '#5b21b6', // lavender
    '#ffedd5': '#c2410c', // peach
    '#fef08a': '#a16207', // gold
  };

  if (colorMap[hex]) return colorMap[hex];

  if (hex.startsWith('#') && hex.length === 7) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const dr = Math.floor(r * 0.6);
    const dg = Math.floor(g * 0.6);
    const db = Math.floor(b * 0.6);
    return `#${dr.toString(16).padStart(2, '0')}${dg.toString(16).padStart(2, '0')}${db.toString(16).padStart(2, '0')}`;
  }
  return '#334155';
}
