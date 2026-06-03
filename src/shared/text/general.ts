import * as constants from "@/shared/lib/constants";
import {
  getHouseFromSign,
  getOrdinal,
  randomArrayIndex,
} from "@/shared/lib/textHelpers";
import { ASPECT_LABELS } from "@/shared/lib/constants";
import {
  eighthHouseRulershipInterpretations,
  eleventhHouseRulershipInterpretations,
  fifthHouseRulershipInterpretations,
  firstHouseRulershipInterpretations,
  fourthHouseRulershipInterpretations,
  ninthHouseRulershipInterpretations,
  secondHouseRulershipInterpretations,
  seventhHouseRulershipInterpretations,
  sixthHouseRulershipInterpretations,
  tenthHouseRulershipInterpretations,
  thirdHouseRulershipInterpretations,
  twelfthHouseRulershipInterpretations,
} from "@/shared/text/houseRulershipInterpretations";
import {
  jupiterIngressInterpretations,
  marsIngressInterpretations,
  mercuryIngressInterpretations,
  neptuneIngressInterpretations,
  plutoIngressInterpretations,
  saturnIngressInterpretations,
  sunIngressInterpretations,
  uranusIngressInterpretations,
  venusIngressInterpretations,
} from "@/shared/text/ingressInterpretations";
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
  SectInterpretations,
  type IngressInterpretations,
  type PlanetPoint,
  type TransitEntry,
  type TransitInterpretations,
} from "@/shared/types";

export const planetDescriptions: Record<
  string,
  { tagline: string; verbs?: string[] }
> = {
  Sun: {
    tagline: "Your core identity and life purpose",
    verbs: ["shine", "radiate", "express yourself", "embody"],
  },
  Moon: {
    tagline: "Your emotional nature and inner self",
    verbs: ["feel", "nurture", "intuit", "require nourishment"],
  },
  Mercury: {
    tagline: "Your communication style and thinking",
    verbs: ["communicate", "think", "process information"],
  },
  Venus: {
    tagline: "Your approach to love, beauty, and values",
    verbs: ["love", "appreciate beauty", "value relationships"],
  },
  Mars: {
    tagline: "Your drive, ambition, and how you take action",
    verbs: ["act", "assert", "pursue desires", "compete"],
  },
  Jupiter: { tagline: "Your growth, luck, and expansion", verbs: ["grow"] },
  Saturn: {
    tagline: "Your discipline, challenges, and life lessons",
    verbs: ["learn", "gain discipline", "practice restraint"],
  },
  Uranus: {
    tagline: "Your individuality and where you break conventions",
    verbs: ["break rules", "innovate", "rebel against the status quo"],
  },
  Neptune: {
    tagline: "Your dreams, intuition, and spiritual nature",
    verbs: ["idealize", "get close to the divine", "transcend"],
  },
  Pluto: {
    tagline: "Your transformation and personal power",
    verbs: ["transform", "reclaim power", "release control"],
  },
  Ascendant: {
    tagline: "Your outward personality and first impressions",
    verbs: ["present", "project", "approach life"],
  },
  Descendant: {
    tagline: "Your approach to partnerships and relationships",
    verbs: ["connect", "empathize", "compromise"],
  },
  Midheaven: {
    tagline: "Your career path and public image",
    verbs: ["advance", "pursues goal", "build reputation"],
  },
  IC: {
    tagline: "Your roots, home, and private life",
    verbs: ["ground", "establish roots", "nurture your private self"],
  },
};

export const houseDescriptions: Record<number, string> = {
  1: "life direction and sense of self",
  2: "personal resources",
  3: "communication",
  4: "emotional foundations",
  5: "creativity",
  6: "work",
  7: "relationships",
  8: "shared resources",
  9: "beliefs and higher education",
  10: "career",
  11: "friendships",
  12: "solitude and spirituality",
};

export const signDescriptions: Record<string, string[]> = {
  Aries: ["assertive", "energetic", "pioneering"],
  Taurus: ["practical", "sensual", "reliable"],
  Gemini: ["curious", "adaptable", "communicative"],
  Cancer: ["nurturing", "emotional", "protective"],
  Leo: ["confident", "creative", "charismatic"],
  Virgo: ["analytical", "detail-oriented", "service-minded"],
  Libra: ["diplomatic", "charming", "relationship-focused"],
  Scorpio: ["intense", "passionate", "transformative"],
  Sagittarius: ["adventurous", "optimistic", "philosophical"],
  Capricorn: ["disciplined", "ambitious", "responsible"],
  Aquarius: ["innovative", "independent", "humanitarian"],
  Pisces: ["compassionate", "intuitive", "dreamy"],
};

