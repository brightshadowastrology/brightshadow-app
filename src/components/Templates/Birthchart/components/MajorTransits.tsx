import * as constants from "@/shared/lib/constants";
import { trpc } from "@/shared/lib/trpc";
import {
  type Eclipse,
  type Lunation,
  type RetrogradePeriod,
} from "@/shared/types";
import { formatDegree } from "@/shared/lib/textHelpers";

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

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const month = constants.MONTHS[date.getMonth()].label;
  return `${month} ${date.getDate()}`;
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
                {monthEclipses.map((eclipse) => {
                  const date = new Date(eclipse.date);
                  const day = date.getDate();

                  return (
                    <div
                      key={eclipse.date}
                      className="p-4 bg-gray-700 rounded-md border border-gray-600"
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="text-lg font-medium text-white">
                          {eclipse.type}
                        </h4>
                        <span className="text-gray-400 text-sm">
                          {label} {day}, {year}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm mt-1">
                        {eclipse.position.sign}{" "}
                        {formatDegree(
                          eclipse.position.degree,
                          eclipse.position.minute,
                        )}{" "}
                        &middot; {eclipse.modality}
                      </p>
                    </div>
                  );
                })}

                {monthLunations.map((lunation) => {
                  const date = new Date(lunation.date);
                  const day = date.getDate();
                  const typeLabel =
                    lunation.lunationType === "new moon"
                      ? "New Moon"
                      : "Full Moon";

                  return (
                    <div
                      key={lunation.date}
                      className="p-4 bg-gray-700 rounded-md border border-gray-600"
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="text-lg font-medium text-white">
                          {typeLabel}
                        </h4>
                        <span className="text-gray-400 text-sm">
                          {label} {day}, {year}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm mt-1">
                        {lunation.position.sign}{" "}
                        {formatDegree(
                          lunation.position.degree,
                          lunation.position.minute,
                        )}
                      </p>
                    </div>
                  );
                })}

                {monthRetrogrades.map((retrograde) => {
                  const startDate = new Date(retrograde.start.date);
                  const endDate = new Date(retrograde.end.date);
                  const startsThisMonth =
                    startDate.getMonth() === month &&
                    startDate.getFullYear() === year;
                  const endsThisMonth =
                    endDate.getMonth() === month &&
                    endDate.getFullYear() === year;

                  let phase = "Mercury Retrograde (ongoing)";
                  if (startsThisMonth && endsThisMonth) {
                    phase = "Mercury Retrograde (starts & ends)";
                  } else if (startsThisMonth) {
                    phase = "Mercury Retrograde begins";
                  } else if (endsThisMonth) {
                    phase = "Mercury Retrograde ends";
                  }

                  return (
                    <div
                      key={retrograde.start.date}
                      className="p-4 bg-gray-700 rounded-md border border-gray-600"
                    >
                      <h4 className="text-lg font-medium text-white">
                        {phase}
                      </h4>
                      <div className="flex justify-between items-start mt-1">
                        <p className="text-gray-300 text-sm">
                          {formatDate(retrograde.start.date)} &ndash;{" "}
                          {formatDate(retrograde.end.date)}
                        </p>
                      </div>
                      <p className="text-gray-300 text-sm mt-1">
                        {retrograde.start.position.sign}{" "}
                        {formatDegree(
                          retrograde.start.position.degree,
                          retrograde.start.position.minute,
                        )}{" "}
                        &rarr; {retrograde.end.position.sign}{" "}
                        {formatDegree(
                          retrograde.end.position.degree,
                          retrograde.end.position.minute,
                        )}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
