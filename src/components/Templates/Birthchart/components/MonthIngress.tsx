import { useBirthChart } from "@/components/Providers/BirthChartContext";
import { type PlanetPoint, type IngressEntry } from "@/shared/types";
import {
  getHouseFromSign,
  getFormattedHouseText,
  getFormattedHouseRulersText,
  getFormattedHouseDescriptionText,
} from "@/shared/lib/textHelpers";

export default function MonthIngress({ ingress }: { ingress: IngressEntry }) {
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

  return (
    <div className={"border-t border-gray-600 pt-3"}>
      <div className="flex justify-between items-start">
        <h4 className="text-lg font-medium text-white">
          {ingress.planet} enters your {ingress.sign}{" "}
          {getFormattedHouseText(houseIngressedInto)}
        </h4>
      </div>
      <p className="text-gray-300 text-sm mt-1">
        {isTraditionalPlanet && placementText}
      </p>
    </div>
  );
}
