import { useEffect, useRef } from 'react';
import { useMotionValue, useSpring } from 'framer-motion';

interface CountUpProps {
  value: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function CountUp({ value, className, style }: CountUpProps) {
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { stiffness: 80, damping: 20 });
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => { motionValue.set(value); }, [value, motionValue]);
  useEffect(() => {
    return spring.on('change', (v) => {
      if (ref.current) ref.current.textContent = Math.round(v).toString();
    });
  }, [spring]);

  return <span ref={ref} className={className} style={style}>0</span>;
}
