'use client'

import React, { useEffect, useState } from 'react'
import { X } from 'lucide-react'

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
  onNiveauChange = () => {},
  onFiliereChange = () => {},
  onAnneeChange = () => {},
  onGroupeChange = () => {},
  onCinChange = () => {},
  onCefChange = () => {},
  onNomChange = () => {},
  onPrenomChange = () => {},
  onMonthChange = () => {}
}) {
  const [filteredFilieres, setFilteredFilieres] = useState([])
  const [filteredAnnees, setFilteredAnnees] = useState([])
  const [filteredGroupes, setFilteredGroupes] = useState([])

  useEffect(() => {
    if (!Array.isArray(allData)) {
      console.error('allData is not an array:', allData)
      return
    }

    // Filter filieres based on selected niveau
    const newFilteredFilieres = niveau
      ? [...new Set(allData.filter(item => item.niveau === niveau).map(item => item.filiere))]
      : [...new Set(allData.map(item => item.filiere))]
    setFilteredFilieres(newFilteredFilieres)

    // Reset filiere if it's not in the new filtered list
    if (filiere && !newFilteredFilieres.includes(filiere)) {
      onFiliereChange('')
    }
  }, [niveau, allData, filiere, onFiliereChange])

  useEffect(() => {
    if (!Array.isArray(allData)) return

    // Filter annees based on selected niveau and filiere
    const newFilteredAnnees = allData
      .filter(item => 
        (!niveau || item.niveau === niveau) &&
        (!filiere || item.filiere === filiere)
      )
      .map(item => item.annee)
    setFilteredAnnees([...new Set(newFilteredAnnees)])

    // Reset annee if it's not in the new filtered list
    if (annee && !newFilteredAnnees.includes(annee)) {
      onAnneeChange('')
    }
  }, [niveau, filiere, allData, annee, onAnneeChange])

  useEffect(() => {
    if (!Array.isArray(allData)) return

    // Filter groupes based on selected niveau, filiere, and annee
    const newFilteredGroupes = allData
      .filter(item => 
        (!niveau || item.niveau === niveau) &&
        (!filiere || item.filiere === filiere) &&
        (!annee || item.annee === annee)
      )
      .map(item => item.groupe)
    setFilteredGroupes([...new Set(newFilteredGroupes)])

    // Reset groupe if it's not in the new filtered list
    if (groupe && !newFilteredGroupes.includes(groupe)) {
      onGroupeChange('')
    }
  }, [niveau, filiere, annee, allData, groupe, onGroupeChange])

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
  )

  const renderSearchInput = (value, onChange, placeholder) => (
    <input
      type="text"
      className="input input-bordered input-sm w-full"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  )

  const clearAllFilters = () => {
    onNiveauChange('')
    onFiliereChange('')
    onAnneeChange('')
    onGroupeChange('')
    onCinChange('')
    onCefChange('')
    onNomChange('')
    onPrenomChange('')
    onMonthChange('')
  }

  if (!Array.isArray(allData)) {
    return <div className="text-red-500">Error: Invalid data format</div>
  }

  return (
    <div className="bg-base-200 p-4 rounded-lg shadow-md mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {renderSelect(niveau, onNiveauChange, [...new Set(allData.map(item => item.niveau))], "Niveau")}
        {renderSelect(filiere, onFiliereChange, filteredFilieres, "Filière")}
        {renderSelect(annee, onAnneeChange, filteredAnnees, "Année")}
        {renderSelect(groupe, onGroupeChange, filteredGroupes, "Groupe")}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {renderSearchInput(cin, onCinChange, "CIN")}
        {renderSearchInput(cef, onCefChange, "CEF")}
        {renderSearchInput(nom, onNomChange, "Nom")}
        {renderSearchInput(prenom, onPrenomChange, "Prénom")}
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
        <button 
          className="btn btn-secondary btn-sm" 
          onClick={clearAllFilters}
        >
          <X className="mr-2" size={16} />
          Effacer les filtres
        </button>
      </div>
    </div>
  )
}