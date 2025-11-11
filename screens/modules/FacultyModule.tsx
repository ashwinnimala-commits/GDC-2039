import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole, Faculty } from '../../types';
import { Plus, Edit, Trash2, X } from 'lucide-react';

const FacultyFormModal: React.FC<{
    onClose: () => void;
    onSubmit: (faculty: Faculty | Omit<Faculty, 'id'>) => void;
    initialData?: Faculty | null;
}> = ({ onClose, onSubmit, initialData }) => {
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        department: initialData?.department || 'Computer Science',
        designation: initialData?.designation || 'Assistant Professor',
        qualifications: initialData?.qualifications || 'Ph.D., M.Sc.',
        photoUrl: initialData?.photoUrl || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

     const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData(prev => ({ ...prev, photoUrl: reader.result as string }));
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalData = {
            ...formData,
            photoUrl: formData.photoUrl || `https://i.pravatar.cc/150?u=${Date.now()}`
        };
        if (initialData) {
            onSubmit({ ...initialData, ...finalData });
        } else {
            onSubmit(finalData);
        }
    };
    
    const DEFAULT_AVATAR = "https://st4.depositphotos.com/1000507/20373/v/450/depositphotos_203731174-stock-illustration-faculty-icon-trendy-faculty-logo.jpg";
    const departments = ['Computer Science', 'Commerce', 'History', 'Physics', 'Chemistry', 'English', 'Telugu', 'Maths', 'Electronics', 'Political Science'];
    const designations = ['Professor & HOD', 'Professor', 'Associate Professor', 'Assistant Professor'];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg m-4">
                <div className="p-4 border-b flex justify-between items-center">
                    <h3 className="text-lg font-semibold">{initialData ? 'Edit' : 'Add'} Faculty Member</h3>
                    <button onClick={onClose}><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                        <div className="flex items-center space-x-4">
                            <img src={formData.photoUrl || DEFAULT_AVATAR} alt="Faculty" className="w-20 h-20 rounded-full object-cover bg-gray-200" />
                            <div>
                                <label htmlFor="photo-upload" className="cursor-pointer px-3 py-2 bg-gray-200 text-sm font-medium text-gray-800 rounded-md hover:bg-gray-300">
                                    Upload Photo
                                </label>
                                <input id="photo-upload" type="file" className="hidden" accept="image/*" onChange={handlePhotoChange} />
                            </div>
                        </div>
                        <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required className="mt-1 w-full border-gray-300 rounded-md shadow-sm"/>
                        <select name="department" value={formData.department} onChange={handleChange} className="mt-1 w-full border-gray-300 rounded-md shadow-sm">
                            {departments.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                        <select name="designation" value={formData.designation} onChange={handleChange} className="mt-1 w-full border-gray-300 rounded-md shadow-sm">
                            {designations.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                        <input type="text" name="qualifications" placeholder="Qualifications" value={formData.qualifications} onChange={handleChange} required className="mt-1 w-full border-gray-300 rounded-md shadow-sm"/>
                    </div>
                    <div className="p-4 bg-gray-50 border-t flex justify-end space-x-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-secondary">{initialData ? 'Update' : 'Add'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const FacultyModule: React.FC = () => {
    const { faculty, addFaculty, updateFaculty, deleteFaculty } = useData();
    const { user } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);

    const canManage = user?.role === UserRole.Principal || user?.role === UserRole.Admin;
    
    const handleAdd = () => {
        setEditingFaculty(null);
        setShowModal(true);
    };

    const handleEdit = (facultyMember: Faculty) => {
        setEditingFaculty(facultyMember);
        setShowModal(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this faculty member?')) {
            deleteFaculty(id);
        }
    };
    
     const handleFormSubmit = (data: Faculty | Omit<Faculty, 'id'>) => {
        if ('id' in data) {
            updateFaculty(data as Faculty);
        } else {
            addFaculty(data as Omit<Faculty, 'id'>);
        }
        setShowModal(false);
        setEditingFaculty(null);
    };


    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Our Faculty</h2>
                {canManage && (
                     <button onClick={handleAdd} className="flex items-center px-4 py-2 bg-brand-primary text-white rounded-lg shadow-md hover:bg-brand-secondary">
                        <Plus size={20} className="mr-2"/> Add Faculty
                    </button>
                )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {faculty.map(member => (
                    <div key={member.id} className="bg-white rounded-lg shadow-md text-center p-6 transition-transform transform hover:scale-105 group relative">
                        {canManage && (
                            <div className="absolute top-2 right-2 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleEdit(member)} className="p-1.5 bg-white rounded-full text-gray-500 hover:text-blue-600 shadow"><Edit size={14}/></button>
                                <button onClick={() => handleDelete(member.id)} className="p-1.5 bg-white rounded-full text-gray-500 hover:text-red-600 shadow"><Trash2 size={14}/></button>
                            </div>
                        )}
                        <img src={member.photoUrl} alt={member.name} className="w-24 h-24 rounded-full mx-auto mb-4 object-cover ring-4 ring-purple-200" />
                        <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
                        <p className="text-sm text-brand-primary font-semibold">{member.designation}</p>
                        <p className="text-sm text-gray-600">{member.department}</p>
                        <p className="text-xs text-gray-500 mt-2">{member.qualifications}</p>
                    </div>
                ))}
            </div>
            {showModal && (
                <FacultyFormModal 
                    onClose={() => setShowModal(false)}
                    onSubmit={handleFormSubmit}
                    initialData={editingFaculty}
                />
            )}
        </div>
    );
};

export default FacultyModule;