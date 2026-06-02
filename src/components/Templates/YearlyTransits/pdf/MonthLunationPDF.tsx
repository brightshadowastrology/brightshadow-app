import { Text, View } from "@react-pdf/renderer";
import {
  type Lunation,
  type PlanetPoint,
  type SectPlanets,
  type ProfectionYearData,
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
import { getAspectsToNatalPlanets, getPills } from "../../helpers";
import { InfoPillPDF } from "./InfoPillPDF";
import { eventStyles as s } from "./styles";

export function MonthLunationPDF({
  lunation,
  birthChartData,
  sectPlanets,
  profectionYearData,
}: {
  lunation: Lunation;
  birthChartData: PlanetPoint[];
  sectPlanets: SectPlanets;
  profectionYearData: ProfectionYearData | null;
}) {
  const lunationHouse = getHouseFromSign(
    birthChartData.find((a) => a.planet === "Ascendant")?.position.sign ??
      "Aries",
    lunation.position.sign,
  );
  const lunationText = `${titleCase(lunation.lunationType)} in ${lunation.position.sign} | ${formatDegree(lunation.position.degree, lunation.position.minute)}`;
  const interpretationText = `The ${lunation.lunationType} occurs in your ${getFormattedHouseText(lunationHouse)} of ${getFormattedHouseDescriptionText([lunationHouse])}.`;
  const recommendationText =
    lunation.lunationType === "new moon"
      ? `It's a good time to set new intensions around your ${getFormattedHouseTopicsText(lunationHouse)}.`
      : `This period of time marks the completion of efforts over the last sixth months in relation to ${getFormattedHouseTopicsText(lunationHouse)}.`;
  const aspects = getAspectsToNatalPlanets(
    lunation.position,
    birthChartData,
    lunation.lunationType,
    lunation.date,
  );
  const pills = aspects
    .flatMap((aspect) => getPills(birthChartData, sectPlanets, aspect, profectionYearData))
    .filter(
      (pill, index, self) =>
        index === self.findIndex((p) => p.type === pill.type),
    );

  return (
    <View style={s.eventContainer}>
      <Text style={s.eventTitle}>{lunationText}</Text>
      {pills.length > 0 && (
        <View style={s.pillsColumn}>
          {pills.map((pill) => (
            <InfoPillPDF key={pill.type} type={pill.type} toolTip={pill.toolTip} />
          ))}
        </View>
      )}
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
