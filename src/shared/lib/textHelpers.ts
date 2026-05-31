import * as constants from "@/shared/lib/constants";
import { houseDescriptions, houseTopics } from "@/shared/text/text";
import {
  jupiterTransitInterpretations,
  marsTransitInterpretations,
  neptuneTransitInterpretations,
  plutoTransitInterpretations,
  saturnTransitInterpretations,
  uranusTransitInterpretations,
  venusTransitInterpretations,
} from "@/shared/text/transitInterpretations";
import {
  venusIngressInterpretations,
  marsIngressInterpretations,
  jupiterIngressInterpretations,
  saturnIngressInterpretations,
  uranusIngressInterpretations,
  neptuneIngressInterpretations,
  plutoIngressInterpretations,
} from "@/shared/text/ingressInterpretations";
import {
  firstHouseRulershipInterpretations,
  secondHouseRulershipInterpretations,
  thirdHouseRulershipInterpretations,
  fourthHouseRulershipInterpretations,
  fifthHouseRulershipInterpretations,
  sixthHouseRulershipInterpretations,
  seventhHouseRulershipInterpretations,
  eighthHouseRulershipInterpretations,
  ninthHouseRulershipInterpretations,
  tenthHouseRulershipInterpretations,
  eleventhHouseRulershipInterpretations,
  twelfthHouseRulershipInterpretations,
} from "@/shared/text/houseRulershipInterpretations";
import { ASPECT_LABELS } from "@/shared/lib/constants";
import {
  type PlanetPoint,
  type TransitInterpretations,
  type IngressInterpretations,
  TransitEntry,
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

export const getFormattedPlanetText = (planetName: string) => {
  return planetName === "Sun" || planetName === "Moon"
    ? `The ${planetName}`
    : planetName;
};

export const getFormattedHouseText = (house: number) => {
  return `${getOrdinal(house)} house`;
};

export const getFormattedHouseRulersText = (housesRuledByPlanet: number[]) => {
  const housesFormatted = housesRuledByPlanet.map((house) => {
    return getOrdinal(house);
  });
  return `${housesFormatted.join(", ").replace(/, ([^,]*)$/, ", and $1")} ${housesRuledByPlanet.length === 1 ? "house" : "houses"}`;
};

export const getFormattedHouseDescriptionText = (
  housesRuledByPlanet: number[],
) => {
  return housesRuledByPlanet
    .map((house) => {
      return houseDescriptions[house];
    })
    .join(", as well as your ");
};

export const getFormattedHouseTopicsText = (house: number) => {
  return houseTopics[house].join(", ").replace(/, ([^,]*)$/, ", and $1");
};

export const getFormattedAspectText = (
  aspects: TransitEntry[],
  transitText?: string,
) => {
  const text = aspects.map((aspect) => {
    const formattedAspect = ASPECT_LABELS[aspect.aspect] || aspect.aspect;
    const a =
      formattedAspect === "conjunct"
        ? ""
        : formattedAspect === "opposition"
          ? "an"
          : "a";

    return `${a} ${formattedAspect} to your natal ${aspect.natalPlanet}`;
  });

  return `This ${transitText || "transit"} is in ${text.join(", ").replace(/, ([^,]*)$/, ", and $1")}.`;
};

export const getFormattedTransitText = (
  transitingPlanet: string,
  natalPlanet: PlanetPoint,
  aspectLabel: string,
) => {
  let transitTextCollection: TransitInterpretations = {};
  const aspect =
    aspectLabel === "conjunct"
      ? "conjunct"
      : aspectLabel === "square" || aspectLabel === "opposition"
        ? "squareOrOpposition"
        : "trineOrSextile";

  switch (transitingPlanet) {
    case "Venus":
      transitTextCollection = venusTransitInterpretations;
      break;
    case "Mars":
      transitTextCollection = marsTransitInterpretations;
      break;
    case "Jupiter":
      transitTextCollection = jupiterTransitInterpretations;
      break;
    case "Saturn":
      transitTextCollection = saturnTransitInterpretations;
      break;
    case "Uranus":
      transitTextCollection = uranusTransitInterpretations;
      break;
    case "Neptune":
      transitTextCollection = neptuneTransitInterpretations;
      break;
    case "Pluto":
      transitTextCollection = plutoTransitInterpretations;
      break;
    default:
      console.log("Not found");
  }

  return natalPlanet.rulerOf
    ?.map((house) => {
      return (
        transitTextCollection?.[natalPlanet.planet]?.[aspect]?.[house] || ""
      );
    })
    .join(" ");
};

export const getGeneralSignificationsText = (
  transitingPlanet: string,
  natalPlanet: PlanetPoint,
  aspectLabel: string,
) => {
  let transitTextCollection: TransitInterpretations = {};
  const aspect =
    aspectLabel === "conjunct"
      ? "conjunct"
      : aspectLabel === "square" || aspectLabel === "opposition"
        ? "squareOrOpposition"
        : "trineOrSextile";

  switch (transitingPlanet) {
    case "Venus":
      transitTextCollection = venusTransitInterpretations;
      break;
    case "Mars":
      transitTextCollection = marsTransitInterpretations;
      break;
    case "Jupiter":
      transitTextCollection = jupiterTransitInterpretations;
      break;
    case "Saturn":
      transitTextCollection = saturnTransitInterpretations;
      break;
    case "Uranus":
      transitTextCollection = uranusTransitInterpretations;
      break;
    case "Neptune":
      transitTextCollection = neptuneTransitInterpretations;
      break;
    case "Pluto":
      transitTextCollection = plutoTransitInterpretations;
      break;
    default:
      console.log("Not found");
  }

  return transitTextCollection?.[natalPlanet.planet]?.[aspect]?.[0] || "";
};

export const getIngressInterpretation = (
  transitingPlanet: string,
  house: string,
) => {
  let ingressTextCollection: IngressInterpretations = {};

  switch (transitingPlanet) {
    case "Venus":
      ingressTextCollection = venusIngressInterpretations;
      break;
    case "Mars":
      ingressTextCollection = marsIngressInterpretations;
      break;
    case "Jupiter":
      ingressTextCollection = jupiterIngressInterpretations;
      break;
    case "Saturn":
      ingressTextCollection = saturnIngressInterpretations;
      break;
    case "Uranus":
      ingressTextCollection = uranusIngressInterpretations;
      break;
    case "Neptune":
      ingressTextCollection = neptuneIngressInterpretations;
      break;
    case "Pluto":
      ingressTextCollection = plutoIngressInterpretations;
      break;
    default:
      console.log("Not found");
  }

  return ingressTextCollection?.[house] || "";
};

export const getPlanetRulerText = (house: number, rulerHouse: number) => {
  let textCollection: { [key: number]: string } = {};

  switch (house) {
    case 1:
      textCollection = firstHouseRulershipInterpretations;
      break;
    case 2:
      textCollection = secondHouseRulershipInterpretations;
      break;
    case 3:
      textCollection = thirdHouseRulershipInterpretations;
      break;
    case 4:
      textCollection = fourthHouseRulershipInterpretations;
      break;
    case 5:
      textCollection = fifthHouseRulershipInterpretations;
      break;
    case 6:
      textCollection = sixthHouseRulershipInterpretations;
      break;
    case 7:
      textCollection = seventhHouseRulershipInterpretations;
      break;
    case 8:
      textCollection = eighthHouseRulershipInterpretations;
      break;
    case 9:
      textCollection = ninthHouseRulershipInterpretations;
      break;
    case 10:
      textCollection = tenthHouseRulershipInterpretations;
      break;
    case 11:
      textCollection = eleventhHouseRulershipInterpretations;
      break;
    case 12:
      textCollection = twelfthHouseRulershipInterpretations;
      break;
    default:
      console.log("Not found");
  }

  console.log("text collection", textCollection, "ruler house", rulerHouse);

  return textCollection?.[rulerHouse] || "";
};
