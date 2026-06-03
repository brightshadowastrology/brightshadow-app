import { ASPECT_LABELS } from "@/shared/lib/constants";
import { formatDegree, getHouseFromSign } from "@/shared/lib/textHelpers";
import {
  getFormattedHouseText,
  getFormattedTransitText,
  getGeneralSignificationsText,
} from "@/shared/text/general";
import { type PlanetPoint, type TransitEntry } from "@/shared/types";
import { Text, View } from "@react-pdf/renderer";
import { eventStyles as s } from "./styles";

export function MonthTransitWithOrbPDF({
  transit,
  birthChartData,
}: {
  transit: TransitEntry;
  birthChartData: PlanetPoint[];
}) {
  const ascendantSign =
    birthChartData.find((a) => a.planet === "Ascendant")?.position.sign ??
    "Aries";

  const transitHouse = getHouseFromSign(ascendantSign, transit.position.sign);
  const aspectLabel = ASPECT_LABELS[transit.aspect] ?? transit.aspect;
  const formattedDegree = formatDegree(
    transit.natalPosition.degree,
    transit.natalPosition.minute,
  );
  const natalPositionText = `${transit.natalPosition.sign} ${formattedDegree}`;
  const natalPlanetData =
    birthChartData.find((p) => p.planet === transit.natalPlanet) ??
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
    <View style={s.eventContainer}>
      <Text style={s.eventTitle}>{title}</Text>
      <Text style={s.eventBody}>{introText}</Text>
      {isApplying && (
        <>
          <Text style={s.eventBody}>{generalSignificationsText}</Text>
          <Text style={s.eventBody}>{transitInterpretation}</Text>
        </>
      )}
      <Text style={s.eventBody}>{aspectInterpretationText}</Text>
    </View>
  );
}
