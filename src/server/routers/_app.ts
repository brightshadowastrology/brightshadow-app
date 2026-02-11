import * as trpc from "@trpc/server";
import superjson from "superjson";
import { astroRouter } from "./astro";

export const appRouter = trpc
  .router()
  .transformer(superjson)
  .merge("astro.", astroRouter);

export type AppRouter = typeof appRouter;
