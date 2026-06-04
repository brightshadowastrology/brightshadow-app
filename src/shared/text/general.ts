import * as constants from "@/shared/lib/constants";
import { ASPECT_LABELS } from "@/shared/lib/constants";
import {
  getHouseFromSign,
  getOrdinal,
  randomArrayIndex,
  getPlanetDignity,
  isAngular,
  isGoodHouse,
  isBadHouse,
} from "@/shared/lib/textHelpers";
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
import {
  SIGN_RULERS,
  PLANET_DIGNITIES_DEBILITIES,
} from "@/shared/lib/constants";

export const planetDescriptions: Record<
  string,
  { tagline: string; verbs?: string[]; detailedDescription: string }
> = {
  Sun: {
    tagline: "Your core identity and life purpose",
    verbs: ["shine", "radiate", "express", "embody"],
    detailedDescription:
      "the part of you that shines brightest, that you most want to express and recognized for",
  },
  Moon: {
    tagline: "Your emotional nature and inner self",
    verbs: [
      "find security",
      "nurture",
      "nourish",
      "respond to emotional needs",
    ],
    detailedDescription:
      "the part of you that responds to emotional needsand provides security, comfort, and nurturing",
  },
  Mercury: {
    tagline: "Your communication style and thinking",
    verbs: ["communicate", "think", "learn"],
    detailedDescription:
      "the rational part of you, the part that communicates and and processes information",
  },
  Venus: {
    tagline: "Your approach to love, beauty, and values",
    verbs: ["love", "appreciate beauty", "value relationships"],
    detailedDescription:
      "the part of you that seeks harmony, pleasure, and meaningful connections",
  },
  Mars: {
    tagline: "Your drive, ambition, and how you take action",
    verbs: ["act", "assert", "compete"],
    detailedDescription:
      "the part of you that drives action, asserts your will, and pursues your desires",
  },
  Jupiter: {
    tagline: "Your growth, luck, and expansion",
    verbs: ["grow"],
    detailedDescription:
      "the part of you that seeks growth, expansion, and meaning, the part of you that is optimistic and open to new experiences",
  },
  Saturn: {
    tagline: "Your discipline, challenges, and life lessons",
    verbs: ["learn life lessons", "gain discipline", "practice restraint"],
    detailedDescription:
      "the part of you that faces challenges, learns important life lessons, and develops discipline and maturity through overcoming obstacles",
  },
  Uranus: {
    tagline: "Your individuality and where you break conventions",
    verbs: ["break rules", "innovate", "rebel against the status quo"],
    detailedDescription:
      "the part of you that values independence, originality, and change",
  },
  Neptune: {
    tagline: "Your dreams, intuition, and spiritual nature",
    verbs: ["idealize", "get close to the divine", "transcend"],
    detailedDescription:
      "the part of you that connects to the spiritual, the idealistic, and the transcendent, the part of you that dreams and imagines",
  },
  Pluto: {
    tagline: "Your transformation and personal power",
    verbs: ["transform", "reclaim power", "release control"],
    detailedDescription:
      "the part of you that undergoes deep transformation, that seeks to reclaim personal power, and that learns to release control and embrace change",
  },
  Ascendant: {
    tagline: "Your outward personality and first impressions",
    verbs: ["present", "project", "approach life"],
    detailedDescription:
      "the part of you that is most visible to others, the part of you that shapes first impressions and how you approach life and new situations",
  },
  Descendant: {
    tagline: "Your approach to partnerships and relationships",
    verbs: ["connect", "empathize", "compromise"],
    detailedDescription:
      "the part of you that seeks connection and balance in relationships, the part of you that learns to empathize with others and compromise",
  },
  Midheaven: {
    tagline: "Your career path and public image",
    verbs: ["advance", "pursues goal", "build reputation"],
    detailedDescription:
      "the part of you that is most visible to the world, the part of you that shapes your career path, public image, and reputation",
  },
  IC: {
    tagline: "Your roots, home, and private life",
    verbs: ["ground", "establish roots", "nurture your private self"],
    detailedDescription:
      "the part of you that is most private and intimate, the part of you that shapes your home life, family relationships, and emotional foundations",
  },
};

