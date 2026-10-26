import { z } from "zod";

const recordBase = z.object({
  uid: z.string(),
  zoneuid: z.string(),
  name: z.string(),
  class: z.string(),
  ttl: z.number(),
  comment: z.string().optional(),
});

const aRecord = recordBase.extend({ rrtype: z.literal("A"), a: z.string() });
const aaaaRecord = recordBase.extend({ rrtype: z.literal("AAAA"), aaaa: z.string() });
const cnameRecord = recordBase.extend({ rrtype: z.literal("CNAME"), target: z.string() });
const mxRecord = recordBase.extend({
  rrtype: z.literal("MX"),
  preference: z.number(),
  mx: z.string(),
});
const nsRecord = recordBase.extend({ rrtype: z.literal("NS"), ns: z.string() });
const txtRecord = recordBase.extend({
  rrtype: z.literal("TXT"),
  txt: z.array(z.string()).default([]),
});
const srvRecord = recordBase.extend({
  rrtype: z.literal("SRV"),
  priority: z.number(),
  weight: z.number(),
  port: z.number(),
  target: z.string(),
});
const caaRecord = recordBase.extend({
  rrtype: z.literal("CAA"),
  flag: z.number(),
  tag: z.string(),
  value: z.string(),
});

const knownRecordSchema = z.discriminatedUnion("rrtype", [
  aRecord,
  aaaaRecord,
  cnameRecord,
  mxRecord,
  nsRecord,
  txtRecord,
  srvRecord,
  caaRecord,
]);
export type KnownRecord = z.infer<typeof knownRecordSchema>;

// Derived from the union, so there's no second list to keep in sync
const knownTypes = new Set<string>(knownRecordSchema.options.map((o) => o.shape.rrtype.value));

// Types the backend supports but the frontend doesn't model yet
// (SOA, PTR, DNAME and the DNSSEC types). They still parse and show up with an empty value.
const unknownRecordSchema = recordBase
  .extend({ rrtype: z.string() })
  .loose()
  .refine((r) => !knownTypes.has(r.rrtype), "Malformed record of a known type");

export const recordSchema = z.union([knownRecordSchema, unknownRecordSchema]);
export type DnsRecord = z.infer<typeof recordSchema>;

export const isKnownRecord = (r: DnsRecord): r is KnownRecord => knownTypes.has(r.rrtype);
