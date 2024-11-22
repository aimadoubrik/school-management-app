import { SearchFilter } from '../../../components';
import { Search, Filter } from 'lucide-react';

const CompetenceSearch = ({ searchTerm, filters, onSearchChange, onFilterChange }) => (
  <SearchFilter
    searchTerm={searchTerm}
    filters={filters}
    onSearchChange={onSearchChange}
    onFilterChange={onFilterChange}
    searchPlaceholder="Rechercher par code ou intitulé..."
    icons={{ SearchIcon: Search }}
  />
);

export default CompetenceSearch;
