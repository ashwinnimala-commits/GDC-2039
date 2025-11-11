import React, { useMemo, useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { FeeRecord, UserRole } from '../../types';
import { ChevronDown, ChevronUp } from 'lucide-react';

const getStatusBadge = (status: 'Paid' | 'Pending' | 'Overdue') => {
    switch (status) {
        case 'Paid': return 'bg-green-100 text-green-800';
        case 'Pending': return 'bg-yellow-100 text-yellow-800';
        case 'Overdue': return 'bg-red-100 text-red-800';
    }
};

type SortableFeeRecord = FeeRecord & { studentName?: string };
const useSortableData = (items: SortableFeeRecord[], config: { key: keyof SortableFeeRecord, direction: 'ascending' | 'descending' } = { key: 'dueDate', direction: 'descending' }) => {
    const [sortConfig, setSortConfig] = useState<{key: keyof SortableFeeRecord, direction: 'ascending' | 'descending'} | null>(config);

    const sortedItems = useMemo(() => {
        let sortableItems = [...items];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key]! < b[sortConfig.key]!) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key]! > b[sortConfig.key]!) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [items, sortConfig]);

    const requestSort = (key: keyof SortableFeeRecord) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    return { items: sortedItems, requestSort, sortConfig };
};

const FeesModule: React.FC = () => {
    const { fees, students } = useData();
    const { user } = useAuth();

    const isStudent = user?.role === UserRole.Student;
    
    const studentData = isStudent ? students.find(s => s.email === user.email) : null;
    
    const feeRecords = useMemo(() => {
        const records = isStudent && studentData 
            ? fees.filter(f => f.studentId === studentData.id)
            : fees;
        
        return records.map(record => ({
            ...record,
            studentName: students.find(s => s.id === record.studentId)?.name || 'Unknown Student'
        }));
    }, [fees, students, isStudent, studentData]);
    
    const { items: sortedFeeRecords, requestSort, sortConfig } = useSortableData(feeRecords);

    const getSortIcon = (key: keyof SortableFeeRecord) => {
        if (!sortConfig || sortConfig.key !== key) return null;
        return sortConfig.direction === 'ascending' ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800">{isStudent ? "My Fee Details" : "Fee Management"}</h2>
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                {!isStudent && <th className="px-6 py-3"><button onClick={() => requestSort('studentName')} className="flex items-center gap-1">Student Name {getSortIcon('studentName')}</button></th>}
                                <th className="px-6 py-3"><button onClick={() => requestSort('type')} className="flex items-center gap-1">Fee Type {getSortIcon('type')}</button></th>
                                <th className="px-6 py-3"><button onClick={() => requestSort('amount')} className="flex items-center gap-1">Amount (INR) {getSortIcon('amount')}</button></th>
                                <th className="px-6 py-3"><button onClick={() => requestSort('dueDate')} className="flex items-center gap-1">Due Date {getSortIcon('dueDate')}</button></th>
                                <th className="px-6 py-3"><button onClick={() => requestSort('status')} className="flex items-center gap-1">Status {getSortIcon('status')}</button></th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedFeeRecords.map(record => (
                                <tr key={record.id} className="bg-white border-b hover:bg-gray-50">
                                    {!isStudent && <td className="px-6 py-4 font-medium text-gray-900">{record.studentName}</td>}
                                    <td className="px-6 py-4">{record.type}</td>
                                    <td className="px-6 py-4 font-mono">₹{record.amount.toLocaleString()}</td>
                                    <td className="px-6 py-4">{record.dueDate}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(record.status)}`}>
                                            {record.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {feeRecords.length === 0 && <p className="p-6 text-center text-gray-500">No fee records found.</p>}
                </div>
            </div>
        </div>
    );
};

export default FeesModule;