import {
  Document,
  Font,
  Page,
  View,
  Text,
  StyleSheet,
} from "@react-pdf/renderer";

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
import {
  type Eclipse,
  type Lunation,
  type RetrogradeEvent,
  type IngressEntry,
  type TransitEntry,
  type PlanetPoint,
  type SectPlanets,
  type ProfectionYearData,
} from "@/shared/types";
import { MonthEclipsePDF } from "./MonthEclipsePDF";
import { MonthLunationPDF } from "./MonthLunationPDF";
import { MonthRetrogradePDF } from "./MonthRetrogradePDF";
import { MonthIngressPDF } from "./MonthIngressPDF";
import { MonthTransitPDF } from "./MonthTransitPDF";
import { MonthIngressWithOrbPDF } from "./MonthIngressWithOrbPDF";
import { MonthBirthdayPDF } from "./MonthBirthdayPDF";
import { ProfectionYearPDF } from "./ProfectionYearPDF";
import { colors } from "./styles";

// ─── Types ───────────────────────────────────────────────────────────────────

export type MonthEvent =
  | { type: "eclipse"; date: string; data: Eclipse }
  | { type: "lunation"; date: string; data: Lunation }
  | { type: "retrograde"; date: string; data: RetrogradeEvent }
  | { type: "ingress"; date: string; data: IngressEntry }
  | { type: "transit"; date: string; data: TransitEntry }
  | { type: "birthday"; date: string; data: ProfectionYearData | null };

export type MonthData = {
  label: string;
  year: number;
  events: MonthEvent[];
};

export type YearlyTransitsPDFProps = {
  months: MonthData[];
  birthChartData: PlanetPoint[];
  sectPlanets: SectPlanets;
  profectionYear?: ProfectionYearData | null;
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
    marginBottom: 20,
  },
  section: {
    marginBottom: 16,
    padding: 14,
    backgroundColor: colors.sectionBg,
    borderRadius: 6,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colors.sectionBorder,
  },
  monthHeading: {
    fontSize: 14,
    fontFamily: "Lora",
    color: colors.textPrimary,
    marginBottom: 10,
  },
  dayCard: {
    marginTop: 8,
    padding: 10,
    backgroundColor: colors.cardBg,
    borderRadius: 4,
  },
  dayLabel: {
    fontSize: 9,
    color: colors.textMuted,
    marginBottom: 6,
  },
  emptyMonth: {
    fontSize: 9,
    color: colors.textMuted,
  },
});

// ─── Component ───────────────────────────────────────────────────────────────

export function YearlyTransitsPDF({
  months,
  birthChartData,
  sectPlanets,
  profectionYear,
}: YearlyTransitsPDFProps) {
  return (
    <Document>
      <Page size="LETTER" style={styles.page} wrap>
        <Text style={styles.pageTitle}>Yearly Transits</Text>

        {profectionYear && (
          <ProfectionYearPDF
            data={profectionYear}
            birthChartData={birthChartData}
          />
        )}

        {months.map(({ label, year, events }) => {
          // Group events by date
          const byDay = events.reduce<Record<string, MonthEvent[]>>(
            (groups, event) => {
              const key = event.date.slice(0, 10);
              (groups[key] ??= []).push(event);
              return groups;
            },
            {},
          );

          return (
            <View key={`${label}-${year}`} style={styles.section}>
              <Text style={styles.monthHeading}>
                {label} {year}
              </Text>

              {Object.keys(byDay).length === 0 ? (
                <Text style={styles.emptyMonth}>
                  No notable events for the remainder of this month.
                </Text>
              ) : (
                Object.entries(byDay).map(([dateKey, dayEvents]) => {
                  const day = parseInt(dateKey.slice(8, 10), 10);
                  return (
                    <View key={dateKey} style={styles.dayCard}>
                      <Text style={styles.dayLabel}>
                        {label} {day}, {year}
                      </Text>

                      {dayEvents.map((event, i) => {
                        switch (event.type) {
                          case "eclipse":
                            return (
                              <MonthEclipsePDF
                                key={`eclipse-${i}`}
                                eclipse={event.data}
                                birthChartData={birthChartData}
                                sectPlanets={sectPlanets}
                                profectionYearData={profectionYear ?? null}
                              />
                            );
                          case "lunation":
                            return (
                              <MonthLunationPDF
                                key={`lunation-${i}`}
                                lunation={event.data}
                                birthChartData={birthChartData}
                                sectPlanets={sectPlanets}
                                profectionYearData={profectionYear ?? null}
                              />
                            );
                          case "retrograde":
                            return (
                              <MonthRetrogradePDF
                                key={`retrograde-${i}`}
                                retrograde={event.data}
                                birthChartData={birthChartData}
                                retrogradePlanet={event.data.planet}
                              />
                            );
                          case "ingress":
                            return (
                              <MonthIngressPDF
                                key={`ingress-${i}`}
                                ingress={event.data}
                                birthChartData={birthChartData}
                              />
                            );
                          case "transit":
                            return event.data.phase === "applying" ||
                              event.data.phase === "separating" ? (
                              <MonthIngressWithOrbPDF
                                key={`transit-${i}`}
                                transit={event.data}
                                birthChartData={birthChartData}
                              />
                            ) : (
                              <MonthTransitPDF
                                key={`transit-${i}`}
                                transit={event.data}
                                birthChartData={birthChartData}
                                sectPlanets={sectPlanets}
                                profectionYearData={profectionYear ?? null}
                              />
                            );
                          case "birthday":
                            return event.data ? (
                              <MonthBirthdayPDF
                                key="birthday"
                                nextProfectionYear={event.data}
                                birthChartData={birthChartData}
                              />
                            ) : null;
                        }
                      })}
                    </View>
                  );
                })
              )}
            </View>
          );
        })}
      </Page>
    </Document>
  );
}
