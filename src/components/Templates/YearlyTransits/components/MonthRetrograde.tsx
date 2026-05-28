import { useBirthChart } from "@/components/Providers/BirthChartContext";
import { type RetrogradeEvent } from "@/shared/types";
import {
  formatDegree,
  getHouseFromSign,
  getFormattedHouseText,
  getFormattedHouseTopicsText,
} from "@/shared/lib/textHelpers";

export default function MonthRetrograde({
  retrograde,
}: {
  retrograde: RetrogradeEvent;
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
  const recommendationText = `This is a time when you may miscommunicate or experience delays around your ${getFormattedHouseTopicsText(houseIngressedInto)}. For these same reasons however, it's an excellent time to slow down, review, and reconsider these areas of life.`;

  return (
    <div className={"border-t border-primary-700 pt-3"}>
      <div className="flex justify-between items-start">
        <h4 className="text-lg font-medium text-primary-700">
          {retrogradeText}
        </h4>
      </div>
      <p className="text-primary-700 mt-1">{interpretationText}</p>
      <p className="text-primary-700 mt-1">{recommendationText}</p>
    </div>
  );
}
