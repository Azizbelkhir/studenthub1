import { useState, useEffect, useCallback, useRef } from 'react';
import { studentsApi } from '../services/api';
import type { Student, StudentFormData, Pagination } from '../types/student';
import { NIVEAUX, FILIERES } from '../types/student';
import { StudentTable } from '../components/StudentTable';
import { StudentModal } from '../components/StudentModal';
import { ConfirmModal } from '../components/ConfirmModal';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const DownloadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

const FilterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
  </svg>
);

const DEFAULT_PAGINATION: Pagination = { total: 0, page: 1, limit: 10, totalPages: 1 };

export const StudentsPage = () => {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  // Data state
  const [students, setStudents] = useState<Student[]>([]);
  const [pagination, setPagination] = useState<Pagination>(DEFAULT_PAGINATION);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [filterFiliere, setFilterFiliere] = useState('');
  const [filterNiveau, setFilterNiveau] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Modals
  const [addModal, setAddModal] = useState(false);
  const [editStudent, setEditStudent] = useState<Student | null>(null);
  const [deleteStudent, setDeleteStudent] = useState<Student | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  // ─── Load students ──────────────────────────────────────────────────────────
  const loadStudents = useCallback(async (page = currentPage) => {
    setLoading(true);
    try {
      const result = await studentsApi.getAll({
        search: search || undefined,
        filiere: filterFiliere || undefined,
        niveau: filterNiveau || undefined,
        page,
        limit: 10,
      });
      setStudents(result.students);
      setPagination(result.pagination);
    } catch {
      showToast('Erreur lors du chargement des étudiants', 'error');
    } finally {
      setLoading(false);
    }
  }, [search, filterFiliere, filterNiveau, currentPage, showToast]);

  useEffect(() => {
    loadStudents(currentPage);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterFiliere, filterNiveau, currentPage]);

  // Debounced search
  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      loadStudents(1);
    }, 350);
  };

  // ─── CRUD Handlers ──────────────────────────────────────────────────────────
  const handleCreate = async (data: StudentFormData) => {
    setModalLoading(true);
    try {
      await studentsApi.create(data);
      showToast(`${data.prenom} ${data.nom} ajouté avec succès ! 🎉`, 'success');
      setAddModal(false);
      loadStudents(1);
      setCurrentPage(1);
    } catch (err: unknown) {
      showToast((err as Error).message || 'Erreur lors de l\'ajout', 'error');
    } finally {
      setModalLoading(false);
    }
  };

  const handleUpdate = async (data: StudentFormData) => {
    if (!editStudent) return;
    setModalLoading(true);
    try {
      await studentsApi.update(editStudent.id, data);
      showToast('Étudiant modifié avec succès ✓', 'success');
      setEditStudent(null);
      loadStudents(currentPage);
    } catch (err: unknown) {
      showToast((err as Error).message || 'Erreur lors de la modification', 'error');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteStudent) return;
    setModalLoading(true);
    try {
      await studentsApi.delete(deleteStudent.id);
      showToast(`${deleteStudent.prenom} ${deleteStudent.nom} supprimé`, 'success');
      setDeleteStudent(null);
      const newPage = students.length === 1 && currentPage > 1 ? currentPage - 1 : currentPage;
      setCurrentPage(newPage);
      loadStudents(newPage);
    } catch (err: unknown) {
      showToast((err as Error).message || 'Erreur lors de la suppression', 'error');
    } finally {
      setModalLoading(false);
    }
  };

  const hasFilters = search || filterFiliere || filterNiveau;

  const clearFilters = () => {
    setSearch('');
    setFilterFiliere('');
    setFilterNiveau('');
    setCurrentPage(1);
  };

  return (
    <div className="page">
      <div className="page-content">

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <h1 className="page-title" style={{ marginBottom: 8 }}>
                <span className="gradient-text">Gestion des</span>
                <br/>
                <span style={{ color: 'var(--text-primary)' }}>Étudiants</span>
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
                {loading ? 'Chargement...' : (
                  <span>
                    <strong style={{ color: 'var(--text-primary)' }}>{pagination.total}</strong> étudiant{pagination.total !== 1 ? 's' : ''} enregistré{pagination.total !== 1 ? 's' : ''}
                    {hasFilters && <span style={{ color: '#60a5fa' }}> (filtré{pagination.total !== 1 ? 's' : ''})</span>}
                  </span>
                )}
              </p>
            </div>

            <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
              <button onClick={() => studentsApi.exportCSV()} className="btn btn-ghost btn-sm">
                <DownloadIcon /> Export CSV
              </button>
              {isAuthenticated && (
                <button onClick={() => setAddModal(true)} className="btn btn-primary">
                  <PlusIcon /> Ajouter un étudiant
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="glass-card" style={{ padding: '16px 20px', marginBottom: 24 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>

            {/* Search */}
            <div style={{ position: 'relative', flex: '1 1 240px', minWidth: 200 }}>
              <span style={{
                position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
                color: 'var(--text-muted)', pointerEvents: 'none',
              }}>
                <SearchIcon />
              </span>
              <input
                type="text"
                className="input"
                placeholder="Rechercher par nom, prénom, email, numéro..."
                value={search}
                onChange={e => handleSearch(e.target.value)}
                style={{ paddingLeft: 40 }}
              />
            </div>

            {/* Filter Filière */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: '0 1 160px' }}>
              <FilterIcon />
              <select
                className="input select"
                value={filterFiliere}
                onChange={e => { setFilterFiliere(e.target.value); setCurrentPage(1); }}
                style={{ flex: 1 }}
              >
                <option value="">Toutes filières</option>
                {FILIERES.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>

            {/* Filter Niveau */}
            <div style={{ flex: '0 1 140px' }}>
              <select
                className="input select"
                value={filterNiveau}
                onChange={e => { setFilterNiveau(e.target.value); setCurrentPage(1); }}
              >
                <option value="">Tous niveaux</option>
                {NIVEAUX.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>

            {/* Clear filters */}
            {hasFilters && (
              <button onClick={clearFilters} className="btn btn-ghost btn-sm" style={{ flexShrink: 0 }}>
                ✕ Effacer
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '0 24px' }}>
            <StudentTable
              students={students}
              pagination={pagination}
              onEdit={setEditStudent}
              onDelete={setDeleteStudent}
              onPageChange={setCurrentPage}
              isLoading={loading}
              isAuthenticated={isAuthenticated}
            />
          </div>
        </div>

        {/* Auth hint */}
        {!isAuthenticated && (
          <div style={{
            marginTop: 20,
            padding: '14px 20px',
            background: 'rgba(59,130,246,0.06)',
            border: '1px solid rgba(59,130,246,0.15)',
            borderRadius: 'var(--radius-md)',
            fontSize: 13, color: '#60a5fa',
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <span>🔒</span>
            <span>Connectez-vous en tant qu'administrateur pour ajouter, modifier ou supprimer des étudiants.</span>
          </div>
        )}
      </div>

      {/* Modals */}
      <StudentModal
        isOpen={addModal}
        onClose={() => setAddModal(false)}
        onSubmit={handleCreate}
        isLoading={modalLoading}
      />
      <StudentModal
        isOpen={!!editStudent}
        onClose={() => setEditStudent(null)}
        onSubmit={handleUpdate}
        student={editStudent}
        isLoading={modalLoading}
      />
      <ConfirmModal
        isOpen={!!deleteStudent}
        onClose={() => setDeleteStudent(null)}
        onConfirm={handleDelete}
        student={deleteStudent}
        isLoading={modalLoading}
      />
    </div>
  );
};
