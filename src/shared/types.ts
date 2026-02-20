export type Location = {
  latitude: number;
  longitude: number;
  elevation?: number;
};

export type Position = {
  sign: string;
  degree: number;
  minute: number;
};

export type PlanetPoint = {
  planet: string;
  modality: string;
  position: Position;
  house: number;
  rulerOf?: number[] | undefined;
};

export type LunationType = "new moon" | "full moon";

export type Lunation = {
  date: string;
  lunationType: LunationType;
  position: Position;
};

export type DatesMatch = {
  date: string;
  position: Position;
  exactMatch: boolean;
};

export type ProfectionYearData = {
  profectionYear: number;
  profectionSign: string;
  lordOfYear: string;
};

export type IngressEntry = { date: string; planet: string; sign: string };

export type TransitEntry = {
  date: string;
  transitingPlanet: string;
  natalPlanet: string;
  aspect: string;
  position: Position;
  natalPosition: Position;
  exactMatch: boolean;
};

export type PlanetaryIngress = {
  planet: string;
  targetPosition: Position;
  searchPeriod: {
    start: string;
    end: string;
  };
  matchesFound: number;
  dates: DatesMatch[];
};

export type Transits = {
  planet: string;
  conjunct: PlanetaryIngress | null;
  opposition: PlanetaryIngress | null;
  superiorSquare: PlanetaryIngress | null;
  inferiorSquare: PlanetaryIngress | null;
  superiorTrine: PlanetaryIngress | null;
  inferiorTrine: PlanetaryIngress | null;
  superiorSextile: PlanetaryIngress | null;
  inferiorSextile: PlanetaryIngress | null;
};

export type MajorTransits = {
  natalPlanet: string;
  natalPosition: Position;
  modality: string;
  transits: Transits[];
};

export type Eclipse = {
  date: string;
  type: string;
  position: Position;
  modality: string;
};

export type RetrogradePeriod = {
  start: { date: string; position: Position };
  end: { date: string; position: Position };
};

export type RetrogradeEvent = {
  date: string;
  position: Position;
  isStarting: boolean;
};

export type Aspect = {
  planet: string;
  aspect: string;
};

export type TransitInterpretations = {
  [key: string]: {
    conjunct: { [key: number]: string };
    trineOrSextile: { [key: number]: string };
    squareOrOpposition: { [key: number]: string };
  };
};

export type SectPlanets = {
  inSectBenefic: PlanetPoint;
  outOfSectBenefic: PlanetPoint;
  inSectMalefic: PlanetPoint;
  outOfSectMalefic: PlanetPoint;
};

export type Pill = {
  type:
    | "joyous"
    | "excessive"
    | "productive"
    | "challenging"
    | "significant"
    | "lifeDefining"
    | "fastMoving";
  toolTip: string;
};
