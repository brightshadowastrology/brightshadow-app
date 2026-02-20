import * as trpc from "@trpc/server";
import { z } from "zod";
import {
  getProfectionYear,
  getPlanetaryPositionsByDate,
  getBirthChartData,
  getPlanetaryIngressByDegree,
  getMajorTransitsForAPlanet,
  getLunations,
  getLunarEclipses,
  getSolarEclipses,
  getEclipses,
  getMercuryRetrogradePeriods,
  getAllPlanetZeroDegreeIngresses,
  getMajorTransitsAllPlanets,
} from "../astro";

const positionSchema = z.object({
  sign: z.string(),
  degree: z.number(),
  minute: z.number(),
});

const planetPositionSchema = z.object({
  planet: z.string(),
  modality: z.string(),
  position: positionSchema,
  house: z.number(),
  rulerOf: z.array(z.number()).optional(),
});

export const astroRouter = trpc
  .router()
  .query("getProfectionYear", {
    input: z.object({
      ascendantSign: z.string(),
      birthdate: z.string().transform((val) => new Date(val)),
    }),
    resolve({ input }) {
      return getProfectionYear(input.ascendantSign, input.birthdate);
    },
  })
  .query("getPlanetaryPositionsByDate", {
    input: z.object({
      date: z.string().transform((val) => new Date(val)),
    }),
    resolve({ input }) {
      return getPlanetaryPositionsByDate(input.date);
    },
  })
  .query("getBirthChartData", {
    input: z.object({
      date: z.date(),
      longitude: z.number(),
      latitude: z.number(),
    }),
    resolve({ input }) {
      return getBirthChartData(input.date, input.longitude, input.latitude);
    },
  })
  .query("getPlanetaryIngressByDegree", {
    input: z.object({
      planet: z.string(),
      position: positionSchema,
    }),
    resolve({ input }) {
      return getPlanetaryIngressByDegree(input.planet, input.position);
    },
  })
  .query("getMajorTransitsForAPlanet", {
    input: z.object({
      natalPlanet: z.string(),
      position: positionSchema,
    }),
    resolve({ input }) {
      return getMajorTransitsForAPlanet(input.natalPlanet, input.position);
    },
  })
  .query("getLunations", {
    input: z
      .object({
        date: z.string().transform((val) => new Date(val)),
      })
      .optional(),
    resolve({ input }) {
      return getLunations(input?.date);
    },
  })
  .query("getLunarEclipses", {
    input: z.object({
      date: z.string().transform((val) => new Date(val)),
    }),
    resolve({ input }) {
      return getLunarEclipses(input.date);
    },
  })
  .query("getSolarEclipses", {
    input: z.object({
      date: z.string().transform((val) => new Date(val)),
    }),
    resolve({ input }) {
      return getSolarEclipses(input.date);
    },
  })
  .query("getEclipses", {
    input: z.object({
      date: z.string().transform((val) => new Date(val)),
    }),
    resolve({ input }) {
      return getEclipses(input.date);
    },
  })
  .query("getMercuryRetrogradePeriods", {
    input: z.object({
      date: z.string().transform((val) => new Date(val)),
    }),
    resolve({ input }) {
      return getMercuryRetrogradePeriods(input.date);
    },
  })
  .query("getAllPlanetZeroDegreeIngresses", {
    input: z.object({
      date: z.string().transform((val) => new Date(val)),
    }),
    resolve() {
      return getAllPlanetZeroDegreeIngresses();
    },
  })
  .query("getMajorTransitsAllPlanets", {
    input: z.object({
      natalPlacements: z.array(planetPositionSchema),
    }),
    resolve({ input }) {
      return getMajorTransitsAllPlanets(input.natalPlacements);
    },
  });
