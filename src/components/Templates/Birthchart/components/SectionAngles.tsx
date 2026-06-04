import { formatDegree } from "@/shared/lib/textHelpers";
import { planetDescriptions } from "@/shared/text/general";
import { type PlanetPoint, type SectPlanets } from "@/shared/types";

type SectionAnglesProps = {
  data: PlanetPoint[];
  sectPlanets: SectPlanets;
  isDayChart: boolean | null;
};

export default function SectionAngles({
  data,
  sectPlanets,
  isDayChart,
}: SectionAnglesProps) {
  const angles = data.filter((p) =>
    ["Ascendant", "Descendant", "Midheaven", "IC"].includes(p.planet),
  );

  return (
    <section className="mb-4 w-full p-6 bg-background-100 rounded-lg border border-primary-500">
      <h3 className="text-xl font-semibold text-primary-500">Your Angles</h3>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
        {angles.map((angle) => (
          <div key={angle.planet} className="p-4 bg-primary-100 rounded-md">
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-lg font-medium text-primary-950">
                {angle.planet}
              </h4>
              <span className="text-primary-500 text-sm">
                {angle.position.sign}{" "}
                {formatDegree(angle.position.degree, angle.position.minute)}
              </span>
            </div>
            <p className="text-primary-700 text-sm">
              {planetDescriptions[angle.planet]?.tagline || ""} is colored by{" "}
              {angle.position.sign} energy.
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
