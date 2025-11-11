import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { StudentData, Faculty, Notification, LMSMaterial, TimeTableEntry, FeeRecord, Placement, HelpDeskTicket, User, AttendanceRecord, Exam, ExamSchedule, ExamResult, ExamRegistration, UserRole } from '../types';
import { STUDENTS_DATA, FACULTY_DATA, NOTIFICATIONS_DATA, LMS_DATA, TIMETABLE_DATA, FEES_DATA, PLACEMENTS_DATA, HELPDESK_TICKETS_DATA, DEMO_USERS, ATTENDANCE_DATA, EXAMS_DATA, EXAM_SCHEDULES_DATA, EXAM_RESULTS_DATA, EXAM_REGISTRATIONS_DATA } from '../constants';

interface DataContextType {
  students: StudentData[];
  faculty: Faculty[];
  notifications: Notification[];
  lmsMaterials: LMSMaterial[];
  timetable: TimeTableEntry[];
  fees: FeeRecord[];
  placements: Placement[];
  helpDeskTickets: HelpDeskTicket[];
  attendance: AttendanceRecord[];
  users: User[];
  exams: Exam[];
  examSchedules: ExamSchedule[];
  examResults: ExamResult[];
  examRegistrations: ExamRegistration[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  updateNotification: (notification: Notification) => void;
  deleteNotification: (id: string) => void;
  addStudent: (student: Omit<StudentData, 'id'>) => void;
  updateStudent: (student: StudentData) => void;
  deleteStudent: (id: string) => void;
  addLMSMaterial: (material: Omit<LMSMaterial, 'id'>) => void;
  updateLMSMaterial: (material: LMSMaterial) => void;
  deleteLMSMaterial: (id: string) => void;
  registerUser: (user: Omit<User, 'id' | 'status' | 'verificationToken'>) => string;
  verifyUser: (email: string, token: string) => Promise<'success' | 'invalid_token' | 'not_found'>;
  approveUser: (id: string) => void;
  rejectUser: (id: string) => void;
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (updatedUserData: Partial<User> & { id: string }) => void;
  deleteUser: (id: string) => void;
  registerForExam: (examId: string, studentId: string) => Promise<'success' | 'already_registered'>;
  addExam: (exam: Omit<Exam, 'id' | 'status'>) => void;
  updateUserPassword: (userId: string, currentPassword: string, newPassword: string) => Promise<boolean>;
  updateUserPhoto: (userId: string, photoUrl: string) => void;
  // New Functions
  updateAttendanceBatch: (updates: { studentId: string; subject: string; date: string; status: 'Present' | 'Absent' }[]) => void;
  addFaculty: (faculty: Omit<Faculty, 'id'>) => void;
  updateFaculty: (faculty: Faculty) => void;
  deleteFaculty: (id: string) => void;
  addPlacement: (placement: Omit<Placement, 'id'>) => void;
  updatePlacement: (placement: Placement) => void;
  deletePlacement: (id: string) => void;
  addHelpDeskTicket: (ticket: Omit<HelpDeskTicket, 'id' | 'studentName'>) => void;
  updateHelpDeskTicket: (ticket: HelpDeskTicket) => void;
  // Exam Management Functions
  addExamSchedule: (schedule: Omit<ExamSchedule, 'id'>) => void;
  updateExamSchedule: (schedule: ExamSchedule) => void;
  deleteExamSchedule: (id: string) => void;
  addOrUpdateExamResults: (results: Omit<ExamResult, 'id'>[]) => void;
}

const DATA_STORAGE_KEY = 'cms-data';

const DataContext = createContext<DataContextType | undefined>(undefined);

const loadInitialData = () => {
  try {
    const savedData = window.localStorage.getItem(DATA_STORAGE_KEY);
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      // Basic validation to ensure all keys exist
      if (parsedData.students && parsedData.faculty && parsedData.notifications && parsedData.lmsMaterials) {
        // Load new data structures if they don't exist in localStorage
        return {
          ...parsedData,
          timetable: parsedData.timetable || TIMETABLE_DATA,
          fees: parsedData.fees || FEES_DATA,
          placements: parsedData.placements || PLACEMENTS_DATA,
          helpDeskTickets: parsedData.helpDeskTickets || HELPDESK_TICKETS_DATA,
          attendance: parsedData.attendance || ATTENDANCE_DATA,
          users: parsedData.users || DEMO_USERS.map(u => ({ ...u, status: 'active' })),
          exams: parsedData.exams || EXAMS_DATA.map(e => ({...e, status: 'Upcoming'})), // Add default status
          examSchedules: parsedData.examSchedules || EXAM_SCHEDULES_DATA,
          examResults: parsedData.examResults || EXAM_RESULTS_DATA,
          examRegistrations: parsedData.examRegistrations || EXAM_REGISTRATIONS_DATA,
        };
      }
    }
  } catch (error) {
    console.error("Failed to load or parse data from localStorage", error);
  }
  // Return default data if nothing is saved, invalid, or parsing fails
  return {
    students: STUDENTS_DATA,
    faculty: FACULTY_DATA,
    notifications: NOTIFICATIONS_DATA,
    lmsMaterials: LMS_DATA,
    timetable: TIMETABLE_DATA,
    fees: FEES_DATA,
    placements: PLACEMENTS_DATA,
    helpDeskTickets: HELPDESK_TICKETS_DATA,
    attendance: ATTENDANCE_DATA,
    users: DEMO_USERS.map(u => ({ ...u, status: 'active' })),
    exams: EXAMS_DATA.map(e => ({...e, status: 'Upcoming'})), // Add default status
    examSchedules: EXAM_SCHEDULES_DATA,
    examResults: EXAM_RESULTS_DATA,
    examRegistrations: EXAM_REGISTRATIONS_DATA,
  };
};

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [initialData] = useState(loadInitialData);
  const [students, setStudents] = useState<StudentData[]>(initialData.students);
  const [faculty, setFaculty] = useState<Faculty[]>(initialData.faculty);
  const [notifications, setNotifications] = useState<Notification[]>(initialData.notifications);
  const [lmsMaterials, setLMSMaterials] = useState<LMSMaterial[]>(initialData.lmsMaterials);
  const [timetable, setTimetable] = useState<TimeTableEntry[]>(initialData.timetable);
  const [fees, setFees] = useState<FeeRecord[]>(initialData.fees);
  const [placements, setPlacements] = useState<Placement[]>(initialData.placements);
  const [helpDeskTickets, setHelpDeskTickets] = useState<HelpDeskTicket[]>(initialData.helpDeskTickets);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(initialData.attendance);
  const [users, setUsers] = useState<User[]>(initialData.users);
  const [exams, setExams] = useState<Exam[]>(initialData.exams);
  const [examSchedules, setExamSchedules] = useState<ExamSchedule[]>(initialData.examSchedules);
  const [examResults, setExamResults] = useState<ExamResult[]>(initialData.examResults);
  const [examRegistrations, setExamRegistrations] = useState<ExamRegistration[]>(initialData.examRegistrations);


  // Persist data to localStorage whenever it changes
  useEffect(() => {
    try {
      const dataToSave = JSON.stringify({ students, faculty, notifications, lmsMaterials, timetable, fees, placements, helpDeskTickets, users, attendance, exams, examSchedules, examResults, examRegistrations });
      window.localStorage.setItem(DATA_STORAGE_KEY, dataToSave);
    } catch (error) {
      console.error("Failed to save data to localStorage", error);
    }
  }, [students, faculty, notifications, lmsMaterials, timetable, fees, placements, helpDeskTickets, users, attendance, exams, examSchedules, examResults, examRegistrations]);

  // Effect to automatically update exam statuses based on current date
    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        setExams(prevExams =>
            prevExams.map(exam => {
                let newStatus: Exam['status'];
                if (today < exam.registrationDeadline) {
                    newStatus = 'Registration Open';
                } else if (today < exam.startDate) {
                    newStatus = 'Upcoming';
                } else if (today <= exam.endDate) {
                    newStatus = 'Ongoing';
                } else {
                    newStatus = 'Completed';
                }
                return { ...exam, status: newStatus };
            })
        );
    }, []); // Runs once on component mount


  // Notification CRUD
  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const newNotification: Notification = { ...notification, id: `N${Date.now()}` };
    setNotifications(prev => [newNotification, ...prev]);
  };
  const updateNotification = (updated: Notification) => {
    setNotifications(prev => prev.map(n => n.id === updated.id ? updated : n));
  };
  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Student CRUD
  const addStudent = (student: Omit<StudentData, 'id'>) => {
    const newStudent: StudentData = { ...student, id: `S${Date.now()}` };
    setStudents(prev => [newStudent, ...prev]);
  };
  const updateStudent = (updated: StudentData) => {
    setStudents(prev => prev.map(s => s.id === updated.id ? updated : s));
  };
  const deleteStudent = (id: string) => {
    setStudents(prev => prev.filter(s => s.id !== id));
  };
  
  // LMS CRUD
  const addLMSMaterial = (material: Omit<LMSMaterial, 'id'>) => {
    const newMaterial: LMSMaterial = { ...material, id: `LMS${Date.now()}` };
    setLMSMaterials(prev => [newMaterial, ...prev]);
  };
  const updateLMSMaterial = (updated: LMSMaterial) => {
    setLMSMaterials(prev => prev.map(m => m.id === updated.id ? updated : m));
  };
  const deleteLMSMaterial = (id: string) => {
    setLMSMaterials(prev => prev.filter(m => m.id !== id));
  };

  // User Management
    const registerUser = (userData: Omit<User, 'id' | 'status' | 'verificationToken'>): string => {
        const token = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit token
        const newUser: User = { 
            ...userData, 
            id: `U${Date.now()}`, 
            status: 'unverified',
            verificationToken: token,
        };
        setUsers(prev => [...prev, newUser]);
        return token;
    };

    const verifyUser = async (email: string, token: string): Promise<'success' | 'invalid_token' | 'not_found'> => {
        return new Promise(resolve => {
            setTimeout(() => {
                let userFound = false;
                let tokenMatch = false;
                
                const updatedUsers = users.map(u => {
                    if (u.email === email) {
                        userFound = true;
                        if (u.status === 'unverified' && u.verificationToken === token) {
                            tokenMatch = true;
                            // Create a new object without verificationToken
                            const { verificationToken, ...rest } = u;
                            return { ...rest, status: 'pending' as const };
                        }
                    }
                    return u;
                });
                
                if (!userFound) {
                    resolve('not_found');
                } else if (tokenMatch) {
                    setUsers(updatedUsers);
                    resolve('success');
                } else {
                    resolve('invalid_token');
                }
            }, 300);
        });
    };

    const approveUser = (id: string) => {
        setUsers(prev => prev.map(u => u.id === id ? { ...u, status: 'active' } : u));
    };

    const rejectUser = (id: string) => {
        setUsers(prev => prev.filter(u => u.id !== id));
    };
    
    const addUser = (userData: Omit<User, 'id'>) => {
        const newUser: User = { ...userData, id: `U${Date.now()}` };
        setUsers(prev => [...prev, newUser]);
    };
    
    const updateUser = (updatedUserData: Partial<User> & { id: string }) => {
        let originalUser: User | undefined;
        setUsers(prevUsers => {
            originalUser = prevUsers.find(u => u.id === updatedUserData.id);
            if (!originalUser) return prevUsers;
            
            return prevUsers.map(u => {
                if (u.id === updatedUserData.id) {
                    return { ...u, ...updatedUserData };
                }
                return u;
            });
        });
        
        if (originalUser) {
            const updatedUser = { ...originalUser, ...updatedUserData };
            if (updatedUser.role === UserRole.Student) {
                setStudents(prevStudents =>
                    prevStudents.map(s =>
                        s.email === originalUser!.email ? { ...s, name: updatedUser.name, phone: (updatedUserData as any).phone || s.phone } : s
                    )
                );
            } else if ([UserRole.Lecturer, UserRole.HOD, UserRole.Principal].includes(updatedUser.role)) {
                 setFaculty(prevFaculty =>
                    prevFaculty.map(f =>
                        f.name === originalUser!.name ? { 
                            ...f, 
                            name: updatedUser.name, 
                            department: (updatedUserData as any).department || f.department,
                            qualifications: (updatedUserData as any).qualifications || f.qualifications
                        } : f
                    )
                );
            }
        }
    };

    const deleteUser = (id: string) => {
        if (id === '1') { // Prevent deleting the main principal account
            alert("Cannot delete the default Principal account.");
            return;
        }
        setUsers(prev => prev.filter(u => u.id !== id));
    };
    
    const updateUserPassword = async (userId: string, currentPassword: string, newPassword: string): Promise<boolean> => {
        return new Promise(resolve => {
            setTimeout(() => { // Simulate API call
                const userIndex = users.findIndex(u => u.id === userId);
                if (userIndex > -1 && users[userIndex].password === currentPassword) {
                    const updatedUsers = [...users];
                    updatedUsers[userIndex] = { ...updatedUsers[userIndex], password: newPassword };
                    setUsers(updatedUsers);
                    resolve(true);
                } else {
                    resolve(false);
                }
            }, 300);
        });
    };

    const updateUserPhoto = (userId: string, photoUrl: string) => {
        const userToUpdate = users.find(u => u.id === userId);

        if (userToUpdate) {
            // Update users array
            setUsers(prevUsers =>
                prevUsers.map(u =>
                    u.id === userId ? { ...u, photoUrl } : u
                )
            );

            // Update students array if user is a student
            if (userToUpdate.role === UserRole.Student) {
                setStudents(prevStudents =>
                    prevStudents.map(s =>
                        s.email === userToUpdate.email ? { ...s, photoUrl } : s
                    )
                );
            }

            // Update faculty array if user is faculty/hod/principal
            else if ([UserRole.Lecturer, UserRole.HOD, UserRole.Principal].includes(userToUpdate.role)) {
                setFaculty(prevFaculty =>
                    prevFaculty.map(f =>
                        f.name === userToUpdate.name ? { ...f, photoUrl } : f
                    )
                );
            }
        }
    };

  // Exam Management
  const registerForExam = async (examId: string, studentId: string): Promise<'success' | 'already_registered'> => {
      return new Promise(resolve => {
         setTimeout(() => {
            const isAlreadyRegistered = examRegistrations.some(r => r.examId === examId && r.studentId === studentId);
            if (isAlreadyRegistered) {
                resolve('already_registered');
                return;
            }

            const newRegistration: ExamRegistration = {
                id: `EREG-${studentId}-${examId}`,
                examId,
                studentId,
                registrationDate: new Date().toISOString().split('T')[0],
            };
            setExamRegistrations(prev => [...prev, newRegistration]);
            resolve('success');
         }, 300);
      });
  };

  const addExam = (examData: Omit<Exam, 'id' | 'status'>) => {
    const newExam: Exam = {
        ...examData,
        id: `E${Date.now()}`,
        status: 'Upcoming', // Initial status, will be updated by effect
    };
    setExams(prev => [newExam, ...prev]);
  };
  
    const addExamSchedule = (schedule: Omit<ExamSchedule, 'id'>) => {
        const newSchedule: ExamSchedule = { ...schedule, id: `ES${Date.now()}` };
        setExamSchedules(prev => [...prev, newSchedule]);
    };
    
    const updateExamSchedule = (updated: ExamSchedule) => {
        setExamSchedules(prev => prev.map(s => s.id === updated.id ? updated : s));
    };

    const deleteExamSchedule = (id: string) => {
        setExamSchedules(prev => prev.filter(s => s.id !== id));
    };

    const addOrUpdateExamResults = (results: Omit<ExamResult, 'id'>[]) => {
        setExamResults(prev => {
            const updatedResults = [...prev];
            results.forEach(newResult => {
                 const id = `ER-${newResult.studentId}-${newResult.subject}-${newResult.examId}`;
                 const existingIndex = updatedResults.findIndex(r => r.id === id);
                 if (existingIndex > -1) {
                     updatedResults[existingIndex] = { ...updatedResults[existingIndex], ...newResult, id };
                 } else {
                     updatedResults.push({ ...newResult, id });
                 }
            });
            return updatedResults;
        });
    };

  // --- New Functions ---
    const updateAttendanceBatch = (updates: { studentId: string; subject: string; date: string; status: 'Present' | 'Absent' }[]) => {
        setAttendance(prev => {
            const updatedAttendance = [...prev];
            updates.forEach(update => {
                const recordId = `ATT-${update.studentId}-${update.date}-${update.subject.replace(/\s/g, '')}`;
                const existingIndex = updatedAttendance.findIndex(rec => rec.id === recordId);
                if (existingIndex > -1) {
                    updatedAttendance[existingIndex].status = update.status;
                } else {
                    updatedAttendance.push({ id: recordId, ...update });
                }
            });
            return updatedAttendance;
        });
    };
    
    const addFaculty = (facultyMember: Omit<Faculty, 'id'>) => {
        const newFaculty: Faculty = { ...facultyMember, id: `F${Date.now()}` };
        setFaculty(prev => [newFaculty, ...prev]);
    };
    const updateFaculty = (updated: Faculty) => {
        setFaculty(prev => prev.map(f => f.id === updated.id ? updated : f));
    };
    const deleteFaculty = (id: string) => {
        setFaculty(prev => prev.filter(f => f.id !== id));
    };
    
    const addPlacement = (placement: Omit<Placement, 'id'>) => {
        const newPlacement: Placement = { ...placement, id: `PLC${Date.now()}` };
        setPlacements(prev => [newPlacement, ...prev]);
    };
    const updatePlacement = (updated: Placement) => {
        setPlacements(prev => prev.map(p => p.id === updated.id ? updated : p));
    };
    const deletePlacement = (id: string) => {
        setPlacements(prev => prev.filter(p => p.id !== id));
    };

    const addHelpDeskTicket = (ticket: Omit<HelpDeskTicket, 'id' | 'studentName'>) => {
        const student = students.find(s => s.id === ticket.studentId);
        if (!student) return;
        const newTicket: HelpDeskTicket = { 
            ...ticket,
            id: `HDT${Date.now()}`,
            studentName: student.name,
        };
        setHelpDeskTickets(prev => [newTicket, ...prev]);
    };
    const updateHelpDeskTicket = (updated: HelpDeskTicket) => {
        setHelpDeskTickets(prev => prev.map(t => t.id === updated.id ? updated : t));
    };

  return (
    <DataContext.Provider value={{
      students,
      faculty,
      notifications,
      lmsMaterials,
      timetable,
      fees,
      placements,
      helpDeskTickets,
      attendance,
      users,
      exams,
      examSchedules,
      examResults,
      examRegistrations,
      addNotification,
      updateNotification,
      deleteNotification,
      addStudent,
      updateStudent,
      deleteStudent,
      addLMSMaterial,
      updateLMSMaterial,
      deleteLMSMaterial,
      registerUser,
      verifyUser,
      approveUser,
      rejectUser,
      addUser,
      updateUser,
      deleteUser,
      registerForExam,
      addExam,
      updateUserPassword,
      updateUserPhoto,
      updateAttendanceBatch,
      addFaculty,
      updateFaculty,
      deleteFaculty,
      addPlacement,
      updatePlacement,
      deletePlacement,
      addHelpDeskTicket,
      updateHelpDeskTicket,
      addExamSchedule,
      updateExamSchedule,
      deleteExamSchedule,
      addOrUpdateExamResults
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};