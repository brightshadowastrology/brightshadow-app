import { getOrdinal, getPlanetDignity } from "@/shared/lib/textHelpers";
import { getPlanetRulerText, lordDescriptions } from "@/shared/text/general";
import { type PlanetPoint, type ProfectionYearData } from "@/shared/types";
import { Text, View } from "@react-pdf/renderer";
import { eventStyles as s } from "./styles";

type MonthBirthdayPDFProps = {
  nextProfectionYear: ProfectionYearData;
  birthChartData: PlanetPoint[] | null;
};

export function MonthBirthdayPDF({
  nextProfectionYear,
  birthChartData,
}: MonthBirthdayPDFProps) {
  if (!birthChartData) return null;

  const { profectionYear, profectionSign, lordOfYear } = nextProfectionYear;

  const formattedLordOfYear =
    lordOfYear === "Sun" || lordOfYear === "Moon"
      ? `The ${lordOfYear}`
      : lordOfYear;
  const natalLord = birthChartData.find(
    (planet) => planet.planet === lordOfYear,
  );
  const endText = `From now until your next birthday, you might find that these themes develop and come to fruition. You'll notice that transits in your ${getOrdinal(profectionYear)} house, transits to your ${lordOfYear}, and the transits of ${formattedLordOfYear.toLowerCase()} ${lordOfYear === "Moon" ? `(new and full moons, and especially eclipses!)` : ""} ${lordOfYear === "Sun" ? `(eclipses in particular)` : ""} mark important turning points.`;

  return (
    <View style={s.eventContainer}>
      <Text style={s.eventTitle}>Happy Birthday!</Text>
      <Text style={s.eventBody}>
        You are now entering a {getOrdinal(profectionYear)} house profection
        year.
      </Text>
      <Text style={s.eventBody}>
        {`Natally, your ${profectionSign} ${getOrdinal(profectionYear)} house is ruled by your ${lordOfYear}, ${getPlanetDignity(lordOfYear, profectionSign)} in the sign of ${profectionSign} in the ${getOrdinal(natalLord?.house || 0)} house.`}
      </Text>
      <Text style={s.eventBody}>
        {getPlanetRulerText(profectionYear, natalLord?.house || 0)}
      </Text>
      <Text style={s.eventBody}>{endText}</Text>
      <Text style={s.eventBody}>
        {lordDescriptions[lordOfYear] ||
          `${lordOfYear} guides your year with its unique energy.`}
      </Text>
    </View>
  );
}
