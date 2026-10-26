import { recordSchema } from "@/features/records";
import { paginatedSchema } from "@/lib/schemas/paginated";
import z from "zod";

// TODO: Fix favorite when ready in backend

export const zoneSchema = z.object({
  uid: z.string(),
  name: z.string(),
  view: z.string(),
  comment: z.string().optional(),
});

export const zoneSchemaWithFavorite = zoneSchema.extend({
  favorited: z.boolean().optional(),
});

export type Zone = z.infer<typeof zoneSchema>;
export type ZoneWithFavorite = z.infer<typeof zoneSchemaWithFavorite>;
export const zoneListSchema = z.array(zoneSchemaWithFavorite);
export const zonePaginationSchema = paginatedSchema(zoneSchema);
export type ZonePagination = z.infer<typeof zonePaginationSchema>;

export const zoneWithRecordsSchema = zoneSchema.extend({
  records: z.array(recordSchema),
});

export type ZoneWithRecords = z.infer<typeof zoneWithRecordsSchema>;
