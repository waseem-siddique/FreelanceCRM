import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import Beams from './Beams';
import DotGrid from './DotGrid';

const ThemeBackground = () => {
  const { theme } = useTheme();

  if (theme === 'dark') {
    return (
      <Beams
        beamWidth={3}
        beamHeight={30}
        beamNumber={20}
        lightColor="#ffffff"
        speed={2}
        noiseIntensity={1.75}
        scale={0.2}
        rotation={30}
      />
    );
  }

  return (
    <DotGrid 
      baseColor="#e2e8f0"
      activeColor="#cbd5e1"
      dotSize={4}
      gap={24}
    />
  );
};

export default ThemeBackground;
