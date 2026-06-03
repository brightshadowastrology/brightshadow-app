import { type PlanetPoint, type SectPlanets } from "@/shared/types";
import {
  planetDescriptions,
  signDescriptions,
  houseDescriptions,
} from "@/shared/text/general";
import * as constants from "@/shared/lib/constants";
import {
  getOrdinal,
  formatDegree,
  randomArrayIndex,
  getHouseFromSign,
} from "@/shared/lib/textHelpers";

type BirthchartDataProps = {
  data: PlanetPoint[];
  sectPlanets: SectPlanets;
  isDayChart: boolean | null;
};

export default function BirthchartData({
  data,
  sectPlanets,
  isDayChart,
}: BirthchartDataProps) {
  const planets = data.filter(
    (p) => !["Ascendant", "Descendant", "Midheaven", "IC"].includes(p.planet),
  );
  const angles = data.filter((p) =>
    ["Ascendant", "Descendant", "Midheaven", "IC"].includes(p.planet),
  );
  const { inSectBenefic, outOfSectBenefic, inSectMalefic, outOfSectMalefic } =
    sectPlanets;

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
    <div className="space-y-6 w-full">
      <section className="mb-4 w-full p-6 bg-background-100 rounded-lg border border-primary-500">
        <h3 className="text-xl font-semibold text-primary-500">
          Your Planetary Placements
        </h3>
        <div className="mt-4 space-y-3">
          {planets.map((placement) => (
            <div
              key={placement.planet}
              className="p-4 bg-primary-200 rounded-md"
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-lg font-medium text-primary-700">
                  {placement.planet} in {placement.position.sign}
                </h4>
                <span className="text-primary-500 text-sm">
                  {formatDegree(
                    placement.position.degree,
                    placement.position.minute,
                  )}{" "}
                  | House {placement.house}
                </span>
              </div>
              <p className="text-primary-700">{interpretPosition(placement)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-4 w-full p-6 bg-background-100 rounded-lg border border-primary-500">
        <h3 className="text-xl font-semibold text-primary-500">Your Angles</h3>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          {angles.map((angle) => (
            <div key={angle.planet} className="p-4 bg-primary-200 rounded-md">
              <div className="flex justify-between items-start mb-2">
                <h4 className="text-lg font-medium text-primary-700">
                  {angle.planet}
                </h4>
                <span className="text-primary-500 text-sm">
                  {angle.position.sign}{" "}
                  {formatDegree(angle.position.degree, angle.position.minute)}
                </span>
              </div>
              <p className="text-primary-700 text-sm">
                {planetDescriptions[angle.planet]?.tagline || ""} is colored by{" "}
                {angle.position.sign} energy.
              </p>
            </div>
          ))}
        </div>
      </section>

      {isDayChart !== null &&
        inSectBenefic &&
        inSectMalefic &&
        outOfSectBenefic &&
        outOfSectMalefic && (
          <section className="mb-4 w-full p-6 bg-background-100 rounded-lg border border-primary-500">
            <h3 className="text-xl font-semibold text-primary-500">Sect</h3>
            <p className="text-primary-500 text-sm mt-2">
              You have a {isDayChart ? "day" : "night"} chart.
            </p>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-4 bg-primary-200 rounded-md">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-lg font-medium text-primary-700">
                    {`In-Sect Benefic: ${inSectBenefic.planet}`}
                  </h4>
                  <span className="text-primary-500 text-sm">
                    {`${inSectBenefic.position.sign} ${formatDegree(
                      inSectBenefic.position.degree,
                      inSectBenefic.position.minute,
                    )}`}
                  </span>
                </div>
                <span className="text-primary-700">
                  {`Your in-sect benefit is ${inSectBenefic.planet}.`}
                </span>
              </div>

              <div className="p-4 bg-primary-200 rounded-md">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-lg font-medium text-primary-700">
                    {`Out-of-Sect Benefic: ${outOfSectBenefic.planet}`}
                  </h4>
                  <span className="text-primary-500 text-sm">
                    {`${outOfSectBenefic.position.sign} ${formatDegree(
                      outOfSectBenefic.position.degree,
                      outOfSectBenefic.position.minute,
                    )}`}
                  </span>
                </div>
                <span className="text-primary-700">
                  {`Your in-sect benefit is ${outOfSectBenefic.planet}.`}
                </span>
              </div>

              <div className="p-4 bg-primary-200 rounded-md">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-lg font-medium text-primary-700">
                    {`In-Sect Malefic: ${inSectMalefic.planet}`}
                  </h4>
                  <span className="text-primary-500 text-sm">
                    {`${inSectMalefic.position.sign} ${formatDegree(
                      inSectMalefic.position.degree,
                      inSectMalefic.position.minute,
                    )}`}
                  </span>
                </div>
                <span className="text-primary-700">
                  {`Your in-sect benefit is ${inSectMalefic.planet}.`}
                </span>
              </div>

              <div className="p-4 bg-primary-200 rounded-md">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-lg font-medium text-primary-700">
                    {`Out-of-Sect Malefic: ${outOfSectMalefic.planet}`}
                  </h4>
                  <span className="text-primary-500 text-sm">
                    {`${outOfSectMalefic.position.sign} ${formatDegree(
                      outOfSectMalefic.position.degree,
                      outOfSectMalefic.position.minute,
                    )}`}
                  </span>
                </div>
                <span className="text-primary-700">
                  {`Your in-sect benefit is ${outOfSectMalefic.planet}.`}
                </span>
              </div>
            </div>
          </section>
        )}
    </div>
  );
}