export const houseDescriptions: Record<number, string> = {
  1: "life direction and sense of self",
  2: "money and values",
  3: "learning and communication",
  4: "home, family, and emotional foundations",
  5: "creativity and children",
  6: "work and health",
  7: "relationships and partnerships",
  8: "shared resources",
  9: "travels and higher education",
  10: "career and public image",
  11: "friendships and aspirations",
  12: "solitude and subconscious patterns",
};

export const signDescriptions: Record<string, string[]> = {
  Aries: ["assertive", "energetic", "pioneering"],
  Taurus: ["practical", "sensual", "reliable"],
  Gemini: ["curious", "adaptable", "communicative"],
  Cancer: ["nurturing", "protective", "emotional"],
  Leo: ["confident", "creative", "charismatic"],
  Virgo: ["analytical", "detail-oriented", "service-minded"],
  Libra: ["diplomatic", "charming", "relationship-focused"],
  Scorpio: ["intense", "passionate", "transformative"],
  Sagittarius: ["adventurous", "optimistic", "philosophical"],
  Capricorn: ["disciplined", "ambitious", "responsible"],
  Aquarius: ["innovative", "independent", "humanitarian"],
  Pisces: ["compassionate", "intuitive", "dreamy"],
};

export const planetInHouseAdjectives: Record<string, string[]> = {
  1: ["self-focused", "assertive", "identity-driven"],
  2: ["value-oriented", "resourceful", "security-seeking"],
  3: ["communicative", "curious", "mentally active"],
  4: ["emotionally grounded", "family-oriented", "private"],
  5: ["creative", "playful", "romantic"],
  6: ["practical", "health-conscious", "service-oriented"],
  7: ["relationship-focused", "diplomatic", "partnership-oriented"],
  8: ["intense", "transformative", "shared-resource-focused"],
  9: ["adventurous", "philosophical", "open-minded"],
  10: ["ambitious", "career-driven", "image-conscious"],
  11: ["friendship-focused", "aspirational", "community-oriented"],
  12: ["introspective", "spiritual", "subconscious-focused"],
};

export const houseTopics: { [key: number]: string[] } = {
  1: ["self-presentation", "body", "identity", "life direction"],
  2: ["earned income", "assets", "personal values", "self esteem"],
  3: ["learning", "local travel", "siblings"],
  4: ["home", "family", "ancestry", "property"],
  5: ["creativity", "children", "fun", "romance", "pleasure"],
  6: ["health", "work", "daily habits", "pets", "coworkers"],
  7: ["partnerships", "contracts", "rivals"],
  8: ["debt", "taxes", "shared resources", "psychological transformation"],
  9: ["beliefs", "higher education", "travel", "legal matters"],
  10: ["career", "vocation", "public standing", "authority"],
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

export const positionInterpretationText = (placement: PlanetPoint): string => {
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
    `With ${sign} influencing your ${house} ${placement.planet}, you ${randomPlanetVerb} in your ${houseArea} by being ${signTraits}.`,
    `In the realm of the ${house}, ${tagline.toLowerCase()} takes on a ${sign} flavor—you tend to be ${signTraits} in how you ${randomPlanetVerb}, particularly in matters of your ${houseArea}.`,
    `Your ${sign} energy expresses through your ${house}, ${tagline.toLowerCase()} comes through bringing ${signTraits} qualities to your ${houseArea}.`,
  ];

  return variants[randomArrayIndex(variants.length)];
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
    `${planetText} rules your ${houseText}, importing these themes into your ${natalHouseFormatted} house.`,
    `${planetText} rules your ${houseText}, colouring your experience of ${natalHouseFormatted} house topics.`,
    `As the ruler of your ${houseText}, ${planetText} influences how you handle areas of life related to your ${natalHouseFormatted} house.`,
  ];

  const interpretation = variants[randomArrayIndex(variants.length)];

  const addedInterpretation = `Another way to say this is that ${planetDescriptions[planetName]?.detailedDescription.toLowerCase()} is responsible for themes of ${houseTopics}, and they do so in the context of your ${natalHouseTopics}.`;

  return interpretation + " " + addedInterpretation;
};

