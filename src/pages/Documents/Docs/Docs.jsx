import { useRef, useState, useEffect, useMemo } from "react";
import ReactDOM from "react-dom";
import { FileText, GraduationCap, ClipboardList, User, Users } from "lucide-react";
import Convocation from "./TemplatesDocs/Convocation";
import RetraitBacProvisoire from "./TemplatesDocs/RetraitBacProvisoire";
import DocumentCard from "./DocumentCard";
import ReprimandNotice from "./TemplatesDocs/ReprimandNotice";
import BacWithdrawalNotice from "./TemplatesDocs/BacWithdrawalNotice";
import WarningNotice from "./TemplatesDocs/WarningNotice";
import FormInput from "./FormInput";
import SelectionToggle from "./SelectionToggle";
import PrintWrapper from "./PrintWrapper";
import Tawbikh from "./TemplatesDocs/Tawbikh";

// Custom Hook for Fetching Group Data
const useGroupData = () => {
  const [groupes, setGroupes] = useState([]);
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGroupesAndStudents = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("http://localhost:3000/groups");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setGroupes(data || []);
        setStudents(data.flatMap((group) => group.liste) || []);
      } catch (error) {
        console.error("Failed to fetch groups:", error);
        setError(error instanceof Error ? error.message : "An unknown error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroupesAndStudents();
  }, []);

  return { groupes, students, isLoading, error };
};

// Document Type Configuration
const DOCUMENT_TYPES = [
  {
    type: "convocation",
    icon: FileText,
    label: "Convocation",
    component: Convocation
  },
  {
    type: "retrait-bac",
    icon: ClipboardList,
    label: "Retrait Bac Provisoire",
    component: RetraitBacProvisoire
  },
  {
    type: "rebuke",
    icon: GraduationCap,
    label: "Reprimand Notice",
    components: {
      ReprimandNotice,
      WarningNotice
    }
  },
  {
    type: "bac-withdrawal",
    icon: ClipboardList,
    label: "Bac Withdrawal Notice",
    component: BacWithdrawalNotice
  },
  {
    type: "tawbikh",
    icon: ClipboardList,
    label: "توبيخ",
    component: Tawbikh
  }
];

