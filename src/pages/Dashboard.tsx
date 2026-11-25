import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from '../router';
import { statsApi, studentsApi } from '../services/api';
import type { StatsData, Student } from '../types/student';
import { StatCard } from '../components/StatCard';
import { Charts } from '../components/Charts';

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

const RefreshIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10"/>
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
  </svg>
);

export const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<StatsData | null>(null);
  const [recentStudents, setRecentStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsData, studentsData] = await Promise.all([
        statsApi.get(),
        studentsApi.getAll({ limit: 5, page: 1 }),
      ]);
      setStats(statsData);
      setRecentStudents(studentsData.students);
    } catch {
      setError('Impossible de charger les données. Vérifiez que le backend est démarré.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  const FILIERES_COLOR_MAP: Record<string, string> = {
    'IoT': '#3b82f6', 'Informatique': '#8b5cf6', 'Réseaux': '#06b6d4',
    'Cybersécurité': '#10b981', 'IA': '#f59e0b',
  };

  return (
    <div className="page">
      <div className="page-content">

        {/* Hero Header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              {/* Badge */}
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '6px 14px',
                background: 'rgba(59,130,246,0.1)',
                border: '1px solid rgba(59,130,246,0.2)',
                borderRadius: '100px',
                fontSize: 12, fontWeight: 600,
                color: '#60a5fa',
                marginBottom: 16,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#60a5fa', boxShadow: '0 0 6px #60a5fa', animation: 'pulse 2s infinite' }}/>
                EPI Sousse · IoT · Cloud Computing 2026-2027
              </div>

              <h1 className="page-title" style={{ marginBottom: 12 }}>
                <span className="gradient-text">StudentHub</span>{' '}
                <span style={{ color: 'var(--text-primary)' }}>Cloud</span>
              </h1>
              <p style={{ fontSize: 16, color: 'var(--text-secondary)', maxWidth: 500, lineHeight: 1.6 }}>
                Plateforme de gestion des étudiants — hébergée sur{' '}
                <span style={{ color: '#60a5fa', fontWeight: 600 }}>Microsoft Azure</span>
              </p>
            </div>

            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <button onClick={loadData} className="btn btn-ghost btn-sm" disabled={loading}>
                <RefreshIcon /> Actualiser
              </button>
              <button onClick={() => navigate('/students')} className="btn btn-primary">
                Gérer les étudiants <ArrowRightIcon />
              </button>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div style={{
            padding: 20, marginBottom: 32,
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: 'var(--radius-md)',
            color: '#f87171', fontSize: 14,
            display: 'flex', alignItems: 'center', gap: 12,
          }}>
            <span style={{ fontSize: 20 }}>⚠️</span>
            <div>
              <strong>Erreur de connexion</strong>
              <div style={{ color: 'rgba(248,113,113,0.8)', fontSize: 13, marginTop: 4 }}>{error}</div>
            </div>
            <button onClick={loadData} className="btn btn-ghost btn-sm" style={{ marginLeft: 'auto' }}>
              Réessayer
            </button>
          </div>
        )}

        {/* KPI Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 20,
          marginBottom: 36,
        }}>
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="glass-card" style={{ padding: 24, height: 140 }}>
                <div className="skeleton" style={{ height: 20, width: '60%', marginBottom: 12 }}/>
                <div className="skeleton" style={{ height: 40, width: '40%', marginBottom: 8 }}/>
                <div className="skeleton" style={{ height: 14, width: '80%' }}/>
              </div>
            ))
          ) : stats ? (
            <>
              <StatCard
                title="Total Étudiants"
                value={stats.total}
                subtitle="Inscrits dans le système"
                icon="🎓"
                gradient="linear-gradient(135deg, #3b82f6, #2563eb)"
                glowColor="rgba(59,130,246,0.25)"
                delay={0}
              />
              <StatCard
                title="Filières actives"
                value={stats.totalFilieres}
                subtitle="Spécialités disponibles"
                icon="📚"
                gradient="linear-gradient(135deg, #8b5cf6, #7c3aed)"
                glowColor="rgba(139,92,246,0.25)"
                delay={80}
              />
              <StatCard
                title="Niveaux d'études"
                value={stats.byNiveau.length}
                subtitle="De L1 à Ing3"
                icon="🏆"
                gradient="linear-gradient(135deg, #06b6d4, #0891b2)"
                glowColor="rgba(6,182,212,0.25)"
                delay={160}
              />
              <StatCard
                title="Ajoutés récemment"
                value={stats.recent}
                subtitle="Ces 7 derniers jours"
                icon="✨"
                gradient="linear-gradient(135deg, #10b981, #059669)"
                glowColor="rgba(16,185,129,0.25)"
                delay={240}
              />
            </>
          ) : null}
        </div>

        {/* Charts Section */}
        {stats && !loading && (
          <div style={{ marginBottom: 36 }}>
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>📊 Statistiques</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
                Vue d'ensemble des inscriptions par filière et niveau
              </p>
            </div>
            <Charts stats={stats} />
          </div>
        )}

        {/* Recent Students */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>👥 Étudiants récents</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Les dernières inscriptions</p>
            </div>
            <button onClick={() => navigate('/students')} className="btn btn-ghost btn-sm">
              Voir tous <ArrowRightIcon />
            </button>
          </div>

          <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
            {loading ? (
              <div style={{ padding: 24 }}>
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                    <div className="skeleton" style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0 }}/>
                    <div style={{ flex: 1 }}>
                      <div className="skeleton" style={{ height: 14, width: '40%', marginBottom: 8 }}/>
                      <div className="skeleton" style={{ height: 12, width: '60%' }}/>
                    </div>
                  </div>
                ))}
              </div>
            ) : recentStudents.length === 0 ? (
              <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
                <p>Aucun étudiant enregistré</p>
              </div>
            ) : (
              <div>
                {recentStudents.map((s, i) => {
                  const fColor = FILIERES_COLOR_MAP[s.filiere] || '#3b82f6';
                  const initials = `${s.prenom[0] ?? ''}${s.nom[0] ?? ''}`.toUpperCase();
                  return (
                    <div key={s.id} style={{
                      display: 'flex', alignItems: 'center', gap: 16,
                      padding: '16px 24px',
                      borderBottom: i < recentStudents.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                      transition: 'background 0.15s ease',
                      cursor: 'default',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-glass-hover)')}
                    onMouseLeave={e => (e.currentTarget.style.background = '')}
                    >
                      {/* Avatar */}
                      <div style={{
                        width: 42, height: 42, borderRadius: '50%',
                        background: `${fColor}22`, border: `2px solid ${fColor}44`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 14, fontWeight: 700, color: fColor, flexShrink: 0,
                      }}>
                        {initials}
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 2 }}>
                          {s.prenom} {s.nom}
                        </div>
                        <div style={{ fontSize: 13, color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {s.email}
                        </div>
                      </div>

                      {/* Badges */}
                      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                        <span style={{
                          padding: '3px 10px', borderRadius: '100px', fontSize: 12, fontWeight: 600,
                          background: `${fColor}18`, color: fColor, border: `1px solid ${fColor}30`,
                        }}>
                          {s.filiere}
                        </span>
                        <span className="badge badge-blue">{s.niveau}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid var(--border-subtle)', textAlign: 'center' }}>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            🎓 <strong style={{ color: 'var(--text-secondary)' }}>StudentHub Cloud</strong> · Projet Cloud Computing ·{' '}
            <strong style={{ color: 'var(--text-secondary)' }}>EPI Sousse</strong> · 2026-2027 ·
            Hébergé sur{' '}
            <span style={{ color: '#60a5fa' }}>Microsoft Azure</span>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};
