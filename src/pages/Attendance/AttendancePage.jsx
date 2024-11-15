import { useState, useEffect } from 'react'
import { Calendar } from 'lucide-react'

<<<<<<< HEAD:src/pages/Attendance/Attendance.jsx
export default function Component() {
  const [data, setData] = useState(null)
  const [secteurs, setSecteurs] = useState([])
  const [filieres, setFilieres] = useState([])
  const [groupes, setGroupes] = useState([])
  const [secteur, setSecteur] = useState('')
  const [filiere, setFiliere] = useState('')
  const [groupe, setGroupe] = useState('')
  const [students, setStudents] = useState([])
  const [editing, setEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState(null)
  const [dateFilter, setDateFilter] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal open state
  const [absentStudents, setAbsentStudents] = useState([]); // List of absent students
=======
function AttendancePage() {
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
>>>>>>> 9d7f1b8a9be9942558d7c5c9a7a03f248207733a:src/pages/Attendance/AttendancePage.jsx

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:4000/secteur')
        if (!response.ok) {
          throw new Error('Failed to fetch data')
        }
        const result = await response.json()
        setData(result)
        setSecteurs(Object.keys(result))
      } catch (error) {
        console.error('Error fetching data:', error)
        setError('Failed to load data. Please try again.')
      }
    }

    fetchData()
  }, [])

  const fetchAbsentStudents = async (selectedDate) => {
    try {
      const response = await fetch(`http://localhost:3000/absentStudents?date=${selectedDate}&secteur=${secteur}&filiere=${filiere}&groupe=${groupe}`);
      const result = await response.json();
      console.log('Fetched absent students:', result);
      setAbsentStudents(result);  // Set the absent students state
      setIsModalOpen(true);  // Open the modal when the data is fetched
    } catch (error) {
      console.error('Error fetching absent students:', error);
      setError('Failed to load absent students. Please try again.');
    }
  };

  // When date is selected
  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    const formattedDate = new Date(selectedDate).toISOString().split('T')[0];  // Format as YYYY-MM-DD
    setDateFilter(formattedDate);

    fetchAbsentStudents(formattedDate);  // Fetch absent students when date is selected
  };

  const saveSelectionsToAPI = async (updatedStudents) => {
    try {
      const response = await fetch('http://localhost:3000/absentStudents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          secteur,
          filiere,
          groupe,
          date: dateFilter,  // Make sure the date is passed here
          students: updatedStudents.map(student => ({
            studentId: student.id,
            studentCef: student.cef,
            studentName: student.fullname,
            studentCin: student.cin,
            isAbsent: student.selected,
          })),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save selections')
      }

      return await response.json()
    } catch (error) {
      console.error('Error saving selections:', error)
      throw error
    }
  }

  const saveSelections = async () => {
    setIsSaving(true)
    setError(null)

    try {
      // Only update the selected students (those marked as absent) in the current group
      const updatedStudents = students.map((student) => ({
        ...student,
        selected: student.selected,  // Ensure the `selected` property is updated
      }))

      // Save the updated absence data to the API
      await saveSelectionsToAPI(updatedStudents)

      // Update local data
      setData((prevData) => {
        const newData = { ...prevData }

        // Update only the specific group selected, not the entire data
        if (newData[secteur] && newData[secteur][filiere]) {
          newData[secteur][filiere][groupe] = updatedStudents
        }

        return newData
      })

      setStudents(updatedStudents)
      setEditing(false)
    } catch (error) {
      setError('Failed to save selections. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSecteurChange = (e) => {
    const value = e.target.value
    setSecteur(value)
    setFilieres(Object.keys(data[value] || {}))
    setFiliere('')
    setGroupe('')
    setStudents([])
    setEditing(false)
  }

  const handleFiliereChange = (e) => {
    const value = e.target.value
    setFiliere(value)
    setGroupes(Object.keys(data[secteur][value] || {}))
    setGroupe('')
    setStudents([])
    setEditing(false)
  }

  const handleGroupeChange = (e) => {
    const value = e.target.value
    setGroupe(value)
    setStudents(data[secteur][filiere][value] || [])
    setEditing(true)
  }

  const handleCheckboxChange = (id) => {
    setStudents((prevStudents) =>
      prevStudents.map((s) => (s.id === id ? { ...s, selected: !s.selected } : s))
    )
  }

  const handleCancel = () => {
    setStudents((prevStudents) => prevStudents.map((s) => ({ ...s, selected: false })))
  }

  const handleEdit = () => {
    setEditing(true)
  }



  const closeModal = () => {
    setIsModalOpen(false)  // Close modal
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {error && (
        <div className="alert alert-error mb-4">
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <select className="select select-bordered w-full" value={secteur} onChange={handleSecteurChange}>
          <option value="">Select Secteur</option>
          {secteurs.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          className="select select-bordered w-full"
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
          className="select select-bordered w-full"
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

        <div className="relative">
          <input
            type="date"
            className="input input-bordered w-full pr-10"
            value={dateFilter}
            onChange={handleDateChange} // Update date filter
          />
          <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
      </div>

      <div className="overflow-x-auto bg-base-100 rounded-lg shadow-lg mb-6">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Action</th>
              <th>CEF</th>
              <th>Full Name</th>
              <th>Date de Naissance</th>
              <th>CIN</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary"
                    checked={student.selected}
                    onChange={() => handleCheckboxChange(student.id)}
                    disabled={isSaving || !editing}
                  />
                </td>
                <td>{student.cef}</td>
                <td>{student.fullname}</td>
                <td>{student.dateNaissance}</td>
                <td>{student.cin}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end space-x-4">
        {editing && (
          <button onClick={handleCancel} className="btn btn-ghost mr-2">
            Cancel
          </button>
        )}
        {editing && (
          <button
            onClick={saveSelections}
            className="btn btn-primary"
            disabled={isSaving || !students.some((s) => s.selected)}
          >
            {isSaving ? 'Saving...' : 'Save Selections'}
          </button>
        )}
        {!editing && (
          <button onClick={handleEdit} className="btn btn-secondary">
            Edit Selections
          </button>
        )}
      </div>

      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h2 className="text-xl font-semibold">Absent Students on {dateFilter}</h2>

            <table className="table table-auto w-full mt-4">
              <thead>
                <tr>
                  <th>CEF</th>
                  <th>Full Name</th>
                  <th>CIN</th>
                </tr>
              </thead>
              <tbody>
                {absentStudents.length > 0 ? (
                  absentStudents.map((student) => (
                    <tr key={student.id}>
                      <td>{student.cef}</td>
                      <td>{student.fullname}</td>
                      <td>{student.cin}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">No absent students for this date.</td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="modal-action">
              <button
                className="btn btn-secondary"
                onClick={() => setIsModalOpen(false)}  // Close the modal
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
<<<<<<< HEAD:src/pages/Attendance/Attendance.jsx
=======

export default AttendancePage;
>>>>>>> 9d7f1b8a9be9942558d7c5c9a7a03f248207733a:src/pages/Attendance/AttendancePage.jsx
