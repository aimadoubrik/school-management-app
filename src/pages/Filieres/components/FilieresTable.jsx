import { Link } from 'react-router-dom';
import { Eye, Edit, Trash2, Users, ChevronUp, ChevronDown, AlertCircle } from 'lucide-react';
import PropTypes from 'prop-types';

const FilieresTable = ({ filieres, sortConfig, onSort, onView, onEdit, onDelete }) => {
  const SortIcon = ({ column }) => {
    if (sortConfig.key !== column) return null;
    return sortConfig.direction === 'asc' ? (
      <ChevronUp className="w-4 h-4" />
    ) : (
      <ChevronDown className="w-4 h-4" />
    );
  };

  const handleDelete = (filiere, e) => {
    e.stopPropagation();
    onDelete(filiere);
  };

  const renderHeaderCell = (label, key) => (
    <th
      onClick={() => onSort(key)}
      className="cursor-pointer hover:bg-base-300 transition-colors duration-200"
    >
      <div className="flex items-center gap-2">
        {label}
        <SortIcon column={key} />
      </div>
    </th>
  );

  if (!filieres.length) {
    return (
      <div className="card bg-base-100 shadow">
        <div className="card-body items-center text-center py-8">
          <AlertCircle className="w-12 h-12 text-base-content/50 mb-2" />
          <h3 className="text-lg font-semibold">Aucune filière trouvée</h3>
          <p className="text-base-content/70">Commencez par ajouter une nouvelle filière</p>
        </div>
      </div>
    );
  }

  // Desktop view
  const DesktopTable = () => (
    <div className="rounded-lg border bg-base-100 hidden md:block">
      <table className="table table-zebra w-full">
        <thead className="bg-base-200">
          <tr>
            {renderHeaderCell('Code', 'code_filiere')}
            {renderHeaderCell('Intitulé', 'intitule_filiere')}
            {renderHeaderCell('Secteur', 'secteur')}
            <th>Groupes</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filieres.map((filiere) => (
            <tr key={filiere.id} className="hover">
              <td className="font-medium">{filiere.code_filiere}</td>
              <td>{filiere.intitule_filiere}</td>
              <td>
                <span className="badge badge-ghost">{filiere.secteur}</span>
              </td>
              <td>
                <Link
                  to={`/filieres/groupes/${filiere.code_filiere}`}
                  className="btn btn-ghost btn-xs gap-2"
                >
                  <Users className="w-4 h-4" />
                  {Array.isArray(filiere.groupes) ? filiere.groupes.length : 0} groupes
                </Link>
              </td>
              <td>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => onView(filiere)}
                    className="btn btn-ghost btn-xs tooltip"
                    data-tip="Voir les détails"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onEdit(filiere)}
                    className="btn btn-ghost btn-xs tooltip"
                    data-tip="Modifier"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => handleDelete(filiere, e)}
                    className="btn btn-ghost btn-xs text-error tooltip"
                    data-tip="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Mobile view
  const MobileView = () => (
    <div className="md:hidden">
      <div className="divide-y divide-base-200">
        {filieres.map((filiere) => (
          <div key={filiere.id} className="bg-base-100 py-3">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium truncate">{filiere.code_filiere}</span>
                  <span className="badge badge-ghost badge-sm">{filiere.secteur}</span>
                </div>
                <div className="text-sm text-base-content/70 truncate mt-0.5">
                  {filiere.intitule_filiere}
                </div>
                <div className="mt-1">
                  <Link
                    to={`/filieres/groupes/${filiere.code_filiere}`}
                    className="text-xs text-base-content/70 flex items-center gap-1"
                  >
                    <Users className="w-3 h-3" />
                    {Array.isArray(filiere.groupes) ? filiere.groupes.length : 0} groupes
                  </Link>
                </div>
              </div>
              <div className="flex items-center gap-1 pl-2">
                <button onClick={() => onView(filiere)} className="btn btn-ghost btn-sm btn-square">
                  <Eye className="w-4 h-4" />
                </button>
                <button onClick={() => onEdit(filiere)} className="btn btn-ghost btn-sm btn-square">
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => handleDelete(filiere, e)}
                  className="btn btn-ghost btn-sm btn-square text-error"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="w-full">
      <DesktopTable />
      <MobileView />
    </div>
  );
};

FilieresTable.propTypes = {
  filieres: PropTypes.array.isRequired,
  onView: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  sortConfig: PropTypes.shape({
    key: PropTypes.string,
    direction: PropTypes.oneOf(['asc', 'desc']),
  }),
  onSort: PropTypes.func.isRequired,
};

export default FilieresTable;
