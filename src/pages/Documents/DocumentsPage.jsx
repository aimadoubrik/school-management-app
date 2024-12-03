import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDocuments } from '../../features/documents/documentSlice';
import { fetchDemandes, deleteDemande } from '../../features/documents/demandeSlice';
import { getUserFromStorage } from '../../utils';
import {
    CheckCircle,
    FileText,
    Upload,
    AlertCircle,
    Clock,
    Trash,
    Calendar,
    Loader2,
    X,
    Download,
    FilePlus,
    Info,
    ArrowDown
} from 'lucide-react';

const DocumentsPage = () => {
    const dispatch = useDispatch();
    const { documents, loading: documentsLoading, error: documentsError } = useSelector((state) => state.documents);
    const { demandes, loading: demandesLoading, error: demandesError } = useSelector((state) => state.demandes);
    const user = getUserFromStorage('user');

    // State Management
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [requestDate, setRequestDate] = useState('');
    const [files, setFiles] = useState([]);
    const [dateFilter, setDateFilter] = useState('');
    const [searchFilter, setSearchFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [alerts, setAlerts] = useState({ success: false, error: null });
    const [dragActive, setDragActive] = useState(false);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('new-request');
    const [viewModal, setViewModal] = useState({ isOpen: false, demande: null });
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, demandeId: null });

    // Memoized filtered demandes
    const filteredDemandes = useMemo(() => {
        let filtered = demandes ? demandes.filter((demande) => demande.user === user?.name) : [];

        if (searchFilter) {
            filtered = filtered.filter(
                (demande) =>
                    demande.document.toLowerCase().includes(searchFilter.toLowerCase()) ||
                    demande.description.toLowerCase().includes(searchFilter.toLowerCase())
            );
        }

        if (dateFilter) {
            filtered = filtered.filter((demande) => demande.requestDate === dateFilter);
        }

        if (statusFilter) {
            filtered = filtered.filter((demande) => demande.status === statusFilter);
        }

        return filtered;
    }, [demandes, user?.name, searchFilter, dateFilter, statusFilter]);

    // Initialize page data
    const initializePage = useCallback(() => {
        dispatch(fetchDocuments());
        dispatch(fetchDemandes());
    }, [dispatch]);

    useEffect(() => {
        initializePage();
    }, [initializePage]);

    // File validation
    const validateAndSetFiles = useCallback((selectedFiles) => {
        const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
        const validFiles = selectedFiles.filter(
            (file) => validTypes.includes(file.type) && file.size <= 5 * 1024 * 1024
        );

        if (validFiles.length !== selectedFiles.length) {
            setAlerts((prev) => ({
                ...prev,
                error: 'Some files were rejected. Please use only PDF, JPG, or PNG files under 5MB.'
            }));
        }

        setFiles(validFiles);
    }, []);

    // Handlers
    const handleDocumentSelect = useCallback((doc) => {
        setSelectedDocument(doc);
        setFiles([]);
        setRequestDate('');
        setAlerts({ success: false, error: null });
    }, []);

    const handleFileChange = useCallback((e) => {
        const selectedFiles = Array.from(e.target.files);
        validateAndSetFiles(selectedFiles);
    }, [validateAndSetFiles]);

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(true);
    }, []);

    const handleDragLeave = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            validateAndSetFiles(Array.from(e.dataTransfer.files));
        }
    }, [validateAndSetFiles]);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        if (!selectedDocument || !requestDate || files.length === 0) {
            setAlerts((prev) => ({ ...prev, error: 'Please fill in all required fields and upload files.' }));
            return;
        }

        const newRequest = {
            document: selectedDocument.name,
            description: selectedDocument.description,
            requestDate,
            files: files.map((file) => ({
                name: file.name,
                size: file.size,
                type: file.type
            })),
            user: user?.name || 'Unknown',
            status: 'en cours',
            submissionDate: new Date().toLocaleDateString(),
            processingTime: selectedDocument.processingTime
        };

        try {
            setLoading(true);
            const response = await fetch('http://localhost:3000/demandes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newRequest)
            });

            if (!response.ok) throw new Error('Failed to submit request');

            setAlerts({ success: true, error: null });
            setSelectedDocument(null);
            setFiles([]);
            setRequestDate('');
            dispatch(fetchDemandes());
        } catch (error) {
            setAlerts((prev) => ({ ...prev, error: error.message }));
        } finally {
            setLoading(false);
        }
    }, [selectedDocument, requestDate, files, user, dispatch]);

    const handleDelete = useCallback(async () => {
        try {
            setLoading(true);
            await dispatch(deleteDemande(deleteModal.demandeId)).unwrap();
            setDeleteModal({ isOpen: false, demandeId: null });
            dispatch(fetchDemandes());
        } catch (error) {
            setAlerts((prev) => ({ ...prev, error: error.message }));
        } finally {
            setLoading(false);
        }
    }, [dispatch, deleteModal.demandeId]);

    const StatusBadge = ({ status }) => {
        const statusColors = {
            'en cours': 'bg-yellow-100 text-yellow-800',
            'effectuer': 'bg-green-100 text-green-800',
            'rejeter': 'bg-red-100 text-red-800'
        };

        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
                {status}
            </span>
        );
    };

    return (
        <div className="min-h-screen bg-base-100 text-base-content p-4">
            <h1 className="mb-4 text-2xl font-bold text-center text-gray-500 shadow-lg py-4 rounded-lg ">Demande Documents</h1>

            {/* Tabs */}
            <div className="tabs mb-4">
                <button
                    className={`tab tab-lifted rounded-lg h-full px-4 py-2 transition-all duration-300 ${activeTab === 'new-request'
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg dark:bg-gradient-to-r dark:from-blue-500 dark:to-indigo-500 dark:text-white'
                            : 'bg-base-200 text-gray-700 dark:text-gray-400'
                        }`}
                    onClick={() => setActiveTab('new-request')}
                >
                    New Request
                </button>
                <button
                    className={`tab tab-lifted rounded-lg h-full px-4 py-2 transition-all duration-300 ${activeTab === 'my-requests'
                            ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg'
                            : 'bg-base-200 text-gray-700 dark:text-gray-400'
                        }`}
                    onClick={() => setActiveTab('my-requests')}
                >
                    My Requests
                </button>
            </div>


            {/* Tab Content */}
            {activeTab === 'new-request' && (
                <div className="mt-7 flex flex-col lg:flex-row gap-6">
                    {/* Left Side - Documents List */}
                    <div className="lg:w-1/2 w-full">
                        <h2 className="text-xl text-center font-semibold mb-4">Available Documents</h2>
                        {documentsLoading ? (
                            <div className="flex justify-center items-center">
                                <Loader2 className="animate-spin" />
                            </div>
                        ) : documentsError ? (
                            <div className="alert alert-error">
                                <AlertCircle className="w-6 h-6 mr-2" />
                                {documentsError}
                            </div>
                        ) : (
                            <ul className="space-y-4">
                                {documents.map((doc) => (
                                    <li
                                        key={doc.id}
                                        className={`flex items-center p-4 rounded-lg cursor-pointer border ${selectedDocument?.id === doc.id ? 'border-primary bg-primary/10' : 'border-base-300'
                                            } hover:bg-primary/5 transition`}
                                        onClick={() => handleDocumentSelect(doc)}
                                    >
                                        <FileText className="w-6 h-6 mr-3 text-primary" />
                                        <div>
                                            <h3 className="font-semibold">{doc.name}</h3>
                                            <p className="text-sm text-gray-500">{doc.description}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Right Side - Request Form */}
                    <div className="lg:w-1/2 w-full">
                        <h2 className="text-xl text-center font-semibold mb-4">New Request</h2>
                        {alerts.success && (
                            <div className="alert alert-success mb-4">
                                <CheckCircle className="w-6 h-6 mr-2" />
                                Request submitted successfully!
                            </div>
                        )}
                        {alerts.error && (
                            <div className="alert alert-error mb-4">
                                <AlertCircle className="w-6 h-6 mr-2" />
                                {alerts.error}
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="label">
                                    <span className="label-text">Document</span>
                                </label>
                                <div className="flex items-center space-x-2 bg-base-200 p-4 rounded-lg">
                                    {!selectedDocument && (
                                        <div className=" p-2 rounded-md">
                                            <span className="text-sm">Please select one</span>
                                        </div>
                                    )}
                                    {selectedDocument && (
                                        <div className="flex items-center space-x-2 p-2 rounded-md">
                                        <FileText className="w-5 h-5" />
                                        <span>{selectedDocument.name}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div>
                                <label className="label">
                                    <span className="label-text">Request Date</span>
                                </label>
                                <input
                                    type="date"
                                    className="input input-bordered w-full"
                                    value={requestDate}
                                    onChange={(e) => setRequestDate(e.target.value)}
                                    required
                                />
                            </div>
                            {/* document attachment */}
                            <div className="my-4">
                                <label className="label">
                                    <span>Attachments</span>
                                </label>
                                <div className="space-y-2 bg-base-100 dark:bg-gray-800 p-4 rounded-lg">
                                {selectedDocument?.documentAttachment.map((attachment, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center space-x-4 p-2 bg-gray-100 dark:bg-gray-700 rounded-md"
                                    >
                                        <FilePlus className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                                        <span className="text-gray-800 dark:text-gray-300">{attachment}</span>
                                    </div>
                                ))}
                                </div>
                            </div>
                            <div>
                                <label className="label">
                                    <span className="label-text">Upload Files</span>
                                </label>
                                <div
                                    className={`border-dashed border-2 p-4 rounded-lg text-center cursor-pointer ${dragActive ? 'border-primary bg-primary/10' : 'border-base-300'
                                        }`}
                                    onDragOver={handleDrag}
                                    onDragLeave={handleDragLeave}
                                    onDrop={handleDrop}
                                >
                                    <Upload className="w-8 h-8 mx-auto mb-2 text-primary" />
                                    <p>Drag & Drop files here or click to upload</p>
                                    <input
                                        type="file"
                                        multiple
                                        id="file-upload"
                                        className="hidden"
                                        onChange={handleFileChange}
                                        required
                                    />
                                    <label htmlFor="file-upload" className="btn btn-secondary btn-sm mt-2">
                                        Browse Files
                                    </label>
                                </div>
                                {files.length > 0 && (
                                    <ul className="mt-2 space-y-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                                        {files.map((file, index) => (
                                            <li key={index} className="flex items-center space-x-2 p-1 last:border-b-0">
                                                <FilePlus className="w-5 h-5 text-blue-500 dark:text-blue-300" />
                                                <span className="text-sm font-medium truncate text-gray-800 dark:text-gray-200">{file.name}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <div className="mt-4">
                                <button
                                    type="submit"
                                    className={`w-full btn btn-primary ${loading ? 'loading' : ''}`}
                                    disabled={loading || !selectedDocument || !requestDate || files.length === 0}
                                >
                                    Submit Request
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {activeTab === 'my-requests' && (
                <div className="mt-7">
                    {/* Filters */}
                    <div className="flex flex-col lg:flex-row lg:justify-between gap-4 mb-4">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="input input-bordered w-full lg:w-1/3"
                            value={searchFilter}
                            onChange={(e) => setSearchFilter(e.target.value)}
                        />
                        <input
                            type="date"
                            className="input input-bordered w-full lg:w-1/4"
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value)}
                        />
                        <select
                            className="select select-bordered w-full lg:w-1/4"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="">All Statuses</option>
                            <option value="en cours">En cours</option>
                            <option value="effectuer">Effectué</option>
                            <option value="rejeter">Rejeté</option>
                        </select>
                    </div>

                    {/* Requests List */}
                    {demandesLoading ? (
                        <div className="flex justify-center items-center">
                            <Loader2 className="animate-spin" />
                        </div>
                    ) : demandesError ? (
                        <div className="alert alert-error">
                            <AlertCircle className="w-6 h-6 mr-2" />
                            {demandesError}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Table for Large Screens */}
                            <div className="hidden lg:block overflow-x-auto">
                                <table className="table w-full">
                                    <thead>
                                        <tr>
                                            <th>Document</th>
                                            <th>Description</th>
                                            <th>Request Date</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredDemandes.map((demande) => (
                                            <tr key={demande.id}>
                                                <td>{demande.document}</td>
                                                <td>{demande.description}</td>
                                                <td>{demande.requestDate}</td>
                                                <td>
                                                    <StatusBadge status={demande.status} />
                                                </td>
                                                <td className="flex space-x-2">
                                                    <button
                                                        className="btn btn-sm btn-ghost"
                                                        onClick={() => setViewModal({ isOpen: true, demande })}
                                                    >
                                                        <Info className="w-5 h-5" />
                                                    </button>
                                                    {demande.status !== 'effectuer' && demande.status !== 'rejeter' && (
                                                        <button
                                                            className="btn btn-sm btn-ghost text-red-500"
                                                            onClick={() => setDeleteModal({ isOpen: true, demandeId: demande.id })}
                                                        >
                                                            <Trash className="w-5 h-5" />
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Cards for Small Screens */}
                            <div className="lg:hidden space-y-4">
                                {filteredDemandes.map((demande) => (
                                    <div key={demande.id} className="card shadow-sm">
                                        <div className="card-body">
                                            <h3 className="card-title flex justify-between">
                                                {demande.document}
                                                <StatusBadge status={demande.status} />
                                            </h3>
                                            <p>{demande.description}</p>
                                            <div className="flex justify-between mt-2">
                                                <span className="text-sm text-gray-500">Date: {demande.requestDate}</span>
                                                <div className="flex space-x-2">
                                                    <button
                                                        className="btn btn-sm btn-ghost"
                                                        onClick={() => setViewModal({ isOpen: true, demande })}
                                                    >
                                                        <Info className="w-5 h-5" />
                                                    </button>
                                                    {demande.status !== 'effectuer' && demande.status !== 'rejeter' && (
                                                        <button
                                                            className="btn btn-sm btn-ghost text-red-500"
                                                            onClick={() => setDeleteModal({ isOpen: true, demandeId: demande.id })}
                                                        >
                                                            <Trash className="w-5 h-5" />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* View Modal */}
                    {viewModal.isOpen && viewModal.demande && (
                        <div className="modal modal-open">
                            <div className="modal-box">
                                <h3 className="font-bold text-lg">Request Details</h3>
                                <div className="mt-4 space-y-2">
                                    <p><strong>Document:</strong> {viewModal.demande.document}</p>
                                    <p><strong>Description:</strong> {viewModal.demande.description}</p>
                                    <p><strong>Request Date:</strong> {viewModal.demande.requestDate}</p>
                                    <p><strong>Status:</strong> <StatusBadge status={viewModal.demande.status} /></p>
                                    <p><strong>Submission Date:</strong> {viewModal.demande.submissionDate}</p>
                                    <p><strong>Processing Time:</strong> {viewModal.demande.processingTime}</p>
                                    <div>
                                        <strong>Files:</strong>
                                        <ul className="list-disc list-inside">
                                            {viewModal.demande.files.map((file, index) => (
                                                <li key={index}>
                                                    <a href="#" className="text-blue-500 hover:underline">
                                                        {file.name} ({(file.size / 1024).toFixed(2)} KB)
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                                <div className="modal-action">
                                    <button className="btn" onClick={() => setViewModal({ isOpen: false, demande: null })}>
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Delete Confirmation Modal */}
                    {deleteModal.isOpen && (
                        <div className="modal modal-open">
                            <div className="modal-box">
                                <h3 className="font-bold text-lg">Confirm Deletion</h3>
                                <p className="py-4">Are you sure you want to delete this request?</p>
                                <div className="modal-action">
                                    <button className={`btn btn-error ${loading ? 'loading' : ''}`} onClick={handleDelete} disabled={loading}>
                                        {loading ? 'Deleting...' : 'Delete'}
                                    </button>
                                    <button className="btn" onClick={() => setDeleteModal({ isOpen: false, demandeId: null })}>
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default DocumentsPage;
