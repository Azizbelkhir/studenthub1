// Types TypeScript pour l'application StudentHub Cloud

export interface Student {
  id: number;
  numero: string;
  nom: string;
  prenom: string;
  email: string;
  filiere: string;
  niveau: Niveau;
  date_inscription: string;
  created_at: string;
  updated_at: string;
}

export type Niveau = 'L1' | 'L2' | 'L3' | 'M1' | 'M2' | 'Ing1' | 'Ing2' | 'Ing3';

export interface StudentFormData {
  nom: string;
  prenom: string;
  email: string;
  filiere: string;
  niveau: Niveau | '';
}

export interface StatsData {
  total: number;
  recent: number;
  totalFilieres: number;
  byFiliere: { filiere: string; count: number }[];
  byNiveau: { niveau: string; count: number }[];
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  pagination?: Pagination;
  errors?: { msg: string }[];
}

export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  username: string | null;
}

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

// Couleurs par filière (pour les charts)
export const FILIERE_COLORS: Record<string, string> = {
  'IoT':           '#3b82f6',
  'Informatique':  '#8b5cf6',
  'Réseaux':       '#06b6d4',
  'Cybersécurité': '#10b981',
  'IA':            '#f59e0b',
  'Mobile':        '#ef4444',
  'Cloud':         '#ec4899',
  'Data':          '#14b8a6',
};

// Couleurs par niveau
export const NIVEAU_COLORS: Record<string, string> = {
  'L1': '#64748b', 'L2': '#475569', 'L3': '#334155',
  'M1': '#3b82f6', 'M2': '#2563eb',
  'Ing1': '#8b5cf6', 'Ing2': '#7c3aed', 'Ing3': '#6d28d9',
};

export const NIVEAUX: Niveau[] = ['L1', 'L2', 'L3', 'M1', 'M2', 'Ing1', 'Ing2', 'Ing3'];

export const FILIERES = [
  'IoT', 'Informatique', 'Réseaux', 'Cybersécurité',
  'IA', 'Mobile', 'Cloud', 'Data', 'Génie Logiciel'
];
