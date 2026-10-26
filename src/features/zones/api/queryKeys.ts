export const zoneKeys = {
  all: ["zones"] as const,
  list: () => [...zoneKeys.all, "list"] as const,
  detail: (uid: string) => [...zoneKeys.all, "detail", uid] as const,
};
