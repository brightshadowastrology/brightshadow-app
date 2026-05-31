import { PlanetPoint, type ProfectionYearData } from "@/shared/types";
import { getOrdinal } from "@/shared/lib/textHelpers";
import ProfectionYearBodyText from "./ProfectionYearBodyText";

type MonthBirthdayProps = {
  nextProfectionYear: ProfectionYearData;
  birthChartData: PlanetPoint[] | null;
};

export default function MonthBirthday({
  nextProfectionYear,
  birthChartData,
}: MonthBirthdayProps) {
  const { profectionYear } = nextProfectionYear;

  if (!birthChartData) return null;

  return (
    <div className={"border-t border-primary-700 pt-3"}>
      <h4 className="text-lg font-medium text-primary-700">Happy Birthday!</h4>
      <p className="text-primary-700 mt-1">
        You are now entering a {getOrdinal(profectionYear)} house profection
        year..
      </p>
      <div className="text-primary-700 mt-1">
        <ProfectionYearBodyText
          data={nextProfectionYear}
          birthChartData={birthChartData}
        />
      </div>
    </div>
  );
}
