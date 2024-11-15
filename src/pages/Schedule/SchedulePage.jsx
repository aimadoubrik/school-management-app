import { useState, useEffect } from "react";

const levels = ["1ere annee", "2eme annee"];
const classes = ["DEV", "ID"];
const timeSlots = [
  "8:30 AM - 11:00 AM", "11:00 AM - 1:15 PM",
  "1:30 PM - 4:00 PM", "4:00 PM - 6:30 PM",
];

const SchedulePage = () => {
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [schedule, setSchedule] = useState({
    Monday: Array(timeSlots.length).fill("empty"),
    Tuesday: Array(timeSlots.length).fill("empty"),
    Wednesday: Array(timeSlots.length).fill("empty"),
    Thursday: Array(timeSlots.length).fill("empty"),
    Friday: Array(timeSlots.length).fill("empty"),
    Saturday: Array(timeSlots.length).fill("empty")
  });

  // Fetch schedule data when selections change
  useEffect(() => {
    const fetchSchedule = async () => {
      if (selectedLevel && selectedClass) {
        try {
          const response = await fetch('http://localhost:3005/emploi');
          const data = await response.json();
          console.log(data)
          if (data && data[selectedClass] && data[selectedClass][selectedLevel]) {
            setSchedule(data[selectedClass][selectedLevel]);
          }
        } catch (error) {
          console.error('Error fetching schedule:', error);
        }
      }
    };

    fetchSchedule();
  }, [selectedLevel, selectedClass]);

  if (!schedule) {
    return <div>Select a class</div>;
  }

  // Rest of your component remains the same
  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-800 min-h-screen rounded-lg">
      <div className="flex flex-col md:flex-row justify-between mb-6">
        <div className="w-full md:w-1/2 md:pr-4 mb-4 md:mb-0">
          <label htmlFor="level" className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Select Level
          </label>
          <select
            id="level"
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Level</option>
            {levels.map((level, index) => (
              <option key={index} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>

        <div className="w-full md:w-1/2 md:pl-4">
          <label htmlFor="class" className="block text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Select Class
          </label>
          <select
            id="class"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Class</option>
            {classes.map((classOption, index) => (
              <option key={index} value={classOption}>
                {classOption}
              </option>
            ))}
          </select>
        </div>
      </div>
      {selectedLevel && selectedClass && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 mt-6 size-max">
      <thead>
        <tr>
          <th className="border p-2">Day / Time</th>
          {timeSlots.map((slot) => (
            <th key={slot} className="border p-2">{slot}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {Object.keys(schedule).map((day) => (
          <tr key={day}>
            <td className="p-2 border">{day}</td>
            {schedule[day].map((slot, index) => (
              <td 
                key={`${day}-${index}`} 
                className={`p-2 border ${slot === 'empty' ? 'bg-base-200' : ''}`}
              >
                {slot !== 'empty' && slot}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
        </div>
      )}
    </div>
  );
};

export default SchedulePage;
