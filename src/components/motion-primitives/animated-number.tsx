// From Motion Primitives (https://motion-primitives.com/docs/animated-number), MIT.
// Local changes: the motion component is memoised (upstream recreates it every
// render, remounting on each update) and numbers format with a locale.
import { cn } from '../../lib/utils';
import { motion, SpringOptions, useSpring, useTransform } from 'motion/react';
import { useEffect, useMemo } from 'react';

export type AnimatedNumberProps = {
  value: number;
  className?: string;
  springOptions?: SpringOptions;
  as?: React.ElementType;
  locale?: string;
};

export function AnimatedNumber({
  value,
  className,
  springOptions,
  as = 'span',
  locale,
}: AnimatedNumberProps) {
  const MotionComponent = useMemo(
    () => motion.create(as as keyof JSX.IntrinsicElements),
    [as]
  );

  const spring = useSpring(value, springOptions);
  const display = useTransform(spring, (current) =>
    Math.round(current).toLocaleString(locale)
  );

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return (
    <MotionComponent className={cn('tabular-nums', className)}>
      {display}
    </MotionComponent>
  );
}
