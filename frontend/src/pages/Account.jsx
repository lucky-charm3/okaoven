import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useMutation } from '@tanstack/react-query';
import axios from '../api/axios';
import { toast } from 'react-hot-toast';
import { User, Mail, Phone, Lock, Save, Loader2 } from 'lucide-react';
import ConfirmModal from '../components/ConfirmModal';

const Account = () => {
  const { user, login } = useAuth();
  const [showConfirm, setShowConfirm] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    password: '' // Leave empty unless changing
  });

  const updateMutation = useMutation({
    mutationFn: (data) => axios.put('/auth/update-profile', data),
    onSuccess: (res) => {
      // Update the local storage and context with new name/email
      login({ ...user, fullName: res.data.fullName, email: res.data.email, phone: res.data.phone });
      toast.success("PROFILE UPDATED SUCCESSFULLY");
      setShowConfirm(false);
    },
    onError: (err) => {
      const msg = err.response?.data?.message || "UPDATE FAILED";
      toast.error(msg);
    }
  });

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in duration-700">
      <ConfirmModal 
        isOpen={showConfirm}
        title="Apply Changes?"
        message="Are you sure you want to update your personal profile? If you entered a new password, it will take effect immediately."
        onConfirm={() => updateMutation.mutate(formData)}
        onCancel={() => setShowConfirm(false)}
        type="warning"
      />

      <div className="mb-10">
        <h2 className="text-4xl font-black uppercase italic tracking-tighter text-off-white">Account <span className="text-lemon">Security</span></h2>
        <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest mt-2">Manage your personal operator profile</p>
      </div>

      <div className="bg-navy-muted border border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
        {updateMutation.isPending && (
            <div className="absolute inset-0 bg-navy-dark/60 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-4">
                <Loader2 className="animate-spin text-lemon" size={40} />
                <span className="text-lemon font-black uppercase text-xs tracking-widest">Saving Changes...</span>
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <InputGroup label="System ID (Read Only)" icon={<User size={18}/>}>
               <input value={formData.username} disabled className="w-full bg-navy-dark/50 p-4 rounded-xl border border-white/5 text-gray-500 cursor-not-allowed font-mono uppercase text-xs" />
            </InputGroup>

            <InputGroup label="Full Name" icon={<User size={18}/>}>
               <input 
                required
                value={formData.fullName} 
                className="w-full bg-navy-dark p-4 rounded-xl border border-white/10 outline-none focus:border-lemon transition-all" 
                onChange={e => setFormData({...formData, fullName: e.target.value})}
               />
            </InputGroup>

            <InputGroup label="Email Address" icon={<Mail size={18}/>}>
               <input 
                type="email"
                required
                value={formData.email} 
                className="w-full bg-navy-dark p-4 rounded-xl border border-white/10 outline-none focus:border-lemon transition-all" 
                onChange={e => setFormData({...formData, email: e.target.value})}
               />
            </InputGroup>
          </div>

          <div className="space-y-6">
            <InputGroup label="Phone Number" icon={<Phone size={18}/>}>
               <input 
                type="tel"
                value={formData.phone} 
                placeholder="10 Digits"
                className="w-full bg-navy-dark p-4 rounded-xl border border-white/10 outline-none focus:border-lemon transition-all" 
                onChange={e => setFormData({...formData, phone: e.target.value})}
               />
            </InputGroup>

            <InputGroup label="Change Password" icon={<Lock size={18}/>}>
               <input 
                type="password"
                placeholder="Leave blank to keep current"
                className="w-full bg-navy-dark p-4 rounded-xl border border-white/10 outline-none focus:border-lemon transition-all" 
                onChange={e => setFormData({...formData, password: e.target.value})}
               />
               <p className="text-[8px] text-gray-600 font-bold mt-2 uppercase">Minimum 6 characters for security</p>
            </InputGroup>

            <div className="pt-4">
                <button 
                    onClick={() => setShowConfirm(true)}
                    className="w-full bg-lemon text-navy-dark py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-white transition-all shadow-xl shadow-lemon/10"
                >
                    <Save size={20}/> Update Credentials
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InputGroup = ({ label, icon, children }) => (
  <div className="flex flex-col gap-2">
    <label className="text-[10px] font-black text-lemon uppercase tracking-widest flex items-center gap-2">
      {icon} {label}
    </label>
    {children}
  </div>
);

export default Account;