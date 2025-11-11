import { User, UserRole, StudentData, Faculty, Notification, Course, TimeTableEntry, LMSMaterial, FeeRecord, Placement, HelpDeskTicket, AttendanceRecord, Exam, ExamSchedule, ExamResult, ExamRegistration } from './types';

export const DEMO_USERS: User[] = [
  { id: '1', name: 'Dr. Chandana N', email: 'principal@kgc.edu', password: 'Chandana@123', role: UserRole.Principal, photoUrl: `https://i.pravatar.cc/150?u=1` },
  { id: '2', name: 'Admin Staff', email: 'admin@kgc.edu', password: 'admin123', role: UserRole.Admin, photoUrl: `https://i.pravatar.cc/150?u=2` },
  { id: '3', name: 'Dr. Sharma (HOD)', email: 'hod.cs@kgc.edu', password: 'hod123', role: UserRole.HOD, photoUrl: `https://i.pravatar.cc/150?u=3` },
  { id: '4', name: 'Prof. Anjali Verma', email: 'anjali.v@kgc.edu', password: 'faculty123', role: UserRole.Lecturer, photoUrl: `https://i.pravatar.cc/150?u=4` },
  { id: '5', name: 'Ravi Kumar', email: 'ravi.k@student.kgc.edu', password: 'student123', role: UserRole.Student, photoUrl: `https://i.pravatar.cc/150?u=5` },
];

export const COURSES_DATA: Course[] = [
    {id: 'C1', name: 'B.Sc. (MPCs)', degree: 'B.Sc.', subjects: ['Maths', 'Physics', 'Computer Science', 'English', 'Telugu']},
    {id: 'C2', name: 'B.Com. (General)', degree: 'B.Com.', subjects: ['Financial Accounting', 'Business Organization', 'Economics', 'Taxation', 'Advanced Accounting']},
    {id: 'C3', name: 'B.A. (H.E.P)', degree: 'B.A.', subjects: ['History', 'Economics', 'Political Science', 'Sociology', 'English']},
    {id: 'C4', name: 'B.Sc. (MECs)', degree: 'B.Sc.', subjects: ['Maths', 'Electronics', 'Computer Science', 'Digital Electronics', 'English']},
    {id: 'C5', name: 'B.Com. (Computer Applications)', degree: 'B.Com.', subjects: ['Financial Accounting', 'Programming with C++', 'DBMS', 'Web Technologies', 'Auditing']},
    {id: 'C6', name: 'B.A. (E.P.P)', degree: 'B.A.', subjects: ['Economics', 'Public Administration', 'Political Science', 'International Relations', 'English']},
];

const studentNames = [
    'Ravi Kumar', 'Priya Sharma', 'Amit Singh', 'Sneha Patel', 'Vijay Reddy', 'Anusha Rao', 'Sandeep Gupta', 'Kavita Mishra', 
    'Rajesh Chowdary', 'Sunita Patil', 'Manoj Kumar', 'Deepa Iyer', 'Arun Kumar', 'Latha Devi', 'Suresh Babu', 'Geetha Nair', 
    'Prakash Rao', 'Swathi Reddy', 'Kiran Kumar', 'Meena Kumari', 'Vikas Singh', 'Sarita Sharma', 'Ganesh Kumar', 'Rekha Patel', 'Anil Kumar',
    'Aarav Sharma', 'Aditi Verma', 'Arjun Reddy', 'Diya Singh', 'Ishaan Gupta', 'Kavya Nair', 'Mohammed Ali', 'Neha Patil',
    'Rohan Mehta', 'Saanvi Iyer', 'Samir Khan', 'Shreya Chowdary', 'Tanvi Reddy', 'Varun Kumar', 'Zara Begum', 'Rakesh Yadav',
    'Pooja Jain', 'Harish Kumar', 'Divya Sri', 'Mahesh Babu', 'Lakshmi Priya', 'Sai Charan', 'Anjali Devi', 'Krishna Vamsi', 'Chaitanya Reddy', 'Sathvik Varma',
    'Zoya Akhtar', 'Kabir Mehra', 'Natasha Singh', 'Farhan Ali'
];

