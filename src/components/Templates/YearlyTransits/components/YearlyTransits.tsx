import { useMemo } from "react";
import * as constants from "@/shared/lib/constants";
import { trpc } from "@/shared/lib/trpc";
import { useBirthChart } from "@/components/Providers/BirthChartContext";
import {
  type Eclipse,
  type Lunation,
  type MajorTransitsWithOrb,
  type RetrogradeEvent,
  type RetrogradePeriod,
  type IngressEntry,
  type TransitEntry,
  type ProfectionYearData,
} from "@/shared/types";
import MonthEclipse from "./MonthEclipse";
import MonthLunation from "./MonthLunation";
import MonthRetrograde from "./MonthRetrograde";
import MonthIngress from "./MonthIngress";
import MonthTransit from "./MonthTransit";
import MonthIngressWithOrb from "./MonthIngressWithOrb";
import MonthBirthday from "./MonthBirthday";
import LoadingIndicator from "@/components/UI/LoadingIndicator";
import ProfectionYear from "./ProfectionYear";

function getNext12Months(
  startMonth = new Date().getMonth(),
  startYear = new Date().getFullYear(),
): { month: number; year: number; label: string }[] {
  return Array.from({ length: 13 }, (_, i) => {
    const monthIndex = (startMonth + i) % 12;
    const year = startYear + Math.floor((startMonth + i) / 12);
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
      return date.getUTCMonth() === month && date.getUTCFullYear() === year;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

function getRetrogradesForMonth(
  retrogrades: RetrogradePeriod[],
  month: number,
  year: number,
  planet: string,
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
        planet,
      });
    }
    if (end.getUTCMonth() === month && end.getUTCFullYear() === year) {
      events.push({
        date: r.end.date,
        position: r.end.position,
        isStarting: false,
        planet,
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
      return date.getUTCMonth() === month && date.getUTCFullYear() === year;
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
  majorTransits: MajorTransitsWithOrb[],
  month: number,
  year: number,
): TransitEntry[] {
  const entries: TransitEntry[] = [];

  for (const mt of majorTransits) {
    for (const transit of mt.transits) {
      for (const aspectKey of ASPECT_KEYS) {
        const ingress = transit[aspectKey];
        if (!ingress) continue;

        for (const window of ingress.windows) {
          const phases = [
            { date: window.applyingDate, phase: "applying" as const },
            { date: window.exactDate, phase: "exact" as const },
            { date: window.separatingDate, phase: "separating" as const },
          ];

          for (const { date, phase } of phases) {
            if (!date) continue;
            const d = new Date(date);
            if (d.getUTCMonth() === month && d.getUTCFullYear() === year) {
              entries.push({
                date,
                transitingPlanet: transit.planet,
                natalPlanet: mt.natalPlanet,
                aspect: aspectKey,
                position: window.position,
                natalPosition: mt.natalPosition,
                exactMatch: phase === "exact",
                phase,
              });
            }
          }
        }
      }
    }
  }

  return entries.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
}

function computeNextProfectionYear(
  current: ProfectionYearData,
  ascendantSign: string,
): ProfectionYearData {
  const nextYearNum = (current.profectionYear % 12) + 1;
  const ascIndex = constants.SIGNS.indexOf(ascendantSign);
  const signIndex = (ascIndex + nextYearNum - 1) % 12;
  const sign = constants.SIGNS[signIndex];
  return {
    profectionYear: nextYearNum,
    profectionSign: sign,
    lordOfYear: constants.SIGN_RULERS[sign],
  };
}

export const YearlyTransits = () => {
  const months = getNext12Months();
  // use date of purchase
  const dateParam = useMemo(() => new Date().toISOString(), []);

  //use first day of the current year
  // const months = getNext12Months(0, new Date().getFullYear());
  // const dateParam = useMemo(() => {
  //   const now = new Date();
  //   return new Date(Date.UTC(now.getUTCFullYear(), 0, 1)).toISOString();
  // }, []);

  const today = new Date();
  const startOfToday = new Date(
    Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()),
  );
  const { birthChartData, birthInfo, profectionYear } = useBirthChart();

  const { data: majorTransits, isLoading: majorTransitsLoading } =
    trpc.useQuery(
      [
        "astro.getMajorTransitsAllPlanetsWithOrb",
        { natalPlacements: birthChartData!, orb: 3, date: dateParam },
      ],
      { enabled: !!birthChartData },
    );

  const { data: eclipses, isLoading: eclipsesLoading } = trpc.useQuery([
    "astro.getEclipses",
    { date: dateParam },
  ]);

  const { data: mercuryRetrogrades, isLoading: mercuryRetrogradesLoading } =
    trpc.useQuery(["astro.getMercuryRetrogradePeriods", { date: dateParam }]);

  const { data: venusRetrogrades, isLoading: venusRetrogradesLoading } =
    trpc.useQuery(["astro.getVenusRetrogradePeriods", { date: dateParam }]);

  const { data: marsRetrogrades, isLoading: marsRetrogradesLoading } =
    trpc.useQuery(["astro.getMarsRetrogradePeriods", { date: dateParam }]);

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
    mercuryRetrogradesLoading ||
    venusRetrogradesLoading ||
    marsRetrogradesLoading ||
    lunationsLoading ||
    ingressesLoading ||
    majorTransitsLoading;

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <div className="space-y-6 w-full">
      {profectionYear && birthChartData && (
        <ProfectionYear data={profectionYear} birthChartData={birthChartData} />
      )}

      {months.map(({ month, year, label }) => {
        const monthEclipses = eclipses
          ? getEclipsesForMonth(eclipses, month, year)
          : [];
        const monthRetrogrades = mercuryRetrogrades
          ? getRetrogradesForMonth(mercuryRetrogrades, month, year, "Mercury")
          : [];
        monthRetrogrades.push(
          ...(venusRetrogrades
            ? getRetrogradesForMonth(venusRetrogrades, month, year, "Venus")
            : []),
          ...(marsRetrogrades
            ? getRetrogradesForMonth(marsRetrogrades, month, year, "Mars")
            : []),
        );

        const eclipseSigns = new Set(monthEclipses.map((e) => e.position.sign));
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
          ...(birthInfo &&
          parseInt(birthInfo.birthDate.slice(5, 7), 10) - 1 === month &&
          new Date(`${year}-${birthInfo.birthDate.slice(5, 10)}T00:00:00Z`) >=
            startOfToday
            ? [
                {
                  type: "birthday" as const,
                  date: `${year}-${birthInfo.birthDate.slice(5, 10)}T00:00:00Z`,
                  data:
                    profectionYear && birthChartData
                      ? computeNextProfectionYear(
                          profectionYear,
                          birthChartData.find((p) => p.planet === "Ascendant")
                            ?.position.sign ?? "Aries",
                        )
                      : null,
                },
              ]
            : []),
        ].sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
        );

        return (
          <section
            key={`${label}-${year}`}
            className="mb-4 w-full p-6 bg-background-100 rounded-lg border border-primary-500"
          >
            <h3 className="text-xl font-semibold text-primary-500">
              {label} {year}
            </h3>

            {allEvents.length > 0 && (
              <div className="mt-4 space-y-3">
                {Object.entries(
                  allEvents.reduce<Record<string, typeof allEvents>>(
                    (groups, event) => {
                      const dateKey = event.date.slice(0, 10);
                      (groups[dateKey] ??= []).push(event);
                      return groups;
                    },
                    {},
                  ),
                ).map(([dateKey, events]) => (
                  <div
                    key={dateKey}
                    className="p-4 bg-primary-100 rounded-md space-y-3"
                  >
                    <p className="text-primary-500 text-sm">
                      {label} {parseInt(dateKey.slice(8, 10), 10)}, {year}
                    </p>
                    {events.map((event) => {
                      switch (event.type) {
                        case "eclipse":
                          return (
                            <MonthEclipse
                              key={`eclipse-${event.data.date}`}
                              eclipse={event.data}
                            />
                          );
                        case "lunation":
                          return (
                            <MonthLunation
                              key={`lunation-${event.data.date}`}
                              lunation={event.data}
                            />
                          );
                        case "retrograde":
                          return (
                            <MonthRetrograde
                              key={`retrograde-${event.data.planet}-${event.data.date}-${event.data.isStarting ? "start" : "end"}`}
                              retrograde={event.data}
                              retrogradePlanet={event.data.planet}
                            />
                          );
                        case "ingress":
                          return (
                            <MonthIngress
                              key={`ingress-${event.data.date}-${event.data.planet}`}
                              ingress={event.data}
                            />
                          );
                        case "transit":
                          return event.data.phase === "applying" ||
                            event.data.phase === "separating" ? (
                            <MonthIngressWithOrb
                              key={`transit-${event.data.date}-${event.data.transitingPlanet}-${event.data.natalPlanet}-${event.data.aspect}-${event.data.phase}`}
                              transit={event.data}
                            />
                          ) : (
                            <MonthTransit
                              key={`transit-${event.data.date}-${event.data.transitingPlanet}-${event.data.natalPlanet}-${event.data.aspect}`}
                              transit={event.data}
                            />
                          );
                        case "birthday":
                          return event.data ? (
                            <MonthBirthday
                              key={`birthday-${event.date}`}
                              nextProfectionYear={event.data}
                              birthChartData={birthChartData}
                            />
                          ) : null;
                      }
                    })}
                  </div>
                ))}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
};

export default YearlyTransits;
