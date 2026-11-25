import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import type { Student, StudentFormData } from '../types/student';
import { NIVEAUX, FILIERES } from '../types/student';

interface StudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: StudentFormData) => Promise<void>;
  student?: Student | null;
  isLoading?: boolean;
}

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const SaveIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
    <polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/>
  </svg>
);

const EMPTY_FORM: StudentFormData = { nom: '', prenom: '', email: '', filiere: '', niveau: '' };

export const StudentModal = ({ isOpen, onClose, onSubmit, student, isLoading }: StudentModalProps) => {
  const [form, setForm] = useState<StudentFormData>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (student) {
      setForm({ nom: student.nom, prenom: student.prenom, email: student.email, filiere: student.filiere, niveau: student.niveau });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
  }, [student, isOpen]);

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.nom.trim())    e['nom']    = 'Le nom est requis';
    if (!form.prenom.trim()) e['prenom'] = 'Le prénom est requis';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e['email'] = 'Email invalide';
    if (!form.filiere)       e['filiere'] = 'La filière est requise';
    if (!form.niveau)        e['niveau']  = 'Le niveau est requis';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(form);
  };

  const set = (field: keyof StudentFormData) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors(prev => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  if (!isOpen) return null;

  const isEdit = !!student;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content animate-slide-up">

        {/* Header */}
        <div className="modal-header">
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.01em' }}>
              {isEdit ? '✏️ Modifier l\'étudiant' : '➕ Nouvel étudiant'}
            </h2>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
              {isEdit ? `Modifier les informations de ${student?.prenom} ${student?.nom}` : 'Remplissez les informations de l\'étudiant'}
            </p>
          </div>
          <button onClick={onClose} className="btn btn-ghost btn-icon" style={{ color: 'var(--text-secondary)' }}>
            <CloseIcon />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

            {/* Nom */}
            <div className="form-group">
              <label className="label">Nom *</label>
              <input
                type="text"
                className="input"
                placeholder="ex: Ben Ali"
                value={form.nom}
                onChange={set('nom')}
                style={errors.nom ? { borderColor: 'var(--danger)' } : {}}
              />
              {errors.nom && <span className="form-error">{errors.nom}</span>}
            </div>

            {/* Prénom */}
            <div className="form-group">
              <label className="label">Prénom *</label>
              <input
                type="text"
                className="input"
                placeholder="ex: Ahmed"
                value={form.prenom}
                onChange={set('prenom')}
                style={errors.prenom ? { borderColor: 'var(--danger)' } : {}}
              />
              {errors.prenom && <span className="form-error">{errors.prenom}</span>}
            </div>

            {/* Email — full width */}
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="label">Email *</label>
              <input
                type="email"
                className="input"
                placeholder="ex: ahmed.benali@epi.tn"
                value={form.email}
                onChange={set('email')}
                style={errors.email ? { borderColor: 'var(--danger)' } : {}}
              />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </div>

            {/* Filière */}
            <div className="form-group">
              <label className="label">Filière *</label>
              <select
                className="input select"
                value={form.filiere}
                onChange={set('filiere')}
                style={errors.filiere ? { borderColor: 'var(--danger)' } : {}}
              >
                <option value="">Choisir une filière</option>
                {FILIERES.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
              {errors.filiere && <span className="form-error">{errors.filiere}</span>}
            </div>

            {/* Niveau */}
            <div className="form-group">
              <label className="label">Niveau d'études *</label>
              <select
                className="input select"
                value={form.niveau}
                onChange={set('niveau')}
                style={errors.niveau ? { borderColor: 'var(--danger)' } : {}}
              >
                <option value="">Choisir un niveau</option>
                {NIVEAUX.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
              {errors.niveau && <span className="form-error">{errors.niveau}</span>}
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-ghost">
              Annuler
            </button>
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.6s linear infinite', display: 'inline-block' }}/>
                  Enregistrement...
                </span>
              ) : (
                <>
                  <SaveIcon />
                  {isEdit ? 'Enregistrer' : 'Ajouter l\'étudiant'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};