const Docs = () => {
  const [form, setForm] = useState({
    name: "",
    group: "",
    date: "",
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
  const printRef = useRef(null);

  const { groupes, students, isLoading, error } = useGroupData();

  const validateForm = () => {
    if (!form.name && !form.group) {
      alert("Veuillez remplir au moins un champ");
      return false;
    }
    if (!form.date) {
      alert("Veuillez sélectionner une date");
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

    const container = document.createElement("div");
    container.style.pageBreakAfter = "always";

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

    // Add specific props for different document types
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

    const originalDisplay = document.querySelector(".navbar")?.style.display;

    const printContainer = document.createElement("div");
    printContainer.style.position = "absolute";
    printContainer.style.top = "0";
    printContainer.style.left = "0";
    printContainer.style.width = "100%";
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

        // Add specific props for different document types
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

        ReactDOM.render(
          <DocumentComponent {...documentProps} />,
          printContainer
        );
      }

      const navbar = document.querySelector(".navbar");
      if (navbar) navbar.style.display = "none";

      window.print();
    } catch (err) {
      console.error("Print error:", err);
      alert("An error occurred during printing");
    } finally {
      const navbar = document.querySelector(".navbar");
      if (navbar) navbar.style.display = originalDisplay;
      document.body.removeChild(printContainer);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleCardClick = (type) => {
    setSelectedCard(type);
    setForm((prevForm) => ({
      ...prevForm,
      type,
      // Reset specific fields when changing document type
      reason: [],
      resen1: "",
      resen2: "",
      resen3: "",
      cin: "",
      details: "",
    }));
  };

  const renderDocument = useMemo(() => {
    let DocumentComponent;
    const documentType = DOCUMENT_TYPES.find((doc) => doc.type === form.type);

    if (form.type === "rebuke") {
      DocumentComponent = documentType?.components[selectedRebuke];
    } else {
      DocumentComponent = documentType?.component;
    }

    return DocumentComponent ? <DocumentComponent {...form} /> : null;
  }, [form, selectedRebuke]);

  const renderForm = () => {
    if (form.type === "listes") return null;

    if (isParGroupSelected) {
      return (
        <div className="space-y-4">
          <select
            name="group"
            value={form.group}
            onChange={handleChange}
            className="select select-bordered w-full"
          >
            <option value="">Sélectionnez un groupe</option>
            {groupes.map(({ id, niveau }) => (
              <option key={id} value={niveau}>
                {niveau}
              </option>
            ))}
          </select>
          <FormInput
            label="Date"
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
          />
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <FormInput
          label="Nom"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Nom"
        />
        <FormInput
          label="Group & Filière"
          name="group"
          value={form.group}
          onChange={handleChange}
          placeholder="Group"
        />
        <FormInput
          label="Date"
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
        />

        {form.type === "retrait-bac" && (
          <FormInput
            label="Détails"
            name="details"
            value={form.details}
            onChange={handleChange}
            placeholder="Détails"
          />
        )}

        {form.type === "rebuke" && (
          <>
            {/* Rebuke Type Selection */}
            <div className="flex space-x-4 mb-4">
              <button
                type="button"
                className={`px-4 py-2 rounded ${selectedRebuke === "ReprimandNotice"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                  }`}
                onClick={() => setSelectedRebuke("ReprimandNotice")}
              >
                Reprimand Notice
              </button>
              <button
                type="button"
                className={`px-4 py-2 rounded ${selectedRebuke === "WarningNotice"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                  }`}
                onClick={() => setSelectedRebuke("WarningNotice")}
              >
                Warning Notice
              </button>
            </div>

            {/* Reason Checkboxes */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Reasons
              </label>
              {[
                "Absence non justifiée",
                "Retard répété",
                "Comportement inapproprié",
                "Non-respect du règlement"
              ].map((reason) => (
                <div key={reason} className="flex items-center">
                  <input
                    type="checkbox"
                    id={reason}
                    name="reason"
                    value={reason}
                    checked={form.reason.includes(reason)}
                    onChange={(e) => {
                      setForm((prevForm) => ({
                        ...prevForm,
                        reason: e.target.checked
                          ? [...prevForm.reason, reason]
                          : prevForm.reason.filter((r) => r !== reason)
                      }));
                    }}
                    className="mr-2"
                  />
                  <label htmlFor={reason}>{reason}</label>
                </div>
              ))}
            </div>

            <FormInput
              label="Resen 1"
              name="resen1"
              value={form.resen1}
              onChange={handleChange}
              placeholder="Resen 1"
            />
            <FormInput
              label="Resen 2"
              name="resen2"
              value={form.resen2}
              onChange={handleChange}
              placeholder="Resen 2"
            />
            <FormInput
              label="Resen 3"
              name="resen3"
              value={form.resen3}
              onChange={handleChange}
              placeholder="Resen 3"
            />
          </>
        )}
        {
          form.type === "bac-withdrawal" && (
            <FormInput
              label="CIN"
              name="cin"
              value={form.cin}
              onChange={handleChange}
              placeholder="CIN"
            />
          )
        }
      </div>
    );
  };

  if (isLoading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div className="flex h-screen">
      <div className="w-1/2 border-r border-gray-200 p-8 overflow-y-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Documents
          </h1>
          <p>Cette page vous permet de générer des documents.</p>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-8">
          {DOCUMENT_TYPES.map(({ type, icon: Icon, label }) => (
            <DocumentCard
              key={type}
              type={type}
              Icon={Icon}
              label={label}
              isSelected={selectedCard === type}
              onClick={handleCardClick}
            />
          ))}
        </div>
        {form.type !== "listes" && (
          <div className="flex gap-4 mb-8">
            <SelectionToggle
              icon={Users}
              label="Par Group"
              isSelected={isParGroupSelected}
              onClick={() => setIsParGroupSelected(true)}
            />
            <SelectionToggle
              icon={User}
              label="Par Stagiaire"
              isSelected={!isParGroupSelected}
              onClick={() => setIsParGroupSelected(false)}
            />
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          {renderForm()}
        </form>
      </div>
      <PrintWrapper ref={printRef} onPrint={onPrint} className="w-full h-full">
        <div id="convocation" className="w-full h-full flex items-center justify-center">
          {renderDocument}
        </div>
      </PrintWrapper>
    </div>
  );
};

export default Docs;