import sweph from "sweph";
import { type Location } from "@/shared/types";

const bodySymbol = ["☉", "☽", "☿", "♀", "♂", "♃", "♄", "♅", "♆", "♇"];
const signSymbol = [
  "♈︎",
  "♉︎",
  "♊︎",
  "♋︎",
  "♌︎",
  "♍︎",
  "♎︎",
  "♏︎",
  "♐︎",
  "♑︎",
  "♒︎",
  "♓︎",
];

const bodies = [
  sweph.constants.SE_SUN,
  sweph.constants.SE_MOON,
  sweph.constants.SE_MERCURY,
  sweph.constants.SE_VENUS,
  sweph.constants.SE_MARS,
  sweph.constants.SE_JUPITER,
  sweph.constants.SE_SATURN,
  sweph.constants.SE_URANUS,
  sweph.constants.SE_NEPTUNE,
  sweph.constants.SE_PLUTO,
];

const planetMap: { [key: string]: number } = {
  Sun: sweph.constants.SE_SUN,
  Moon: sweph.constants.SE_MOON,
  Mercury: sweph.constants.SE_MERCURY,
  Venus: sweph.constants.SE_VENUS,
  Mars: sweph.constants.SE_MARS,
  Jupiter: sweph.constants.SE_JUPITER,
  Saturn: sweph.constants.SE_SATURN,
  Uranus: sweph.constants.SE_URANUS,
  Neptune: sweph.constants.SE_NEPTUNE,
  Pluto: sweph.constants.SE_PLUTO,
};

const rulerShips: { [key: string]: string } = {
  Aries: "Mars",
  Taurus: "Venus",
  Gemini: "Mercury",
  Cancer: "Moon",
  Leo: "Sun",
  Virgo: "Mercury",
  Libra: "Venus",
  Scorpio: "Mars",
  Sagittarius: "Jupiter",
  Capricorn: "Saturn",
  Aquarius: "Saturn",
  Pisces: "Jupiter",
};

const modalities = {
  Cardinal: ["Aries", "Cancer", "Libra", "Capricorn"],
  Fixed: ["Taurus", "Leo", "Scorpio", "Aquarius"],
  Mutable: ["Gemini", "Virgo", "Sagittarius", "Pisces"],
};

const aspectsMap = {
  Aries: {
    opposition: "Libra",
    superiorSquare: "Capricorn",
    inferiorSquare: "Cancer",
    superiorTrine: "Leo",
    inferiorTrine: "Sagittarius",
    superiorSextile: "Aquarius",
    inferiorSextile: "Gemini",
  },
  Taurus: {
    opposition: "Scorpio",
    superiorSquare: "Aquarius",
    inferiorSquare: "Leo",
    superiorTrine: "Capricorn",
    inferiorTrine: "Virgo",
    superiorSextile: "Pisces",
    inferiorSextile: "Cancer",
  },
  Gemini: {
    opposition: "Sagittarius",
    superiorSquare: "Pisces",
    inferiorSquare: "Virgo",
    superiorTrine: "Aquarius",
    inferiorTrine: "Libra",
    superiorSextile: "Aries",
    inferiorSextile: "Leo",
  },
  Cancer: {
    opposition: "Capricorn",
    superiorSquare: "Aries",
    inferiorSquare: "Libra",
    superiorTrine: "Pisces",
    inferiorTrine: "Scorpio",
    superiorSextile: "Taurus",
    inferiorSextile: "Virgo",
  },
  Leo: {
    opposition: "Aquarius",
    superiorSquare: "Taurus",
    inferiorSquare: "Scorpio",
    superiorTrine: "Aries",
    inferiorTrine: "Sagittarius",
    superiorSextile: "Gemini",
    inferiorSextile: "Libra",
  },
  Virgo: {
    opposition: "Pisces",
    superiorSquare: "Gemini",
    inferiorSquare: "Sagittarius",
    superiorTrine: "Taurus",
    inferiorTrine: "Capricorn",
    superiorSextile: "Cancer",
    inferiorSextile: "Scorpio",
  },
  Libra: {
    opposition: "Aries",
    superiorSquare: "Cancer",
    inferiorSquare: "Capricorn",
    superiorTrine: "Gemini",
    inferiorTrine: "Aquarius",
    superiorSextile: "Leo",
    inferiorSextile: "Sagittarius",
  },
  Scorpio: {
    opposition: "Taurus",
    superiorSquare: "Leo",
    inferiorSquare: "Aquarius",
    superiorTrine: "Cancer",
    inferiorTrine: "Pisces",
    superiorSextile: "Virgo",
    inferiorSextile: "Capricorn",
  },
  Sagittarius: {
    opposition: "Gemini",
    superiorSquare: "Virgo",
    inferiorSquare: "Pisces",
    superiorTrine: "Leo",
    inferiorTrine: "Aries",
    superiorSextile: "Scorpio",
    inferiorSextile: "Aries",
  },
  Capricorn: {
    opposition: "Cancer",
    superiorSquare: "Libra",
    inferiorSquare: "Aries",
    superiorTrine: "Aquarius",
    inferiorTrine: "Pisces",
    superiorSextile: "Sagittarius",
    inferiorSextile: "Taurus",
  },
  Aquarius: {
    opposition: "Leo",
    superiorSquare: "Scorpio",
    inferiorSquare: "Taurus",
    superiorTrine: "Pisces",
    inferiorTrine: "Aries",
    superiorSextile: "Sagittarius",
    inferiorSextile: "Aries",
  },
  Pisces: {
    opposition: "Virgo",
    superiorSquare: "Sagittarius",
    inferiorSquare: "Gemini",
    superiorTrine: "Scorpio",
    inferiorTrine: "Cancer",
    superiorSextile: "Capricorn",
    inferiorSextile: "Taurus",
  },
};

