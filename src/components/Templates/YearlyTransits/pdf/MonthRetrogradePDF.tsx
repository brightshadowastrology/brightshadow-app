import { Text, View } from "@react-pdf/renderer";
import { type RetrogradeEvent, type PlanetPoint } from "@/shared/types";
import {
  formatDegree,
  getHouseFromSign,
  getFormattedHouseText,
  getFormattedHouseTopicsText,
} from "@/shared/lib/textHelpers";
import { eventStyles as s } from "./styles";

export function MonthRetrogradePDF({
  retrograde,
  birthChartData,
}: {
  retrograde: RetrogradeEvent;
  birthChartData: PlanetPoint[];
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
  const recommendationText = `This is a time when you may miscommunicate or experience delays around your ${getFormattedHouseTopicsText(houseIngressedInto)}. For these same reasons however, it's an excellent time to slow down, review, and reconsider these areas of life.`;

  return (
    <View style={s.eventContainer}>
      <Text style={s.eventTitle}>{retrogradeText}</Text>
      <Text style={s.eventBody}>{interpretationText}</Text>
      <Text style={s.eventBody}>{recommendationText}</Text>
    </View>
  );
}
