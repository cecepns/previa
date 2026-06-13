/**
 * Base URL API — diatur lewat VITE_API_URL di .env
 * Contoh: https://api.kingcreativestudio.my.id/previa/api
 */
export const API_BASE_URL = import.meta.env.VITE_API_URL;

if (!API_BASE_URL) {
  throw new Error(
    'VITE_API_URL belum diset. Salin .env.example ke .env dan isi URL API backend.'
  );
}