export const STUDENTS_DATA: StudentData[] = Array.from({ length: 50 }, (_, i) => {
    const name = studentNames[i];
    const firstName = name.split(' ')[0].toLowerCase();
    const course = COURSES_DATA[i % COURSES_DATA.length];
    return {
        id: `S${101 + i}`,
        name: name,
        rollNumber: `23-KGC-${1001 + i}`,
        studentId: `KGC${2023001 + i}`,
        email: `${firstName}.${1001 + i}@student.kgc.edu`,
        phone: `987654${1000 + i}`,
        course: course.name,
        year: (i % 3) + 1,
        attendance: 75 + (i % 20),
        photoUrl: `https://i.pravatar.cc/150?u=S${101 + i}`,
    };
});

export const FACULTY_DATA: Faculty[] = [
    'Dr. Anjali Verma', 'Prof. Suresh Kumar', 'Dr. Meena Iyer', 'Prof. Rajesh Singh', 'Dr. Kavitha Rao', 'Prof. Arun Reddy', 
    'Dr. Sunita Sharma', 'Prof. Manoj Gupta', 'Dr. Geetha Patil', 'Prof. Vikas Mishra', 'Dr. Priya Chowdary', 'Prof. Sandeep Nair', 
    'Dr. Latha Babu', 'Prof. Kiran Devi', 'Dr. Swathi Kumar', 'Prof. Prakash Singh', 'Dr. Meena Kumari', 'Prof. Anil Rao', 
    'Dr. Sarita Reddy', 'Prof. Ganesh Kumar', 'Dr. S. N. Murthy', 'Prof. Vani Lakshmi', 'Dr. T. Prakash', 'Prof. Hema Malini', 'Dr. Krishna Mohan'
].map((name, i) => {
    const departments = ['Computer Science', 'Commerce', 'History', 'Physics', 'Chemistry', 'English', 'Telugu', 'Maths', 'Electronics', 'Political Science'];
    return {
        id: `F${201 + i}`,
        name,
        department: departments[i % departments.length],
        designation: (i % 4 === 0) ? 'Professor & HOD' : (i % 3 === 0) ? 'Professor' : (i % 3 === 1 ? 'Associate Professor' : 'Assistant Professor'),
        qualifications: 'Ph.D., M.Sc.',
        photoUrl: `https://i.pravatar.cc/150?u=faculty${i}`,
    };
});

export const NOTIFICATIONS_DATA: Notification[] = [
    { id: 'N01', title: 'Internal Exams Schedule', content: 'Internal exams for all semesters will be conducted from 15th December.', date: '2023-11-20', author: 'Examinations Branch' },
    { id: 'N02', title: 'Holiday Declaration', content: 'The college will remain closed on 25th December for Christmas.', date: '2023-11-18', author: 'Principal Office' },
    { id: 'N03', title: 'Sports Day Event', content: 'Annual Sports Day will be held on 5th January. All students are encouraged to participate.', date: '2023-11-15', author: 'Admin Department' },
    { id: 'N04', title: 'Fee Payment Deadline', content: 'The last date for fee payment for the current semester is 30th November.', date: '2023-11-10', author: 'Accounts Department' },
    { id: 'N05', title: 'Library Books Return', content: 'All students must return their library books before 10th December.', date: '2023-11-05', author: 'Library' },
    { id: 'N06', title: 'Guest Lecture on AI', content: 'A guest lecture on "The Future of Artificial Intelligence" is scheduled for Dec 2nd.', date: '2023-11-22', author: 'Dept. of Computer Science' },
    { id: 'N07', title: 'NSS Camp Registration', content: 'Registrations for the upcoming NSS camp are now open.', date: '2023-11-21', author: 'NSS Coordinator' },
     ...Array.from({ length: 13 }, (_, i) => ({
        id: `N${String(i + 8).padStart(2, '0')}`,
        title: `Sample Notification ${i+8}`,
        content: `This is the content for sample notification number ${i+8}.`,
        date: `2023-10-${20-i}`,
        author: 'Admin Department'
    })),
];

// --- Expanded Timetable Data ---
const facultyByDept = FACULTY_DATA.reduce((acc, f) => {
    if (!acc[f.department]) acc[f.department] = [];
    acc[f.department].push(f.name);
    return acc;
}, {} as Record<string, string[]>);

const getFaculty = (dept: string) => facultyByDept[dept]?.[0] || 'N/A';