const signs = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
];

export const getPlanetName = (ipl: number) => {
  return sweph.get_planet_name(ipl);
};

export const getPlanetSign = (sign: number) => {
  return signs[sign];
};

export const getPlanetModality = (sign: string) => {
  for (const modality in modalities) {
    if (modalities[modality as keyof typeof modalities].includes(sign)) {
      return modality;
    }
  }
  return "Unknown";
};

export const getHousePositions = (
  date: number,
  latitude: number,
  longitude: number,
) => {
  //get ascendant
  let houses = sweph.houses(
    date,
    latitude,
    longitude,
    "P", // Placidus house system
  ).data;
  return houses;
};

export const convertValuetoDegrees = (value: number) => {
  const split_deg = sweph.split_deg(
    value,
    sweph.constants.SE_SPLIT_DEG_ZODIACAL,
  );
  return {
    degree: split_deg.degree,
    minute: split_deg.minute,
    sign: getPlanetSign(split_deg.sign),
  };
};

export const getAngle = (
  houseData: sweph.HouseData<12>,
  sign: string,
  angleName: string,
  angleIndex: number,
) => {
  return {
    planet: angleName,
    sign: convertValuetoDegrees(houseData.houses[angleIndex]).sign,
    modality: getPlanetModality(sign),
    house: angleIndex + 1,
    position: {
      degree: convertValuetoDegrees(houseData.houses[6]).degree,
      minute: convertValuetoDegrees(houseData.houses[6]).minute,
    },
  };
};

export const getProfectionYear = (ascendantSign: string, birthdate: Date) => {
  // get age
  const now = new Date();
  let age = now.getFullYear() - birthdate.getFullYear();
  const monthDiff = now.getMonth() - birthdate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && now.getDate() < birthdate.getDate())
  ) {
    age--;
  }
  // Start at age 0, for every year, increment the house 1, until house 12, then loop back to 1
  const profectionYear = (age % 12) + 1;

  // Start at ascendantSign, for every house increment, move to next sign in zodiac
  const ascIndex = signs.indexOf(ascendantSign);
  const lordIndex = (ascIndex + profectionYear - 1) % 12;
  const lordOfYear = rulerShips[signs[lordIndex]];

  return {
    profectionYear,
    profectionSign: signs[lordIndex],
    lordOfYear: lordOfYear,
  }; // Profection year starts from 1
};

export const getPlanetHouse = (planetSign: string, ascendant: string) => {
  const signOrder = [];
  const ascIndex = signs.indexOf(ascendant);
  for (let i = 0; i < 12; i++) {
    signOrder.push(signs[(ascIndex + i) % 12]);
  }

  const planetIndex = signOrder.indexOf(planetSign);
  return planetIndex + 1; // Houses are 1-indexed
};

export const getJulianDayFromDate = (date: Date) => {
  return sweph.utc_to_jd(
    date.getUTCFullYear(),
    date.getUTCMonth() + 1,
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    0,
    sweph.constants.SE_GREG_CAL,
  );
};

