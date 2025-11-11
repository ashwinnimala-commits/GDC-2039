import React, { useState, useMemo } from 'react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { LMSMaterial, UserRole } from '../../types';
import { COURSES_DATA } from '../../constants';
import { UploadCloud, Plus, Edit, Trash2, X, Download, FileText, File, FileArchive, Presentation } from 'lucide-react';

const fileTypeIcons: { [key in LMSMaterial['fileType']]: React.ElementType } = {
    PDF: FileText,
    DOCX: File,
    PPT: Presentation,
    ZIP: FileArchive,
};

const LMSFormModal: React.FC<{
    onClose: () => void;
    onSubmit: (material: LMSMaterial | Omit<LMSMaterial, 'id'>) => void;
    initialData?: LMSMaterial | null;
}> = ({ onClose, onSubmit, initialData }) => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        description: initialData?.description || '',
        course: initialData?.course || COURSES_DATA[0].name,
        subject: initialData?.subject || COURSES_DATA[0].subjects[0],
        fileName: initialData?.fileName || '',
        fileType: initialData?.fileType || 'PDF',
    });

    const availableSubjects = useMemo(() => {
        const selectedCourse = COURSES_DATA.find(c => c.name === formData.course);
        return selectedCourse ? selectedCourse.subjects : [];
    }, [formData.course]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const fileExtension = file.name.split('.').pop()?.toUpperCase() || '';
            let fileType: LMSMaterial['fileType'] = 'PDF';
            if (['PDF', 'DOCX', 'PPT', 'ZIP'].includes(fileExtension)) {
                fileType = fileExtension as LMSMaterial['fileType'];
            }
            setFormData(prev => ({ ...prev, fileName: file.name, fileType }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        const submissionData = {
            ...formData,
            uploadDate: new Date().toISOString().split('T')[0],
            uploadedBy: user.name,
        };
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
                    <h3 className="text-lg font-semibold">{initialData ? 'Edit' : 'Upload'} Material</h3>
                    <button onClick={onClose}><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Title</label>
                            <input type="text" name="title" value={formData.title} onChange={handleChange} required className="mt-1 w-full border-gray-300 rounded-md shadow-sm"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} rows={3} required className="mt-1 w-full border-gray-300 rounded-md shadow-sm"/>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Course</label>
                                <select name="course" value={formData.course} onChange={handleChange} className="mt-1 w-full border-gray-300 rounded-md shadow-sm">
                                    {COURSES_DATA.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Subject</label>
                                <select name="subject" value={formData.subject} onChange={handleChange} className="mt-1 w-full border-gray-300 rounded-md shadow-sm">
                                    {availableSubjects.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700">File</label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                <div className="space-y-1 text-center">
                                    <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                                    <div className="flex text-sm text-gray-600">
                                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
                                            <span>Upload a file</span>
                                            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500">{formData.fileName ? `Selected: ${formData.fileName}` : 'PDF, DOCX, PPT, ZIP'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 bg-gray-50 border-t flex justify-end space-x-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-secondary">{initialData ? 'Update' : 'Upload'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const LMSModule: React.FC = () => {
    const { lmsMaterials, addLMSMaterial, updateLMSMaterial, deleteLMSMaterial } = useData();
    const { user } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [editingMaterial, setEditingMaterial] = useState<LMSMaterial | null>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterCourse, setFilterCourse] = useState('All');

    const canManage = user?.role === UserRole.Principal || user?.role === UserRole.Admin || user?.role === UserRole.HOD || user?.role === UserRole.Lecturer;

    const filteredMaterials = useMemo(() => {
        return lmsMaterials
            .filter(material => {
                const searchMatch = material.title.toLowerCase().includes(searchTerm.toLowerCase()) || material.subject.toLowerCase().includes(searchTerm.toLowerCase());
                const courseMatch = filterCourse === 'All' || material.course === filterCourse;
                return searchMatch && courseMatch;
            })
            .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());
    }, [lmsMaterials, searchTerm, filterCourse]);

    const handleAdd = () => {
        setEditingMaterial(null);
        setShowModal(true);
    };

    const handleEdit = (material: LMSMaterial) => {
        setEditingMaterial(material);
        setShowModal(true);
    };
    
    const handleDelete = (id: string) => {
        if(window.confirm('Are you sure you want to delete this material?')) {
            deleteLMSMaterial(id);
        }
    }

    const handleFormSubmit = (data: LMSMaterial | Omit<LMSMaterial, 'id'>) => {
        if ('id' in data) {
            updateLMSMaterial(data as LMSMaterial);
        } else {
            addLMSMaterial(data as Omit<LMSMaterial, 'id'>);
        }
        setShowModal(false);
        setEditingMaterial(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap justify-between items-center gap-4">
                <h2 className="text-xl font-bold text-gray-800">Learning Management System</h2>
                {canManage && (
                     <button onClick={handleAdd} className="flex items-center px-4 py-2 bg-brand-primary text-white rounded-lg shadow-md hover:bg-brand-secondary">
                        <Plus size={20} className="mr-2"/> Upload Material
                    </button>
                )}
            </div>
            
            <div className="bg-white p-4 rounded-xl shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" placeholder="Search by title or subject..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm"/>
                    <select value={filterCourse} onChange={e => setFilterCourse(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm">
                        <option value="All">All Courses</option>
                        {COURSES_DATA.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMaterials.map(material => {
                     const Icon = fileTypeIcons[material.fileType] || FileText;
                     return (
                        <div key={material.id} className="bg-white rounded-xl shadow-md p-5 flex flex-col justify-between">
                            <div>
                                <div className="flex items-start justify-between">
                                    <Icon className="w-10 h-10 text-brand-secondary mb-3"/>
                                    {canManage && (
                                        <div className="flex items-center space-x-2">
                                            <button onClick={() => handleEdit(material)} className="p-1 text-gray-400 hover:text-blue-600"><Edit size={16}/></button>
                                            <button onClick={() => handleDelete(material.id)} className="p-1 text-gray-400 hover:text-red-600"><Trash2 size={16}/></button>
                                        </div>
                                    )}
                                </div>
                                <h3 className="text-lg font-bold text-gray-800 truncate">{material.title}</h3>
                                <p className="text-sm text-gray-500 mt-1">{material.subject}</p>
                                <p className="text-sm text-gray-600 mt-2 h-10 overflow-hidden">{material.description}</p>
                            </div>
                            <div className="mt-4">
                                <div className="text-xs text-gray-500 mb-3">
                                    <p>By {material.uploadedBy} on {material.uploadDate}</p>
                                </div>
                                <button className="w-full flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600">
                                    <Download size={16} className="mr-2"/> Download
                                </button>
                            </div>
                        </div>
                     )
                })}
            </div>
            
            {showModal && (
                <LMSFormModal
                    onClose={() => { setShowModal(false); setEditingMaterial(null); }}
                    onSubmit={handleFormSubmit}
                    initialData={editingMaterial}
                />
            )}
        </div>
    );
};

export default LMSModule;