
import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchStagiaires,
  addStagiaireAPI,
  updateStagiaireAPI,
  deleteStagiaireAPI,
  selectStagiaires,
  selectStatus,
  selectError,
} from '../../features/Stagiaire/stagiaireSlice';
import { Plus, Edit, Trash2, Download, FileSpreadsheet, AlertCircle, CheckCircle, X, Upload } from 'lucide-react';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import Pagination from '../../components/shared/Pagination';

const INITIAL_STAGIAIRE = {
  cef: '',
  nom: '',
  prenom: '',
  email: '',
  annee: '',
  niveau: '',
  filiere: '',
  groupe: '',
};

const Stagiaire = () => {
  const dispatch = useDispatch();
  const stagiaires = useSelector(selectStagiaires);
  const status = useSelector(selectStatus);
  const error = useSelector(selectError);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 3;
  const [modalState, setModalState] = useState({ isOpen: false, stagiaire: INITIAL_STAGIAIRE });
  const [filters, setFilters] = useState({ filiere: '', groupe: '', searchTerm: '' });
  const [alerts, setAlerts] = useState({ success: null, error: null });

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchStagiaires());
    }
  }, [status, dispatch]);

  const handleModalOpen = (stagiaire = INITIAL_STAGIAIRE) => {
    setModalState({ isOpen: true, stagiaire: { ...stagiaire } });
  };

  const handleModalClose = () => {
    setModalState({ isOpen: false, stagiaire: INITIAL_STAGIAIRE });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  const { stagiaire } = modalState;

  try {
    const isDuplicate = stagiaires.some(s =>
      s.cef === stagiaire.cef && s.id !== stagiaire.id 
    );
    if (isDuplicate) {
      setAlerts({ success: null, error: 'Un stagiaire avec ce CEF existe déjà.' });
      return;
    }

    if (stagiaire.id) {
      await dispatch(updateStagiaireAPI(stagiaire)).unwrap();
      setAlerts({ success: 'Stagiaire mis à jour avec succès.', error: null });
    } else {
      await dispatch(addStagiaireAPI(stagiaire)).unwrap();
      setAlerts({ success: 'Stagiaire ajouté avec succès.', error: null });
    }
    handleModalClose();
  } catch (err) {
    setAlerts({ success: null, error: `Opération échouée : ${err.message}` });
  }
};

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this stagiaire?')) {
      try {
        await dispatch(deleteStagiaireAPI(id)).unwrap();
        setAlerts({ success: 'Stagiaire deleted successfully', error: null });
      } catch (err) {
        setAlerts({ success: null, error: `Delete failed: ${err.message}` });
      }
    }
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(stagiaires);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Stagiaires');
    XLSX.writeFile(wb, 'stagiaires.xlsx');
  };

  const exportToPDF = async () => {
    const doc = new jsPDF();
    const logoURL = 'https://th.bing.com/th/id/OIP.Sb1FiwDyjsY5DePGcoEAwwHaHa?rs=1&pid=ImgDetMain'; // Chemin vers le logo (assurez-vous qu'il est placé dans `public`)
    const label = 'Liste des stagiaires';
  
    // Ajouter le logo
    const img = new Image();
    img.src = logoURL;
  
    img.onload = () => {
      const imgWidth = 20; // Largeur de l'image dans le PDF
      const imgHeight = (img.height * imgWidth) / img.width; // Calculer la hauteur proportionnelle
  
      doc.addImage(img, 'URL', 10, 10, imgWidth, imgHeight); // Ajouter le logo
  
      // Ajouter le label
      doc.setFontSize(18);
      doc.text(label, imgWidth + 30, 25);
  
      // Ajouter un espace avant le tableau
      doc.setFontSize(12);
      doc.autoTable({
        startY: imgHeight + 20, // Positionner le tableau sous le logo et le label
        head: [['CEF', 'Nom', 'Prénom', 'Email', 'Année', 'Niveau', 'Filière', 'Groupe']],
        body: stagiaires.map((s) => [
          s.cef,
          s.nom,
          s.prenom,
          s.email,
          s.annee,
          s.niveau,
          s.filiere,
          s.groupe,
        ]),
      });
  
      // Enregistrer le PDF
      doc.save('stagiaires.pdf');
    };
  
    img.onerror = () => {
      console.error('Erreur lors du chargement du logo. Vérifiez le chemin du fichier.');
      setAlerts({ success: null, error: 'Erreur lors de la génération du PDF.' });
    };
  };
  

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const csvData = event.target.result;
        const lines = csvData.split('\n');
        const headers = lines[0].split(',');
        const newStagiaires = [];
        const duplicates = [];

        for (let i = 1; i < lines.length; i++) {
          if (lines[i].trim() !== '') {
            const values = lines[i].split(',');
            const stagiaire = {};
            headers.forEach((header, index) => {
              stagiaire[header.toLowerCase().trim()] = values[index].trim();
            });

            // Check for duplication
            const isDuplicate = stagiaires.some(s => 
              (stagiaire.id && s.id === stagiaire.id) || s.cef === stagiaire.cef
            );

            if (isDuplicate) {
              duplicates.push(stagiaire.cef || stagiaire.id);
            } else {
              newStagiaires.push(stagiaire);
            }
          }
        }

        try {
          for (const stagiaire of newStagiaires) {
            await dispatch(addStagiaireAPI(stagiaire)).unwrap();
          }
          
          if (duplicates.length > 0) {
            setAlerts({ 
              success: `${newStagiaires.length} stagiaires imported successfully. ${duplicates.length} duplicates were skipped.`,
              error: `Skipped duplicates: ${duplicates.join(', ')}`
            });
          } else {
            setAlerts({ success: `${newStagiaires.length} stagiaires imported successfully`, error: null });
          }
          
          dispatch(fetchStagiaires());
        } catch (err) {
          setAlerts({ success: null, error: `Import failed: ${err.message}` });
        }
      };
      reader.readAsText(file);
    }
  };

  const filteredStagiaires = useMemo(() => {
    return Array.isArray(stagiaires) ? stagiaires.filter(s => 
      (s.nom?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
       s.prenom?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
       s.cef?.toLowerCase().includes(filters.searchTerm.toLowerCase())) &&
      (!filters.filiere || s.filiere === filters.filiere) &&
      (!filters.groupe || s.groupe === filters.groupe)
    ) : [];
  }, [stagiaires, filters]);

  const totalPages = Math.ceil(filteredStagiaires.length / ITEMS_PER_PAGE);
  const displayedStagiares = filteredStagiaires.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const uniqueFilieres = useMemo(() => {
    return Array.from(new Set(stagiaires.map(s => s.filiere))).filter(Boolean);
  }, [stagiaires]);

  const uniqueGroupes = useMemo(() => {
    return Array.from(new Set(stagiaires.map(s => s.groupe))).filter(Boolean);
  }, [stagiaires]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gestion des Stagiaires</h1>

      {alerts.success && (
        <div className="alert alert-success mb-4">
          <CheckCircle className="w-6 h-6" />
          <span>{alerts.success}</span>
          <button onClick={() => setAlerts({ ...alerts, success: null })} className="btn btn-circle btn-outline btn-sm">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {alerts.error && (
        <div className="alert alert-error mb-4">
          <AlertCircle className="w-6 h-6" />
          <span>{alerts.error}</span>
          <button onClick={() => setAlerts({ ...alerts, error: null })} className="btn btn-circle btn-outline btn-sm">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex justify-between mb-4">
        <button onClick={() => handleModalOpen()} className="btn btn-primary">
          <Plus className="w-4 h-4 mr-2" /> Add Stagiaire
        </button>
        <div>
          <button onClick={exportToExcel} className="btn btn-outline btn-info mr-2">
            <FileSpreadsheet className="w-4 h-4 mr-2" /> Export to Excel
          </button>
          <button onClick={exportToPDF} className="btn btn-outline btn-success mr-2">
            <Download className="w-4 h-4 mr-2" /> Export to PDF
          </button>
          <button
            onClick={() => document.getElementById('fileInput').click()}
            className="btn btn-outline btn-info mr-2 "
          >
            <Upload className="w-4 h-4" />
            Upload Stagiaires
          </button>
          <input
            id="fileInput"
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>

      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Search..."
          className="input input-bordered w-full max-w-xs mr-2"
          value={filters.searchTerm}
          onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
        />
        <select
          className="select select-bordered w-full max-w-xs mr-2"
          value={filters.filiere}
          onChange={(e) => setFilters({ ...filters, filiere: e.target.value })}
        >
          <option value="">All Filières</option>
          {uniqueFilieres.map((filiere) => (
            <option key={filiere} value={filiere}>{filiere}</option>
          ))}
        </select>
        <select
          className="select select-bordered w-full max-w-xs"
          value={filters.groupe}
          onChange={(e) => setFilters({ ...filters, groupe: e.target.value })}
        >
          <option value="">All Groupes</option>
          {uniqueGroupes.map((groupe) => (
            <option key={groupe} value={groupe}>{groupe}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>CEF</th>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Email</th>
              <th>Année</th>
              <th>Niveau</th>
              <th>Filière</th>
              <th>Groupe</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {displayedStagiares.map((stagiaire) => (
              <tr key={stagiaire.id}>
                <td>{stagiaire.cef}</td>
                <td>{stagiaire.nom}</td>
                <td>{stagiaire.prenom}</td>
                <td>{stagiaire.email}</td>
                <td>{stagiaire.annee}</td>
                <td>{stagiaire.niveau}</td>
                <td>{stagiaire.filiere}</td>
                <td>{stagiaire.groupe}</td>
                <td>
                  <button onClick={() => handleModalOpen(stagiaire)} className="btn btn-ghost btn-xs">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(stagiaire.id)} className="btn btn-ghost btn-xs">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />

      {modalState.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">{modalState.stagiaire.id ? 'Edit' : 'Add'} Stagiaire</h2>
            <form onSubmit={handleSubmit}>
            {Object.keys(INITIAL_STAGIAIRE).map((key) => {
    if (key === "filiere" || key === "groupe") {
      const options = key === "filiere" ? uniqueFilieres : uniqueGroupes;
      return (
        <div key={key} className="mb-4">
          <label className="block text-sm font-medium text-gray-700">{key}</label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            value={modalState.stagiaire[key]}
            onChange={(e) =>
              setModalState({
                ...modalState,
                stagiaire: { ...modalState.stagiaire, [key]: e.target.value },
              })
            }
          >
            <option value="">Sélectionnez {key}</option>
            {options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      );
  }
  return (
    <div key={key} className="mb-4">
      <label className="block text-sm font-medium text-gray-700">{key}</label>
      <input
        type="text"
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        value={modalState.stagiaire[key]}
        onChange={(e) =>
          setModalState({
            ...modalState,
            stagiaire: { ...modalState.stagiaire, [key]: e.target.value },
          })
        }
      />
    </div>
  );
})}

              <div className="flex justify-end">
                <button type="button" onClick={handleModalClose} className="btn btn-ghost mr-2">Cancel</button>
                <button type="submit" className="btn btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stagiaire;

