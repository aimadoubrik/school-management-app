import React, { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';

// URL for json-server
const API_URL = 'http://localhost:3006/assignments';

const SchedulePage = () => {
  const [assignments, setAssignments] = useState([]);
  const [selectedGroupe, setSelectedGroupe] = useState('');
  const [startOfWeek, setStartOfWeek] = useState(
    dayjs().startOf('week').add(1, 'day').format('YYYY-MM-DD')
  );
  const [selectedSecteur, setSelectedSecteur] = useState('');
  const [secteur , setSecteur] = useState([])
  const [hours, setHours] = useState(
    Array.from({ length: 10 }, (_, i) => {
      const startTime = dayjs()
        .hour(8 + i)
        .minute(30);
      return {
        startTime: startTime.format('HH:mm'),
        endTime: startTime.add(1, 'hour').format('HH:mm'),
        subHours: [
          {
            startTime: startTime.format('HH:mm'),
            endTime: startTime.add(30, 'minute').format('HH:mm'),
          },
          {
            startTime: startTime.add(30, 'minute').format('HH:mm'),
            endTime: startTime.add(1, 'hour').format('HH:mm'),
          },
        ],
      };
    })
  );

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await axios.get(API_URL);
        setAssignments(response.data);
        const resp = await axios.get('http://localhost:3007/filieres')
        console.log(resp.data)
        setSecteur([...new Set(resp.data.map(el => el.secteur))]);
       
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchAssignments();
  }, []);


  const handleSecteurChange = (e) => {
    setSelectedSecteur(e.target.value);
    setSelectedGroupe('')
  }

  const filteredAssignments = selectedGroupe
    ? assignments.filter((assignment) => assignment.groupe === selectedGroupe)
    : assignments;

  const daysOfWeek = Array.from({ length: 6 }, (_, i) => dayjs(startOfWeek).add(i, 'day')); // Exclude Sunday

  const getSpanCount = (startTime, endTime) => {
    const flatSubHours = hours.flatMap((hour) => hour.subHours);
    const startIndex = flatSubHours.findIndex((subHour) => subHour.startTime === startTime);
    const endIndex = flatSubHours.findIndex((subHour) => subHour.endTime === endTime);

    if (startIndex === -1 || endIndex === -1) {
      return 1;
    }

    return endIndex - startIndex + 1;
  };

  const isWithinAssignmentRange = (assignment, subHour, day) => {
    return (
      assignment.day === day.format('YYYY-MM-DD') &&
      subHour.startTime >= assignment.startTime &&
      subHour.endTime <= assignment.endTime
    );
  };

  return (
    <div className="overflow-x-auto p-4">
      <div className="flex w-full gap-5">
        <div className="mb-4 flex flex-col w-full">
          <label htmlFor="group-select" className="mr-2 font-semibold">
            Select Group:
          </label>
          <select
            id="secteur-select"
            value={selectedGroupe}
            onChange={(e) => handleSecteurChange(e.target.value)}
            className="border px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 select select-primary w-full"
          >
            <option value="">All Groups</option>
            {secteur.map(
              (group, index) => (
                <option key={index} value={group}>
                  {group}
                </option>
              )
            )}
          </select>
        </div>
        <div className="mb-4 flex flex-col w-full">
          <label htmlFor="group-select" className="mr-2 font-semibold">
            Select Group:
          </label>
          <select
            id="group-select"
            value={selectedGroupe}
            onChange={(e) => setSelectedGroupe(e.target.value)}
            className="border px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 select select-primary w-full"
          >
            <option value="">All Groups</option>
            {[...new Set(assignments.map((assignment) => assignment.groupe))].map(
              (group, index) => (
                <option key={index} value={group}>
                  {group}
                </option>
              )
            )}
          </select>
        </div>
      </div>

      <div className="inline-block min-w-full overflow-hidden rounded-lg border border-base-200 shadow-md">
        <table className="min-w-full border-collapse text-center text-sm size-max">
          <thead>
            <tr>
              <th className="px-4 py-2 border bg-base-200">Day</th>
              {hours.map((hour, index) => (
                <th key={index} colSpan={2} className="px-4 py-2 border bg-base-200">
                  {hour.startTime} - {hour.endTime}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {daysOfWeek.map((day, dayIndex) => (
              <tr key={dayIndex}>
                <td className="px-4 py-2 border font-semibold bg-base-200">{day.format('dddd')}</td>
                {hours.map((hour) =>
                  hour.subHours.map((subHour, subHourIndex) => {
                    const assignment = filteredAssignments.find((assignment) =>
                      isWithinAssignmentRange(assignment, subHour, day)
                    );

                    if (assignment && subHour.startTime === assignment.startTime) {
                      const spanCount = getSpanCount(assignment.startTime, assignment.endTime);
                      return (
                        <td
                          key={`${subHour.startTime}-${subHour.endTime}`}
                          colSpan={spanCount}
                          className="border  p-2 cursor-pointer bg-blue-100 text-blue-900"
                        >
                          <div className="flex flex-col">

                          <span className='font-bold text-md'>{assignment.title}</span>
                          <span>{assignment.formateur} -- {assignment.salle}  {selectedGroupe === '' && <span>-- { assignment.groupe}</span>}</span>
                          </div>
                        </td>
                      );
                    }

                    const isCellCovered = filteredAssignments.some((assignment) => {
                      const flatSubHours = hours.flatMap((hour) => hour.subHours);
                      const startIndex = flatSubHours.findIndex(
                        (subHour) => subHour.startTime === assignment.startTime
                      );
                      const endIndex = flatSubHours.findIndex(
                        (subHour) => subHour.endTime === assignment.endTime
                      );
                      const currentIndex = flatSubHours.findIndex(
                        (s) => s.startTime === subHour.startTime
                      );

                      return (
                        assignment.day === day.format('YYYY-MM-DD') &&
                        currentIndex > startIndex &&
                        currentIndex <= endIndex
                      );
                    });

                    if (isCellCovered) {
                      return null;
                    }

                    return (
                      <td
                        key={`${subHour.startTime}-${subHour.endTime}`}
                        className="border p-2"
                      ></td>
                    );
                  })
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const App = () => <SchedulePage />;

export default App;
