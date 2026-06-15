import { SnowflakeData } from '../types';

interface SnowflakeParticleProps {
  data: SnowflakeData;
}

export default function SnowflakeParticle({ data }: SnowflakeParticleProps) {
  // Different geometric variations of high-quality vector snowflakes
  const renderSnowflakeSVG = () => {
    const seed = parseInt(data.id.slice(-2), 16) || 0;
    const variation = seed % 3;

    if (variation === 0) {
      // Intricate Stellar Dendrite Snowflake
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="w-full h-full text-slate-300 drop-shadow-[0_2px_8px_rgba(255,255,255,0.4)]"
        >
          {/* Main 6 spokes */}
          <line x1="12" y1="2" x2="12" y2="22" />
          <line x1="3.34" y1="7" x2="20.66" y2="17" />
          <line x1="3.34" y1="17" x2="20.66" y2="7" />
          
          {/* Branching v-shapes on vertical spoke */}
          <path d="M12 5l-2.5 2M12 5l2.5 2" />
          <path d="M12 9l-3.5 3M12 9l3.5 3" />
          <path d="M12 19l-2.5-2M12 19l2.5-2" />
          <path d="M12 15l-3.5-3M12 15l3.5-3" />
          
          {/* Branches on diagonal spokes */}
          <path d="M6.03 8.56l.46 3.12M6.03 8.56l3.12-.46" />
          <path d="M17.97 15.44l-.46-3.12M17.97 15.44l-3.12.46" />
          <path d="M6.03 15.44l3.12.46M6.03 15.44l-.46-3.12" />
          <path d="M17.97 8.56l-.46 3.12M17.97 8.56l-3.12-.46" />
        </svg>
      );
    } else if (variation === 1) {
      // Geometric Star Snowflake
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          className="w-full h-full text-blue-200/90 drop-shadow-[0_2px_10px_rgba(186,230,253,0.5)]"
        >
          {/* Main 6 cross links */}
          <line x1="12" y1="2" x2="12" y2="22" />
          <line x1="3.34" y1="7" x2="20.66" y2="17" />
          <line x1="3.34" y1="17" x2="20.66" y2="7" />
          
          {/* Inner hexagon connector */}
          <path d="M12 8.5l3.03 1.75v3.5L12 15.5l-3.03-1.75v-3.5L12 8.5z" strokeWidth="1" />
          
          {/* Spoke tips decorations */}
          <circle cx="12" cy="2" r="0.75" fill="currentColor" />
          <circle cx="12" cy="22" r="0.75" fill="currentColor" />
          <circle cx="3.34" cy="7" r="0.75" fill="currentColor" />
          <circle cx="20.66" cy="17" r="0.75" fill="currentColor" />
          <circle cx="3.34" cy="17" r="0.75" fill="currentColor" />
          <circle cx="20.66" cy="7" r="0.75" fill="currentColor" />
        </svg>
      );
    } else {
      // Ice Crystal Plate style
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="w-full h-full text-slate-100 drop-shadow-[0_2px_8px_rgba(255,255,255,0.4)]"
        >
          {/* 6 primary shafts */}
          <line x1="12" y1="3" x2="12" y2="21" />
          <line x1="4.2" y1="7.5" x2="19.8" y2="16.5" />
          <line x1="4.2" y1="16.5" x2="19.8" y2="7.5" />
          
          {/* Chevron star rings */}
          <path d="M12 6.5l2 1.15v2.3L12 11.1l-2-1.15V7.65L12 6.5z" />
          <path d="M12 4l3 1.73v3.46L12 11l-3-1.73V5.73L12 4z" strokeWidth="1" strokeDasharray="1 1" />
        </svg>
      );
    }
  };

  return (
    <div
      id={`snowflake-${data.id}`}
      style={{
        position: 'absolute',
        left: `${data.x}%`,
        top: `${data.y}vh`,
        width: `${data.size}px`,
        height: `${data.size}px`,
        opacity: data.opacity,
        zIndex: 40,
        pointerEvents: 'none',
        transform: `translate(-50%, -50%) rotate(${data.rotation}deg)`,
        willChange: 'transform, top, left',
      }}
      className="select-none flex items-center justify-center transition-opacity duration-200"
    >
      {renderSnowflakeSVG()}
    </div>
  );
}
