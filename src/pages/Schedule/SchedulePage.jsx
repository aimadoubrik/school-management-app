import { useState, useEffect } from "react";
import { Calendar, Clock, School, AlertCircle, Loader2 } from "lucide-react";

const levels = ["1ere annee", "2eme annee"];
const classes = ["DEV", "ID"];
const timeSlots = [
  "8:30 AM - 11:00 AM",
  "11:00 AM - 1:15 PM",
  "1:30 PM - 4:00 PM",
  "4:00 PM - 6:30 PM",
];

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const SchedulePage = () => {
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [schedule, setSchedule] = useState({
    Monday: Array(timeSlots.length).fill("empty"),
    Tuesday: Array(timeSlots.length).fill("empty"),
    Wednesday: Array(timeSlots.length).fill("empty"),
    Thursday: Array(timeSlots.length).fill("empty"),
    Friday: Array(timeSlots.length).fill("empty"),
    Saturday: Array(timeSlots.length).fill("empty"),
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Get current day and time slot
  const getCurrentTimeSlot = () => {
    const currentDay = currentTime.toLocaleDateString('en-US', { weekday: 'long' });
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;

    const timeSlotIndex = timeSlots.findIndex(slot => {
      const [start] = slot.split(' - ');
      const [startHour, startMinute] = start.split(':');
      const hour = parseInt(startHour);
      const minute = parseInt(startMinute);
      const slotTimeInMinutes = hour * 60 + minute;
      return currentTimeInMinutes < slotTimeInMinutes;
    }) - 1;

    return { currentDay, timeSlotIndex };
  };

  // Fetch schedule data when selections change
  useEffect(() => {
    const fetchSchedule = async () => {
      if (selectedLevel && selectedClass) {
        setIsLoading(true);
        setError("");
        try {
          const response = await fetch("http://localhost:3005/emploi");
          const data = await response.json();
          if (data && data[selectedClass] && data[selectedClass][selectedLevel]) {
            setSchedule(data[selectedClass][selectedLevel]);
          }
        } catch (error) {
          setError("Failed to fetch schedule. Please try again later.");
          console.error("Error fetching schedule:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchSchedule();
  }, [selectedLevel, selectedClass]);

  const { currentDay, timeSlotIndex } = getCurrentTimeSlot();

  const SelectionBox = ({ title, icon: Icon, value, options, onChange }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <div className="mb-3">
        <h3 className="text-lg font-medium flex items-center gap-2 text-gray-800 dark:text-gray-200">
          <Icon className="w-5 h-5" />
          {title}
        </h3>
      </div>
      <select
        value={value}
        onChange={onChange}
        className="w-full p-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 
                 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      >
        <option value="">Select {title}</option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="p-4 md:p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
            Class Schedule
          </h1>
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Clock className="w-4 h-4" />
            {currentTime.toLocaleTimeString()}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SelectionBox
            title="Level"
            icon={School}
            value={selectedLevel}
            options={levels}
            onChange={(e) => setSelectedLevel(e.target.value)}
          />
          <SelectionBox
            title="Class"
            icon={Calendar}
            value={selectedClass}
            options={classes}
            onChange={(e) => setSelectedClass(e.target.value)}
          />
        </div>

        {error && (
          <div className="flex items-center gap-2 p-4 text-red-800 bg-red-100 dark:bg-red-900/30 dark:text-red-200 rounded-lg">
            <AlertCircle className="h-5 w-5" />
            <p>{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : (
          selectedLevel &&
          selectedClass && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <div className="p-4 border-b dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                  Schedule for {selectedClass} - {selectedLevel}
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-700">
                      <th className="border border-gray-200 dark:border-gray-600 p-3 text-left min-w-[100px]">
                        Day / Time
                      </th>
                      {timeSlots.map((slot) => (
                        <th
                          key={slot}
                          className="border border-gray-200 dark:border-gray-600 p-3 text-left min-w-[150px] text-sm"
                        >
                          {slot}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {days.map((day) => (
                      <tr
                        key={day}
                        className={`
                          ${day === currentDay ? "bg-blue-50 dark:bg-blue-900/20" : ""}
                          hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors
                        `}
                      >
                        <td className="border border-gray-200 dark:border-gray-600 p-3 font-medium">
                          {day}
                        </td>
                        {schedule[day].map((slot, index) => (
                          <td
                            key={`${day}-${index}`}
                            className={`
                              border border-gray-200 dark:border-gray-600 p-3
                              ${slot === "empty" ? "bg-gray-50 dark:bg-gray-700/50" : ""}
                              ${
                                day === currentDay && index === timeSlotIndex
                                  ? "ring-2 ring-blue-500"
                                  : ""
                              }
                            `}
                          >
                            {slot !== "empty" ? (
                              <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded text-sm">
                                {slot}
                              </div>
                            ) : (
                              <span className="text-gray-400 dark:text-gray-500">
                                No Class
                              </span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default SchedulePage;