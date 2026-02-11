import sweph from "sweph";

export const BODIES = [
  sweph.constants.SE_SUN,
  sweph.constants.SE_MOON,
  sweph.constants.SE_MERCURY,
  sweph.constants.SE_VENUS,
  sweph.constants.SE_MARS,
  sweph.constants.SE_JUPITER,
  sweph.constants.SE_SATURN,
  sweph.constants.SE_URANUS,
  sweph.constants.SE_NEPTUNE,
  sweph.constants.SE_PLUTO,
];

export const PLANET_MAP: { [key: string]: number } = {
  Sun: sweph.constants.SE_SUN,
  Moon: sweph.constants.SE_MOON,
  Mercury: sweph.constants.SE_MERCURY,
  Venus: sweph.constants.SE_VENUS,
  Mars: sweph.constants.SE_MARS,
  Jupiter: sweph.constants.SE_JUPITER,
  Saturn: sweph.constants.SE_SATURN,
  Uranus: sweph.constants.SE_URANUS,
  Neptune: sweph.constants.SE_NEPTUNE,
  Pluto: sweph.constants.SE_PLUTO,
};
