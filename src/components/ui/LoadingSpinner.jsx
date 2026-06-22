// src/components/ui/LoadingSpinner.jsx
export const LoadingSpinner = ({ fullPage = false }) => {
  if (fullPage) {
    return (
      <div className="loading-screen">
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 16px' }} />
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Loading...</p>
        </div>
      </div>
    );
  }
  return <div className="spinner" />;
};
