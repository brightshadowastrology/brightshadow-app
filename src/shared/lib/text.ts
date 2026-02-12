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
  1: "self",
  2: "money",
  3: "communication",
  4: "home and family",
  5: "fun",
  6: "health and daily routines",
  7: "partnerships",
  8: "shared resources",
  9: "personal philosophy",
  10: "career",
  11: "friendships",
  12: "spirituality",
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
  2: ["money", "assets", "self esteem"],
  3: ["learning", "local travel", "communication", "siblings"],
  4: ["home", "family", "emotional foundations", "ancestry", "property"],
  5: ["creativity", "children", "fun", "romance", "pleasure"],
  6: ["daily habits", "being of service", "health", "pets", "coworkers"],
  7: [
    "partnerships",
    "marriage",
    "one-to-one relationships",
    "contracts",
    "open enemies",
  ],
  8: ["debt", "taxes", "shared resources", "subconscious material"],
  9: [
    "worldview",
    "higher education",
    "religion",
    "long distance travel",
    "legal matters",
  ],
  10: ["career", "vocation", "public reputation", "authority figures"],
  11: [
    "friendships",
    "professional networks",
    "supporters",
    "community",
    "aspirations",
  ],
  12: ["solitude", "rest", "self-undoing", "hidden enemies", "spirituality"],
};
