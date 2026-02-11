import * as constants from "@/shared/lib/constants";

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
  var splitStr = str.toLowerCase().split(" ");
  for (var i = 0; i < splitStr.length; i++) {
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