export const essentialDignityText = (
  planet: PlanetPoint,
  allPlacements: PlanetPoint[],
): string => {
  let essentialDignityText = "";

  const dignityType = getPlanetDignity(planet.planet, planet.position.sign);

  const rulerOfSign =
    allPlacements.find((p) => p.planet === SIGN_RULERS[planet.position.sign])
      ?.planet || allPlacements[0]?.planet;
  const rulerOfSignName = getFormattedPlanetText(rulerOfSign);

  const planetName = getFormattedPlanetText(planet.planet);
  const angles = allPlacements.filter((p) =>
    ["Ascendant", "Descendant", "Midheaven", "IC"].includes(p.planet),
  );
  const signsRuledByPlanet = constants.RULERSHIPS[planet.planet];
  if (!signsRuledByPlanet) return "";

  const housesRuledByPlanet = signsRuledByPlanet.map((sign) => {
    return getHouseFromSign(
      angles.find((a) => a.planet === "Ascendant")?.position.sign || "Aries",
      sign,
    );
  });
  const houseTopics = housesRuledByPlanet
    .map((house) => {
      return houseDescriptions[house];
    })
    .join(", as well as ");

  if (dignityType === "peregrine") {
    essentialDignityText = `${planetName} is said to be "peregrine" in ${planet.position.sign}, meaning it has no essential dignity or debility here.
     Your ${planetName} is neither at home in the sign of ${PLANET_DIGNITIES_DEBILITIES[planet.planet]?.Domicile?.join(", ") || "no sign"}, nor esteemed in the sign of ${PLANET_DIGNITIES_DEBILITIES[planet.planet]?.Exaltation?.join(", ") || "no sign"}, nor struggling to adapt to the discomfort of in the signs of ${PLANET_DIGNITIES_DEBILITIES[planet.planet]?.Fall?.join(", ") || "no sign"}. 
     Like a guest in someone else's home, ${planetName} takes it's cues from ${rulerOfSignName}, the ruler of ${planet.position.sign}, for how it should behave.`;
  }
  if (dignityType === "in domicile") {
    essentialDignityText = `${planetName} is said to be in domicile, or "at home" in the sign of ${planet.position.sign}. This placement gives ${planetName} a lot of strength, in the same way that when we are in a home of our own choosing - we know where everthing is, it's decorated the way want, the fridge is stocked with the food we like, and so on. In a nutshell, ${planetName} feels safe 
    and well-resourced where it is. Simultaneously, because this is the home that ${planetName} is in charge of, ${planetName} is also sole authority over its upkeep. While this placement of ${planetName} is said to be at its strongest, there also lies the burden of responsibility for their home.`;
  }
  if (dignityType === "exalted") {
    essentialDignityText = `${planetName} is said to be exalted in the sign of ${planet.position.sign}, meaning that it is has an enormous capacity to do its 
    job to its fullest and receive enormous acclaim for it, while simultaneously not having to really be responsible for the upkeep of the house it resides. That duty would instead fall to ${rulerOfSign}, the ruler of ${planet.position.sign}. While exalted planets like your ${planet.position.sign} ${planet.planet} may be recognized for its excellence (and sometimes may even be accused arrogance), it is ${rulerOfSignName} who ultimately has the duty to support your ${planetName}.`;
  }
  if (dignityType === "in fall") {
    essentialDignityText = `${planetName} is said to be in fall in ${planet.position.sign}. If ${planetName} is said to be exalted and esteemed in the sign of ${PLANET_DIGNITIES_DEBILITIES[planet.planet]?.Exaltation?.join(", ") || "no sign"}, it is by contrast in "a fallen" state in the opposite sign of ${PLANET_DIGNITIES_DEBILITIES[planet.planet]?.Fall?.join(", ") || "no sign"}. While this terminology may sound worrying at first, know that all it means is that because 
    the sign it resides in does not provide its ideal environment, the planet needs to work harder, be more creative, and possibly even more cunning in order to achieve its goals. In turn the houses your ${planetName} rules over, namely your ${houseTopics}, may take longer and more effort in order to blossom. The thing is, some of the strongest and most notable aspects of ourselves are often not the ones we were naturally gifted at, but the ones we have to work the longest at. Ultimately, the placement of ${rulerOfSignName.toLowerCase()} 
    defines how supported your ${planetName} will ultimately feel. `;
  }
  if (dignityType === "in detriment") {
    essentialDignityText = `${planetName} is said to be in detriment in ${planet.position.sign}. If ${planetName} is said to be "domicile" or "at home" in the sign of ${PLANET_DIGNITIES_DEBILITIES[planet.planet]?.Domicile?.join(", ") || "no sign"}, it is by contrast "far from home" in the opposite sign of ${PLANET_DIGNITIES_DEBILITIES[planet.planet]?.Detriment?.join(", ") || "no sign"}. 
The way to think about this quality of your ${planetName} is to understand how one might feel when they're at home, compared to when they might be traveling in a distant land, in a culture wildly different from what they are used to. While the terminology may sound concering, what "in detriment" often means is that the planet needs to be more adaptable and work harder in order to achieve its goals, since it doesn't have its ideal conditions.
 In turn the houses your ability to shine is responsible for, namely your ${houseTopics}, may take longer and more effort in order to come to fruition. The thing the strongest, most notable aspects of ourselves are often not the ones we were naturally gifted at, but the ones we have to work the longest at. Ultimately, the placement of ${rulerOfSignName} defines how supported your ${planetName} will feel.`;
  }

  return essentialDignityText;
};

