import { useMemo } from "react";
import * as constants from "@/shared/lib/constants";
import { trpc } from "@/shared/lib/trpc";
import { useBirthChart } from "@/components/Providers/BirthChartContext";
import {
  type Eclipse,
  type Lunation,
  type MajorTransits,
  type RetrogradeEvent,
  type RetrogradePeriod,
  type IngressEntry,
  type TransitEntry,
} from "@/shared/types";
import MonthEclipse from "./MonthEclipse";
import MonthLunation from "./MonthLunation";
import MonthRetrograde from "./MonthRetrograde";
import MonthIngress from "./MonthIngress";
import MonthTransit from "./MonthTransit";
import LoadingIndicator from "./LoadingIndicator";

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
    .filter((eclipse) => {
      const date = new Date(eclipse.date);
      return date.getMonth() === month && date.getFullYear() === year;
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

    if (start.getMonth() === month && start.getFullYear() === year) {
      events.push({
        date: r.start.date,
        position: r.start.position,
        isStarting: true,
      });
    }
    if (end.getMonth() === month && end.getFullYear() === year) {
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
    .filter((lunation) => {
      const date = new Date(lunation.date);
      return date.getMonth() === month && date.getFullYear() === year;
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
        if (date.getMonth() === month && date.getFullYear() === year) {
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
          if (date.getMonth() === month && date.getFullYear() === year) {
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

export const YearlyTransits = () => {
  const months = getNext12Months();
  const dateParam = useMemo(() => new Date().toISOString(), []);
  const { birthChartData } = useBirthChart();

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

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <div className="space-y-6 w-full">
      {months.map(({ month, year, label }) => {
        const monthEclipses = eclipses
          ? getEclipsesForMonth(eclipses, month, year)
          : [];
        const monthRetrogrades = retrogrades
          ? getRetrogradesForMonth(retrogrades, month, year)
          : [];
        const eclipseSigns = new Set(
          monthEclipses.map((e) => e.position.sign),
        );
        const monthLunations = lunations
          ? getLunationsForMonth(lunations, month, year).filter(
              (l) => !eclipseSigns.has(l.position.sign),
            )
          : [];
        const monthIngresses = ingresses
          ? getIngressesForMonth(ingresses, month, year)
          : [];
        const monthTransits = majorTransits
          ? getTransitsForMonth(majorTransits, month, year)
          : [];

        const allEvents = [
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
        ].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        );

        return (
          <section
            key={`${label}-${year}`}
            className="w-full p-6 bg-gray-800 rounded-lg border border-gray-700"
          >
            <h3 className="text-xl font-semibold text-white">
              {label} {year}
            </h3>

            {allEvents.length > 0 && (
              <div className="mt-4 space-y-3">
                {allEvents.map((event) => {
                  switch (event.type) {
                    case "eclipse":
                      return (
                        <MonthEclipse
                          key={`eclipse-${event.data.date}`}
                          eclipse={event.data}
                          monthLabel={label}
                          year={year}
                        />
                      );
                    case "lunation":
                      return (
                        <MonthLunation
                          key={`lunation-${event.data.date}`}
                          lunation={event.data}
                          monthLabel={label}
                          year={year}
                        />
                      );
                    case "retrograde":
                      return (
                        <MonthRetrograde
                          key={`retrograde-${event.data.date}`}
                          retrograde={event.data}
                          monthLabel={label}
                          year={year}
                        />
                      );
                    case "ingress":
                      return (
                        <MonthIngress
                          key={`ingress-${event.data.date}-${event.data.planet}`}
                          ingress={event.data}
                          monthLabel={label}
                          year={year}
                        />
                      );
                    case "transit":
                      return (
                        <MonthTransit
                          key={`transit-${event.data.date}-${event.data.transitingPlanet}-${event.data.natalPlanet}-${event.data.aspect}`}
                          transit={event.data}
                          monthLabel={label}
                          year={year}
                        />
                      );
                  }
                })}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
};

export default YearlyTransits;
