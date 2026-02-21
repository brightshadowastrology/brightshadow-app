import { useBirthChart } from "@/components/Providers/BirthChartContext";
import { type Eclipse } from "@/shared/types";
import { getAspectsToNatalPlanets, getPills } from "../helpers";
import Pill from "@/components/UI/Pill";
import {
  titleCase,
  formatDegree,
  getHouseFromSign,
  getFormattedHouseText,
  getFormattedHouseDescriptionText,
  getFormattedAspectText,
} from "@/shared/lib/textHelpers";

export default function MonthEclipse({
  eclipse,
  showDate = true,
}: {
  eclipse: Eclipse;
  showDate?: boolean;
}) {
  const { birthChartData, sectPlanets } = useBirthChart();

  if (!birthChartData || !sectPlanets) return;

  const lunationHouse: number = getHouseFromSign(
    birthChartData.find((a) => a.planet === "Ascendant")?.position.sign ||
      "Aries",
    eclipse.position.sign,
  );
  const lunationText = `${titleCase(eclipse.type)} | ${eclipse.position.sign} ${formatDegree(eclipse.position.degree, eclipse.position.minute)}`;
  const interpretationText = `This ${titleCase(eclipse.type)} occurs in your ${getFormattedHouseText(lunationHouse)} of ${getFormattedHouseDescriptionText([lunationHouse])}.`;
  const aspects = getAspectsToNatalPlanets(
    eclipse.position,
    birthChartData,
    eclipse.type,
    eclipse.date,
  );
  const pills = aspects
    .flatMap((aspect) => getPills(birthChartData, sectPlanets, aspect))
    .filter(
      (pill, index, self) =>
        index === self.findIndex((p) => p.type === pill.type),
    );

  return (
    <div className={`${!showDate ? "border-t border-gray-600 pt-3" : ""}`}>
      <div className="flex justify-between items-start">
        <h4 className="text-lg font-medium text-white">{lunationText}</h4>
        <div className="flex gap-2">
          {pills.map((pill) => {
            return <Pill type={pill.type} toolTip={pill.toolTip} />;
          })}
        </div>
      </div>
      <p className="text-gray-300 text-sm mt-1">{interpretationText}</p>
      <p className="text-gray-300 text-sm mt-1">
        {aspects.length > 0 && getFormattedAspectText(aspects, eclipse.type)}
      </p>
    </div>
  );
}
