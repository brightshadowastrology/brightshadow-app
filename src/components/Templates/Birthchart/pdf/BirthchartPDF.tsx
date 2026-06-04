import { type BirthInfo, type PlanetPoint, type SectPlanets } from "@/shared/types";
import {
  Document,
  Font,
  Page,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import { SectionAnglesPDF } from "./SectionAnglesPDF";
import { SectionPlacementsPDF } from "./SectionPlacementsPDF";
import { SectionSectPDF } from "./SectionSectPDF";
import { colors } from "./styles";

Font.register({
  family: "Quicksand",
  fonts: [
    { src: "/fonts/Quicksand-VariableFont_wght.ttf" },
    { src: "/fonts/Quicksand-VariableFont_wght.ttf", fontWeight: "bold" },
  ],
});

Font.register({
  family: "Lora",
  fonts: [
    { src: "/fonts/Lora-VariableFont_wght.ttf" },
    { src: "/fonts/Lora-Italic-VariableFont_wght.ttf", fontStyle: "italic" },
  ],
});

// ─── Types ───────────────────────────────────────────────────────────────────

export type BirthchartPDFProps = {
  birthChartData: PlanetPoint[];
  sectPlanets: SectPlanets;
  isDayChart: boolean | null;
  birthInfo?: BirthInfo | null;
};

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  page: {
    backgroundColor: colors.pageBg,
    paddingVertical: 10,
    paddingHorizontal: 40,
    fontFamily: "Quicksand",
  },
  pageTitle: {
    fontSize: 20,
    fontFamily: "Lora",
    color: colors.textPrimary,
    marginBottom: 16,
    textAlign: "center",
  },
  pageIntro: {
    fontSize: 12,
    fontFamily: "Lora",
    color: colors.textPrimary,
    marginBottom: 8,
    textAlign: "center",
  },
});

// ─── Component ───────────────────────────────────────────────────────────────

export function BirthchartPDF({
  birthChartData,
  sectPlanets,
  isDayChart,
  birthInfo,
}: BirthchartPDFProps) {
  return (
    <Document>
      <Page size="LETTER" style={styles.page} wrap>
        <Text style={styles.pageTitle}>Birthchart Interpretation Report</Text>

        {birthInfo && (
          <View>
            <Text style={styles.pageIntro}>
              {new Date(birthInfo.birthDate + "T00:00:00").toLocaleDateString(
                "en-US",
                { month: "long", day: "numeric", year: "numeric" },
              )}{" "}
              · {birthInfo.birthTime} · {birthInfo.location}
            </Text>
          </View>
        )}

        <SectionPlacementsPDF data={birthChartData} />
        <SectionAnglesPDF data={birthChartData} />
        <SectionSectPDF
          data={birthChartData}
          sectPlanets={sectPlanets}
          isDayChart={isDayChart}
        />
      </Page>
    </Document>
  );
}
