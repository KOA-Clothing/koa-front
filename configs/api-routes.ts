// config/api-routes.ts

export const API_ROUTES = {
  USERS: {
    PROFILE: "/api/v1/users/profile",
  },
  ADDRESSES: {
    BASE: "/api/v1/users/addresses",
    ALL: "/api/v1/users/addresses/all",
    BY_ID: (id: string) => `/api/v1/users/addresses/${id}`,
    SET_DEFAULT: (id: string) => `/api/v1/users/addresses/${id}/set-default`
  },
  PHONE_NUMBERS: {
    BASE: "/api/v1/users/phone-numbers",
    ALL: "/api/v1/users/phone-numbers/all",
    BY_ID: (id: string) => `/api/v1/users/phone-numbers/${id}`,
    SET_DEFAULT: (id: string) => `/api/v1/users/phone-numbers/${id}/set-default` 
  }
} as const;