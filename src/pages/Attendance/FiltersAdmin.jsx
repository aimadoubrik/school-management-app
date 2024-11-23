'use client';

import React, { useEffect, useState } from 'react';
import { X, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

export default function FiltersAdmin({
  allData = [],
  niveau = '',
  filiere = '',
  annee = '',
  groupe = '',
  cin = '',
  cef = '',
  nom = '',
  prenom = '',
  selectedMonth = '',
  onNiveauChange = () => { },
  onFiliereChange = () => { },
  onAnneeChange = () => { },
  onGroupeChange = () => { },
  onCinChange = () => { },
  onCefChange = () => { },
  onNomChange = () => { },
  onPrenomChange = () => { },
  onMonthChange = () => { },
  filteredStudents = [],
}) {
  const [filteredFilieres, setFilteredFilieres] = useState([]);
  const [filteredAnnees, setFilteredAnnees] = useState([]);
  const [filteredGroupes, setFilteredGroupes] = useState([]);

  useEffect(() => {
    if (!Array.isArray(allData)) {
      console.error('allData is not an array:', allData);
      return;
    }

    // Filter filieres based on selected niveau
    const newFilteredFilieres = niveau
      ? [...new Set(allData.filter((item) => item.niveau === niveau).map((item) => item.filiere))]
      : [...new Set(allData.map((item) => item.filiere))];
    setFilteredFilieres(newFilteredFilieres);

    // Reset filiere if it's not in the new filtered list
    if (filiere && !newFilteredFilieres.includes(filiere)) {
      onFiliereChange('');
    }
  }, [niveau, allData, filiere, onFiliereChange]);

  useEffect(() => {
    if (!Array.isArray(allData)) return;

    // Filter annees based on selected niveau and filiere
    const newFilteredAnnees = allData
      .filter(
        (item) => (!niveau || item.niveau === niveau) && (!filiere || item.filiere === filiere)
      )
      .map((item) => item.annee);
    setFilteredAnnees([...new Set(newFilteredAnnees)]);

    // Reset annee if it's not in the new filtered list
    if (annee && !newFilteredAnnees.includes(annee)) {
      onAnneeChange('');
    }
  }, [niveau, filiere, allData, annee, onAnneeChange]);

  useEffect(() => {
    if (!Array.isArray(allData)) return;

    // Filter groupes based on selected niveau, filiere, and annee
    const newFilteredGroupes = allData
      .filter(
        (item) =>
          (!niveau || item.niveau === niveau) &&
          (!filiere || item.filiere === filiere) &&
          (!annee || item.annee === annee)
      )
      .map((item) => item.groupe);
    setFilteredGroupes([...new Set(newFilteredGroupes)]);

    // Reset groupe if it's not in the new filtered list
    if (groupe && !newFilteredGroupes.includes(groupe)) {
      onGroupeChange('');
    }
  }, [niveau, filiere, annee, allData, groupe, onGroupeChange]);

  const renderSelect = (value, onChange, options, placeholder) => (
    <select
      className="select select-bordered select-sm w-full"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );

  const renderSearchInput = (value, onChange, placeholder) => (
    <input
      type="text"
      className="input input-bordered input-sm w-full"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );

  const clearAllFilters = () => {
    onNiveauChange('');
    onFiliereChange('');
    onAnneeChange('');
    onGroupeChange('');
    onCinChange('');
    onCefChange('');
    onNomChange('');
    onPrenomChange('');
    onMonthChange('');
  };

  const exportToPDF = () => {
    const doc = new jsPDF('l', 'mm', 'a4'); // Set to landscape mode
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 10;
    const tableWidth = pageWidth - margin - 5; // 5 is the new right margin

    doc.setFontSize(18);
    doc.text('Student Attendance and Discipline Report', pageWidth / 2, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, margin, 30);
    
    doc.autoTable({
      startY: 40,
      tableWidth: tableWidth,
      head: [['CEF', 'Nom Complet', 'Secteur', 'Niveau', 'Filière', 'Année', 'Groupe', 'AJ', 'ANJ', 'Retards', 'Sanctions Assiduité', 'Observations SA', 'Sanctions Comportement', 'Observations SC', 'Note Discipline']],
      body: filteredStudents.map(student => [
        student.cef,
        student.fullname,
        student.secteur,
        student.niveau,
        student.filiere,
        student.annee,
        student.groupe,
        student.aj || 0,
        selectedMonth ? (student.anj[selectedMonth] || 0) : student.totalANJ,
        student.retards || 0,
        student.sanctionAssiduite || 'aucune',
        student.observationSA || '',
        student.sanctionComportement || 'aucune',
        student.observationSC || '',
        student.disciplineNote || 15
      ]),
      styles: { fontSize: 8, cellPadding: 2 },
      columnStyles: {
        0: { cellWidth: 20 }, // CEF
        1: { cellWidth: 30 }, // Nom Complet
        2: { cellWidth: 20 }, // Secteur
        3: { cellWidth: 15 }, // Niveau
        4: { cellWidth: 20 }, // Filière
        5: { cellWidth: 15 }, // Année
        6: { cellWidth: 15 }, // Groupe
        7: { cellWidth: 10 }, // AJ
        8: { cellWidth: 10 }, // ANJ
        9: { cellWidth: 15 }, // Retards
        10: { cellWidth: 25 }, // Sanctions Assiduité
        11: { cellWidth: 25 }, // Observations SA
        12: { cellWidth: 25 }, // Sanctions Comportement
        13: { cellWidth: 25 }, // Observations SC
        14: { cellWidth: 20 }  // Note Discipline
      },
      headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [224, 224, 224] },
      margin: { top: 40, right: 5, bottom: margin, left: margin },
    });

    // Add page numbers
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(`Page ${i} of ${pageCount}`, pageWidth - 20, pageHeight - 10);
    }

    doc.save('student_attendance_and_discipline.pdf');
  };

  const exportToCSV = () => {
    const headers = ['CEF', 'Nom Complet', 'Secteur', 'Niveau', 'Filière', 'Année', 'Groupe', 'AJ', 'ANJ', 'Retards', 'Sanctions Assiduité', 'Observations SA', 'Sanctions Comportement', 'Observations SC', 'Note Discipline'];
    const data = filteredStudents.map(student => [
      student.cef,
      student.fullname,
      student.secteur,
      student.niveau,
      student.filiere,
      student.annee,
      student.groupe,
      student.aj || 0,
      selectedMonth ? (student.anj[selectedMonth] || 0) : student.totalANJ,
      student.retards || 0,
      student.sanctionAssiduite || 'aucune',
      student.observationSA || '',
      student.sanctionComportement || 'aucune',
      student.observationSC || '',
      student.disciplineNote || 15
    ]);
    const csvContent = [headers, ...data].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'student_attendance_and_discipline.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (!Array.isArray(allData)) {
    return <div className="text-red-500">Error: Invalid data format</div>;
  }

  return (
    <div className="bg-base-200 p-4 rounded-lg shadow-md mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {renderSelect(
          niveau,
          onNiveauChange,
          [...new Set(allData.map((item) => item.niveau))],
          'Niveau'
        )}
        {renderSelect(filiere, onFiliereChange, filteredFilieres, 'Filière')}
        {renderSelect(annee, onAnneeChange, filteredAnnees, 'Année')}
        {renderSelect(groupe, onGroupeChange, filteredGroupes, 'Groupe')}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {renderSearchInput(cin, onCinChange, 'CIN')}
        {renderSearchInput(cef, onCefChange, 'CEF')}
        {renderSearchInput(nom, onNomChange, 'Nom')}
        {renderSearchInput(prenom, onPrenomChange, 'Prénom')}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <select
          className="select select-bordered select-sm w-full"
          value={selectedMonth}
          onChange={(e) => onMonthChange(e.target.value)}
        >
          <option value="">Tous les mois</option>
          <option value="Janvier">Janvier</option>
          <option value="Février">Février</option>
          <option value="Mars">Mars</option>
          <option value="Avril">Avril</option>
          <option value="Mai">Mai</option>
          <option value="Juin">Juin</option>
          <option value="Juillet">Juillet</option>
          <option value="Août">Août</option>
          <option value="Septembre">Septembre</option>
          <option value="Octobre">Octobre</option>
          <option value="Novembre">Novembre</option>
          <option value="Décembre">Décembre</option>
        </select>
      </div>

      <div className="flex justify-center space-x-2 mt-4">
        <button className="btn btn-secondary btn-sm" onClick={clearAllFilters}>
          <X className="mr-2" size={16} />
          Effacer les filtres
        </button>
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-primary btn-sm">
            <Download className="mr-2" size={16} />
            Exporter
          </label>
          <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
            <li><a onClick={exportToPDF}>Exporter en PDF</a></li>
            <li><a onClick={exportToCSV}>Exporter en CSV</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

