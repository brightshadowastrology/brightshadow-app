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
import { getAspectsToNatalPlanets, getPills } from "../helpers";
import Pill from "@/components/UI/Pill";

export default function MonthLunation({ lunation }: { lunation: Lunation }) {
  const { birthChartData, sectPlanets } = useBirthChart();

  if (!birthChartData || !sectPlanets) return;

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
  const aspects = getAspectsToNatalPlanets(
    lunation.position,
    birthChartData,
    lunation.lunationType,
    lunation.date,
  );
  const pills = aspects.flatMap((aspect) =>
    getPills(birthChartData, sectPlanets, aspect),
  );

  return (
    <div className={"border-t border-gray-600 pt-3"}>
      <div className="flex justify-between items-start">
        <h4 className="text-lg font-medium text-white">{lunationText}</h4>
        <div className="flex gap-2">
          {pills.map((pill) => {
            return <Pill type={pill.type} toolTip={pill.toolTip} />;
          })}
        </div>
      </div>
      <p className="text-gray-300 text-sm mt-1">{`${interpretationText} ${recommendationText}`}</p>
      <p className="text-gray-300 text-sm mt-1">
        {aspects.length > 0 &&
          getFormattedAspectText(aspects, lunation.lunationType)}
      </p>
    </div>
  );
}
