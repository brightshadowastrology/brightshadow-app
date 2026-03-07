"use client";

/**
 * NOTE: In Next.js App Router this component must be dynamically imported
 * with { ssr: false } to avoid server-side rendering errors with @react-pdf/renderer.
 *
 * Example:
 *   const YearlyTransitsPDFDownload = dynamic(
 *     () => import('./pdf/YearlyTransitsPDFDownload'),
 *     { ssr: false },
 *   );
 */

import { useMemo } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import * as constants from "@/shared/lib/constants";
import { trpc } from "@/shared/lib/trpc";
import { useBirthChart } from "@/components/Providers/BirthChartContext";
import {
  type Eclipse,
  type Lunation,
  type MajorTransits,
  type RetrogradePeriod,
  type RetrogradeEvent,
  type IngressEntry,
  type TransitEntry,
} from "@/shared/types";
import {
  YearlyTransitsPDF,
  type MonthEvent,
  type MonthData,
} from "./YearlyTransitsPDF";

// ─── Pure helper functions (mirrored from YearlyTransits.tsx) ─────────────────

function getNext12Months(): { month: number; year: number; label: string }[] {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  return Array.from({ length: 13 }, (_, i) => {
    const monthIndex = (currentMonth + i) % 12;
    const year = currentYear + Math.floor((currentMonth + i) / 12);
    return {
      month: monthIndex,
      year,
      label: constants.MONTHS[monthIndex].label,
    };
  });
}

