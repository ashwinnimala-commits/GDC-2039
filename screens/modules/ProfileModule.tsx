import React, { useState, useRef, useMemo, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { User, UserRole } from '../../types';
import { KeyRound, Mail, Shield, Camera, User as UserIcon, Edit, Save, X as XIcon } from 'lucide-react';

interface InfoRowProps {
    label: string;
    value: string;
    isEditing: boolean;
    name: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value, isEditing, name, onChange }) => (
    <div className="grid grid-cols-3 gap-4 items-center py-2 border-b border-gray-100">
        <dt className="text-sm font-medium text-gray-500">{label}</dt>
        <dd className="mt-1 text-sm text-gray-900 col-span-2">
            {isEditing ? (
                <input
                    type="text"
                    name={name}
                    value={value}
                    onChange={onChange}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            ) : (
                <span>{value || '-'}</span>
            )}
        </dd>
    </div>
);


const ProfileModule: React.FC = () => {
    const { user, updateCurrentUser } = useAuth();
    const { updateUserPassword, updateUserPhoto, updateUser, students, faculty } = useData();
    
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [loading, setLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isEditingInfo, setIsEditingInfo] = useState(false);

    const studentData = useMemo(() => {
        if (user?.role === UserRole.Student) {
            return students.find(s => s.email === user.email);
        }
        return null;
    }, [user, students]);

    const facultyData = useMemo(() => {
        if (user && [UserRole.Lecturer, UserRole.HOD, UserRole.Principal].includes(user.role)) {
            return faculty.find(f => f.name === user.name);
        }
        return null;
    }, [user, faculty]);

    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: studentData?.phone || '',
        department: facultyData?.department || '',
        qualifications: facultyData?.qualifications || '',
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name,
                phone: studentData?.phone || '',
                department: facultyData?.department || '',
                qualifications: facultyData?.qualifications || '',
            });
        }
    }, [user, studentData, facultyData]);


    if (!user) {
        return null;
    }

    const handlePasswordUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        if (newPassword.length < 6) {
            setMessage({ type: 'error', text: 'New password must be at least 6 characters long.' });
            return;
        }
        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match.' });
            return;
        }

        setLoading(true);
        const success = await updateUserPassword(user.id, currentPassword, newPassword);
        setLoading(false);

        if (success) {
            setMessage({ type: 'success', text: 'Password updated successfully!' });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } else {
            setMessage({ type: 'error', text: 'Incorrect current password or an error occurred.' });
        }
    };
    
    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        setIsUploading(true);
        setMessage(null);
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            updateUserPhoto(user.id, base64String);
            updateCurrentUser({ photoUrl: base64String });
            setIsUploading(false);
            setMessage({ type: 'success', text: 'Profile photo updated successfully!' });
        };
        reader.onerror = () => {
            setIsUploading(false);
            setMessage({ type: 'error', text: 'Failed to upload photo.' });
        };
        reader.readAsDataURL(file);
    };
    
     const handleInfoEditToggle = () => {
        if (isEditingInfo) {
            // If canceling, reset form data
             if (user) {
                setFormData({
                    name: user.name,
                    phone: studentData?.phone || '',
                    department: facultyData?.department || '',
                    qualifications: facultyData?.qualifications || '',
                });
            }
        }
        setIsEditingInfo(!isEditingInfo);
    };

    const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSaveInfo = () => {
        if (!user) return;
        const updatedData: Partial<User> & { id: string } = {
            id: user.id,
            name: formData.name,
        };
        
        // Add role-specific data for the updateUser function
        if (user.role === UserRole.Student) (updatedData as any).phone = formData.phone;
        if ([UserRole.Lecturer, UserRole.HOD, UserRole.Principal].includes(user.role)) {
            (updatedData as any).department = formData.department;
            (updatedData as any).qualifications = formData.qualifications;
        }
        
        updateUser(updatedData);
        updateCurrentUser({ name: formData.name });

        setIsEditingInfo(false);
        setMessage({ type: 'success', text: 'Profile information updated successfully!' });
    };


    return (
        <div className="space-y-6 max-w-4xl mx-auto">
             {message && (
                <div 
                    className={`p-4 rounded-md flex justify-between items-center ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                    role="alert"
                >
                    <span>{message.text}</span>
                    <button onClick={() => setMessage(null)} className="font-bold text-lg leading-none">&times;</button>
                </div>
            )}
            
            {/* Profile Header Card */}
            <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                     <div className="relative group w-24 h-24">
                        <img 
                            className="w-24 h-24 rounded-full object-cover ring-4 ring-purple-200" 
                            src={user.photoUrl || `https://i.pravatar.cc/150?u=${user.id}`} 
                            alt="User Avatar" 
                        />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center rounded-full transition-opacity cursor-pointer"
                            aria-label="Change profile photo"
                            disabled={isUploading}
                        >
                            <Camera className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                        <input 
                            type="file"
                            ref={fileInputRef}
                            hidden
                            accept="image/png, image/jpeg, image/gif"
                            onChange={handlePhotoUpload}
                        />
                        {isUploading && (
                             <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center rounded-full">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                            </div>
                        )}
                    </div>
                    <div className="text-center sm:text-left">
                        <h3 className="text-2xl font-bold text-gray-800">{user.name}</h3>
                        <p className="text-gray-500">{user.role}</p>
                        <div className="flex items-center text-gray-600 mt-2">
                            <Mail size={16} className="mr-2" />
                            <span>{user.email}</span>
                        </div>
                    </div>
                </div>
            </div>

             {/* Personal Information Card */}
            <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                        <UserIcon className="mr-2 text-brand-secondary" /> Personal Information
                    </h3>
                    {!isEditingInfo ? (
                        <button onClick={handleInfoEditToggle} className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 p-1">
                            <Edit size={14} className="mr-1" /> Edit
                        </button>
                    ) : (
                        <div className="flex items-center space-x-2">
                            <button onClick={handleInfoEditToggle} className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-800 p-1">
                                <XIcon size={14} className="mr-1" /> Cancel
                            </button>
                            <button onClick={handleSaveInfo} className="flex items-center text-sm font-medium text-green-600 hover:text-green-800 p-1">
                                <Save size={14} className="mr-1" /> Save
                            </button>
                        </div>
                    )}
                </div>
                <div className="space-y-1">
                    <InfoRow label="Full Name" value={formData.name} isEditing={isEditingInfo} name="name" onChange={handleInfoChange} />
                    
                    {user.role === UserRole.Student && studentData && (
                        <InfoRow label="Phone Number" value={formData.phone} isEditing={isEditingInfo} name="phone" onChange={handleInfoChange} />
                    )}

                    {(user.role === UserRole.Lecturer || user.role === UserRole.HOD || user.role === UserRole.Principal) && facultyData && (
                        <>
                            <InfoRow label="Department" value={formData.department} isEditing={isEditingInfo} name="department" onChange={handleInfoChange} />
                            <InfoRow label="Qualifications" value={formData.qualifications} isEditing={isEditingInfo} name="qualifications" onChange={handleInfoChange} />
                        </>
                    )}
                </div>
            </div>


            {/* Change Password Card */}
            <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <KeyRound className="mr-2 text-brand-secondary" /> Change Password
                </h3>
                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Current Password</label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">New Password</label>
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-secondary disabled:opacity-50"
                        >
                            {loading ? 'Updating...' : 'Update Password'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileModule;