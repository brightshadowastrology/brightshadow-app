import { StyleSheet } from "@react-pdf/renderer";

export const colors = {
  pageBg: "#ffffff",
  sectionBg: "#f9fafb",
  cardBg: "#f3f4f6",
  sectionBorder: "#e5e7eb",
  divider: "#d1d5db",
  textPrimary: "#111827",
  textSecondary: "#374151",
  textMuted: "#6b7280",
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
