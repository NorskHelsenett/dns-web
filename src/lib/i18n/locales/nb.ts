/** Turns every string literal in a translation tree into `string`, so other languages must supply the same keys. */
type Widen<T> = { [K in keyof T]: T[K] extends string ? string : Widen<T[K]> };

/** Norwegian (bokmål) is the default language and defines the key structure. */
export const nb = {
  app: {
    title: "DNS-panel",
  },
} as const;

/** The shape every language file must follow. */
export type Translations = Widen<typeof nb>;
