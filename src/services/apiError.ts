import { z } from "zod";

/** One field-level problem reported by the backend. */
export interface ApiValidationIssue {
  /** Path of the field in the submitted data, for example `values.0.address`. */
  path: string;
  /** Translation key or code for the message. */
  messageKey: string;
}

/** Every way an API call can fail, as the UI needs to tell them apart. */
export type ApiError =
  | { kind: "validation"; issues: ApiValidationIssue[] }
  | { kind: "unauthenticated" }
  | { kind: "forbidden"; reasonKey?: string }
  | { kind: "not-found" }
  | { kind: "conflict"; currentVersion?: string }
  | { kind: "unavailable" }
  | { kind: "invalid-response"; detail: string }
  | { kind: "unknown"; status: number };

/** The error thrown by all API functions. Carries a typed {@link ApiError}. */
export class ApiRequestError extends Error {
  readonly error: ApiError;

  constructor(error: ApiError) {
    super(`API error: ${error.kind}`);
    this.name = "ApiRequestError";
    this.error = error;
  }
}

/** Type guard for {@link ApiRequestError}. */
export function isApiRequestError(value: unknown): value is ApiRequestError {
  return value instanceof ApiRequestError;
}

/** Shape the backend is expected to use for validation errors (400/422). */
export const validationBodySchema = z.object({
  issues: z.array(z.object({ path: z.string(), messageKey: z.string() })),
});

/** Shape of a 403 body. Both fields are optional. */
export const forbiddenBodySchema = z.object({ reasonKey: z.string().optional() });

/** Shape of a 409 body. */
export const conflictBodySchema = z.object({ currentVersion: z.string().optional() });
