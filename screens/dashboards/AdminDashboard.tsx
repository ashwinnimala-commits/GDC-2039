
import React from 'react';
import { useData } from '../../contexts/DataContext';
import { Users, UserCheck, BookOpen, HelpCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { UserRole } from '../../types';

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


export const AdminDashboard: React.FC = () => {
    const { users, lmsMaterials, helpDeskTickets } = useData();
    const pendingUsers = users.filter(u => u.status === 'pending').length;
    const openTickets = helpDeskTickets.filter(t => t.status === 'Open').length;

    const roleData = Object.values(UserRole).map(role => ({
        name: role,
        value: users.filter(u => u.role === role).length,
    }));
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF'];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Users" value={String(users.length)} icon={Users} color="bg-blue-500" />
                <StatCard title="Pending Approvals" value={String(pendingUsers)} icon={UserCheck} color="bg-yellow-500" />
                <StatCard title="LMS Materials" value={String(lmsMaterials.length)} icon={BookOpen} color="bg-green-500" />
                <StatCard title="Open Help Tickets" value={String(openTickets)} icon={HelpCircle} color="bg-red-500" />
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">User Role Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie data={roleData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                            {roleData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
