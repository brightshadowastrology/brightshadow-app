import { Text, View } from "@react-pdf/renderer";
import { type TransitEntry, type PlanetPoint, type SectPlanets } from "@/shared/types";
import {
  formatDegree,
  getHouseFromSign,
  getFormattedHouseText,
  getFormattedTransitText,
} from "@/shared/lib/textHelpers";
import { getPills } from "../../helpers";
import { PillPDF } from "./PillPDF";
import { eventStyles as s } from "./styles";

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
    birthChartData.find((a) => a.planet === "Ascendant")?.position.sign ?? "Aries";
  const natalPlanetData =
    birthChartData.find((p) => p.planet === transit.natalPlanet) ??
    birthChartData[0];

  const transitHouse = getHouseFromSign(ascendantSign, transit.position.sign);
  const aspectLabel = ASPECT_LABELS[transit.aspect] ?? transit.aspect;

  const title = `${transit.transitingPlanet} ${aspectLabel} natal ${transit.natalPlanet}`;
  const positionText = `${transit.position.sign} ${formatDegree(transit.position.degree, transit.position.minute)}`;
  const interpretationText = `Transiting ${transit.transitingPlanet} at ${positionText} in your ${getFormattedHouseText(transitHouse)} forms a ${aspectLabel} to your natal ${transit.natalPlanet} at ${transit.natalPosition.sign} ${formatDegree(transit.natalPosition.degree, transit.natalPosition.minute)}.`;
  const transitInterpretation = getFormattedTransitText(
    transit.transitingPlanet,
    natalPlanetData,
    aspectLabel,
  );

  const pills = getPills(birthChartData, sectPlanets, transit);

  return (
    <View style={s.eventContainer}>
      <View style={s.eventHeader}>
        <Text style={s.eventTitle}>{title}</Text>
        <View style={s.pillRow}>
          {pills.map((pill) => (
            <PillPDF key={pill.type} type={pill.type} />
          ))}
        </View>
      </View>
      <Text style={s.eventBody}>{interpretationText}</Text>
      {transitInterpretation && (
        <Text style={s.eventBody}>{transitInterpretation}</Text>
      )}
    </View>
  );
}
