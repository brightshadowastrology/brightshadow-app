import * as React from "react";

const PILL_CONFIG = {
  notable: {
    colors: "bg-primary-300 text-primary-800 border-primary-800",
    text: "Notable",
  },
  joyous: {
    colors: "bg-accent-500 text-accent-900 border-accent-900",
    text: "Joyous",
  },
  excessive: {
    colors: "bg-accent-300 text-accent-700 border-accent-700",
    text: "Excessive",
  },
  productive: {
    colors: "bg-secondary-200 text-secondary-500 border-secondary-500",
    text: "Productive",
  },
  challenging: {
    colors: "bg-secondary-300 text-secondary-700 border-secondary-700",
    text: "Challenging",
  },
  powerful: {
    colors: "bg-secondary-400 text-secondary-800 border-secondary-800",
    text: "Powerful",
  },
  pivotPoint: {
    colors: "bg-primary-200 text-primary-500 border-primary-500",
    text: "Pivot Point",
  },
  timeLordEvent: {
    colors: "bg-primary-300 text-primary-700 border-primary-700",
    text: "Time Lord Event",
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
    <span className="inline-flex items-start gap-2">
      <span
        className={`inline-block rounded-full border px-3 py-1 text-xs font-medium ${colors} min-w-25 text-center`}
      >
        {text}
      </span>
      {toolTip && <span className="text-sm text-primary-700">{toolTip}</span>}
    </span>
  );
};

export default Pill;
