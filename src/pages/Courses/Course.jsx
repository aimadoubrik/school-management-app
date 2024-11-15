import { Printer, Youtube } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Course = () => {
    const { courseId } = useParams(); // Get course ID from the URL
    const [course, setCourse] = useState(null);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await fetch(`http://localhost:5001/courses/${courseId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch course');
                }
                const courseData = await response.json();
                setCourse(courseData);
            } catch (error) {
                console.error('Error fetching course:', error);
            }
        };

        fetchCourse();
    }, [courseId]);

    if (!course) {
        return <div className="p-8">Loading...</div>;
    }

    return (
        <div className="p-8">
            <h1 className="text-3xl text-center font-bold text-[#96C9F4] mb-6">{course.name}</h1>
            <div>
                <div className="relative">
                    <img
                        src={course.imageurl}
                        alt={course.name}
                        className="w-full h-64 object-cover rounded-lg"
                    />
                    <div className="absolute bottom-0 left-0 p-4">
                        <p className="text-gray-700 bg-slate-200 p-2 rounded">{course.instructor}</p>
                    </div>
                    <div className="absolute bottom-0 right-0 p-4">
                        <p className="text-gray-700 bg-slate-200 p-2 rounded">{course.module}</p>
                    </div>
                </div>

                <div className="flex justify-end my-4 ">
                    {course.videoUrl && (
                        <a
                            href={course.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-red px-4 py-2 rounded-lg mr-2"
                        >
                            <Youtube className="w-6 h-6 inline-block" />
                        </a>
                    )}
                    {course.pdfUrl && (
                        <a
                            href={course.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary px-4 py-2 rounded-lg"
                        >
                            <Printer className="w-6 h-6 inline-block" />
                        </a>
                    )}
                </div>
            </div>
            <hr />
            {course.content && course.content.length > 0 && (
                <div className="mt-8">
                    <h2 className="text-2xl font-semibold mb-4">Content</h2>
                    {course.content.map((section, index) => (
                        <div key={index} className="mb-6">
                            <h3 className="text-xl font-medium text-[#96C9F4]">
                                {Object.keys(section)[0]}
                            </h3>
                            <p className="text-gray-700 mt-2">{section.description}</p>
                            {section.imageurl && (
                                <img
                                    src={section.imageurl}
                                    alt={Object.keys(section)[0]}
                                    className="w-full h-48 object-cover rounded-lg mt-2"
                                />
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Course;
