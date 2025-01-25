import { useRef, useState, useEffect, useMemo } from "react";
import ReactDOM from "react-dom";
import {
    ScrollText, Award, GraduationCap, AlertTriangle,
    FileBadge, FileType2, Scale, Users, User, Printer
} from 'lucide-react';
import Convocation from "./TemplatesDocs/Convocation";
import MiseEnGardeForm from "./TemplatesDocs/MiseEnGarde";
import ReprimandNotice from "./TemplatesDocs/ReprimandNotice";
import BacWithdrawalNotice from "./TemplatesDocs/RetraitBacProvisoire";
import WarningNotice from "./TemplatesDocs/WarningNotice";
import FormInput from "./FormInput";
import RetraitBacDéfinitif from "./TemplatesDocs/RetraitBacDéfinitif";

import DocumentCard from "./DocumentCard";

const DOCUMENT_TYPES = [
    {
        type: "convocation",
        icon: ScrollText,
        label: "Convocation",
        component: Convocation,
        theme: "primary"
    },
    {
        type: "mise-en-garde",
        icon: Award,
        label: "Mise en Garde",
        component: MiseEnGardeForm,
        theme: "secondary"
    },
    {
        type: "rebuke",
        icon: AlertTriangle,
        label: "Avis de Réprimande & Avertissement",
        components: { ReprimandNotice, WarningNotice },
        theme: "warning"
    },
    {
        type: "bac-withdrawal-temprory",
        icon: FileBadge,
        label: "Retrait Bac Provisoire",
        component: BacWithdrawalNotice,
        theme: "error"
    },
    {
        type: "bac-withdrawal-definitive",
        icon: GraduationCap,
        label: "Retrait Bac Definitif",
        component: RetraitBacDéfinitif,
        theme: "info"
    }
];



