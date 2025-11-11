
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Calendar, Users, UploadCloud, CheckSquare } from 'lucide-react';
import { COURSES_DATA } from '../../constants';

const DashboardCard: React.FC<{ title: string; value: string; icon: React.ElementType, description: string }> = ({ title, value, icon: Icon, description }) => (
    <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex items-start justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
                <Icon className="text-brand-secondary" size={24}/>
            </div>
        </div>
        <p className="text-sm text-gray-500 mt-4">{description}</p>
    </div>
);

export const LecturerDashboard: React.FC = () => {
    const { user } = useAuth();
    const { timetable } = useData();

    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }) as 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';

    // In a real app, this would be filtered by `t.faculty === user?.name`.
    // For this demo, we just show all classes for the current day to ensure there's data.
    const todaysSchedule = timetable.filter(t => t.day === today);

    const classesTodayCount = todaysSchedule.length;
    const coursesToday = [...new Set(todaysSchedule.map(t => COURSES_DATA.find(c => c.id === t.courseId)?.degree))].filter(Boolean).join(', ');

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Welcome, {user?.name}!</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DashboardCard title="Today's Classes" value={String(classesTodayCount)} icon={Calendar} description={coursesToday || "No classes scheduled"} />
                <DashboardCard title="Total Students" value="120" icon={Users} description="Across all sections" />
                <DashboardCard title="Assignments" value="2" icon={CheckSquare} description="Pending for review" />
                <DashboardCard title="Materials Uploaded" value="5" icon={UploadCloud} description="Notes & PPTs" />
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Schedule for Today ({today})</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="p-3 text-sm font-semibold text-gray-600">Time</th>
                                <th className="p-3 text-sm font-semibold text-gray-600">Subject</th>
                                <th className="p-3 text-sm font-semibold text-gray-600">Class</th>
                                <th className="p-3 text-sm font-semibold text-gray-600">Room</th>
                                <th className="p-3 text-sm font-semibold text-gray-600">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {todaysSchedule.length > 0 ? (
                                todaysSchedule.map(entry => (
                                    <tr key={entry.id} className="border-b">
                                        <td className="p-3">{entry.time}</td>
                                        <td className="p-3 font-medium">{entry.subject}</td>
                                        <td className="p-3">{COURSES_DATA.find(c => c.id === entry.courseId)?.name} - Year {entry.year}</td>
                                        <td className="p-3">{entry.room}</td>
                                        <td className="p-3">
                                            <button className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full hover:bg-green-200">
                                                Mark Attendance
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="p-6 text-center text-gray-500">
                                        No classes scheduled for today.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
