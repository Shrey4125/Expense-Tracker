// src/components/expenses/ExpenseList.jsx
import { useState } from 'react';
import { Pencil, Trash2, TrendingDown, Plus } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { Modal } from '../ui/Modal';
import { ExpenseForm } from './ExpenseForm';
import { EXPENSE_CATEGORIES } from '../../hooks/useAnalytics';
import { SearchFilter } from '../ui/SearchFilter';

export const ExpenseList = ({ expenseList, onAdd, onUpdate, onDelete }) => {
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const filtered = expenseList.filter((e) => {
    const matchSearch =
      e.category.toLowerCase().includes(search.toLowerCase()) ||
      (e.description || '').toLowerCase().includes(search.toLowerCase());
    const matchCat = !filterCat || e.category === filterCat;
    const matchFrom = !dateFrom || e.date >= dateFrom;
    const matchTo = !dateTo || e.date <= dateTo;
    return matchSearch && matchCat && matchFrom && matchTo;
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
    if (window.confirm('Delete this expense record?')) await onDelete(id);
  };

  return (
    <div>
      <div className="section-header">
        <div>
          <div className="section-title">Expense Records</div>
          <div className="section-subtitle">{filtered.length} record(s)</div>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          <Plus size={15} /> Add Expense
        </button>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '20px 20px 0' }}>
          <SearchFilter
            searchTerm={search} onSearch={setSearch}
            filterValue={filterCat} onFilter={setFilterCat}
            filterOptions={EXPENSE_CATEGORIES} filterLabel="All Categories"
            dateFrom={dateFrom} dateTo={dateTo}
            onDateFrom={setDateFrom} onDateTo={setDateTo}
          />
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🧾</div>
            <div className="empty-state-text">No expense records</div>
            <div className="empty-state-sub">Click "Add Expense" to log your spending</div>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Category</th>
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
                      <span className={`badge badge-${rec.category}`}>
                        <TrendingDown size={10} style={{ marginRight: 4 }} />
                        {rec.category}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{rec.description || '—'}</td>
                    <td style={{ textAlign: 'right', fontWeight: 700 }} className="text-danger">
                      -{formatCurrency(rec.amount)}
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
          title={editing ? 'Edit Expense' : 'Add Expense'}
          onClose={closeModal}
        >
          <ExpenseForm
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
