import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cn } from '@/lib/utils';

interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
}

const Progress: React.FC<ProgressProps> = ({ value, max = 100, className }) => {
  return (
    <ProgressPrimitive.Root 
      className={cn("relative w-full h-2 bg-gray-200 rounded-full overflow-hidden", className)}
      value={value}
      max={max}
    >
      <ProgressPrimitive.Indicator 
        className="h-full bg-blue-500 transition-all duration-300"
        style={{ width: `${(value / max) * 100}%` }}
      />
    </ProgressPrimitive.Root>
  );
};

// Named export
export { Progress };