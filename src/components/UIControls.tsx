import { Snowflake, Sparkles, Activity, RotateCcw, Play, Pause, Settings2 } from 'lucide-react';
import { EffectType, SizeOption, QuantityOption, SpeedOption } from '../types';

interface UIControlsProps {
  activeEffect: EffectType;
  timeLeft: number;
  totalSpawned: number;
  activeCount: number;
  
  // Customization configurations
  snowflakeSize: SizeOption;
  setSnowflakeSize: (val: SizeOption) => void;
  balloonSize: SizeOption;
  setBalloonSize: (val: SizeOption) => void;
  
  snowflakeQuantity: QuantityOption;
  setSnowflakeQuantity: (val: QuantityOption) => void;
  balloonQuantity: QuantityOption;
  setBalloonQuantity: (val: QuantityOption) => void;
  
  speed: SpeedOption;
  setSpeed: (val: SpeedOption) => void;
  
  wind: 'left' | 'none' | 'right';
  setWind: (wind: 'left' | 'none' | 'right') => void;
  
  // Execution Simulation Controls
  isPaused: boolean;
  setIsPaused: (val: boolean) => void;
  triggerEffect: (type: EffectType) => void;
  resetAll: () => void;
}

export default function UIControls({
  activeEffect,
  timeLeft,
  totalSpawned,
  activeCount,
  snowflakeSize,
  setSnowflakeSize,
  balloonSize,
  setBalloonSize,
  snowflakeQuantity,
  setSnowflakeQuantity,
  balloonQuantity,
  setBalloonQuantity,
  speed,
  setSpeed,
  wind,
  setWind,
  isPaused,
  setIsPaused,
  triggerEffect,
  resetAll,
}: UIControlsProps) {
  const percentageLeft = (timeLeft / 5) * 100;

  return (
    <div 
      id="control-board"
      className="w-full max-w-xl bg-white/[0.025] backdrop-blur-[24px] border border-white/10 rounded-[28px] p-6 sm:p-10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.6)] relative overflow-hidden transition-all duration-500 flex flex-col gap-6"
    >
      {/* Visual background atmospheric highlights */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.012),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.001)_1.5px,transparent_1.5px),linear-gradient(90deg,rgba(255,255,255,0.001)_1.5px,transparent_1.5px)] bg-[size:16px_16px] pointer-events-none" />

      {/* Header section with brand tags */}
      <div className="relative text-center sm:text-left">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2 justify-between items-center">
          <span className="block text-[11px] uppercase tracking-[3px] text-slate-400 font-semibold select-none">
            Atmospheric Orchestrator v1.2
          </span>
          {activeCount > 0 && (
            <span className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-slate-300">
              <span className={`w-1.5 h-1.5 rounded-full ${isPaused ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400 animate-ping'}`} />
              {isPaused ? 'Frozen / Paused' : `${activeCount} active vector particles`}
            </span>
          )}
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-light text-slate-100 tracking-tighter leading-none mb-3">
          Environmental Orchestrator
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md">
          Calibrate density, sizing, and vertical travel velocities under constant gravity vectors. Trigger active sequences with precise Web Audio telemetry feedback.
        </p>
      </div>

      {/* QUICK STATUS DISPLAY CARD */}
      <div className="grid grid-cols-3 gap-2.5 font-mono text-[10px] text-slate-300">
        <div className="bg-white/[0.015] border border-white/5 rounded-xl p-3 flex flex-col justify-between">
          <span className="text-slate-500 uppercase tracking-wider">SEQUENCE</span>
          <span className="font-semibold text-slate-200 truncate capitalize mt-1.5 text-xs">
            {activeEffect === 'none' ? 'Idle' : activeEffect}
          </span>
        </div>
        <div className="bg-white/[0.015] border border-white/5 rounded-xl p-3 flex flex-col justify-between">
          <span className="text-slate-500 uppercase tracking-wider">SESSION SPAWNS</span>
          <span className="font-semibold text-slate-200 mt-1.5 text-xs">{totalSpawned} units</span>
        </div>
        <div className="bg-white/[0.015] border border-white/5 rounded-xl p-3 flex flex-col justify-between">
          <span className="text-slate-500 uppercase tracking-wider">VELOCITY MATRIX</span>
          <span className="font-semibold text-emerald-400 mt-1.5 text-xs flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-emerald-400 opacity-80 animate-pulse" />
            Optimal
          </span>
        </div>
      </div>

      {/* MULTI-PARAMETER CONFIGURATION FORK */}
      <div id="parameter-rack" className="space-y-4 bg-white/[0.01] border border-white/5 p-4 rounded-2xl relative">
        <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[10px] uppercase tracking-wider mb-2">
          <Settings2 className="w-3 h-3 text-sky-400" />
          Simulation Parameters
        </div>

        {/* Global Travel Velocity Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3.5 border-b border-white/5">
          <div className="text-left">
            <div className="text-xs font-semibold text-slate-200">Simulation Velocity</div>
            <div className="text-[10px] text-slate-500">Global travel velocity modifier</div>
          </div>
          <div className="flex bg-black/25 p-0.5 rounded-lg border border-white/10 self-start sm:self-center">
            {(['slow', 'medium', 'fast'] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSpeed(s)}
                className={`px-3 py-1 text-[10px] font-bold tracking-wide uppercase rounded-md transition-all cursor-pointer ${
                  speed === s
                    ? 'bg-white/15 text-white shadow-sm border border-white/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Snowflake Customization Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pb-3.5 border-b border-white/5 text-left">
          {/* Size */}
          <div className="space-y-1.5">
            <div className="text-xs font-semibold text-slate-200 flex items-center gap-1">
              <Snowflake className="w-3.5 h-3.5 text-slate-400" />
              Snowflake Size
            </div>
            <div className="flex bg-black/25 p-0.5 rounded-lg border border-white/5">
              {(['small', 'medium', 'large'] as const).map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setSnowflakeSize(sz)}
                  className={`flex-1 text-center py-1 text-[9px] font-medium tracking-wide uppercase rounded transition-all cursor-pointer ${
                    snowflakeSize === sz
                      ? 'bg-white/10 text-white border border-white/10'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {sz === 'small' ? 'S' : sz === 'medium' ? 'M' : 'L'}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="space-y-1.5">
            <div className="text-xs font-semibold text-slate-200">Snowflake Quantity</div>
            <div className="flex bg-black/25 p-0.5 rounded-lg border border-white/5">
              {(['sparse', 'medium', 'dense'] as const).map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setSnowflakeQuantity(q)}
                  className={`flex-1 text-center py-1 text-[9px] font-medium tracking-wide uppercase rounded transition-all cursor-pointer ${
                    snowflakeQuantity === q
                      ? 'bg-white/15 text-white border border-white/15'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Balloon Customization Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pb-2 text-left">
          {/* Size */}
          <div className="space-y-1.5">
            <div className="text-xs font-semibold text-slate-200 flex items-center gap-1">
              <svg viewBox="0 0 100 100" className="w-3.5 h-3.5 text-slate-400" fill="currentColor">
                <path d="M50,10 C25,10 15,40 15,60 C15,80 30,95 50,95 C70,95 85,80 85,60 C85,40 75,10 50,10 Z" />
              </svg>
              Balloon Size
            </div>
            <div className="flex bg-black/25 p-0.5 rounded-lg border border-white/5">
              {(['small', 'medium', 'large'] as const).map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setBalloonSize(sz)}
                  className={`flex-1 text-center py-1 text-[9px] font-medium tracking-wide uppercase rounded transition-all cursor-pointer ${
                    balloonSize === sz
                      ? 'bg-white/10 text-white border border-white/10'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {sz === 'small' ? 'S' : sz === 'medium' ? 'M' : 'L'}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="space-y-1.5">
            <div className="text-xs font-semibold text-slate-200">Balloon Quantity</div>
            <div className="flex bg-black/25 p-0.5 rounded-lg border border-white/5">
              {(['sparse', 'medium', 'dense'] as const).map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setBalloonQuantity(q)}
                  className={`flex-1 text-center py-1 text-[9px] font-medium tracking-wide uppercase rounded transition-all cursor-pointer ${
                    balloonQuantity === q
                      ? 'bg-white/15 text-white border border-white/15'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Global Horizontal Wind modifier */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-3 border-t border-white/5 text-left">
          <div>
            <div className="text-xs font-semibold text-slate-200">Horizontal Wind force</div>
            <div className="text-[10px] text-slate-500 font-normal">Modifies horizontal drift and lean</div>
          </div>
          <div className="flex bg-black/20 p-0.5 rounded-lg border border-white/10">
            {(['left', 'none', 'right'] as const).map((w) => (
              <button
                key={w}
                type="button"
                onClick={() => setWind(w)}
                className={`px-3.5 py-1 text-[10px] font-bold tracking-wide uppercase rounded-md transition-all cursor-pointer ${
                  wind === w
                    ? 'bg-white/10 text-white border border-white/15'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {w === 'none' ? 'Calm' : `${w}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lifespan/Active timer progression bar */}
      {activeEffect !== 'none' && (
        <div className="bg-white/[0.015] border border-white/5 rounded-2xl p-4 space-y-2.5 text-left">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 font-medium flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
              <span className={`w-2 h-2 rounded-full bg-white ${isPaused ? '' : 'animate-pulse'}`} />
              Active Protocol Pipeline
            </span>
            <span className="font-mono text-slate-200 font-semibold">{timeLeft.toFixed(1)}s remaining</span>
          </div>
          <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div 
              style={{ width: `${percentageLeft}%` }}
              className={`h-full bg-gradient-to-r from-white/20 via-white/85 to-white/30 rounded-full transition-all duration-100 ease-linear ${isPaused ? 'opacity-50' : ''}`}
            />
          </div>
        </div>
      )}

      {/* PRIMARY EMISSION TRIGGERS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Trigger Snowflakes */}
        <button
          id="btn-snowflakes"
          type="button"
          onClick={() => triggerEffect('snowflakes')}
          disabled={activeEffect !== 'none'}
          className={`relative overflow-hidden flex items-center justify-center gap-3 py-4 px-6 rounded-xl border font-medium uppercase tracking-[1.5px] text-xs transition-all duration-300 shadow-md group ${
            activeEffect === 'snowflakes'
              ? 'bg-white/20 text-white border-white/40 shadow-[0_0_20px_rgba(255,255,255,0.15)]'
              : activeEffect !== 'none'
              ? 'opacity-30 cursor-not-allowed bg-white/2 text-slate-500 border-white/5'
              : 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/30 text-white cursor-pointer hover:-translate-y-0.5 active:translate-y-0'
          }`}
        >
          <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          <Snowflake className={`w-5 h-5 transition-transform group-hover:rotate-45 duration-500 ${activeEffect === 'snowflakes' ? 'animate-spin text-white' : 'text-slate-300'}`} />
          <div className="flex flex-col items-start text-left">
            <span className="text-xs font-semibold tracking-wider">Snowflakes</span>
            <span className="text-[9px] text-slate-400 font-normal normal-case tracking-normal">Trigger 5s cascade</span>
          </div>
        </button>

        {/* Trigger Balloons */}
        <button
          id="btn-balloons"
          type="button"
          onClick={() => triggerEffect('balloons')}
          disabled={activeEffect !== 'none'}
          className={`relative overflow-hidden flex items-center justify-center gap-3 py-4 px-6 rounded-xl border font-medium uppercase tracking-[1.5px] text-xs transition-all duration-300 shadow-md group ${
            activeEffect === 'balloons'
              ? 'bg-white/20 text-white border-white/40 shadow-[0_0_20px_rgba(255,255,255,0.15)]'
              : activeEffect !== 'none'
              ? 'opacity-30 cursor-not-allowed bg-white/2 text-slate-500 border-white/5'
              : 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/30 text-white cursor-pointer hover:-translate-y-0.5 active:translate-y-0'
          }`}
        >
          <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          <svg
            viewBox="0 0 100 120"
            className={`w-5 h-5 transition-transform group-hover:-translate-y-0.5 duration-300 ${
              activeEffect === 'balloons' ? 'text-white animate-bounce' : 'text-slate-300'
            }`}
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
          >
            <path d="M50,10 C25,10 15,40 15,60 C15,80 30,95 50,95 C70,95 85,80 85,60 C85,40 75,10 50,10 Z" fill="currentColor" fillOpacity="0.2" />
            <path d="M46,95 L54,95 L56,102 L44,102 Z" fill="currentColor" />
            <path d="M50,100 T47,120" strokeLinecap="round" />
          </svg>
          <div className="flex flex-col items-start text-left">
            <span className="text-xs font-semibold tracking-wider">Balloons</span>
            <span className="text-[9px] text-slate-400 font-normal normal-case tracking-normal">Trigger 5s float</span>
          </div>
        </button>
      </div>

      {/* DYNAMIC PIPELINE CONTROL DOCK (PLAY, PAUSE, RESUME, RESET) */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5">
        <div className="flex items-center gap-2">
          {/* PAUSE / RESUME */}
          <button
            id={isPaused ? "btn-resume" : "btn-pause"}
            type="button"
            disabled={activeEffect === 'none'}
            onClick={() => setIsPaused(!isPaused)}
            className={`py-2 px-4 rounded-xl border flex items-center gap-2 uppercase tracking-widest text-[10px] font-bold transition-all ${
              activeEffect === 'none'
                ? 'opacity-30 cursor-not-allowed text-slate-500 border-white/5 bg-white/[0.01]'
                : isPaused
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/35 hover:bg-emerald-500/20 cursor-pointer'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/35 hover:bg-amber-500/20 cursor-pointer'
            }`}
          >
            {isPaused ? (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                Resume Action
              </>
            ) : (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                Pause Action
              </>
            )}
          </button>
        </div>

        {/* COMPREHENSIVE FLUSH & RE-CALIBRATE / RESET */}
        <button
          id="btn-reset"
          type="button"
          onClick={resetAll}
          className="flex items-center gap-1.5 py-2 px-4 text-[10px] uppercase tracking-widest text-slate-300 hover:text-white bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/20 rounded-xl transition-all cursor-pointer font-bold"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Staging
        </button>
      </div>
    </div>
  );
}
