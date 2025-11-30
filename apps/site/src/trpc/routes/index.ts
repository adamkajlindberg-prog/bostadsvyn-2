import { createTRPCRouter } from "../init";
import property from "./property";

export const appRouter = createTRPCRouter({
  property,
});

export type AppRouter = typeof appRouter;