function getEclipsesForMonth(
  eclipses: Eclipse[],
  month: number,
  year: number,
): Eclipse[] {
  return eclipses
    .filter((e) => {
      const d = new Date(e.date);
      return d.getUTCMonth() === month && d.getUTCFullYear() === year;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

function getRetrogradesForMonth(
  retrogrades: RetrogradePeriod[],
  month: number,
  year: number,
): RetrogradeEvent[] {
  const events: RetrogradeEvent[] = [];
  for (const r of retrogrades) {
    const start = new Date(r.start.date);
    const end = new Date(r.end.date);
    if (start.getUTCMonth() === month && start.getUTCFullYear() === year) {
      events.push({
        date: r.start.date,
        position: r.start.position,
        isStarting: true,
      });
    }
    if (end.getUTCMonth() === month && end.getUTCFullYear() === year) {
      events.push({
        date: r.end.date,
        position: r.end.position,
        isStarting: false,
      });
    }
  }
  return events.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
}

function getLunationsForMonth(
  lunations: Lunation[],
  month: number,
  year: number,
): Lunation[] {
  return lunations
    .filter((l) => {
      const d = new Date(l.date);
      return d.getUTCMonth() === month && d.getUTCFullYear() === year;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

function getIngressesForMonth(
  ingresses: {
    planet: string;
    ingresses: {
      targetPosition: { sign: string };
      dates: { date: string }[];
    }[];
  }[],
  month: number,
  year: number,
): IngressEntry[] {
  const entries: IngressEntry[] = [];
  for (const planetData of ingresses) {
    for (const ingress of planetData.ingresses) {
      for (const d of ingress.dates) {
        const date = new Date(d.date);
        if (date.getUTCMonth() === month && date.getUTCFullYear() === year) {
          entries.push({
            date: d.date,
            planet: planetData.planet,
            sign: ingress.targetPosition.sign,
          });
        }
      }
    }
  }
  return entries.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
}

const ASPECT_KEYS = [
  "conjunct",
  "opposition",
  "superiorSquare",
  "inferiorSquare",
  "superiorTrine",
  "inferiorTrine",
  "superiorSextile",
  "inferiorSextile",
] as const;

function getTransitsForMonth(
  majorTransits: MajorTransits[],
  month: number,
  year: number,
): TransitEntry[] {
  const entries: TransitEntry[] = [];
  for (const mt of majorTransits) {
    for (const transit of mt.transits) {
      for (const aspectKey of ASPECT_KEYS) {
        const ingress = transit[aspectKey];
        if (!ingress) continue;
        for (const d of ingress.dates) {
          const date = new Date(d.date);
          if (date.getUTCMonth() === month && date.getUTCFullYear() === year) {
            entries.push({
              date: d.date,
              transitingPlanet: transit.planet,
              natalPlanet: mt.natalPlanet,
              aspect: aspectKey,
              position: d.position,
              natalPosition: mt.natalPosition,
              exactMatch: d.exactMatch,
            });
          }
        }
      }
    }
  }
  return entries.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function YearlyTransitsPDFDownload() {
  const months = getNext12Months();
  const dateParam = useMemo(() => new Date().toISOString(), []);
  const { birthChartData, birthInfo, sectPlanets, profectionYear } =
    useBirthChart();

  const { data: majorTransits, isLoading: majorTransitsLoading } =
    trpc.useQuery(
      [
        "astro.getMajorTransitsAllPlanets",
        { natalPlacements: birthChartData! },
      ],
      { enabled: !!birthChartData },
    );
  const { data: eclipses, isLoading: eclipsesLoading } = trpc.useQuery([
    "astro.getEclipses",
    { date: dateParam },
  ]);
  const { data: retrogrades, isLoading: retrogradesLoading } = trpc.useQuery([
    "astro.getMercuryRetrogradePeriods",
    { date: dateParam },
  ]);
  const { data: lunations, isLoading: lunationsLoading } = trpc.useQuery([
    "astro.getLunations",
    { date: dateParam },
  ]);
  const { data: ingresses, isLoading: ingressesLoading } = trpc.useQuery([
    "astro.getAllPlanetZeroDegreeIngresses",
    { date: dateParam },
  ]);

  const isLoading =
    eclipsesLoading ||
    retrogradesLoading ||
    lunationsLoading ||
    ingressesLoading ||
    majorTransitsLoading;

  const monthsData = useMemo<MonthData[]>(() => {
    if (
      !birthChartData ||
      !eclipses ||
      !retrogrades ||
      !lunations ||
      !ingresses ||
      !majorTransits
    ) {
      return [];
    }

    return months.map(({ month, year, label }) => {
      const monthEclipses = getEclipsesForMonth(eclipses, month, year);
      const monthRetrogrades = getRetrogradesForMonth(retrogrades, month, year);
      const eclipseSigns = new Set(monthEclipses.map((e) => e.position.sign));
      const monthLunations = getLunationsForMonth(
        lunations,
        month,
        year,
      ).filter((l) => !eclipseSigns.has(l.position.sign));
      const monthIngresses = getIngressesForMonth(ingresses, month, year);
      const monthTransits = getTransitsForMonth(majorTransits, month, year);

      const events: MonthEvent[] = [
        ...monthEclipses.map((e) => ({
          type: "eclipse" as const,
          date: e.date,
          data: e,
        })),
        ...monthLunations.map((l) => ({
          type: "lunation" as const,
          date: l.date,
          data: l,
        })),
        ...monthRetrogrades.map((r) => ({
          type: "retrograde" as const,
          date: r.date,
          data: r,
        })),
        ...monthIngresses.map((i) => ({
          type: "ingress" as const,
          date: i.date,
          data: i,
        })),
        ...monthTransits.map((t) => ({
          type: "transit" as const,
          date: t.date,
          data: t,
        })),
        ...(birthInfo &&
        parseInt(birthInfo.birthDate.slice(5, 7), 10) - 1 === month
          ? [
              {
                type: "birthday" as const,
                date: `${year}-${birthInfo.birthDate.slice(5, 10)}T00:00:00Z`,
                data: null,
              },
            ]
          : []),
      ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      return { label, year, events };
    });
  }, [
    birthChartData,
    eclipses,
    retrogrades,
    lunations,
    ingresses,
    majorTransits,
    birthInfo,
    months,
  ]);

  if (!birthChartData || !sectPlanets) return null;

  if (isLoading) {
    return (
      <button
        disabled
        className="px-4 py-2 rounded-md text-secondary-500 cursor-not-allowed w-full text-center"
      >
        Preparing PDF…
      </button>
    );
  }

  const document = (
    <YearlyTransitsPDF
      months={monthsData}
      birthChartData={birthChartData}
      sectPlanets={sectPlanets}
      profectionYear={profectionYear ?? undefined}
    />
  );

  return (
    <PDFDownloadLink document={document} fileName="yearly-transits.pdf">
      {({ loading }) => (
        <button
          className="px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
          disabled={loading}
        >
          {loading ? "Generating PDF…" : "Download PDF"}
        </button>
      )}
    </PDFDownloadLink>
  );
}

export default YearlyTransitsPDFDownload;
