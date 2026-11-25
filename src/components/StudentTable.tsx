import type { Student, Pagination } from '../types/student';
import { FILIERE_COLORS } from '../types/student';

interface StudentTableProps {
  students: Student[];
  pagination: Pagination;
  onEdit: (student: Student) => void;
  onDelete: (student: Student) => void;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
  isAuthenticated: boolean;
}

const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);

const DeleteIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);

const ChevronLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);

const ChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

const NIVEAU_BADGE: Record<string, string> = {
  'L1':'badge-purple','L2':'badge-purple','L3':'badge-purple',
  'M1':'badge-blue','M2':'badge-blue',
  'Ing1':'badge-cyan','Ing2':'badge-cyan','Ing3':'badge-cyan',
};

const formatDate = (dateStr: string): string => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
};

// Skeleton row
const SkeletonRow = () => (
  <tr>
    {[80, 120, 120, 180, 100, 80, 90].map((w, i) => (
      <td key={i} style={{ padding: '14px 16px' }}>
        <div className="skeleton" style={{ height: 16, width: w, borderRadius: 4 }} />
      </td>
    ))}
  </tr>
);

export const StudentTable = ({
  students, pagination, onEdit, onDelete, onPageChange, isLoading, isAuthenticated
}: StudentTableProps) => {
  const { page, totalPages, total, limit } = pagination;
  const startEntry = (page - 1) * limit + 1;
  const endEntry = Math.min(page * limit, total);

  const initials = (prenom: string, nom: string) =>
    `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase();

  const avatarColor = (s: string): string => {
    const colors = ['#3b82f6','#8b5cf6','#06b6d4','#10b981','#f59e0b','#ef4444','#ec4899'];
    let hash = 0;
    for (let i = 0; i < s.length; i++) hash = s.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length]!;
  };

  return (
    <div>
      {/* Table */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>N°</th>
              <th>Étudiant</th>
              <th>Email</th>
              <th>Filière</th>
              <th>Niveau</th>
              <th>Inscription</th>
              {isAuthenticated && <th style={{ textAlign: 'right' }}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
            ) : students.length === 0 ? (
              <tr>
                <td colSpan={isAuthenticated ? 7 : 6}>
                  <div className="table-empty">
                    <div style={{ fontSize: 48, marginBottom: 12 }}>🎓</div>
                    <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>Aucun étudiant trouvé</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
                      Modifiez vos filtres ou ajoutez un nouvel étudiant
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              students.map((student, idx) => {
                const color = avatarColor(student.nom);
                const filiereColor = FILIERE_COLORS[student.filiere] || '#3b82f6';
                return (
                  <tr key={student.id} style={{ animationDelay: `${idx * 30}ms` }}>
                    {/* Numéro */}
                    <td data-label="N°">
                      <span style={{
                        fontSize: 12, fontWeight: 700,
                        color: 'var(--text-secondary)',
                        fontFamily: 'monospace',
                        background: 'var(--bg-surface-2)',
                        padding: '3px 8px',
                        borderRadius: 6,
                        border: '1px solid var(--border-subtle)',
                      }}>
                        {student.numero}
                      </span>
                    </td>

                    {/* Étudiant */}
                    <td data-label="Étudiant">
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 36, height: 36,
                          borderRadius: '50%',
                          background: `${color}22`,
                          border: `2px solid ${color}44`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 13, fontWeight: 700, color,
                          flexShrink: 0,
                        }}>
                          {initials(student.prenom, student.nom)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 14 }}>
                            {student.prenom} {student.nom}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td data-label="Email">
                      <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                        {student.email}
                      </span>
                    </td>

                    {/* Filière */}
                    <td data-label="Filière">
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        padding: '4px 10px',
                        borderRadius: '100px',
                        fontSize: 12, fontWeight: 600,
                        background: `${filiereColor}18`,
                        color: filiereColor,
                        border: `1px solid ${filiereColor}30`,
                      }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: filiereColor, flexShrink: 0 }}/>
                        {student.filiere}
                      </span>
                    </td>

                    {/* Niveau */}
                    <td data-label="Niveau">
                      <span className={`badge ${NIVEAU_BADGE[student.niveau] || 'badge-blue'}`}>
                        {student.niveau}
                      </span>
                    </td>

                    {/* Date */}
                    <td data-label="Inscription">
                      <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                        {formatDate(student.date_inscription || student.created_at)}
                      </span>
                    </td>

                    {/* Actions */}
                    {isAuthenticated && (
                      <td data-label="Actions">
                        <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => onEdit(student)}
                            className="btn btn-ghost btn-icon btn-sm"
                            title="Modifier"
                            style={{ color: '#60a5fa' }}
                          >
                            <EditIcon />
                          </button>
                          <button
                            onClick={() => onDelete(student)}
                            className="btn btn-ghost btn-icon btn-sm"
                            title="Supprimer"
                            style={{ color: 'var(--danger)' }}
                          >
                            <DeleteIcon />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {total > 0 && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 4px', marginTop: 8,
          flexWrap: 'wrap', gap: 12,
        }}>
          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            Affichage de <strong style={{ color: 'var(--text-primary)' }}>{startEntry}–{endEntry}</strong> sur{' '}
            <strong style={{ color: 'var(--text-primary)' }}>{total}</strong> étudiants
          </span>

          <div className="pagination">
            <button
              className="page-btn"
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
            >
              <ChevronLeft />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .reduce<(number | '...')[]>((acc, p, i, arr) => {
                if (i > 0 && (arr[i - 1] as number) < p - 1) acc.push('...');
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === '...' ? (
                  <span key={`ellipsis-${i}`} style={{ color: 'var(--text-muted)', padding: '0 4px' }}>…</span>
                ) : (
                  <button
                    key={p}
                    className={`page-btn ${p === page ? 'active' : ''}`}
                    onClick={() => onPageChange(p as number)}
                  >
                    {p}
                  </button>
                )
              )}

            <button
              className="page-btn"
              onClick={() => onPageChange(page + 1)}
              disabled={page >= totalPages}
            >
              <ChevronRight />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