export const getSplitDegreeFromDate = (date: Date, body: number) => {
  const julday = getJulianDayFromDate(date);

  const [jd_ut] = julday.data;

  const calc_ut = sweph.calc_ut(jd_ut, body, sweph.constants.SEFLG_SPEED);

  const [longitude] = calc_ut.data;
  const split_deg = sweph.split_deg(
    longitude,
    sweph.constants.SE_SPLIT_DEG_ZODIACAL,
  );

  return split_deg;
};

export const getPlanetaryPositionsByDate = (date: Date) => {
  const result = bodies.map((bodyNumber) => {
    const split_deg = getSplitDegreeFromDate(date, bodyNumber);

    const modality = Object.keys(modalities).find((modality) =>
      modalities[modality as keyof typeof modalities].includes(
        getPlanetSign(split_deg.sign),
      ),
    );

    return {
      planet: getPlanetName(bodyNumber),
      sign: getPlanetSign(split_deg.sign),
      modality: modality || "Unknown",
      position: {
        degree: split_deg.degree,
        minute: split_deg.minute,
      },
    };
  });

  return {
    placements: result,
  };
};

export const getBirthChartData = (date: Date) => {
  const julday = getJulianDayFromDate(date);
  const { placements } = getPlanetaryPositionsByDate(date);

  const houses = getHousePositions(
    julday.data[0],
    23.59, // Latitude for Muscat Oman
    58.38, // Longitude for Muscat Oman
  );
  const houseDegrees = convertValuetoDegrees(houses.houses[0]);

  let result = placements.map((placement) => {
    const house = getPlanetHouse(placement.sign, houseDegrees.sign);
    return {
      ...placement,
      house,
    };
  });

  // Angles
  const ascendant = getAngle(houses, houseDegrees.sign, "Ascendant", 0);
  const descendant = getAngle(houses, houseDegrees.sign, "Descendant", 6);
  const midheaven = getAngle(houses, houseDegrees.sign, "Midheaven", 9);
  const ic = getAngle(houses, houseDegrees.sign, "IC", 3);

  // Push angle data
  result.push(ascendant);
  result.push(descendant);
  result.push(midheaven);
  result.push(ic);

  return result;
};

export const getPlanetaryIngressByDegree = (
  planet: string,
  sign: string,
  degree: number,
  minute?: number,
) => {
  const bodyNumber = planetMap[planet];
  const signIndex = signs.indexOf(sign);

  const results: Array<{
    date: string;
    position: {
      sign: string;
      degree: number;
      minute: number;
    };
    exactMatch: boolean;
  }> = [];

  // Start from current date, calculate for one year from current date
  const startDate = new Date();
  const endDate = new Date();
  endDate.setFullYear(startDate.getFullYear() + 1);

  // Search day by day
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    // Convert to Julian day
    const julday = sweph.utc_to_jd(
      currentDate.getUTCFullYear(),
      currentDate.getUTCMonth() + 1,
      currentDate.getUTCDate(),
      0,
      0,
      0,
      sweph.constants.SE_GREG_CAL,
    );

    const [jd_ut] = julday.data;

    // Calculate planet position
    const calc_ut = sweph.calc_ut(
      jd_ut,
      bodyNumber,
      sweph.constants.SEFLG_SPEED,
    );

    const [longitude] = calc_ut.data;

    // Split degrees to get sign, degree, and minute
    const split_deg = sweph.split_deg(
      longitude,
      sweph.constants.SE_SPLIT_DEG_ZODIACAL,
    );

    // TODO: add location for transit
    if (split_deg.sign === signIndex && split_deg.degree == degree) {
      results.push({
        date: currentDate.toISOString().split("T")[0],
        position: {
          sign: getPlanetSign(split_deg.sign),
          degree: split_deg.degree,
          minute: split_deg.minute,
        },
        exactMatch: true,
      });
    }

    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return {
    planet,
    targetPosition: {
      sign: sign,
      degree,
      minute,
    },
    searchPeriod: {
      start: startDate.toISOString().split("T")[0],
      end: endDate.toISOString().split("T")[0],
    },
    matchesFound: results.length,
    dates: results,
  };
};

