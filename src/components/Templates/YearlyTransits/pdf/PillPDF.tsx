import { Text, View } from "@react-pdf/renderer";
import { type Pill } from "@/shared/types";

const PILL_PDF_CONFIG: Record<
  Pill["type"],
  { bg: string; color: string; border: string; text: string }
> = {
  notable: {
    bg: "#b8b59e",
    color: "#50503b",
    border: "#50503b",
    text: "Notable",
  },
  joyous: {
    bg: "#cd9433",
    color: "#7a4519",
    border: "#7a4519",
    text: "Joyous",
  },
  excessive: {
    bg: "#e8c270",
    color: "#b5742a",
    border: "#b5742a",
    text: "Excessive",
  },
  productive: {
    bg: "#e8e3e3",
    color: "#ac9a9a",
    border: "#ac9a9a",
    text: "Productive",
  },
  challenging: {
    bg: "#ac9a9a",
    color: "#5b4d4a",
    border: "#5b4d4a",
    text: "Challenging",
  },
  pivotPoint: {
    bg: "#e8e7df",
    color: "#9e9b7d",
    border: "#9e9b7d",
    text: "Pivot Point",
  },
  powerful: {
    bg: "#7d6867",
    color: "#382c2e",
    border: "#382c2e",
    text: "Powerful",
  },
  timeLordEvent: {
    bg: "#b8b59e",
    color: "#50503b",
    border: "#50503b",
    text: "Time Lord Event",
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
