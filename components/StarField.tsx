
import React, { useMemo } from 'react';

const StarField: React.FC = () => {
  const stars = useMemo(() => {
    return Array.from({ length: 150 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: `${Math.random() * 2 + 1}px`,
      duration: `${Math.random() * 3 + 2}s`,
    }));
  }, []);

  return (
    <div className="star-field">
      {stars.map((star) => (
        <div
          key={star.id}
          className="star"
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            // @ts-ignore
            '--duration': star.duration,
          }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent pointer-events-none" />
    </div>
  );
};

export default StarField;
