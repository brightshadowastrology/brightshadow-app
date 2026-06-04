import { formatDegree } from "@/shared/lib/textHelpers";
import { placementInterpretationText } from "@/shared/text/general";
import { type PlanetPoint } from "@/shared/types";
import { Text, View } from "@react-pdf/renderer";
import { sharedStyles } from "./styles";

type SectionPlacementsPDFProps = {
  data: PlanetPoint[];
};

export function SectionPlacementsPDF({ data }: SectionPlacementsPDFProps) {
  const planets = data.filter(
    (p) => !["Ascendant", "Descendant", "Midheaven", "IC"].includes(p.planet),
  );

  return (
    <View style={sharedStyles.section}>
      <Text style={sharedStyles.sectionHeading}>Your Planetary Placements</Text>
      {planets.map((placement) => (
        <View key={placement.planet} style={sharedStyles.card}>
          <View style={sharedStyles.cardHeader}>
            <Text style={sharedStyles.cardTitle}>
              {placement.planet} in {placement.position.sign}
            </Text>
            <Text style={sharedStyles.cardMeta}>
              {formatDegree(placement.position.degree, placement.position.minute)}{" "}
              | House {placement.house}
            </Text>
          </View>
          {placementInterpretationText(placement, data).map((text, index) => (
            <Text key={index} style={sharedStyles.bodyText}>
              {text}
            </Text>
          ))}
        </View>
      ))}
    </View>
  );
}
