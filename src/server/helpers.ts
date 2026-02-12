import sweph from "sweph";
import * as sharedConstants from "@/shared/lib/constants";
import { type PlanetPoint, type Position } from "@/shared/types";

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

export const getPlanetName = (ipl: number): string => {
  return sweph.get_planet_name(ipl);
};

export const getPlanetSign = (sign: number): string => {
  return sharedConstants.SIGNS[sign];
};

export const getPlanetModality = (sign: string): string => {
  for (const modality in sharedConstants.MODALITIES) {
    if (
      sharedConstants.MODALITIES[
        modality as keyof typeof sharedConstants.MODALITIES
      ].includes(sign)
    ) {
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

export const convertValuetoDegrees = (value: number): Position => {
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
): PlanetPoint => {
  return {
    planet: angleName,
    modality: getPlanetModality(sign),
    house: angleIndex + 1,
    position: {
      sign: convertValuetoDegrees(houseData.houses[angleIndex]).sign,
      degree: convertValuetoDegrees(houseData.houses[angleIndex]).degree,
      minute: convertValuetoDegrees(houseData.houses[angleIndex]).minute,
    },
    rulerOf: undefined,
  };
};

export const getPlanetHouse = (
  planetSign: string,
  ascendant: string,
): number => {
  const signOrder = [];
  const ascIndex = sharedConstants.SIGNS.indexOf(ascendant);
  for (let i = 0; i < 12; i++) {
    signOrder.push(sharedConstants.SIGNS[(ascIndex + i) % 12]);
  }

  const planetIndex = signOrder.indexOf(planetSign);
  return planetIndex + 1; // Houses are 1-indexed
};

export const getSplitDegreeFromDate = (
  date: Date,
  body: number,
): sweph.SplitDeg => {
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

// Helper to find the exact date time for new moons and full moons in the coming year, a date that is close enough, and increment the hours and minutes to find 0 degree conjunction
export const getExactLunationDate = (
  targetDate: Date,
  isNewMoon: boolean,
): Date => {
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

    // Calculate Moon position
    const moonCalc = sweph.calc_ut(
      jd_ut,
      sweph.constants.SE_MOON,
      sweph.constants.SEFLG_SPEED,
    );
    const [moonLongitude] = moonCalc.data;

    const angleDiff = sweph.difdegn(
      sweph.d2l(sunLongitude),
      sweph.d2l(moonLongitude),
    );

    if (isNewMoon) {
      // New Moon when angle difference is close to 0
      if (angleDiff < 0.1 || angleDiff > 359.9) {
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

export const getEclipseType = (lunarEclipseData: number[]): string => {
  // Determine if the lunar eclipse is a total, partial, or penumbral eclipse based on the data
  const eclipseMax = lunarEclipseData[0];
  const partialStart = lunarEclipseData[2];
  const partialEnd = lunarEclipseData[3];
  const totalStart = lunarEclipseData[4];
  const totalEnd = lunarEclipseData[5];
  const penumbralStart = lunarEclipseData[6];
  const penumbralEnd = lunarEclipseData[7];

  if (totalStart < eclipseMax && eclipseMax < totalEnd) {
    return "total";
  } else if (partialStart < eclipseMax && eclipseMax < partialEnd) {
    return "partial";
  } else if (penumbralStart < eclipseMax && eclipseMax < penumbralEnd) {
    return "penumbral";
  } else {
    return "none";
  }
};
