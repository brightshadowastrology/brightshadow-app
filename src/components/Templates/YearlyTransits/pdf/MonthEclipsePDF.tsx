import { Text, View } from "@react-pdf/renderer";
import {
  type Eclipse,
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
  getFormattedAspectText,
} from "@/shared/lib/textHelpers";
import { getAspectsToNatalPlanets, getPills } from "../../helpers";
import { PillPDF } from "./PillPDF";
import { eventStyles as s } from "./styles";

export function MonthEclipsePDF({
  eclipse,
  birthChartData,
  sectPlanets,
  profectionYearData,
}: {
  eclipse: Eclipse;
  birthChartData: PlanetPoint[];
  sectPlanets: SectPlanets;
  profectionYearData: ProfectionYearData | null;
}) {
  const lunationHouse = getHouseFromSign(
    birthChartData.find((a) => a.planet === "Ascendant")?.position.sign ??
      "Aries",
    eclipse.position.sign,
  );
  const lunationText = `${titleCase(eclipse.type)} | ${eclipse.position.sign} ${formatDegree(eclipse.position.degree, eclipse.position.minute)}`;
  const interpretationText = `This ${titleCase(eclipse.type)} occurs in your ${getFormattedHouseText(lunationHouse)} of ${getFormattedHouseDescriptionText([lunationHouse])}.`;
  const aspects = getAspectsToNatalPlanets(
    eclipse.position,
    birthChartData,
    eclipse.type,
    eclipse.date,
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
            <PillPDF key={pill.type} type={pill.type} toolTip={pill.toolTip} />
          ))}
        </View>
      )}
      <Text style={s.eventBody}>{interpretationText}</Text>
      {aspects.length > 0 && (
        <Text style={s.eventBody}>
          {getFormattedAspectText(aspects, eclipse.type)}
        </Text>
      )}
    </View>
  );
}
