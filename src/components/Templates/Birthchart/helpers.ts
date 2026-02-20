import {
  type Position,
  type PlanetPoint,
  type Aspect,
  type SectPlanets,
} from "@/shared/types";
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

export const getIsDayChart = (
  sun: PlanetPoint,
  ascendant: PlanetPoint,
  descendant: PlanetPoint,
) => {
  const dayHouses = [12, 11, 10, 9, 8];

  if (dayHouses.includes(sun.house)) {
    return true;
  }

  if (sun.house === 1 || sun.house === 7) {
    if (
      (sun.position.sign === ascendant.position.sign &&
        ascendant.position.degree > sun.position.degree) ||
      (sun.position.sign === descendant.position.sign &&
        descendant.position.degree < sun.position.degree)
    ) {
      return true;
    }
  }

  return false;
};

export const getSectPlanets = (
  isDayChart: boolean,
  birthchartData: PlanetPoint[],
): SectPlanets => {
  const inSectBenefic: PlanetPoint = birthchartData.find((p) =>
    isDayChart ? p.planet === "Jupiter" : p.planet === "Venus",
  ) || {
    planet: "Jupiter",
    modality: "Fixed",
    position: {
      sign: "Leo",
      degree: 0,
      minute: 0,
    },
    house: 1,
  };
  const outOfSectBenefic = birthchartData.find((p) =>
    isDayChart ? p.planet === "Venus" : p.planet === "Jupiter",
  ) || {
    planet: "Venus",
    modality: "Fixed",
    position: {
      sign: "Leo",
      degree: 0,
      minute: 0,
    },
    house: 1,
  };
  const inSectMalefic = birthchartData.find((p) =>
    isDayChart ? p.planet === "Saturn" : p.planet === "Mars",
  ) || {
    planet: "Saturn",
    modality: "Fixed",
    position: {
      sign: "Leo",
      degree: 0,
      minute: 0,
    },
    house: 1,
  };
  const outOfSectMalefic = birthchartData.find((p) =>
    isDayChart ? p.planet === "Mars" : p.planet === "Saturn",
  ) || {
    planet: "Mars",
    modality: "Fixed",
    position: {
      sign: "Leo",
      degree: 0,
      minute: 0,
    },
    house: 1,
  };

  return {
    inSectBenefic,
    inSectMalefic,
    outOfSectBenefic,
    outOfSectMalefic,
  };
};
