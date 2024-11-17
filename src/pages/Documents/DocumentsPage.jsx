import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDocuments } from '../../features/documents/documentSlice';
import {
  CheckCircle,
  FileText,
  Upload,
  AlertCircle,
  Clock,
  Calendar,
  Loader2,
  X
} from 'lucide-react';

const DocumentsPage = () => {
  const dispatch = useDispatch();
  const { documents, loading, error } = useSelector((state) => state.documents);

  const [selectedDocument, setSelectedDocument] = useState(null);
  const [requestDate, setRequestDate] = useState('');
  const [files, setFiles] = useState([]);
  const [requests, setRequests] = useState([]);
  const [alerts, setAlerts] = useState({ success: false, error: null });
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    dispatch(fetchDocuments());
  }, [dispatch]);

  useEffect(() => {
    if (alerts.success) {
      const timer = setTimeout(() => {
        setAlerts(prev => ({ ...prev, success: false }));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alerts.success]);

  const handleDocumentSelect = (doc) => {
    setSelectedDocument(doc);
    setFiles([]);
    setRequestDate('');
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    validateAndSetFiles(selectedFiles);
  };

  const validateAndSetFiles = (selectedFiles) => {
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    const validFiles = selectedFiles.filter(file =>
      validTypes.includes(file.type) && file.size <= 5 * 1024 * 1024
    );

    if (validFiles.length !== selectedFiles.length) {
      setAlerts(prev => ({
        ...prev,
        error: "Certains fichiers ont été rejetés. Veuillez utiliser uniquement des fichiers PDF, JPG ou PNG de moins de 5 Mo."
      }));
    }

    setFiles(validFiles);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newRequest = {
      id: Date.now(),
      document: selectedDocument.name,
      description: selectedDocument.description,
      requestDate,
      files: files.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type
      })),
      status: 'en cours',
      submissionDate: new Date().toLocaleDateString(),
      processingTime: selectedDocument.processingTime,
    };

    setRequests(prev => [newRequest, ...prev]);
    setAlerts({ success: true, error: null });
    setSelectedDocument(null);
    setFiles([]);
    setRequestDate('');
  };

  const isFormValid = selectedDocument && requestDate && files.length > 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">Demande de Documents</h1>
        <p className="text-gray-600 text-lg">Portail de demande de documents administratifs</p>
      </div>

      {alerts.success && (
        <div className="alert alert-success mb-6">
          <CheckCircle className="w-5 h-5" />
          <span>Votre demande a été soumise avec succès. Vous pouvez suivre son état ci-dessous.</span>
        </div>
      )}

      {alerts.error && (
        <div className="alert alert-error mb-6">
          <AlertCircle className="w-5 h-5" />
          <span>{alerts.error}</span>
          <button
            onClick={() => setAlerts(prev => ({ ...prev, error: null }))}
            className="btn btn-circle btn-ghost btn-sm absolute right-2 top-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="grid md:grid-cols-5 gap-6">
        {/* Document Selection */}
        <div className="md:col-span-2">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Documents Disponibles
              </h2>
              <div className="space-y-3">
                {documents.map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => handleDocumentSelect(doc)}
                    className={`w-full text-left transition-all ${selectedDocument?.id === doc.id
                        ? 'bg-primary/10 border-primary'
                        : 'hover:bg-base-200 border-base-300'
                      } border rounded-lg p-3 focus:outline-none`}
                  >
                    <div className="flex items-start gap-3">
                      <FileText className={`w-5 h-5 mt-1 ${selectedDocument?.id === doc.id ? 'text-primary' : 'text-base-content/60'
                        }`} />
                      <div>
                        <h3 className="font-medium">{doc.name}</h3>
                        <p className="text-sm text-base-content/60 mt-1">{doc.description}</p>
                        <div className="flex items-center gap-2 mt-2 text-sm text-base-content/60">
                          <Clock className="w-4 h-4" />
                          {doc.processingTime}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Request Form */}
        <div className="md:col-span-3">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <form onSubmit={handleSubmit} className="space-y-6">
                {selectedDocument ? (
                  <>
                    <div>
                      <h2 className="text-xl font-semibold flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        {selectedDocument.name}
                      </h2>
                      <p className="text-base-content/60 mt-1">{selectedDocument.description}</p>
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text">Date souhaitée de réception</span>
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          value={requestDate}
                          onChange={(e) => setRequestDate(e.target.value)}
                          className="input input-bordered w-full pr-10"
                          min={new Date().toISOString().split('T')[0]}
                        />
                        <Calendar className="absolute right-3 top-3 w-5 h-5 text-base-content/40" />
                      </div>
                    </div>

                    <div className="alert alert-info">
                      <AlertCircle className="w-5 h-5" />
                      <div>
                        <h3 className="font-medium">Documents requis :</h3>
                        <ul className="mt-2 space-y-1 ml-6 list-disc">
                          {selectedDocument.documentattachment.map((doc, index) => (
                            <li key={index}>{doc}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div
                      className={`border-2 border-dashed rounded-lg p-6 transition-colors ${dragActive ? 'border-primary bg-primary/5' : 'border-base-300'
                        }`}
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                    >
                      <div className="text-center">
                        <Upload className="mx-auto w-8 h-8 text-base-content/40" />
                        <p className="mt-2 text-sm">
                          Glissez-déposez vos fichiers ici ou
                          <label className="link link-primary mx-1 cursor-pointer">
                            parcourez
                            <input
                              type="file"
                              multiple
                              onChange={handleFileChange}
                              accept=".pdf,.jpg,.jpeg,.png"
                              className="hidden"
                            />
                          </label>
                        </p>
                        <p className="text-xs text-base-content/60 mt-1">
                          PDF, JPG ou PNG (max. 5 Mo)
                        </p>
                      </div>
                    </div>

                    {files.length > 0 && (
                      <div className="space-y-2">
                        {files.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 bg-base-200 rounded-lg"
                          >
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4" />
                              <span className="text-sm">{file.name}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => setFiles(files.filter((_, i) => i !== index))}
                              className="btn btn-ghost btn-circle btn-sm"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={!isFormValid}
                      className="btn btn-primary w-full"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Soumettre la demande
                    </button>
                  </>
                ) : (
                  <div className="text-center py-12 text-base-content/60">
                    <FileText className="w-12 h-12 mx-auto mb-3" />
                    Veuillez sélectionner un document à gauche pour commencer
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Requests List */}
      {requests.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">Mes demandes</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {requests.map((request) => (
              <div key={request.id} className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{request.document}</h3>
                      <p className="text-sm text-base-content/60 mt-1">{request.description}</p>
                    </div>
                    <div className="badge badge-primary">{request.status}</div>
                  </div>

                  <div className="divider"></div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-base-content/60">Date de demande</p>
                      <p className="font-medium">{request.submissionDate}</p>
                    </div>
                    <div>
                      <p className="text-base-content/60">Date souhaitée</p>
                      <p className="font-medium">{request.requestDate}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-base-content/60">Délai de traitement</p>
                      <p className="font-medium">{request.processingTime}</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Documents joints:</h4>
                    <div className="flex flex-wrap gap-2">
                      {request.files.map((file, index) => (
                        <span
                          key={index}
                          className="badge badge-outline gap-1"
                        >
                          <FileText className="w-3 h-3" />
                          {file.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentsPage;