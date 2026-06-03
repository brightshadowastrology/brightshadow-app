import { formatDegree, getHouseFromSign } from "@/shared/lib/textHelpers";
import {
  getFormattedHouseText,
  getFormattedHouseTopicsText,
} from "@/shared/text/general";
import { getRetrogradeRecommendationText } from "@/shared/text/retrogradeRecommendationText";
import { type PlanetPoint, type RetrogradeEvent } from "@/shared/types";
import { Text, View } from "@react-pdf/renderer";
import { eventStyles as s } from "./styles";

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
    birthChartData.find((a) => a.planet === "Ascendant")?.position.sign ??
      "Aries",
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
      {retrograde.isStarting && (
        <Text style={s.eventBody}>{recommendationText}</Text>
      )}
    </View>
  );
}
