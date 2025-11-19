
import React, { useMemo, useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole, StudentData } from '../../types';
import { COURSES_DATA } from '../../constants';
import { Save, Calendar as CalendarIcon, AlertTriangle, CheckCircle, XCircle, BarChart2, PieChart as PieIcon, Eye } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

type AttendanceChange = {
    studentId: string;
    status: 'Present' | 'Absent';
};

const StudentAttendanceView: React.FC = () => {
    const { user } = useAuth();
    const { attendance, students } = useData();
    const [viewingDemo, setViewingDemo] = useState(false);

    const student = useMemo(() => {
        if (viewingDemo) return students[0];
        return students.find(s => s.email === user?.email);
    }, [students, user, viewingDemo]);

    const myAttendance = useMemo(() => {
        if (!student) return [];
        return attendance.filter(a => a.studentId === student.id);
    }, [attendance, student]);

    const stats = useMemo(() => {
        const total = myAttendance.length;
        if (total === 0) return { total: 0, present: 0, absent: 0, percentage: 0 };
        const present = myAttendance.filter(a => a.status === 'Present').length;
        const absent = total - present;
        const percentage = Math.round((present / total) * 100);
        return { total, present, absent, percentage };
    }, [myAttendance]);

    const subjectWiseData = useMemo(() => {
        const subjects: Record<string, { total: number; present: number }> = {};
        myAttendance.forEach(a => {
            if (!subjects[a.subject]) subjects[a.subject] = { total: 0, present: 0 };
            subjects[a.subject].total++;
            if (a.status === 'Present') subjects[a.subject].present++;
        });

        return Object.keys(subjects).map(subject => ({
            name: subject,
            percentage: subjects[subject].total > 0 ? Math.round((subjects[subject].present / subjects[subject].total) * 100) : 0,
            attended: subjects[subject].present,
            total: subjects[subject].total
        }));
    }, [myAttendance]);

    const pieData = [
        { name: 'Present', value: stats.present },
        { name: 'Absent', value: stats.absent }
    ];
    const PIE_COLORS = ['#10B981', '#EF4444'];

    if (!student) {
        return (
             <div className="p-8 text-center bg-white rounded-xl shadow-md">
                <AlertTriangle size={48} className="mx-auto text-yellow-500 mb-4"/>
                <h3 className="text-lg font-bold text-gray-800">Student Record Not Linked</h3>
                <p className="text-gray-600 mt-2">We couldn't find a student record matching your email: <span className="font-medium">{user?.email}</span>.</p>
                <p className="text-gray-500 text-sm mt-2">This happens if you created a new account that isn't in the sample database.</p>
                <button 
                    onClick={() => setViewingDemo(true)}
                    className="mt-6 px-6 py-2 bg-brand-primary text-white rounded-lg shadow hover:bg-brand-secondary transition-colors flex items-center mx-auto"
                >
                    <Eye size={18} className="mr-2"/> View Sample Attendance Data
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {viewingDemo && (
                <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg text-sm text-yellow-800 flex items-center">
                    <Eye size={16} className="mr-2"/> You are viewing sample attendance data for <strong>{student.name}</strong>.
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center justify-center">
                    <h3 className="text-gray-500 font-medium mb-2">Overall Attendance</h3>
                    <div className={`text-4xl font-bold ${stats.percentage >= 75 ? 'text-green-600' : stats.percentage >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {stats.percentage}%
                    </div>
                    <p className="text-sm text-gray-400 mt-2">Target: 75%</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center justify-center">
                    <h3 className="text-gray-500 font-medium mb-2">Total Classes</h3>
                    <div className="text-4xl font-bold text-blue-600">{stats.total}</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center justify-center">
                    <h3 className="text-gray-500 font-medium mb-2">Classes Attended</h3>
                    <div className="text-4xl font-bold text-green-600">{stats.present}</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center justify-center">
                    <h3 className="text-gray-500 font-medium mb-2">Classes Missed</h3>
                    <div className="text-4xl font-bold text-red-600">{stats.absent}</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-lg font-semibold mb-4 flex items-center"><BarChart2 className="mr-2 text-brand-secondary"/> Subject-wise Performance</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={subjectWiseData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                            <XAxis type="number" domain={[0, 100]} />
                            <YAxis dataKey="name" type="category" width={100} />
                            <Tooltip formatter={(value) => `${value}%`} />
                            <Legend />
                            <Bar dataKey="percentage" fill="#6366f1" name="Attendance %" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-lg font-semibold mb-4 flex items-center"><PieIcon className="mr-2 text-brand-secondary"/> Attendance Distribution</h3>
                    <div className="flex justify-center">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-lg font-semibold mb-4 flex items-center"><CalendarIcon className="mr-2 text-brand-secondary"/> Recent Activity</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Subject</th>
                                <th className="px-6 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {myAttendance.slice(-10).reverse().map((record) => (
                                <tr key={record.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{record.date}</td>
                                    <td className="px-6 py-4">{record.subject}</td>
                                    <td className="px-6 py-4">
                                        <span className={`flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${record.status === 'Present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {record.status === 'Present' ? <CheckCircle size={14} className="mr-1"/> : <XCircle size={14} className="mr-1"/>}
                                            {record.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const FacultyReportView: React.FC = () => {
    const { students, attendance } = useData();
    const [selectedCourse, setSelectedCourse] = useState(COURSES_DATA[0].name);
    const [selectedYear, setSelectedYear] = useState(1);

    const filteredStudents = useMemo(() => 
        students.filter(s => s.course === selectedCourse && s.year === selectedYear),
    [students, selectedCourse, selectedYear]);

    const studentStats = useMemo(() => {
        return filteredStudents.map(student => {
            const records = attendance.filter(a => a.studentId === student.id);
            const total = records.length;
            const present = records.filter(a => a.status === 'Present').length;
            const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
            return { ...student, total, present, percentage };
        });
    }, [filteredStudents, attendance]);

    const atRiskStudents = studentStats.filter(s => s.percentage < 75).sort((a, b) => a.percentage - b.percentage);
    const avgAttendance = studentStats.length > 0 
        ? Math.round(studentStats.reduce((acc, curr) => acc + curr.percentage, 0) / studentStats.length) 
        : 0;

    return (
        <div className="space-y-6">
            <div className="bg-white p-4 rounded-xl shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Course</label>
                        <select value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 border-gray-300 rounded-md">
                            {COURSES_DATA.map(course => <option key={course.id} value={course.name}>{course.name}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Year</label>
                        <select value={selectedYear} onChange={e => setSelectedYear(Number(e.target.value))} className="mt-1 block w-full pl-3 pr-10 py-2 border-gray-300 rounded-md">
                            <option value={1}>1st Year</option><option value={2}>2nd Year</option><option value={3}>3rd Year</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
                    <p className="text-sm text-gray-500">Class Average</p>
                    <p className="text-3xl font-bold text-gray-800">{avgAttendance}%</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-red-500">
                    <p className="text-sm text-gray-500">At Risk Students (&lt; 75%)</p>
                    <p className="text-3xl font-bold text-red-600">{atRiskStudents.length}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
                    <p className="text-sm text-gray-500">Total Students</p>
                    <p className="text-3xl font-bold text-gray-800">{studentStats.length}</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                    <h3 className="font-semibold text-red-700 flex items-center">
                        <AlertTriangle className="mr-2" size={20}/> Students with Low Attendance Alert
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th className="px-6 py-3">Student Name</th>
                                <th className="px-6 py-3">Roll Number</th>
                                <th className="px-6 py-3">Attended / Total</th>
                                <th className="px-6 py-3">Percentage</th>
                                <th className="px-6 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {atRiskStudents.length > 0 ? atRiskStudents.map(student => (
                                <tr key={student.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{student.name}</td>
                                    <td className="px-6 py-4">{student.rollNumber}</td>
                                    <td className="px-6 py-4">{student.present} / {student.total}</td>
                                    <td className="px-6 py-4 font-bold text-red-600">{student.percentage}%</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 text-xs font-semibold bg-red-100 text-red-800 rounded-full">At Risk</span>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                                        No students are currently at risk.
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

const AttendanceModule: React.FC = () => {
    const { user } = useAuth();
    if (!user) return null;
    return (
        <div className="space-y-6">
             <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Attendance Management</h2>
            </div>
            {user.role === UserRole.Student ? <StudentAttendanceView /> : <FacultyReportView />}
        </div>
    );
};

export default AttendanceModule;
