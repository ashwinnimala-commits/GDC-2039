
import React from 'react';
import { useData } from '../../contexts/DataContext';
import { GraduationCap, Users, FileText, BookOpen } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const StatCard: React.FC<{ title: string; value: string; icon: React.ElementType; color: string; }> = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4">
        <div className={`p-3 rounded-full ${color}`}>
            <Icon className="text-white" size={24} />
        </div>
        <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

export const HODDashboard: React.FC = () => {
    // For demo purposes, we'll assume the HOD is for the Computer Science department.
    const HOD_DEPARTMENT = 'Computer Science';
    const { students, faculty, lmsMaterials } = useData();

    const deptStudents = students.filter(s => {
        // This is a simplification. A real app would have course-to-department mapping.
        return s.course.includes('B.Sc. (MPCs)') || s.course.includes('B.Sc. (MECs)') || s.course.includes('B.Com. (Computer Applications)');
    });
    const deptFaculty = faculty.filter(f => f.department === HOD_DEPARTMENT);
    const deptLMS = lmsMaterials.filter(m => m.course.includes('B.Sc.') || m.course.includes('Computer'));

    const enrollmentData = [
        { name: 'Year 1', students: deptStudents.filter(s => s.year === 1).length },
        { name: 'Year 2', students: deptStudents.filter(s => s.year === 2).length },
        { name: 'Year 3', students: deptStudents.filter(s => s.year === 3).length },
    ];
    
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">HOD Dashboard - <span className="text-brand-primary">{HOD_DEPARTMENT}</span></h2>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Department Students" value={String(deptStudents.length)} icon={GraduationCap} color="bg-blue-500"/>
                <StatCard title="Department Faculty" value={String(deptFaculty.length)} icon={Users} color="bg-purple-500"/>
                <StatCard title="Department Materials" value={String(deptLMS.length)} icon={BookOpen} color="bg-green-500"/>
                <StatCard title="Avg. Attendance" value="88%" icon={FileText} color="bg-yellow-500"/>
            </div>
             <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Department Enrollment by Year</h3>
                 <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={enrollmentData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="students" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};
