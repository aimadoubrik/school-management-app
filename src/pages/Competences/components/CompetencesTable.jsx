// src/components/CompetenceTable.js

import React from 'react';
import { Eye, Edit, Trash } from 'lucide-react';

const CompetenceTable = ({ competences, onView, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>Code</th>
            <th>Intitulé Competence</th>
            <th>Intitulé Module</th>
            <th>Filière</th>
            <th>Cours</th>
            <th>Quiz</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {competences.length > 0 ? (
            competences.map((competence) => (
              <tr key={competence.id}>
                <td>{competence.code_competence}</td>
                <td>{competence.intitule_competence.join(', ')}</td>
                <td>{competence.intitule_module}</td>
                <td>{competence.filiere}</td>
                <td>
                  <a href={competence.cours} target="_blank" rel="noopener noreferrer">
                    Cours
                  </a>
                </td>
                <td>
                  <a href={competence.quiz} target="_blank" rel="noopener noreferrer">
                    Quiz
                  </a>
                </td>
                <td className="flex gap-2">
                  <button className="btn btn-info btn-sm" onClick={() => onView(competence)}>
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="btn btn-success btn-sm" onClick={() => onEdit(competence)}>
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="btn btn-error btn-sm" onClick={() => onDelete(competence)}>
                    <Trash className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center">
                No competences available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CompetenceTable;
