import * as React from "react";
import Pill from "../Pill";
import { PILL_CONFIG } from "@/shared/lib/constants";

export type PillLabel = keyof typeof PILL_CONFIG;

export interface PillProps {
  type: PillLabel;
  toolTip: string;
}

export const InfoPill: React.FC<PillProps> = ({ type, toolTip }) => {
  return (
    <span className="inline-flex items-start gap-2">
      <Pill type={type} />
      {toolTip && <span className="text-sm text-primary-700">{toolTip}</span>}
    </span>
  );
};

export default InfoPill;
