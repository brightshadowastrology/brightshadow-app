import { ASPECT_LABELS, MONTHS } from "@/shared/lib/constants";
import {
  formatDegree,
  getAspectsToNatalPlanets,
  getPills,
  titleCase,
} from "@/shared/lib/textHelpers";
import {
  type Eclipse,
  type Lunation,
  type PlanetPoint,
  type ProfectionYearData,
  type SectPlanets,
  type TransitEntry,
} from "@/shared/types";
import { Text, View } from "@react-pdf/renderer";
import { PillPDF } from "./PillPDF";
import { colors } from "./styles";

export type NotableEvent =
  | { type: "transit"; data: TransitEntry }
  | { type: "eclipse"; data: Eclipse }
  | { type: "lunation"; data: Lunation };

type NotableDatesPDFProps = {
  events: NotableEvent[];
  birthChartData: PlanetPoint[];
  sectPlanets: SectPlanets;
  profectionYearData: ProfectionYearData | null;
};

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return `${MONTHS[date.getUTCMonth()].label} ${date.getUTCDate()}, ${date.getUTCFullYear()}`;
}

const dividerStyle = {
  borderTopWidth: 1,
  borderTopStyle: "solid" as const,
  borderTopColor: colors.divider,
  marginTop: 8,
  paddingTop: 8,
};

export function NotableDatesPDF({
  events,
  birthChartData,
  sectPlanets,
  profectionYearData,
}: NotableDatesPDFProps) {
  if (events.length === 0) return null;

  return (
    <View
      style={{
        marginBottom: 16,
        padding: 14,
        backgroundColor: colors.sectionBg,
        borderRadius: 6,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: colors.sectionBorder,
      }}
    >
      <Text
        style={{
          fontSize: 14,
          fontFamily: "Lora",
          color: colors.textPrimary,
          marginBottom: 10,
        }}
      >
        A Few Notable Dates
      </Text>

      <View
        style={{
          padding: 10,
          backgroundColor: colors.cardBg,
          borderRadius: 4,
        }}
      >
        {events.map((event, i) => {
          const itemStyle = i === 0 ? {} : dividerStyle;

          if (event.type === "transit") {
            const { data: transit } = event;
            const pills = getPills(
              birthChartData,
              sectPlanets,
              transit,
              profectionYearData,
            );
            const aspectLabel = ASPECT_LABELS[transit.aspect] || transit.aspect;
            const title = `${transit.transitingPlanet} ${aspectLabel} natal ${transit.natalPlanet}`;

            return (
              <View
                key={`transit-${transit.date}-${transit.transitingPlanet}-${transit.natalPlanet}-${transit.aspect}`}
                style={itemStyle}
              >
                <Text style={{ fontSize: 9, color: colors.textMuted }}>
                  {formatDate(transit.date)}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "bold",
                    color: colors.textPrimary,
                    fontFamily: "Lora",
                    marginTop: 2,
                  }}
                >
                  {title}
                </Text>
                {pills.length > 0 && (
                  <View
                    style={{
                      flexDirection: "row",
                      flexWrap: "wrap",
                      columnGap: 4,
                      rowGap: 4,
                      marginTop: 4,
                    }}
                  >
                    {pills.map((pill) => (
                      <PillPDF key={pill.type} type={pill.type} />
                    ))}
                  </View>
                )}
              </View>
            );
          }

          if (event.type === "eclipse") {
            const { data: eclipse } = event;
            const aspects = getAspectsToNatalPlanets(
              eclipse.position,
              birthChartData,
              eclipse.type,
              eclipse.date,
            );
            const pills = aspects
              .flatMap((aspect) =>
                getPills(
                  birthChartData,
                  sectPlanets,
                  aspect,
                  profectionYearData,
                ),
              )
              .filter(
                (pill, idx, self) =>
                  idx === self.findIndex((p) => p.type === pill.type),
              );
            const title = `${titleCase(eclipse.type)} | ${eclipse.position.sign} ${formatDegree(eclipse.position.degree, eclipse.position.minute)}`;

            return (
              <View key={`eclipse-${eclipse.date}`} style={itemStyle}>
                <Text style={{ fontSize: 9, color: colors.textMuted }}>
                  {formatDate(eclipse.date)}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "bold",
                    color: colors.textPrimary,
                    fontFamily: "Lora",
                    marginTop: 2,
                  }}
                >
                  {title}
                </Text>
                {pills.length > 0 && (
                  <View
                    style={{
                      flexDirection: "row",
                      flexWrap: "wrap",
                      columnGap: 4,
                      rowGap: 4,
                      marginTop: 4,
                    }}
                  >
                    {pills.map((pill) => (
                      <PillPDF key={pill.type} type={pill.type} />
                    ))}
                  </View>
                )}
              </View>
            );
          }

          if (event.type === "lunation") {
            const { data: lunation } = event;
            const aspects = getAspectsToNatalPlanets(
              lunation.position,
              birthChartData,
              lunation.lunationType,
              lunation.date,
            );
            const pills = aspects
              .flatMap((aspect) =>
                getPills(
                  birthChartData,
                  sectPlanets,
                  aspect,
                  profectionYearData,
                ),
              )
              .filter(
                (pill, idx, self) =>
                  idx === self.findIndex((p) => p.type === pill.type),
              );
            const title = `${titleCase(lunation.lunationType)} in ${lunation.position.sign} | ${formatDegree(lunation.position.degree, lunation.position.minute)}`;

            return (
              <View key={`lunation-${lunation.date}`} style={itemStyle}>
                <Text style={{ fontSize: 9, color: colors.textMuted }}>
                  {formatDate(lunation.date)}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "bold",
                    color: colors.textPrimary,
                    fontFamily: "Lora",
                    marginTop: 2,
                  }}
                >
                  {title}
                </Text>
                {pills.length > 0 && (
                  <View
                    style={{
                      flexDirection: "row",
                      flexWrap: "wrap",
                      columnGap: 4,
                      rowGap: 4,
                      marginTop: 4,
                    }}
                  >
                    {pills.map((pill) => (
                      <PillPDF key={pill.type} type={pill.type} />
                    ))}
                  </View>
                )}
              </View>
            );
          }
        })}
      </View>
    </View>
  );
}
