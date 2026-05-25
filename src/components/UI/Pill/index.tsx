import * as React from "react";

const PILL_CONFIG = {
  powerful: {
    colors: "bg-primary-300 text-primary-700 border-primary-700",
    text: "Powerful",
  },
  personallyFelt: {
    colors: "bg-primary-300 text-primary-700 border-primary-700",
    text: "Personally Felt",
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
  newBeginnings: {
    colors: "bg-primary-300 text-primary-700 border-primary-700",
    text: "New Beginnings",
  },
  lifeDefining: {
    colors: "bg-primary-300 text-primary-700 border-primary-700",
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
    <span className="inline-flex items-start gap-2">
      <span
        className={`inline-block rounded-full border px-3 py-1 text-xs font-medium ${colors}`}
      >
        {text}
      </span>
      {toolTip && <span className="text-sm text-primary-700">{toolTip}</span>}
    </span>
  );
};

export default Pill;
