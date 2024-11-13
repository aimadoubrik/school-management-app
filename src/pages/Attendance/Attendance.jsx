import { useState, useEffect } from 'react';

function Attendance() {
  const [data, setData] = useState(null);
  const [secteurs, setSecteurs] = useState([]);
  const [filieres, setFilieres] = useState([]);
  const [groupes, setGroupes] = useState([]);
  const [secteur, setSecteur] = useState('');
  const [filiere, setFiliere] = useState('');
  const [groupe, setGroupe] = useState('');
  const [students, setStudents] = useState([]);
  const [editing, setEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3002/secteur');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const result = await response.json();
        setData(result);
        setSecteurs(Object.keys(result));
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try again.');
      }
    };

    fetchData();
  }, []);

  const saveSelectionsToAPI = async (updatedStudents) => {
    try {
      const response = await fetch('http://localhost:3002/secteur', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          secteur,
          filiere,
          groupe,
          students: updatedStudents,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save selections');
      }

      return await response.json();
    } catch (error) {
      console.error('Error saving selections:', error);
      throw error;
    }
  };

  const saveSelections = async () => {
    setIsSaving(true);
    setError(null);

    try {
      const updatedStudents = students.map((student) => ({
        ...student,
        selected: student.selected,
      }));

      const updatedData = await saveSelectionsToAPI(updatedStudents);

      setData((prevData) => {
        const newData = { ...prevData };
        if (newData[secteur] && newData[secteur][filiere]) {
          newData[secteur][filiere][groupe] = updatedStudents;
        }
        return newData;
      });

      setStudents(updatedStudents);
      setEditing(false);
    } catch (error) {
      setError('Failed to save selections. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSecteurChange = (e) => {
    const value = e.target.value;
    setSecteur(value);
    setFilieres(Object.keys(data[value] || {}));
    setFiliere('');
    setGroupe('');
    setStudents([]);
  };

  const handleFiliereChange = (e) => {
    const value = e.target.value;
    setFiliere(value);
    setGroupes(Object.keys(data[secteur][value] || {}));
    setGroupe('');
    setStudents([]);
  };

  const handleGroupeChange = (e) => {
    const value = e.target.value;
    setGroupe(value);
    setStudents(data[secteur][filiere][value] || []);
  };

  const handleCheckboxChange = (id) => {
    if (editing) {
      setStudents((prevStudents) =>
        prevStudents.map((s) => (s.id === id ? { ...s, selected: !s.selected } : s))
      );
    }
  };

  const handleCancel = () => {
    if (!isSaving) {
      setStudents((prevStudents) => prevStudents.map((s) => ({ ...s, selected: false })));
      setEditing(false);
    }
  };

  const handleEdit = () => {
    setEditing(true);
    setStudents((prevStudents) => prevStudents.map((s) => ({ ...s, selected: false })));
  };

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <select
          className="select select-bordered w-full"
          value={secteur}
          onChange={handleSecteurChange}
        >
          <option value="">Select Secteur</option>
          {secteurs.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          className="select select-bordered w-full disabled:bg-base-200"
          value={filiere}
          onChange={handleFiliereChange}
          disabled={!secteur}
        >
          <option value="">Select Filière</option>
          {filieres.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>

        <select
          className="select select-bordered w-full disabled:bg-base-200"
          value={groupe}
          onChange={handleGroupeChange}
          disabled={!filiere}
        >
          <option value="">Select Groupe</option>
          {groupes.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>

      {students.length > 0 && (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>CEF</th>
                <th>Full Name</th>
                <th>Date de Naissance</th>
                <th>CIN</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>{student.cef}</td>
                  <td>{student.fullname}</td>
                  <td>{student.dateNaissance}</td>
                  <td>{student.cin}</td>
                  <td>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary"
                      checked={student.selected}
                      onChange={() => handleCheckboxChange(student.id)}
                      disabled={isSaving || !editing}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6 space-x-2">
        <button className="btn btn-neutral" onClick={handleCancel} disabled={isSaving}>
          Cancel
        </button>
        <button className="btn btn-success" onClick={saveSelections} disabled={isSaving}>
          {isSaving ? <span className="loading loading-spinner loading-sm"></span> : 'Save'}
        </button>
        <button className="btn btn-primary" onClick={handleEdit}>
          Edit
        </button>
      </div>
    </div>
  );
}

export default Attendance;
