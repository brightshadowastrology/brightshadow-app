import { SectInterpretations } from "@/shared/types";

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
  Mars: "Take bold action and pursue your goals with courage. Watch for conflicts but use your drive productively.",
  Venus:
    "Focus on relationships, creativity, and enjoying life's pleasures. A year for harmony and beauty.",
  Mercury:
    "Communication and learning take center stage. Great for studies, writing, and making connections.",
  Moon: "Emotional growth and domestic matters are highlighted. Trust your intuition and nurture yourself.",
  Sun: "Step into the spotlight and express your authentic self. A year for leadership and vitality.",
  Jupiter:
    "Expansion and opportunities abound. Say yes to growth, travel, and broadening your horizons.",
  Saturn:
    "A year of hard work and building foundations. Embrace discipline for lasting achievements.",
  Uranus:
    "Expect the unexpected. Embrace change and innovation, even if it feels disruptive.",
  Neptune:
    "Spiritual and creative pursuits flourish. Stay grounded while exploring your dreams.",
  Pluto:
    "Deep transformation awaits. Let go of what no longer serves you and embrace rebirth.",
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
