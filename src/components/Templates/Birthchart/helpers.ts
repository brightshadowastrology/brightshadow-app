import { type Position, type PlanetPoint, type Aspect } from "@/shared/types";
import { ASPECTS_MAP } from "@/shared/lib/constants";

export const getAspectsToNatalPlanets = (
  transit: Position,
  natalPlanets: PlanetPoint[],
): Aspect[] | [] => {
  const transitAspects = ASPECTS_MAP[transit.sign as keyof typeof ASPECTS_MAP];

  const withinOrb = natalPlanets.filter(
    (natal) => Math.abs(natal.position.degree - transit.degree) <= 3,
  );

  if (withinOrb.length === 0) return [];

  const aspects = withinOrb
    .map((natal) => {
      const match = Object.entries(transitAspects).find(
        ([, sign]) => sign === natal.position.sign,
      );
      if (!match) return null;
      const aspect: Aspect = {
        planet: natal.planet,
        aspect: match[0],
      };
      return aspect;
    })
    .filter((aspect) => {
      return !!aspect;
    });

  return aspects.length > 0 ? aspects : [];
};
