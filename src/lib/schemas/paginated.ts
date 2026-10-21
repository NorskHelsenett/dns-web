import { z, type ZodType } from "zod";

export const paginatedSchema = <T extends ZodType>(item: T) =>
  z.object({
    data: z.array(item),
    dataCount: z.number(),
    offset: z.number(),
    totalCount: z.number(),
  });
