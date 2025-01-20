import React from "react";
import { ChevronLast, ChevronFirst } from "lucide-react";
import { useContext, createContext, useState, useEffect, useRef } from "react";

const SidebarContext = createContext();

export default function SidebarCollapsible({ children }) {
  const [expanded, setExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const sidebarRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setExpanded(false);
        setActiveSection(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <aside
      ref={sidebarRef}
      className={`
        fixed right-2 top-[80px] z-50
        rounded-lg border
        h-[690px]
        ${expanded ? "w-72" : "w-14"}
        transition-all duration-300 ease-in-out
        bg-base-100 border-l border-gray-200
        flex flex-col
        shadow-lg
      `}
    >
      <nav className="h-full flex flex-col w-full">
        <div className="p-3 pb-2 flex justify-start items-center border-b border-gray-200 bg-base-100 z-20">
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {expanded ? <ChevronLast className="text-gray-600" /> : <ChevronFirst className="text-gray-600" />}
          </button>
        </div>
        <SidebarContext.Provider 
          value={{ 
            expanded, 
            reset: !expanded,
            activeSection,
            setActiveSection 
          }}
        >
          <ul className="flex-1 px-2 py-2 space-y-1 overflow-y-hidden">{children}</ul>
        </SidebarContext.Provider>
      </nav>
    </aside>
  );
}

export function SidebarItem({ icon, text, children, id }) {
  const { expanded, reset, activeSection, setActiveSection } = useContext(SidebarContext);
  
  const isOpen = activeSection === id;

  const handleToggle = () => {
    if (!reset) {
      setActiveSection(isOpen ? null : id);
    }
  };

  if (reset && isOpen) {
    setActiveSection(null);
  }

  return (
    <li className="relative">
      <div
        className={`
          flex items-center py-2 px-2.5
          font-medium rounded-md cursor-pointer
          transition-all duration-200
          bg-base-100 z-10
          ${isOpen 
            ? 'bg-white text-[#57a9ad] shadow-sm' 
            : 'text-gray-600 hover:bg-white/60'
          }
        `}
        onClick={handleToggle}
      >
        <div className="min-w-[24px]">
          {React.cloneElement(icon, {
            size: 20,
            className: `transition-colors ${isOpen ? 'text-[#57a9ad]' : 'text-gray-500'}`
          })}
        </div>
        <span
          className={`
            overflow-hidden transition-all duration-300
            ${expanded ? "w-52 ml-3 opacity-100" : "w-0 opacity-0"}
          `}
        >
          {text}
        </span>
      </div>
      {isOpen && expanded && (
        <div className="mt-2 px-2 py-1">
          {children}
        </div>
      )}
    </li>
  );
}