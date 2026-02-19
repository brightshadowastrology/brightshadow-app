"use client";

import { createContext, useContext, type ReactNode } from "react";
import { type PlanetPoint, type ProfectionYearData } from "@/shared/types";

export type BirthInfo = {
  birthDate: string;
  birthTime: string;
  location: string;
};

type BirthChartContextValue = {
  birthChartData: PlanetPoint[] | null;
  birthInfo: BirthInfo | null;
  profectionYear: ProfectionYearData | null;
};

const BirthChartContext = createContext<BirthChartContextValue | null>(null);

export function BirthChartProvider({
  value,
  birthInfo,
  profectionYear,
  children,
}: {
  value: PlanetPoint[] | null;
  birthInfo: BirthInfo | null;
  profectionYear: ProfectionYearData | null;
  children: ReactNode;
}) {
  return (
    <BirthChartContext.Provider
      value={{ birthChartData: value, birthInfo, profectionYear }}
    >
      {children}
    </BirthChartContext.Provider>
  );
}

export function useBirthChart() {
  const context = useContext(BirthChartContext);
  if (!context) {
    throw new Error("useBirthChart must be used within a BirthChartProvider");
  }
  return context;
}
