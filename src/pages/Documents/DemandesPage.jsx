import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { fetchDemandes, editDemande, deleteDemande } from '../../features/documents/demandeSlice';
import { Edit, Check, Trash } from 'lucide-react';

const DemandesPage = () => {
    const dispatch = useDispatch();
    const { demandes, loading, error } = useSelector((state) => state.demandes);

    useEffect(() => {
        dispatch(fetchDemandes());
    }, [dispatch]);

    const [selectedDocument, setSelectedDocument] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [editedDemande, setEditedDemande] = useState(null);
    const [showEditSelect, setShowEditSelect] = useState(false);

    const handleEdit = (demande) => {
        setEditedDemande(demande);
        setShowEditSelect(true);
    };

    const handleConfirmEdit = (e) => {
        const newStatus = e.target.value;
        dispatch(editDemande({ id: editedDemande.id, status: newStatus }));
        setShowEditSelect(false);
    };

    const filteredDemandes = demandes.filter((demande) => {
        if (selectedDocument !== '') {
            return demande.document === selectedDocument;
        }
        return true;
    }).filter((demande) => {
        if (selectedStatus !== '') {
            return demande.status === selectedStatus;
        }
        return true;
    });

    const handleDelete = (demande) => {
        dispatch(deleteDemande(demande.id));
        const newDemandes = demandes.filter((d) => d.id !== demande.id);
        dispatch(fetchDemandes(newDemandes));
    };

    const documents = Array.from(new Set(demandes.map(d => d.document))).sort();

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <h1 className="text-2xl font-bold mb-4">Demandes</h1>

            {loading ? (
                <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : error ? (
                <div className="text-red-600 text-center">{error}</div>
            ) : (
                <div className="relative sm:rounded-lg">
                    <div className="flex mb-4 w-full gap-4">
                        <select
                            className="select select-primary w-1/2"
                            value={selectedDocument}
                            onChange={(e) => setSelectedDocument(e.target.value)}
                        >
                            <option value="">Tous les documents</option>
                            {documents.map((document) => (
                                <option key={document} value={document}>{document}</option>
                            ))}
                        </select>
                        <select
                            className="select select-primary w-1/2"
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                        >
                            <option value="">Tous les statuts</option>
                            <option value="en cours">En Cours</option>
                            <option value="effectuer">Effectuer</option>
                            <option value="rejeter">Rejeter</option>
                        </select>
                    </div>
                    <table className="table table-compact w-full mt-4 text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-2 py-3">
                                    Doc
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Stagiaire
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Files
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Statut
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Date de dépôt
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Temps de traitement
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDemandes.map((demande) => (
                                <tr key={demande.id} className="">
                                    <th scope="row" className="px-2 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {demande.document}
                                    </th>
                                    <td className="px-6 py-4">
                                        {demande?.user || "Inconnu"}
                                    </td>
                                    <td className="px-6 py-4">
                                        {demande.files.map((file) => (
                                            <div key={file.name}>
                                                {file.name} ({file.size} octets)
                                            </div>
                                        ))}
                                    </td>
                                    <td className="px-6 py-4">
                                        {showEditSelect && editedDemande.id === demande.id ? (
                                            <div className="flex">
                                                <select
                                                    className="block w-[114px] px-3 py-2 text-base transition duration-150 ease-in-out bg-transparent border border-gray-600 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                    onChange={handleConfirmEdit}
                                                >
                                                    <option value="en cours">En Cours</option>
                                                    <option value="effectuer">Effectuer</option>
                                                    <option value="rejeter">Rejeter</option>
                                                </select>
                                                <button
                                                    type="button"
                                                    onClick={() => setShowEditSelect(false)}
                                                    className="inline-flex items-center px-3 py-2 text-sm leading-4 font-medium rounded-md text-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                >
                                                    <Check className="h-5 w-5" aria-hidden="true" />
                                                </button>
                                            </div>
                                        ) : demande.status}
                                    </td>
                                    <td className="px-6 py-4">
                                        {demande.submissionDate}
                                    </td>
                                    <td className="px-6 py-4">
                                        {demande.processingTime}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex space-x-2">
                                            <button
                                                type="button"
                                                onClick={() => handleEdit(demande)}
                                                className="inline-flex items-center px-3 py-2 text-sm leading-4 font-medium rounded-md text-indigo-600 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            >
                                                <Edit className="h-5 w-5" aria-hidden="true" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(demande)}
                                                className="inline-flex items-center px-3 py-2 text-sm leading-4 font-medium rounded-md text-indigo-600 hover:text-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            >
                                                <Trash className="h-5 w-5" aria-hidden="true" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

export default DemandesPage;
