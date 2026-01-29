import React, { useState } from 'react';
import { useStaff } from '../api/hooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../api/axios';
import { UserPlus, Mail, Phone, Shield, ArrowLeft, Loader2, Trash2, UserCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

const StaffManagement = () => {
  const queryClient = useQueryClient();
  const { data: staff, isLoading } = useStaff();
  const [view, setView] = useState('list');
  const [form, setForm] = useState({ username: '', password: '', fullName: '', email: '', phone: '', role: 'CASHIER' });

  const registerMutation = useMutation({
    mutationFn: (newStaff) => axios.post('/api/auth/register-staff', newStaff),
    onSuccess: () => {
      queryClient.invalidateQueries(['staff']);
      toast.success("STAFF REGISTERED SUCCESSFULLY");
      setView('list');
    },
    onError: (err) => toast.error(err.response?.data?.message || "REGISTRATION FAILED")
  });

  if (isLoading) return <div className="flex justify-center py-40"><Loader2 className="animate-spin text-lemon" size={48}/></div>;

  if (view === 'add') {
    return (
      <div className="max-w-2xl mx-auto animate-in slide-in-from-bottom duration-300">
        <button onClick={() => setView('list')} className="flex items-center gap-2 text-lemon mb-6 font-black uppercase text-[10px] tracking-widest"><ArrowLeft size={16}/> Back to Directory</button>
        <h2 className="text-3xl font-black mb-8 text-off-white uppercase italic tracking-tighter">New <span className="text-lemon">Operator</span></h2>
        <form onSubmit={(e) => { e.preventDefault(); registerMutation.mutate(form); }} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-navy-muted p-10 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden">
          {registerMutation.isPending && (
              <div className="absolute inset-0 bg-navy-dark/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-4">
                  <Loader2 className="animate-spin text-lemon" size={40} />
                  <span className="text-lemon font-black uppercase text-xs">Creating Account...</span>
              </div>
          )}
          <input required placeholder="Full Name" className="md:col-span-2 bg-navy-dark p-4 rounded-xl border border-white/10 outline-none focus:border-lemon text-off-white" onChange={e => setForm({...form, fullName: e.target.value})}/>
          <input required placeholder="Username" className="bg-navy-dark p-4 rounded-xl border border-white/10 outline-none focus:border-lemon text-off-white" onChange={e => setForm({...form, username: e.target.value})}/>
          <input required type="password" placeholder="Password" className="bg-navy-dark p-4 rounded-xl border border-white/10 outline-none focus:border-lemon text-off-white" onChange={e => setForm({...form, password: e.target.value})}/>
          <input required type="email" placeholder="Email" className="bg-navy-dark p-4 rounded-xl border border-white/10 outline-none focus:border-lemon text-off-white" onChange={e => setForm({...form, email: e.target.value})}/>
          <input required placeholder="Phone Number" className="bg-navy-dark p-4 rounded-xl border border-white/10 outline-none focus:border-lemon text-off-white" onChange={e => setForm({...form, phone: e.target.value})}/>
          <select className="md:col-span-2 bg-navy-dark p-4 rounded-xl border border-white/10 outline-none text-gray-400 font-bold" onChange={e => setForm({...form, role: e.target.value})}>
            <option value="CASHIER">CASHIER</option>
            <option value="INVENTOROR">INVENTOROR</option>
            <option value="MANAGER">MANAGER</option>
          </select>
          <button className="md:col-span-2 bg-lemon text-navy-dark py-4 rounded-xl font-black uppercase shadow-xl hover:scale-95 transition-all">Authorize Staff</button>
        </form>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
        <h2 className="text-4xl font-black uppercase italic tracking-tighter text-off-white">Staff <span className="text-lemon font-light">Registry</span></h2>
        <button onClick={() => setView('add')} className="w-full sm:w-auto bg-lemon text-navy-dark px-8 py-3 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-white transition-all shadow-xl shadow-lemon/10">
          <UserPlus size={20}/> New Operator
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {staff?.map(member => (
          <div key={member.id} className="bg-navy-muted border border-white/5 p-8 rounded-[2rem] relative group hover:border-lemon/30 transition-all shadow-2xl">
            <div className="flex items-center gap-6 mb-6">
                <div className="w-16 h-16 bg-navy-dark rounded-2xl flex items-center justify-center border border-white/5 text-lemon shadow-inner">
                    <UserCircle size={32} />
                </div>
                <div>
                    <h3 className="text-lg font-black text-off-white uppercase">{member.fullName}</h3>
                    <p className="text-lemon text-[10px] font-black tracking-widest bg-lemon/5 px-2 py-1 rounded w-fit">{member.role}</p>
                </div>
            </div>
            <div className="space-y-3 border-t border-white/5 pt-6">
                <div className="flex items-center gap-3 text-gray-500 text-xs font-bold uppercase italic"><Mail size={14} className="text-lemon"/> {member.email}</div>
                <div className="flex items-center gap-3 text-gray-500 text-xs font-bold uppercase italic"><Phone size={14} className="text-lemon"/> {member.phone}</div>
                <div className="flex items-center gap-3 text-gray-400 text-[10px] font-mono mt-4 opacity-50 uppercase">ID: {member.username}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StaffManagement;