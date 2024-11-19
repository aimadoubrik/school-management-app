import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';

export default function FiltersFormateur({
    secteursData,
    secteur,
    niveau,
    filiere,
    annee,
    groupe,
    dateFilter,
    onSecteurChange,
    onNiveauChange,
    onFiliereChange,
    onAnneeChange,
    onGroupeChange,
    onDateChange,
}) {
    const [availableNiveaux, setAvailableNiveaux] = useState([]);
    const [availableFilieres, setAvailableFilieres] = useState([]);
    const [availableAnnees, setAvailableAnnees] = useState([]);
    const [availableGroupes, setAvailableGroupes] = useState([]);

    useEffect(() => {
        // Update niveaux based on selected secteur
        const selectedSecteur = secteursData.find((s) => s.intitule_secteur === secteur);
        if (selectedSecteur) {
            setAvailableNiveaux(Object.keys(selectedSecteur.niveaux || {}));
        } else {
            setAvailableNiveaux([]);
        }
        setAvailableFilieres([]);
        setAvailableAnnees([]);
        setAvailableGroupes([]);
    }, [secteur, secteursData]);

    useEffect(() => {
        // Update filieres based on selected niveau
        const selectedSecteur = secteursData.find((s) => s.intitule_secteur === secteur);
        if (selectedSecteur && niveau) {
            const niveauxData = selectedSecteur.niveaux[niveau];
            setAvailableFilieres(Object.keys(niveauxData.filiere || {}));
        } else {
            setAvailableFilieres([]);
        }
        setAvailableAnnees([]);
        setAvailableGroupes([]);
    }, [niveau, secteur, secteursData]);

    useEffect(() => {
        // Update annees based on selected filiere
        const selectedSecteur = secteursData.find((s) => s.intitule_secteur === secteur);
        if (selectedSecteur && niveau && filiere) {
            const filiereData = selectedSecteur.niveaux[niveau]?.filiere[filiere];
            setAvailableAnnees(Object.keys(filiereData || {}));
        } else {
            setAvailableAnnees([]);
        }
        setAvailableGroupes([]);
    }, [filiere, niveau, secteur, secteursData]);

    useEffect(() => {
        // Update groupes based on selected annee
        const selectedSecteur = secteursData.find((s) => s.intitule_secteur === secteur);
        if (selectedSecteur && niveau && filiere && annee) {
            const anneeData = selectedSecteur.niveaux[niveau]?.filiere[filiere]?.[annee];
            setAvailableGroupes(Object.keys(anneeData || {}));
        } else {
            setAvailableGroupes([]);
        }
    }, [annee, filiere, niveau, secteur, secteursData]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            {/* Secteur Selector */}
            <select
                className="select select-bordered w-full"
                value={secteur}
                onChange={(e) => onSecteurChange(e.target.value)}
            >
                <option value="">Secteur</option>
                {secteursData.map((s) => (
                    <option key={s.id_secteur} value={s.intitule_secteur}>
                        {s.intitule_secteur}
                    </option>
                ))}
            </select>

            {/* Niveau Selector */}
            <select
                className="select select-bordered w-full"
                value={niveau}
                onChange={(e) => onNiveauChange(e.target.value)}
                disabled={!secteur}
            >
                <option value="">Niveau</option>
                {availableNiveaux.map((n) => (
                    <option key={n} value={n}>
                        {n}
                    </option>
                ))}
            </select>

            {/* Filiere Selector */}
            <select
                className="select select-bordered w-full"
                value={filiere}
                onChange={(e) => onFiliereChange(e.target.value)}
                disabled={!niveau}
            >
                <option value="">Filière</option>
                {availableFilieres.map((f) => (
                    <option key={f} value={f}>
                        {f}
                    </option>
                ))}
            </select>

            {/* Annee Selector */}
            <select
                className="select select-bordered w-full"
                value={annee}
                onChange={(e) => onAnneeChange(e.target.value)}
                disabled={!filiere}
            >
                <option value="">Année</option>
                {availableAnnees.map((a) => (
                    <option key={a} value={a}>
                        {a}
                    </option>
                ))}
            </select>

            {/* Groupe Selector */}
            <select
                className="select select-bordered w-full"
                value={groupe}
                onChange={(e) => onGroupeChange(e.target.value)}
                disabled={!annee}
            >
                <option value="">Groupe</option>
                {availableGroupes.map((g) => (
                    <option key={g} value={g}>
                        {g}
                    </option>
                ))}
            </select>

            {/* Date Selector */}
            <div className="relative">
                <input
                    type="date"
                    className="input input-bordered"
                    value={dateFilter}
                    onChange={onDateChange}
                />

            </div>
        </div>
    );
}
