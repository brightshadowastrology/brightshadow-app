import { useBirthChart } from "@/components/Providers/BirthChartContext";
import {
  getOrdinal,
  getFormattedHouseTopicsText,
} from "@/shared/lib/textHelpers";
import { lordDescriptions } from "@/shared/lib/text";
import * as constants from "@/shared/lib/constants";

export default function MonthBirthday() {
  const { birthChartData, profectionYear, currentTimeLord } = useBirthChart();

  if (!profectionYear || !birthChartData) return null;

  const nextYear = (profectionYear.profectionYear % 12) + 1;
  const nextHouseThemes = getFormattedHouseTopicsText(nextYear);

  const ascendantSign =
    birthChartData.find((a) => a.planet === "Ascendant")?.position.sign ||
    "Aries";
  const ascIndex = constants.SIGNS.indexOf(ascendantSign);
  const nextSignIndex = (ascIndex + nextYear - 1) % 12;
  const nextSign = constants.SIGNS[nextSignIndex];
  const nextLord = constants.SIGN_RULERS[nextSign];

  return (
    <div className={"border-t border-primary-700 pt-3"}>
      <h4 className="text-lg font-medium text-primary-700">Happy Birthday!</h4>
      <p className="text-primary-700 mt-1">
        You are now entering a {getOrdinal(nextYear)} house profection year.
        This year highlights your {nextHouseThemes}.
      </p>
      <p className="text-primary-700 mt-1">
        Your Lord of the Year is {nextLord}.{" "}
        {lordDescriptions[nextLord] ||
          `${nextLord} guides your year with its unique energy.`}
      </p>
    </div>
  );
}
