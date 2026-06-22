// src/components/income/IncomeList.jsx
import { useState } from 'react';
import { Pencil, Trash2, TrendingUp, Plus } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Modal } from '../ui/Modal';
import { IncomeForm } from './IncomeForm';
import { SearchFilter } from '../ui/SearchFilter';

export const IncomeList = ({ incomeList, onAdd, onUpdate, onDelete }) => {
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filterSource, setFilterSource] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const sources = [...new Set(incomeList.map((i) => i.source))];

  const filtered = incomeList.filter((i) => {
    const matchSearch =
      i.source.toLowerCase().includes(search.toLowerCase()) ||
      (i.description || '').toLowerCase().includes(search.toLowerCase());
    const matchSource = !filterSource || i.source === filterSource;
    const matchFrom = !dateFrom || i.date >= dateFrom;
    const matchTo = !dateTo || i.date <= dateTo;
    return matchSearch && matchSource && matchFrom && matchTo;
  });

  const openAdd = () => { setEditing(null); setShowModal(true); };
  const openEdit = (rec) => { setEditing(rec); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditing(null); };

  const handleSubmit = async (data) => {
    setFormLoading(true);
    if (editing) await onUpdate(editing.id, data);
    else await onAdd(data);
    setFormLoading(false);
    closeModal();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this income record?')) await onDelete(id);
  };

  return (
    <div>
      <div className="section-header">
        <div>
          <div className="section-title">Income Records</div>
          <div className="section-subtitle">{filtered.length} record(s)</div>
        </div>
        <button className="btn btn-success" onClick={openAdd}>
          <Plus size={15} /> Add Income
        </button>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '20px 20px 0' }}>
          <SearchFilter
            searchTerm={search} onSearch={setSearch}
            filterValue={filterSource} onFilter={setFilterSource}
            filterOptions={sources} filterLabel="All Sources"
            dateFrom={dateFrom} dateTo={dateTo}
            onDateFrom={setDateFrom} onDateTo={setDateTo}
          />
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">💰</div>
            <div className="empty-state-text">No income records</div>
            <div className="empty-state-sub">Click "Add Income" to log your earnings</div>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Source</th>
                  <th>Description</th>
                  <th style={{ textAlign: 'right' }}>Amount</th>
                  <th style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((rec) => (
                  <tr key={rec.id}>
                    <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{formatDate(rec.date)}</td>
                    <td>
                      <span className="badge badge-income">
                        <TrendingUp size={10} style={{ marginRight: 4 }} />
                        {rec.source}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{rec.description || '—'}</td>
                    <td style={{ textAlign: 'right', fontWeight: 700 }} className="text-success">
                      +{formatCurrency(rec.amount)}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                        <button className="btn-icon edit" onClick={() => openEdit(rec)} title="Edit">
                          <Pencil size={13} />
                        </button>
                        <button className="btn-icon danger" onClick={() => handleDelete(rec.id)} title="Delete">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <Modal
          title={editing ? 'Edit Income' : 'Add Income'}
          onClose={closeModal}
        >
          <IncomeForm
            initial={editing}
            onSubmit={handleSubmit}
            onCancel={closeModal}
            loading={formLoading}
          />
        </Modal>
      )}
    </div>
  );
};
