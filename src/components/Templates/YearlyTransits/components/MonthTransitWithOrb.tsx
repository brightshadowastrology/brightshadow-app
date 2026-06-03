import { useBirthChart } from "@/components/Providers/BirthChartContext";
import { ASPECT_LABELS } from "@/shared/lib/constants";
import { formatDegree, getHouseFromSign } from "@/shared/lib/textHelpers";
import {
  getFormattedHouseText,
  getFormattedTransitText,
  getGeneralSignificationsText,
} from "@/shared/text/general";
import { type TransitEntry } from "@/shared/types";

export default function MonthTransitWithOrb({
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
  const formattedDegree = formatDegree(
    transit.natalPosition.degree,
    transit.natalPosition.minute,
  );
  const natalPositionText = `${transit.natalPosition.sign} ${formattedDegree}`;
  const natalPlanetData =
    birthChartData.find((p) => p.planet === transit.natalPlanet) ||
    birthChartData[0];

  const isApplying = transit.phase === "applying";
  const phaseVerb = isApplying ? "approaching" : "separating from";
  const phaseLabel = isApplying ? "Applying" : "Separating";

  const aspectInterpretationText = isApplying
    ? `As the transit is applying, its influence is building up, and will reach its peak as it goes exact. `
    : `As the transit is separating, its influence is waning, and you may be moving past the most intense effects.`;

  const title = `${transit.transitingPlanet} ${phaseLabel} — ${aspectLabel} natal ${transit.natalPlanet}`;
  const introText = `${transit.transitingPlanet} is ${phaseVerb} a ${aspectLabel} to your natal ${transit.natalPlanet} at ${natalPositionText} in your ${getFormattedHouseText(transitHouse)}.`;

  const generalSignificationsText = getGeneralSignificationsText(
    transit.transitingPlanet,
    natalPlanetData,
    aspectLabel,
  );
  const transitInterpretation = getFormattedTransitText(
    transit.transitingPlanet,
    natalPlanetData,
    aspectLabel,
  );

  return (
    <div className={"border-t border-primary-700 pt-3"}>
      <div className="flex justify-between items-start">
        <h4 className="text-lg font-medium text-primary-700">{title}</h4>
      </div>

      <p className="text-primary-700 mt-1">{introText}</p>

      {isApplying && (
        <>
          <p className="text-primary-700 mt-1">{generalSignificationsText}</p>
          <p className="text-primary-700 mt-1">{transitInterpretation}</p>
        </>
      )}

      <p className="text-primary-700 mt-1">{aspectInterpretationText}</p>
    </div>
  );
}
