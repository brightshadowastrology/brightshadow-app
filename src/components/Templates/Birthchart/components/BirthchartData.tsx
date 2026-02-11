import type { PlanetPoint } from "@/shared/types";
import {
  planetDescriptions,
  signDescriptions,
  houseDescriptions,
} from "@/shared/lib/text";
import * as constants from "@/shared/lib/constants";
import {
  getOrdinal,
  formatDegree,
  randomArrayIndex,
  getHouseFromSign,
} from "@/shared/lib/textHelpers";

type BirthchartDataProps = {
  data: PlanetPoint[];
};

export default function BirthchartData({ data }: BirthchartDataProps) {
  const planets = data.filter(
    (p) => !["Ascendant", "Descendant", "Midheaven", "IC"].includes(p.planet),
  );
  const angles = data.filter((p) =>
    ["Ascendant", "Descendant", "Midheaven", "IC"].includes(p.planet),
  );

  const interpretPosition = (placement: PlanetPoint): string => {
    const tagline = planetDescriptions[placement.planet]?.tagline || "";
    const sign = placement.position.sign;
    const signTraits =
      signDescriptions[sign]?.join(", ").replace(/, ([^,]*)$/, ", and $1") ||
      "expressing this quality";
    const house = `${getOrdinal(placement.house)} house`;
    const houseArea =
      houseDescriptions[placement.house] ||
      `${getOrdinal(placement.house)} house matters`;
    const planetVerbs = planetDescriptions[placement.planet].verbs || [
      "behave",
    ];
    const randomPlanetVerb = planetVerbs[randomArrayIndex(planetVerbs.length)];

    const variants = [
      `${tagline} expresses through the ${sign} lens in the ${house}, meaning you are ${signTraits} in areas of life related to your ${houseArea}.`,
      `${tagline} manifests in the ${house} with ${sign} energy, making you ${signTraits} when it comes to your ${houseArea}.`,
      `With ${sign} influencing your ${house} ${placement.planet}, you ${randomPlanetVerb} your ${houseArea} by being ${signTraits}.`,
      `In the realm of the ${house}, ${tagline.toLowerCase()} takes on a ${sign} flavor—you tend to be ${signTraits} in how you ${randomPlanetVerb}, particularly in matters of your ${houseArea}.`,
      `Your ${sign} energy expresses through your ${house}, ${tagline.toLowerCase()} comes through bringing ${signTraits} qualities to your ${houseArea}.`,
    ];

    const rulership = rulerShipInterpretation(
      placement.planet,
      placement.house,
    );

    const randomVariant = variants[randomArrayIndex(variants.length)];

    // append rulership interpretation to the end of the variant
    return `${randomVariant} ${rulership}`;
  };

  const rulerShipInterpretation = (
    planetName: string,
    natalHouse: number,
  ): string => {
    const signsRuledByPlanet = constants.RULERSHIPS[planetName];
    if (!signsRuledByPlanet) return "";

    const housesRuledByPlanet = signsRuledByPlanet.map((sign) => {
      return getHouseFromSign(
        angles.find((a) => a.planet === "Ascendant")?.position.sign || "Aries",
        sign,
      );
    });

    const planetText =
      planetName === "Sun" || planetName === "Moon"
        ? `The ${planetName}`
        : planetName;
    const natalHouseFormatted = getOrdinal(natalHouse);
    const housesFormatted = housesRuledByPlanet.map((house) => {
      return getOrdinal(house);
    });
    const houseText = `${housesFormatted.join(", ").replace(/, ([^,]*)$/, " and $1")} ${housesRuledByPlanet.length === 1 ? "house" : "houses"}`;
    const natalHouseTopics = houseDescriptions[natalHouse];
    const houseTopics = housesRuledByPlanet
      .map((house) => {
        return houseDescriptions[house];
      })
      .join(", as well as ");

    const variants = [
      `${planetText} rules your ${houseText}, importing themes of ${houseTopics} into your ${natalHouseFormatted} house.`,
      `${planetText} rules your ${houseText}, colouring your experience of ${natalHouseTopics} with themes of ${houseTopics}.`,
      `As the ruler of your ${houseText}, ${planetText} influences how you handle ares of life related to your ${houseTopics}.`,
    ];

    return variants[randomArrayIndex(variants.length)];
  };

  return (
    <div className="space-y-6">
      <section className="p-4 rounded-lg border-1 bg-gray-800">
        <h3 className="text-xl font-semibold mb-4 text-gray-300">
          Your Planetary Placements
        </h3>
        <div>
          {planets.map((placement) => (
            <div
              key={placement.planet}
              className="py-4 border-t border-gray-700"
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-lg font-medium text-white">
                  {placement.planet} in {placement.position.sign}
                </h4>
                <span className="text-gray-400 text-sm">
                  {formatDegree(
                    placement.position.degree,
                    placement.position.minute,
                  )}{" "}
                  | House {placement.house}
                </span>
              </div>
              <p className="text-gray-300 text-sm">
                {interpretPosition(placement)}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-4">Your Angles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 bg-gray-800 rounded-lg border border-gray-700 p-2">
          {angles.map((angle) => (
            <div
              key={angle.planet}
              className={`p-4 odd:border-r border-gray-700 ${
                angles.length - angles.indexOf(angle) <= 2 ? "border-t" : ""
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-lg font-medium text-white">
                  {angle.planet}
                </h4>
                <span className="text-gray-400 text-sm">
                  {angle.position.sign}{" "}
                  {formatDegree(angle.position.degree, angle.position.minute)}
                </span>
              </div>
              <p className="text-gray-300 text-sm">
                {planetDescriptions[angle.planet]?.tagline || ""} is colored by{" "}
                {angle.position.sign} energy.
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
