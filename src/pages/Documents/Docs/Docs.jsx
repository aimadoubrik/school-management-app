import React, { useRef, useState, useEffect } from 'react';
import Convocation from './TemplatesDoc/Convocation';
import Diplome from './TemplatesDoc/Diplome';
import DocumentCard from './DocumentCard';
import FormInput from './FormInput';
import SelectionToggle from './SelectionToggle';
import PrintWrapper from './PrintWrapper';
import Listes from './TemplatesDoc/Listes';
import ReactDOM from 'react-dom'; // Add this import at the top of your file
import { FileText, GraduationCap, ClipboardList, User, Users } from 'lucide-react';

const Docs = () => {
  const [form, setForm] = useState({
    name: '',
    group: '',
    date: '',
    type: 'convocation',
  });

  const [selectedCard, setSelectedCard] = useState('convocation');
  const [isParGroupSelected, setIsParGroupSelected] = useState(false);
  const [groupes, setGroupes] = useState([]);
  const [students, setStudents] = useState([]); // Store students' data here
  const printRef = useRef(null);

  // Fetch the groups and students when the component mounts
  useEffect(() => {
    const fetchGroupesAndStudents = async () => {
      try {
        const response = await fetch('http://localhost:3000/groups'); // Update with your actual API URL
        const data = await response.json();
        setGroupes(data);

        // Extract students' names from the fetched groups
        const allStudents = data.flatMap(group => group.liste);
        setStudents(allStudents);
      } catch (error) {
        console.error(error);
      }
    };

    fetchGroupesAndStudents();
  }, []);

  const onPrint = async () => {
    const originalMargin = document.body.style.margin;
    const originalWidth = document.body.style.width;
    const originalDisplay = document.querySelector('nav').style.display;

    document.body.style.margin = "0";
    document.body.style.width = "100%";
    printRef.current.style.position = "fixed";
    printRef.current.style.left = "0";
    printRef.current.style.top = "0";
    printRef.current.style.width = "100%";
    document.querySelector('nav').style.display = "none";

    if (isParGroupSelected && form.group) {
      const selectedGroup = groupes.find(
        (groupe) => groupe.niveau === form.group
      );
      if (!selectedGroup) return;

      const documents = selectedGroup.liste.map((student) => {
        const container = document.createElement('div');
        container.style.pageBreakAfter = 'always';
        ReactDOM.render(
          form.type === "convocation" ? (
            <Convocation
              key={student.idEtudiant}
              name={student.nomEtudiant}
              group={form.group}
              date={form.date}
            />
          ) : form.type === "diplome" ? (
            <Diplome
              key={student.idEtudiant}
            />
          ) : (
            <Listes
              key={student.idEtudiant}
            />
          ),
          container
        );
        return container;
      });

      const printContainer = document.createElement('div');
      printContainer.style.position = 'absolute';
      printContainer.style.top = '0';
      printContainer.style.left = '0';
      printContainer.style.width = '100%';
      document.body.appendChild(printContainer);

      documents.forEach((document) => {
        printContainer.appendChild(document);
      });

      window.print();
      document.body.removeChild(printContainer);
    } else {
      window.print();
    }
    
    document.body.style.margin = originalMargin;
    document.body.style.width = originalWidth;
    printRef.current.style.position = "";
    printRef.current.style.left = "";
    printRef.current.style.top = "";
    printRef.current.style.width = "";
    document.querySelector('nav').style.display = originalDisplay;
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
    setForm((prevForm) => ({ ...prevForm, type }));
  };

  const documentTypes = [
    { type: 'convocation', icon: FileText, label: 'Convocation' },
    { type: 'diplome', icon: GraduationCap, label: 'Diplome' },
    { type: 'listes', icon: ClipboardList, label: 'Listes' }
  ];

  const renderDocument = () => {
    switch (form.type) {
      case 'convocation':
        return <Convocation {...form} />;
      case 'diplome':
        return <Diplome {...form} />;
      case 'listes':
        return <Listes {...form} />;
      default:
        return null;
    }
  };

  const renderForm = () => {
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
          label="Group & Filiere"
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
      </div>
    );
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/2 border-r border-gray-200 p-8 overflow-y-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Documents
          </h1>
          <p className="">
            Cette page vous permet de générer des documents.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {documentTypes.map(({ type, icon, label }) => (
            <DocumentCard
              key={type}
              type={type}
              Icon={icon}
              label={label}
              isSelected={selectedCard === type}
              onClick={handleCardClick}
            />
          ))}
        </div>

        {form.type !== 'listes' && (
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

      <PrintWrapper
        ref={printRef}
        onPrint={onPrint}
        className=" w-full h-full"
      >
        <div id="convocation" className="w-full h-full flex items-center justify-center">
          {renderDocument()}
        </div>
      </PrintWrapper>

    </div>
  );
};

export default Docs;