const Docs = () => {
    const [form, setForm] = useState({
        name: "",
        filiere: "",
        group: "",
        date: "",
        birthdate: "",
        level : [
            "TS", "T" , "S"
        ],
        year : [
            "1A", "2A", "3A"
        ],
        type: "convocation",
        reason: [],
        resen1: "",
        resen2: "",
        resen3: "",
        cin: "",
        details: "",
    });
    const [selectedCard, setSelectedCard] = useState("convocation");
    const [isParGroupSelected, setIsParGroupSelected] = useState(false);
    const [selectedRebuke, setSelectedRebuke] = useState("ReprimandNotice");
    const [groupes, setGroupes] = useState([]);
    const printRef = useRef(null);
    const [error, setError] = useState("")
    const [stagiaires, setStagiaires] = useState([]);

    const fetchStagiaires = async () => {
        try {
            const response = await fetch("http://localhost:3000/stagiaires");
            const data = await response.json();
            setStagiaires(data || []);
        } catch (error) {
            console.error("Failed to fetch stagiaires:", error);
        }
    };

    useEffect(() => {
        fetchStagiaires();
    }, []);

    const validateForm = () => {
        if (!form.name && !form.group) {
            setError("Veuillez remplir au moins un champ");
            return false;
        }
        if (!form.date) {
            setError("Veuillez sélectionner une date");
            return false;
        }
        return true;
    };

    const createPrintableDocument = (student) => {
        const documentType = DOCUMENT_TYPES.find((doc) => doc.type === selectedCard);
        let DocumentComponent;

        if (selectedCard === "rebuke") {
            DocumentComponent = documentType.components[selectedRebuke];
        } else {
            DocumentComponent = documentType?.component;
        }

        // Create a wrapper div with consistent page styling
        const container = document.createElement("div");
        container.className = "print-page";
        // Apply consistent page break and margin styles
        container.style.cssText = `
            page-break-after: always;
            page-break-inside: avoid;
            margin: 0;
            padding: 0;
            height: 100%;
            box-sizing: border-box;
            position: relative; // Ensure z-index works
        `;

        let documentProps = {
            key: student.idEtudiant,
            name: student.nomEtudiant,
            group: form.group,
            date: form.date,
            reason: form.reason,
            resen1: form.resen1,
            resen2: form.resen2,
            resen3: form.resen3,
        };

        if (selectedCard === "bac-withdrawal") {
            documentProps.cin = student.cin;
            documentProps.student = student;
        }

        ReactDOM.render(
            <DocumentComponent {...documentProps} />,
            container
        );

        return container;
    };

    const onPrint = () => {
        if (!validateForm()) return;

        // Store original styles
        const originalDisplay = document.querySelector(".navbar")?.style.display;
        const originalSidebarDisplay = document.querySelector(".sidebar")?.style.display;
        const originalOverflow = document.body.style.overflow;

        // Create print container with specific print styles
        const printContainer = document.createElement("div");
        printContainer.className = "print-container";
        printContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            margin: 0;
            padding: 0;
            z-index: 1000; // Ensure it's on top
        `;

        // Add print-specific styles to the document
        const styleSheet = document.createElement("style");
        styleSheet.textContent = `
            @media print {
                @page {
                    size: A4;
                    margin: 0;
                }
                
                body {
                    margin: 0;
                    padding: 0;
                }
                
                .print-page {
                    width: 210mm;
                    height: 297mm;
                    margin: 0;
                    padding: 20mm;
                    box-sizing: border-box;
                    page-break-after: always;
                    page-break-inside: avoid;
                    position: relative; // Ensure z-index works
                }
                
                .print-container {
                    width: 100%;
                }
    
                .navbar, .sidebar {
                    display: none !important; // Hide navbar and sidebar
                }
    
                .print-page * {
                    z-index: 1000; // Ensure all elements inside print-page are on top
                }
            }
        `;
        document.head.appendChild(styleSheet);

        document.body.appendChild(printContainer);

        try {
            if (isParGroupSelected && form.group) {
                const selectedGroup = groupes.find((groupe) => groupe.niveau === form.group);
                if (!selectedGroup) return;

                const documents = selectedGroup.liste.map(createPrintableDocument);
                documents.forEach((doc) => printContainer.appendChild(doc));
            } else {
                let documentProps = {
                    name: form.name,
                    group: form.group,
                    date: form.date,
                    reason: form.reason,
                    resen1: form.resen1,
                    resen2: form.resen2,
                    resen3: form.resen3,
                };

                if (selectedCard === "bac-withdrawal") {
                    documentProps.cin = form.cin;
                }

                let DocumentComponent;
                if (selectedCard === "rebuke") {
                    const documentType = DOCUMENT_TYPES.find((doc) => doc.type === selectedCard);
                    DocumentComponent = documentType.components[selectedRebuke];
                } else {
                    DocumentComponent = DOCUMENT_TYPES.find((doc) => doc.type === selectedCard)?.component;
                }

                const container = createPrintableDocument({ nomEtudiant: form.name, idEtudiant: 'single' });
                printContainer.appendChild(container);
            }

            // Hide navbar and sidebar, set body overflow
            const navbar = document.querySelector(".navbar");
            if (navbar) navbar.style.display = "none";
            const sidebar = document.querySelector(".sidebar");
            if (sidebar) sidebar.style.display = "none";
            document.body.style.overflow = "visible";

            window.print();
        } catch (err) {
            console.error("Print error:", err);
            alert("An error occurred during printing");
        } finally {
            // Cleanup
            const navbar = document.querySelector(".navbar");
            if (navbar) navbar.style.display = originalDisplay;
            const sidebar = document.querySelector(".sidebar");
            if (sidebar) sidebar.style.display = originalSidebarDisplay;
            document.body.style.overflow = originalOverflow;
            document.body.removeChild(printContainer);
            document.head.removeChild(styleSheet);
        }
    };

    const uniqueCodeDiplomes = [...new Set(stagiaires.map(stagiaire => stagiaire.CodeDiplome))];
    const uniqueLibelleLongs = [...new Set(stagiaires.map(stagiaire => stagiaire.LibelleLong))];


    const renderDocumentForm = () => (
        <div className="form-control w-full gap-4">
            {!isParGroupSelected && (
                <FormInput
                    label="Nom et prenom"
                    name="name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="input input-bordered w-full"
                />
            )}

            <div className="form-control">
                <label className="text-lg font-semibold text-gray-400">
                    Filiere
                </label>
                <select
                    className="w-full select select-bordered"
                    value={form.filiere}
                    onChange={(e) => setForm({ ...form, filiere: e.target.value })}
                    required
                >
                    <option value="" disabled>
                        Choisir un Filiere...
                    </option>
                    {uniqueLibelleLongs.map((liblelle, index) => (
                        <option key={index} value={liblelle}>
                            {liblelle}
                        </option>
                    ))}
                </select>
            </div>


            <div className="form-control">
                <label className="text-lg font-semibold text-gray-400">
                    Groupe
                </label>
                <select
                    className="w-full select select-bordered"
                    value={form.group}
                    onChange={(e) => setForm({ ...form, group: e.target.value })}
                    required
                >
                    <option value="" disabled>
                        Choisir un groupe...
                    </option>
                    {uniqueCodeDiplomes.map((code, index) => (
                        <option key={index} value={code}>
                            {code}
                        </option>
                    ))}
                </select>
            </div>

            <FormInput
                label="Date"
                type="date"
                name="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="input input-bordered w-full"
            />

            {selectedCard === "rebuke" && (
                <div className="space-y-4">
                    <div className="tabs tabs-boxed">
                        <button
                            className={`tab ${selectedRebuke === "ReprimandNotice" ? "tab-active" : ""}`}
                            onClick={() => setSelectedRebuke("ReprimandNotice")}
                        >
                            Avis de Réprimande
                        </button>
                        <button
                            className={`tab ${selectedRebuke === "WarningNotice" ? "tab-active" : ""}`}
                            onClick={() => setSelectedRebuke("WarningNotice")}
                        >
                            Avertissement
                        </button>
                    </div>

                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Reasons</span>
                        </label>
                        {["Absence non justifiée", "Retard répété", "Comportement inapproprié", "Non-respect du règlement"]
                            .map((reason) => (
                                <label key={reason} className="label cursor-pointer">
                                    <span className="label-text">{reason}</span>
                                    <input
                                        type="checkbox"
                                        className="checkbox"
                                        checked={form.reason.includes(reason)}
                                        onChange={(e) => {
                                            const newReasons = e.target.checked
                                                ? [...form.reason, reason]
                                                : form.reason.filter(r => r !== reason);
                                            setForm({ ...form, reason: newReasons });
                                        }}
                                    />
                                </label>
                            ))}
                    </div>
                </div>
            )}
            {
                selectedCard === "mise-en-garde" ? (
                    <>
                        <label htmlFor="details" className="text-lg font-semibold text-gray-400">
                            Details
                        </label>
                        <textarea name="details" value={form.details} onChange={(e) => setForm({ ...form, details: e.target.value })} className="textarea textarea-bordered" placeholder="Details"/>
                    </>
                ): null
            }
            {
                selectedCard === "bac-withdrawal-temprory" || selectedCard === "bac-withdrawal-definitive" ? (
                    <FormInput
                        label="CIN"
                        name="cin"
                        value={form.cin}
                        onChange={(e) => setForm({ ...form, cin: e.target.value })}
                        className="input input-bordered w-full"
                    />
                ): null
            }
            
            {
                selectedCard === "bac-withdrawal-temprory"  || selectedCard === "bac-withdrawal-definitive" ? (
                    <>
                    <FormInput
                        label="Date de Naaissance"
                        name="birthdate"
                        type="date"
                        value={form.birthdate}
                        onChange={(e) => setForm({ ...form, birthdate: e.target.value })}
                        className="input input-bordered w-full"
                    />
                    <div>
                        <label className="label">
                            <span className="label-text">Reasons</span>
                        </label>
                        {["Absence non justifiée", "Retard répété", "Comportement inapproprié", "Non-respect du règlement"]
                            .map((reason) => (
                                <label key={reason} className="label cursor-pointer">
                                    <span className="label-text">{reason}</span>
                                    <input
                                        type="checkbox"
                                        className="checkbox"
                                        checked={form.reason.includes(reason)}
                                        onChange={(e) => {
                                            const newReasons = e.target.checked
                                                ? [...form.reason, reason]
                                                : form.reason.filter(r => r !== reason);
                                            setForm({ ...form, reason: newReasons });
                                        }}
                                    />
                                </label>
                            ))}
                    </div>
                    </>
                ) : null
            }
        </div>
    );

    const renderDocument = useMemo(() => {
        const documentType = DOCUMENT_TYPES.find(doc => doc.type === selectedCard);
        const DocumentComponent = selectedCard === "rebuke"
            ? documentType?.components[selectedRebuke]
            : documentType?.component;

        return DocumentComponent ? <DocumentComponent {...form} /> : null;
    }, [form, selectedCard, selectedRebuke]);

    return (
        <>
            {error ? (
                <div role="alert" className="alert alert-error my-3">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 shrink-0 stroke-current"
                        fill="none"
                        viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{error}.</span>
                </div>
            ) : ""}
            <div className="drawer lg:drawer-open">

                <input id="docs-drawer" type="checkbox" className="drawer-toggle" />

                <div className="drawer-content flex flex-col">
                    {/* Navbar */}
                    <div className="navbar bg-base-200 lg:hidden">
                        <div className="flex-none">
                            <label htmlFor="docs-drawer" className="btn btn-square btn-ghost">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-6 h-6 stroke-current">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                                </svg>
                            </label>
                        </div>
                        <div className="flex-1">
                            <h1 className="text-xl font-bold">Documents Generator</h1>
                        </div>
                    </div>


                    {/* Main Content */}
                    <div className="flex flex-1">
                        {/* Document Preview */}
                        <div className="flex-1 p-4">
                            <div className="card bg-base-100 h-full">
                                <div className="card-body border border-gray-400 rounded-xl">
                                    {renderDocument}
                                </div>
                            </div>
                        </div>

                        {/* Document Types */}
                        <div className="w-64 bg-base-100 p-4">
                            <div className="space-y-4">
                                <h2 className="text-xl font-bold text-center">Document Types</h2>
                                <hr className="my-3" />
                                <div className="grid gap-4">
                                    {DOCUMENT_TYPES.map(({ type, icon: Icon, label, theme }) => (
                                        <DocumentCard
                                            key={type}
                                            type={type}
                                            Icon={Icon}
                                            label={label}
                                            theme={theme}
                                            isSelected={selectedCard === type}
                                            onClick={setSelectedCard}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Drawer */}
                <div className="drawer-side">
                    <label htmlFor="docs-drawer" className="drawer-overlay"></label>
                    <div className="p-4 w-80 bg-base-100 text-base-content h-full">
                        <h2 className="text-xl font-bold mb-4">Document Settings</h2>

                        <div className="join mb-4 w-full">
                            <button
                                className={`join-item btn ${!isParGroupSelected ? 'btn-active' : ''}`}
                                onClick={() => setIsParGroupSelected(false)}
                            >
                                <User className="w-4 h-4 mr-2" />
                                Individual
                            </button>
                            <button
                                className={`join-item btn ${isParGroupSelected ? 'btn-active' : ''}`}
                                onClick={() => setIsParGroupSelected(true)}
                            >
                                <Users className="w-4 h-4 mr-2" />
                                Group
                            </button>
                        </div>

                        {renderDocumentForm()}

                        <button
                            className="btn btn-primary w-full mt-4"
                            onClick={onPrint}
                        >
                            <Printer className="w-4 h-4 mr-2" />
                            Print Document
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Docs;