const createTimetableFor = (courseId: string, year: number, subjects: string[], rooms: string[]): TimeTableEntry[] => {
    const days: TimeTableEntry['day'][] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const times = ['09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00', '13:00 - 14:00'];
    let entries: TimeTableEntry[] = [];
    let idCounter = (COURSES_DATA.findIndex(c => c.id === courseId) + 1) * 1000 + year * 100;

    days.forEach(day => {
        times.forEach((time, timeIndex) => {
            const subject = subjects[(days.indexOf(day) + timeIndex) % subjects.length];
            let facultyName = 'N/A';
            if (subject.includes('Computer') || subject.includes('Web')) facultyName = getFaculty('Computer Science');
            else if (subject.includes('Maths')) facultyName = getFaculty('Maths');
            else if (subject.includes('Physics')) facultyName = getFaculty('Physics');
            else if (subject.includes('Account') || subject.includes('Tax') || subject.includes('Commerce')) facultyName = getFaculty('Commerce');
            else if (subject.includes('History')) facultyName = getFaculty('History');
            else facultyName = getFaculty('English');

            entries.push({
                id: `T${idCounter++}`,
                day,
                time,
                subject,
                faculty: facultyName,
                room: rooms[timeIndex % rooms.length],
                courseId,
                year,
            });
        });
    });
    return entries;
};

export const TIMETABLE_DATA: TimeTableEntry[] = [
    ...createTimetableFor('C1', 1, COURSES_DATA[0].subjects, ['101', '102', 'Lab 1', '103']), // B.Sc MPCs - Y1
    ...createTimetableFor('C1', 2, COURSES_DATA[0].subjects, ['101', '102', 'Lab 1', '103']), // B.Sc MPCs - Y2
    ...createTimetableFor('C1', 3, COURSES_DATA[0].subjects, ['101', '102', 'Lab 1', '103']), // B.Sc MPCs - Y3
    ...createTimetableFor('C2', 1, COURSES_DATA[1].subjects, ['201', '202', '203', '204']), // B.Com Gen - Y1
    ...createTimetableFor('C2', 2, COURSES_DATA[1].subjects, ['201', '202', '203', '204']), // B.Com Gen - Y2
    ...createTimetableFor('C2', 3, COURSES_DATA[1].subjects, ['201', '202', '203', '204']), // B.Com Gen - Y3
    ...createTimetableFor('C3', 1, COURSES_DATA[2].subjects, ['301', '302', '303', '304']), // B.A HEP - Y1
    ...createTimetableFor('C3', 2, COURSES_DATA[2].subjects, ['301', '302', '303', '304']), // B.A HEP - Y2
    ...createTimetableFor('C3', 3, COURSES_DATA[2].subjects, ['301', '302', '303', '304']), // B.A HEP - Y3
    ...createTimetableFor('C4', 1, COURSES_DATA[3].subjects, ['104', '105', 'Lab 2', '106']),
    ...createTimetableFor('C5', 2, COURSES_DATA[4].subjects, ['205', 'Lab 3', '206', '207']),
    ...createTimetableFor('C6', 3, COURSES_DATA[5].subjects, ['305', '306', '307', '308']),
];

export const LMS_DATA: LMSMaterial[] = Array.from({ length: 25 }, (_, i) => {
    const course = COURSES_DATA[i % COURSES_DATA.length];
    const faculty = FACULTY_DATA[i % FACULTY_DATA.length];
    const subject = course.subjects[i % course.subjects.length];
    const fileType = (['PDF', 'DOCX', 'PPT', 'ZIP'] as const)[i % 4];
    
    return {
        id: `LMS${101 + i}`,
        title: `${subject} - Unit ${i % 5 + 1} Notes`,
        description: `Important notes and questions for Unit ${i % 5 + 1} of ${subject}.`,
        course: course.name,
        subject: subject,
        fileName: `${subject.replace(/\s/g, '_')}_Unit_${i % 5 + 1}.${fileType.toLowerCase()}`,
        fileType: fileType,
        uploadDate: `2023-11-${15 - (i%15)}`,
        uploadedBy: faculty.name,
    };
});

