import { useBirthChart } from "@/components/Providers/BirthChartContext";
import { type PlanetPoint, type IngressEntry } from "@/shared/types";
import {
  getHouseFromSign,
  getFormattedHouseText,
  getFormattedHouseRulersText,
  getFormattedHouseDescriptionText,
  getIngressInterpretation,
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
  const ingressInterpretation = getIngressInterpretation(
    ingress.planet,
    houseIngressedInto.toString(),
  );
  const isTraditionalPlanet = [
    "Sun",
    "Mercury",
    "Venus",
    "Mars",
    "Jupiter",
    "Saturn",
  ].includes(ingress.planet);
  const placementText = `Natally, ${ingress.planet} rules your ${getFormattedHouseRulersText(natalPlacement.rulerOf || [])}. During this transit, topics related to ${getFormattedHouseDescriptionText(natalPlacement.rulerOf || [])}, will be brought up in your ${getFormattedHouseDescriptionText([houseIngressedInto])}.`;

  return (
    <div className={"border-t border-primary-700 pt-3"}>
      <div className="flex justify-between items-start">
        <h4 className="text-lg font-medium text-primary-700">
          {ingress.planet} enters your {ingress.sign}{" "}
          {getFormattedHouseText(houseIngressedInto)}
        </h4>
      </div>
      <p className="text-primary-700 mt-1">{ingressInterpretation}</p>
      <p className="text-primary-700 mt-1">
        {isTraditionalPlanet && placementText}
      </p>
    </div>
  );
}
