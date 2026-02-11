import sweph from "sweph";
import * as constants from "@/server/constants";
import * as sharedConstants from "@/shared/lib/constants";
import {
  getJulianDayFromDate,
  getPlanetSign,
  getPlanetName,
  getPlanetHouse,
  getPlanetModality,
  getHousePositions,
  convertValuetoDegrees,
  getAngle,
  getSplitDegreeFromDate,
  getExactLunationDate,
  getEclipseType,
} from "./helpers";
import {
  type PlanetPoint,
  type Lunation,
  type Position,
  type PlanetaryIngress,
  type Transits,
  type MajorTransits,
  type Eclipse,
  type RetrogradePeriod,
  type ProfectionYearData,
} from "@/shared/types";

export const getBirthChartData = (
  date: Date,
  longitude: number,
  latitude: number,
): PlanetPoint[] => {
  const julday = getJulianDayFromDate(date);
  const { placements } = getPlanetaryPositionsByDate(date);

  const houses = getHousePositions(julday.data[0], latitude, longitude);
  const houseDegrees = convertValuetoDegrees(houses.houses[0]);

  let result = placements.map((placement) => {
    const house = getPlanetHouse(placement.position.sign, houseDegrees.sign);
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

export const getProfectionYear = (
  ascendantSign: string,
  birthdate: Date,
): ProfectionYearData => {
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
  const ascIndex = sharedConstants.SIGNS.indexOf(ascendantSign);
  const lordIndex = (ascIndex + profectionYear - 1) % 12;
  const lordOfYear =
    sharedConstants.SIGN_RULERS[sharedConstants.SIGNS[lordIndex]];

  return {
    profectionYear,
    profectionSign: sharedConstants.SIGNS[lordIndex],
    lordOfYear: lordOfYear,
  }; // Profection year starts from 1
};

export const getPlanetaryPositionsByDate = (
  date: Date,
): { placements: PlanetPoint[] } => {
  const result = constants.BODIES.map((bodyNumber) => {
    const split_deg = getSplitDegreeFromDate(date, bodyNumber);

    const modality = Object.keys(sharedConstants.MODALITIES).find((modality) =>
      sharedConstants.MODALITIES[
        modality as keyof typeof sharedConstants.MODALITIES
      ].includes(getPlanetSign(split_deg.sign)),
    );

    return {
      planet: getPlanetName(bodyNumber),
      modality: modality || "Unknown",
      house: 0, // to be filled later
      position: {
        sign: getPlanetSign(split_deg.sign),
        degree: split_deg.degree,
        minute: split_deg.minute,
      },
    };
  });

  return {
    placements: result,
  };
};

export const getPlanetaryIngressByDegree = (
  planet: string,
  position: Position,
): PlanetaryIngress => {
  const bodyNumber = constants.PLANET_MAP[planet];
  const signIndex = sharedConstants.SIGNS.indexOf(position.sign);

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
    if (split_deg.sign === signIndex && split_deg.degree == position.degree) {
      const dateStr = currentDate.toISOString().split("T")[0];
      const isDuplicate = results.some(
        (result) => result.position.sign === getPlanetSign(split_deg.sign),
      );

      if (!isDuplicate) {
        results.push({
          date: dateStr,
          position: {
            sign: getPlanetSign(split_deg.sign),
            degree: split_deg.degree,
            minute: split_deg.minute,
          },
          exactMatch: true,
        });
      }
    }

    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return {
    planet,
    targetPosition: {
      sign: position.sign,
      degree: position.degree,
      minute: position.minute,
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
  position: Position,
): MajorTransits => {
  const modality = getPlanetModality(natalPlanet);

  const oppositionSign =
    sharedConstants.ASPECTS_MAP[
      position.sign as keyof typeof sharedConstants.ASPECTS_MAP
    ].opposition;
  const superiorSqaureSign =
    sharedConstants.ASPECTS_MAP[
      position.sign as keyof typeof sharedConstants.ASPECTS_MAP
    ].superiorSquare;
  const inferiorSquareSign =
    sharedConstants.ASPECTS_MAP[
      position.sign as keyof typeof sharedConstants.ASPECTS_MAP
    ].inferiorSquare;
  const superiorTrineSign =
    sharedConstants.ASPECTS_MAP[
      position.sign as keyof typeof sharedConstants.ASPECTS_MAP
    ].superiorTrine;
  const inferiorTrineSign =
    sharedConstants.ASPECTS_MAP[
      position.sign as keyof typeof sharedConstants.ASPECTS_MAP
    ].inferiorTrine;
  const superiorSextileSign =
    sharedConstants.ASPECTS_MAP[
      position.sign as keyof typeof sharedConstants.ASPECTS_MAP
    ].superiorSextile;
  const inferiorSextileSign =
    sharedConstants.ASPECTS_MAP[
      position.sign as keyof typeof sharedConstants.ASPECTS_MAP
    ].inferiorSextile;

  const transitingPlanet = ["Jupiter", "Saturn", "Uranus", "Neptune", "Pluto"];

  const result: Transits[] = transitingPlanet.map((planet) => {
    const oppositionTransits = getPlanetaryIngressByDegree(planet, {
      sign: oppositionSign,
      degree: position.degree,
      minute: position.minute || 0,
    });
    const superiorSquareTransits = getPlanetaryIngressByDegree(planet, {
      sign: superiorSqaureSign,
      degree: position.degree,
      minute: position.minute || 0,
    });
    const inferiorSquareTransits = getPlanetaryIngressByDegree(planet, {
      sign: inferiorSquareSign,
      degree: position.degree,
      minute: position.minute || 0,
    });
    const superiorTrineTransits = getPlanetaryIngressByDegree(planet, {
      sign: superiorTrineSign,
      degree: position.degree,
      minute: position.minute || 0,
    });
    const inferiorTrineTransits = getPlanetaryIngressByDegree(planet, {
      sign: inferiorTrineSign,
      degree: position.degree,
      minute: position.minute || 0,
    });
    const superiorSextileTransits = getPlanetaryIngressByDegree(planet, {
      sign: superiorSextileSign,
      degree: position.degree,
      minute: position.minute || 0,
    });
    const inferiorSextileTransits = getPlanetaryIngressByDegree(planet, {
      sign: inferiorSextileSign,
      degree: position.degree,
      minute: position.minute || 0,
    });

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
      sign: position.sign,
      degree: position.degree,
      minute: position.minute || 0,
    },
    modality,
    transits: result,
  };
};

export const getLunations = (date?: Date): Lunation[] => {
  const startDate = date || new Date();
  // For each sign, we need to find the dates where the moon is conjunct the Sun, and when the moon is in opposition to the Sun
  let results = sharedConstants.SIGNS.map((sign) => {
    return [] as Array<Lunation>;
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
    if (t > 345 || t < 15) {
      const exactNewMoonDate = getExactLunationDate(currentDate, true);
      const exactSunPos = getSplitDegreeFromDate(
        exactNewMoonDate,
        sweph.constants.SE_SUN,
      );
      newMoons.push(exactNewMoonDate.toISOString().split("T")[0]);
      results[exactSunPos.sign].push({
        date: exactNewMoonDate.toISOString().split("T")[0],
        lunationType: "new moon",
        position: {
          sign: getPlanetSign(exactSunPos.sign),
          degree: exactSunPos.degree,
          minute: exactSunPos.minute,
        },
      });
    }

    // Check for Full Moon (opposition)
    if (t > 170 && t < 190) {
      const exactFullMoonDate = getExactLunationDate(currentDate, false);
      fullMoons.push(exactFullMoonDate.toISOString().split("T")[0]);
      const exactSunPos = getSplitDegreeFromDate(
        exactFullMoonDate,
        sweph.constants.SE_SUN,
      );
      // push to full moons of opposite sign
      const oppositeSignIndex = (exactSunPos.sign + 6) % 12;
      results[oppositeSignIndex].push({
        date: exactFullMoonDate.toISOString().split("T")[0],
        lunationType: "full moon",
        position: {
          sign: getPlanetSign(oppositeSignIndex),
          degree: exactSunPos.degree,
          minute: exactSunPos.minute,
        },
      });
    }
    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  const uniqueLunations = results
    .flatMap((lunations: Lunation[]) => lunations)
    .filter((lunation: Lunation, index: number, self: any) => {
      return (
        index ===
        self.findIndex(
          (l: Lunation) =>
            l.date === lunation.date &&
            l.lunationType === lunation.lunationType,
        )
      );
    })
    // filter out lunation after the end date
    .filter((lunation: Lunation) => {
      return new Date(lunation.date) <= endDate;
    })
    .sort((a: Lunation, b: Lunation) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

  return uniqueLunations;
};

export const getLunarEclipses = (date: Date): Eclipse[] => {
  //Get lunar eclipses within a year from the given date
  const eclipses: Array<string> = [];
  const eclipsesData: Array<Eclipse> = [];
  const startDate = new Date(date);
  const endDate = new Date(startDate);
  endDate.setFullYear(startDate.getFullYear() + 1);

  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const lunarEclipse = sweph.lun_eclipse_when(
      getJulianDayFromDate(currentDate).data[0],
      sweph.constants.SEFLG_SWIEPH,
      0,
      false,
    );

    if (lunarEclipse.data.length > 0) {
      lunarEclipse.data.forEach((jd) => {
        const utcDate = sweph.jdut1_to_utc(jd, sweph.constants.SE_GREG_CAL);
        const dateObj = new Date(
          Date.UTC(
            utcDate.year,
            utcDate.month - 1,
            utcDate.day,
            utcDate.hour,
            utcDate.minute,
            utcDate.second,
          ),
        );
        const eclipseDateStr = dateObj.toISOString().split("T")[0];

        if (
          dateObj.toISOString() <= endDate.toISOString() &&
          !eclipses.includes(eclipseDateStr) &&
          !eclipseDateStr.startsWith("-")
        ) {
          const splitDeg = getSplitDegreeFromDate(
            dateObj,
            sweph.constants.SE_MOON,
          );
          const sign = getPlanetSign(splitDeg.sign);
          const eclipse = {
            date: dateObj.toISOString(),
            position: {
              sign,
              degree: splitDeg.degree,
              minute: splitDeg.minute,
            },
            type: `${getEclipseType(lunarEclipse.data)} lunar eclipse`,
            modality: getPlanetModality(sign),
          };

          eclipses.push(eclipseDateStr);

          //make sure doubles of the same eclipse are not added, make sure that if degree is greater that the previous entry, but same sign, it is not included
          const existingEclipse = eclipsesData.find(
            (e) =>
              e.date.split("T")[0] === eclipseDateStr ||
              (e.position.sign === eclipse.position.sign &&
                e.type === eclipse.type),
          );

          if (!existingEclipse) {
            eclipsesData.push(eclipse);
          }
        }
      });
    }

    // Move to next month
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  return eclipsesData;
};

export const getSolarEclipses = (date: Date): Eclipse[] => {
  // Get 12 months of solar eclipses from the given date
  const eclipses: Array<string> = [];
  const eclipsesData: Array<Eclipse> = [];
  const startDate = new Date(date);
  const endDate = new Date(startDate);
  const eclipseTypes = [
    sweph.constants.SE_ECL_TOTAL,
    sweph.constants.SE_ECL_ANNULAR,
    sweph.constants.SE_ECL_PARTIAL,
  ];
  endDate.setFullYear(startDate.getFullYear() + 1);

  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    for (let eclipseType of eclipseTypes) {
      const solarEclipse = sweph.sol_eclipse_when_glob(
        getJulianDayFromDate(currentDate).data[0],
        sweph.constants.SEFLG_SWIEPH,
        eclipseType,
        // ignore error here
        false,
      );

      if (solarEclipse.data.length > 0) {
        const jd = solarEclipse.data[0];

        const utcDate = sweph.jdut1_to_utc(jd, sweph.constants.SE_GREG_CAL);
        const dateObj = new Date(
          Date.UTC(
            utcDate.year,
            utcDate.month - 1,
            utcDate.day,
            utcDate.hour,
            utcDate.minute,
            utcDate.second,
          ),
        );
        const eclipseDateStr = dateObj.toISOString().split("T")[0];

        if (
          dateObj.toISOString() <= endDate.toISOString() &&
          !eclipses.includes(eclipseDateStr) &&
          !eclipseDateStr.startsWith("-")
        ) {
          const splitDeg = getSplitDegreeFromDate(
            dateObj,
            sweph.constants.SE_SUN,
          );
          const sign = getPlanetSign(splitDeg.sign);

          const eclipseDetails = {
            date: dateObj.toISOString(),
            position: {
              sign,
              degree: splitDeg.degree,
              minute: splitDeg.minute,
            },
            type:
              eclipseType === sweph.constants.SE_ECL_TOTAL
                ? "total solar eclipse"
                : eclipseType === sweph.constants.SE_ECL_ANNULAR
                  ? "annular solar eclipse"
                  : "partial solar eclipse",
            modality: getPlanetModality(sign),
          };

          eclipses.push(eclipseDateStr);
          eclipsesData.push(eclipseDetails);
        }
      }
    }

    // Move to next month
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  return eclipsesData.sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });
};

export const getEclipses = (date: Date): Eclipse[] => {
  const lunarEclipses = getLunarEclipses(date);
  const solarEclipses = getSolarEclipses(date);

  const allEclipses = [...lunarEclipses, ...solarEclipses].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  return allEclipses;
};

export const getMercuryRetrogradePeriods = (date: Date): RetrogradePeriod[] => {
  // Get Mercury retrograde periods for 1 year from the given date
  const retrogradePeriods: Array<RetrogradePeriod> = [];
  const startDate = new Date(date);
  const endDate = new Date(startDate);
  endDate.setFullYear(startDate.getFullYear() + 1);

  let currentDate = new Date(startDate);
  let isRetrograde = false;
  let previousDate: Date | null = null;
  let previousLongitude: number | null = null;
  let currentPeriod: RetrogradePeriod | null = null;

  while (currentDate <= endDate) {
    const julday = getJulianDayFromDate(currentDate);
    const [jd_ut] = julday.data;

    const calc_ut = sweph.calc_ut(
      jd_ut,
      sweph.constants.SE_MERCURY,
      sweph.constants.SEFLG_SPEED,
    );

    const [longitude] = calc_ut.data;

    if (previousLongitude !== null) {
      // Check if current longitude is less than previous day's longitude
      // This indicates retrograde motion
      const isMovingBackward = longitude < previousLongitude;

      if (isMovingBackward && !isRetrograde) {
        // Mercury just went retrograde - start a new period
        isRetrograde = true;
        const splitDeg = sweph.split_deg(
          previousLongitude ? previousLongitude : longitude,
          sweph.constants.SE_SPLIT_DEG_ZODIACAL,
        );
        currentPeriod = {
          start: {
            date: previousDate
              ? previousDate.toISOString().split("T")[0]
              : currentDate.toISOString().split("T")[0],
            position: {
              degree: splitDeg.degree,
              minute: splitDeg.minute,
              sign: getPlanetSign(splitDeg.sign),
            },
          },
          end: { date: "", position: { degree: 0, minute: 0, sign: "" } },
        };
      } else if (!isMovingBackward && isRetrograde && currentPeriod) {
        // Mercury just went direct - end the current period
        isRetrograde = false;
        const splitDeg = sweph.split_deg(
          previousLongitude ? previousLongitude : longitude,
          sweph.constants.SE_SPLIT_DEG_ZODIACAL,
        );
        currentPeriod.end = {
          date: previousDate
            ? previousDate.toISOString().split("T")[0]
            : currentDate.toISOString().split("T")[0],
          position: {
            degree: splitDeg.degree,
            minute: splitDeg.minute,
            sign: getPlanetSign(splitDeg.sign),
          },
        };
        retrogradePeriods.push(currentPeriod);
        currentPeriod = null;
      }
    }

    previousLongitude = longitude;
    previousDate = new Date(currentDate);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // If still retrograde at the end, close the period with the last date
  if (isRetrograde && currentPeriod) {
    const julday = getJulianDayFromDate(endDate);
    const [jd_ut] = julday.data;
    const calc_ut = sweph.calc_ut(
      jd_ut,
      sweph.constants.SE_MERCURY,
      sweph.constants.SEFLG_SPEED,
    );
    const [longitude] = calc_ut.data;
    const splitDeg = sweph.split_deg(
      longitude,
      sweph.constants.SE_SPLIT_DEG_ZODIACAL,
    );
    currentPeriod.end = {
      date: endDate.toISOString().split("T")[0],
      position: {
        degree: splitDeg.degree,
        minute: splitDeg.minute,
        sign: getPlanetSign(splitDeg.sign),
      },
    };
    retrogradePeriods.push(currentPeriod);
  }

  // Filter out periods where the start date and end date are less than 15 days apart
  const filteredRetrogradePeriods = retrogradePeriods.filter((period) => {
    const start = new Date(period.start.date);
    const end = new Date(period.end.date);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 15;
  });

  return filteredRetrogradePeriods;
};

export const getAllPlanetZeroDegreeIngresses = () => {
  const planets = [
    "Venus",
    "Mars",
    "Jupiter",
    "Saturn",
    "Uranus",
    "Neptune",
    "Pluto",
  ];

  return planets.map((planet) => {
    const ingresses = sharedConstants.SIGNS.map((sign) => {
      return getPlanetaryIngressByDegree(planet, {
        sign,
        degree: 0,
        minute: 0,
      });
    });

    return {
      planet,
      ingresses: ingresses.filter((ingress) => ingress.matchesFound > 0),
    };
  });
};
