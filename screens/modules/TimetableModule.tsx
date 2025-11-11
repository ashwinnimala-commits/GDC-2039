import React, { useState, useMemo } from 'react';
import { useData } from '../../contexts/DataContext';
import { COURSES_DATA } from '../../constants';

const TimetableModule: React.FC = () => {
    const { timetable } = useData();
    const [selectedCourseId, setSelectedCourseId] = useState(COURSES_DATA[0].id);
    const [selectedYear, setSelectedYear] = useState(1);

    const filteredTimetable = useMemo(() => {
        return timetable.filter(entry => entry.courseId === selectedCourseId && entry.year === selectedYear);
    }, [timetable, selectedCourseId, selectedYear]);

    const daysOfWeek: ('Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday')[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const timeSlots = [...new Set(filteredTimetable.map(t => t.time))].sort();

    const timetableByDay = useMemo(() => {
        return daysOfWeek.map(day => ({
            day,
            entries: filteredTimetable
                .filter(entry => entry.day === day)
                .sort((a, b) => a.time.localeCompare(b.time))
        })).filter(group => group.entries.length > 0);
    }, [filteredTimetable]);

    return (
        <div className="space-y-6">
            <div className="bg-white p-4 rounded-xl shadow-md">
                <h2 className="text-xl font-bold text-gray-800 mb-4">View Timetable</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="course-select" className="block text-sm font-medium text-gray-700">Course</label>
                        <select 
                            id="course-select" 
                            value={selectedCourseId} 
                            onChange={e => setSelectedCourseId(e.target.value)}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        >
                            {COURSES_DATA.map(course => (
                                <option key={course.id} value={course.id}>{course.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="year-select" className="block text-sm font-medium text-gray-700">Year</label>
                        <select 
                            id="year-select" 
                            value={selectedYear} 
                            onChange={e => setSelectedYear(Number(e.target.value))}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        >
                            <option value={1}>1st Year</option>
                            <option value={2}>2nd Year</option>
                            <option value={3}>3rd Year</option>
                        </select>
                    </div>
                </div>
            </div>
            
            {filteredTimetable.length === 0 ? (
                 <div className="bg-white rounded-xl shadow-md p-6 text-center text-gray-500">
                    No timetable data available for the selected course and year.
                </div>
            ) : (
                <>
                    {/* Mobile View: Card-based list */}
                    <div className="md:hidden space-y-4">
                        {timetableByDay.map(({ day, entries }) => (
                            <div key={day}>
                                <h3 className="text-lg font-bold text-gray-700 mb-2 px-1">{day}</h3>
                                <div className="space-y-3">
                                    {entries.map(entry => (
                                        <div key={entry.id} className="bg-white p-4 rounded-lg shadow-sm border">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-bold text-gray-800">{entry.subject}</p>
                                                    <p className="text-sm text-gray-600">{entry.faculty}</p>
                                                </div>
                                                <div className="text-right flex-shrink-0 ml-2">
                                                    <p className="font-mono text-sm font-medium text-gray-700">{entry.time}</p>
                                                    <p className="text-xs font-semibold text-purple-700">Room: {entry.room}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Desktop View: Traditional Table */}
                    <div className="hidden md:block bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3">Time</th>
                                        {daysOfWeek.map(day => <th key={day} className="px-4 py-3">{day}</th>)}
                                    </tr>
                                </thead>
                                <tbody>
                                    {timeSlots.map(time => (
                                        <tr key={time} className="border-b">
                                            <td className="px-4 py-4 font-mono font-medium text-gray-700">{time}</td>
                                            {daysOfWeek.map(day => {
                                                const entry = filteredTimetable.find(e => e.day === day && e.time === time);
                                                return (
                                                    <td key={`${day}-${time}`} className="px-4 py-4">
                                                        {entry ? (
                                                            <div>
                                                                <p className="font-bold text-gray-800">{entry.subject}</p>
                                                                <p className="text-xs text-gray-600">{entry.faculty}</p>
                                                                <p className="text-xs font-semibold text-purple-700">Room: {entry.room}</p>
                                                            </div>
                                                        ) : (
                                                            <span className="text-gray-400">-</span>
                                                        )}
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default TimetableModule;
