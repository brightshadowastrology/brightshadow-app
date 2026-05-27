import { StyleSheet } from "@react-pdf/renderer";

export const colors = {
  pageBg: "#f0ece4",
  sectionBg: "#e8e7df",
  cardBg: "#d4d2c2",
  sectionBorder: "#b8b59e",
  divider: "#9e9b7d",
  textPrimary: "#39392e",
  textSecondary: "#44432f",
  textMuted: "#50503b",
} as const;

export const eventStyles = StyleSheet.create({
  eventContainer: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    borderTopStyle: "solid",
  },
  eventHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  eventTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: colors.textPrimary,
    fontFamily: "Lora",
  },
  // Use this variant when the title is inside an eventHeader row alongside pills
  eventTitleInRow: {
    fontSize: 12,
    fontWeight: "bold",
    color: colors.textPrimary,
    flex: 1,
    flexShrink: 1,
  },
  pillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginLeft: 6,
    columnGap: 3,
  },
  pillsColumn: {
    flexDirection: "column",
    rowGap: 4,
    paddingVertical: 4,
  },
  eventBody: {
    fontSize: 11,
    color: colors.textPrimary,
    marginTop: 4,
    marginBottom: 4,
    lineHeight: 1.5,
  },
});
