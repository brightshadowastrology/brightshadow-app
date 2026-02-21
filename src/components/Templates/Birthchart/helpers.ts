import {
  type Position,
  type PlanetPoint,
  type SectPlanets,
  type TransitEntry,
  type Pill,
} from "@/shared/types";
import { sectInterpretations } from "@/shared/lib/text";
import { ASPECTS_MAP } from "@/shared/lib/constants";

export const getAspectsToNatalPlanets = (
  transit: Position,
  natalPlanets: PlanetPoint[],
  transitingPlanet: string,
  date: string,
): TransitEntry[] => {
  const transitAspects = ASPECTS_MAP[transit.sign as keyof typeof ASPECTS_MAP];

  const withinOrb = natalPlanets.filter(
    (natal) => Math.abs(natal.position.degree - transit.degree) <= 3,
  );

  if (withinOrb.length === 0) return [];

  const entries = withinOrb
    .map((natal) => {
      const match = Object.entries(transitAspects).find(
        ([, sign]) => sign === natal.position.sign,
      );
      if (!match) return null;
      const entry: TransitEntry = {
        date,
        transitingPlanet,
        natalPlanet: natal.planet,
        aspect: match[0],
        position: transit,
        natalPosition: natal.position,
        exactMatch: natal.position.degree === transit.degree,
      };
      return entry;
    })
    .filter((entry): entry is TransitEntry => {
      return !!entry;
    });

  return entries;
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

export const isFastMoving = (planet: string) => {
  return ["Mars", "Venus"].includes(planet);
};

export const isBeneficPlanet = (planet: string) => {
  return ["Jupiter", "Venus"].includes(planet);
};

export const isPlacementAngle = (placement: string) => {
  return ["Midheaven", "IC", "Ascendant", "Descendant"].includes(placement);
};

export const isAngleRuler = (rulerOf: number[]) => {
  return rulerOf.some((house) => [1, 4, 7, 10].includes(house));
};

export const isSectPlanet = (planet: string) => {
  return ["Jupiter", "Venus", "Mars", "Saturn"].includes(planet);
};

export const isSocialPlanet = (planet: string) => {
  return ["Jupiter", "Saturn"].includes(planet);
};

export const isOuterPlanet = (planet: string) => {
  return ["Uranus", "Neptune", "Pluto"].includes(planet);
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

export const getPills = (
  birthchartData: PlanetPoint[],
  sectPlanets: SectPlanets,
  transit: TransitEntry,
): Pill[] => {
  const pills: Pill[] = [];

  const natalPlanet =
    birthchartData.find((p) => p.planet === transit.natalPlanet) ||
    birthchartData[0];
  const transitingPlanetName = transit.transitingPlanet
    .toLowerCase()
    .includes("moon")
    ? "Lunation"
    : transit.transitingPlanet.toLowerCase().includes("eclipse")
      ? "Eclipse"
      : transit.transitingPlanet;
  const split = transit.aspect.split(/(?=[A-Z])/);

  const transitingPlanetAspect =
    split.length > 1 ? split[1].toLowerCase() : split[0];

  const transitAspect =
    transitingPlanetAspect === "conjunct" ||
    transitingPlanetAspect === "trine" ||
    transitingPlanetAspect === "sextile"
      ? "easy"
      : "hard";

  if (isFastMoving(transitingPlanetName)) {
    // Fast moving - Transits of fast-moving inner planets
    pills.push({
      type: "fastMoving",
      toolTip:
        "This is a brief transit, so it's effects will be felt only briefly.",
    });
  }

  if (isSectPlanet(transitingPlanetName)) {
    const isBenefic = isBeneficPlanet(transitingPlanetName);
    const sect = isBenefic
      ? sectPlanets.inSectBenefic.planet === transitingPlanetName
        ? "inSectBenefic"
        : "outOfSectBenefic"
      : sectPlanets.inSectMalefic.planet === transitingPlanetName
        ? "inSectMalefic"
        : "outOfSectMalefic";
    const text = sectInterpretations[transitingPlanetName][sect][transitAspect];

    // Joyous transits - Easy Transits from benefic
    if (isBenefic && transitAspect === "easy") {
      pills.push({
        type: "joyous",
        toolTip: text,
      });
    }
    // Excessive transit - Hard transits from benefics
    if (isBenefic && transitAspect === "hard") {
      pills.push({
        type: "excessive",
        toolTip: text,
      });
    }
    // Productive - Easy transits from malefics
    if (!isBenefic && transitAspect === "easy") {
      pills.push({
        type: "productive",
        toolTip: text,
      });
    }
    // Challening - Hard transits from malefics
    if (!isBenefic && transitAspect === "hard") {
      pills.push({
        type: "challenging",
        toolTip: text,
      });
    }
  }

  if (
    transitAspect === "hard" &&
    isSocialPlanet(transitingPlanetName) &&
    (isPlacementAngle(transit.natalPlanet) ||
      isAngleRuler(natalPlanet.rulerOf || []))
  ) {
    // Significant - Transits of social planets angles or angle rulers
    pills.push({
      type: "significant",
      toolTip:
        "These hard transits of the social planets (Jupiter and Saturn) to your angles or angle rulers mark significant turning points in life.",
    });
  }

  if (
    transitAspect === "hard" &&
    isOuterPlanet(transitingPlanetName) &&
    (isPlacementAngle(transit.natalPlanet) ||
      isAngleRuler(natalPlanet.rulerOf || []))
  ) {
    // Life defining - Transits of outer planets to angles or angle rulers
    pills.push({
      type: "lifeDefining",
      toolTip:
        "These hard transits of the outer planets to your angles or angle rulers often manifest as life-changing events.",
    });
  }

  if (
    (transitingPlanetAspect === "conjunct" ||
      transitingPlanetAspect === "square" ||
      transitingPlanetAspect === "opposition") &&
    transitingPlanetName === "Lunation"
  ) {
    // Significant - Transits of lunations angles or angle rulers
    pills.push({
      type: "significant",
      toolTip:
        "This lunation sets up six months of significant changes in the areas of life associated with the planets or angles it is in hard aspect to.",
    });
  }

  if (
    (transitingPlanetAspect === "conjunct" ||
      transitingPlanetAspect === "square" ||
      transitingPlanetAspect === "opposition") &&
    transitingPlanetName === "Eclipse" &&
    (isPlacementAngle(transit.natalPlanet) ||
      isAngleRuler(natalPlanet.rulerOf || []))
  ) {
    // Significant - Transits of lunations angles or angle rulers
    pills.push({
      type: "significant",
      toolTip:
        "This eclipse sets up six months of major endings and new beginnings in the areas of life associated with the planets or angles it is in hard aspect to.",
    });
  }

  return pills;
};
