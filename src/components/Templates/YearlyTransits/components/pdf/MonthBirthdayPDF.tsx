import { Text, View } from "@react-pdf/renderer";
import { type ProfectionYearData } from "@/shared/types";
import {
  getOrdinal,
  getFormattedHouseTopicsText,
} from "@/shared/lib/textHelpers";
import { lordDescriptions } from "@/shared/text/text";
import { eventStyles as s } from "./styles";

export function MonthBirthdayPDF({
  nextProfectionYear,
}: {
  nextProfectionYear: ProfectionYearData;
}) {
  const { profectionYear, lordOfYear } = nextProfectionYear;
  const houseThemes = getFormattedHouseTopicsText(profectionYear);

  return (
    <View style={s.eventContainer}>
      <Text style={s.eventTitle}>Happy Birthday!</Text>
      <Text style={s.eventBody}>
        You are now entering a {getOrdinal(profectionYear)} house profection
        year. This year highlights your {houseThemes}.
      </Text>
      <Text style={s.eventBody}>
        Your Lord of the Year is {lordOfYear}.{" "}
        {lordDescriptions[lordOfYear] ??
          `${lordOfYear} guides your year with its unique energy.`}
      </Text>
    </View>
  );
}
