// src/components/auth/Register.jsx
import { useState } from 'react';
import { useAuth } from '../../contexts/useAuth';
import { useNavigate } from 'react-router-dom';
import { validateEmail, validatePassword, validateRequired } from '../../utils/validators';
import { Wallet, Eye, EyeOff, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';

export const Register = ({ onSwitch }) => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const validate = () => {
    const e = {};
    if (!validateRequired(form.name)) e.name = 'Name is required';
    if (!validateEmail(form.email)) e.email = 'Enter a valid email address';
    if (!validatePassword(form.password)) e.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await register(form.email, form.password, form.name);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (err) {
      const msg = err.code === 'auth/email-already-in-use'
        ? 'Email already in use'
        : err.message;
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const field = (key, label, type = 'text', placeholder = '') => (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <input
        className={`form-input${errors[key] ? ' error' : ''}`}
        type={type}
        placeholder={placeholder}
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
      />
      {errors[key] && <p className="form-error">{errors[key]}</p>}
    </div>
  );

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon"><Wallet size={24} /></div>
          <span className="auth-logo-text">SmartTracker</span>
        </div>

        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Start tracking your finances today</p>

        <form onSubmit={handleSubmit}>
          {field('name', 'Full Name', 'text', 'John Doe')}
          {field('email', 'Email Address', 'email', 'you@example.com')}

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                className={`form-input${errors.password ? ' error' : ''}`}
                type={showPass ? 'text' : 'password'}
                placeholder="Min. 6 characters"
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

          {field('confirm', 'Confirm Password', 'password', 'Re-enter password')}

          <button
            type="submit"
            className="btn btn-primary w-full"
            style={{ justifyContent: 'center', padding: '12px' }}
            disabled={loading}
          >
            {loading ? <span className="spinner-sm" /> : <UserPlus size={16} />}
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{' '}
          <span className="auth-link" onClick={() => (onSwitch ? onSwitch() : navigate('/login'))}>Sign in</span>
        </p>
      </div>
    </div>
  );
};
