import { getOrdinal } from "@/shared/lib/textHelpers";
import {
  signDescriptions,
  houseTopics,
  lordDescriptions,
} from "@/shared/text/text";
import { getPlanetDignity } from "../../helpers";
import { getPlanetRulerText } from "@/shared/lib/textHelpers";
import ProfectionYearBodyText from "./ProfectionYearBodyText";
import { type ProfectionYearData, type PlanetPoint } from "@/shared/types";

type ProfectionYearProps = {
  data: ProfectionYearData;
  birthChartData: PlanetPoint[];
};

export default function ProfectionYear({
  data,
  birthChartData,
}: ProfectionYearProps) {
  const { profectionYear, profectionSign, lordOfYear } = data;

  const houseThemes = `Your ${houseTopics[profectionYear]
    .join(", ")
    .replace(/, ([^,]*)$/, ", and $1")}.`;
  const formattedLordOfYear =
    lordOfYear === "Sun" || lordOfYear === "Moon"
      ? `The ${lordOfYear}`
      : lordOfYear;
  const signText = `This year emphasizes being 
              ${signDescriptions[profectionSign].join(", ").replace(/, ([^,]*)$/, ", and $1")} in areas of life related to 
              ${houseThemes.toLowerCase()}`;

  //find natal planet that is the lord of the year and get its natal position for transit interpretation
  const natalLord = birthChartData.find(
    (planet) => planet.planet === lordOfYear,
  );

  const endText = `From now until your next birthday, you might find that these themes develop and come to fruition. You'll notice that transits in your ${getOrdinal(profectionYear)} house, transits to your ${lordOfYear}, and the transits of ${formattedLordOfYear.toLowerCase()} ${lordOfYear === "Moon" ? `(new and full moons, and especially eclipses!)` : ""} ${lordOfYear === "Sun" ? `( eclipses in particular)` : ""} mark important turning points.`;

  return (
    <section className="mb-4 w-full p-6 bg-background-100 rounded-lg border border-primary-500">
      <h3 className="text-xl font-semibold mb-4 text-secondary-500">
        Your Annual Profection
      </h3>

      <div className="p-6 bg-primary-200  rounded-lg border border-primary-400 mb-4">
        <p className="text-primary-950">
          Not every planet in our birthchart is active at the same time. The
          technique know as a annual profections give us a means to find out
          when specific planets (and the houses they rule) will play a bigger
          role in certain periods of time. The technique is simple: a year for a
          house. We start at 0 years of age, in the 1st house, themes related to
          the first house and how its ruler is placed become very visible. Then,
          when we turn 1 year old, we move into a 2nd house profection year, and
          then, 2nd house themes and the themes of the second house ruler
          predominate our life.
        </p>
      </div>

      <div className="p-6 bg-primary-200  rounded-lg border border-primary-400 space-y-4">
        <div className="flex items-center gap-4">
          <div className="text-4xl font-bold text-primary-950">
            {profectionYear}
          </div>
          <div>
            <p className="text-lg text-primary-950">
              {getOrdinal(profectionYear)} House Year
            </p>
            <p className="text-primary-950">{houseThemes || ""}</p>
          </div>
        </div>

        <div className="border-t border-primary-400 pt-4">
          <h4 className="text-lg font-medium text-primary-950 mb-2">
            Profected Sign: {profectionSign}
          </h4>
          <p className="text-primary-950">{signText}</p>
        </div>

        <div className="border-t border-primary-400 pt-4">
          <h4 className="text-lg font-medium text-primary-950 mb-2">
            Lord of the Year: {formattedLordOfYear}
          </h4>
          <ProfectionYearBodyText data={data} birthChartData={birthChartData} />
        </div>
      </div>
    </section>
  );
}
