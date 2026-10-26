import { isKnownRecord, type DnsRecord } from "../types/record";

export function recordValue(r: DnsRecord): string {
  if (!isKnownRecord(r)) return "";
  switch (r.rrtype) {
    case "A":
      return r.a;
    case "AAAA":
      return r.aaaa;
    case "CNAME":
      return r.target;
    case "NS":
      return r.ns;
    case "MX":
      return `${r.preference} ${r.mx}`;
    case "TXT":
      return r.txt.map((s) => `"${s}"`).join(" ");
    case "SRV":
      return `${r.priority} ${r.weight} ${r.port} ${r.target}`;
    case "CAA":
      return `${r.flag} ${r.tag} "${r.value}"`;
    default:
      return r satisfies never;
  }
}
