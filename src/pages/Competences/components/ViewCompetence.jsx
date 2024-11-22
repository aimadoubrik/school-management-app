import React from 'react';
import { BookOpen, Code, Users } from 'lucide-react';
import { DetailView } from '../../../components';

const ViewCompetence = ({ competence, closeModal }) => {
  const fields = [
    {
      key: 'intitule_competence',
      label: 'Intitulé Compétence',
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      key: 'intitule_module',
      label: 'Intitulé Module',
      icon: <Code className="w-5 h-5" />,
    },
    {
      key: 'filiere',
      label: 'Filière',
      icon: <Users className="w-5 h-5" />,
    },
  ];

  return (
    <DetailView
      title="Détails de la Compétence"
      data={competence}
      fields={fields}
      onClose={closeModal}
      deleteButtonProps={{
        show: false,
      }}
      closeButtonProps={{
        show: true,
        label: 'Fermer',
        className: 'btn-ghost',
      }}
    />
  );
};

export default ViewCompetence;