export const houseTopics: { [key: number]: string[] } = {
  1: ["self-presentation", "body", "identity", "life direction"],
  2: ["earned income", "assets", "personal values", "self esteem"],
  3: ["learning", "local travel", "siblings"],
  4: ["home", "family", "ancestry", "property"],
  5: ["creativity", "children", "fun", "romance", "pleasure"],
  6: ["health", "work", "daily habits", "pets", "coworkers"],
  7: ["important one-to-one relationships", "partnerships", "contracts"],
  8: ["debt", "taxes", "shared resources", "subconscious material"],
  9: ["beliefs", "higher education", "travel", "legal matters"],
  10: ["career", "vocation", "public reputation", "authority"],
  11: [
    "friendships",
    "professional networks",
    "supporters",
    "community",
    "aspirations",
  ],
  12: [
    "solitude",
    "rest",
    "spirituality",
    "subconscious patterns",
    "hidden enemies",
  ],
};

export const lordDescriptions: Record<string, string> = {
  Mars: "This is a year to take bold action and pursue your goals with courage. Watch for conflicts but use your drive productively.",
  Venus:
    "This is a year to focus on relationships, creativity, and enjoying life's pleasures. A year for harmony and beauty.",
  Mercury:
    "This is a year for communication and learning to take center stage. Great for studies, writing, and making connections.",
  Moon: "This is a year for emotional growth and domestic matters to be highlighted. Trust your intuition and nurture yourself.",
  Sun: "This is a year to step into the spotlight and express your authentic self. A year for leadership and vitality.",
  Jupiter:
    "This is a year of expansion and opportunities. Say yes to growth, travel, and broadening your horizons.",
  Saturn:
    "This is a year of hard work and building foundations. Embrace discipline for lasting achievements.",
};

