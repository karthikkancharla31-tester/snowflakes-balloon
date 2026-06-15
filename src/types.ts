export type EffectType = 'none' | 'snowflakes' | 'balloons';

export type SizeOption = 'small' | 'medium' | 'large';
export type QuantityOption = 'sparse' | 'medium' | 'dense';
export type SpeedOption = 'slow' | 'medium' | 'fast';

export interface BaseParticle {
  id: string;
  x: number; // Current horizontal position (0 to 100vw)
  y: number; // Current vertical position (0 to 100vh)
  size: number; // Size in range based on selection
  opacity: number;
  rotation: number; // Current rotation angle
  rotationSpeed: number; // Rotation degrees per frame
}

export interface SnowflakeData extends BaseParticle {
  type: 'snowflake';
  speedY: number; // Vertical drop rate per frame
  swayAmplitude: number; // Current sway amplitude
  swayFrequency: number; // Frequency multiplier
  swayPhase: number; // Random start phase
}

export interface BalloonData extends BaseParticle {
  type: 'balloon';
  speedY: number; // Vertical float rate per frame
  swayAmplitude: number;
  swayFrequency: number;
  swayPhase: number;
  color: string;
  stringAngle: number;
}

export type ParticleData = SnowflakeData | BalloonData;
