import PropTypes from 'prop-types';

const TableHeader = ({ title, actions }) => (
  <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
    <h1 className="text-2xl font-bold">{title}</h1>
    <div className="flex gap-2">
      {actions.map((action, index) => (
        <button
          key={index}
          onClick={action.onClick}
          className={action.className}
          data-tip={action.tooltip}
        >
          {action.icon && <action.icon className="w-4 h-4" />}
          {action.label && <span>{action.label}</span>}
        </button>
      ))}
    </div>
  </div>
);

TableHeader.propTypes = {
  title: PropTypes.string.isRequired,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string, // Optional label for the button
      icon: PropTypes.elementType, // Icon component
      onClick: PropTypes.func.isRequired, // Action handler
      className: PropTypes.string, // Tailwind classes for styling
      tooltip: PropTypes.string, // Tooltip text (optional)
    })
  ).isRequired,
};

export default TableHeader;
