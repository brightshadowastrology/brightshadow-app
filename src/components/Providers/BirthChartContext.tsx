"use client";

import { createContext, useContext, type ReactNode } from "react";
import { type PlanetPoint } from "@/shared/types";

type BirthChartContextValue = {
  birthChartData: PlanetPoint[] | null;
};

const BirthChartContext = createContext<BirthChartContextValue | null>(null);

export function BirthChartProvider({
  value,
  children,
}: {
  value: PlanetPoint[] | null;
  children: ReactNode;
}) {
  return (
    <BirthChartContext.Provider value={{ birthChartData: value }}>
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
