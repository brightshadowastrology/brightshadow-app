import { getOrdinal } from "@/shared/lib/textHelpers";
import {
  signDescriptions,
  houseTopics,
  lordDescriptions,
} from "@/shared/text/text";
import { type ProfectionYearData } from "@/shared/types";

type ProfectionYearProps = {
  data: ProfectionYearData;
};

export default function ProfectionYear({ data }: ProfectionYearProps) {
  const { profectionYear, profectionSign, lordOfYear } = data;

  const houseThemes = `Your ${houseTopics[profectionYear]
    .join(", ")
    .replace(/, ([^,]*)$/, ", and $1")}.`;

  const signText = `This year emphasizes being 
              ${signDescriptions[profectionSign].join(", ").replace(/, ([^,]*)$/, ", and $1")} in areas of life related to 
              ${houseThemes.toLowerCase()}`;

  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-xl font-semibold mb-4 text-secondary-500">
          Your Annual Profection
        </h3>

        <div className="p-6 bg-background-500 rounded-lg border border-secondary-400 space-y-4">
          <div className="flex items-center gap-4">
            <div className="text-4xl font-bold text-white">
              {profectionYear}
            </div>
            <div>
              <p className="text-lg text-white">
                {getOrdinal(profectionYear)} House Year
              </p>
              <p className="text-secondary-200">{houseThemes || ""}</p>
            </div>
          </div>

          <div className="border-t border-secondary-400 pt-4">
            <h4 className="text-lg font-medium text-white mb-2">
              Profected to {profectionSign}
            </h4>
            <p className="text-secondary-100">{signText}</p>
          </div>

          <div className="border-t border-secondary-400 pt-4">
            <h4 className="text-lg font-medium text-white mb-2">
              Lord of the Year: {lordOfYear}
            </h4>
            <p className="text-secondary-100">
              {lordDescriptions[lordOfYear] ||
                `${lordOfYear} guides your year with its unique energy.`}
            </p>
            <p className="text-secondary-200 text-sm mt-2">
              Pay attention to {lordOfYear}&apos;s transits and condition in
              your natal chart for timing of key events.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
