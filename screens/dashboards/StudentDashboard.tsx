
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Calendar, FileText, BookOpen, DollarSign, Percent, BarChart } from 'lucide-react';
import { COURSES_DATA, TIMETABLE_DATA } from '../../constants';

const InfoCard: React.FC<{ title: string; value: string; icon: React.ElementType }> = ({ title, value, icon: Icon }) => (
    <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center text-center">
        <Icon className="w-12 h-12 text-brand-primary mb-4"/>
        <p className="text-lg font-semibold text-gray-800">{value}</p>
        <p className="text-sm text-gray-500">{title}</p>
    </div>
);

export const StudentDashboard: React.FC = () => {
    const { user } = useAuth();
    const { students, fees, timetable } = useData();
    // In a real app, we'd find the student record matching the logged-in user.
    // Here we find the student record that matches the logged in demo user's email.
    const studentData = students.find(s => s.email === user?.email) || students[4]; 
    if(!studentData) return <div>No student data available.</div>;

    const courseDetails = COURSES_DATA.find(c => c.name === studentData.course);
    
    const studentFee = fees.find(f => f.studentId === studentData.id);
    const feesDueValue = studentFee?.status === 'Pending' ? `₹ ${studentFee.amount.toLocaleString()}` : 'Paid';
    
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }) as 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
    const todaysTimetable = timetable.filter(t => t.day === today && t.courseId === courseDetails?.id && t.year === studentData.year);


    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-2xl font-bold text-gray-800">Welcome, {user?.name}!</h2>
                <p className="text-gray-600">{studentData.course} - Year {studentData.year}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <InfoCard title="Attendance" value={`${studentData.attendance}%`} icon={Percent}/>
                <InfoCard title="Fees Due" value={feesDueValue} icon={DollarSign}/>
                <InfoCard title="Overall Grade" value="A" icon={BarChart}/>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <Calendar className="mr-2 text-brand-secondary"/> Today's Timetable ({today})
                    </h3>
                    {todaysTimetable.length > 0 ? (
                        <ul className="space-y-2">
                            {todaysTimetable.map(entry => (
                                <li key={entry.id} className="flex justify-between items-center p-2 rounded-md bg-gray-50">
                                    <div>
                                        <p className="font-medium">{entry.subject}</p>
                                        <p className="text-sm text-gray-500">{entry.faculty}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-mono text-sm">{entry.time}</p>
                                        <p className="text-xs text-gray-500">Room: {entry.room}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                         <p className="text-center text-gray-500 py-4">No classes scheduled for today.</p>
                    )}
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <BookOpen className="mr-2 text-brand-secondary"/> Your Subjects
                    </h3>
                     <div className="flex flex-wrap gap-2">
                        {courseDetails?.subjects.map(subject => (
                            <span key={subject} className="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full">{subject}</span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
