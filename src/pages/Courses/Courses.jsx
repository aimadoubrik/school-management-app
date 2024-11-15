import { useState, useEffect } from 'react';
import { Book, Clock, PlayCircle, FileText, CheckCircle, User, Eye } from 'lucide-react'; // Changed FileAlt to FileText
import { Document, Page } from 'react-pdf';
import { Youtube } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// App component to fetch data from API
const Courses = () => {
  // State variables to store fetched data
  const [courses, setCourses] = useState([]);

  // Fetch courses data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const coursesRes = await fetch('http://localhost:5001/courses');
        const coursesData = await coursesRes.json();
        setCourses(coursesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const navigate = useNavigate();
  const handleCompleteCourse = (course) => {
    const courseId = course.id;
    if (courseId) {
      navigate(`/courses/${courseId}`);
    } else {
      alert("Course not found");
    }
  };

  return (
    <div className="flex h-screen">
      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto rounded-l-3xl">
        {/* Courses Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-semibold text-[#96C9F4] mb-6">Your Courses</h2>
          <div className="flex justify-between space-x-4 mb-4">
            <div className="flex-1">
              <label className="font-medium">Filter by Model</label>
              <select
                onChange={(e) => {
                  const selectedModel = e.target.value;
                  setCourses((prevCourses) =>
                    prevCourses.filter(
                      (course) => selectedModel === "" || course.model === selectedModel
                    )
                  );
                }}
                className="w-full mt-3 border border-gray-300 bg-transparent border border-gray-700 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {courses
                  .map((course) => course.model)
                  .filter((model, index, self) => self.indexOf(model) === index)
                  .map((model) => (
                    <option key={model} value={model}>
                      {model.charAt(0).toUpperCase() + model.slice(1)}
                    </option>
                  ))}
              </select>
            </div>
            <div className="flex-shrink-0 w-1/4">
              <label className="font-medium">Filter by Module</label>
              <select
                onChange={(e) => {
                  const selectedModule = e.target.value;
                  setCourses((prevCourses) =>
                    prevCourses.filter(
                      (course) =>
                        selectedModule === "" || course.module === selectedModule
                    )
                  );
                }}
                className="w-full border border-gray-300 bg-transparent mt-3 border border-gray-700 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Modules</option>
                {courses
                  .map(course => course.module)
                  .filter((value, index, self) => self.indexOf(value) === index)
                  .map(module => (
                    <option key={module} value={module}>{module}</option>
                  ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {courses.length ? (
              courses.map((course) => (
                <div
                  key={course.id}
                  onClick={() => handleCompleteCourse(course)}
                  className={`flex flex-row gap-4 border border-gray-700 rounded-lg p-6 transition-all duration-300 ease-in-out transform hover:scale-105`}
                >
                  <div className="relative">
                    <img
                      src={course.imageurl}
                      alt={course.name}
                      className="w-25 h-48 object-cover rounded-lg"
                    />
                    {course.videoUrl && (
                      <a
                        href={course.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute top-1 right-1 bg-gray-800 text-white p-2 rounded-full"
                      >
                        <Youtube className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-semibold">{course.name}</h3>
                    </div>
                    <p className="text-gray-400 text-sm mt-2">Instructor: {course.instructor}</p>
                    <div className="relative mt-4">
                      <div className="flex flex-row items-center">
                        <div
                          className="rounded-full bg-green-500 h-1 rounded-full"
                          style={{ width: `${course.progress}%` }}
                        >
                          {' '}
                        </div>
                        <span className="text-gray-400 text-sm ml-5">{course.progress}%</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <span className="text-sm font-medium">
                        {course.status === 'completed' ? (
                          <div>
                            <button
                              className="bg-green-500 px-4 py-2 rounded-lg text-white cursor-not-allowed"
                              disabled
                            >
                              Completed
                            </button>
                            <button className="bg-transparent border border-green-500 px-4 py-2 rounded-lg text ml-2">
                              Start Quiz
                            </button>
                          </div>
                        ) : (
                          <button
                            className="bg-blue-500 px-4 py-2 rounded-lg text-white"
                            onClick={() => handleCompleteCourse(course)}
                          >
                            Complete Course
                          </button>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No courses available at the moment.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Courses;


