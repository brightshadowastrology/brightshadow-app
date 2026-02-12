import { useBirthChart } from "@/components/Providers/BirthChartContext";
import { type Lunation } from "@/shared/types";
import {
  titleCase,
  formatDegree,
  getHouseFromSign,
  getFormattedHouseText,
  getFormattedHouseDescriptionText,
  getFormattedHouseTopicsText,
  getFormattedAspectText,
} from "@/shared/lib/textHelpers";
import { getAspectsToNatalPlanets } from "../helpers";

export default function MonthLunation({
  lunation,
  monthLabel,
  year,
}: {
  lunation: Lunation;
  monthLabel: string;
  year: number;
}) {
  const { birthChartData } = useBirthChart();

  if (!birthChartData) return;

  const date = new Date(lunation.date);
  const day = date.getDate();
  const lunationHouse: number = getHouseFromSign(
    birthChartData.find((a) => a.planet === "Ascendant")?.position.sign ||
      "Aries",
    lunation.position.sign,
  );
  const lunationText = `${titleCase(lunation.lunationType)} in ${lunation.position.sign} | ${formatDegree(lunation.position.degree, lunation.position.minute)}`;
  const interpretationText = `This ${lunation.lunationType} occurs in your ${getFormattedHouseText(lunationHouse)} of ${getFormattedHouseDescriptionText([lunationHouse])}.`;
  const recommendationText =
    lunation.lunationType === "new moon"
      ? `This is a good time to set new intensions around your ${getFormattedHouseTopicsText(lunationHouse)}.`
      : `This full moon marks the completion of efforts over the last sixth months in your ${getFormattedHouseTopicsText(lunationHouse)}.`;
  const aspects = getAspectsToNatalPlanets(lunation.position, birthChartData);

  return (
    <div className="p-4 bg-gray-700 rounded-md border border-gray-600">
      <div className="flex justify-between items-start">
        <h4 className="text-lg font-medium text-white">{lunationText}</h4>
        <span className="text-gray-400 text-sm">
          {monthLabel} {day}, {year}
        </span>
      </div>
      <p className="text-gray-300 text-sm mt-1">{`${interpretationText} ${recommendationText}`}</p>
      <p className="text-gray-300 text-sm mt-1">
        {aspects.length > 0 &&
          getFormattedAspectText(aspects, lunation.lunationType)}
      </p>
    </div>
  );
}
