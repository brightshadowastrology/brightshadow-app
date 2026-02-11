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

export default function MajorTransits() {
  const months = getNext12Months();

  const { data: eclipses } = trpc.useQuery([
    "astro.getEclipses",
    { date: new Date().toISOString() },
  ]);

  const { data: retrogrades } = trpc.useQuery([
    "astro.getMercuryRetrogradePeriods",
    { date: new Date().toISOString() },
  ]);

  const { data: lunations } = trpc.useQuery([
    "astro.getLunations",
    { date: new Date().toISOString() },
  ]);

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
              monthLunations.length > 0) && (
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
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
