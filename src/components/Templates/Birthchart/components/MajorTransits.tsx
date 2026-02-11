import * as constants from "@/shared/lib/constants";
import { trpc } from "@/shared/lib/trpc";
import {
  type Eclipse,
  type Lunation,
  type RetrogradePeriod,
} from "@/shared/types";
import MonthEclipse from "./MonthEclipse";
import MonthLunation from "./MonthLunation";
import MonthRetrograde from "./MonthRetrograde";
import MonthIngress, { type IngressEntry } from "./MonthIngress";
import LoadingIndicator from "./LoadingIndicator";

function getNext12Months(): { month: number; year: number; label: string }[] {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  return Array.from({ length: 12 }, (_, i) => {
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
  return eclipses.filter((eclipse) => {
    const date = new Date(eclipse.date);
    return date.getMonth() === month && date.getFullYear() === year;
  });
}

function getRetrogradesForMonth(
  retrogrades: RetrogradePeriod[],
  month: number,
  year: number,
): RetrogradePeriod[] {
  const monthStart = new Date(year, month, 1);
  const monthEnd = new Date(year, month + 1, 0, 23, 59, 59);

  return retrogrades.filter((r) => {
    const start = new Date(r.start.date);
    const end = new Date(r.end.date);
    return start <= monthEnd && end >= monthStart;
  });
}

function getLunationsForMonth(
  lunations: Lunation[],
  month: number,
  year: number,
): Lunation[] {
  return lunations.filter((lunation) => {
    const date = new Date(lunation.date);
    return date.getMonth() === month && date.getFullYear() === year;
  });
}

function getIngressesForMonth(
  ingresses: { planet: string; ingresses: { targetPosition: { sign: string }; dates: { date: string }[] }[] }[],
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

export default function MajorTransits() {
  const months = getNext12Months();

  const { data: eclipses, isLoading: eclipsesLoading } = trpc.useQuery([
    "astro.getEclipses",
    { date: new Date().toISOString() },
  ]);

  const { data: retrogrades, isLoading: retrogradesLoading } = trpc.useQuery([
    "astro.getMercuryRetrogradePeriods",
    { date: new Date().toISOString() },
  ]);

  const { data: lunations, isLoading: lunationsLoading } = trpc.useQuery([
    "astro.getLunations",
    { date: new Date().toISOString() },
  ]);

  const { data: ingresses } = trpc.useQuery([
    "astro.getAllPlanetZeroDegreeIngresses",
    { date: new Date().toISOString() },
  ]);

  const isLoading = eclipsesLoading || retrogradesLoading || lunationsLoading;

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
        const monthLunations = lunations
          ? getLunationsForMonth(lunations, month, year)
          : [];
        const monthIngresses = ingresses
          ? getIngressesForMonth(ingresses, month, year)
          : [];

        return (
          <section
            key={`${label}-${year}`}
            className="w-full p-6 bg-gray-800 rounded-lg border border-gray-700"
          >
            <h3 className="text-xl font-semibold text-white">
              {label} {year}
            </h3>

            {(monthEclipses.length > 0 ||
              monthRetrogrades.length > 0 ||
              monthLunations.length > 0 ||
              monthIngresses.length > 0) && (
              <div className="mt-4 space-y-3">
                {monthEclipses.map((eclipse) => (
                  <MonthEclipse
                    key={eclipse.date}
                    eclipse={eclipse}
                    monthLabel={label}
                    year={year}
                  />
                ))}

                {monthLunations.map((lunation) => (
                  <MonthLunation
                    key={lunation.date}
                    lunation={lunation}
                    monthLabel={label}
                    year={year}
                  />
                ))}

                {monthRetrogrades.map((retrograde) => (
                  <MonthRetrograde
                    key={retrograde.start.date}
                    retrograde={retrograde}
                    month={month}
                    year={year}
                  />
                ))}

                {monthIngresses.map((ingress) => (
                  <MonthIngress
                    key={`${ingress.date}-${ingress.planet}`}
                    ingress={ingress}
                    monthLabel={label}
                    year={year}
                  />
                ))}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
