import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDocuments } from '../../features/documents/documentSlice';
import { fetchDemandes, deleteDemande } from '../../features/documents/demandeSlice';
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
} from 'lucide-react';
import axios from 'axios';

const DocumentsPage = () => {
  const dispatch = useDispatch();
  const { documents, loading, error } = useSelector((state) => state.documents);
  const { demandes } = useSelector((state) => state.demandes);

  const [selectedDocument, setSelectedDocument] = useState(null);
  const [requestDate, setRequestDate] = useState('');
  const [files, setFiles] = useState([]);
  const [userData, setUserData] = useState(null);
  const [alerts, setAlerts] = useState({ success: false, error: null });
  const [dragActive, setDragActive] = useState(false);
  const [filteredDemandes, setFilteredDemandes] = useState([]);

  // Fetch documents and demandes
  useEffect(() => {
    dispatch(fetchDocuments());
    dispatch(fetchDemandes());
  }, [dispatch]);

  // Auto-dismiss success alerts
  useEffect(() => {
    if (alerts.success) {
      const timer = setTimeout(() => setAlerts((prev) => ({ ...prev, success: false })), 5000);
      return () => clearTimeout(timer);
    }
  }, [alerts.success]);

  // Fetch user data
  const userId =
    (localStorage.getItem('user') && JSON.parse(localStorage.getItem('user')).id) ||
    (sessionStorage.getItem('user') && JSON.parse(sessionStorage.getItem('user')).id) ||
    null;

  useEffect(() => {
    if (userId) {
      const fetchUser = async () => {
        try {
          const response = await axios.get('http://localhost:3000/users');
          const user = response.data.find((u) => u.id === userId);
          setUserData(user);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      };

      fetchUser();
    }
  }, [userId]);

  // Filter demandes by user
  useEffect(() => {
    if (userData && demandes) {
      const filtered = demandes.filter((demande) => demande.user === userData?.name);
      setFilteredDemandes(filtered);
    }
  }, [userData, demandes]);

  const handleDocumentSelect = (doc) => {
    setSelectedDocument(doc);
    setFiles([]);
    setRequestDate('');
  };

  const validateAndSetFiles = (selectedFiles) => {
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    const validFiles = selectedFiles.filter(
      (file) => validTypes.includes(file.type) && file.size <= 5 * 1024 * 1024
    );

    if (validFiles.length !== selectedFiles.length) {
      setAlerts((prev) => ({
        ...prev,
        error:
          'Some files were rejected. Only PDF, JPG, and PNG files under 5MB are allowed.',
      }));
    }

    setFiles(validFiles);
  };

  const handleFileChange = (e) => {
    validateAndSetFiles(Array.from(e.target.files));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files) {
      validateAndSetFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newRequest = {
      document: selectedDocument.name,
      description: selectedDocument.description,
      requestDate,
      files: files.map((file) => ({
        name: file.name,
        size: file.size,
        type: file.type,
      })),
      user: userData?.name || 'Unknown',
      status: 'Pending',
      submissionDate: new Date().toLocaleDateString(),
      processingTime: selectedDocument.processingTime,
    };

    try {
      const response = await fetch('http://localhost:3000/demandes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRequest),
      });

      if (!response.ok) throw new Error('Failed to submit request');

      setAlerts({ success: true, error: null });
      setSelectedDocument(null);
      setFiles([]);
      setRequestDate('');
    } catch (error) {
      setAlerts((prev) => ({ ...prev, error: error.message }));
    }
  };

  const handleDelete = (id) => {
    dispatch(deleteDemande(id));
  };

  const isFormValid = selectedDocument && requestDate && files.length > 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div>Error fetching demandes: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Document Requests</h1>
        <p className="text-gray-600 text-lg">Administrative Document Request Portal</p>
      </div>

      {/* Alerts */}
      {alerts.success && (
        <div className="alert alert-success mb-6">
          <CheckCircle className="w-5 h-5" />
          <span>Your request was submitted successfully.</span>
        </div>
      )}
      {alerts.error && (
        <div className="alert alert-error mb-6">
          <AlertCircle className="w-5 h-5" />
          <span>{alerts.error}</span>
          <button
            onClick={() => setAlerts((prev) => ({ ...prev, error: null }))}
            className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Content */}
      <div className="grid md:grid-cols-5 gap-6">
        {/* Document List */}
        <div className="md:col-span-2">
          <div className="card bg-base-100 shadow-xl border border-gray-400 rounded">
            <div className="card-body">
              <h2 className="card-title flex items-center gap-2 my-3">
                <FileText className="w-5 h-5" />
                Available Documents
              </h2>
              <div className="space-y-3">
                {documents.map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => handleDocumentSelect(doc)}
                    className={`w-full text-left border border-gray-400 rounded-lg p-3 ${
                      selectedDocument?.id === doc.id
                        ? 'bg-primary/10 border-primary'
                        : 'hover:bg-base-200 border-base-300'
                    }`}
                  >
                    <div>
                      <h3 className="font-medium">{doc.name}</h3>
                      <p className="text-sm text-gray-600">{doc.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="md:col-span-3">
          <div className="card bg-base-100 shadow-xl border border-gray-400 rounded">
            <div className="card-body">
              {selectedDocument ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Date Input */}
                  <div>
                    <label className="label">
                      <span className="label-text">Request Date</span>
                    </label>
                    <input
                      type="date"
                      value={requestDate}
                      onChange={(e) => setRequestDate(e.target.value)}
                      className="input input-bordered w-full"
                    />
                  </div>
                  {/* File Input */}
                  <div
                    className={`border-2 border-dashed rounded-lg p-6 ${
                      dragActive ? 'border-primary bg-primary/10' : 'border-gray-400'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <p>Drag and drop files or click to upload</p>
                    <input
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                    />
                  </div>
                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={!isFormValid}
                    className={`btn btn-primary w-full ${
                      isFormValid ? '' : 'btn-disabled'
                    }`}
                  >
                    Submit Request
                  </button>
                </form>
              ) : (
                <p>Please select a document to begin.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentsPage;