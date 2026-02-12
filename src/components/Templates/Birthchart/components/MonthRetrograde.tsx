import { houseTopics } from "@/shared/lib/text";
import { useBirthChart } from "../BirthChartContext";
import { type RetrogradeEvent } from "./MajorTransits";
import {
  formatDegree,
  getHouseFromSign,
  getFormattedHouseText,
  getFormattedHouseRulersText,
  getFormattedHouseDescriptionText,
  getFormattedHouseTopicsText,
} from "@/shared/lib/textHelpers";

export default function MonthRetrograde({
  retrograde,
  monthLabel,
  year,
}: {
  retrograde: RetrogradeEvent;
  monthLabel: string;
  year: number;
}) {
  const { birthChartData } = useBirthChart();

  if (!birthChartData) return;

  const date = new Date(retrograde.date);
  const phase = retrograde.isStarting
    ? "Mercury Retrograde begins"
    : "Mercury Retrograde ends";
  const houseIngressedInto: number = getHouseFromSign(
    birthChartData.find((a) => a.planet === "Ascendant")?.position.sign ||
      "Aries",
    retrograde.position.sign,
  );

  const retrogradeText = `${phase} | ${retrograde.position.sign} ${formatDegree(retrograde.position.degree, retrograde.position.minute)} `;
  const interpretationText = `This ${phase} in your ${getFormattedHouseText(houseIngressedInto)}.`;
  const recommendationText = `This is a time when you may miscommunicate or experience delays around your ${getFormattedHouseTopicsText(houseIngressedInto)}. For these same reasons however, it's an excellent time to slow down, review, and reconsider these areas of life.`;

  return (
    <div className="p-4 bg-gray-700 rounded-md border border-gray-600">
      <div className="flex justify-between items-start">
        <h4 className="text-lg font-medium text-white">{retrogradeText}</h4>
        <span className="text-gray-400 text-sm">
          {monthLabel} {date.getDate()}, {year}
        </span>
      </div>
      <p className="text-gray-300 text-sm mt-1">{interpretationText}</p>
      <p className="text-gray-300 text-sm mt-1">{recommendationText}</p>
    </div>
  );
}
