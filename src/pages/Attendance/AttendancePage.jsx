import React, { useState, useEffect } from 'react';
import Filters from './Filters';

export default function AttendanceFormateur() {
  const [secteursData, setSecteursData] = useState([]);
  const [secteur, setSecteur] = useState('');
  const [niveau, setNiveau] = useState('');
  const [filiere, setFiliere] = useState('');
  const [annee, setAnnee] = useState('');
  const [groupe, setGroupe] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [students, setStudents] = useState([]);
  const [editing, setEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [absentStudents, setAbsentStudents] = useState([]);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchSecteursData = async () => {
      try {
        const response = await fetch('http://localhost:3000/secteurs');
        const data = await response.json();
        setSecteursData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchSecteursData();
  }, []);

  useEffect(() => {
    if (secteur && niveau && filiere && annee && groupe) {
      const selectedSecteur = secteursData.find(
        (s) => s.intitule_secteur === secteur
      );
      if (selectedSecteur) {
        const groupData =
          selectedSecteur.niveaux[niveau]?.filiere[filiere]?.[annee]?.[groupe];
        setStudents(groupData?.map(student => ({ ...student, selected: false })) || []);
      }
    } else {
      setStudents([]);
    }
  }, [secteur, niveau, filiere, annee, groupe, secteursData]);

  const isDateInPast = (selectedDate) => {
    const today = new Date().toISOString().split('T')[0];
    return selectedDate < today;
  };

  const fetchAbsentStudents = async () => {
    try {
      const response = await fetch('http://localhost:3000/absentStudents', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to fetch absent students');
      const data = await response.json();
      setAbsentStudents(data);
    } catch (error) {
      console.error('Error fetching absent students:', error);
      setError('Failed to fetch absent students. Please try again.');
    }
  };

  useEffect(() => {
    if (isDateInPast(dateFilter)) {
      fetchAbsentStudents();
    }
  }, [dateFilter, niveau, filiere, annee, groupe]);

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;

    // Check if the date is valid
    const parsedDate = new Date(selectedDate);
    if (isNaN(parsedDate.getTime())) {
      setError('Invalid date selected.');
      return; // Exit the function if the date is invalid
    }

    const formattedDate = parsedDate.toISOString().split('T')[0];
    setDateFilter(formattedDate);

    // Only allow editing for future dates
    setEditing(!isDateInPast(formattedDate));
    setIsSaved(false);
  };

  const handleCheckboxChange = (studentId) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === studentId ? { ...student, selected: !student.selected } : student
      )
    );
  };

  const saveSelectionsToAPI = async (absentStudents) => {
    try {
      const response = await fetch('http://localhost:3000/absentStudents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          niveau,
          filiere,
          annee,
          groupe,
          date: dateFilter,
          month: new Date(dateFilter).toISOString().slice(0, 7),
          students: absentStudents.map((student) => ({
            studentId: student.id,
            studentCef: student.cef,
            studentName: student.fullname,
            studentDateN: student.dateNaissance,
            studentCin: student.cin,
            isAbsent: student.selected,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save absent students');
      }
    } catch (error) {
      console.error('Error saving absent students:', error);
      setError('Failed to save absent students. Please try again.');
    }
  };

  const saveSelections = async () => {
    setIsSaving(true);
    setError(null);

    try {
      const absentStudents = students.filter((s) => s.selected);
      if (absentStudents.length === 0) {
        setError('No students marked as absent.');
        setIsSaving(false);
        return;
      }
      await saveSelectionsToAPI(absentStudents);
      setIsSaving(false);
      setIsSaved(true);
    } catch {
      setError('Failed to save selections.');
      setIsSaving(false);
    }
  };

  return (
    <div className="p-4">
      <Filters
        secteursData={secteursData}
        secteur={secteur}
        niveau={niveau}
        filiere={filiere}
        annee={annee}
        groupe={groupe}
        dateFilter={dateFilter}
        onSecteurChange={setSecteur}
        onNiveauChange={setNiveau}
        onFiliereChange={setFiliere}
        onAnneeChange={setAnnee}
        onGroupeChange={setGroupe}
        onDateChange={handleDateChange}
      />

      <div className="overflow-x-auto bg-base-100 rounded-lg shadow-lg mb-6">
        <table className="table w-full">
          <thead>
            <tr>
              {editing && <th>Action</th>}
              <th>CEF</th>
              <th>Full Name</th>
              <th>Date de Naissance</th>
              <th>CIN</th>
            </tr>
          </thead>
          <tbody>
            {isDateInPast(dateFilter) ? (
              absentStudents.length > 0 ? (
                absentStudents
                  .filter(
                    (record) =>
                      record.niveau === niveau &&
                      record.filiere === filiere &&
                      record.annee === annee &&
                      record.groupe === groupe &&
                      new Date(record.date).toISOString().split('T')[0] === dateFilter
                  )
                  .map((record) =>
                    record?.students?.length > 0 ? (
                      record?.students?.map((student) => (
                        <tr key={student.studentId}>
                          <td>{student.studentCef}</td>
                          <td>{student.studentName}</td>
                          <td>{student.studentDateN}</td>
                          <td>{student.studentCin}</td>
                          <td>
                            {student.isAbsent ? (
                              <span className="text-red-500">Absent</span>
                            ) : (
                              <span className="text-green-500">Present</span>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr key={record.id}>
                        <td colSpan="5" className="text-center">
                          No students registered for this date.
                        </td>
                      </tr>
                    )
                  )
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    No absent students data available for this date.
                  </td>
                </tr>
              )
            ) : (
              students.length > 0 ? (
                students.map((student) => (
                  <tr key={student.id}>
                    {editing && (
                      <td>
                        <input
                          type="checkbox"
                          className="checkbox checkbox-primary"
                          checked={student.selected}
                          onChange={() => handleCheckboxChange(student.id)}
                          disabled={!editing}
                        />
                      </td>
                    )}
                    <td>{student.cef}</td>
                    <td>{student.fullname}</td>
                    <td>{student.dateNaissance}</td>
                    <td>{student.cin}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center">
                    No students available for this selection.
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center gap-4">
        <button
          className="btn btn-primary"
          onClick={saveSelections}
          disabled={isSaving || !editing}
        >
          {isSaving ? 'Saving...' : 'Save Absences'}
        </button>
      </div>

      {error && <div className="text-red-500 mt-4">{error}</div>}
      {isSaved && <div className="text-green-500 mt-4">Selections saved successfully!</div>}
    </div>
  );
}