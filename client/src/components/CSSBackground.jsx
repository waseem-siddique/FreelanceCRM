import React from 'react';

const CSSBackground = () => {
  return (
    <div className="fixed inset-0 -z-10">
      {/* Animated gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FF9FFC] via-[#555167] to-[#B19EEF] animate-gradient" />
      {/* Noise overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.1\'/%3E%3C/svg%3E')] opacity-20 mix-blend-overlay" />
    </div>
  );
};

export default CSSBackground;