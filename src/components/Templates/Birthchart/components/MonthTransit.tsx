import { useBirthChart } from "@/components/Providers/BirthChartContext";
import { type TransitEntry } from "@/shared/types";
import {
  formatDegree,
  getHouseFromSign,
  getFormattedHouseText,
  getFormattedTransitText,
  getFormattedSectInterpretation,
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

export default function MonthTransit({ transit }: { transit: TransitEntry }) {
  const { birthChartData, sectPlanets } = useBirthChart();

  if (!birthChartData || !sectPlanets) return;

  const ascendantSign =
    birthChartData.find((a) => a.planet === "Ascendant")?.position.sign ||
    "Aries";

  const natalPlanetData =
    birthChartData.find((p) => p.planet === transit.natalPlanet) ||
    birthChartData[0];

  const transitHouse = getHouseFromSign(ascendantSign, transit.position.sign);
  const aspectLabel = ASPECT_LABELS[transit.aspect] || transit.aspect;

  const title = `${transit.transitingPlanet} ${aspectLabel} natal ${transit.natalPlanet}`;
  const positionText = `${transit.position.sign} ${formatDegree(transit.position.degree, transit.position.minute)}`;

  const interpretationText = `Transiting ${transit.transitingPlanet} at ${positionText} in your ${getFormattedHouseText(transitHouse)} forms a ${aspectLabel} to your natal ${transit.natalPlanet} at ${transit.natalPosition.sign} ${formatDegree(transit.natalPosition.degree, transit.natalPosition.minute)}.`;
  const transitInterpretation = getFormattedTransitText(
    transit.transitingPlanet,
    natalPlanetData,
    aspectLabel,
  );
  const sectInterpretation = getFormattedSectInterpretation(
    sectPlanets,
    transit,
  );

  return (
    <div className={"border-t border-gray-600 pt-3"}>
      <div className="flex justify-between items-start">
        <h4 className="text-lg font-medium text-white">{title}</h4>
      </div>
      <p className="text-gray-300 text-sm mt-1">{interpretationText}</p>
      <p className="text-gray-300 text-sm mt-1">{transitInterpretation}</p>
      <p className="text-gray-300 text-sm mt-1">{sectInterpretation}</p>
    </div>
  );
}
