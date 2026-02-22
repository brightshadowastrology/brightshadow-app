import { Text, View } from "@react-pdf/renderer";
import { type PlanetPoint, type ProfectionYearData } from "@/shared/types";
import { getOrdinal, getFormattedHouseTopicsText } from "@/shared/lib/textHelpers";
import { lordDescriptions } from "@/shared/lib/text";
import * as constants from "@/shared/lib/constants";
import { eventStyles as s } from "./styles";

export function MonthBirthdayPDF({
  birthChartData,
  profectionYear,
}: {
  birthChartData: PlanetPoint[];
  profectionYear: ProfectionYearData;
}) {
  const nextYear = (profectionYear.profectionYear % 12) + 1;
  const nextHouseThemes = getFormattedHouseTopicsText(nextYear);

  const ascendantSign =
    birthChartData.find((a) => a.planet === "Ascendant")?.position.sign ?? "Aries";
  const ascIndex = constants.SIGNS.indexOf(ascendantSign);
  const nextSignIndex = (ascIndex + nextYear - 1) % 12;
  const nextSign = constants.SIGNS[nextSignIndex];
  const nextLord = constants.SIGN_RULERS[nextSign];

  return (
    <View style={s.eventContainer}>
      <Text style={s.eventTitle}>Happy Birthday!</Text>
      <Text style={s.eventBody}>
        You are now entering a {getOrdinal(nextYear)} house profection year. This
        year highlights your {nextHouseThemes}.
      </Text>
      <Text style={s.eventBody}>
        Your Lord of the Year is {nextLord}.{" "}
        {lordDescriptions[nextLord] ??
          `${nextLord} guides your year with its unique energy.`}
      </Text>
    </View>
  );
}
