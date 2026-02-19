"use client";

import { createContext, useContext, type ReactNode } from "react";
import { type PlanetPoint, type ProfectionYearData, type SectPlanets } from "@/shared/types";

export type BirthInfo = {
  birthDate: string;
  birthTime: string;
  location: string;
};

type BirthChartContextValue = {
  birthChartData: PlanetPoint[] | null;
  birthInfo: BirthInfo | null;
  profectionYear: ProfectionYearData | null;
  isDayChart: boolean | null;
  sectPlanets: SectPlanets | null;
};

const BirthChartContext = createContext<BirthChartContextValue | null>(null);

export function BirthChartProvider({
  value,
  birthInfo,
  profectionYear,
  isDayChart,
  sectPlanets,
  children,
}: {
  value: PlanetPoint[] | null;
  birthInfo: BirthInfo | null;
  profectionYear: ProfectionYearData | null;
  isDayChart: boolean | null;
  sectPlanets: SectPlanets | null;
  children: ReactNode;
}) {
  return (
    <BirthChartContext.Provider
      value={{ birthChartData: value, birthInfo, profectionYear, isDayChart, sectPlanets }}
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
