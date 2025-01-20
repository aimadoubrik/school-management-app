import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setSelectedFormateur,
  setSelectedGroupe,
} from '../../../features/scheduler/schedulerSlice';
import { User, Users } from 'lucide-react';
import SidebarCollapsible, { SidebarItem } from './SidebarCollapsible';

function Sidebar() {
  const selectedGroupe = useSelector((state) => state.scheduler.selectedGroupe);
  const selectedFormateur = useSelector((state) => state.scheduler.selectedFormateur);
  const assignments = useSelector((state) => state.scheduler.assignments);
  const dispatch = useDispatch();

  // Extract unique groups and formateurs
  const uniqueGroups = assignments
    .map((assignment) => assignment.groupe)
    .filter(
      (groupe, index, self) => index === self.findIndex((g) => g.codeGroupe === groupe.codeGroupe)
    );

  const uniqueFormateurs = assignments
    .map((assignment) => assignment.formateur)
    .filter(
      (formateur, index, self) =>
        index === self.findIndex((f) => f.matricule === formateur.matricule)
    );

  // State for filters
  const [selectedSecteur, setSelectedSecteur] = useState('');
  const [selectedFiliere, setSelectedFiliere] = useState('');
  const [filteredFilieres, setFilteredFilieres] = useState([]);
  const [selectedFormateurSecteur, setSelectedFormateurSecteur] = useState('');
  const [filteredFormateurs, setFilteredFormateurs] = useState(uniqueFormateurs);

  // Extract unique secteurs and filieres
  const secteurs = [...new Set(uniqueGroups.map((group) => group.secteur))];
  const filieres = uniqueGroups.map((group) => ({
    filiere: group.filiere,
    secteur: group.secteur,
  }));

  // Filter formateurs by selected secteur
  useEffect(() => {
    if (selectedFormateurSecteur) {
      const updatedFormateurs = uniqueFormateurs.filter(
        (formateur) => formateur.secteur === selectedFormateurSecteur
      );
      if (JSON.stringify(updatedFormateurs) !== JSON.stringify(filteredFormateurs)) {
        setFilteredFormateurs(updatedFormateurs);
      }
    } else if (filteredFormateurs.length !== uniqueFormateurs.length) {
      setFilteredFormateurs(uniqueFormateurs);
    }
  }, [uniqueFormateurs]);

  // Update filtered filieres when secteur changes
  useEffect(() => {
    if (selectedSecteur) {
      const updatedFilieres = filieres
        .filter((filiere) => filiere.secteur === selectedSecteur)
        .map((filiere) => filiere.filiere);

      // Only update if the new filtered list is different from the current one
      if (JSON.stringify(updatedFilieres) !== JSON.stringify(filteredFilieres)) {
        setFilteredFilieres(updatedFilieres);
      }
    } else {
      // Reset to all available filieres if no secteur is selected
      const allFilieres = [...new Set(filieres.map((filiere) => filiere.filiere))];
      if (JSON.stringify(allFilieres) !== JSON.stringify(filteredFilieres)) {
        setFilteredFilieres(allFilieres);
      }
    }
  }, [selectedSecteur, filieres]); // Trigger on changes to selectedSecteur or filieres

  // Automatically update secteur when filiere changes
  useEffect(() => {
    if (selectedFiliere) {
      const associatedSecteur = filieres.find(
        (filiere) => filiere.filiere === selectedFiliere
      )?.secteur;

      // Only update if the secteur is actually different
      if (associatedSecteur && associatedSecteur !== selectedSecteur) {
        setSelectedSecteur(associatedSecteur);
      }
    }
  }, [selectedFiliere, filieres, selectedSecteur]);

  // Define filteredGroups based on the selected secteur and filiere
  const filteredGroups = uniqueGroups.filter((group) => {
    const secteurMatches = selectedSecteur ? group.secteur === selectedSecteur : true;
    const filiereMatches = selectedFiliere ? group.filiere === selectedFiliere : true;
    return secteurMatches && filiereMatches;
  });

  const handleSelectGroupe = (groupe) => {
    if (selectedGroupe !== groupe) {
      dispatch(setSelectedGroupe(groupe)); // Set selected group
      dispatch(setSelectedFormateur(null)); // Clear formateur selection
    }
  };

  const handleSelectFormateur = (formateur) => {
    if (selectedFormateur !== formateur) {
      dispatch(setSelectedFormateur(formateur)); // Set selected formateur
      dispatch(setSelectedGroupe(null)); // Clear group selection
    }
  };

  return (
    <SidebarCollapsible>
      <SidebarItem icon={<Users size={20}/>} text="Groups" id="groups">
        <div className="flex flex-col max-h-[400px] overflow-hidden">
          <div className="space-y-3">
            <select
              value={selectedSecteur}
              onChange={(e) => {
                setSelectedSecteur(e.target.value);
                setSelectedFiliere('');
              }}
              className="select select-bordered w-full"
            >
              <option value="">All Secteurs</option>
              {secteurs.map((secteur) => (
                <option key={secteur} value={secteur}>
                  {secteur}
                </option>
              ))}
            </select>

            <select
              value={selectedFiliere}
              onChange={(e) => setSelectedFiliere(e.target.value)}
              className="select select-bordered w-full"
            >
              <option value="">All Filieres</option>
              {filteredFilieres.map((filiere, index) => (
                <option key={index} value={filiere}>
                  {filiere}
                </option>
              ))}
            </select>
          </div>

          {/* Group List with contained scrolling */}
          <div className="mt-4 overflow-y-auto flex-1">
            <div className="space-y-2 pr-2">
              {filteredGroups.length > 0 ? (
                filteredGroups.map((group, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${
                      selectedGroupe === group.codeGroupe
                        ? 'bg-primary text-primary-content hover:bg-primary/90'
                        : 'hover:bg-gray-100'
                    } cursor-pointer`}
                    onClick={() => handleSelectGroupe(group.codeGroupe)}
                  >
                    <h4 className="text-sm font-medium">{group.intituleGroupe}</h4>
                    <p className="text-xs text-gray-600">{group.filiere}</p>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">No groups found.</p>
              )}
            </div>
          </div>
        </div>
      </SidebarItem>

      <SidebarItem icon={<User size={20}/>} text="Formateurs" id="formateurs">
        <div className="flex flex-col max-h-[400px] overflow-hidden">
          <div className="space-y-3">
            <select
              value={selectedFormateurSecteur}
              onChange={(e) => setSelectedFormateurSecteur(e.target.value)}
              className="select select-bordered w-full"
            >
              <option value="">All Secteurs</option>
              {secteurs.map((secteur) => (
                <option key={secteur} value={secteur}>
                  {secteur}
                </option>
              ))}
            </select>
          </div>

          {/* Formateur List with contained scrolling */}
          <div className="mt-4 overflow-y-auto flex-1">
            <div className="space-y-2 pr-2">
              {filteredFormateurs.length > 0 ? (
                filteredFormateurs.map((formateur, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg border ${
                      selectedFormateur === formateur.matricule
                        ? 'bg-primary text-primary-content hover:bg-primary/90'
                        : 'hover:bg-gray-100'
                    } cursor-pointer`}
                    onClick={() => handleSelectFormateur(formateur.matricule)}
                  >
                    <h4 className="text-sm font-medium">{formateur.nom}</h4>
                    <p className="text-xs text-gray-600">{formateur.email}</p>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">No formateurs found.</p>
              )}
            </div>
          </div>
        </div>
      </SidebarItem>
    </SidebarCollapsible>
  );
}

export default Sidebar;
