import { getOrdinal } from "@/shared/lib/textHelpers";
import { lordDescriptions } from "@/shared/text/text";
import { getPlanetDignity } from "../../helpers";
import { getPlanetRulerText } from "@/shared/lib/textHelpers";
import { type ProfectionYearData, type PlanetPoint } from "@/shared/types";

type ProfectionYearBodyTextProps = {
  data: ProfectionYearData;
  birthChartData: PlanetPoint[];
};

export default function ProfectionYearBodyText({
  data,
  birthChartData,
}: ProfectionYearBodyTextProps) {
  const { profectionYear, profectionSign, lordOfYear } = data;

  const formattedLordOfYear =
    lordOfYear === "Sun" || lordOfYear === "Moon"
      ? `The ${lordOfYear}`
      : lordOfYear;
  const natalLord = birthChartData.find(
    (planet) => planet.planet === lordOfYear,
  );
  const endText = `From now until your next birthday, you might find that these themes develop and come to fruition. You'll notice that transits in your ${getOrdinal(profectionYear)} house, transits to your ${lordOfYear}, and the transits of ${formattedLordOfYear.toLowerCase()} ${lordOfYear === "Moon" ? `(new and full moons, and especially eclipses!)` : ""} ${lordOfYear === "Sun" ? `(eclipses in particular)` : ""} mark important turning points.`;

  return (
    <>
      <p className="text-primary-950 mt-2">{`Natally, your ${profectionSign} ${getOrdinal(profectionYear)} house is ruled by your ${lordOfYear}, ${getPlanetDignity(lordOfYear, profectionSign)} in the sign of ${profectionSign} in the ${getOrdinal(natalLord?.house || 0)} house.`}</p>
      <p className="text-primary-950 mt-2">
        {getPlanetRulerText(profectionYear, natalLord?.house || 0)}
      </p>
      <p className="text-primary-950 mt-2">{endText}</p>
      <p className="text-primary-950 mt-2">
        {lordDescriptions[lordOfYear] ||
          `${lordOfYear} guides your year with its unique energy.`}
      </p>
    </>
  );
}
