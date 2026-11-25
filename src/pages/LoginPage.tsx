import { useState, type FormEvent } from 'react';
import { useNavigate } from '../router';
import { authApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const EyeIcon = ({ show }: { show: boolean }) => show ? (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
) : (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [form, setForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      showToast('Veuillez remplir tous les champs', 'error');
      return;
    }
    setLoading(true);
    try {
      const result = await authApi.login(form.username, form.password);
      login(result.token, result.admin.username);
      showToast(`Bienvenue, ${result.admin.username} ! 👋`, 'success');
      navigate('/students');
    } catch (err: unknown) {
      showToast((err as Error).message || 'Identifiants incorrects', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page" style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh',
      background: `
        radial-gradient(ellipse 60% 50% at 30% 40%, rgba(59,130,246,0.08) 0%, transparent 60%),
        radial-gradient(ellipse 50% 40% at 70% 60%, rgba(139,92,246,0.06) 0%, transparent 50%),
        var(--bg-base)
      `,
    }}>
      <div style={{ width: '100%', maxWidth: 420, padding: '0 24px', animation: 'slideUp 0.4s ease' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            width: 72, height: 72,
            borderRadius: 20,
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
            fontSize: 36,
            boxShadow: '0 8px 32px rgba(59,130,246,0.4)',
          }}>
            🎓
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 8 }}>
            <span className="gradient-text">Admin</span>{' '}
            <span style={{ color: 'var(--text-primary)' }}>Portal</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            Connectez-vous pour gérer StudentHub Cloud
          </p>
        </div>

        {/* Card */}
        <div className="glass-panel" style={{ padding: '36px 32px' }}>

          {/* Demo credentials hint */}
          <div style={{
            padding: '12px 16px',
            background: 'rgba(59,130,246,0.08)',
            border: '1px solid rgba(59,130,246,0.15)',
            borderRadius: 'var(--radius-md)',
            marginBottom: 28,
            fontSize: 13,
            color: '#60a5fa',
          }}>
            <strong>Demo :</strong> admin / admin123
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Username */}
            <div className="form-group">
              <label className="label">Nom d'utilisateur</label>
              <input
                type="text"
                className="input"
                placeholder="admin"
                value={form.username}
                onChange={e => setForm(p => ({ ...p, username: e.target.value }))}
                autoComplete="username"
                autoFocus
              />
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="label">Mot de passe</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  autoComplete="current-password"
                  style={{ paddingRight: 44 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--text-muted)', display: 'flex', alignItems: 'center',
                    padding: 2,
                  }}
                >
                  <EyeIcon show={showPassword} />
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={loading}
              style={{ width: '100%', marginTop: 8 }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{
                    width: 18, height: 18,
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: 'white',
                    borderRadius: '50%',
                    animation: 'spin 0.6s linear infinite',
                    display: 'inline-block',
                  }}/>
                  Connexion...
                </span>
              ) : (
                '🔐 Se connecter'
              )}
            </button>
          </form>
        </div>

        {/* Back link */}
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <button
            onClick={() => navigate('/')}
            className="btn btn-ghost btn-sm"
            style={{ color: 'var(--text-secondary)' }}
          >
            ← Retour au dashboard
          </button>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};
