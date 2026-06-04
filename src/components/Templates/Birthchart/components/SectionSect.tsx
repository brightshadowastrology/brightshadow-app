import { formatDegree } from "@/shared/lib/textHelpers";
import { type PlanetPoint, type SectPlanets } from "@/shared/types";

type SectionSectProps = {
  data: PlanetPoint[];
  sectPlanets: SectPlanets;
  isDayChart: boolean | null;
};

export default function SectionSect({
  data,
  sectPlanets,
  isDayChart,
}: SectionSectProps) {
  const { inSectBenefic, outOfSectBenefic, inSectMalefic, outOfSectMalefic } =
    sectPlanets;

  return (
    <>
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
              <div className="p-4 bg-primary-100 rounded-md">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-lg font-medium text-primary-950">
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

              <div className="p-4 bg-primary-100 rounded-md">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-lg font-medium text-primary-950">
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

              <div className="p-4 bg-primary-100 rounded-md">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-lg font-medium text-primary-950">
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

              <div className="p-4 bg-primary-100 rounded-md">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-lg font-medium text-primary-950">
                    {`Out-of-Sect Malefic: ${outOfSectMalefic.planet}`}
                  </h4>
                  <span className="text-primary-500 text-sm">
                    {`${outOfSectMalefic.position.sign} ${formatDegree(
                      outOfSectMalefic.position.degree,
                      outOfSectMalefic.position.minute,
                    )}`}
                  </span>
                </div>
                <span className="text-primary-950">
                  {`Your in-sect benefit is ${outOfSectMalefic.planet}.`}
                </span>
              </div>
            </div>
          </section>
        )}
    </>
  );
}
