import { type Pill } from "@/shared/types";
import { Text, View } from "@react-pdf/renderer";
import { PillPDF } from "./PillPDF";

export function InfoPillPDF({
  type,
  toolTip,
}: {
  type: Pill["type"];
  toolTip?: string;
}) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", columnGap: 4 }}>
      <PillPDF type={type} />
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
