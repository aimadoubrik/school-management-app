import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Edit, Trash2, AlertCircle } from 'lucide-react';
import { DataTable } from '../../../components';

const CompetenceTable = ({ competences, sortConfig, onSort, onView, onEdit, onDelete }) => {
  const handleDelete = (competence, e) => {
    e.stopPropagation();
    onDelete(competence);
  };

  const columns = [
    {
      key: 'code_competence',
      label: 'Code',
      sortable: true,
      className: 'font-medium',
    },
    {
      key: 'intitule_competence',
      label: 'Intitulé Compétence',
      sortable: true,
      mobileTruncate: true,
      render: (row) => row.intitule_competence.join(', '),
    },
    {
      key: 'intitule_module',
      label: 'Module',
      sortable: true,
    },
    {
      key: 'filiere',
      label: 'Filière',
      sortable: true,
    },
    {
      key: 'cours',
      label: 'Cours',
      render: (row) => (
        <a href={row.cours} target="_blank" rel="noopener noreferrer" className="link link-primary">
          Cours
        </a>
      ),
    },
    {
      key: 'quiz',
      label: 'Quiz',
      render: (row) => (
        <a href={row.quiz} target="_blank" rel="noopener noreferrer" className="link link-secondary">
          Quiz
        </a>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      className: 'text-right',
      render: (row) => (
        <>
          {/* Desktop actions */}
          <div className="hidden md:flex justify-end gap-2">
            <button
              onClick={() => onView(row)}
              className="btn btn-ghost btn-xs tooltip"
              data-tip="Voir les détails"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => onEdit(row)}
              className="btn btn-ghost btn-xs tooltip"
              data-tip="Modifier"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => handleDelete(row, e)}
              className="btn btn-ghost btn-xs text-error tooltip"
              data-tip="Supprimer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          {/* Mobile actions */}
          <div className="md:hidden">
            <button onClick={() => onView(row)} className="btn btn-ghost btn-sm btn-square">
              <Eye className="w-4 h-4" />
            </button>
            <button onClick={() => onEdit(row)} className="btn btn-ghost btn-sm btn-square">
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => handleDelete(row, e)}
              className="btn btn-ghost btn-sm btn-square text-error"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </>
      ),
    },
  ];

  return (
    <DataTable
      data={competences}
      columns={columns}
      sortConfig={sortConfig}
      onSort={onSort}
      emptyStateProps={{
        icon: AlertCircle,
        title: 'Aucune compétence trouvée',
        description: 'Commencez par ajouter une nouvelle compétence',
      }}
    />
  );
};

export default CompetenceTable;
