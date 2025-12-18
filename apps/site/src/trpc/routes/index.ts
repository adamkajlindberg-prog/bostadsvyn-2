import { createTRPCRouter } from "../init";
import property from "./property";
import propertySearch from "./property-search";

export const appRouter = createTRPCRouter({
  property,
  propertySearch,
});

export type AppRouter = typeof appRouter;
