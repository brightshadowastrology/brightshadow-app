import { StyleSheet } from "@react-pdf/renderer";

export const colors = {
  pageBg: "#f0ece4",
  sectionBg: "#f0ece4",
  cardBg: "#e8e7df",
  sectionBorder: "#b8b59e",
  divider: "#9e9b7d",
  textPrimary: "#39392e",
  textSecondary: "#44432f",
  textMuted: "#50503b",
} as const;

export const sharedStyles = StyleSheet.create({
  section: {
    marginBottom: 16,
    padding: 14,
    backgroundColor: colors.sectionBg,
    borderRadius: 6,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colors.sectionBorder,
  },
  sectionHeading: {
    fontSize: 14,
    fontFamily: "Lora",
    color: colors.textPrimary,
    marginBottom: 6,
  },
  card: {
    marginTop: 8,
    padding: 10,
    backgroundColor: colors.cardBg,
    borderRadius: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: "bold",
    fontFamily: "Lora",
    color: colors.textPrimary,
    flex: 1,
    flexShrink: 1,
  },
  cardMeta: {
    fontSize: 9,
    color: colors.textMuted,
    marginLeft: 8,
  },
  bodyText: {
    fontSize: 11,
    color: colors.textPrimary,
    lineHeight: 1.5,
    marginTop: 3,
  },
});
