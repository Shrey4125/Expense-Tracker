// src/components/auth/Login.jsx
import { useState } from 'react';
import { useAuth } from '../../contexts/useAuth';
import { useNavigate } from 'react-router-dom';
import { validateEmail, validatePassword } from '../../utils/validators';
import { Wallet, Eye, EyeOff, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';

export const Login = ({ onSwitch }) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const validate = () => {
    const e = {};
    if (!validateEmail(form.email)) e.email = 'Enter a valid email address';
    if (!validatePassword(form.password)) e.password = 'Password must be at least 6 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate('/');
    } catch (err) {
      const msg = err.code === 'auth/invalid-credential'
        ? 'Invalid email or password'
        : err.message;
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon"><Wallet size={24} /></div>
          <span className="auth-logo-text">SmartTracker</span>
        </div>

        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">Sign in to manage your finances</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              className={`form-input${errors.email ? ' error' : ''}`}
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                className={`form-input${errors.password ? ' error' : ''}`}
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                style={{ paddingRight: 40 }}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer',
                }}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="form-error">{errors.password}</p>}
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            style={{ justifyContent: 'center', padding: '12px' }}
            disabled={loading}
          >
            {loading ? <span className="spinner-sm" /> : <LogIn size={16} />}
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="auth-switch">
          Don't have an account?{' '}
          <span className="auth-link" onClick={() => (onSwitch ? onSwitch() : navigate('/register'))}>Create one</span>
        </p>
      </div>
    </div>
  );
};
