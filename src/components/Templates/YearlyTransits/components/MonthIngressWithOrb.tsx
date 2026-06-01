import { useBirthChart } from "@/components/Providers/BirthChartContext";
import { type TransitEntry } from "@/shared/types";
import {
  formatDegree,
  getHouseFromSign,
  getFormattedHouseText,
} from "@/shared/lib/textHelpers";
import { ASPECT_LABELS } from "@/shared/lib/constants";

export default function MonthIngressWithOrb({
  transit,
}: {
  transit: TransitEntry;
}) {
  const { birthChartData } = useBirthChart();

  if (!birthChartData) return null;

  const ascendantSign =
    birthChartData.find((a) => a.planet === "Ascendant")?.position.sign ||
    "Aries";

  const transitHouse = getHouseFromSign(ascendantSign, transit.position.sign);
  const aspectLabel = ASPECT_LABELS[transit.aspect] || transit.aspect;
  const natalPositionText = `${transit.natalPosition.sign} ${formatDegree(transit.natalPosition.degree, transit.natalPosition.minute)}`;

  const isApplying = transit.phase === "applying";
  const phaseVerb = isApplying ? "approaching" : "separating from";
  const phaseLabel = isApplying ? "Applying" : "Separating";

  const title = `${transit.transitingPlanet} ${phaseLabel} — ${aspectLabel} natal ${transit.natalPlanet}`;
  const bodyText = `${transit.transitingPlanet} is ${phaseVerb} a ${aspectLabel} to your natal ${transit.natalPlanet} at ${natalPositionText} in your ${getFormattedHouseText(transitHouse)}.`;

  return (
    <div className={"border-t border-primary-700 pt-3"}>
      <div className="flex justify-between items-start">
        <h4 className="text-lg font-medium text-primary-700">{title}</h4>
      </div>
      <p className="text-primary-700 mt-1">{bodyText}</p>
    </div>
  );
}