export const rulerOfSignInterpretationText = (
  planet: PlanetPoint,
  allPlacements: PlanetPoint[],
): string => {
  let rulerOfSignText = "";

  const planetName = `${planet.position.sign} ${planet.planet}`;
  const rulerOfSign =
    allPlacements.find((p) => p.planet === SIGN_RULERS[planet.position.sign]) ||
    allPlacements[0];
  const rulerOfSignHouse = getOrdinal(rulerOfSign?.house || 1);
  const rulerOfSignDignity = getPlanetDignity(
    rulerOfSign.planet,
    rulerOfSign.position.sign,
  );
  const rulerOfSignName = `your ${rulerOfSign?.position.sign} ${rulerOfSign?.planet}`;

  // Ruler of sign description
  if (rulerOfSignDignity === "in domicile") {
    rulerOfSignText += `Thankfully, ${rulerOfSignName} is at home in it's own sign, and is in domicile in your ${rulerOfSignHouse} house, meaning that it is also in a very strong position to support your ${planetName}.`;
  }
  if (rulerOfSignDignity === "exalted") {
    rulerOfSignText += `Thankfully, ${rulerOfSignName} is exalted, meaning that it is in a strong position to support your ${planetName}, though it may not be able to provide the kind of stability that a planet in domicile can provide.`;
  }
  if (rulerOfSignDignity === "in fall") {
    rulerOfSignText += `Here, ${rulerOfSignName} is said to be in fall, from your ${rulerOfSignHouse} house, meaning that it may struggle to support your ${planetName} at times, since it is not in an ideal position itself.`;
  }
  if (rulerOfSignDignity === "in detriment") {
    rulerOfSignText += `In this case, ${rulerOfSignName} is said to be in detriment as it rules the sign of ${planet.position.sign} from your ${rulerOfSignHouse} house, meaning that it may not be able to provide the kind of support your ${planetName} needs.`;
  }
  if (rulerOfSignDignity === "peregrine") {
    rulerOfSignText += `In this case, ${rulerOfSignName} rules the sign of ${planet.position.sign} from your ${rulerOfSignHouse} house, meaning that it may be able to provide some help to your ${planetName}, but it may not be consistent or reliable support.`;
  }

  if (
    rulerOfSignDignity === "in domicile" ||
    rulerOfSignDignity === "exalted" ||
    rulerOfSignDignity === "peregrine"
  ) {
    if (isAngular(rulerOfSign.house)) {
      rulerOfSignText += ` It is especially beneficial, since ${rulerOfSignName} is in an angular house (houses 1, 4, 7, or 10), giving it more power and influence to support your ${planetName}.`;
    }
    if (isGoodHouse(rulerOfSign.house)) {
      rulerOfSignText += ` It is especially beneficial, since ${rulerOfSignName} is in a "lucky" house (houses 2, 3, 5, 9, or 11), giving it more resources and opportunities to support your ${planetName}.`;
    }
  }

  if (
    rulerOfSignDignity === "in fall" ||
    rulerOfSignDignity === "in detriment"
  ) {
    if (isAngular(rulerOfSign.house)) {
      rulerOfSignText += ` It is somewhat beneficial that your ${getOrdinal(rulerOfSign.house)} house ${rulerOfSignName} is in an angular house (houses 1, 4, 7, or 10), giving it more power and influence to support your ${planetName}.`;
    }
    if (isGoodHouse(rulerOfSign.house)) {
      rulerOfSignText += ` It is somewhat beneficial that ${rulerOfSignName} is in a "lucky" house, the ${getOrdinal(rulerOfSign.house)} house, giving it more resources and opportunities to support your ${planetName}.`;
    }
  }

  return rulerOfSignText;
};

