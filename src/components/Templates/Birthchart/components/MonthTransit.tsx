import { useBirthChart } from "@/components/Providers/BirthChartContext";
import { type TransitEntry } from "@/shared/types";
import {
  formatDegree,
  getHouseFromSign,
  getFormattedHouseText,
  getFormattedHouseRulersText,
  getFormattedHouseDescriptionText,
  getFormattedTransitText,
} from "@/shared/lib/textHelpers";

const ASPECT_LABELS: Record<string, string> = {
  conjunct: "conjunct",
  opposition: "opposition",
  superiorSquare: "square",
  inferiorSquare: "square",
  superiorTrine: "trine",
  inferiorTrine: "trine",
  superiorSextile: "sextile",
  inferiorSextile: "sextile",
};

export default function MonthTransit({
  transit,
  monthLabel,
  year,
}: {
  transit: TransitEntry;
  monthLabel: string;
  year: number;
}) {
  const { birthChartData } = useBirthChart();

  if (!birthChartData) return;

  const ascendantSign =
    birthChartData.find((a) => a.planet === "Ascendant")?.position.sign ||
    "Aries";

  const natalPlanetData =
    birthChartData.find((p) => p.planet === transit.natalPlanet) ||
    birthChartData[0];

  const transitHouse = getHouseFromSign(ascendantSign, transit.position.sign);
  const aspectLabel = ASPECT_LABELS[transit.aspect] || transit.aspect;

  const date = new Date(transit.date);
  const day = date.getDate();

  const title = `${transit.transitingPlanet} ${aspectLabel} natal ${transit.natalPlanet}`;
  const positionText = `${transit.position.sign} ${formatDegree(transit.position.degree, transit.position.minute)}`;

  const interpretationText = `Transiting ${transit.transitingPlanet} at ${positionText} in your ${getFormattedHouseText(transitHouse)} forms a ${aspectLabel} to your natal ${transit.natalPlanet} at ${transit.natalPosition.sign} ${formatDegree(transit.natalPosition.degree, transit.natalPosition.minute)}.`;
  const transitInterpretation = getFormattedTransitText(
    transit.transitingPlanet,
    natalPlanetData,
    aspectLabel,
  );
  return (
    <div className="p-4 bg-gray-700 rounded-md border border-gray-600">
      <div className="flex justify-between items-start">
        <h4 className="text-lg font-medium text-white">{title}</h4>
        <span className="text-gray-400 text-sm">
          {monthLabel} {day}, {year}
        </span>
      </div>
      <p className="text-gray-300 text-sm mt-1">{interpretationText}</p>
      <p className="text-gray-300 text-sm mt-1">{transitInterpretation}</p>
    </div>
  );
}
