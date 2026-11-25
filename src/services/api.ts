import type { Student, StudentFormData, StatsData, ApiResponse, Pagination } from '../types/student';

const API_BASE = import.meta.env['VITE_API_URL'] || 'http://localhost:5000/api';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('studenthub_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const handleResponse = async <T>(res: Response): Promise<ApiResponse<T>> => {
  const data = await res.json() as ApiResponse<T>;
  if (!res.ok) {
    throw new Error(data.message || `Erreur HTTP ${res.status}`);
  }
  return data;
};

// ─── Auth API ─────────────────────────────────────────────────────────────────

export const authApi = {
  login: async (username: string, password: string): Promise<{ token: string; admin: { username: string } }> => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await handleResponse<never>(res);
    return data as unknown as { token: string; admin: { username: string } };
  },

  verify: async (): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/auth/verify`, {
        headers: getAuthHeaders(),
      });
      return res.ok;
    } catch {
      return false;
    }
  },
};

// ─── Students API ─────────────────────────────────────────────────────────────

export interface GetStudentsParams {
  search?: string;
  filiere?: string;
  niveau?: string;
  page?: number;
  limit?: number;
}

export interface GetStudentsResult {
  students: Student[];
  pagination: Pagination;
}

export const studentsApi = {
  getAll: async (params: GetStudentsParams = {}): Promise<GetStudentsResult> => {
    const query = new URLSearchParams();
    if (params.search)  query.set('search', params.search);
    if (params.filiere) query.set('filiere', params.filiere);
    if (params.niveau)  query.set('niveau', params.niveau);
    if (params.page)    query.set('page', String(params.page));
    if (params.limit)   query.set('limit', String(params.limit));

    const res = await fetch(`${API_BASE}/students?${query.toString()}`);
    const data = await handleResponse<Student[]>(res);
    return {
      students: data.data || [],
      pagination: data.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 },
    };
  },

  getById: async (id: number): Promise<Student> => {
    const res = await fetch(`${API_BASE}/students/${id}`);
    const data = await handleResponse<Student>(res);
    return data.data!;
  },

  create: async (student: StudentFormData): Promise<Student> => {
    const res = await fetch(`${API_BASE}/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(student),
    });
    const data = await handleResponse<Student>(res);
    return data.data!;
  },

  update: async (id: number, student: StudentFormData): Promise<Student> => {
    const res = await fetch(`${API_BASE}/students/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify(student),
    });
    const data = await handleResponse<Student>(res);
    return data.data!;
  },

  delete: async (id: number): Promise<void> => {
    const res = await fetch(`${API_BASE}/students/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    await handleResponse<never>(res);
  },

  exportCSV: (): void => {
    window.open(`${API_BASE}/students/export/csv`, '_blank');
  },
};

// ─── Stats API ────────────────────────────────────────────────────────────────

export const statsApi = {
  get: async (): Promise<StatsData> => {
    const res = await fetch(`${API_BASE}/stats`);
    const data = await handleResponse<StatsData>(res);
    return data.data!;
  },
};
