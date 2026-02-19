import { getOrdinal } from "@/shared/lib/textHelpers";
import {
  signDescriptions,
  houseTopics,
  lordDescriptions,
} from "@/shared/lib/text";
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
        <h3 className="text-xl font-semibold mb-4">Your Annual Profection</h3>

        <div className="p-6 bg-gray-800 rounded-lg border border-gray-700 space-y-4">
          <div className="flex items-center gap-4">
            <div className="text-4xl font-bold text-white">
              {profectionYear}
            </div>
            <div>
              <p className="text-lg text-white">
                {getOrdinal(profectionYear)} House Year
              </p>
              <p className="text-gray-400 text-sm">{houseThemes || ""}</p>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-4">
            <h4 className="text-lg font-medium text-white mb-2">
              Profected to {profectionSign}
            </h4>
            <p className="text-gray-300">{signText}</p>
          </div>

          <div className="border-t border-gray-700 pt-4">
            <h4 className="text-lg font-medium text-white mb-2">
              Lord of the Year: {lordOfYear}
            </h4>
            <p className="text-gray-300">
              {lordDescriptions[lordOfYear] ||
                `${lordOfYear} guides your year with its unique energy.`}
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Pay attention to {lordOfYear}&apos;s transits and condition in
              your natal chart for timing of key events.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
