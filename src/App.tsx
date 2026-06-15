import { useState, useEffect, useRef, useCallback } from 'react';
import { EffectType, ParticleData, SnowflakeData, BalloonData, SizeOption, QuantityOption, SpeedOption } from './types';
import AtmosphereCanvas from './components/AtmosphereCanvas';
import UIControls from './components/UIControls';
import { playWhoosh, playPop, playAirFloat, playThump } from './lib/audio';

export default function App() {
  const [activeEffect, setActiveEffect] = useState<EffectType>('none');
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [particles, setParticles] = useState<ParticleData[]>([]);
  const [totalSpawned, setTotalSpawned] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Custom simulation customization parameters
  const [snowflakeSize, setSnowflakeSize] = useState<SizeOption>('medium');
  const [snowflakeQuantity, setSnowflakeQuantity] = useState<QuantityOption>('medium');
  const [balloonSize, setBalloonSize] = useState<SizeOption>('medium');
  const [balloonQuantity, setBalloonQuantity] = useState<QuantityOption>('medium');
  const [speed, setSpeed] = useState<SpeedOption>('medium');
  const [wind, setWind] = useState<'left' | 'none' | 'right'>('none');

  // Synchronize dynamic values to ref so simulation loop has immediate, thread-safe access
  const particlesRef = useRef<ParticleData[]>([]);
  particlesRef.current = particles;

  const isPausedRef = useRef<boolean>(false);
  isPausedRef.current = isPaused;

  const speedRef = useRef<SpeedOption>('medium');
  speedRef.current = speed;

  const windRef = useRef<'left' | 'none' | 'right'>('none');
  windRef.current = wind;

  // Complete cleanup and wipe of staging coordinates
  const resetAll = useCallback(() => {
    setParticles([]);
    setActiveEffect('none');
    setTimeLeft(0);
    setIsPaused(false);
  }, []);

  // Frame simulation ticker (runs continuously to calculate individual velocities)
  useEffect(() => {
    let animationId: number;

    const tick = () => {
      if (!isPausedRef.current) {
        // Translate speed name into travel step multipliers
        const speedVal = speedRef.current;
        const mult = speedVal === 'slow' ? 0.44 : speedVal === 'medium' ? 1.0 : 1.82;
        const currentWind = windRef.current;
        
        let shouldPlayPop = false;
        let shouldPlayThump = false;

        const nextParticles = particlesRef.current.map((p) => {
          const rotationSpeedAdjusted = p.rotationSpeed * mult;
          const nextRotation = p.rotation + rotationSpeedAdjusted;

          if (p.type === 'snowflake') {
            const nextY = p.y + p.speedY * mult;
            const nextSwayPhase = p.swayPhase + 0.032 * p.swayFrequency * mult;
            
            // Apply horizontal delta: sway + wind
            let xOffset = Math.sin(nextSwayPhase) * (p.swayAmplitude / 25) * mult;
            if (currentWind === 'left') {
              xOffset -= 0.35 * mult;
            } else if (currentWind === 'right') {
              xOffset += 0.35 * mult;
            }

            const nextX = Math.max(-10, Math.min(110, p.x + xOffset));

            return {
              ...p,
              y: nextY,
              x: nextX,
              swayPhase: nextSwayPhase,
              rotation: nextRotation,
            } as SnowflakeData;
          } else {
            const nextY = p.y - p.speedY * mult;
            const nextSwayPhase = p.swayPhase + 0.02 * p.swayFrequency * mult;

            let xOffset = Math.sin(nextSwayPhase) * (p.swayAmplitude / 30) * mult;
            if (currentWind === 'left') {
              xOffset -= 0.3 * mult;
            } else if (currentWind === 'right') {
              xOffset += 0.3 * mult;
            }

            const nextX = Math.max(-10, Math.min(110, p.x + xOffset));

            let stringAngle = Math.sin(nextSwayPhase) * 6;
            if (currentWind === 'left') stringAngle -= 9;
            if (currentWind === 'right') stringAngle += 9;

            return {
              ...p,
              y: nextY,
              x: nextX,
              swayPhase: nextSwayPhase,
              rotation: nextRotation,
              stringAngle,
            } as BalloonData;
          }
        });

        // Split active assets and trigger precise audio pops/thumps on boundary exit
        const remaining = nextParticles.filter((p) => {
          if (p.type === 'snowflake') {
            if (p.y >= 106) {
              shouldPlayPop = true;
              return false;
            }
            return true;
          } else {
            if (p.y <= -18) {
              shouldPlayThump = true;
              return false;
            }
            return true;
          }
        });

        if (shouldPlayPop) {
          playPop();
        }
        if (shouldPlayThump) {
          playThump();
        }

        setParticles(remaining);
      }

      animationId = requestAnimationFrame(tick);
    };

    animationId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationId);
  }, []);

  // Utility to yield unique physics configuration for newly generated particles
  const spawnSingleParticle = useCallback((type: 'snowflake' | 'balloon') => {
    const randomId = `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const xPos = Math.random() * 90 + 5; // offset slightly from screen boundaries
    const opacity = Math.random() * 0.32 + 0.65;
    const rotation = Math.random() * 360;

    let newParticle: ParticleData;

    if (type === 'snowflake') {
      // Customized size ranges
      let size = 20;
      if (snowflakeSize === 'small') {
        size = Math.random() * 5 + 9;
      } else if (snowflakeSize === 'medium') {
        size = Math.random() * 7 + 18;
      } else {
        size = Math.random() * 9 + 32;
      }

      newParticle = {
        id: randomId,
        type: 'snowflake',
        x: xPos,
        y: -5, // start slightly above screen top edge
        size,
        opacity,
        rotation,
        rotationSpeed: Math.random() * 1.5 - 0.75,
        speedY: Math.random() * 0.12 + 0.35, // base screen delta Y
        swayAmplitude: Math.random() * 25 + 10,
        swayFrequency: Math.random() * 1.2 + 0.4,
        swayPhase: Math.random() * Math.PI * 2,
      };
    } else {
      // Customized balloon sizes
      let size = 42;
      if (balloonSize === 'small') {
        size = Math.random() * 4 + 24;
      } else if (balloonSize === 'medium') {
        size = Math.random() * 8 + 38;
      } else {
        size = Math.random() * 10 + 58;
      }

      const balloonColors = [
        '#cbd5e1', // Slate gray metallic
        '#a7f3d0', // Sage mint
        '#fecdd3', // Blush pink
        '#bfdbfe', // Air blue
        '#ddd6fe', // Muted lavender
        '#ffedd5', // Warm peach cream
        '#fef08a', // Champagne gold
      ];
      const color = balloonColors[Math.floor(Math.random() * balloonColors.length)];

      newParticle = {
        id: randomId,
        type: 'balloon',
        x: xPos,
        y: 105, // start slightly below viewport
        size,
        opacity,
        rotation: Math.random() * 14 - 7,
        rotationSpeed: Math.random() * 0.2 - 0.1,
        speedY: Math.random() * 0.1 + 0.26,
        swayAmplitude: Math.random() * 24 + 12,
        swayFrequency: Math.random() * 0.8 + 0.4,
        swayPhase: Math.random() * Math.PI * 2,
        color,
        stringAngle: 0,
      };
    }

    setParticles((prev) => [...prev, newParticle]);
    setTotalSpawned((prev) => prev + 1);
  }, [snowflakeSize, balloonSize]);

  // Spawns interval ticker - reacts to paused/active parameters instantly
  useEffect(() => {
    if (activeEffect === 'none' || isPaused) return;

    const isSnowflake = activeEffect === 'snowflakes';
    let intervalMs = 180;

    if (isSnowflake) {
      intervalMs = snowflakeQuantity === 'sparse' ? 380 : snowflakeQuantity === 'medium' ? 140 : 70;
    } else {
      intervalMs = balloonQuantity === 'sparse' ? 620 : balloonQuantity === 'medium' ? 240 : 110;
    }

    const interval = setInterval(() => {
      spawnSingleParticle(isSnowflake ? 'snowflake' : 'balloon');
    }, intervalMs);

    return () => clearInterval(interval);
  }, [activeEffect, isPaused, snowflakeQuantity, balloonQuantity, spawnSingleParticle]);

  // Unified remaining 5-second lifespan countdown interval
  useEffect(() => {
    if (activeEffect === 'none' || isPaused) return;

    const countdown = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 0.1;
        if (next <= 0) {
          // Cease spawning completely, but let current dynamic particles complete their float/fall paths!
          setActiveEffect('none');
          return 0;
        }
        return next;
      });
    }, 100);

    return () => clearInterval(countdown);
  }, [activeEffect, isPaused]);

  // Trigger main animation pipeline
  const triggerEffect = (type: EffectType) => {
    if (activeEffect !== 'none') return;

    setIsPaused(false);
    setActiveEffect(type);
    setTimeLeft(5.0);

    // Prompt responsive synthetic sound immediately!
    if (type === 'snowflakes') {
      playWhoosh();
    } else {
      playAirFloat();
    }

    const isSnowflake = type === 'snowflakes';
    let numInitial = 10;
    if (isSnowflake) {
      numInitial = snowflakeQuantity === 'sparse' ? 4 : snowflakeQuantity === 'medium' ? 11 : 26;
    } else {
      numInitial = balloonQuantity === 'sparse' ? 2 : balloonQuantity === 'medium' ? 5 : 12;
    }

    const particleKey = isSnowflake ? 'snowflake' : 'balloon';
    for (let i = 0; i < numInitial; i++) {
      setTimeout(() => {
        // Prevent massive particle cluster floodages
        if (particlesRef.current.length < 250) {
          spawnSingleParticle(particleKey);
        }
      }, i * 30);
    }
  };

  return (
    <div 
      id="app-root"
      className="min-h-screen w-full bg-[#0f172a] text-slate-100 flex flex-col justify-between items-center p-4 relative overflow-hidden font-sans selection:bg-white/10 select-none"
      style={{ backgroundImage: 'radial-gradient(circle at top right, #1e293b, #0f172a)' }}
    >
      {/* Background radial soft light helper */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/[0.015] blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-white/[0.01] blur-[120px] rounded-full pointer-events-none" />

      {/* Decorative vector lines bounding the master frame (Minimalist Glass Framing Architecture) */}
      <div className="absolute top-4 left-6 right-6 bottom-4 border border-white/5 pointer-events-none rounded-2xl z-10 animate-fade-in" />

      {/* Minimal Top Header Badge */}
      <header className="w-full max-w-7xl mx-auto flex justify-between items-center pt-4 px-6 z-20 relative">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-slate-300 rounded-full" />
          <span className="font-mono text-xs uppercase tracking-widest text-slate-400 font-semibold">Digital Stage System</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-slate-500 font-mono">
          <span className="hidden sm:inline">COORDINATES: SECURE</span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block animate-ping" />
            Vite 6 Sandbox
          </span>
        </div>
      </header>

      {/* Central control command dashboard layout */}
      <main className="w-full flex-grow flex items-center justify-center py-10 z-20 px-4 relative">
        <UIControls
          activeEffect={activeEffect}
          timeLeft={timeLeft}
          totalSpawned={totalSpawned}
          activeCount={particles.length}
          snowflakeSize={snowflakeSize}
          setSnowflakeSize={setSnowflakeSize}
          balloonSize={balloonSize}
          setBalloonSize={setBalloonSize}
          snowflakeQuantity={snowflakeQuantity}
          setSnowflakeQuantity={setSnowflakeQuantity}
          balloonQuantity={balloonQuantity}
          setBalloonQuantity={setBalloonQuantity}
          speed={speed}
          setSpeed={setSpeed}
          wind={wind}
          setWind={setWind}
          isPaused={isPaused}
          setIsPaused={setIsPaused}
          triggerEffect={triggerEffect}
          resetAll={resetAll}
        />
      </main>

      {/* Interactive Staging Canvas Layer */}
      <AtmosphereCanvas
        particles={particles}
      />

      {/* Formal Aesthetic Footer */}
      <footer className="w-full max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center pb-4 px-6 z-20 relative border-t border-white/5 text-slate-500 font-mono text-[10px]">
        <div className="mb-2 sm:mb-0">
          SYSTEM PRESET: v1.2.0 • FROSTED_GLASS_STEM • MULTI_SYNTH
        </div>
        <div>
          DEVELOPED SECURELY IN GOOGLE AI STUDIO
        </div>
      </footer>
    </div>
  );
}
