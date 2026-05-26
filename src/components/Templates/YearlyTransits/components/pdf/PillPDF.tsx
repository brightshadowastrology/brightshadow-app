import { Text, View } from "@react-pdf/renderer";
import { type Pill } from "@/shared/types";

const PILL_PDF_CONFIG: Record<
  Pill["type"],
  { bg: string; color: string; border: string; text: string }
> = {
  powerful: {
    bg: "#b8b59e",
    color: "#50503b",
    border: "#50503b",
    text: "Powerful",
  },
  personallyFelt: {
    bg: "#b8b59e",
    color: "#50503b",
    border: "#50503b",
    text: "Personally Felt",
  },
  joyous: {
    bg: "#dcfce7",
    color: "#166534",
    border: "#86efac",
    text: "Joyous",
  },
  excessive: {
    bg: "#fef9c3",
    color: "#854d0e",
    border: "#fde047",
    text: "Excessive",
  },
  productive: {
    bg: "#ffedd5",
    color: "#9a3412",
    border: "#fdba74",
    text: "Productive",
  },
  challenging: {
    bg: "#fee2e2",
    color: "#991b1b",
    border: "#fca5a5",
    text: "Challenging",
  },
  pivotPoint: {
    bg: "#b8b59e",
    color: "#50503b",
    border: "#50503b",
    text: "New Beginnings",
  },
  lifeDefining: {
    bg: "#f3e8ff",
    color: "#6b21a8",
    border: "#d8b4fe",
    text: "Life Defining",
  },
};

export function PillPDF({ type }: { type: Pill["type"] }) {
  const config = PILL_PDF_CONFIG[type];
  return (
    <View
      style={{
        backgroundColor: config.bg,
        borderRadius: 8,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: config.border,
        paddingHorizontal: 6,
        paddingVertical: 2,
      }}
    >
      <Text style={{ color: config.color, fontSize: 7, fontWeight: "bold" }}>
        {config.text}
      </Text>
    </View>
  );
}
