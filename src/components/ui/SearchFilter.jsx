// src/components/ui/SearchFilter.jsx
import { Search } from 'lucide-react';

export const SearchFilter = ({
  searchTerm, onSearch,
  filterValue, onFilter,
  filterOptions = [],
  filterLabel = 'All',
  dateFrom, dateTo, onDateFrom, onDateTo,
}) => {
  return (
    <div className="filter-bar">
      <div className="search-input-wrap">
        <Search size={15} className="search-icon" />
        <input
          className="search-input"
          type="text"
          placeholder="Search transactions..."
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      {filterOptions.length > 0 && (
        <select
          className="filter-select"
          value={filterValue}
          onChange={(e) => onFilter(e.target.value)}
        >
          <option value="">{filterLabel}</option>
          {filterOptions.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      )}

      <input
        type="date"
        className="filter-select"
        value={dateFrom}
        onChange={(e) => onDateFrom(e.target.value)}
        title="From date"
      />
      <input
        type="date"
        className="filter-select"
        value={dateTo}
        onChange={(e) => onDateTo(e.target.value)}
        title="To date"
      />
    </div>
  );
};
