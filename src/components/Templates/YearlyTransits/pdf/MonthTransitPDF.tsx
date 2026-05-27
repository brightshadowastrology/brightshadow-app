import { Text, View } from "@react-pdf/renderer";
import {
  type TransitEntry,
  type PlanetPoint,
  type SectPlanets,
} from "@/shared/types";
import {
  formatDegree,
  getHouseFromSign,
  getFormattedHouseText,
  getGeneralSignificationsText,
  getFormattedTransitText,
} from "@/shared/lib/textHelpers";
import { ASPECT_LABELS } from "@/shared/lib/constants";
import { getPills } from "../../helpers";
import { PillPDF } from "./PillPDF";
import { eventStyles as s } from "./styles";

export function MonthTransitPDF({
  transit,
  birthChartData,
  sectPlanets,
}: {
  transit: TransitEntry;
  birthChartData: PlanetPoint[];
  sectPlanets: SectPlanets;
}) {
  const ascendantSign =
    birthChartData.find((a) => a.planet === "Ascendant")?.position.sign ??
    "Aries";
  const natalPlanetData =
    birthChartData.find((p) => p.planet === transit.natalPlanet) ??
    birthChartData[0];

  const transitHouse = getHouseFromSign(ascendantSign, transit.position.sign);
  const aspectLabel = ASPECT_LABELS[transit.aspect] ?? transit.aspect;

  const title = `${transit.transitingPlanet} ${aspectLabel} natal ${transit.natalPlanet}`;
  const positionText = `${transit.position.sign} ${formatDegree(transit.position.degree, transit.position.minute)}`;
  const interpretationText = `Transiting ${transit.transitingPlanet} at ${positionText} in your ${getFormattedHouseText(transitHouse)} forms a ${aspectLabel} to your natal ${transit.natalPlanet} at ${transit.natalPosition.sign} ${formatDegree(transit.natalPosition.degree, transit.natalPosition.minute)}.`;
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

  const pills = getPills(birthChartData, sectPlanets, transit);

  return (
    <View style={s.eventContainer}>
      <Text style={s.eventTitle}>{title}</Text>
      {pills.length > 0 && (
        <View style={s.pillsColumn}>
          {pills.map((pill) => (
            <PillPDF key={pill.type} type={pill.type} toolTip={pill.toolTip} />
          ))}
        </View>
      )}
      <Text style={s.eventBody}>{interpretationText}</Text>
      {generalSignificationsText && (
        <Text style={s.eventBody}>{generalSignificationsText}</Text>
      )}
      {transitInterpretation && (
        <Text style={s.eventBody}>{transitInterpretation}</Text>
      )}
    </View>
  );
}
