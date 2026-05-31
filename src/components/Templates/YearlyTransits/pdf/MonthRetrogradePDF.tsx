import { Text, View } from "@react-pdf/renderer";
import { type RetrogradeEvent, type PlanetPoint } from "@/shared/types";
import {
  formatDegree,
  getHouseFromSign,
  getFormattedHouseText,
  getFormattedHouseTopicsText,
} from "@/shared/lib/textHelpers";
import { eventStyles as s } from "./styles";
import { getRetrogradeRecommendationText } from "@/components/Templates/helpers";

export function MonthRetrogradePDF({
  retrograde,
  birthChartData,
  retrogradePlanet,
}: {
  retrograde: RetrogradeEvent;
  birthChartData: PlanetPoint[];
  retrogradePlanet: string;
}) {
  const phase = retrograde.isStarting
    ? `${retrograde.planet} Retrograde begins`
    : `${retrograde.planet} Retrograde ends`;
  const houseIngressedInto = getHouseFromSign(
    birthChartData.find((a) => a.planet === "Ascendant")?.position.sign ?? "Aries",
    retrograde.position.sign,
  );
  const retrogradeText = `${phase} | ${retrograde.position.sign} ${formatDegree(retrograde.position.degree, retrograde.position.minute)}`;
  const interpretationText = `This ${phase} in your ${getFormattedHouseText(houseIngressedInto)}.`;
  const recommendationText = getRetrogradeRecommendationText(
    retrogradePlanet,
    getFormattedHouseTopicsText(houseIngressedInto),
  );

  return (
    <View style={s.eventContainer}>
      <Text style={s.eventTitle}>{retrogradeText}</Text>
      <Text style={s.eventBody}>{interpretationText}</Text>
      {retrograde.isStarting && <Text style={s.eventBody}>{recommendationText}</Text>}
    </View>
  );
}
