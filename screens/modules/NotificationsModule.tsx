import React, { useState, useMemo } from 'react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { Notification, UserRole } from '../../types';
import { Bell, Plus, Edit, Trash2, Filter } from 'lucide-react';

const NotificationForm: React.FC<{
    onSubmit: (notification: Omit<Notification, 'id'>) => void;
    onCancel: () => void;
    initialData?: Notification | null;
}> = ({ onSubmit, onCancel, initialData }) => {
    const { user } = useAuth();
    const [title, setTitle] = useState(initialData?.title || '');
    const [content, setContent] = useState(initialData?.content || '');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title && content && user) {
            onSubmit({
                title,
                content,
                date: new Date().toISOString().split('T')[0],
                author: user.name,
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                />
            </div>
            <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
                <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={4}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                />
            </div>
            <div className="flex justify-end space-x-2">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-secondary">{initialData ? 'Update' : 'Create'}</button>
            </div>
        </form>
    );
};


const NotificationsModule: React.FC = () => {
    const { notifications, addNotification, updateNotification, deleteNotification } = useData();
    const { user } = useAuth();
    const [showForm, setShowForm] = useState(false);
    const [editingNotification, setEditingNotification] = useState<Notification | null>(null);

    const [authorFilter, setAuthorFilter] = useState('all');
    const [startDateFilter, setStartDateFilter] = useState('');
    const [endDateFilter, setEndDateFilter] = useState('');

    const canManage = user?.role === UserRole.Principal || user?.role === UserRole.Admin;

    const handleAdd = () => {
        setEditingNotification(null);
        setShowForm(true);
    };

    const handleEdit = (notification: Notification) => {
        setEditingNotification(notification);
        setShowForm(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this notification?')) {
            deleteNotification(id);
        }
    };

    const handleFormSubmit = (data: Omit<Notification, 'id'>) => {
        if (editingNotification) {
            updateNotification({ ...editingNotification, ...data });
        } else {
            addNotification(data);
        }
        setShowForm(false);
        setEditingNotification(null);
    };

    const uniqueAuthors = useMemo(() => {
        const authors = new Set(notifications.map(n => n.author));
        return ['All Authors', ...Array.from(authors)];
    }, [notifications]);

    const filteredNotifications = useMemo(() => {
        return notifications.filter(n => {
            const notificationDate = new Date(n.date);
            // Adjust for timezone differences by comparing dates without time
            notificationDate.setUTCHours(0, 0, 0, 0);

            const startDate = startDateFilter ? new Date(startDateFilter) : null;
            if(startDate) startDate.setUTCHours(0, 0, 0, 0);

            const endDate = endDateFilter ? new Date(endDateFilter) : null;
            if(endDate) endDate.setUTCHours(0, 0, 0, 0);

            const authorMatch = authorFilter === 'all' || n.author === authorFilter;
            const startDateMatch = !startDate || notificationDate >= startDate;
            const endDateMatch = !endDate || notificationDate <= endDate;
            
            return authorMatch && startDateMatch && endDateMatch;
        });
    }, [notifications, authorFilter, startDateFilter, endDateFilter]);
    
    const handleClearFilters = () => {
        setAuthorFilter('all');
        setStartDateFilter('');
        setEndDateFilter('');
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Circulars & Notifications</h2>
                {canManage && !showForm && (
                     <button onClick={handleAdd} className="flex items-center px-4 py-2 bg-brand-primary text-white rounded-lg shadow-md hover:bg-brand-secondary">
                        <Plus size={20} className="mr-2"/> New Notification
                    </button>
                )}
            </div>

            {!showForm && (
                <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200">
                    <h3 className="text-md font-semibold text-gray-700 mb-3 flex items-center"><Filter size={18} className="mr-2"/>Filter Notifications</h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div className="md:col-span-2">
                            <label htmlFor="authorFilter" className="block text-sm font-medium text-gray-700">Author</label>
                            <select id="authorFilter" value={authorFilter} onChange={e => setAuthorFilter(e.target.value)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md text-gray-900">
                                {uniqueAuthors.map(author => (
                                    <option key={author} value={author === 'All Authors' ? 'all' : author}>{author}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                             <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">From</label>
                             <input type="date" id="startDate" value={startDateFilter} onChange={e => setStartDateFilter(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm sm:text-sm text-gray-900"/>
                        </div>
                         <div>
                             <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">To</label>
                             <input type="date" id="endDate" value={endDateFilter} onChange={e => setEndDateFilter(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm sm:text-sm text-gray-900"/>
                        </div>
                        <div className="md:col-start-4">
                            <button onClick={handleClearFilters} className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Clear</button>
                        </div>
                    </div>
                </div>
            )}


            {showForm ? (
                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-lg font-semibold mb-4">{editingNotification ? 'Edit' : 'Create'} Notification</h3>
                    <NotificationForm 
                        onSubmit={handleFormSubmit}
                        onCancel={() => { setShowForm(false); setEditingNotification(null); }}
                        initialData={editingNotification}
                    />
                </div>
            ) : (
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
                    <ul className="divide-y divide-gray-200">
                        {filteredNotifications.length > 0 ? filteredNotifications.map(n => (
                            <li key={n.id} className="py-4">
                                <div className="flex items-start space-x-4">
                                    <div className="flex-shrink-0">
                                        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-purple-100 text-brand-secondary">
                                            <Bell size={24}/>
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center">
                                            <p className="text-lg font-semibold text-gray-900 truncate">{n.title}</p>
                                             {canManage && (
                                                <div className="flex items-center space-x-2">
                                                    <button onClick={() => handleEdit(n)} className="p-1 text-gray-400 hover:text-blue-600"><Edit size={16}/></button>
                                                    <button onClick={() => handleDelete(n.id)} className="p-1 text-gray-400 hover:text-red-600"><Trash2 size={16}/></button>
                                                </div>
                                            )}
                                        </div>
                                        <p className="mt-1 text-sm text-gray-600">{n.content}</p>
                                        <p className="mt-2 text-xs text-gray-500">By {n.author} on {new Date(n.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </li>
                        )) : (
                            <li className="py-10 text-center text-gray-500">
                                No notifications found matching your criteria.
                            </li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default NotificationsModule;