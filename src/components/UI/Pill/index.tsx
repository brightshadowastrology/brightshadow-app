import * as React from "react";

const PILL_CONFIG = {
  joyous: {
    colors: "bg-green-100 text-green-800 border-green-300",
    text: "Joyous",
  },
  excessive: {
    colors: "bg-yellow-100 text-yellow-800 border-yellow-300",
    text: "Excessive",
  },
  productive: {
    colors: "bg-orange-100 text-orange-800 border-orange-300",
    text: "Productive",
  },
  challenging: {
    colors: "bg-red-100 text-red-800 border-red-300",
    text: "Challenging",
  },
  significant: {
    colors: "bg-blue-100 text-blue-800 border-blue-300",
    text: "Significant",
  },
  lifeDefining: {
    colors: "bg-purple-100 text-purple-800 border-purple-300",
    text: "Life Defining",
  },
} as const;

export type PillLabel = keyof typeof PILL_CONFIG;

export interface PillProps {
  type: PillLabel;
  toolTip: string;
}

export const Pill: React.FC<PillProps> = ({ type, toolTip }) => {
  const { colors, text } = PILL_CONFIG[type];

  return (
    <span className="relative inline-block group">
      <span
        className={`inline-block rounded-full border px-3 py-1 text-xs font-medium cursor-default ${colors}`}
      >
        {text}
      </span>
      <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap rounded bg-gray-900 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
        {toolTip}
        <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
      </span>
    </span>
  );
};

export default Pill;
