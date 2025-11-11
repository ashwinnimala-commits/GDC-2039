import React, { useState, useMemo } from 'react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { StudentData, UserRole } from '../../types';
import { COURSES_DATA } from '../../constants';
import { Plus, Edit, Trash2, X, Upload, ChevronDown, ChevronUp } from 'lucide-react';

// Reusable sorting hook
// FIX: Explicitly type the 'config' parameter to prevent TypeScript from inferring a wider 'string' type for its properties.
const useSortableData = (items: StudentData[], config: { key: keyof StudentData, direction: 'ascending' | 'descending' } = { key: 'name', direction: 'ascending' }) => {
    const [sortConfig, setSortConfig] = useState<{key: keyof StudentData, direction: 'ascending' | 'descending'} | null>(config);

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

    const requestSort = (key: keyof StudentData) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    return { items: sortedItems, requestSort, sortConfig };
};


const StudentFormModal: React.FC<{
    onClose: () => void;
    onSubmit: (student: StudentData | Omit<StudentData, 'id'>) => void;
    initialData?: StudentData | null;
    students: StudentData[];
}> = ({ onClose, onSubmit, initialData, students }) => {
    const [formData, setFormData] = useState<Omit<StudentData, 'id' | 'photoUrl'> & { photoUrl?: string }>({
        name: initialData?.name || '',
        rollNumber: initialData?.rollNumber || '',
        studentId: initialData?.studentId || '',
        email: initialData?.email || '',
        phone: initialData?.phone || '',
        course: initialData?.course || COURSES_DATA[0].name,
        year: initialData?.year || 1,
        attendance: initialData?.attendance || 0,
        photoUrl: initialData?.photoUrl || '',
    });
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'year' || name === 'attendance' ? parseInt(value) : value }));
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
        setError('');

        const isEmailTaken = students.some(
            student => student.email.toLowerCase() === formData.email.toLowerCase() && student.id !== initialData?.id
        );

        if (isEmailTaken) {
            setError('This email address is already in use by another student.');
            return;
        }

        if (initialData) {
            onSubmit({ ...initialData, ...formData });
        } else {
            onSubmit(formData);
        }
    };
    
    const DEFAULT_AVATAR = "https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg";


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg m-4">
                <div className="p-4 border-b flex justify-between items-center">
                    <h3 className="text-lg font-semibold">{initialData ? 'Edit' : 'Add'} Student</h3>
                    <button onClick={onClose}><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                        <div className="flex items-center space-x-4">
                            <img 
                                src={formData.photoUrl || DEFAULT_AVATAR} 
                                alt="Student" 
                                className="w-20 h-20 rounded-full object-cover bg-gray-200"
                            />
                            <div>
                                <label htmlFor="photo-upload" className="cursor-pointer px-3 py-2 bg-gray-200 text-sm font-medium text-gray-800 rounded-md hover:bg-gray-300">
                                    Upload Photo
                                </label>
                                <input id="photo-upload" type="file" className="hidden" accept="image/*" onChange={handlePhotoChange} />
                                <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 1MB.</p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="mt-1 w-full border-gray-300 rounded-md shadow-sm"/>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label className="block text-sm font-medium text-gray-700">Student ID</label>
                                <input type="text" name="studentId" value={formData.studentId} onChange={handleChange} required className="mt-1 w-full border-gray-300 rounded-md shadow-sm"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Roll Number</label>
                                <input type="text" name="rollNumber" value={formData.rollNumber} onChange={handleChange} required className="mt-1 w-full border-gray-300 rounded-md shadow-sm"/>
                            </div>
                        </div>
                         <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} required className="mt-1 w-full border-gray-300 rounded-md shadow-sm"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Phone</label>
                                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="mt-1 w-full border-gray-300 rounded-md shadow-sm"/>
                            </div>
                        </div>
                        {error && <p className="text-sm text-red-600 my-2">{error}</p>}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Course</label>
                            <select name="course" value={formData.course} onChange={handleChange} className="mt-1 w-full border-gray-300 rounded-md shadow-sm">
                                {COURSES_DATA.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Year</label>
                                <input type="number" name="year" min="1" max="3" value={formData.year} onChange={handleChange} required className="mt-1 w-full border-gray-300 rounded-md shadow-sm"/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Attendance (%)</label>
                                <input type="number" name="attendance" min="0" max="100" value={formData.attendance} onChange={handleChange} required className="mt-1 w-full border-gray-300 rounded-md shadow-sm"/>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 bg-gray-50 border-t flex justify-end space-x-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-secondary">{initialData ? 'Update Student' : 'Add Student'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const BulkImportModal: React.FC<{
    onClose: () => void;
    onImport: () => void;
}> = ({ onClose, onImport }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg m-4">
                <div className="p-4 border-b flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Bulk Import Students</h3>
                    <button onClick={onClose}><X size={20} /></button>
                </div>
                <div className="p-6 text-center space-y-4">
                    <Upload size={48} className="mx-auto text-gray-400" />
                    <p className="text-gray-600">This is a demo feature. In a real application, you would upload a CSV file with student data.</p>
                    <p className="text-sm text-gray-500">Clicking 'Import' will add 3 new sample students to the system.</p>
                </div>
                <div className="p-4 bg-gray-50 border-t flex justify-end space-x-2">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                    <button type="button" onClick={onImport} className="px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-secondary">Import Sample Data</button>
                </div>
            </div>
        </div>
    );
};

