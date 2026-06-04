import * as constants from "@/shared/lib/constants";
import {
  ASPECTS_MAP,
  PLANET_DIGNITIES_DEBILITIES,
} from "@/shared/lib/constants";
import { sectInterpretations } from "@/shared/text/general";
import {
  type Eclipse,
  type Lunation,
  type Pill,
  type PlanetPoint,
  type Position,
  type ProfectionYearData,
  type SectPlanets,
  type TransitEntry,
} from "@/shared/types";

export const getOrdinal = (n: number): string => {
  const suffixes = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
};

export const formatDegree = (degree: number, minute: number): string => {
  return `${degree}°${minute.toString().padStart(2, "0")}'`;
};

export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const month = constants.MONTHS[date.getMonth()].label;
  return `${month} ${date.getDate()}`;
};

export const randomArrayIndex = <T>(arrLength: number): number => {
  return Math.floor(Math.random() * arrLength);
};

export const titleCase = (str: string): string => {
  const splitStr = str.toLowerCase().split(" ");
  for (let i = 0; i < splitStr.length; i++) {
    // You do not need to check if i is larger than splitStr length, as your for does that for you
    // Assign it back to the array
    splitStr[i] =
      splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  // Directly return the joined string
  return splitStr.join(" ");
};

export const getHouseFromSign = (
  ascendantSign: string,
  sign: string,
): number => {
  //start at the ascendant sign and count up to the target sign, wrapping around the zodiac
  const zodiac = constants.SIGNS;
  const startIndex = zodiac.indexOf(ascendantSign);
  const targetIndex = zodiac.indexOf(sign);
  const houseNumber = ((targetIndex - startIndex + 12) % 12) + 1;
  return houseNumber;
};

export const getAspectsToNatalPlanets = (
  transit: Position,
  natalPlanets: PlanetPoint[],
  transitingPlanet: string,
  date: string,
): TransitEntry[] => {
  const transitAspects = ASPECTS_MAP[transit.sign as keyof typeof ASPECTS_MAP];

  const filteredNatalPlanets = [
    "Sun",
    "Moon",
    "Mercury",
    "Venus",
    "Mars",
    "Jupiter",
    "Saturn",
  ];

  const classicalPlanets = natalPlanets.filter((natal) =>
    filteredNatalPlanets.includes(natal.planet),
  );

  const withinOrb = classicalPlanets.filter(
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

export const isPersonalPlanet = (planet: string) => {
  return ["Sun", "Moon", "Mercury", "Venus", "Mars"].includes(planet);
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

export const isAngular = (house: number) => {
  return [1, 4, 7, 10].includes(house);
};

export const isGoodHouse = (house: number) => {
  return [2, 3, 5, 9, 11].includes(house);
};

export const isBadHouse = (house: number) => {
  return [6, 8, 12].includes(house);
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
  profectionYearData: ProfectionYearData | null,
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
    transitingPlanetAspect === "trine" || transitingPlanetAspect === "sextile"
      ? "easy"
      : "hard";

  if (isSectPlanet(transitingPlanetName)) {
    const isBenefic = isBeneficPlanet(transitingPlanetName);
    const sect = isBenefic
      ? sectPlanets.inSectBenefic.planet === transitingPlanetName
        ? "inSectBenefic"
        : "outOfSectBenefic"
      : sectPlanets.inSectMalefic.planet === transitingPlanetName
        ? "inSectMalefic"
        : "outOfSectMalefic";
    const text =
      sectInterpretations?.[transitingPlanetName]?.[sect]?.[transitAspect] ||
      "";

    // Joyous transits - Easy Transits from benefic
    if (
      isBenefic &&
      (transitAspect === "easy" || transitingPlanetAspect === "conjunct")
    ) {
      pills.push({
        type: "joyous",
        toolTip: text,
      });
    }
    // Excessive transit - Hard transits from benefics
    if (
      isBenefic &&
      (transitingPlanetAspect === "square" ||
        transitingPlanetAspect === "opposition")
    ) {
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

  // Notable transits - Transits to angles or angle rulers
  if (
    transitAspect === "hard" &&
    isSocialPlanet(transitingPlanetName) &&
    (isPlacementAngle(transit.natalPlanet) ||
      isAngleRuler(natalPlanet.rulerOf || []))
  ) {
    pills.push({
      type: "notable",
      toolTip:
        "These hard transits of the social planets to your angles or angle rulers mark significant turning points in life.",
    });
  }

  // Powerful - Transits of outer planets to angles or angle rulers
  if (
    transitAspect === "hard" &&
    (isOuterPlanet(transitingPlanetName) ||
      transitingPlanetName === "Eclipse") &&
    (isPlacementAngle(transit.natalPlanet) ||
      isAngleRuler(natalPlanet.rulerOf || []))
  ) {
    pills.push({
      type: "powerful",
      toolTip:
        "These hard transits of the outer planets to your angles or angle rulers often manifest as life-changing events.",
    });
  }

  // Pivot Point - Transits of eclipses
  if (transitAspect === "hard" && transitingPlanetName === "Eclipse") {
    pills.push({
      type: "pivotPoint",
      toolTip:
        "This eclipse sets up six months of major endings and new beginnings in the areas of life associated with this house.",
    });
  }

  // Time lord events - Transits to the profected house, transits to the ruler of the profected house, or transits from the profected ruler
  // If moon is the time lord for the year, new and full moons, as well as eclipeses are time lord events
  // If sun is the time lord for the year then eclipses, and the changing of the sun's sign are time lords events
  // For other planets, the ingress of the planet into a new sign, as well as any hard aspect from that planet is a time lord event
  if (profectionYearData) {
    const { profectionSign, lordOfYear } = profectionYearData;

    const isProfectedHouseTransit = transit.position.sign === profectionSign;
    const isTransitToLordOfYear = transit.natalPlanet === lordOfYear;

    let isTransitFromLordOfYear = false;
    if (lordOfYear === "Moon") {
      isTransitFromLordOfYear = transitingPlanetName === "Eclipse";
    } else if (lordOfYear === "Sun") {
      isTransitFromLordOfYear = transitingPlanetName === "Eclipse";
    } else {
      isTransitFromLordOfYear =
        transit.transitingPlanet === lordOfYear && transitAspect === "hard";
    }

    if (
      isProfectedHouseTransit ||
      isTransitToLordOfYear ||
      isTransitFromLordOfYear
    ) {
      let toolTip = "";
      if (isTransitFromLordOfYear) {
        if (lordOfYear === "Moon") {
          toolTip =
            "As your time lord, the Moon's lunations and eclipses mark pivotal moments this year.";
        } else if (lordOfYear === "Sun") {
          toolTip =
            "As your time lord, this eclipse marks a significant turning point this year.";
        } else {
          toolTip = `This hard transit from your time lord ${lordOfYear} marks a key turning point this year.`;
        }
      } else if (isTransitToLordOfYear) {
        toolTip = `This transit to your natal ${lordOfYear} activates your time lord for this year.`;
      } else {
        toolTip =
          "This transit occurs in your profected sign, activating this year's key themes.";
      }

      pills.push({ type: "timeLordEvent", toolTip });
    }
  }

  return pills;
};

export const isDateNotable = (
  birthchartData: PlanetPoint[],
  sectPlanets: SectPlanets,
  transit: TransitEntry,
  profectionYearData: ProfectionYearData | null,
): boolean => {
  const pills = getPills(
    birthchartData,
    sectPlanets,
    transit,
    profectionYearData,
  );
  return pills.some(
    (pill) =>
      pill.type === "powerful" ||
      pill.type === "challenging" ||
      pill.type === "joyous" ||
      pill.type === "notable",
  );
};

export const isEclipseNotable = (
  eclipse: Eclipse,
  birthchartData: PlanetPoint[],
  sectPlanets: SectPlanets,
  profectionYearData: ProfectionYearData | null,
): boolean => {
  const aspects = getAspectsToNatalPlanets(
    eclipse.position,
    birthchartData,
    eclipse.type,
    eclipse.date,
  );
  return aspects.some((aspect) =>
    isDateNotable(birthchartData, sectPlanets, aspect, profectionYearData),
  );
};

export const isLunationNotable = (
  lunation: Lunation,
  birthchartData: PlanetPoint[],
  sectPlanets: SectPlanets,
  profectionYearData: ProfectionYearData | null,
): boolean => {
  const aspects = getAspectsToNatalPlanets(
    lunation.position,
    birthchartData,
    lunation.lunationType,
    lunation.date,
  );
  return aspects.some((aspect) =>
    isDateNotable(birthchartData, sectPlanets, aspect, profectionYearData),
  );
};

export const getPlanetDignity = (planet: string, sign: string): string => {
  let dignity = "peregrine";

  ["Domicile", "Exaltation", "Detriment", "Fall"].forEach((dignityType) => {
    if (PLANET_DIGNITIES_DEBILITIES[planet]) {
      const planetDignities = PLANET_DIGNITIES_DEBILITIES[planet];
      if (
        planetDignities[dignityType as keyof typeof planetDignities].includes(
          sign,
        )
      ) {
        switch (dignityType) {
          case "Domicile":
            dignity = "in domicile";
            break;
          case "Exaltation":
            dignity = "exalted";
            break;
          case "Detriment":
            dignity = "in detriment";
            break;
          case "Fall":
            dignity = "in fall";
            break;
          default:
            dignity = "peregrine";
        }
      }
    }
  });

  return dignity;
};
