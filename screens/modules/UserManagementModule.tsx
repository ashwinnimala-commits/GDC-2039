
import React, { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { User, UserRole } from '../../types';
import { Check, X as IconX, Trash2, Plus, UserPlus } from 'lucide-react';

const UserFormModal: React.FC<{
    onClose: () => void;
    onSubmit: (user: Omit<User, 'id'>) => void;
}> = ({ onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: UserRole.Student,
        status: 'active' as 'active' | 'pending',
    });
     const { users } = useData();
     const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (users.some(u => u.email === formData.email)) {
            setError('An account with this email already exists.');
            return;
        }
        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg m-4">
                <div className="p-4 border-b flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Add New User</h3>
                    <button onClick={onClose}><IconX size={20} /></button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="mt-1 w-full border-gray-300 rounded-md shadow-sm"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="mt-1 w-full border-gray-300 rounded-md shadow-sm"/>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-gray-700">Temporary Password</label>
                            <input type="password" name="password" value={formData.password} onChange={handleChange} required className="mt-1 w-full border-gray-300 rounded-md shadow-sm"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Role</label>
                            <select name="role" value={formData.role} onChange={handleChange} className="mt-1 w-full border-gray-300 rounded-md shadow-sm">
                                {Object.values(UserRole).map(role => <option key={role} value={role}>{role}</option>)}
                            </select>
                        </div>
                        {error && <p className="text-sm text-red-600">{error}</p>}
                    </div>
                    <div className="p-4 bg-gray-50 border-t flex justify-end space-x-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-secondary">Add User</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const UserManagementModule: React.FC = () => {
  const { users, approveUser, rejectUser, deleteUser, addUser } = useData();
  const [showModal, setShowModal] = useState(false);

  const pendingUsers = users.filter(u => u.status === 'pending');
  const activeUsers = users.filter(u => u.status === 'active');

  const handleAddUser = (userData: Omit<User, 'id'>) => {
    addUser(userData);
    setShowModal(false);
  };
  
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Pending Registrations ({pendingUsers.length})</h2>
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {pendingUsers.length > 0 ? (
             <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th className="px-6 py-3">Name</th>
                            <th className="px-6 py-3">Email</th>
                            <th className="px-6 py-3">Role</th>
                            <th className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pendingUsers.map(user => (
                            <tr key={user.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                                <td className="px-6 py-4">{user.email}</td>
                                <td className="px-6 py-4">{user.role}</td>
                                <td className="px-6 py-4 flex items-center space-x-2">
                                    <button onClick={() => approveUser(user.id)} className="p-2 text-green-500 hover:bg-green-100 rounded-full"><Check size={18}/></button>
                                    <button onClick={() => rejectUser(user.id)} className="p-2 text-red-500 hover:bg-red-100 rounded-full"><IconX size={18}/></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
          ) : (
            <p className="p-6 text-center text-gray-500">No pending registrations.</p>
          )}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
             <h2 className="text-xl font-bold text-gray-800">Manage Active Users ({activeUsers.length})</h2>
             <button onClick={() => setShowModal(true)} className="flex items-center px-4 py-2 bg-brand-primary text-white rounded-lg shadow-md hover:bg-brand-secondary">
                <UserPlus size={20} className="mr-2"/> Add User
            </button>
        </div>
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
             <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500">
                     <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th className="px-6 py-3">Name</th>
                            <th className="px-6 py-3">Email</th>
                            <th className="px-6 py-3">Role</th>
                            <th className="px-6 py-3">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {activeUsers.map(user => (
                             <tr key={user.id} className="bg-white border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                                <td className="px-6 py-4">{user.email}</td>
                                <td className="px-6 py-4">{user.role}</td>
                                <td className="px-6 py-4">
                                    <button onClick={() => deleteUser(user.id)} className="p-2 text-red-500 hover:bg-red-100 rounded-full disabled:opacity-50 disabled:cursor-not-allowed" disabled={user.id === '1'}>
                                        <Trash2 size={18}/>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
             </div>
        </div>
      </div>
      
      {showModal && (
        <UserFormModal
            onClose={() => setShowModal(false)}
            onSubmit={handleAddUser}
        />
      )}
    </div>
  );
};

export default UserManagementModule;
