import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SchedulePage = () => {
  const [assignments, setAssignments] = useState([]);
  const [secteurs, setSecteurs] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [selectedSecteur, setSelectedSecteur] = useState('all');
  const [secteurGroups , setSecteurGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const timeSlots = [
    '08:30 - 09:30', '09:30 - 10:30', '10:30 - 11:30', '11:30 - 12:30',
    '12:30 - 13:30', '13:30 - 14:30', '14:30 - 15:30', '15:30 - 16:30',
    '16:30 - 17:30', '17:30 - 18:30'
  ];

  useEffect(() => {
    const fetchAssignments = async () => {
      const response = await axios.get('http://localhost:3006/assignments');
      setAssignments(response.data);
      const secteursresponse = await axios.get('http://localhost:3007/filieres');
      setSecteurs(secteursresponse.data);
      setLoading(false);
    };
    fetchAssignments();
  }, []);
  
  
  const uniqueGroups = [...new Set(assignments.map(a => a.groupe))].sort();
  const filteredAssignments = selectedGroup === 'all'
    ? assignments
    : assignments.filter(a => a.groupe === selectedGroup);

  const getDayName = (dateStr) => {
    const date = new Date(dateStr);
    return days[date.getDay() - 1];
  };

  const getTimeSlotIndex = (time) => {
    return timeSlots.findIndex(slot => slot.startsWith(time));
  };
  useEffect(() => {
    const secteurgroupes = secteurs.find(secteur => secteur.id == selectedSecteur)?.groupes;
    setSecteurGroups(secteurgroupes);
    
  }, [selectedSecteur]) 

  const calculateColspan = (startTime, endTime) => {
    const startIndex = getTimeSlotIndex(startTime);
    const endTime2 = endTime.split(':');
    const endTimeFormatted = `${endTime2[0]}:${endTime2[1]}`;
    const endIndex = timeSlots.findIndex(slot => slot.startsWith(endTimeFormatted));
    return Math.max(1, endIndex - startIndex) || 1;
  };

  const getClassesForDay = (day) => {
    return filteredAssignments.filter(assignment => getDayName(assignment.day) === day);
  };

  if (loading) {
    return <div className="p-8 text-center">Loading schedule...</div>;
  }


  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <label htmlFor="secteur-filter" className="label">Filter by Secteur:</label>
        <select
          id="secteur-filter"
          value={selectedSecteur}
          onChange={(e) => setSelectedSecteur(e.target.value)}
          className="select select-primary w-full max-w-md"
        >
          <option value="all">All Secteur</option>
          {secteurs.map(secteur => (
            <option key={secteur.id} value={secteur.id}>{secteur.secteur}</option>
          ))}
        </select>
        <label htmlFor="group-filter" className="label">Filter by Group:</label>
        <select
          id="group-filter"
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
          className="select select-primary w-full max-w-md"
        >
          <option value="all">All Groups</option>
          {!secteurGroups ? (
            uniqueGroups.map(group => (
              <option key={group} value={group}>{group}</option>
            ))
          ) : secteurGroups.map(group => (
            <option key={group.id} value={group.nom}>{group.nom}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2 bg-base-300 dark:text-white">Day</th>
              {timeSlots.map(slot => (
                <th key={slot} className="border p-2 bg-base-300 dark:text-white min-w-[120px]">
                  {slot}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {days.map(day => (
              <tr key={day}>
                <td className="border p-2 font-medium bg-base-300 dark:text-white">{day}</td>
                {(() => {
                  const dayClasses = getClassesForDay(day);
                  let currentSlot = 0;
                  const cells = [];

                  while (currentSlot < timeSlots.length) {
                    const classForSlot = dayClasses.find(cls =>
                      getTimeSlotIndex(cls.startTime) === currentSlot
                    );

                    if (classForSlot) {
                      const colspan = calculateColspan(classForSlot.startTime, classForSlot.endTime);
                      cells.push(
                        <td
                          key={`${day}-${currentSlot}`}
                          colSpan={colspan}
                          className="border p-2 relative h-20"
                        >
                          <h2 className="text-2xl font-bold mb-4 text-center">Class Schedule</h2>
                          <div
                            className="bg-gradient-to-r from-blue-600 to-blue-700 text-center text-white p-2 rounded-lg shadow-lg absolute inset-1 overflow-hidden hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
                            title={`${classForSlot.title}\nInstructor: ${classForSlot.formateur}\nRoom: ${classForSlot.salle}\nTime: ${classForSlot.startTime} - ${classForSlot.endTime}`}
                          >
                            <div className="flex flex-col gap-2 justify-center h-full">
                              <div className="flex items-center justify-center gap-2">
                                <div className="font-bold tracking-wide truncate">{classForSlot.title}</div>
                                <span className="text-blue-200">|</span>
                                <div className="text-xs font-medium text-blue-100">{classForSlot.formateur}</div>
                              </div>
                              <div className="text-xs bg-base-300 text-secondary-content dark:text-white rounded-md py-1 px-2 mx-auto">
                                {classForSlot.salle}
                              </div>
                            </div>
                          </div>
                        </td>
                      );
                      currentSlot += colspan;
                    } else {
                      cells.push(
                        <td
                          key={`${day}-${currentSlot}`}
                          className="border p-2 h-16"
                        />
                      );
                      currentSlot += 1;
                    }
                  }
                  return cells;
                })()}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SchedulePage;
