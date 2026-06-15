import React from 'react';
import { ParticleData } from '../types';
import SnowflakeParticle from './SnowflakeParticle';
import BalloonParticle from './BalloonParticle';

interface AtmosphereCanvasProps {
  particles: ParticleData[];
}

export default function AtmosphereCanvas({ particles }: AtmosphereCanvasProps) {
  return (
    <div 
      id="atmosphere-canvas"
      className="fixed inset-0 pointer-events-none overflow-hidden select-none"
      style={{ zIndex: 30 }}
    >
      {particles.map((particle) => {
        if (particle.type === 'snowflake') {
          return (
            <React.Fragment key={particle.id}>
              <SnowflakeParticle data={particle} />
            </React.Fragment>
          );
        } else {
          return (
            <React.Fragment key={particle.id}>
              <BalloonParticle data={particle} />
            </React.Fragment>
          );
        }
      })}
    </div>
  );
}
