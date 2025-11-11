
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useData } from '../../contexts/DataContext';
import { DollarSign, GraduationCap, Users, Briefcase } from 'lucide-react';
import { COURSES_DATA } from '../../constants';

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


export const PrincipalDashboard: React.FC = () => {
    const { students, faculty, fees, placements } = useData();

    const enrollmentData = COURSES_DATA.map(course => ({
        name: course.name.replace(/\s/g, ''),
        students: students.filter(s => s.course === course.name).length
    }));

    const collectedAmount = fees.filter(f => f.status === 'Paid').reduce((sum, f) => sum + f.amount, 0);
    const pendingAmount = fees.filter(f => f.status === 'Pending').reduce((sum, f) => sum + f.amount, 0);

    const feeData = [
        { name: 'Collected', value: collectedAmount, color: '#34d399' },
        { name: 'Pending', value: pendingAmount, color: '#f87171' },
    ];
    
    const feesCollectedValue = `${(collectedAmount / 100000).toFixed(1)}L`;


    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Students" value={String(students.length)} icon={GraduationCap} color="bg-blue-500"/>
                <StatCard title="Total Faculty" value={String(faculty.length)} icon={Users} color="bg-purple-500"/>
                <StatCard title="Fees Collected (INR)" value={feesCollectedValue} icon={DollarSign} color="bg-green-500"/>
                <StatCard title="Total Placements" value={String(placements.length)} icon={Briefcase} color="bg-yellow-500"/>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Enrollment by Course</h3>
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
                 <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Fee Collection Status</h3>
                    <ResponsiveContainer width="100%" height={300}>
                       <PieChart>
                          <Pie
                            data={feeData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            // FIX: The 'percent' prop from recharts can be a non-numeric type, causing an arithmetic error.
                            // Explicitly cast `percent` to a number and provide a fallback of 0 to ensure the operation is safe.
                            label={({ name, percent }) => `${name} ${((Number(percent) || 0) * 100).toFixed(0)}%`}
                          >
                            {feeData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => `₹${Number(value).toLocaleString()}`} />
                          <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};
