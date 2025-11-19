
import React, { useState, ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types';
import { Menu, X, Home, Bell, Users, BookOpen, DollarSign, LogOut, FileText, Calendar, Briefcase, HelpCircle, GraduationCap, Shield, ClipboardList, User } from 'lucide-react';
import { COLLEGE_LOGO_URL } from '../constants';

import { PrincipalDashboard } from './dashboards/PrincipalDashboard';
import { StudentDashboard } from './dashboards/StudentDashboard';
import { LecturerDashboard } from './dashboards/LecturerDashboard';
import { AdminDashboard } from './dashboards/AdminDashboard';
import { HODDashboard } from './dashboards/HODDashboard';
import NotificationsModule from './modules/NotificationsModule';
import StudentsModule from './modules/StudentsModule';
import LMSModule from './modules/LMSModule';
import UserManagementModule from './modules/UserManagementModule';
import FacultyModule from './modules/FacultyModule';
import AttendanceModule from './modules/AttendanceModule';
import TimetableModule from './modules/TimetableModule';
import FeesModule from './modules/FeesModule';
import PlacementsModule from './modules/PlacementsModule';
import HelpDeskModule from './modules/HelpDeskModule';
import ExaminationsModule from './modules/ExaminationsModule';
import ProfileModule from './modules/ProfileModule';


type NavItem = {
    name: string;
    icon: React.ElementType;
    component: ReactNode;
    roles: UserRole[];
};

const navItems: NavItem[] = [
    { name: 'Dashboard', icon: Home, component: <div />, roles: Object.values(UserRole) },
    { name: 'Notifications', icon: Bell, component: <NotificationsModule />, roles: Object.values(UserRole) },
    { name: 'LMS', icon: BookOpen, component: <LMSModule />, roles: [UserRole.Principal, UserRole.Admin, UserRole.HOD, UserRole.Lecturer, UserRole.Student] },
    { name: 'Students', icon: GraduationCap, component: <StudentsModule />, roles: [UserRole.Principal, UserRole.Admin, UserRole.HOD, UserRole.Lecturer] },
    { name: 'Faculty', icon: Users, component: <FacultyModule />, roles: Object.values(UserRole) },
    { name: 'Attendance', icon: FileText, component: <AttendanceModule />, roles: Object.values(UserRole) },
    { name: 'Timetable', icon: Calendar, component: <TimetableModule />, roles: Object.values(UserRole) },
    { name: 'Examinations', icon: ClipboardList, component: <ExaminationsModule />, roles: Object.values(UserRole) },
    { name: 'Fees', icon: DollarSign, component: <FeesModule />, roles: [UserRole.Principal, UserRole.Admin, UserRole.Student] },
    { name: 'Placements', icon: Briefcase, component: <PlacementsModule />, roles: Object.values(UserRole) },
    { name: 'Help Desk', icon: HelpCircle, component: <HelpDeskModule />, roles: Object.values(UserRole) },
    { name: 'User Management', icon: Shield, component: <UserManagementModule />, roles: [UserRole.Principal, UserRole.Admin] },
];

const getDashboardComponent = (role: UserRole) => {
    switch (role) {
        case UserRole.Principal:
            return <PrincipalDashboard />;
        case UserRole.Admin:
            return <AdminDashboard />;
        case UserRole.HOD:
            return <HODDashboard />;
        case UserRole.Lecturer:
            return <LecturerDashboard />;
        case UserRole.Student:
            return <StudentDashboard />;
        default:
            return <div>Welcome!</div>;
    }
};

const Dashboard: React.FC = () => {
    const { user, logout } = useAuth();
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [activeNavItem, setActiveNavItem] = useState('Dashboard');
    
    if (!user) return null;

    const filteredNavItems = navItems.filter(item => item.roles.includes(user.role));
    
    const activeComponent = activeNavItem === 'Dashboard' 
        ? getDashboardComponent(user.role)
        : activeNavItem === 'Profile'
        ? <ProfileModule />
        : filteredNavItems.find(item => item.name === activeNavItem)?.component;

    const NavLink: React.FC<{ item: NavItem }> = ({ item }) => (
        <a
            href="#"
            onClick={(e) => {
                e.preventDefault();
                setActiveNavItem(item.name);
                if (window.innerWidth < 768) setSidebarOpen(false);
            }}
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                activeNavItem === item.name 
                ? 'bg-purple-700 text-white shadow-lg' 
                : 'text-purple-100 hover:bg-purple-700 hover:text-white'
            }`}
        >
            <item.icon className="w-5 h-5 mr-3" />
            <span>{item.name}</span>
        </a>
    );

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className={`absolute md:relative z-20 flex flex-col h-full bg-gradient-to-b from-brand-primary to-brand-secondary text-white transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'w-64' : 'w-0 -translate-x-full'} md:translate-x-0 md:w-64 overflow-y-auto`}>
                <div className="flex items-center justify-center p-6 border-b border-purple-500">
                    <img src={COLLEGE_LOGO_URL} alt="College Logo" className="w-12 h-12 rounded-full object-cover"/>
                    <span className="ml-3 text-xl font-bold">GDC Kukatpally</span>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    {filteredNavItems.map(item => <NavLink key={item.name} item={item} />)}
                </nav>
                <div className="p-4 border-t border-purple-500 space-y-2">
                     <a
                        href="#"
                        onClick={(e) => { e.preventDefault(); setActiveNavItem('Profile'); setSidebarOpen(false); }}
                        className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                            activeNavItem === 'Profile' 
                            ? 'bg-purple-700 text-white shadow-lg' 
                            : 'text-purple-100 hover:bg-purple-700 hover:text-white'
                        }`}
                    >
                        <User className="w-5 h-5 mr-3" />
                        <span>Profile</span>
                    </a>
                     <a
                        href="#"
                        onClick={logout}
                        className="flex items-center px-4 py-3 text-sm font-medium rounded-lg text-purple-100 hover:bg-purple-700 hover:text-white"
                    >
                        <LogOut className="w-5 h-5 mr-3" />
                        <span>Logout</span>
                    </a>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className="flex items-center justify-between p-4 bg-white border-b">
                     <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="text-gray-600 md:hidden">
                        {isSidebarOpen ? <X size={24}/> : <Menu size={24}/>}
                    </button>
                    <h1 className="text-2xl font-semibold text-gray-800">{activeNavItem}</h1>
                    <div className="flex items-center space-x-4">
                        <button className="relative text-gray-500 hover:text-gray-700">
                           <Bell />
                           <span className="absolute -top-1 -right-1 flex h-3 w-3">
                               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                               <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                           </span>
                       </button>
                        <div 
                            className="flex items-center space-x-2 cursor-pointer p-1 rounded-lg hover:bg-gray-100"
                            onClick={() => { setActiveNavItem('Profile'); setSidebarOpen(false); }}
                            role="button"
                            tabIndex={0}
                            aria-label="Open user profile"
                        >
                            <div className="flex flex-col items-end">
                                <span className="font-semibold text-gray-700">{user.name}</span>
                                <span className="text-xs text-gray-500">{user.role}</span>
                            </div>
                            <img className="w-10 h-10 rounded-full object-cover" src={user.photoUrl || `https://i.pravatar.cc/150?u=${user.id}`} alt="User Avatar" />
                        </div>
                    </div>
                </header>
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 md:p-6">
                    {activeComponent}
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
