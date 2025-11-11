
export enum UserRole {
  Principal = 'Principal',
  Admin = 'Admin',
  HOD = 'HOD',
  Lecturer = 'Lecturer',
  Student = 'Student',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  photoUrl?: string;
  password?: string; // Only for demo data
  status?: 'active' | 'pending' | 'unverified';
  verificationToken?: string;
}

export interface StudentData {
  id: string;
  name:string;
  rollNumber: string;
  studentId: string;
  email: string;
  phone: string;
  course: string;
  year: number;
  attendance: number;
  photoUrl?: string;
}

export interface Faculty {
  id: string;
  name: string;
  department: string;
  designation: string;
  qualifications: string;
  photoUrl: string;
}

export interface Notification {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
}

export interface Course {
  id: string;
  name: string;
  degree: 'B.A.' | 'B.Sc.' | 'B.Com.';
  subjects: string[];
}

export interface TimeTableEntry {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  time: string;
  subject: string;
  faculty: string;
  room: string;
  courseId: string;
  year: number;
}

export interface LMSMaterial {
  id: string;
  title: string;
  description: string;
  course: string;
  subject: string;
  fileName: string;
  fileType: 'PDF' | 'DOCX' | 'PPT' | 'ZIP';
  uploadDate: string;
  uploadedBy: string;
}

export interface FeeRecord {
    id: string;
    studentId: string;
    amount: number;
    dueDate: string;
    status: 'Paid' | 'Pending' | 'Overdue';
    type: 'Tuition Fee' | 'Exam Fee' | 'Special Fee';
}

export interface Placement {
    id: string;
    studentId: string;
    studentName: string;
    company: string;
    package: number; // in Lakhs Per Annum (LPA)
    date: string;
}

export interface HelpDeskTicket {
    id: string;
    studentId: string;
    studentName: string;
    subject: string;
    description: string;
    status: 'Open' | 'In Progress' | 'Closed';
    date: string;
}

export interface AttendanceRecord {
    id: string;
    studentId: string;
    date: string; // YYYY-MM-DD
    subject: string;
    status: 'Present' | 'Absent';
}

export interface Exam {
    id: string;
    name: string;
    startDate: string; // YYYY-MM-DD
    endDate: string; // YYYY-MM-DD
    registrationDeadline: string; // YYYY-MM-DD
    status: 'Upcoming' | 'Registration Open' | 'Ongoing' | 'Completed';
}

export interface ExamSchedule {
    id: string;
    examId: string;
    courseId: string;
    year: number;
    subject: string;
    date: string; // YYYY-MM-DD
    time: string; // HH:MM - HH:MM
    room: string;
}

export interface ExamResult {
    id: string;
    examId: string;
    studentId: string;
    subject: string;
    internalMarks: number;
    externalMarks: number;
    totalMarks: number;
    grade: 'A' | 'B' | 'C' | 'D' | 'F';
    result: 'Pass' | 'Fail';
}

export interface ExamRegistration {
    id: string;
    examId: string;
    studentId: string;
    registrationDate: string; // YYYY-MM-DD
}