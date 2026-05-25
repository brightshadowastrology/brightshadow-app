import { type ProfectionYearData } from "@/shared/types";
import {
  getOrdinal,
  getFormattedHouseTopicsText,
} from "@/shared/lib/textHelpers";
import { lordDescriptions } from "@/shared/lib/text";

export default function MonthBirthday({
  nextProfectionYear,
}: {
  nextProfectionYear: ProfectionYearData;
}) {
  const { profectionYear, lordOfYear } = nextProfectionYear;
  const houseThemes = getFormattedHouseTopicsText(profectionYear);

  return (
    <div className={"border-t border-primary-700 pt-3"}>
      <h4 className="text-lg font-medium text-primary-700">Happy Birthday!</h4>
      <p className="text-primary-700 mt-1">
        You are now entering a {getOrdinal(profectionYear)} house profection year.
        This year highlights your {houseThemes}.
      </p>
      <p className="text-primary-700 mt-1">
        Your Lord of the Year is {lordOfYear}.{" "}
        {lordDescriptions[lordOfYear] ||
          `${lordOfYear} guides your year with its unique energy.`}
      </p>
    </div>
  );
}
