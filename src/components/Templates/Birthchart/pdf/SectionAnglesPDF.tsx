import { formatDegree } from "@/shared/lib/textHelpers";
import { planetDescriptions } from "@/shared/text/general";
import { type PlanetPoint } from "@/shared/types";
import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { colors, sharedStyles } from "./styles";

const s = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    columnGap: 8,
  },
  cell: {
    width: "47%",
  },
  subText: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 1.5,
    marginTop: 3,
  },
});

type SectionAnglesPDFProps = {
  data: PlanetPoint[];
};

export function SectionAnglesPDF({ data }: SectionAnglesPDFProps) {
  const angles = data.filter((p) =>
    ["Ascendant", "Descendant", "Midheaven", "IC"].includes(p.planet),
  );

  return (
    <View style={sharedStyles.section}>
      <Text style={sharedStyles.sectionHeading}>Your Angles</Text>
      <View style={s.grid}>
        {angles.map((angle) => (
          <View key={angle.planet} style={[sharedStyles.card, s.cell]}>
            <View style={sharedStyles.cardHeader}>
              <Text style={sharedStyles.cardTitle}>{angle.planet}</Text>
              <Text style={sharedStyles.cardMeta}>
                {angle.position.sign}{" "}
                {formatDegree(angle.position.degree, angle.position.minute)}
              </Text>
            </View>
            <Text style={s.subText}>
              {planetDescriptions[angle.planet]?.tagline || ""} is colored by{" "}
              {angle.position.sign} energy.
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
