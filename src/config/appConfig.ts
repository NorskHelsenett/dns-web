import { locales } from "@/lib/i18n";
import { z } from "zod";

/**
 * Runtime configuration, loaded from `/config.json` at startup.
 *
 * Nothing organisation-specific belongs in code. It comes from here, so the same
 * build works at every site.
 */
export const appConfigSchema = z.object({
  orgName: z.string().min(1),
  /** Relative API base path. The browser only talks to its own site's API. */
  apiBaseUrl: z.string().regex(/^\/(?!\/)/, "apiBaseUrl must be a relative path such as /api"),
  defaultLocale: z.enum(locales),
});

/** The validated runtime configuration. */
export type AppConfig = z.infer<typeof appConfigSchema>;

/**
 * Loads and validates the runtime configuration.
 *
 * @param url - Where the configuration is served from.
 * @throws Error with a readable message when the file is missing or invalid.
 */
export async function loadConfig(url = "/config.json"): Promise<AppConfig> {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Could not load ${url} (HTTP ${response.status}).`);
  }
  const json: unknown = await response.json();
  const result = appConfigSchema.safeParse(json);
  if (!result.success) {
    throw new Error(`Invalid ${url}:\n${z.prettifyError(result.error)}`);
  }
  return result.data;
}
