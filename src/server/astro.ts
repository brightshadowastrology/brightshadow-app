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
  type PlanetaryIngressWithOrb,
  type IngressOrbWindow,
  type Transits,
  type MajorTransits,
  type TransitsWithOrb,
  type MajorTransitsWithOrb,
  type Eclipse,
  type RetrogradePeriod,
  type ProfectionYearData,
} from "@/shared/types";
import { getHouseFromSign } from "@/shared/lib/textHelpers";

export const getBirthChartData = (
  date: Date,
  longitude: number,
  latitude: number,
): PlanetPoint[] => {
  const julday = getJulianDayFromDate(date);
  const { placements } = getPlanetaryPositionsByDate(date);

  const houses = getHousePositions(julday.data[0], latitude, longitude);
  const houseDegrees = convertValuetoDegrees(houses.houses[0]);

  // Angles
  const ascendant = getAngle(houses, houseDegrees.sign, "Ascendant", 0);
  const descendant = getAngle(houses, houseDegrees.sign, "Descendant", 6);
  const midheaven = getAngle(houses, houseDegrees.sign, "Midheaven", 9);
  const ic = getAngle(houses, houseDegrees.sign, "IC", 3);

  const result: PlanetPoint[] = placements.map((placement) => {
    const house = getPlanetHouse(placement.position.sign, houseDegrees.sign);
    const signsRuledByPlanet = sharedConstants.RULERSHIPS[placement.planet];
    let housesRuledByPlanet: number[] = [];
    if (signsRuledByPlanet) {
      housesRuledByPlanet = signsRuledByPlanet.map((sign) => {
        return getHouseFromSign(ascendant.position.sign || "Aries", sign);
      });
    }
    return {
      ...placement,
      house,
      rulerOf: housesRuledByPlanet || [],
    };
  });

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
  date?: Date,
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

  const startDate = date || new Date();
  const endDate = new Date();
  endDate.setFullYear(startDate.getFullYear() + 1);

  // Target longitude in absolute degrees (0-360)
  const targetLon = signIndex * 30 + position.degree + position.minute / 60;

  // Planet longitude at a given Julian day
  const getLon = (jd: number): number =>
    sweph.calc_ut(jd, bodyNumber, sweph.constants.SEFLG_SPEED).data[0];

  // Signed angular difference from target, normalized to [-180, 180]
  const diff = (jd: number): number =>
    ((getLon(jd) - targetLon + 540) % 360) - 180;

  // Date to Julian day (midnight UTC)
  const toJd = (d: Date): number =>
    sweph.utc_to_jd(
      d.getUTCFullYear(),
      d.getUTCMonth() + 1,
      d.getUTCDate(),
      0,
      0,
      0,
      sweph.constants.SE_GREG_CAL,
    ).data[0];

  // Julian day to YYYY-MM-DD string
  const jdToDateStr = (jd: number): string => {
    const utc = sweph.jdut1_to_utc(jd, sweph.constants.SE_GREG_CAL);
    return new Date(
      Date.UTC(
        utc.year,
        utc.month - 1,
        utc.day,
        utc.hour,
        utc.minute,
        utc.second,
      ),
    )
      .toISOString()
      .split("T")[0];
  };

  // Bisect an interval to find the JD where diff crosses zero
  const bisect = (lo: number, hi: number): number => {
    let loDiff = diff(lo);
    for (let i = 0; i < 30; i++) {
      const mid = (lo + hi) / 2;
      const midDiff = diff(mid);
      if (loDiff * midDiff <= 0) {
        hi = mid;
      } else {
        lo = mid;
        loDiff = midDiff;
      }
    }
    return (lo + hi) / 2;
  };

  // Scan in half-day steps (catches fast movers like Venus)
  const startJd = toJd(startDate);
  const endJd = toJd(endDate);
  const step = 0.5;

  let prevJd = startJd;
  let prevDiff = diff(startJd);

  for (let jd = startJd + step; jd <= endJd; jd += step) {
    const curDiff = diff(jd);

    // Zero crossing detected (sign change), filter out 360° wrap artifacts
    if (prevDiff * curDiff <= 0 && Math.abs(prevDiff - curDiff) < 180) {
      const foundJd = bisect(prevJd, jd);

      results.push({
        date: jdToDateStr(foundJd),
        position: {
          sign: position.sign,
          degree: position.degree,
          minute: position.minute,
        },
        exactMatch: true,
      });
    }

    prevJd = jd;
    prevDiff = curDiff;
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

export const getPlanetaryIngressWithOrb = (
  planet: string,
  position: Position,
  orb: number,
  date?: Date,
): PlanetaryIngressWithOrb => {
  const exact = getPlanetaryIngressByDegree(planet, position, date);
  const bodyNumber = constants.PLANET_MAP[planet];
  const signIndex = sharedConstants.SIGNS.indexOf(position.sign);
  const targetLon = signIndex * 30 + position.degree + position.minute / 60;

  const getLon = (jd: number): number =>
    sweph.calc_ut(jd, bodyNumber, sweph.constants.SEFLG_SPEED).data[0];

  const diffFrom = (jd: number, target: number): number =>
    ((getLon(jd) - target + 540) % 360) - 180;

  const toJd = (d: Date): number =>
    sweph.utc_to_jd(
      d.getUTCFullYear(),
      d.getUTCMonth() + 1,
      d.getUTCDate(),
      0,
      0,
      0,
      sweph.constants.SE_GREG_CAL,
    ).data[0];

  const jdToDateStr = (jd: number): string => {
    const utc = sweph.jdut1_to_utc(jd, sweph.constants.SE_GREG_CAL);
    return new Date(
      Date.UTC(
        utc.year,
        utc.month - 1,
        utc.day,
        utc.hour,
        utc.minute,
        utc.second,
      ),
    )
      .toISOString()
      .split("T")[0];
  };

  const bisect = (lo: number, hi: number, target: number): number => {
    let loDiff = diffFrom(lo, target);
    for (let i = 0; i < 30; i++) {
      const mid = (lo + hi) / 2;
      const midDiff = diffFrom(mid, target);
      if (loDiff * midDiff <= 0) {
        hi = mid;
      } else {
        lo = mid;
        loDiff = midDiff;
      }
    }
    return (lo + hi) / 2;
  };

  // Recover a precise JD from the date string (which is day-resolution only)
  const refineExactJd = (dateStr: string): number => {
    const roughJd = toJd(new Date(dateStr + "T00:00:00Z"));
    let prevJd = roughJd - 1.5;
    let prevDiff = diffFrom(prevJd, targetLon);
    for (let jd = prevJd + 0.25; jd <= roughJd + 1.5; jd += 0.25) {
      const curDiff = diffFrom(jd, targetLon);
      if (prevDiff * curDiff <= 0 && Math.abs(prevDiff - curDiff) < 180) {
        return bisect(prevJd, jd, targetLon);
      }
      prevJd = jd;
      prevDiff = curDiff;
    }
    return roughJd;
  };

  const step = 0.5;
  const searchDays = 90;

  const windows: IngressOrbWindow[] = exact.dates.map((match) => {
    const exactJd = refineExactJd(match.date);

    const speed = sweph.calc_ut(
      exactJd,
      bodyNumber,
      sweph.constants.SEFLG_SPEED,
    ).data[3];
    const isDirect = speed >= 0;

    // For direct motion:  applying = targetLon - orb, separating = targetLon + orb
    // For retrograde:     applying = targetLon + orb, separating = targetLon - orb
    const applyingTarget = isDirect ? targetLon - orb : targetLon + orb;
    const separatingTarget = isDirect ? targetLon + orb : targetLon - orb;

    let applyingDate: string | null = null;
    {
      let prevJd = exactJd;
      let prevDiff = diffFrom(exactJd, applyingTarget);
      for (let jd = exactJd - step; jd >= exactJd - searchDays; jd -= step) {
        const curDiff = diffFrom(jd, applyingTarget);
        if (prevDiff * curDiff <= 0 && Math.abs(prevDiff - curDiff) < 180) {
          applyingDate = jdToDateStr(bisect(jd, prevJd, applyingTarget));
          break;
        }
        prevJd = jd;
        prevDiff = curDiff;
      }
    }

    let separatingDate: string | null = null;
    {
      let prevJd = exactJd;
      let prevDiff = diffFrom(exactJd, separatingTarget);
      for (let jd = exactJd + step; jd <= exactJd + searchDays; jd += step) {
        const curDiff = diffFrom(jd, separatingTarget);
        if (prevDiff * curDiff <= 0 && Math.abs(prevDiff - curDiff) < 180) {
          separatingDate = jdToDateStr(bisect(prevJd, jd, separatingTarget));
          break;
        }
        prevJd = jd;
        prevDiff = curDiff;
      }
    }

    return {
      applyingDate,
      exactDate: match.date,
      separatingDate,
      position: match.position,
    };
  });

  return {
    planet,
    targetPosition: position,
    orb,
    searchPeriod: exact.searchPeriod,
    matchesFound: exact.matchesFound,
    windows,
  };
};

export const getMajorTransitsForAPlanet = (
  natalPlanet: string,
  position: Position,
  date?: Date,
): MajorTransits => {
  const modality = getPlanetModality(natalPlanet);

  const conjunctSign =
    sharedConstants.ASPECTS_MAP[
      position.sign as keyof typeof sharedConstants.ASPECTS_MAP
    ].conjunct;
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
    const conjunctTransits = getPlanetaryIngressByDegree(
      planet,
      {
        sign: conjunctSign,
        degree: position.degree,
        minute: position.minute || 0,
      },
      date,
    );
    const oppositionTransits = getPlanetaryIngressByDegree(
      planet,
      {
        sign: oppositionSign,
        degree: position.degree,
        minute: position.minute || 0,
      },
      date,
    );
    const superiorSquareTransits = getPlanetaryIngressByDegree(
      planet,
      {
        sign: superiorSqaureSign,
        degree: position.degree,
        minute: position.minute || 0,
      },
      date,
    );
    const inferiorSquareTransits = getPlanetaryIngressByDegree(
      planet,
      {
        sign: inferiorSquareSign,
        degree: position.degree,
        minute: position.minute || 0,
      },
      date,
    );
    const superiorTrineTransits = getPlanetaryIngressByDegree(
      planet,
      {
        sign: superiorTrineSign,
        degree: position.degree,
        minute: position.minute || 0,
      },
      date,
    );
    const inferiorTrineTransits = getPlanetaryIngressByDegree(planet, {
      sign: inferiorTrineSign,
      degree: position.degree,
      minute: position.minute || 0,
    });
    const superiorSextileTransits = getPlanetaryIngressByDegree(
      planet,
      {
        sign: superiorSextileSign,
        degree: position.degree,
        minute: position.minute || 0,
      },
      date,
    );
    const inferiorSextileTransits = getPlanetaryIngressByDegree(
      planet,
      {
        sign: inferiorSextileSign,
        degree: position.degree,
        minute: position.minute || 0,
      },
      date,
    );

    return {
      planet,
      conjunct: conjunctTransits.matchesFound > 0 ? conjunctTransits : null,
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

export const getMajorTransitsForAPlanetWithOrb = (
  natalPlanet: string,
  position: Position,
  orb: number,
  date?: Date,
): MajorTransitsWithOrb => {
  const modality = getPlanetModality(natalPlanet);

  const aspectMap =
    sharedConstants.ASPECTS_MAP[
      position.sign as keyof typeof sharedConstants.ASPECTS_MAP
    ];

  const transitingPlanets = ["Jupiter", "Saturn", "Uranus", "Neptune", "Pluto"];

  const result: TransitsWithOrb[] = transitingPlanets.map((planet) => {
    const pos = (sign: string) => ({
      sign,
      degree: position.degree,
      minute: position.minute || 0,
    });

    const conjunct = getPlanetaryIngressWithOrb(
      planet,
      pos(aspectMap.conjunct),
      orb,
      date,
    );
    const opposition = getPlanetaryIngressWithOrb(
      planet,
      pos(aspectMap.opposition),
      orb,
      date,
    );
    const superiorSquare = getPlanetaryIngressWithOrb(
      planet,
      pos(aspectMap.superiorSquare),
      orb,
      date,
    );
    const inferiorSquare = getPlanetaryIngressWithOrb(
      planet,
      pos(aspectMap.inferiorSquare),
      orb,
      date,
    );
    const superiorTrine = getPlanetaryIngressWithOrb(
      planet,
      pos(aspectMap.superiorTrine),
      orb,
      date,
    );
    const inferiorTrine = getPlanetaryIngressWithOrb(
      planet,
      pos(aspectMap.inferiorTrine),
      orb,
      date,
    );
    const superiorSextile = getPlanetaryIngressWithOrb(
      planet,
      pos(aspectMap.superiorSextile),
      orb,
      date,
    );
    const inferiorSextile = getPlanetaryIngressWithOrb(
      planet,
      pos(aspectMap.inferiorSextile),
      orb,
      date,
    );

    return {
      planet,
      conjunct: conjunct.matchesFound > 0 ? conjunct : null,
      opposition: opposition.matchesFound > 0 ? opposition : null,
      superiorSquare: superiorSquare.matchesFound > 0 ? superiorSquare : null,
      inferiorSquare: inferiorSquare.matchesFound > 0 ? inferiorSquare : null,
      superiorTrine: superiorTrine.matchesFound > 0 ? superiorTrine : null,
      inferiorTrine: inferiorTrine.matchesFound > 0 ? inferiorTrine : null,
      superiorSextile:
        superiorSextile.matchesFound > 0 ? superiorSextile : null,
      inferiorSextile:
        inferiorSextile.matchesFound > 0 ? inferiorSextile : null,
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
  const results = sharedConstants.SIGNS.map((sign) => {
    return [] as Array<Lunation>;
  });
  // Start from current date, calculate for one year from current date
  const endDate = new Date(startDate);
  endDate.setFullYear(startDate.getFullYear() + 1);

  const newMoons: Array<string> = [];
  const fullMoons: Array<string> = [];

  // Search day by day
  const currentDate = new Date(startDate);

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
    .filter((lunation: Lunation, index: number, self) => {
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

  const currentDate = new Date(startDate);

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

  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    for (const eclipseType of eclipseTypes) {
      const solarEclipse = sweph.sol_eclipse_when_glob(
        getJulianDayFromDate(currentDate).data[0],
        sweph.constants.SEFLG_SWIEPH,
        eclipseType,
        // @ts-expect-error - sweph types incorrectly declare `backwards` as number; false is correct
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

export const getRetrogradePeriods = (
  date: Date,
  planet: number,
): RetrogradePeriod[] => {
  const retrogradePeriods: Array<RetrogradePeriod> = [];
  const startDate = new Date(date);
  const endDate = new Date(startDate);
  endDate.setFullYear(startDate.getFullYear() + 1);

  const currentDate = new Date(startDate);
  let isRetrograde = false;
  let previousDate: Date | null = null;
  let previousLongitude: number | null = null;
  let currentPeriod: RetrogradePeriod | null = null;

  while (currentDate <= endDate) {
    const julday = getJulianDayFromDate(currentDate);
    const [jd_ut] = julday.data;

    const calc_ut = sweph.calc_ut(jd_ut, planet, sweph.constants.SEFLG_SPEED);

    const [longitude] = calc_ut.data;

    if (previousLongitude !== null) {
      const isMovingBackward = longitude < previousLongitude;

      if (isMovingBackward && !isRetrograde) {
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
    const calc_ut = sweph.calc_ut(jd_ut, planet, sweph.constants.SEFLG_SPEED);
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

export const getMercuryRetrogradePeriods = (date: Date): RetrogradePeriod[] =>
  getRetrogradePeriods(date, sweph.constants.SE_MERCURY);

export const getVenusRetrogradePeriods = (date: Date): RetrogradePeriod[] =>
  getRetrogradePeriods(date, sweph.constants.SE_VENUS);

export const getMarsRetrogradePeriods = (date: Date): RetrogradePeriod[] =>
  getRetrogradePeriods(date, sweph.constants.SE_MARS);

export const getAllPlanetZeroDegreeIngresses = (date: Date) => {
  const planets = [
    "Sun",
    "Mercury",
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
      return getPlanetaryIngressByDegree(
        planet,
        {
          sign,
          degree: 0,
          minute: 0,
        },
        date,
      );
    });

    return {
      planet,
      ingresses: ingresses.filter((ingress) => ingress.matchesFound > 0),
    };
  });
};

export const getMajorTransitsAllPlanets = (
  natalPlacements: PlanetPoint[],
  date: Date,
) => {
  const traditionalPlanets = [
    "Ascendant",
    "Midheaven",
    "Sun",
    "Moon",
    "Mercury",
    "Venus",
    "Mars",
    "Jupiter",
    "Saturn",
  ];
  // Get only traditional planets
  const traditionalPlacements = natalPlacements.filter((placement) =>
    traditionalPlanets.includes(placement.planet),
  );

  return traditionalPlacements.map((placement) => {
    return getMajorTransitsForAPlanet(
      placement.planet,
      placement.position,
      date,
    );
  });
};

export const getMajorTransitsAllPlanetsWithOrb = (
  natalPlacements: PlanetPoint[],
  orb: number,
  date: Date,
) => {
  const traditionalPlanets = [
    "Ascendant",
    "Midheaven",
    "Sun",
    "Moon",
    "Mercury",
    "Venus",
    "Mars",
    "Jupiter",
    "Saturn",
  ];
  const traditionalPlacements = natalPlacements.filter((placement) =>
    traditionalPlanets.includes(placement.planet),
  );

  return traditionalPlacements.map((placement) =>
    getMajorTransitsForAPlanetWithOrb(
      placement.planet,
      placement.position,
      orb,
      date,
    ),
  );
};
