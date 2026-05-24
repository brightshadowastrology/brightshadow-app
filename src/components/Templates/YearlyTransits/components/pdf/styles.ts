import { StyleSheet } from "@react-pdf/renderer";

export const colors = {
  pageBg: "#f9f7f3",
  sectionBg: "#f0ece4",
  cardBg: "#e4dccf",
  sectionBorder: "#b79e80",
  divider: "#9b765b",
  textPrimary: "#111827",
  textSecondary: "#374151",
  textMuted: "#a9a67e",
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
    fontSize: 11,
    fontWeight: "bold",
    color: colors.textPrimary,
    fontFamily: "DM Serif Display",
  },
  // Use this variant when the title is inside an eventHeader row alongside pills
  eventTitleInRow: {
    fontSize: 11,
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
  eventBody: {
    fontSize: 9,
    color: colors.textSecondary,
    marginTop: 3,
    lineHeight: 1.5,
  },
});
