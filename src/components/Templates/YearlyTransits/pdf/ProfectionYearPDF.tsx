import { Text, View, StyleSheet } from "@react-pdf/renderer";
import { type ProfectionYearData, type PlanetPoint } from "@/shared/types";
import { getOrdinal, getPlanetRulerText } from "@/shared/lib/textHelpers";
import {
  signDescriptions,
  houseTopics,
  lordDescriptions,
} from "@/shared/text/text";
import { getPlanetDignity } from "../../helpers";
import { colors } from "./styles";

const s = StyleSheet.create({
  section: {
    marginBottom: 16,
    padding: 14,
    backgroundColor: colors.sectionBg,
    borderRadius: 6,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colors.sectionBorder,
  },
  heading: {
    fontSize: 14,
    fontFamily: "Lora",
    color: colors.textPrimary,
    marginBottom: 10,
  },
  card: {
    padding: 10,
    backgroundColor: colors.cardBg,
    borderRadius: 4,
    marginBottom: 8,
  },
  bodyText: {
    fontSize: 11,
    color: colors.textPrimary,
    lineHeight: 1.5,
    marginTop: 3,
  },
  houseRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  houseNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginRight: 10,
  },
  houseLabel: {
    fontSize: 13,
    color: colors.textPrimary,
  },
  divider: {
    borderTopWidth: 1,
    borderTopStyle: "solid",
    borderTopColor: colors.sectionBorder,
    marginTop: 8,
    paddingTop: 8,
  },
  subHeading: {
    fontSize: 12,
    fontWeight: "bold",
    color: colors.textPrimary,
    fontFamily: "Lora",
    marginBottom: 4,
  },
});

type ProfectionYearPDFProps = {
  data: ProfectionYearData;
  birthChartData: PlanetPoint[];
};

export function ProfectionYearPDF({
  data,
  birthChartData,
}: ProfectionYearPDFProps) {
  const { profectionYear, profectionSign, lordOfYear } = data;

  const houseThemes = `Your ${houseTopics[profectionYear]
    .join(", ")
    .replace(/, ([^,]*)$/, ", and $1")}.`;

  const formattedLordOfYear =
    lordOfYear === "Sun" || lordOfYear === "Moon"
      ? `The ${lordOfYear}`
      : lordOfYear;

  const signText = `This year emphasizes being ${signDescriptions[profectionSign]
    .join(", ")
    .replace(/, ([^,]*)$/, ", and $1")} in areas of life related to ${houseThemes.toLowerCase()}`;

  const natalLord = birthChartData.find((p) => p.planet === lordOfYear);

  const natalDescription = `Natally, your ${profectionSign} ${getOrdinal(profectionYear)} house is ruled by your ${lordOfYear}, ${getPlanetDignity(lordOfYear, profectionSign)} in the sign of ${profectionSign} in the ${getOrdinal(natalLord?.house ?? 0)} house.`;

  const rulerText = getPlanetRulerText(profectionYear, natalLord?.house ?? 0);

  const endText = `From now until your next birthday, you might find that these themes develop and come to fruition. You'll notice that transits in your ${getOrdinal(profectionYear)} house, transits to your ${lordOfYear}, and the transits of ${formattedLordOfYear.toLowerCase()} ${lordOfYear === "Moon" ? `(new and full moons, and especially eclipses!)` : ""}${lordOfYear === "Sun" ? `(eclipses in particular)` : ""} mark important turning points.`;

  const lordDescription =
    lordDescriptions[lordOfYear] ??
    `${lordOfYear} guides your year with its unique energy.`;

  return (
    <View style={s.section}>
      <Text style={s.heading}>Your Annual Profection</Text>

      <View style={s.card}>
        <Text style={s.bodyText}>
          Not every planet in our birthchart is active at the same time. The
          technique known as annual profections gives us a means to find out when
          specific planets (and the houses they rule) will play a bigger role in
          certain periods of time. The technique is simple: a year for a house.
          We start at 0 years of age, in the 1st house — themes related to the
          first house and how its ruler is placed become very visible. Then, when
          we turn 1 year old, we move into a 2nd house profection year, and 2nd
          house themes predominate our life.
        </Text>
      </View>

      <View style={s.card}>
        <View style={s.houseRow}>
          <Text style={s.houseNumber}>{profectionYear}</Text>
          <View>
            <Text style={s.houseLabel}>
              {getOrdinal(profectionYear)} House Year
            </Text>
            <Text style={s.bodyText}>{houseThemes}</Text>
          </View>
        </View>

        <View style={s.divider}>
          <Text style={s.subHeading}>Profected Sign: {profectionSign}</Text>
          <Text style={s.bodyText}>{signText}</Text>
        </View>

        <View style={s.divider}>
          <Text style={s.subHeading}>
            Lord of the Year: {formattedLordOfYear}
          </Text>
          <Text style={s.bodyText}>{natalDescription}</Text>
          {rulerText ? (
            <Text style={s.bodyText}>{rulerText}</Text>
          ) : null}
          <Text style={s.bodyText}>{endText}</Text>
          <Text style={s.bodyText}>{lordDescription}</Text>
        </View>
      </View>
    </View>
  );
}
