import React, { useMemo, useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { Placement, UserRole } from '../../types';
import { Briefcase, TrendingUp, Award, Plus, Edit, Trash2, X, ChevronUp, ChevronDown } from 'lucide-react';

const PlacementFormModal: React.FC<{
    onClose: () => void;
    onSubmit: (placement: Placement | Omit<Placement, 'id'>) => void;
    initialData?: Placement | null;
}> = ({ onClose, onSubmit, initialData }) => {
    const { students } = useData();
    const [formData, setFormData] = useState({
        studentId: initialData?.studentId || '',
        company: initialData?.company || '',
        package: initialData?.package || 0,
        date: initialData?.date || new Date().toISOString().split('T')[0],
    });

    const thirdYearStudents = useMemo(() => students.filter(s => s.year === 3), [students]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'package' ? parseFloat(value) : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const studentName = students.find(s => s.id === formData.studentId)?.name || 'Unknown';
        const submissionData = { ...formData, studentName };
        if (initialData) {
            onSubmit({ ...initialData, ...submissionData });
        } else {
            onSubmit(submissionData);
        }
    };
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg m-4">
                <div className="p-4 border-b flex justify-between items-center">
                    <h3 className="text-lg font-semibold">{initialData ? 'Edit' : 'Add'} Placement Record</h3>
                    <button onClick={onClose}><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Student</label>
                            <select name="studentId" value={formData.studentId} onChange={handleChange} required className="mt-1 w-full border-gray-300 rounded-md shadow-sm">
                                <option value="">Select a student</option>
                                {thirdYearStudents.map(s => <option key={s.id} value={s.id}>{s.name} ({s.studentId})</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Company</label>
                            <input type="text" name="company" value={formData.company} onChange={handleChange} required className="mt-1 w-full border-gray-300 rounded-md shadow-sm" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Package (LPA)</label>
                                <input type="number" name="package" step="0.01" value={formData.package} onChange={handleChange} required className="mt-1 w-full border-gray-300 rounded-md shadow-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Date of Offer</label>
                                <input type="date" name="date" value={formData.date} onChange={handleChange} required className="mt-1 w-full border-gray-300 rounded-md shadow-sm" />
                            </div>
                        </div>
                    </div>
                     <div className="p-4 bg-gray-50 border-t flex justify-end space-x-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-secondary">{initialData ? 'Update Record' : 'Add Record'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// FIX: Explicitly type the 'config' parameter to prevent TypeScript from inferring a wider 'string' type for its properties.
const useSortableData = (items: Placement[], config: { key: keyof Placement, direction: 'ascending' | 'descending' } = { key: 'date', direction: 'descending' }) => {
    const [sortConfig, setSortConfig] = useState<{key: keyof Placement, direction: 'ascending' | 'descending'} | null>(config);

    const sortedItems = useMemo(() => {
        let sortableItems = [...items];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [items, sortConfig]);

    const requestSort = (key: keyof Placement) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    return { items: sortedItems, requestSort, sortConfig };
};

const StatCard: React.FC<{ title: string; value: string; icon: React.ElementType; }> = ({ title, value, icon: Icon }) => (
    <div className="bg-white p-6 rounded-xl shadow-md flex items-center space-x-4">
        <div className="p-3 rounded-full bg-purple-100 text-brand-secondary">
            <Icon size={24} />
        </div>
        <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

const PlacementsModule: React.FC = () => {
    const { placements, addPlacement, updatePlacement, deletePlacement } = useData();
    const { user } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [editingPlacement, setEditingPlacement] = useState<Placement | null>(null);

    const canManage = user?.role === UserRole.Principal || user?.role === UserRole.Admin;

    const { items: sortedPlacements, requestSort, sortConfig } = useSortableData(placements);

    const getSortIcon = (key: keyof Placement) => {
        if (!sortConfig || sortConfig.key !== key) return null;
        return sortConfig.direction === 'ascending' ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
    };

    const stats = useMemo(() => {
        if (placements.length === 0) {
            return { total: '0', average: 'N/A', highest: 'N/A' };
        }
        const total = placements.length;
        const totalPackage = placements.reduce((sum, p) => sum + p.package, 0);
        const average = (totalPackage / total).toFixed(2);
        const highest = Math.max(...placements.map(p => p.package)).toFixed(2);
        return {
            total: String(total),
            average: `${average} LPA`,
            highest: `${highest} LPA`,
        };
    }, [placements]);
    
    const handleAdd = () => {
        setEditingPlacement(null);
        setShowModal(true);
    };

    const handleEdit = (placement: Placement) => {
        setEditingPlacement(placement);
        setShowModal(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this placement record?')) {
            deletePlacement(id);
        }
    };
    
    const handleFormSubmit = (data: Placement | Omit<Placement, 'id'>) => {
        if ('id' in data) {
            updatePlacement(data as Placement);
        } else {
            addPlacement(data as Omit<Placement, 'id'>);
        }
        setShowModal(false);
    };

    return (
        <div className="space-y-6">
             <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Placements</h2>
                {canManage && (
                     <button onClick={handleAdd} className="flex items-center px-4 py-2 bg-brand-primary text-white rounded-lg shadow-md hover:bg-brand-secondary">
                        <Plus size={20} className="mr-2"/> Add Placement
                    </button>
                )}
            </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Total Placements" value={stats.total} icon={Briefcase}/>
                <StatCard title="Average Package" value={stats.average} icon={TrendingUp}/>
                <StatCard title="Highest Package" value={stats.highest} icon={Award}/>
            </div>
            
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th className="px-6 py-3"><button onClick={() => requestSort('studentName')} className="flex items-center gap-1">Student Name {getSortIcon('studentName')}</button></th>
                                <th className="px-6 py-3"><button onClick={() => requestSort('company')} className="flex items-center gap-1">Company {getSortIcon('company')}</button></th>
                                <th className="px-6 py-3"><button onClick={() => requestSort('package')} className="flex items-center gap-1">Package (LPA) {getSortIcon('package')}</button></th>
                                <th className="px-6 py-3"><button onClick={() => requestSort('date')} className="flex items-center gap-1">Date of Offer {getSortIcon('date')}</button></th>
                                {canManage && <th className="px-6 py-3">Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {sortedPlacements.map(placement => (
                                <tr key={placement.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900">{placement.studentName}</td>
                                    <td className="px-6 py-4">{placement.company}</td>
                                    <td className="px-6 py-4 font-mono">{placement.package.toFixed(2)}</td>
                                    <td className="px-6 py-4">{placement.date}</td>
                                    {canManage && (
                                        <td className="px-6 py-4 flex items-center space-x-2">
                                            <button onClick={() => handleEdit(placement)} className="p-1 text-gray-400 hover:text-blue-600"><Edit size={16}/></button>
                                            <button onClick={() => handleDelete(placement.id)} className="p-1 text-gray-400 hover:text-red-600"><Trash2 size={16}/></button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                 {placements.length === 0 && <p className="p-6 text-center text-gray-500">No placement records found.</p>}
            </div>

            {showModal && (
                <PlacementFormModal 
                    onClose={() => setShowModal(false)}
                    onSubmit={handleFormSubmit}
                    initialData={editingPlacement}
                />
            )}
        </div>
    );
};

export default PlacementsModule;