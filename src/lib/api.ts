export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.princewebwork.com";

export const api = {
  register: `${API_BASE_URL}/auth/register`,
  login: `${API_BASE_URL}/auth/login`,
  refresh: `${API_BASE_URL}/auth/refresh`,
  me: `${API_BASE_URL}/auth/me`,
  leads: `${API_BASE_URL}/leads`,
  calls: `${API_BASE_URL}/calls`,
  tasks: `${API_BASE_URL}/tasks`,
};