const StudentsModule: React.FC = () => {
    const { students, addStudent, updateStudent, deleteStudent } = useData();
    const { user } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [editingStudent, setEditingStudent] = useState<StudentData | null>(null);
    const [showBulkImport, setShowBulkImport] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const [filterDepartment, setFilterDepartment] = useState('All');
    const [filterCourse, setFilterCourse] = useState('All');
    const [filterYear, setFilterYear] = useState('All');

    const canManage = user?.role === UserRole.Principal || user?.role === UserRole.Admin || user?.role === UserRole.HOD;
    
    const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilterDepartment(e.target.value);
        setFilterCourse('All'); // Reset course when department changes
    };
    
    const availableCourses = useMemo(() => {
        if (filterDepartment === 'All') {
            return COURSES_DATA;
        }
        return COURSES_DATA.filter(c => c.degree === filterDepartment);
    }, [filterDepartment]);

    const filteredStudents = useMemo(() => {
        return students.filter(student => {
            const courseDetails = COURSES_DATA.find(c => c.name === student.course);
            const department = courseDetails?.degree;

            const searchMatch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || student.studentId.includes(searchTerm);
            const departmentMatch = filterDepartment === 'All' || department === filterDepartment;
            const courseMatch = filterCourse === 'All' || student.course === filterCourse;
            const yearMatch = filterYear === 'All' || student.year === parseInt(filterYear);
            
            return searchMatch && departmentMatch && courseMatch && yearMatch;
        });
    }, [students, searchTerm, filterDepartment, filterCourse, filterYear]);

    const { items: sortedStudents, requestSort, sortConfig } = useSortableData(filteredStudents);

    const getSortIcon = (key: keyof StudentData) => {
        if (!sortConfig || sortConfig.key !== key) {
            return null;
        }
        return sortConfig.direction === 'ascending' ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
    };
    
    const handleAdd = () => {
        setEditingStudent(null);
        setShowModal(true);
    };

    const handleEdit = (student: StudentData) => {
        setEditingStudent(student);
        setShowModal(true);
    };
    
    const handleDelete = (id: string) => {
        if(window.confirm('Are you sure you want to delete this student record?')) {
            deleteStudent(id);
        }
    }

    const handleFormSubmit = (data: StudentData | Omit<StudentData, 'id'>) => {
        if ('id' in data) {
            updateStudent(data as StudentData);
        } else {
            addStudent(data as Omit<StudentData, 'id'>);
        }
        setShowModal(false);
        setEditingStudent(null);
    };

    const handleBulkImport = () => {
        // Demo: add 3 new students
        const newStudents: Omit<StudentData, 'id'>[] = [
            { name: 'Zoya Akhtar', rollNumber: '23-KGC-1051', studentId: 'KGC2023051', email: 'zoya@student.kgc.edu', phone: '9876543210', course: 'B.A. (H.E.P)', year: 1, attendance: 85, photoUrl: `https://i.pravatar.cc/150?u=S151` },
            { name: 'Kabir Mehra', rollNumber: '23-KGC-1052', studentId: 'KGC2023052', email: 'kabir@student.kgc.edu', phone: '9876543211', course: 'B.Sc. (MPCs)', year: 2, attendance: 91, photoUrl: `https://i.pravatar.cc/150?u=S152` },
            { name: 'Natasha Singh', rollNumber: '23-KGC-1053', studentId: 'KGC2023053', email: 'natasha@student.kgc.edu', phone: '9876543212', course: 'B.Com. (General)', year: 3, attendance: 78, photoUrl: `https://i.pravatar.cc/150?u=S153` },
        ];
        newStudents.forEach(addStudent);
        setShowBulkImport(false);
    };
    
    const DEFAULT_AVATAR = "https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg";

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap justify-between items-center gap-4">
                <h2 className="text-xl font-bold text-gray-800">Student Management</h2>
                {canManage && (
                     <div className="flex items-center gap-2">
                        <button onClick={() => setShowBulkImport(true)} className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700">
                           <Upload size={20} className="mr-2"/> Bulk Import
                       </button>
                        <button onClick={handleAdd} className="flex items-center px-4 py-2 bg-brand-primary text-white rounded-lg shadow-md hover:bg-brand-secondary">
                           <Plus size={20} className="mr-2"/> Add Student
                       </button>
                    </div>
                )}
            </div>
            
            <div className="bg-white p-4 rounded-xl shadow-md">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input type="text" placeholder="Search by name or ID..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm"/>
                    <select value={filterDepartment} onChange={handleDepartmentChange} className="w-full border-gray-300 rounded-md shadow-sm">
                        <option value="All">All Departments</option>
                        <option value="B.A.">B.A.</option>
                        <option value="B.Sc.">B.Sc.</option>
                        <option value="B.Com.">B.Com.</option>
                    </select>
                    <select value={filterCourse} onChange={e => setFilterCourse(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm">
                        <option value="All">All Courses</option>
                        {availableCourses.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                    <select value={filterYear} onChange={e => setFilterYear(e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm">
                        <option value="All">All Years</option>
                        <option value="1">1st Year</option>
                        <option value="2">2nd Year</option>
                        <option value="3">3rd Year</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3"><button onClick={() => requestSort('name')} className="flex items-center gap-1">Name {getSortIcon('name')}</button></th>
                                <th scope="col" className="px-6 py-3"><button onClick={() => requestSort('studentId')} className="flex items-center gap-1">Student ID {getSortIcon('studentId')}</button></th>
                                <th scope="col" className="px-6 py-3"><button onClick={() => requestSort('rollNumber')} className="flex items-center gap-1">Roll Number {getSortIcon('rollNumber')}</button></th>
                                <th scope="col" className="px-6 py-3"><button onClick={() => requestSort('course')} className="flex items-center gap-1">Course {getSortIcon('course')}</button></th>
                                <th scope="col" className="px-6 py-3"><button onClick={() => requestSort('year')} className="flex items-center gap-1">Year {getSortIcon('year')}</button></th>
                                <th scope="col" className="px-6 py-3"><button onClick={() => requestSort('attendance')} className="flex items-center gap-1">Attendance {getSortIcon('attendance')}</button></th>
                                {canManage && <th scope="col" className="px-6 py-3">Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {sortedStudents.map(student => (
                                <tr key={student.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <img 
                                                className="w-10 h-10 rounded-full object-cover mr-4"
                                                src={student.photoUrl || DEFAULT_AVATAR} 
                                                alt={student.name}
                                            />
                                            <span>{student.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">{student.studentId}</td>
                                    <td className="px-6 py-4">{student.rollNumber}</td>
                                    <td className="px-6 py-4">{student.course}</td>
                                    <td className="px-6 py-4">{student.year}</td>
                                    <td className="px-6 py-4">{student.attendance}%</td>
                                    {canManage && (
                                        <td className="px-6 py-4 flex items-center space-x-2">
                                            <button onClick={() => handleEdit(student)} className="p-1 text-gray-400 hover:text-blue-600"><Edit size={16}/></button>
                                            <button onClick={() => handleDelete(student.id)} className="p-1 text-gray-400 hover:text-red-600"><Trash2 size={16}/></button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <StudentFormModal
                    students={students}
                    onClose={() => { setShowModal(false); setEditingStudent(null); }}
                    onSubmit={handleFormSubmit}
                    initialData={editingStudent}
                />
            )}
            {showBulkImport && (
                <BulkImportModal 
                    onClose={() => setShowBulkImport(false)}
                    onImport={handleBulkImport}
                />
            )}
        </div>
    );
};

export default StudentsModule;