'use client'

import React, { useState, useEffect } from 'react';
import FiltersAdmin from './FiltersAdmin';

export default function AttendanceAdmin() {
  const [data, setData] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [niveau, setNiveau] = useState('');
  const [filiere, setFiliere] = useState('');
  const [annee, setAnnee] = useState('');
  const [groupe, setGroupe] = useState('');
  const [cin, setCin] = useState('');
  const [cef, setCef] = useState('');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/secteurs');
        if (!response.ok) throw new Error('Failed to fetch data');
        const result = await response.json();
        const allStudents = getAllStudents(result);
        setData(allStudents);
        setFilteredStudents(allStudents);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [niveau, filiere, annee, groupe, cin, cef, nom, prenom, selectedMonth, data]);

  const getAllStudents = (data) => {
    let allStudents = [];
    
    data.forEach(secteur => {
      Object.entries(secteur.niveaux).forEach(([niveauKey, niveauValue]) => {
        Object.entries(niveauValue.filiere).forEach(([filiereKey, filiereValue]) => {
          Object.entries(filiereValue).forEach(([anneeKey, anneeValue]) => {
            Object.entries(anneeValue).forEach(([groupeKey, students]) => {
              students.forEach(student => {
                allStudents.push({
                  ...student,
                  niveau: niveauKey,
                  filiere: filiereKey,
                  annee: anneeKey,
                  groupe: groupeKey,
                  secteur: secteur.intitule_secteur
                });
              });
            });
          });
        });
      });
    });
    return allStudents;
  };

  const filterStudents = () => {
    const filtered = data.filter(student => 
      (!niveau || student.niveau === niveau) &&
      (!filiere || student.filiere === filiere) &&
      (!annee || student.annee === annee) &&
      (!groupe || student.groupe === groupe) &&
      (!cin || student.cin.toLowerCase().includes(cin.toLowerCase())) &&
      (!cef || student.cef.toLowerCase().includes(cef.toLowerCase())) &&
      (!nom || student.nom.toLowerCase().includes(nom.toLowerCase())) &&
      (!prenom || student.prenom.toLowerCase().includes(prenom.toLowerCase()))
    );
    setFilteredStudents(filtered);
    setCurrentPage(1);
  };

  const handleInputChange = () => {
    setHasChanges(true);
  };

  const handleSave = () => {
    // Implement save logic here
    setIsEditing(false);
    setHasChanges(false);
  };

  const handleCancel = () => {
    // Implement cancel logic here (e.g., reset form to original values)
    setIsEditing(false);
    setHasChanges(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const renderAdminTableHeaders = () => (
    <tr>
      <th colSpan="6">
        {selectedMonth ? `Mois : ${selectedMonth}` : "État Total :"}
      </th>
    </tr>
  );

  const renderAdminTableColumns = () => (
    <tr>
      {selectedMonth ? (
        <>
          <th colSpan="1" className="bg-accent">Nombre AJ</th>
          <th colSpan="1" className="bg-secondary">Nombre ANJ</th>
          <th colSpan="1" className="bg-accent">Nombre Retards</th>
          <th colSpan="1" className="bg-secondary">Sanctions</th>
        </>
      ) : (
        <>
          <th colSpan="1" className="bg-accent">Total AJ</th>
          <th colSpan="1" className="bg-secondary">Total ANJ</th>
          <th colSpan="1" className="bg-accent">Total Retards</th>
          <th colSpan="1" className="bg-secondary">Total Sanctions</th>
        </>
      )}
    </tr>
  );

  const renderAdminTableCells = (student) => (
    selectedMonth ? (
      <>
        <td>
          <input
            type="number"
            min="0"
            className="input input-bordered w-full max-w-xs"
            placeholder="0"
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </td>
        <td>
          <input
            type="number"
            min="0"
            className="input input-bordered w-full max-w-xs"
            placeholder="0"
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </td>
        <td>
          <input
            type="number"
            min="0"
            className="input input-bordered w-full max-w-xs"
            placeholder="0"
            onChange={handleInputChange}
            disabled={!isEditing}
          />
        </td>
        <td>
          <select 
            className="select select-bordered w-full max-w-xs"
            onChange={handleInputChange}
            disabled={!isEditing}
          >
            <option value="">Aucune</option>
            <option value="avertissement">Avertissement</option>
            <option value="blame">Blâme</option>
            <option value="exclusion">Exclusion</option>
          </select>
        </td>
      </>
    ) : (
      <>
        <td>{student.totalAJ || 0}</td>
        <td>{student.totalANJ || 0}</td>
        <td>{student.totalRetards || 0}</td>
        <td>{student.totalSanctions || 0}</td>
      </>
    )
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredStudents.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <FiltersAdmin
        allData={data}
        niveau={niveau}
        filiere={filiere}
        annee={annee}
        groupe={groupe}
        cin={cin}
        cef={cef}
        nom={nom}
        prenom={prenom}
        selectedMonth={selectedMonth}
        onNiveauChange={setNiveau}
        onFiliereChange={setFiliere}
        onAnneeChange={setAnnee}
        onGroupeChange={setGroupe}
        onCinChange={setCin}
        onCefChange={setCef}
        onNomChange={setNom}
        onPrenomChange={setPrenom}
        onMonthChange={setSelectedMonth}
      />

      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        {currentItems.length > 0 ? (
          <>
            <table className="table w-full text-center">
              <thead>
                <tr>
                  <th rowSpan="2">CEF</th>
                  <th rowSpan="2">Nom Complet</th>
                  <th rowSpan="2">Secteur</th>
                  <th rowSpan="2">Niveau</th>
                  <th rowSpan="2">Filière</th>
                  <th rowSpan="2">Année</th>
                  <th rowSpan="2">Groupe</th>
                  {renderAdminTableHeaders()}
                </tr>
                {renderAdminTableColumns()}
              </thead>
              <tbody>
                {currentItems.map((student) => (
                  <tr key={student.cef}>
                    <td>{student.cef}</td>
                    <td>{`${student.nom} ${student.prenom}`}</td>
                    <td>{student.secteur}</td>
                    <td>{student.niveau}</td>
                    <td>{student.filiere}</td>
                    <td>{student.annee}</td>
                    <td>{student.groupe}</td>
                    {renderAdminTableCells(student)}
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-between mt-4 mb-4 px-4">
              <div className="btn-group">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    className={`btn ${currentPage === i + 1 ? 'btn-active' : ''}`}
                    onClick={() => paginate(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <div className="space-x-2 flex flex-wrap gap-2 justify-end">
                <button 
                  className="btn btn-primary" 
                  onClick={handleEdit} 
                  disabled={!selectedMonth || isEditing}
                >
                  Modifier
                </button>
                <button 
                  className="btn btn-success" 
                  onClick={handleSave} 
                  disabled={!selectedMonth || !isEditing || !hasChanges}
                >
                  Enregistrer
                </button>
                <button 
                  className="btn btn-error" 
                  onClick={handleCancel} 
                  disabled={!selectedMonth || !isEditing}
                >
                  Annuler
                </button>
              </div>
            </div>
          </>
        ) : (
          <p className="text-center py-4">Aucun étudiant trouvé pour ces critères.</p>
        )}
      </div>
    </div>
  );
}