export const FEES_DATA: FeeRecord[] = STUDENTS_DATA.flatMap((student, i) => {
    const records: FeeRecord[] = [];
    const feeTypes: FeeRecord['type'][] = ['Tuition Fee', 'Exam Fee', 'Special Fee'];
    const amounts = { 'Tuition Fee': 1250, 'Exam Fee': 500, 'Special Fee': 250 };

    records.push({
        id: `FEE${1001 + i}-1`,
        studentId: student.id,
        amount: amounts['Tuition Fee'],
        type: 'Tuition Fee',
        dueDate: '2023-11-30',
        status: (i % 4 === 0) ? 'Pending' : 'Paid',
    });
    
    if (i % 2 === 0) {
         records.push({
            id: `FEE${1001 + i}-2`,
            studentId: student.id,
            amount: amounts['Exam Fee'],
            type: 'Exam Fee',
            dueDate: '2023-10-15',
            status: (i % 5 === 0) ? 'Overdue' : 'Paid',
        });
    }
    
     if (i % 7 === 0) {
         records.push({
            id: `FEE${1001 + i}-3`,
            studentId: student.id,
            amount: amounts['Special Fee'],
            type: 'Special Fee',
            dueDate: '2023-12-10',
            status: 'Pending',
        });
    }
    return records;
});


export const PLACEMENTS_DATA: Placement[] = STUDENTS_DATA.filter(s => s.year === 3)
    .slice(0, 15) // Increased number of placements
    .map((student, i) => {
    const companies = ['TCS', 'Infosys', 'Wipro', 'Deloitte', 'Accenture', 'Capgemini', 'HCL Tech', 'Cognizant'];
    return {
        id: `PLC${101 + i}`,
        studentId: student.id,
        studentName: student.name,
        company: companies[i % companies.length],
        package: parseFloat((4.5 + (i % 8) * 0.25).toFixed(2)),
        date: `2024-03-${10 + i}`
    }
});

export const HELPDESK_TICKETS_DATA: HelpDeskTicket[] = STUDENTS_DATA.filter((s, i) => i % 3 === 0)
    .slice(0, 15) // Increased number of tickets
    .map((student, i) => {
    const subjects = ['Fee Payment Issue', 'Library Book Not Found', 'ID Card Lost', 'Exam Result Discrepancy', 'LMS Login Problem', 'Bonafide Certificate Request', 'Timetable Clarification'];
    const statuses: HelpDeskTicket['status'][] = ['Open', 'In Progress', 'Closed'];
    return {
        id: `HDT${101 + i}`,
        studentId: student.id,
        studentName: student.name,
        subject: subjects[i % subjects.length],
        description: `This is a sample description for the ticket regarding ${subjects[i % subjects.length].toLowerCase()}. Student ID: ${student.studentId}.`,
        status: statuses[i % statuses.length],
        date: `2023-11-${10 + i}`,
    };
});

export const ATTENDANCE_DATA: AttendanceRecord[] = STUDENTS_DATA.flatMap(student => {
    const course = COURSES_DATA.find(c => c.name === student.course);
    if (!course) return [];

    const records: AttendanceRecord[] = [];
    const subjects = course.subjects.slice(0, 3); // Take first 3 subjects for demo
    const dates = ['2023-11-20', '2023-11-21', '2023-11-22', '2023-11-23', '2023-11-24'];

    dates.forEach(date => {
        subjects.forEach(subject => {
            records.push({
                id: `ATT-${student.id}-${date}-${subject.replace(/\s/g, '')}`,
                studentId: student.id,
                date,
                subject,
                status: Math.random() > 0.15 ? 'Present' : 'Absent' // 85% present rate
            });
        });
    });

    return records;
});

const today = new Date();
const formatDate = (date: Date) => date.toISOString().split('T')[0];

