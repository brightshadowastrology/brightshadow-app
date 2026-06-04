import { formatDegree } from "@/shared/lib/textHelpers";
import { placementInterpretationText } from "@/shared/text/general";
import { type PlanetPoint, type SectPlanets } from "@/shared/types";

type SectionPlacementsProps = {
  data: PlanetPoint[];
  sectPlanets: SectPlanets;
  isDayChart: boolean | null;
};

export default function SectionPlacements({
  data,
  sectPlanets,
  isDayChart,
}: SectionPlacementsProps) {
  const planets = data.filter(
    (p) => !["Ascendant", "Descendant", "Midheaven", "IC"].includes(p.planet),
  );
  const angles = data.filter((p) =>
    ["Ascendant", "Descendant", "Midheaven", "IC"].includes(p.planet),
  );

  return (
    <section className="mb-4 w-full p-6 bg-background-100 rounded-lg border border-primary-500">
      <h3 className="text-xl font-semibold text-primary-500">
        Your Planetary Placements
      </h3>
      <div className="mt-4 space-y-3">
        {planets.map((placement) => (
          <div key={placement.planet} className="p-4 bg-primary-100 rounded-md">
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-lg font-medium text-primary-950">
                {placement.planet} in {placement.position.sign}
              </h4>
              <span className="text-primary-500 text-sm">
                {formatDegree(
                  placement.position.degree,
                  placement.position.minute,
                )}{" "}
                | House {placement.house}
              </span>
            </div>
            {placementInterpretationText(placement, data).map((text, index) => (
              <p key={index} className="text-primary-950 mt-2">
                {text}
              </p>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
