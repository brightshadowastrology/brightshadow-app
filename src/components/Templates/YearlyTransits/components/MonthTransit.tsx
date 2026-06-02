import { useBirthChart } from "@/components/Providers/BirthChartContext";
import { type TransitEntry } from "@/shared/types";
import {
  formatDegree,
  getHouseFromSign,
  getFormattedHouseText,
  getGeneralSignificationsText,
  getFormattedTransitText,
} from "@/shared/lib/textHelpers";
import { ASPECT_LABELS } from "@/shared/lib/constants";
import Pill from "@/components/UI/Pill";
import { getPills } from "../../helpers";

export default function MonthTransit({ transit }: { transit: TransitEntry }) {
  const { birthChartData, sectPlanets, profectionYear } = useBirthChart();

  if (!birthChartData || !sectPlanets) return;

  const ascendantSign =
    birthChartData.find((a) => a.planet === "Ascendant")?.position.sign ||
    "Aries";

  const natalPlanetData =
    birthChartData.find((p) => p.planet === transit.natalPlanet) ||
    birthChartData[0];

  const transitHouse = getHouseFromSign(ascendantSign, transit.position.sign);
  const aspectLabel = ASPECT_LABELS[transit.aspect] || transit.aspect;
  const aspectInterpretationText =
    "This is the most intense phase of the transit, where its influence is strongest. You may be feeling the effects more acutely during this time.";

  const title = `${transit.transitingPlanet} ${aspectLabel} natal ${transit.natalPlanet}`;
  const positionText = `${transit.position.sign} ${formatDegree(transit.position.degree, transit.position.minute)}`;
  const interpretationText = `Transiting ${transit.transitingPlanet} at ${positionText} in your ${getFormattedHouseText(transitHouse)} forms a ${aspectLabel} to your natal ${transit.natalPlanet} at ${transit.natalPosition.sign} ${formatDegree(transit.natalPosition.degree, transit.natalPosition.minute)}.`;
  const generalSignificationsText = getGeneralSignificationsText(
    transit.transitingPlanet,
    natalPlanetData,
    aspectLabel,
  );
  const transitInterpretation = getFormattedTransitText(
    transit.transitingPlanet,
    natalPlanetData,
    aspectLabel,
  );

  const pills = getPills(birthChartData, sectPlanets, transit, profectionYear);

  return (
    <div className={"border-t border-primary-700 pt-3"}>
      <div className="flex justify-between items-start">
        <h4 className="text-lg font-medium text-primary-700">{title}</h4>
      </div>

      {pills.length > 0 && (
        <div className="flex flex-col gap-2 py-2">
          {pills.map((pill) => {
            return (
              <Pill key={pill.type} type={pill.type} toolTip={pill.toolTip} />
            );
          })}
        </div>
      )}

      <p className="text-primary-700 mt-1">{interpretationText}</p>
      <p className="text-primary-700 mt-1">{generalSignificationsText}</p>
      <p className="text-primary-700 mt-1">{transitInterpretation}</p>

      <p className="text-primary-700 mt-1">{aspectInterpretationText}</p>
    </div>
  );
}
