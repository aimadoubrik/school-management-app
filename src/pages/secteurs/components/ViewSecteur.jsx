import { BookOpen, Code, Building2, Users } from 'lucide-react';
import { DetailView } from '../../../components';

const ViewSecteur = ({ Secteur, onClose, onDelete }) => {
  const fields = [
    {
      key: 'intitule_Secteur',
      label: 'Intitulé Secteur',
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      key: 'code_Secteur',
      label: 'Code Secteur',
      icon: <Code className="w-5 h-5" />,
    },
    {
      key: 'secteur',
      label: 'Secteur',
      icon: <Building2 className="w-5 h-5" />,
    },
    {
      key: 'filieres',
      label: 'Filieres',
      icon: <Users className="w-5 h-5" />,
      render: (data) => (Array.isArray(data.filieres) ? data.filieres.join(', ') : 'Aucun groupe'),
    },
  ];

  return (
    <DetailView
      title="Détails de la Secteur"
      data={Secteur}
      fields={fields}
      onClose={onClose}
      onDelete={onDelete}
      deleteButtonProps={{
        show: true,
        label: 'Supprimer',
        className: 'btn-error',
      }}
      closeButtonProps={{
        show: true,
        label: 'Fermer',
        className: 'btn-ghost',
      }}
    />
  );
};

export default ViewSecteur;
