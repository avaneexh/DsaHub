import { Check } from "lucide-react";

const SolvedProgressRing = ({
  solved = 0,
  total = 0,
  size = 140,
  strokeWidth = 10,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const progress =
    total === 0 ? 0 : Math.min(solved / total, 1);

  const offset = circumference * (1 - progress);

  return (
    <div className="flex flex-col items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle (unsolved) */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-neutral-300 dark:text-neutral-700"
        />

        {/* Solved progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="text-black dark:text-white transition-all duration-700"
        />
      </svg>

      {/* Center content */}
      <div className="absolute flex flex-col items-center">
        <div className="text-2xl font-semibold text-black dark:text-white">
          {solved}
          <span className="text-sm text-neutral-500 dark:text-neutral-400">
            /{total}
          </span>
        </div>

        <div className="mt-1 flex items-center gap-1 text-sm text-black dark:text-white">
          <Check className="w-4 h-4" />
          Solved
        </div>
      </div>
    </div>
  );
};

export default SolvedProgressRing;
 