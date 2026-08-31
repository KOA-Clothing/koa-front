// config/api-routes.ts

export const API_ROUTES = {
  USERS: {
    ME: "/api/v1/users/me",
  },
  ADDRESSES: {
    BASE: "/api/v1/addresses",
    ALL: "/api/v1/addresses/all",
    BY_ID: (id: string) => `/api/v1/addresses/${id}`,
    SET_DEFAULT: (id: string) => `/api/v1/addresses/${id}/set-default`
  }
} as const;