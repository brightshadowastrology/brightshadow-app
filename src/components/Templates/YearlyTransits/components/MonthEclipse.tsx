import { useBirthChart } from "@/components/Providers/BirthChartContext";
import InfoPill from "@/components/UI/InfoPill";
import {
  formatDegree,
  getAspectsToNatalPlanets,
  getHouseFromSign,
  getPills,
  titleCase,
} from "@/shared/lib/textHelpers";
import {
  getFormattedAspectText,
  getFormattedHouseDescriptionText,
  getFormattedHouseText,
} from "@/shared/text/general";
import { type Eclipse } from "@/shared/types";

export default function MonthEclipse({
  eclipse,
}: {
  eclipse: Eclipse;
  showDate?: boolean;
}) {
  const { birthChartData, sectPlanets, profectionYear } = useBirthChart();

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
    .flatMap((aspect) =>
      getPills(birthChartData, sectPlanets, aspect, profectionYear),
    )
    .filter(
      (pill, index, self) =>
        index === self.findIndex((p) => p.type === pill.type),
    );

  return (
    <div className={"border-t border-primary-700 pt-3"}>
      <div className="flex justify-between items-start">
        <h4 className="text-lg font-medium text-primary-700">{lunationText}</h4>
      </div>

      {pills.length > 0 && (
        <div className="flex flex-col gap-2 py-2">
          {pills.map((pill) => {
            return (
              <InfoPill
                key={pill.type}
                type={pill.type}
                toolTip={pill.toolTip}
              />
            );
          })}
        </div>
      )}

      <p className="text-primary-700 mt-1">{interpretationText}</p>
      <p className="text-primary-700 mt-1">
        {aspects.length > 0 && getFormattedAspectText(aspects, eclipse.type)}
      </p>
    </div>
  );
}
