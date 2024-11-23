import React, { useState, useEffect } from 'react'
import FiltersAdmin from './FiltersAdmin'
import { Edit, Save, X } from 'lucide-react'

export default function AttendanceAdmin() {
  const [data, setData] = useState([])
  const [filteredStudents, setFilteredStudents] = useState([])
  const [niveau, setNiveau] = useState('')
  const [filiere, setFiliere] = useState('')
  const [annee, setAnnee] = useState('')
  const [groupe, setGroupe] = useState('')
  const [cin, setCin] = useState('')
  const [cef, setCef] = useState('')
  const [nom, setNom] = useState('')
  const [prenom, setPrenom] = useState('')
  const [selectedMonth, setSelectedMonth] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(7)
  const [editedAbsences, setEditedAbsences] = useState({})
  const [isEditing, setIsEditing] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [sanctions, setSanctions] = useState({})
  const [absentStudents, setAbsentStudents] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [secteurResponse, absentResponse] = await Promise.all([
          fetch('http://localhost:3000/secteurs'),
          fetch('http://localhost:3000/absentStudents')
        ])
        if (!secteurResponse.ok || !absentResponse.ok) throw new Error('Failed to fetch data')
        const secteurResult = await secteurResponse.json()
        const absentResult = await absentResponse.json()
        setAbsentStudents(absentResult)
        const allStudents = getAllStudents(secteurResult, absentResult)
        setData(allStudents)
        setFilteredStudents(allStudents)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    filterStudents()
  }, [niveau, filiere, annee, groupe, cin, cef, nom, prenom, selectedMonth, data])

  const getAllStudents = (data, absentData) => {
    let allStudents = []

    data.forEach(secteur => {
      Object.entries(secteur.niveaux).forEach(([niveauKey, niveauValue]) => {
        Object.entries(niveauValue.filiere).forEach(([filiereKey, filiereValue]) => {
          Object.entries(filiereValue).forEach(([anneeKey, anneeValue]) => {
            Object.entries(anneeValue).forEach(([groupeKey, students]) => {
              students.forEach(student => {
                const absences = absentData.filter(absent =>
                  absent.students.some(s => s.studentCef === student.cef && s.isAbsent)
                )
                const monthlyAbsences = {}
                absences.forEach(absence => {
                  const month = new Date(absence.date).toLocaleString('default', { month: 'long' })
                  monthlyAbsences[month] = (monthlyAbsences[month] || 0) + 1
                })
                allStudents.push({
                  ...student,
                  niveau: niveauKey,
                  filiere: filiereKey,
                  annee: anneeKey,
                  groupe: groupeKey,
                  secteur: secteur.intitule_secteur,
                  aj: 0,
                  anj: monthlyAbsences,
                  totalANJ: absences.length,
                  retards: 0,
                  sanction: 'aucune'
                })
              })
            })
          })
        })
      })
    })
    return allStudents
  }

  const filterStudents = () => {
    const filtered = data.filter(student => {
      const fullname = student.fullname.toLowerCase()
      const [studentNom, studentPrenom] = fullname.split(' ')

      return (
        (!niveau || student.niveau === niveau) &&
        (!filiere || student.filiere === filiere) &&
        (!annee || student.annee === annee) &&
        (!groupe || student.groupe === groupe) &&
        (!cin || student.cin.toLowerCase().includes(cin.toLowerCase())) &&
        (!cef || student.cef.toLowerCase().includes(cef.toLowerCase())) &&
        (!nom || studentNom.includes(nom.toLowerCase())) &&
        (!prenom || studentPrenom.includes(prenom.toLowerCase()))
      )
    })
    setFilteredStudents(filtered)
    setCurrentPage(1)
  }

  const calculateSanction = (absences, delays) => {
    const totalAbsences = absences + Math.floor(delays / 4)

    if (totalAbsences > 10) return 'exclusion definitive'
    if (totalAbsences >= 7) return 'exclusion temporaire'
    if (totalAbsences === 6) return 'exclusion de 2j'
    if (totalAbsences === 5) return 'blame'
    if (totalAbsences === 4) return '2eme avertissement'
    if (totalAbsences === 3) return '1er avertissement'
    if (totalAbsences === 2) return '2eme mise en garde'
    if (totalAbsences === 1) return '1ere mise en garde'
    return 'aucune'
  }

  const handleInputChange = (studentId, field, value, month = null) => {
    setHasChanges(true)
    const updatedStudents = filteredStudents.map(student => {
      if (student.cef === studentId) {
        let updatedStudent = { ...student }
        if (field === 'anj') {
          if (month) {
            updatedStudent.anj = { ...updatedStudent.anj, [month]: parseInt(value, 10) || 0 }
          } else {
            // Update total ANJ
            updatedStudent.totalANJ = parseInt(value, 10) || 0
          }
        } else if (field === 'retards') {
          updatedStudent[field] = parseInt(value, 10) || 0
        }

        // Store the edited total absences
        const totalEditedAbsences = updatedStudent.totalANJ + Math.floor(updatedStudent.retards / 4)
        setEditedAbsences(prev => ({ ...prev, [studentId]: totalEditedAbsences }))

        const calculatedSanction = calculateSanction(totalEditedAbsences, updatedStudent.retards)
        setSanctions(prev => ({ ...prev, [studentId]: calculatedSanction }))
        return updatedStudent
      }
      return student
    })
    setFilteredStudents(updatedStudents)
  }

  const handleSanctionChange = (studentId, sanction) => {
    setHasChanges(true)
    setSanctions(prev => ({ ...prev, [studentId]: sanction }))
  }

  const handleSave = async () => {
    const updatedStudents = filteredStudents.map(student => ({
      ...student,
      sanction: sanctions[student.cef] || student.sanction
    }))

    try {
      const response = await fetch('http://localhost:3000/studentDiscipline', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedStudents),
      })

      if (!response.ok) {
        throw new Error('Failed to update students')
      }

      setData(prevData => prevData.map(s => updatedStudents.find(us => us.cef === s.cef) || s))
      setFilteredStudents(updatedStudents)
      setIsEditing(false)
      setHasChanges(false)
      setSanctions({})
      alert('Changes saved successfully!')
    } catch (error) {
      console.error('Error saving changes:', error)
      alert('Failed to save changes. Please try again.')
    }
  }

  const handleCancel = () => {
    setFilteredStudents(data.filter(student =>
      (!niveau || student.niveau === niveau) &&
      (!filiere || student.filiere === filiere) &&
      (!annee || student.annee === annee) &&
      (!groupe || student.groupe === groupe) &&
      (!cin || student.cin.toLowerCase().includes(cin.toLowerCase())) &&
      (!cef || student.cef.toLowerCase().includes(cef.toLowerCase())) &&
      (!nom || student.fullname.toLowerCase().includes(nom.toLowerCase())) &&
      (!prenom || student.fullname.toLowerCase().includes(prenom.toLowerCase()))
    ))
    setIsEditing(false)
    setHasChanges(false)
    setSanctions({})
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const renderAdminTableCells = (student) => (
    <>
      <td className="px-4 py-2">
        <input
          type="number"
          min="0"
          max="31"
          className="input input-bordered w-full"
          value={student.aj || 0}
          onChange={(e) => handleInputChange(student.cef, 'aj', e.target.value)}
          disabled={!isEditing}
        />
      </td>
      <td className="px-4 py-2">
        <input
          type="number"
          min="0"
          className="input input-bordered w-full"
          value={selectedMonth ? (student.anj[selectedMonth] || 0) : (editedAbsences[student.cef] || student.totalANJ)}
          onChange={(e) => handleInputChange(student.cef, 'anj', e.target.value, selectedMonth)}
          disabled={!isEditing}
        />
      </td>
      <td className="px-4 py-2">
        <input
          type="number"
          min="0"
          className="input input-bordered w-full"
          value={student.retards || 0}
          onChange={(e) => handleInputChange(student.cef, 'retards', e.target.value)}
          disabled={!isEditing}
        />
      </td>
      <td className="px-4 py-2">
        <select
          className="select select-bordered w-full"
          value={sanctions[student.cef] || student.sanction || 'aucune'}
          onChange={(e) => handleSanctionChange(student.cef, e.target.value)}
          disabled={!isEditing}
        >
          <option value="aucune">Aucune</option>
          <option value="1ere mise en garde">1ere Mise en garde</option>
          <option value="2eme mise en garde">2eme Mise en garde</option>
          <option value="1er avertissement">1er Avertissement</option>
          <option value="2eme avertissement">2eme Avertissement</option>
          <option value="blame">Blâme</option>
          <option value="exclusion de 2j">Exclusion de 2 jours</option>
          <option value="exclusion temporaire">Exclusion temporaire</option>
          <option value="exclusion definitive">Exclusion definitive</option>
        </select>
      </td>
    </>
  )

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredStudents.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

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

      <div className="overflow-x-auto rounded-lg shadow-md">
        {currentItems.length > 0 ? (
          <>
            <table className="table table-zebra w-full text-center hover">
              <thead className="bg-base-200 font-bold">
                <tr>
                  <th className="px-4 py-2">CEF</th>
                  <th className="px-4 py-2">Nom Complet</th>
                  <th className="px-4 py-2">Secteur</th>
                  <th className="px-4 py-2">Niveau</th>
                  <th className="px-4 py-2">Filière</th>
                  <th className="px-4 py-2">Année</th>
                  <th className="px-4 py-2">Groupe</th>
                  <th colSpan="4" className="px-4 py-2">
                    {selectedMonth ? `Mois : ${selectedMonth}` : "État Total :"}
                  </th>
                </tr>
                <tr>
                  <th colSpan="7"></th>
                  <th className="px-4 py-2 bg-base-300">Nombre AJ</th>
                  <th className="px-4 py-2 bg-base-300">Nombre ANJ</th>
                  <th className="px-4 py-2 bg-base-300">Nombre Retards</th>
                  <th className="px-4 py-2 bg-base-300">Sanctions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((student, index) => (
                  <tr
                    key={student.cef}
                    className={`${sanctions[student.cef] && sanctions[student.cef] !== student.sanction ? 'bg-red-200 hover:bg-red-200' : ''
                      }`}
                  >
                    <td className="px-4 py-2">{student.cef}</td>
                    <td className="px-4 py-2">{`${student.fullname}`}</td>
                    <td className="px-4 py-2">{student.secteur}</td>
                    <td className="px-4 py-2">{student.niveau}</td>
                    <td className="px-4 py-2">{student.filiere}</td>
                    <td className="px-4 py-2">{student.annee}</td>
                    <td className="px-4 py-2">{student.groupe}</td>
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
              {selectedMonth && ( // Only render the buttons if a month is selected
                <div className="space-x-2 flex flex-wrap gap-2 justify-end">
                  <button
                    className="btn btn-primary"
                    onClick={handleEdit}
                    disabled={isEditing}
                  >
                    <Edit size={20} className="mr-2" />
                    Modifier
                  </button>
                  <button
                    className="btn btn-success"
                    onClick={handleSave}
                    disabled={!isEditing || !hasChanges}
                  >
                    <Save size={20} className="mr-2" />
                    Enregistrer
                  </button>
                  <button
                    className="btn btn-error"
                    onClick={handleCancel}
                    disabled={!isEditing}
                  >
                    <X size={20} className="mr-2" />
                    Annuler
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <p className="text-center py-4">Aucun étudiant trouvé pour ces critères.</p>
        )}
      </div>
    </div>
  )
}


