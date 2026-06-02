import { useState } from 'react';

interface Props {
  className?: string;
  size?: number;
}

export default function Logo({ className, size = 48 }: Props) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={className}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #6C63FF, #FF6584)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: size * 0.4,
          fontWeight: 800,
          color: 'white',
          flexShrink: 0,
          fontFamily: 'var(--font-display)',
        }}
      >
        🗳️
      </div>
    );
  }

  return (
    <img
      src="/logo.png"
      alt="IEBC wa MCHONGO"
      width={size}
      height={size}
      className={className}
      style={{ objectFit: 'contain', display: 'block', flexShrink: 0 }}
      onError={() => setFailed(true)}
    />
  );
}