export const rulerOfSignEndText = (
  planet: PlanetPoint,
  allPlacements: PlanetPoint[],
) => {
  let rulerOfSignText = "";

  const rulerOfSign =
    allPlacements.find((p) => p.planet === SIGN_RULERS[planet.position.sign]) ||
    allPlacements[0];
  const rulerSign = rulerOfSign?.position?.sign ?? "";
  const rulerPlanet = rulerOfSign?.planet ?? "";
  const rulerHouseOrdinal = getOrdinal(rulerOfSign.house);
  const planetVerbOptions = planetDescriptions?.[planet?.planet]?.verbs ?? [];
  const planetVerb =
    planetVerbOptions[randomArrayIndex(planetVerbOptions.length) || 0] ?? "act";
  const planetHouseAdjective =
    planetInHouseAdjectives[planet.house][
      randomArrayIndex(planetInHouseAdjectives[planet.house].length)
    ];
  const planetSignAdjective =
    signDescriptions?.[planet.position.sign]?.[
      randomArrayIndex(signDescriptions[planet.position.sign].length)
    ] ?? [];
  const rulerAdjectives = signDescriptions?.[rulerSign]?.slice(0, 2) ?? [];
  const signD =
    rulerAdjectives.length > 0
      ? rulerAdjectives.join(" and ")
      : "certain qualities";
  const planetHouseTopics = houseDescriptions?.[planet.house];
  const rulerHouseTopics =
    houseDescriptions?.[rulerOfSign.house] ??
    `${getOrdinal(rulerOfSign.house)} house topics`;

  rulerOfSignText += `Regardless, your ${rulerHouseOrdinal} house ${rulerSign} ${rulerPlanet} makes it so that your ${planetHouseAdjective}, ${planetSignAdjective} ${planet?.planet} has to ${planetVerb} in your ${planetHouseTopics}, areas of life built on a foundation of being ${signD} within one's ${rulerHouseTopics}.`;

  return rulerOfSignText;
};

export const placementInterpretationText = (
  placement: PlanetPoint,
  allPlacements: PlanetPoint[],
) => {
  const angles = allPlacements.filter((p) =>
    ["Ascendant", "Descendant", "Midheaven", "IC"].includes(p.planet),
  );

  const textCollection: string[] = [];

  // Position interpretation
  const positionText = positionInterpretationText(placement);
  if (positionText) textCollection.push(positionText);

  // House ruler interpretation
  const houseRulerText = rulershipInterpretationText(
    placement.planet,
    placement.house,
    angles,
  );
  if (houseRulerText) textCollection.push(houseRulerText);

  // Transition text
  const variantTransitionTexts = [
    "Let's break this down further:",
    "Now, let's delve deeper into the specifics:",
    "To understand this more fully, let's explore the details:",
    "Now, let's unpack this further:",
    "Let's take a closer look at what this means in practice:",
  ];
  const transitionText =
    variantTransitionTexts[randomArrayIndex(variantTransitionTexts.length)];
  if (houseRulerText && positionText) textCollection.push(transitionText);

  // Rulership interpretation
  const rulershipTextCollection: string[] = [];
  if (placement.rulerOf) {
    for (let i = 0; i < placement.rulerOf.length; i++) {
      const rulerHouse = placement.rulerOf[i];
      const rulershipText = getPlanetRulerText(rulerHouse, placement.house);
      if (rulershipText) rulershipTextCollection.push(rulershipText);
    }
  }
  textCollection.push(...rulershipTextCollection);

  // Essential dignity interpretation
  const dignityText = essentialDignityText(placement, allPlacements);
  if (dignityText) textCollection.push(dignityText);

  // Ruler of sign interpretation
  if (
    getPlanetDignity(placement.planet, placement.position.sign) !==
    "in domicile"
  ) {
    const rulerOfSignText = rulerOfSignInterpretationText(
      placement,
      allPlacements,
    );
    if (rulerOfSignText) textCollection.push(rulerOfSignText);
  }

  // End text
  const endText = rulerOfSignEndText(placement, allPlacements);
  if (endText) textCollection.push(endText);

  return textCollection;
};
