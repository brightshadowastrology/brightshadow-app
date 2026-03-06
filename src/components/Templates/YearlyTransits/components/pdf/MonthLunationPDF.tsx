import { Text, View } from "@react-pdf/renderer";
import {
  type Lunation,
  type PlanetPoint,
  type SectPlanets,
} from "@/shared/types";
import {
  titleCase,
  formatDegree,
  getHouseFromSign,
  getFormattedHouseText,
  getFormattedHouseDescriptionText,
  getFormattedHouseTopicsText,
  getFormattedAspectText,
} from "@/shared/lib/textHelpers";
import { getAspectsToNatalPlanets, getPills } from "../../../helpers";
import { PillPDF } from "./PillPDF";
import { eventStyles as s } from "./styles";

export function MonthLunationPDF({
  lunation,
  birthChartData,
  sectPlanets,
}: {
  lunation: Lunation;
  birthChartData: PlanetPoint[];
  sectPlanets: SectPlanets;
}) {
  const lunationHouse = getHouseFromSign(
    birthChartData.find((a) => a.planet === "Ascendant")?.position.sign ??
      "Aries",
    lunation.position.sign,
  );
  const lunationText = `${titleCase(lunation.lunationType)} in ${lunation.position.sign} | ${formatDegree(lunation.position.degree, lunation.position.minute)}`;
  const interpretationText = `This ${lunation.lunationType} occurs in your ${getFormattedHouseText(lunationHouse)} of ${getFormattedHouseDescriptionText([lunationHouse])}.`;
  const recommendationText =
    lunation.lunationType === "new moon"
      ? `This is a good time to set new intensions around your ${getFormattedHouseTopicsText(lunationHouse)}.`
      : `This full moon marks the completion of efforts over the last sixth months in your ${getFormattedHouseTopicsText(lunationHouse)}.`;
  const aspects = getAspectsToNatalPlanets(
    lunation.position,
    birthChartData,
    lunation.lunationType,
    lunation.date,
  );
  const pills = aspects
    .flatMap((aspect) => getPills(birthChartData, sectPlanets, aspect))
    .filter(
      (pill, index, self) =>
        index === self.findIndex((p) => p.type === pill.type),
    );

  return (
    <View style={s.eventContainer}>
      <View style={s.eventHeader}>
        <Text style={s.eventTitleInRow}>{lunationText}</Text>
        <View style={s.pillRow}>
          {pills.map((pill) => (
            <PillPDF key={pill.type} type={pill.type} />
          ))}
        </View>
      </View>
      <Text
        style={s.eventBody}
      >{`${interpretationText} ${recommendationText}`}</Text>
      {aspects.length > 0 && (
        <Text style={s.eventBody}>
          {getFormattedAspectText(aspects, lunation.lunationType)}
        </Text>
      )}
    </View>
  );
}
