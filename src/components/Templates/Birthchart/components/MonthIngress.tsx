import { useBirthChart } from "../BirthChartContext";
import { type PlanetPoint } from "@/shared/types";
import {
  getHouseFromSign,
  getFormattedHouseText,
  getFormattedHouseRulersText,
  getFormattedHouseDescriptionText,
  getFormattedHouseTopicsText,
} from "@/shared/lib/textHelpers";
export type IngressEntry = { date: string; planet: string; sign: string };

export default function MonthIngress({
  ingress,
  monthLabel,
  year,
}: {
  ingress: IngressEntry;
  monthLabel: string;
  year: number;
}) {
  const { birthChartData } = useBirthChart();

  const natalPlacement: PlanetPoint | undefined = birthChartData?.find(
    (element) => element.planet === ingress.planet,
  );

  if (!birthChartData || !natalPlacement) return;

  const houseIngressedInto: number = getHouseFromSign(
    birthChartData.find((a) => a.planet === "Ascendant")?.position.sign ||
      "Aries",
    ingress.sign,
  );
  const isTraditionalPlanet = [
    "Mercury",
    "Venus",
    "Mars",
    "Jupiter",
    "Saturn",
  ].includes(ingress.planet);
  const placementText = `Natally, ${ingress.planet} rules your ${getFormattedHouseRulersText(natalPlacement.rulerOf || [])}. During this transit, your ${getFormattedHouseDescriptionText(natalPlacement.rulerOf || [])}, will be brought up in your ${getFormattedHouseDescriptionText([houseIngressedInto])}.`;

  const date = new Date(ingress.date);
  const day = date.getDate();

  return (
    <div className="p-4 bg-gray-700 rounded-md border border-gray-600">
      <div className="flex justify-between items-start">
        <h4 className="text-lg font-medium text-white">
          {ingress.planet} enters your {ingress.sign}{" "}
          {getFormattedHouseText(houseIngressedInto)}
        </h4>
        <span className="text-gray-400 text-sm">
          {monthLabel} {day}, {year}
        </span>
      </div>
      <p className="text-gray-300 text-sm mt-1">
        {isTraditionalPlanet && placementText}
      </p>
    </div>
  );
}
