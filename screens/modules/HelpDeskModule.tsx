import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole, HelpDeskTicket } from '../../types';
import { X, PlusCircle } from 'lucide-react';

const TicketFormModal: React.FC<{
    onClose: () => void;
    onSubmit: (ticket: Omit<HelpDeskTicket, 'id'|'studentName'>) => void;
}> = ({ onClose, onSubmit }) => {
    const { user } = useAuth();
    const { students } = useData();
    const studentData = students.find(s => s.email === user?.email);

    const [formData, setFormData] = useState({
        subject: '',
        description: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!studentData) return;
        const newTicket = {
            ...formData,
            studentId: studentData.id,
            status: 'Open' as 'Open',
            date: new Date().toISOString().split('T')[0],
        };
        onSubmit(newTicket);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg m-4">
                <div className="p-4 border-b flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Create New Help Desk Ticket</h3>
                    <button onClick={onClose}><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Subject</label>
                            <input type="text" name="subject" value={formData.subject} onChange={handleChange} required className="mt-1 w-full border-gray-300 rounded-md shadow-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} rows={5} required className="mt-1 w-full border-gray-300 rounded-md shadow-sm" />
                        </div>
                    </div>
                     <div className="p-4 bg-gray-50 border-t flex justify-end space-x-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-secondary">Submit Ticket</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const getStatusBadge = (status: 'Open' | 'In Progress' | 'Closed') => {
    switch (status) {
        case 'Open': return 'bg-blue-100 text-blue-800';
        case 'In Progress': return 'bg-yellow-100 text-yellow-800';
        case 'Closed': return 'bg-gray-100 text-gray-800';
    }
};

const HelpDeskModule: React.FC = () => {
    const { helpDeskTickets, students, addHelpDeskTicket, updateHelpDeskTicket } = useData();
    const { user } = useAuth();
    const [showModal, setShowModal] = useState(false);

    const isStudent = user?.role === UserRole.Student;
    const canManage = user?.role === UserRole.Admin || user?.role === UserRole.Principal;
    
    const studentData = isStudent ? students.find(s => s.email === user.email) : null;
    const tickets = isStudent && studentData 
        ? helpDeskTickets.filter(t => t.studentId === studentData.id)
        : helpDeskTickets;

    const handleFormSubmit = (data: Omit<HelpDeskTicket, 'id' | 'studentName'>) => {
        addHelpDeskTicket(data);
        setShowModal(false);
    };

    const handleStatusChange = (ticket: HelpDeskTicket, newStatus: HelpDeskTicket['status']) => {
        updateHelpDeskTicket({ ...ticket, status: newStatus });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Help Desk Tickets</h2>
                 {isStudent && (
                     <button onClick={() => setShowModal(true)} className="flex items-center px-4 py-2 bg-brand-primary text-white rounded-lg shadow-md hover:bg-brand-secondary">
                        <PlusCircle size={20} className="mr-2"/> Create New Ticket
                    </button>
                )}
            </div>
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                {!isStudent && <th className="px-6 py-3">Student Name</th>}
                                <th className="px-6 py-3">Subject</th>
                                <th className="px-6 py-3">Date Submitted</th>
                                <th className="px-6 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tickets.map(ticket => (
                                <tr key={ticket.id} className="bg-white border-b hover:bg-gray-50">
                                    {!isStudent && <td className="px-6 py-4 font-medium text-gray-900">{ticket.studentName}</td>}
                                    <td className="px-6 py-4">{ticket.subject}</td>
                                    <td className="px-6 py-4">{ticket.date}</td>
                                    <td className="px-6 py-4">
                                        {canManage ? (
                                            <select 
                                                value={ticket.status} 
                                                onChange={(e) => handleStatusChange(ticket, e.target.value as HelpDeskTicket['status'])}
                                                className={`text-xs font-semibold rounded-full border-0 focus:ring-0 ${getStatusBadge(ticket.status)}`}
                                            >
                                                <option value="Open">Open</option>
                                                <option value="In Progress">In Progress</option>
                                                <option value="Closed">Closed</option>
                                            </select>
                                        ) : (
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(ticket.status)}`}>
                                                {ticket.status}
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {tickets.length === 0 && <p className="p-6 text-center text-gray-500">No help desk tickets found.</p>}
                </div>
            </div>
            {showModal && (
                <TicketFormModal 
                    onClose={() => setShowModal(false)}
                    onSubmit={handleFormSubmit}
                />
            )}
        </div>
    );
};

export default HelpDeskModule;