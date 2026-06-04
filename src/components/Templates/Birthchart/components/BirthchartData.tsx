import { type PlanetPoint, type SectPlanets } from "@/shared/types";
import SectionAngles from "./SectionAngles";
import SectionPlacements from "./SectionPlacements";
import SectionSect from "./SectionSect";

type BirthchartDataProps = {
  data: PlanetPoint[];
  sectPlanets: SectPlanets;
  isDayChart: boolean | null;
};

export default function BirthchartData({
  data,
  sectPlanets,
  isDayChart,
}: BirthchartDataProps) {
  return (
    <div className="space-y-6 w-full">
      <SectionPlacements
        data={data}
        sectPlanets={sectPlanets}
        isDayChart={isDayChart}
      />
      <SectionAngles
        data={data}
        sectPlanets={sectPlanets}
        isDayChart={isDayChart}
      />
      <SectionSect
        data={data}
        sectPlanets={sectPlanets}
        isDayChart={isDayChart}
      />
    </div>
  );
}
