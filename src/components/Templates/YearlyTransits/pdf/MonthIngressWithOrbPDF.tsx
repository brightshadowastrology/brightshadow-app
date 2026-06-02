import { Text, View } from "@react-pdf/renderer";
import { type TransitEntry, type PlanetPoint } from "@/shared/types";
import {
  formatDegree,
  getHouseFromSign,
  getFormattedHouseText,
} from "@/shared/lib/textHelpers";
import { ASPECT_LABELS } from "@/shared/lib/constants";
import { eventStyles as s } from "./styles";

export function MonthIngressWithOrbPDF({
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
  const natalPositionText = `${transit.natalPosition.sign} ${formatDegree(transit.natalPosition.degree, transit.natalPosition.minute)}`;

  const isApplying = transit.phase === "applying";
  const phaseVerb = isApplying ? "approaching" : "separating from";
  const phaseLabel = isApplying ? "Applying" : "Separating";

  const title = `${transit.transitingPlanet} ${phaseLabel} — ${aspectLabel} natal ${transit.natalPlanet}`;
  const bodyText = `${transit.transitingPlanet} is ${phaseVerb} a ${aspectLabel} to your natal ${transit.natalPlanet} at ${natalPositionText} in your ${getFormattedHouseText(transitHouse)}.`;

  return (
    <View style={s.eventContainer}>
      <Text style={s.eventTitle}>{title}</Text>
      <Text style={s.eventBody}>{bodyText}</Text>
    </View>
  );
}