export const getMajorTransitsForAPlanet = (
  natalPlanet: string,
  natalSign: string,
  natalDegree: number,
  natalMinute?: number,
) => {
  const cardinality = getPlanetModality(natalPlanet);

  const oppositionSign =
    aspectsMap[natalSign as keyof typeof aspectsMap].opposition;
  const superiorSqaureSign =
    aspectsMap[natalSign as keyof typeof aspectsMap].superiorSquare;
  const inferiorSquareSign =
    aspectsMap[natalSign as keyof typeof aspectsMap].inferiorSquare;
  const superiorTrineSign =
    aspectsMap[natalSign as keyof typeof aspectsMap].superiorTrine;
  const inferiorTrineSign =
    aspectsMap[natalSign as keyof typeof aspectsMap].inferiorTrine;
  const superiorSextileSign =
    aspectsMap[natalSign as keyof typeof aspectsMap].superiorSextile;
  const inferiorSextileSign =
    aspectsMap[natalSign as keyof typeof aspectsMap].inferiorSextile;

  const transitingPlanet = ["Jupiter", "Saturn", "Uranus", "Neptune", "Pluto"];

  const result = transitingPlanet.map((planet) => {
    const oppositionTransits = getPlanetaryIngressByDegree(
      planet,
      oppositionSign,
      natalDegree,
      natalMinute,
    );
    const superiorSquareTransits = getPlanetaryIngressByDegree(
      planet,
      superiorSqaureSign,
      natalDegree,
      natalMinute,
    );
    const inferiorSquareTransits = getPlanetaryIngressByDegree(
      planet,
      inferiorSquareSign,
      natalDegree,
      natalMinute,
    );
    const superiorTrineTransits = getPlanetaryIngressByDegree(
      planet,
      superiorTrineSign,
      natalDegree,
      natalMinute,
    );
    const inferiorTrineTransits = getPlanetaryIngressByDegree(
      planet,
      inferiorTrineSign,
      natalDegree,
      natalMinute,
    );
    const superiorSextileTransits = getPlanetaryIngressByDegree(
      planet,
      superiorSextileSign,
      natalDegree,
      natalMinute,
    );
    const inferiorSextileTransits = getPlanetaryIngressByDegree(
      planet,
      inferiorSextileSign,
      natalDegree,
      natalMinute,
    );

    return {
      planet,
      opposition:
        oppositionTransits.matchesFound > 0 ? oppositionTransits : null,
      superiorSquare:
        superiorSquareTransits.matchesFound > 0 ? superiorSquareTransits : null,
      inferiorSquare:
        inferiorSquareTransits.matchesFound > 0 ? inferiorSquareTransits : null,
      superiorTrine:
        superiorTrineTransits.matchesFound > 0 ? superiorTrineTransits : null,
      inferiorTrine:
        inferiorTrineTransits.matchesFound > 0 ? inferiorTrineTransits : null,
      superiorSextile:
        superiorSextileTransits.matchesFound > 0
          ? superiorSextileTransits
          : null,
      inferiorSextile:
        inferiorSextileTransits.matchesFound > 0
          ? inferiorSextileTransits
          : null,
    };
  });

  return {
    natalPlanet,
    natalPosition: {
      sign: natalSign,
      degree: natalDegree,
      minute: natalMinute,
    },
    cardinality,
    transits: result,
  };
};

// Helper to find the exact date time for new moons and full moons in the coming year, a date that is close enough, and increment the hours and minutes to find 0 degree conjunction
const getExactLunationDate = (targetDate: Date, isNewMoon: boolean) => {
  let exactDate = new Date(targetDate);
  let found = false;

  while (!found) {
    const julday = sweph.utc_to_jd(
      exactDate.getUTCFullYear(),
      exactDate.getUTCMonth() + 1,
      exactDate.getUTCDate(),
      exactDate.getUTCHours(),
      exactDate.getUTCMinutes(),
      0,
      sweph.constants.SE_GREG_CAL,
    );

    const [jd_ut] = julday.data;

    // Calculate Sun position
    const sunCalc = sweph.calc_ut(
      jd_ut,
      sweph.constants.SE_SUN,
      sweph.constants.SEFLG_SPEED,
    );
    const [sunLongitude] = sunCalc.data;
    const sunSplitDeg = sweph.split_deg(
      sunLongitude,
      sweph.constants.SE_SPLIT_DEG_ZODIACAL,
    );

    // Calculate Moon position
    const moonCalc = sweph.calc_ut(
      jd_ut,
      sweph.constants.SE_MOON,
      sweph.constants.SEFLG_SPEED,
    );
    const [moonLongitude] = moonCalc.data;
    const moonSplitDeg = sweph.split_deg(
      moonLongitude,
      sweph.constants.SE_SPLIT_DEG_ZODIACAL,
    );

    const angleDiff = sweph.difdegn(
      sweph.d2l(sunLongitude),
      sweph.d2l(moonLongitude),
    );

    if (isNewMoon) {
      // New Moon when angle difference is close to 0
      if (angleDiff < 0.1 || angleDiff > 359.9) {
        console.log(
          exactDate.toISOString(),
          `Sun Degree: ${sunSplitDeg.degree}`,
          getPlanetSign(sunSplitDeg.sign),
          `Moon Degree: ${moonSplitDeg.degree}`,
          getPlanetSign(moonSplitDeg.sign),
          `angleDif: ${angleDiff}`,
        );

        found = true;
      } else {
        // Increment by 1 hour
        exactDate.setUTCHours(exactDate.getUTCHours() + 1);
      }
    } else {
      // Full Moon when angle difference is close to 180
      if (angleDiff > 179.9 && angleDiff < 180.1) {
        found = true;
      } else {
        // Increment by 1 hour
        exactDate.setUTCHours(exactDate.getUTCHours() + 1);
      }
    }
  }

  return exactDate;
};

