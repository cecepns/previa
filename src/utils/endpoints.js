export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PROFILE: '/auth/profile',
  },
  ADMIN: {
    PROFILE: '/admin/profile',
    DASHBOARD_STATS: '/admin/dashboard/stats',
    USERS: {
      LIST: '/admin/users',
      DETAIL: (id) => `/admin/users/${id}`,
    },
    QUIZ: {
      LIST: '/admin/quiz/questions',
      DETAIL: (id) => `/admin/quiz/questions/${id}`,
    },
    LITERACY: {
      LIST: '/admin/literacy/topics',
      DETAIL: (id) => `/admin/literacy/topics/${id}`,
    },
    SENAM_OTAK: {
      LIST: '/admin/senam-otak/videos',
      DETAIL: (id) => `/admin/senam-otak/videos/${id}`,
    },
  },
};
