import {
  type TransitEntry,
  type SectPlanets,
  type PlanetPoint,
  type ProfectionYearData,
  type Eclipse,
  type Lunation,
} from "@/shared/types";
import { ASPECT_LABELS, MONTHS } from "@/shared/lib/constants";
import Pill from "@/components/UI/Pill";
import { getAspectsToNatalPlanets, getPills } from "../../helpers";
import { titleCase, formatDegree } from "@/shared/lib/textHelpers";

export type NotableEvent =
  | { type: "transit"; data: TransitEntry }
  | { type: "eclipse"; data: Eclipse }
  | { type: "lunation"; data: Lunation };

type NotableDatesProps = {
  events: NotableEvent[];
  birthChartData: PlanetPoint[];
  sectPlanets: SectPlanets;
  profectionYearData: ProfectionYearData | null;
};

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return `${MONTHS[date.getUTCMonth()].label} ${date.getUTCDate()}, ${date.getUTCFullYear()}`;
}

export default function NotableDates({
  events,
  birthChartData,
  sectPlanets,
  profectionYearData,
}: NotableDatesProps) {
  if (events.length === 0) return null;

  return (
    <section className="mb-4 w-full p-6 bg-background-100 rounded-lg border border-primary-500">
      <h3 className="text-xl font-semibold mb-4 text-primary-500">
        A Few Notable Dates
      </h3>

      <div className="p-6 bg-primary-100 rounded-lg space-y-4">
        {events.map((event) => {
          if (event.type === "transit") {
            const { data: transit } = event;
            const pills = getPills(
              birthChartData,
              sectPlanets,
              transit,
              profectionYearData,
            );
            const aspectLabel = ASPECT_LABELS[transit.aspect] || transit.aspect;
            const title = `${transit.transitingPlanet} ${aspectLabel} natal ${transit.natalPlanet}`;

            return (
              <div
                key={`${transit.date}-${transit.transitingPlanet}-${transit.natalPlanet}-${transit.aspect}`}
                className="border-t border-primary-400 pt-4 first:border-t-0 first:pt-0"
              >
                <p className="text-sm text-primary-500">
                  {formatDate(transit.date)}
                </p>
                <h4 className="text-lg font-medium text-primary-700 mt-1">
                  {title}
                </h4>
                {pills.length > 0 && (
                  <div className="flex gap-2 pt-2">
                    {pills.map((pill) => (
                      <Pill key={pill.type} type={pill.type} />
                    ))}
                  </div>
                )}
              </div>
            );
          }

          if (event.type === "eclipse") {
            const { data: eclipse } = event;
            const aspects = getAspectsToNatalPlanets(
              eclipse.position,
              birthChartData,
              eclipse.type,
              eclipse.date,
            );
            const pills = aspects
              .flatMap((aspect) =>
                getPills(
                  birthChartData,
                  sectPlanets,
                  aspect,
                  profectionYearData,
                ),
              )
              .filter(
                (pill, i, self) =>
                  i === self.findIndex((p) => p.type === pill.type),
              );
            const title = `${titleCase(eclipse.type)} | ${eclipse.position.sign} ${formatDegree(eclipse.position.degree, eclipse.position.minute)}`;

            return (
              <div
                key={`eclipse-${eclipse.date}`}
                className="border-t border-primary-400 pt-4 first:border-t-0 first:pt-0"
              >
                <p className="text-sm text-primary-500">
                  {formatDate(eclipse.date)}
                </p>
                <h4 className="text-lg font-medium text-primary-700 mt-1">
                  {title}
                </h4>
                {pills.length > 0 && (
                  <div className="flex gap-2 pt-2">
                    {pills.map((pill) => (
                      <Pill key={pill.type} type={pill.type} />
                    ))}
                  </div>
                )}
              </div>
            );
          }

          if (event.type === "lunation") {
            const { data: lunation } = event;
            const aspects = getAspectsToNatalPlanets(
              lunation.position,
              birthChartData,
              lunation.lunationType,
              lunation.date,
            );
            const pills = aspects
              .flatMap((aspect) =>
                getPills(
                  birthChartData,
                  sectPlanets,
                  aspect,
                  profectionYearData,
                ),
              )
              .filter(
                (pill, i, self) =>
                  i === self.findIndex((p) => p.type === pill.type),
              );
            const title = `${titleCase(lunation.lunationType)} in ${lunation.position.sign} | ${formatDegree(lunation.position.degree, lunation.position.minute)}`;

            return (
              <div
                key={`lunation-${lunation.date}`}
                className="border-t border-primary-400 pt-4 first:border-t-0 first:pt-0"
              >
                <p className="text-sm text-primary-500">
                  {formatDate(lunation.date)}
                </p>
                <h4 className="text-lg font-medium text-primary-700 mt-1">
                  {title}
                </h4>
                {pills.length > 0 && (
                  <div className="flex gap-2 pt-2">
                    {pills.map((pill) => (
                      <Pill key={pill.type} type={pill.type} />
                    ))}
                  </div>
                )}
              </div>
            );
          }
        })}
      </div>
    </section>
  );
}
