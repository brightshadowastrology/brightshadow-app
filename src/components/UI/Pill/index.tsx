import * as React from "react";
import { PILL_CONFIG } from "@/shared/lib/constants";

export type PillLabel = keyof typeof PILL_CONFIG;

export interface PillProps {
  type: PillLabel;
}

export const Pill: React.FC<PillProps> = ({ type }) => {
  const { colors, text } = PILL_CONFIG[type];

  return (
    <span
      className={`inline-block rounded-full border px-3 py-1 text-xs font-medium ${colors} min-w-25 text-center`}
    >
      {text}
    </span>
  );
};

export default Pill;
