import PropTypes from 'prop-types';

const SearchFilter = ({
  searchTerm,
  filters = [],
  onSearchChange,
  onFilterChange,
  searchPlaceholder = 'Search...',
  icons: { SearchIcon = null } = {},
}) => (
  <div className="flex flex-col sm:flex-row gap-4">
    {/* Search Input */}
    <div className="relative flex-1">
      {SearchIcon && (
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 w-4 h-4" />
      )}
      <input
        type="text"
        placeholder={searchPlaceholder}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="input input-bordered w-full pl-10"
      />
    </div>

    {/* Filters */}
    <div className="flex flex-wrap gap-2 items-center">
      {filters.map((filter, index) => (
        <div key={index} className="flex gap-2 items-center">
          {filter.icon && <filter.icon className="w-4 h-4 text-base-content/50" />}
          <select
            value={filter.value}
            onChange={(e) => onFilterChange(filter.key, e.target.value)}
            className="select select-bordered"
          >
            <option value="">{filter.placeholder}</option>
            {filter.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  </div>
);

SearchFilter.propTypes = {
  searchTerm: PropTypes.string.isRequired, // Current value of the search input
  filters: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired, // Unique key for the filter
      value: PropTypes.string.isRequired, // Current selected value
      placeholder: PropTypes.string, // Placeholder for the dropdown
      options: PropTypes.arrayOf(PropTypes.string).isRequired, // Options for the dropdown
      icon: PropTypes.elementType, // Optional icon for the filter
    })
  ).isRequired,
  onSearchChange: PropTypes.func.isRequired, // Handler for search input changes
  onFilterChange: PropTypes.func.isRequired, // Handler for filter dropdown changes
  searchPlaceholder: PropTypes.string, // Placeholder for the search input
  icons: PropTypes.shape({
    SearchIcon: PropTypes.elementType, // Icon for search input
  }),
};

export default SearchFilter;