export const EXAMS_DATA: Omit<Exam, 'status'>[] = [
    // A completed exam from last semester
    { id: 'E1', name: 'Semester I Main Examinations', startDate: '2024-05-20', endDate: '2024-05-28', registrationDeadline: '2024-04-25' },
    // An exam that is currently open for registration
    { id: 'E2', name: 'Internal Assessment I - Sem 2', 
      registrationDeadline: formatDate(new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000)), // 10 days from now
      startDate: formatDate(new Date(today.getTime() + 20 * 24 * 60 * 60 * 1000)), // 20 days from now
      endDate: formatDate(new Date(today.getTime() + 23 * 24 * 60 * 60 * 1000)) // 23 days from now
    },
    // An upcoming exam where registration has closed
    { id: 'E3', name: 'Internal Assessment II - Sem 2', 
      registrationDeadline: formatDate(new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000)), // 5 days ago
      startDate: formatDate(new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000)), // 5 days from now
      endDate: formatDate(new Date(today.getTime() + 8 * 24 * 60 * 60 * 1000)) // 8 days from now
    },
    // An ongoing exam
    { id: 'E4', name: 'Practical Examinations', 
      registrationDeadline: formatDate(new Date(today.getTime() - 20 * 24 * 60 * 60 * 1000)), // 20 days ago
      startDate: formatDate(new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000)), // 2 days ago
      endDate: formatDate(new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000)) // 2 days from now
    },
];


export const EXAM_SCHEDULES_DATA: ExamSchedule[] = [
    // B.Sc. (MPCs) - Y1 - Internal Assessment I
    { id: 'ES1', examId: 'E1', courseId: 'C1', year: 1, subject: 'Maths', date: '2024-05-20', time: '10:00 - 11:00', room: '101' },
    { id: 'ES2', examId: 'E1', courseId: 'C1', year: 1, subject: 'Physics', date: '2024-05-21', time: '10:00 - 11:00', room: '102' },
    { id: 'ES3', examId: 'E1', courseId: 'C1', year: 1, subject: 'Computer Science', date: '2024-05-22', time: '10:00 - 11:00', room: 'Lab 1' },
    // B.Com (General) - Y1 - Internal Assessment I
    { id: 'ES4', examId: 'E1', courseId: 'C2', year: 1, subject: 'Financial Accounting', date: '2024-05-20', time: '10:00 - 11:00', room: '201' },
    { id: 'ES5', examId: 'E1', courseId: 'C2', year: 1, subject: 'Business Organization', date: '2024-05-21', time: '10:00 - 11:00', room: '202' },
    // A few schedules for the new exams
    { id: 'ES6', examId: 'E2', courseId: 'C1', year: 2, subject: 'Maths', date: EXAMS_DATA[1].startDate, time: '10:00 - 11:00', room: '101' },
    { id: 'ES7', examId: 'E2', courseId: 'C1', year: 2, subject: 'Physics', date: formatDate(new Date(new Date(EXAMS_DATA[1].startDate).getTime() + 1 * 24 * 60 * 60 * 1000)), time: '10:00 - 11:00', room: '102' },
    { id: 'ES8', examId: 'E4', courseId: 'C1', year: 3, subject: 'Computer Science', date: formatDate(today), time: '10:00 - 13:00', room: 'Lab 3' },
];

export const EXAM_RESULTS_DATA: ExamResult[] = STUDENTS_DATA.slice(0, 10).flatMap((student, i) => {
    const course = COURSES_DATA.find(c => c.name === student.course);
    if (!course) return [];
    return course.subjects.slice(0, 3).map((subject, j) => {
        const internalMarks = 15 + (i % 10);
        // FIX: The original calculation resulted in all students passing.
        // This new calculation creates a wider range of marks for more realistic data.
        const externalMarks = 25 + (i * 5) - (j * 10);
        const totalMarks = internalMarks + externalMarks;
        // FIX: The original grading logic did not account for a failing grade ('F'),
        // which caused a type error in the `result` calculation. This has been updated
        // to include 'F' for marks below 40.
        const grade = totalMarks > 80 ? 'A' : totalMarks > 60 ? 'B' : totalMarks > 50 ? 'C' : totalMarks >= 40 ? 'D' : 'F';
        return {
            id: `ER-${student.id}-${subject}`,
            examId: 'E1',
            studentId: student.id,
            subject,
            internalMarks,
            externalMarks,
            totalMarks,
            grade,
            result: grade === 'F' ? 'Fail' : 'Pass',
        };
    });
});

export const EXAM_REGISTRATIONS_DATA: ExamRegistration[] = STUDENTS_DATA.slice(0, 20).map((student) => ({
    id: `EREG-${student.id}-E1`,
    examId: 'E1', // Registered for the completed exam
    studentId: student.id,
    registrationDate: '2024-04-20',
}));