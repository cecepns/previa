import { api } from './api';

export async function getRequest(url, params = {}) {
  const response = await api.get(url, { params });
  return response.data;
}

export async function postRequest(url, data = {}) {
  const response = await api.post(url, data);
  return response.data;
}

export async function putRequest(url, data = {}) {
  const response = await api.put(url, data);
  return response.data;
}

export async function deleteRequest(url) {
  const response = await api.delete(url);
  return response.data;
}

export function getErrorMessage(error, fallback = 'Terjadi kesalahan') {
  return error?.response?.data?.message || error?.message || fallback;
}
