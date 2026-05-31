import * as React from "react";

const PILL_CONFIG = {
  powerful: {
    colors: "bg-primary-300 text-primary-700 border-primary-700",
    text: "Powerful",
  },
  joyous: {
    colors: "bg-primary-300 text-primary-700 border-primary-700",
    text: "Joyous",
  },
  excessive: {
    colors: "bg-primary-300 text-primary-700 border-primary-700",
    text: "Excessive",
  },
  productive: {
    colors: "bg-primary-300 text-primary-700 border-primary-700",
    text: "Productive",
  },
  challenging: {
    colors: "bg-primary-300 text-primary-700 border-primary-700",
    text: "Challenging",
  },
  pivotPoint: {
    colors: "bg-primary-300 text-primary-700 border-primary-700",
    text: "Pivot Point",
  },
  lifeDefining: {
    colors: "bg-primary-300 text-primary-700 border-primary-700",
    text: "Life Defining",
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
