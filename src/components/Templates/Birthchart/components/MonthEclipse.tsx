import { useBirthChart } from "../BirthChartContext";
import { type Eclipse } from "@/shared/types";
import {
  titleCase,
  formatDegree,
  getHouseFromSign,
  getFormattedHouseText,
  getFormattedHouseDescriptionText,
} from "@/shared/lib/textHelpers";

export default function MonthEclipse({
  eclipse,
  monthLabel,
  year,
}: {
  eclipse: Eclipse;
  monthLabel: string;
  year: number;
}) {
  const { birthChartData } = useBirthChart();

  if (!birthChartData) return;

  const date = new Date(eclipse.date);
  const day = date.getDate();
  const lunationHouse: number = getHouseFromSign(
    birthChartData.find((a) => a.planet === "Ascendant")?.position.sign ||
      "Aries",
    eclipse.position.sign,
  );
  const lunationText = `${titleCase(eclipse.type)} | ${eclipse.position.sign} ${formatDegree(eclipse.position.degree, eclipse.position.minute)}`;
  const interpretationText = `This ${titleCase(eclipse.type)} occurs in your ${getFormattedHouseText(lunationHouse)} of ${getFormattedHouseDescriptionText([lunationHouse])}.`;

  return (
    <div className="p-4 bg-gray-700 rounded-md border border-gray-600">
      <div className="flex justify-between items-start">
        <h4 className="text-lg font-medium text-white">{lunationText}</h4>
        <span className="text-gray-400 text-sm">
          {monthLabel} {day}, {year}
        </span>
      </div>
      <p className="text-gray-300 text-sm mt-1">{interpretationText}</p>
    </div>
  );
}
