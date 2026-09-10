/**
 * Single source of truth for TanStack Query keys. Keeps query-key strings
 * out of components and guarantees every writer invalidates the exact same
 * key every reader uses.
 */
export const queryKeys = {
  userProfile: ["user-profile"] as const,
  categories: {
    all: ["categories"] as const,
    list: (params: Record<string, unknown>) => ["categories", "list", params] as const,
    detail: (id: string) => ["categories", "detail", id] as const,
  },
  designs: {
    all: ["designs"] as const,
    list: (params: Record<string, unknown>) => ["designs", "list", params] as const,
    detail: (id: string) => ["designs", "detail", id] as const,
  },
} as const;