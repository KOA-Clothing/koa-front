// config/api-routes.ts

export const API_ROUTES = {
  USERS: {
    PROFILE: "/api/v1/users/profile",
    PASSWORD: "/api/v1/users/password",
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
  },
  CATEGORIES: {
    BASE: "/api/v1/categories",
    BY_ID: (id: string) => `/api/v1/categories/${id}`,
    TOGGLE_ACTIVE_STATUS: (id: string) => `/api/v1/categories/${id}/toggle-active-status`,
  },
  DESIGNS: {
    BASE: "/api/v1/designs",
    BY_ID: (id: string) => `/api/v1/designs/${id}`,
    TOGGLE_ACTIVE_STATUS: (id: string) => `/api/v1/designs/${id}/toggle-active-status`,
  },
  COLORS: {
    BASE: "/api/v1/colors",
    BY_ID: (id: string) => `/api/v1/colors/${id}`,
    TOGGLE_ACTIVE_STATUS: (id: string) => `/api/v1/colors/${id}/toggle-active-status`,
  },
  PRODUCTS: {
    BASE: "/api/v1/products",
    BY_ID: (id: string) => `/api/v1/products/${id}`,
    TOGGLE_ACTIVE_STATUS: (id: string) => `/api/v1/products/${id}/toggle-active-status`,
  },
  STORAGE: {
    UPLOAD_REQUESTS: "/api/v1/storage/upload-url",
  }
} as const;