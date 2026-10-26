import { z } from "zod";
import {
  ApiRequestError,
  conflictBodySchema,
  forbiddenBodySchema,
  validationBodySchema,
  type ApiError,
} from "./apiError";

interface ApiSettings {
  baseUrl: string;
  getAccessToken: () => string | undefined;
}

type Query = Record<string, string | number | boolean | undefined>;

interface RequestOptions {
  query?: Query;
  body?: unknown;
  signal?: AbortSignal;
}

let settings: ApiSettings = { baseUrl: "", getAccessToken: () => undefined };

// TODO: Fix setup for baseUrl
// TODO: Fix setup for access token
/** Configures the API client. Call once at startup. */
export function configureApi(options: Partial<ApiSettings>): void {
  settings = { ...settings, ...options };
}

function buildUrl(path: string, query?: Query): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value !== undefined) params.set(key, String(value));
  }
  const queryString = params.toString();
  const baseUrl = settings.baseUrl.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}${queryString ? `?${queryString}` : ""}`;
}

async function readJson(response: Response): Promise<unknown> {
  try {
    return (await response.json()) as unknown;
  } catch {
    return undefined;
  }
}

async function toApiError(response: Response): Promise<ApiError> {
  const body = await readJson(response);
  switch (response.status) {
    case 400:
    case 422: {
      const parsed = validationBodySchema.safeParse(body);
      return { kind: "validation", issues: parsed.success ? parsed.data.issues : [] };
    }
    case 401:
      return { kind: "unauthenticated" };
    case 403: {
      const parsed = forbiddenBodySchema.safeParse(body);
      return { kind: "forbidden", reasonKey: parsed.success ? parsed.data.reasonKey : undefined };
    }
    case 404:
      return { kind: "not-found" };
    case 409: {
      const parsed = conflictBodySchema.safeParse(body);
      return {
        kind: "conflict",
        currentVersion: parsed.success ? parsed.data.currentVersion : undefined,
      };
    }
    case 502:
    case 503:
    case 504:
      return { kind: "unavailable" };
    default:
      return { kind: "unknown", status: response.status };
  }
}

async function send(method: string, path: string, options: RequestOptions): Promise<Response> {
  const headers: Record<string, string> = { Accept: "application/json" };
  const token = settings.getAccessToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (options.body !== undefined) headers["Content-Type"] = "application/json";

  let response: Response;
  try {
    response = await fetch(buildUrl(path, options.query), {
      method,
      headers,
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
      signal: options.signal,
    });
  } catch {
    if (options.signal?.aborted) {
      throw new DOMException("The request was aborted.", "AbortError");
    }
    throw new ApiRequestError({ kind: "unavailable" });
  }

  if (!response.ok) throw new ApiRequestError(await toApiError(response));
  return response;
}

function parseBody<T>(schema: z.ZodType<T>, body: unknown): T {
  const result = schema.safeParse(body);
  if (!result.success) {
    throw new ApiRequestError({ kind: "invalid-response", detail: z.prettifyError(result.error) });
  }
  return result.data;
}

/**
 * Query: fetches data and validates it against a schema. Never changes state.
 *
 * @throws ApiRequestError on any failure, including a response that does not match the schema.
 */
export async function apiGet<T>(
  path: string,
  schema: z.ZodType<T>,
  options: Pick<RequestOptions, "query" | "signal"> = {},
): Promise<T> {
  const response = await send("GET", path, options);
  return parseBody(schema, await readJson(response));
}

/** Query: fetches data through a POST endpoint and validates its response. */
export async function apiPost<T>(
  path: string,
  schema: z.ZodType<T>,
  options: Pick<RequestOptions, "body" | "signal"> = {},
): Promise<T> {
  const response = await send("POST", path, options);
  return parseBody(schema, await readJson(response));
}

/**
 * Command: changes state and returns nothing.
 *
 * @throws ApiRequestError on any failure.
 */
export async function apiCommand(
  method: "POST" | "PUT" | "PATCH" | "DELETE",
  path: string,
  options: Pick<RequestOptions, "body" | "signal"> = {},
): Promise<void> {
  await send(method, path, options);
}

/**
 * Command that returns a minimal result such as the new id and version, validated against a schema.
 *
 * @throws ApiRequestError on any failure.
 */
export async function apiCreate<T>(
  path: string,
  resultSchema: z.ZodType<T>,
  options: Pick<RequestOptions, "body" | "signal"> = {},
): Promise<T> {
  const response = await send("POST", path, options);
  return parseBody(resultSchema, await readJson(response));
}
