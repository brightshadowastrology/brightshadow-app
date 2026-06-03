import { useBirthChart } from "@/components/Providers/BirthChartContext";
import { formatDegree, getHouseFromSign } from "@/shared/lib/textHelpers";
import {
  getFormattedHouseText,
  getFormattedHouseTopicsText,
} from "@/shared/text/general";
import { getRetrogradeRecommendationText } from "@/shared/text/retrogradeRecommendationText";
import { type RetrogradeEvent } from "@/shared/types";

export default function MonthRetrograde({
  retrograde,
  retrogradePlanet,
}: {
  retrograde: RetrogradeEvent;
  retrogradePlanet: string;
}) {
  const { birthChartData } = useBirthChart();

  if (!birthChartData) return;

  const phase = retrograde.isStarting
    ? `${retrograde.planet} Retrograde begins`
    : `${retrograde.planet} Retrograde ends`;
  const houseIngressedInto: number = getHouseFromSign(
    birthChartData.find((a) => a.planet === "Ascendant")?.position.sign ||
      "Aries",
    retrograde.position.sign,
  );

  const retrogradeText = `${phase} | ${retrograde.position.sign} ${formatDegree(retrograde.position.degree, retrograde.position.minute)} `;
  const interpretationText = `This ${phase} in your ${getFormattedHouseText(houseIngressedInto)}.`;
  const recommendationText = getRetrogradeRecommendationText(
    retrogradePlanet,
    getFormattedHouseTopicsText(houseIngressedInto),
  );

  return (
    <div className={"border-t border-primary-700 pt-3"}>
      <div className="flex justify-between items-start">
        <h4 className="text-lg font-medium text-primary-700">
          {retrogradeText}
        </h4>
      </div>
      <p className="text-primary-700 mt-1">{interpretationText}</p>
      <p className="text-primary-700 mt-1">
        {retrograde.isStarting && recommendationText}
      </p>
    </div>
  );
}
