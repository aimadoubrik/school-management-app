import { BookOpen, Code, Building2, Users, Trash2, X } from 'lucide-react';
import PropTypes from 'prop-types';

const ViewFiliere = ({ filiere, onClose, onDelete }) => {
  const detailItems = [
    {
      icon: <BookOpen className="w-5 h-5" />,
      label: 'Intitulé Filière',
      value: filiere.intitule_filiere,
    },
    {
      icon: <Code className="w-5 h-5" />,
      label: 'Code Filière',
      value: filiere.code_filiere,
    },
    {
      icon: <Building2 className="w-5 h-5" />,
      label: 'Secteur',
      value: filiere.secteur,
    },
    {
      icon: <Users className="w-5 h-5" />,
      label: 'Groupes',
      value: Array.isArray(filiere.groupes) ? filiere.groupes.join(', ') : 'Aucun groupe',
    },
  ];

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">Détails de la Filière</h2>

      <div className="card bg-base-100">
        <div className="card-body p-4 space-y-6">
          {detailItems.map((item, index) => (
            <div key={index} className="flex items-start space-x-4">
              <div className="text-primary">{item.icon}</div>
              <div className="flex-1">
                <h3 className="font-semibold text-base-content/70">{item.label}</h3>
                <p className="text-lg">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="modal-action mt-6">
        <button onClick={onClose} className="btn btn-ghost gap-2">
          <X className="w-4 h-4" />
          Fermer
        </button>
        <button onClick={() => onDelete(filiere)} className="btn btn-error gap-2">
          <Trash2 className="w-4 h-4" />
          Supprimer
        </button>
      </div>
    </div>
  );
};

ViewFiliere.propTypes = {
  filiere: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default ViewFiliere;
