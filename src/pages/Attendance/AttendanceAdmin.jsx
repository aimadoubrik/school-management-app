'use client'

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
  const [isEditing, setIsEditing] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [sanctions, setSanctions] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:3000/secteurs')
        if (!response.ok) throw new Error('Failed to fetch data')
        const result = await response.json()
        const allStudents = getAllStudents(result)
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

  const getAllStudents = (data) => {
    let allStudents = []
    
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
                  secteur: secteur.intitule_secteur,
                  aj: 0,
                  anj: 0,
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

  const calculateSanction = (anj, retards) => {
    if (anj > 10 || retards > 40) return 'exclusion definitive'
    if (anj >= 7 || retards >= 28) return 'exclusion temporaire'
    if (anj === 6 || retards >= 24) return 'exclusion de 2j'
    if (anj === 5 || retards >= 20) return 'blame'
    if (anj === 4 || retards >= 16) return '2eme avertissement'
    if (anj === 3 || retards >= 12) return '1er avertissement'
    if (anj === 2 || retards >= 8) return '2eme mise en garde'
    if (anj === 1 || retards >= 4) return '1ere mise en garde'
    return 'aucune'
  }

  const handleInputChange = (studentId, field, value) => {
    setHasChanges(true)
    const updatedStudents = filteredStudents.map(student => {
      if (student.cef === studentId) {
        const updatedStudent = { ...student, [field]: parseInt(value, 10) || 0 }
        const calculatedSanction = calculateSanction(updatedStudent.anj, updatedStudent.retards)
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

  const handleSave = () => {
    const updatedStudents = filteredStudents.filter(student => {
      const sanction = sanctions[student.cef] || student.sanction
      if (sanction === 'exclusion definitive') {
        return false
      }
      student.sanction = sanction
      return true
    })
    setFilteredStudents(updatedStudents)
    setData(prevData => prevData.map(s => updatedStudents.find(us => us.cef === s.cef) || s))
    setIsEditing(false)
    setHasChanges(false)
    setSanctions({})
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
    selectedMonth ? (
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
            max="10"
            className="input input-bordered w-full"
            value={student.anj || 0}
            onChange={(e) => handleInputChange(student.cef, 'anj', e.target.value)}
            disabled={!isEditing}
          />
        </td>
        <td className="px-4 py-2">
          <input
            type="number"
            min="0"
            max="40"
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
    ) : (
      <>
        <td className="px-4 py-2">{student.totalAJ || 0}</td>
        <td className="px-4 py-2">{student.totalANJ || 0}</td>
        <td className="px-4 py-2">{student.totalRetards || 0}</td>
        <td className="px-4 py-2">{student.totalSanctions || 0}</td>
      </>
    )
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
                  {selectedMonth ? (
                    <>
                      <th className="px-4 py-2 bg-base-300">Nombre AJ</th>
                      <th className="px-4 py-2 bg-base-300">Nombre ANJ</th>
                      <th className="px-4 py-2 bg-base-300">Nombre Retards</th>
                      <th className="px-4 py-2 bg-base-300">Sanctions</th>
                    </>
                  ) : (
                    <>
                      <th className="px-4 py-2 bg-base-300">Total AJ</th>
                      <th className="px-4 py-2 bg-base-300">Total ANJ</th>
                      <th className="px-4 py-2 bg-base-300">Total Retards</th>
                      <th className="px-4 py-2 bg-base-300">Total Sanctions</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {currentItems.map((student, index) => (
                  <tr 
                    key={student.cef} 
                    className={`${
                      sanctions[student.cef] && sanctions[student.cef] !== student.sanction ? 'bg-red-200 hover:bg-red-200' : ''
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
              <div className="space-x-2 flex flex-wrap gap-2 justify-end">
                <button 
                  className="btn btn-primary" 
                  onClick={handleEdit} 
                  disabled={!selectedMonth || isEditing}
                >
                  <Edit size={20} className="mr-2" />
                  Modifier
                </button>
                <button 
                  className="btn btn-success" 
                  onClick={handleSave} 
                  disabled={!selectedMonth || !isEditing || !hasChanges}
                >
                  <Save size={20} className="mr-2" />
                  Enregistrer
                </button>
                <button 
                  className="btn btn-error" 
                  onClick={handleCancel} 
                  disabled={!selectedMonth || !isEditing}
                >
                  <X size={20} className="mr-2" />
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
  )
}