import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchQuizzes } from "../../features/quizzes/quizzesSlice"; // Import the fetchQuizzes action
import { Youtube, BookOpen, CheckCircle, FileText, Clock, Award, ChevronRight, Play } from "lucide-react";

const Course = () => {
  const { id: courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get quizzes from Redux store
  const quizzes = useSelector((state) => state.quizzes.quizzes);

  // Fetch the course data only when courseId is available
  useEffect(() => {
    if (!courseId) return; // Ensure courseId is available

    const fetchCourse = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/courses/${courseId}`);
        if (response.data) {
          setCourse(response.data);
        } else {
          setError("Course not found");
        }
      } catch (err) {
        console.error("Error fetching course:", err);
        setError("Course not found or network error");
      }
    };

    fetchCourse();

    // Fetch quizzes only when course is loaded or courseId changes
    dispatch(fetchQuizzes());
  }, [courseId, dispatch]); // Added dispatch to dependencies

  const handleEndCourse = async () => {
    try {
      const response = await axios.patch(`http://localhost:3000/courses/${courseId}`, {
        status: "completed",
      });
      if (response.status === 200) {
        setCourse({ ...course, status: "completed" });
      }
    } catch (err) {
      console.error("Error marking course as completed:", err);
    }
  };

  const handleStartQuiz = () => {
    console.log("Quizzes from Redux:", quizzes);  // Check if quizzes are loaded
    const quiz = quizzes.find((q) => q.quizID === course.coursequizID);

    if (quiz) {
      navigate(`/quizzes/${quiz.quizID}`);
    } else {
      console.error("Quiz not found for this course");
    }
  };

  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!course) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{course.courseName}</h1>
          <div className="flex items-center space-x-4 text-gray-600">
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Status: {course.status === "completed" ? "Completed" : "In Progress"}
            </span>
            {course.pdfUrl && (
              <button
                onClick={() => alert("Downloading course materials...")}
                className="flex items-center text-blue-600 hover:text-blue-700"
              >
                <FileText className="w-4 h-4 mr-2" />
                Course Materials
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Course Preview */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative aspect-video rounded-t-lg overflow-hidden">
                <img
                  src={course.imageUrl}
                  alt={course.courseName}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => alert("Opening video player...")}
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity group"
                >
                  <div className="transform transition-transform group-hover:scale-110">
                    <Play className="w-16 h-16 text-white" />
                  </div>
                </button>
              </div>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Course Description</h2>
                <p className="text-gray-600 leading-relaxed">{course.courseDescription}</p>
              </div>
            </div>

            {/* Course Content */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="border-b border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900">Course Content</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {course.contentOfCourse.map((content, index) => (
                    <div
                      key={content.contentId}
                      className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center">
                        <span className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full mr-4">
                          {index + 1}
                        </span>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {content.contentName}
                          </h3>
                          <p className="text-gray-600 mt-1">
                            {content.contentDescription}
                          </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                {course.status === "completed" ? (
                  <div className="space-y-6">
                    <div className="flex flex-col items-center p-6 bg-green-50 rounded-lg">
                      <Award className="w-12 h-12 text-green-600 mb-2" />
                      <h3 className="text-xl font-semibold text-green-600">
                        Course Completed!
                      </h3>
                    </div>
                    <button
                      onClick={handleStartQuiz}
                      className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors duration-200 flex items-center justify-center space-x-2"
                    >
                      <span>Start Quiz</span>
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="p-6 bg-blue-50 rounded-lg">
                      <h3 className="text-xl font-semibold text-blue-600 mb-2">
                        Course Progress
                      </h3>
                      <div className="flex items-center">
                        <BookOpen className="w-5 h-5 text-blue-600 mr-2" />
                        <span className="text-gray-600">In Progress</span>
                      </div>
                    </div>
                    <button
                      onClick={handleEndCourse}
                      className="w-full py-4 px-6 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors duration-200 flex items-center justify-center space-x-2"
                    >
                      <span>End Course</span>
                      <CheckCircle className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Course;
