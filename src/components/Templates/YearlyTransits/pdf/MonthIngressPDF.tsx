import { Text, View } from "@react-pdf/renderer";
import { type IngressEntry, type PlanetPoint } from "@/shared/types";
import {
  getHouseFromSign,
  getFormattedHouseText,
  getFormattedHouseRulersText,
  getFormattedHouseDescriptionText,
  getIngressInterpretation,
} from "@/shared/lib/textHelpers";
import { eventStyles as s } from "./styles";

const TRADITIONAL_PLANETS = ["Mercury", "Venus", "Mars", "Jupiter", "Saturn"];

export function MonthIngressPDF({
  ingress,
  birthChartData,
}: {
  ingress: IngressEntry;
  birthChartData: PlanetPoint[];
}) {
  const natalPlacement = birthChartData.find(
    (element) => element.planet === ingress.planet,
  );

  if (!natalPlacement) return null;

  const houseIngressedInto = getHouseFromSign(
    birthChartData.find((a) => a.planet === "Ascendant")?.position.sign ??
      "Aries",
    ingress.sign,
  );
  const ingressInterpretation = getIngressInterpretation(
    ingress.planet,
    houseIngressedInto.toString(),
  );
  const isTraditionalPlanet = TRADITIONAL_PLANETS.includes(ingress.planet);
  const placementText = `Natally, ${ingress.planet} rules your ${getFormattedHouseRulersText(natalPlacement.rulerOf ?? [])}. During this transit, topics related to your ${getFormattedHouseDescriptionText(natalPlacement.rulerOf ?? [])}, will be brought up in your ${getFormattedHouseDescriptionText([houseIngressedInto])}.`;

  return (
    <View style={s.eventContainer}>
      <Text style={s.eventTitle}>
        {ingress.planet} enters your {ingress.sign}{" "}
        {getFormattedHouseText(houseIngressedInto)}
      </Text>
      <Text style={s.eventBody}>{ingressInterpretation}</Text>
      {isTraditionalPlanet && <Text style={s.eventBody}>{placementText}</Text>}
    </View>
  );
}
