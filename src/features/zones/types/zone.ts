import z from "zod";

export const zoneSchema = z.object({
  uid: z.string(),
  name: z.string(),
  view: z.string(),
  favorited: z.boolean(),
  comment: z.string().optional(),
});

export type Zone = z.infer<typeof zoneSchema>;
export const zoneListSchema = z.array(zoneSchema);