export const sectInterpretations: SectInterpretations = {
  Jupiter: {
    inSectBenefic: {
      easy: "As your benefic of sect, this is your most positive planet, and you can expect the transit to be particularly positive for you.",
      hard: "Given that Jupiter is your benefic of sect, this transit should leave you feeling very bouyant, but watch out for overindulgence.",
    },
    outOfSectBenefic: {
      easy: "As your benefic out of sect, this should be a fun transit, though its energies may be more of a background influence.",
      hard: "Given that Jupiter is your benefic out of sect, you may be slightly prone to going over board in the aforementioned areas of life at this time.",
    },
  },
  Venus: {
    inSectBenefic: {
      easy: "As your benefic of sect, this is your most positive planet, and you should expect the transit to be particularly positive for you.",
      hard: "Given that Venus is your benefic of sect, you might feel particularly well-resourced at this time, but watch out for superficiality.",
    },
    outOfSectBenefic: {
      easy: "As your benefic out of sect, Venus should make this a pleasant transit, though her energies may be more of a background influence.",
      hard: "Given that Venus is your benefic out of sect, you are somewhat more prone to vanity or superficiality in the aforementioned areas of life at this time.",
    },
  },
  Mars: {
    inSectMalefic: {
      easy: "Given that Mars is your malefic of sect, you might feel particularly invigorated and ready to tackle the issues at hand.",
      hard: "As your malefic of sect, Mars may bring frustrations at this time, but rest assured, these are surmountable challenges.",
    },
    outOfSectMalefic: {
      easy: "As your malefic out of sect, transits of Mars present a fair bit of challenge. For now, however, you will be experiencing greater vigor and a sharpening of your skills in this area of life.",
      hard: "As your malefic out of sect, this can be a challenging time for you in this area of life. You may experience conflicts or frustrations, so try to let cooler heads prevail.",
    },
  },
  Saturn: {
    inSectMalefic: {
      easy: "Given that Saturn is your malefic of sect, you might feel particularly serious and ready to tackle the issues at hand.",
      hard: "As your malefic of sect, Saturn may bring delays and difficulty at this time, but rest assured, these are surmountable challenges.",
    },
    outOfSectMalefic: {
      easy: "As your malefic out of sect, transits of Saturn present a fair bit of challenge. For now, however, you will be experiencing greater determination and gravitas around these issues.",
      hard: "As your malefic out of sect, this can feel like a time of scarcity in these aresas of life, and restraint and maturity are demanded of you.",
    },
  },
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

export const getIngressInterpretationText = (
  transitingPlanet: string,
  house: string,
) => {
  let ingressTextCollection: IngressInterpretations = {};

  switch (transitingPlanet) {
    case "Sun":
      ingressTextCollection = sunIngressInterpretations;
      break;
    case "Mercury":
      ingressTextCollection = mercuryIngressInterpretations;
      break;
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

  return textCollection?.[rulerHouse] || "";
};

export const positionInterpretationText = (
  placement: PlanetPoint,
  angles: PlanetPoint[],
): string => {
  const tagline = planetDescriptions[placement.planet]?.tagline || "";
  const sign = placement.position.sign;
  const signTraits =
    signDescriptions[sign]?.join(", ").replace(/, ([^,]*)$/, ", and $1") ||
    "expressing this quality";
  const house = `${getOrdinal(placement.house)} house`;
  const houseArea =
    houseDescriptions[placement.house] ||
    `${getOrdinal(placement.house)} house matters`;
  const planetVerbs = planetDescriptions[placement.planet].verbs || ["behave"];
  const randomPlanetVerb = planetVerbs[randomArrayIndex(planetVerbs.length)];

  const variants = [
    `${tagline} expresses through the ${sign} lens in the ${house}, meaning you are ${signTraits} in areas of life related to your ${houseArea}.`,
    `${tagline} manifests in the ${house} with ${sign} energy, making you ${signTraits} when it comes to your ${houseArea}.`,
    `With ${sign} influencing your ${house} ${placement.planet}, you ${randomPlanetVerb} your ${houseArea} by being ${signTraits}.`,
    `In the realm of the ${house}, ${tagline.toLowerCase()} takes on a ${sign} flavor—you tend to be ${signTraits} in how you ${randomPlanetVerb}, particularly in matters of your ${houseArea}.`,
    `Your ${sign} energy expresses through your ${house}, ${tagline.toLowerCase()} comes through bringing ${signTraits} qualities to your ${houseArea}.`,
  ];

  const rulership = rulershipInterpretationText(
    placement.planet,
    placement.house,
    angles,
  );

  const randomVariant = variants[randomArrayIndex(variants.length)];

  // append rulership interpretation to the end of the variant
  return `${randomVariant} ${rulership}`;
};

export const rulershipInterpretationText = (
  planetName: string,
  natalHouse: number,
  angles: PlanetPoint[],
): string => {
  const signsRuledByPlanet = constants.RULERSHIPS[planetName];
  if (!signsRuledByPlanet) return "";

  const housesRuledByPlanet = signsRuledByPlanet.map((sign) => {
    return getHouseFromSign(
      angles.find((a) => a.planet === "Ascendant")?.position.sign || "Aries",
      sign,
    );
  });

  const planetText =
    planetName === "Sun" || planetName === "Moon"
      ? `The ${planetName}`
      : planetName;
  const natalHouseFormatted = getOrdinal(natalHouse);
  const housesFormatted = housesRuledByPlanet.map((house) => {
    return getOrdinal(house);
  });
  const houseText = `${housesFormatted.join(", ").replace(/, ([^,]*)$/, " and $1")} ${housesRuledByPlanet.length === 1 ? "house" : "houses"}`;
  const natalHouseTopics = houseDescriptions[natalHouse];
  const houseTopics = housesRuledByPlanet
    .map((house) => {
      return houseDescriptions[house];
    })
    .join(", as well as ");

  const variants = [
    `${planetText} rules your ${houseText}, importing themes of ${houseTopics} into your ${natalHouseFormatted} house.`,
    `${planetText} rules your ${houseText}, colouring your experience of ${natalHouseTopics} with themes of ${houseTopics}.`,
    `As the ruler of your ${houseText}, ${planetText} influences how you handle ares of life related to your ${houseTopics}.`,
  ];

  return variants[randomArrayIndex(variants.length)];
};
