// Environment configuration
export const config = {
  // API Configuration
  API_BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',

  // App Configuration
  APP_NAME: 'PanPal',
  APP_VERSION: '1.0.0',

  // Development flags
  IS_DEVELOPMENT: import.meta.env.DEV,
  IS_PRODUCTION: import.meta.env.PROD,

  // Storage keys
  STORAGE_KEYS: {
    ACCESS_TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token',
    USER_DATA: 'user_data',
    EDITED_RECIPES: 'edited-recipes',
  },

  // API Endpoints
  ENDPOINTS: {
    // Auth
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      REFRESH: '/auth/refresh',
      ME: '/auth/me',
    },

    // Recipes
    RECIPES: {
      LIST: '/recipes',
      DETAIL: (id: string) => `/recipes/${id}`,
      CREATE: '/recipes',
      UPDATE: (id: string) => `/recipes/${id}`,
      DELETE: (id: string) => `/recipes/${id}`,
    },

    // Comments (unified with ratings)
    COMMENTS: {
      LIST: '/comments',
      CREATE: '/comments',
      UPDATE: (id: string) => `/comments/${id}`,
      DELETE: (id: string) => `/comments/${id}`,
      TOGGLE_HELPFUL: (id: string) => `/comments/${id}/helpful`,
      UPLOAD_IMAGES: (id: string) => `/comments/${id}/images`,
      RATINGS_SUMMARY: '/comments/ratings-summary',
      CAN_RATE: '/comments/can-rate',
      MY_RATING: '/comments/my-rating',
    },

    // Favorites
    FAVORITES: {
      LIST: '/favorites',
      TOGGLE: '/favorites/toggle',
    },
  },

  // UI Configuration
  UI: {
    TOAST_DURATION: 4000,
    DEBOUNCE_DELAY: 300,
    PAGINATION_SIZE: 12,
  },
} as const;

export default config;
