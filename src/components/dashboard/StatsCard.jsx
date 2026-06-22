// src/components/dashboard/StatsCard.jsx
export const StatsCard = ({ label, value, sub, icon, type }) => {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${type}`}>{icon}</div>
      <div className="stat-info">
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value}</div>
        {sub && <div className="stat-sub">{sub}</div>}
      </div>
    </div>
  );
};
