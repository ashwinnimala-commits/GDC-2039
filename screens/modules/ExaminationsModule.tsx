import React, { useState, useMemo, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole, Exam, ExamResult, ExamSchedule, StudentData } from '../../types';
import { COURSES_DATA } from '../../constants';
import { Calendar, Edit, ClipboardList, CheckCircle, Award, Plus, X, Trash2, Save, Send } from 'lucide-react';

// Reusable Modal for adding/editing exam schedules
const ScheduleFormModal: React.FC<{
    onClose: () => void;
    onSubmit: (schedule: Omit<ExamSchedule, 'id'> | ExamSchedule) => void;
    initialData?: ExamSchedule | null;
}> = ({ onClose, onSubmit, initialData }) => {
    const { exams } = useData();
    const [formData, setFormData] = useState({
        examId: initialData?.examId || exams[0]?.id || '',
        courseId: initialData?.courseId || COURSES_DATA[0].id,
        year: initialData?.year || 1,
        subject: initialData?.subject || COURSES_DATA[0].subjects[0],
        date: initialData?.date || '',
        time: initialData?.time || '10:00 - 13:00',
        room: initialData?.room || '',
    });

    const availableSubjects = useMemo(() => {
        return COURSES_DATA.find(c => c.id === formData.courseId)?.subjects || [];
    }, [formData.courseId]);
    
    // Reset subject if it's not in the new list of available subjects
    useEffect(() => {
        if (!availableSubjects.includes(formData.subject)) {
            setFormData(prev => ({...prev, subject: availableSubjects[0]}));
        }
    }, [availableSubjects, formData.subject]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: name === 'year' ? Number(value) : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(initialData ? { ...initialData, ...formData } : formData);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg m-4">
                 <div className="p-4 border-b flex justify-between items-center"><h3 className="text-lg font-semibold">{initialData ? 'Edit' : 'Add'} Schedule</h3><button onClick={onClose}><X size={20}/></button></div>
                 <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                        <select name="examId" value={formData.examId} onChange={handleChange} className="w-full border-gray-300 rounded-md shadow-sm" required>
                             {exams.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                        </select>
                        <select name="courseId" value={formData.courseId} onChange={handleChange} className="w-full border-gray-300 rounded-md shadow-sm" required>
                             {COURSES_DATA.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                        <select name="year" value={formData.year} onChange={handleChange} className="w-full border-gray-300 rounded-md shadow-sm" required>
                            <option value={1}>1st Year</option><option value={2}>2nd Year</option><option value={3}>3rd Year</option>
                        </select>
                        <select name="subject" value={formData.subject} onChange={handleChange} className="w-full border-gray-300 rounded-md shadow-sm" required>
                            {availableSubjects.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full border-gray-300 rounded-md shadow-sm" required />
                        <input type="text" name="time" placeholder="e.g., 10:00 - 13:00" value={formData.time} onChange={handleChange} className="w-full border-gray-300 rounded-md shadow-sm" required />
                        <input type="text" name="room" placeholder="Room No." value={formData.room} onChange={handleChange} className="w-full border-gray-300 rounded-md shadow-sm" required />
                    </div>
                    <div className="p-4 bg-gray-50 flex justify-end space-x-2"><button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md">Cancel</button><button type="submit" className="px-4 py-2 bg-brand-primary text-white rounded-md">{initialData ? 'Update' : 'Add'}</button></div>
                 </form>
            </div>
        </div>
    );
};

// Reusable modal for entering/editing results
const ResultsEntryModal: React.FC<{
    student: StudentData;
    exam: Exam;
    onClose: () => void;
}> = ({ student, exam, onClose }) => {
    const { examResults, addOrUpdateExamResults } = useData();
    const course = COURSES_DATA.find(c => c.name === student.course);
    const [results, setResults] = useState<Omit<ExamResult, 'id'>[]>([]);

    useEffect(() => {
        if (course) {
            const initialResults = course.subjects.map(subject => {
                const existingResult = examResults.find(r => r.studentId === student.id && r.examId === exam.id && r.subject === subject);
                return {
                    examId: exam.id,
                    studentId: student.id,
                    subject: subject,
                    internalMarks: existingResult?.internalMarks || 0,
                    externalMarks: existingResult?.externalMarks || 0,
                    totalMarks: existingResult?.totalMarks || 0,
                    grade: existingResult?.grade || 'F',
                    result: existingResult?.result || 'Fail',
                };
            });
            setResults(initialResults);
        }
    }, [student, exam, course, examResults]);

    const handleMarksChange = (subject: string, field: 'internalMarks' | 'externalMarks', value: number) => {
        setResults(prev => prev.map(r => {
            if (r.subject === subject) {
                const updatedResult = { ...r, [field]: value };
                const totalMarks = updatedResult.internalMarks + updatedResult.externalMarks;
                const grade = totalMarks > 80 ? 'A' : totalMarks > 60 ? 'B' : totalMarks > 50 ? 'C' : totalMarks >= 40 ? 'D' : 'F';
                const result = grade === 'F' ? 'Fail' : 'Pass';
                return { ...updatedResult, totalMarks, grade, result };
            }
            return r;
        }));
    };

    const handleSave = () => {
        addOrUpdateExamResults(results);
        onClose();
    };
    
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl m-4">
                <div className="p-4 border-b flex justify-between items-center"><h3 className="text-lg font-semibold">Enter Results for {student.name}</h3><button onClick={onClose}><X size={20}/></button></div>
                <div className="p-6 max-h-[70vh] overflow-y-auto">
                    <p className="mb-4"><span className="font-semibold">Exam:</span> {exam.name}</p>
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100"><tr><th className="p-2 text-left">Subject</th><th className="p-2">Internal</th><th className="p-2">External</th><th className="p-2">Total</th><th className="p-2">Result</th></tr></thead>
                        <tbody>
                            {results.map(r => (
                                <tr key={r.subject} className="border-b">
                                    <td className="p-2 font-medium">{r.subject}</td>
                                    <td className="p-2"><input type="number" min="0" max="25" value={r.internalMarks} onChange={e => handleMarksChange(r.subject, 'internalMarks', parseInt(e.target.value))} className="w-20 p-1 border rounded"/></td>
                                    <td className="p-2"><input type="number" min="0" max="75" value={r.externalMarks} onChange={e => handleMarksChange(r.subject, 'externalMarks', parseInt(e.target.value))} className="w-20 p-1 border rounded"/></td>
                                    <td className="p-2 text-center font-bold">{r.totalMarks}</td>
                                    <td className="p-2 text-center"><span className={`font-semibold ${r.result === 'Pass' ? 'text-green-600':'text-red-600'}`}>{r.result} ({r.grade})</span></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="p-4 bg-gray-50 flex justify-end"><button onClick={handleSave} className="px-4 py-2 bg-brand-primary text-white rounded-md flex items-center"><Save size={16} className="mr-2"/> Save Results</button></div>
            </div>
        </div>
    )
}

const ExamFormModal: React.FC<{
    onClose: () => void;
    onSubmit: (exam: Omit<Exam, 'id' | 'status'>) => void;
}> = ({ onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: '',
        startDate: '',
        endDate: '',
        registrationDeadline: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg m-4">
                <div className="p-4 border-b flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Add New Exam</h3>
                    <button onClick={onClose}><X size={20} /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Exam Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="mt-1 w-full border-gray-300 rounded-md shadow-sm" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Registration Deadline</label>
                            <input type="date" name="registrationDeadline" value={formData.registrationDeadline} onChange={handleChange} required className="mt-1 w-full border-gray-300 rounded-md shadow-sm" />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Start Date</label>
                            <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required className="mt-1 w-full border-gray-300 rounded-md shadow-sm" />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700">End Date</label>
                            <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required className="mt-1 w-full border-gray-300 rounded-md shadow-sm" />
                        </div>
                    </div>
                    <div className="p-4 bg-gray-50 flex justify-end space-x-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-brand-primary text-white rounded-md">Add Exam</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const ExaminationsModule: React.FC = () => {
    const { user } = useAuth();
    const { students, exams, examSchedules, examResults, examRegistrations, registerForExam, addExam, addExamSchedule, updateExamSchedule, deleteExamSchedule } = useData();
    const [activeTab, setActiveTab] = useState<'schedules' | 'registrations' | 'results'>('schedules');
    const [showExamForm, setShowExamForm] = useState(false);
    const [showScheduleForm, setShowScheduleForm] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState<ExamSchedule | null>(null);
    const [showResultsModal, setShowResultsModal] = useState(false);
    const [studentForResults, setStudentForResults] = useState<StudentData | null>(null);
    const [examForResults, setExamForResults] = useState<Exam | null>(null);

    const isStudent = user?.role === UserRole.Student;
    const isStaff = user?.role === UserRole.Principal || user?.role === UserRole.Admin || user?.role === UserRole.HOD || user?.role === UserRole.Lecturer;
    const canManageExams = user?.role === UserRole.Principal || user?.role === UserRole.Admin;

    const studentData = useMemo(() => isStudent ? students.find(s => s.email === user.email) : null, [isStudent, students, user]);

    const TabButton: React.FC<{ tabName: typeof activeTab; label: string }> = ({ tabName, label }) => (
        <button onClick={() => setActiveTab(tabName)} className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === tabName ? 'bg-brand-primary text-white shadow' : 'text-gray-700 hover:bg-gray-200'}`}>
            {label}
        </button>
    );

    const SchedulesView = () => {
        const [selectedExamId, setSelectedExamId] = useState(exams[0]?.id || '');
        const studentCourse = useMemo(() => studentData ? COURSES_DATA.find(c => c.name === studentData.course) : null, [studentData]);
        const [selectedCourseId, setSelectedCourseId] = useState(studentCourse?.id || COURSES_DATA[0].id);
        const [selectedYear, setSelectedYear] = useState(studentData?.year || 1);
        
        const filteredSchedules = useMemo(() => examSchedules.filter(s => s.examId === selectedExamId && s.courseId === selectedCourseId && s.year === selectedYear).sort((a,b) => a.date.localeCompare(b.date)), [examSchedules, selectedExamId, selectedCourseId, selectedYear]);

        const handleScheduleFormSubmit = (data: Omit<ExamSchedule, 'id'> | ExamSchedule) => {
            if('id' in data) updateExamSchedule(data);
            else addExamSchedule(data);
            setShowScheduleForm(false);
        }

        return (
            <div className="space-y-4">
                <div className="bg-white p-4 rounded-xl shadow-md">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                         <div>
                            <label className="text-sm font-medium text-gray-700">Examination</label>
                            <select value={selectedExamId} onChange={e => setSelectedExamId(e.target.value)} className="mt-1 w-full border-gray-300 rounded-md shadow-sm">
                                {exams.map(exam => <option key={exam.id} value={exam.id}>{exam.name} ({exam.status})</option>)}
                            </select>
                        </div>
                         {!isStudent && <>
                             <div>
                                <label className="text-sm font-medium text-gray-700">Course</label>
                                <select value={selectedCourseId} onChange={e => setSelectedCourseId(e.target.value)} className="mt-1 w-full border-gray-300 rounded-md shadow-sm">
                                    {COURSES_DATA.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Year</label>
                                <select value={selectedYear} onChange={e => setSelectedYear(Number(e.target.value))} className="mt-1 w-full border-gray-300 rounded-md shadow-sm">
                                    <option value={1}>1st Year</option><option value={2}>2nd Year</option><option value={3}>3rd Year</option>
                                </select>
                            </div>
                         </>}
                         {isStaff && <button onClick={() => { setEditingSchedule(null); setShowScheduleForm(true);}} className="flex items-center justify-center h-10 px-4 bg-brand-primary text-white rounded-lg shadow-md hover:bg-brand-secondary"><Plus size={20} className="mr-2"/>Add Schedule</button>}
                    </div>
                </div>
                 <div className="bg-white rounded-xl shadow-md overflow-hidden"><table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50"><tr><th className="px-6 py-3">Date</th><th className="px-6 py-3">Subject</th><th className="px-6 py-3">Time</th><th className="px-6 py-3">Room</th>{isStaff && <th className="px-6 py-3">Actions</th>}</tr></thead>
                    <tbody>
                        {filteredSchedules.length > 0 ? filteredSchedules.map(s => (<tr key={s.id} className="bg-white border-b hover:bg-gray-50">
                            <td className="px-6 py-4 font-medium">{s.date}</td><td className="px-6 py-4">{s.subject}</td><td className="px-6 py-4">{s.time}</td><td className="px-6 py-4">{s.room}</td>
                            {isStaff && <td className="px-6 py-4 flex space-x-2"><button onClick={() => { setEditingSchedule(s); setShowScheduleForm(true); }} className="p-1 text-blue-600"><Edit size={16}/></button><button onClick={() => deleteExamSchedule(s.id)} className="p-1 text-red-600"><Trash2 size={16}/></button></td>}
                        </tr>)) : (<tr><td colSpan={isStaff ? 5 : 4} className="text-center p-6 text-gray-500">No schedule found.</td></tr>)}
                    </tbody>
                 </table></div>
                 {showScheduleForm && <ScheduleFormModal onClose={() => setShowScheduleForm(false)} onSubmit={handleScheduleFormSubmit} initialData={editingSchedule}/>}
            </div>
        );
    };

    const RegistrationsView = () => {
        const [regMessage, setRegMessage] = useState<{[key: string]: string}>({});
        const openForRegistration = exams.filter(e => e.status === 'Registration Open');

        const handleRegister = async (examId: string, studentId: string) => {
            const result = await registerForExam(examId, studentId);
            const message = result === 'success' ? 'Registered successfully!' : 'You are already registered.';
            setRegMessage(prev => ({...prev, [examId]: message}));
            setTimeout(() => setRegMessage(prev => ({...prev, [examId]: ''})), 3000);
        }

        if (isStudent && studentData) return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {openForRegistration.map(exam => {
                    const isRegistered = examRegistrations.some(r => r.examId === exam.id && r.studentId === studentData.id);
                    return (<div key={exam.id} className="bg-white p-6 rounded-xl shadow-md flex flex-col justify-between">
                        <div><h3 className="text-lg font-bold">{exam.name}</h3><p className="text-sm text-gray-500 mt-1">Deadline: {exam.registrationDeadline}</p></div>
                        <div className="mt-4">
                            {isRegistered ? <div className="flex items-center justify-center w-full px-4 py-2 bg-green-100 text-green-800 font-semibold rounded-lg"><CheckCircle size={16} className="mr-2"/> Registered</div>
                                : <button onClick={() => handleRegister(exam.id, studentData.id)} className="w-full px-4 py-2 bg-brand-primary text-white font-semibold rounded-lg hover:bg-brand-secondary">Register Now</button>}
                            {regMessage[exam.id] && <p className="text-xs text-center mt-2 text-green-600">{regMessage[exam.id]}</p>}
                        </div>
                    </div>)
                })}
                {openForRegistration.length === 0 && <p className="text-gray-500 col-span-full text-center p-6">No exams are currently open for registration.</p>}
            </div>
        )
        
        return (
            <div className="space-y-4">
                 {canManageExams && <div className="flex justify-end"><button onClick={() => setShowExamForm(true)} className="flex items-center px-4 py-2 bg-brand-primary text-white rounded-lg shadow-md hover:bg-brand-secondary"><Plus size={20} className="mr-2"/> Add New Exam</button></div>}
                <div className="bg-white rounded-xl shadow-md overflow-hidden"><table className="w-full text-sm">
                    <thead className="bg-gray-50 text-left"><tr><th className="p-4">Exam Name</th><th className="p-4">Status</th><th className="p-4">Registrations</th></tr></thead>
                    <tbody>{exams.map(exam => (<tr key={exam.id} className="border-t"><td className="p-4 font-medium">{exam.name}</td><td className="p-4">{exam.status}</td><td className="p-4">{examRegistrations.filter(r => r.examId === exam.id).length} Students</td></tr>))}</tbody>
                </table></div>
                {showExamForm && <ExamFormModal onClose={() => setShowExamForm(false)} onSubmit={(data) => {addExam(data); setShowExamForm(false);}}/>}
            </div>
        );
    };

    const ResultsView = () => {
        const completedExams = exams.filter(e => e.status === 'Completed' || e.status === 'Ongoing');
        const [selectedExamId, setSelectedExamId] = useState(completedExams[0]?.id || '');

        if (isStudent && studentData) { /* Student View */
            const studentResults = examResults.filter(r => r.studentId === studentData.id && r.examId === selectedExamId);
            const overall = useMemo(() => {
                if(studentResults.length === 0) return { total: 0, max: 0, percentage: 0, status: 'N/A'};
                const total = studentResults.reduce((sum, r) => sum + r.totalMarks, 0);
                const max = studentResults.length * 100;
                const percentage = (total / max) * 100;
                const status = studentResults.some(r => r.result === 'Fail') ? 'Fail' : 'Pass';
                return { total, max, percentage, status };
            }, [studentResults]);

            return (<div className="space-y-4">
                <div className="bg-white p-4 rounded-xl shadow-md"><label className="text-sm font-medium">Select Examination</label><select value={selectedExamId} onChange={e => setSelectedExamId(e.target.value)} className="mt-1 w-full md:w-1/2 border-gray-300 rounded-md shadow-sm"><option value="">Select Exam</option>{completedExams.map(exam => <option key={exam.id} value={exam.id}>{exam.name}</option>)}</select></div>
                {studentResults.length > 0 && selectedExamId ? (<div className="bg-white p-6 rounded-xl shadow-md"><h3 className="text-center text-xl font-bold">Statement of Marks</h3><div className="flex justify-between my-4 text-sm"><div><span className="font-semibold">Name:</span> {studentData.name}</div><div><span className="font-semibold">Student ID:</span> {studentData.studentId}</div></div><table className="w-full text-sm my-4"><thead className="bg-gray-100"><tr><th className="p-2 text-left">Subject</th><th className="p-2">Internal</th><th className="p-2">External</th><th className="p-2">Total</th><th className="p-2">Grade</th><th className="p-2">Result</th></tr></thead><tbody>{studentResults.map(r => (<tr key={r.id} className="border-b text-center"><td className="p-2 text-left">{r.subject}</td><td className="p-2">{r.internalMarks}</td><td className="p-2">{r.externalMarks}</td><td className="p-2 font-bold">{r.totalMarks}</td><td className="p-2">{r.grade}</td><td className="p-2"><span className={`font-semibold ${r.result === 'Pass' ? 'text-green-600' : 'text-red-600'}`}>{r.result}</span></td></tr>))}</tbody></table><div className="mt-6 p-4 bg-gray-50 rounded-lg flex justify-around font-semibold"><div>Total: {overall.total}/{overall.max}</div><div>Percentage: {overall.percentage.toFixed(2)}%</div><div>Overall: <span className={overall.status === 'Pass' ? 'text-green-600' : 'text-red-600'}>{overall.status}</span></div></div></div>)
                 : (<div className="bg-white p-6 rounded-xl shadow-md text-center text-gray-500">Results for the selected exam are not yet available.</div>)}
            </div>);
        }

        /* Staff View */
        const [selectedCourseId, setSelectedCourseId] = useState(COURSES_DATA[0].id);
        const [selectedYear, setSelectedYear] = useState(1);
        const filteredStudents = useMemo(() => students.filter(s => s.course === COURSES_DATA.find(c=>c.id === selectedCourseId)?.name && s.year === selectedYear), [students, selectedCourseId, selectedYear]);
        const selectedExam = exams.find(e => e.id === selectedExamId);

        return (<div className="space-y-4">
            <div className="bg-white p-4 rounded-xl shadow-md grid grid-cols-1 md:grid-cols-3 gap-4">
                <div><label className="text-sm font-medium">Examination</label><select value={selectedExamId} onChange={e => setSelectedExamId(e.target.value)} className="mt-1 w-full border-gray-300 rounded-md shadow-sm">{completedExams.map(exam => <option key={exam.id} value={exam.id}>{exam.name}</option>)}</select></div>
                <div><label className="text-sm font-medium">Course</label><select value={selectedCourseId} onChange={e => setSelectedCourseId(e.target.value)} className="mt-1 w-full border-gray-300 rounded-md shadow-sm">{COURSES_DATA.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                <div><label className="text-sm font-medium">Year</label><select value={selectedYear} onChange={e => setSelectedYear(Number(e.target.value))} className="mt-1 w-full border-gray-300 rounded-md shadow-sm"><option value={1}>1st Year</option><option value={2}>2nd Year</option><option value={3}>3rd Year</option></select></div>
            </div>
             <div className="bg-white rounded-xl shadow-md overflow-hidden"><table className="w-full text-sm">
                <thead className="bg-gray-50 text-left"><tr><th className="p-4">Student Name</th><th className="p-4">Student ID</th><th className="p-4">Result Status</th><th className="p-4">Actions</th></tr></thead>
                <tbody>{filteredStudents.map(student => {
                    const hasResults = examResults.some(r => r.studentId === student.id && r.examId === selectedExamId);
                    return (<tr key={student.id} className="border-t">
                        <td className="p-4 font-medium">{student.name}</td><td className="p-4">{student.studentId}</td>
                        <td className="p-4">{hasResults ? <span className="text-green-600">Entered</span> : <span className="text-yellow-600">Pending</span>}</td>
                        <td className="p-4"><button onClick={() => { setStudentForResults(student); setExamForResults(selectedExam || null); setShowResultsModal(true);}} className="text-sm font-medium text-brand-primary hover:underline">Enter/Edit Results</button></td>
                    </tr>)
                })}</tbody>
             </table></div>
             {showResultsModal && studentForResults && examForResults && <ResultsEntryModal student={studentForResults} exam={examForResults} onClose={() => setShowResultsModal(false)} />}
        </div>);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center"><h2 className="text-xl font-bold flex items-center"><ClipboardList className="mr-3 text-brand-secondary"/> Examination Controller</h2><div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-lg"><TabButton tabName="schedules" label="Schedules" /><TabButton tabName="registrations" label="Registrations" /><TabButton tabName="results" label="Results" /></div></div>
            <div>
                {activeTab === 'schedules' && <SchedulesView />}
                {activeTab === 'registrations' && <RegistrationsView />}
                {activeTab === 'results' && <ResultsView />}
            </div>
        </div>
    );
};

export default ExaminationsModule;