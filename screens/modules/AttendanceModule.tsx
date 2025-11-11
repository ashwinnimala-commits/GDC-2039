import React, { useMemo, useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types';
import { COURSES_DATA } from '../../constants';
import { Save } from 'lucide-react';

type AttendanceChange = {
    studentId: string;
    status: 'Present' | 'Absent';
};

const AttendanceModule: React.FC = () => {
    const { attendance, students, updateAttendanceBatch } = useData();
    const { user } = useAuth();
    const [selectedCourse, setSelectedCourse] = useState(COURSES_DATA[0].name);
    const [selectedDate, setSelectedDate] = useState('2023-11-22');
    const [selectedSubject, setSelectedSubject] = useState(COURSES_DATA[0].subjects[0]);
    const [attendanceChanges, setAttendanceChanges] = useState<AttendanceChange[]>([]);
    
    const subjectsForCourse = useMemo(() => COURSES_DATA.find(c => c.name === selectedCourse)?.subjects.slice(0, 3) || [], [selectedCourse]);

    // Reset subject when course changes
    useEffect(() => {
        setSelectedSubject(subjectsForCourse[0]);
    }, [subjectsForCourse]);

    const isAdmin = user?.role === UserRole.Admin || user?.role === UserRole.Principal || user?.role === UserRole.HOD || user?.role === UserRole.Lecturer;

    const studentsInCourse = useMemo(() => {
        return students.filter(s => s.course === selectedCourse);
    }, [students, selectedCourse]);

    const currentAttendance = useMemo(() => {
        const attendanceMap = new Map<string, 'Present' | 'Absent'>();
        attendance
            .filter(a => a.date === selectedDate && a.subject === selectedSubject)
            .forEach(a => {
                attendanceMap.set(a.studentId, a.status);
            });
        
        // Apply pending changes on top
        attendanceChanges.forEach(change => {
            attendanceMap.set(change.studentId, change.status);
        });

        return attendanceMap;
    }, [attendance, selectedDate, selectedSubject, attendanceChanges]);

    const handleStatusChange = (studentId: string, status: 'Present' | 'Absent') => {
        setAttendanceChanges(prev => {
            const otherChanges = prev.filter(c => c.studentId !== studentId);
            return [...otherChanges, { studentId, status }];
        });
    };
    
    const handleSaveAttendance = () => {
        if (attendanceChanges.length === 0) {
            alert("No changes to save.");
            return;
        }
        const updates = attendanceChanges.map(change => ({
            ...change,
            date: selectedDate,
            subject: selectedSubject,
        }));
        updateAttendanceBatch(updates);
        setAttendanceChanges([]);
        alert("Attendance updated successfully!");
    };

    if (!isAdmin) {
         return (
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
                <h2 className="text-xl font-bold text-gray-800 mb-2">My Attendance Summary</h2>
                <p className="text-gray-600">This feature is under development. You will soon be able to see your detailed attendance report here.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="bg-white p-4 rounded-xl shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Course</label>
                        <select value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 border-gray-300 rounded-md">
                            {COURSES_DATA.map(course => <option key={course.id} value={course.name}>{course.name}</option>)}
                        </select>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Subject</label>
                        <select value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 border-gray-300 rounded-md">
                            {subjectsForCourse.map(subject => <option key={subject} value={subject}>{subject}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Date</label>
                        <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md"/>
                    </div>
                </div>
            </div>
             <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th className="px-6 py-3">Student Name</th>
                                <th className="px-6 py-3 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {studentsInCourse.map(student => {
                                const status = currentAttendance.get(student.id) || 'Absent';
                                return (
                                <tr key={student.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{student.name}</td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="inline-flex rounded-md shadow-sm" role="group">
                                            <button 
                                                type="button"
                                                onClick={() => handleStatusChange(student.id, 'Present')}
                                                className={`px-4 py-2 text-sm font-medium border rounded-l-lg ${status === 'Present' ? 'bg-green-500 text-white border-green-500' : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-100'}`}
                                            >
                                                Present
                                            </button>
                                            <button 
                                                type="button"
                                                onClick={() => handleStatusChange(student.id, 'Absent')}
                                                className={`px-4 py-2 text-sm font-medium border rounded-r-lg ${status === 'Absent' ? 'bg-red-500 text-white border-red-500' : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-100'}`}
                                            >
                                                Absent
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )})}
                        </tbody>
                    </table>
                </div>
            </div>
             <div className="flex justify-end">
                <button 
                    onClick={handleSaveAttendance} 
                    disabled={attendanceChanges.length === 0}
                    className="flex items-center px-6 py-2 bg-brand-primary text-white rounded-lg shadow-md hover:bg-brand-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Save size={18} className="mr-2"/> Save Changes ({attendanceChanges.length})
                </button>
            </div>
        </div>
    );
};

export default AttendanceModule;