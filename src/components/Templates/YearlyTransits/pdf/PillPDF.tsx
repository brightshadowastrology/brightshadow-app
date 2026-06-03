import { type Pill } from "@/shared/types";
import { Text, View } from "@react-pdf/renderer";

const PILL_PDF_CONFIG: Record<
  Pill["type"],
  { bg: string; color: string; border: string; text: string }
> = {
  notable: {
    bg: "#b8b59e",
    color: "#44432f",
    border: "#44432f",
    text: "Notable",
  },
  joyous: {
    bg: "#cd9433",
    color: "#5e3210",
    border: "#5e3210",
    text: "Joyous",
  },
  excessive: {
    bg: "#e8c270",
    color: "#9a5c22",
    border: "#9a5c22",
    text: "Excessive",
  },
  productive: {
    bg: "#e8e3e3",
    color: "#7d6867",
    border: "#7d6867",
    text: "Productive",
  },
  challenging: {
    bg: "#e8e3e3",
    color: "#473b39",
    border: "#473b39",
    text: "Challenging",
  },
  pivotPoint: {
    bg: "#d4d2c2",
    color: "#86836a",
    border: "#86836a",
    text: "Pivot Point",
  },
  powerful: {
    bg: "#ac9a9a",
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
      <Text style={{ color: config.color, fontSize: 10, fontWeight: "bold" }}>
        {config.text}
      </Text>
    </View>
  );
}
