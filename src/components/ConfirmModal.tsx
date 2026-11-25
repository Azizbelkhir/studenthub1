import type { Student } from '../types/student';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  student: Student | null;
  isLoading?: boolean;
}

const WarnIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

export const ConfirmModal = ({ isOpen, onClose, onConfirm, student, isLoading }: ConfirmModalProps) => {
  if (!isOpen || !student) return null;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content animate-slide-up" style={{ maxWidth: 420 }}>
        <div style={{ padding: '32px 28px 28px', textAlign: 'center' }}>

          {/* Icon */}
          <div style={{
            width: 64, height: 64,
            borderRadius: '50%',
            background: 'rgba(239,68,68,0.1)',
            border: '2px solid rgba(239,68,68,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
            color: 'var(--danger)',
          }}>
            <WarnIcon />
          </div>

          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>
            Confirmer la suppression
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6, marginBottom: 8 }}>
            Vous êtes sur le point de supprimer l'étudiant :
          </p>
          <div style={{
            padding: '12px 20px',
            background: 'rgba(239,68,68,0.06)',
            border: '1px solid rgba(239,68,68,0.15)',
            borderRadius: 'var(--radius-md)',
            marginBottom: 24,
          }}>
            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
              {student.prenom} {student.nom}
            </span>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)', marginLeft: 8 }}>
              ({student.numero})
            </span>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 }}>
            Cette action est irréversible.
          </p>

          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={onClose} className="btn btn-ghost" style={{ flex: 1 }}>
              Annuler
            </button>
            <button onClick={onConfirm} className="btn btn-danger" style={{ flex: 1 }} disabled={isLoading}>
              {isLoading ? 'Suppression...' : '🗑 Supprimer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
