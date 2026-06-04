import { formatDegree } from "@/shared/lib/textHelpers";
import { type PlanetPoint, type SectPlanets } from "@/shared/types";
import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { colors, sharedStyles } from "./styles";

const s = StyleSheet.create({
  chartType: {
    fontSize: 11,
    color: colors.textMuted,
    marginBottom: 4,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    columnGap: 8,
  },
  cell: {
    width: "47%",
  },
  roleLabel: {
    fontSize: 9,
    color: colors.textMuted,
    marginBottom: 2,
  },
  descText: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 1.5,
    marginTop: 3,
  },
});

type SectionSectPDFProps = {
  data: PlanetPoint[];
  sectPlanets: SectPlanets;
  isDayChart: boolean | null;
};

export function SectionSectPDF({
  sectPlanets,
  isDayChart,
}: SectionSectPDFProps) {
  const { inSectBenefic, outOfSectBenefic, inSectMalefic, outOfSectMalefic } =
    sectPlanets;

  if (
    isDayChart === null ||
    !inSectBenefic ||
    !outOfSectBenefic ||
    !inSectMalefic ||
    !outOfSectMalefic
  ) {
    return null;
  }

  const entries = [
    { role: "In-Sect Benefic", planet: inSectBenefic },
    { role: "Out-of-Sect Benefic", planet: outOfSectBenefic },
    { role: "In-Sect Malefic", planet: inSectMalefic },
    { role: "Out-of-Sect Malefic", planet: outOfSectMalefic },
  ];

  return (
    <View style={sharedStyles.section}>
      <Text style={sharedStyles.sectionHeading}>Sect</Text>
      <Text style={s.chartType}>
        You have a {isDayChart ? "day" : "night"} chart.
      </Text>
      <View style={s.grid}>
        {entries.map(({ role, planet }) => (
          <View key={role} style={[sharedStyles.card, s.cell]}>
            <Text style={s.roleLabel}>{role}</Text>
            <View style={sharedStyles.cardHeader}>
              <Text style={sharedStyles.cardTitle}>{planet.planet}</Text>
              <Text style={sharedStyles.cardMeta}>
                {planet.position.sign}{" "}
                {formatDegree(planet.position.degree, planet.position.minute)}
              </Text>
            </View>
            <Text style={s.descText}>
              Your {role.toLowerCase()} is {planet.planet}.
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