export const getLunations = (date?: Date) => {
  const startDate = date || new Date();
  // For each sign, we need to find the dates where the moon is conjunct the Sun, and when the moon is in opposition to the Sun
  let results = signs.map((sign) => {
    return {
      sign,
      newMoons: [] as Array<{
        date: string;
        degree: number;
        minute: number;
      }>,
      fullMoons: [] as Array<{
        date: string;
        degree: number;
        minute: number;
      }>,
    };
  });
  // Start from current date, calculate for one year from current date
  const endDate = new Date(startDate);
  endDate.setFullYear(startDate.getFullYear() + 1);

  const newMoons: Array<string> = [];
  const fullMoons: Array<string> = [];

  // Search day by day
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    // Convert to Julian day
    const julday = getJulianDayFromDate(currentDate);

    const [jd_ut] = julday.data;

    // Calculate Sun position, to start
    const sunCalc = sweph.calc_ut(
      jd_ut,
      sweph.constants.SE_SUN,
      sweph.constants.SEFLG_SPEED,
    );
    const [sunLongitude] = sunCalc.data;
    const sunSplitDeg = sweph.split_deg(
      sunLongitude,
      sweph.constants.SE_SPLIT_DEG_ZODIACAL,
    );

    // Calculate Moon position, to start
    const moonCalc = sweph.calc_ut(
      jd_ut,
      sweph.constants.SE_MOON,
      sweph.constants.SEFLG_SPEED,
    );
    const [moonLongitude] = moonCalc.data;

    // Get distance between Sun and Moon
    const t = sweph.difdegn(sweph.d2l(sunLongitude), sweph.d2l(moonLongitude));

    // Check for New Moon (conjunction)
    if (t > 350 || t < 10) {
      const exactNewMoonDate = getExactLunationDate(currentDate, true);
      const exactSunPos = getSplitDegreeFromDate(
        exactNewMoonDate,
        sweph.constants.SE_SUN,
      );
      newMoons.push(exactNewMoonDate.toISOString().split("T")[0]);
      results[exactSunPos.sign].newMoons.push({
        date: exactNewMoonDate.toISOString().split("T")[0],
        degree: exactSunPos.degree,
        minute: exactSunPos.minute,
      });
    }

    // Check for Full Moon (opposition)
    if (t > 170 && t < 185) {
      const exactFullMoonDate = getExactLunationDate(currentDate, false);
      fullMoons.push(exactFullMoonDate.toISOString().split("T")[0]);
      const exactSunPos = getSplitDegreeFromDate(
        exactFullMoonDate,
        sweph.constants.SE_SUN,
      );
      // push to full moons of opposite sign
      const oppositeSignIndex = (exactSunPos.sign + 6) % 12;
      results[oppositeSignIndex].fullMoons.push({
        date: exactFullMoonDate.toISOString().split("T")[0],
        degree: exactSunPos.degree,
        minute: exactSunPos.minute,
      });
    }
    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return results;
};

export const getLunarEclipses = (date: Date, location: Location) => {
  const eclipses = sweph.lun_eclipse_when_loc(
    getJulianDayFromDate(date).data[0],
    sweph.constants.SE_ECL_TOTAL,
    [
      location.latitude,
      location.longitude,
      location.elevation ? location.elevation : 0,
    ],
    false,
  );

  return eclipses.data;
};

export const getSolarEclipses = (date: Date, location: Location) => {
  const eclipses = sweph.sol_eclipse_when_loc(
    getJulianDayFromDate(date).data[0],
    sweph.constants.SE_ECL_TOTAL,
    [
      location.latitude,
      location.longitude,
      location.elevation ? location.elevation : 0,
    ],
    false,
  );

  return eclipses.data;
};
