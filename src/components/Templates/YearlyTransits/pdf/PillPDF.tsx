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
    bg: "#b8b59e",
    color: "#50503b",
    border: "#50503b",
    text: "Joyous",
  },
  excessive: {
    bg: "#b8b59e",
    color: "#50503b",
    border: "#50503b",
    text: "Excessive",
  },
  productive: {
    bg: "#b8b59e",
    color: "#50503b",
    border: "#50503b",
    text: "Productive",
  },
  challenging: {
    bg: "#b8b59e",
    color: "#50503b",
    border: "#50503b",
    text: "Challenging",
  },
  pivotPoint: {
    bg: "#b8b59e",
    color: "#50503b",
    border: "#50503b",
    text: "Pivot Point",
  },
  lifeDefining: {
    bg: "#b8b59e",
    color: "#50503b",
    border: "#50503b",
    text: "Life Defining",
  },
};

export function PillPDF({
  type,
  toolTip,
}: {
  type: Pill["type"];
  toolTip?: string;
}) {
  const config = PILL_PDF_CONFIG[type];
  return (
    <View style={{ flexDirection: "row", alignItems: "center", columnGap: 4 }}>
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
        <Text style={{ color: config.color, fontSize: 10, fontWeight: "bold" }}>
          {config.text}
        </Text>
      </View>
      {toolTip && (
        <Text
          style={{ color: "#50503b", fontSize: 10, flex: 1, flexWrap: "wrap" }}
        >
          {toolTip}
        </Text>
      )}
    </View>
  );
}
