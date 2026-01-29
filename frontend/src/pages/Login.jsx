import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from '../api/axios';
import { toast } from 'react-hot-toast';
import { ShoppingCart, LogIn } from 'lucide-react';

const Login = () => {
  const [creds, setCreds] = useState({ username: '', password: '' });
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/auth/login', creds);
      login(res.data);
      toast.success("Authentication Success");
    } catch (err) {
      toast.error("Invalid credentials provided.");
    }
  };

  return (
    <div className="min-h-screen bg-navy-dark flex items-center justify-center p-6">
      <form onSubmit={handleLogin} className="bg-navy-muted p-10 md:p-16 rounded-[3rem] border border-lemon/20 w-full max-w-lg shadow-2xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-lemon/5 rounded-full blur-3xl"></div>
        <div className="flex justify-center mb-8">
            <div className="bg-lemon p-4 rounded-3xl shadow-xl shadow-lemon/20">
                <ShoppingCart className="text-navy-dark" size={36}/>
            </div>
        </div>
        <h2 className="text-4xl font-black text-center mb-2 uppercase italic text-off-white tracking-tighter">OKA <span className="text-lemon font-normal">OVEN</span></h2>
        <p className="text-center text-gray-500 font-bold text-xs uppercase tracking-widest mb-10">System Terminal Access</p>
        
        <div className="space-y-4">
          <div className="group">
            <label className="text-[10px] font-black text-lemon uppercase ml-2 opacity-50">Username</label>
            <input 
              type="text" 
              className="w-full bg-navy-dark p-5 rounded-2xl border border-white/10 outline-none focus:border-lemon transition-all"
              onChange={e => setCreds({...creds, username: e.target.value})}
            />
          </div>
          <div className="group">
            <label className="text-[10px] font-black text-lemon uppercase ml-2 opacity-50">Password</label>
            <input 
              type="password" 
              className="w-full bg-navy-dark p-5 rounded-2xl border border-white/10 outline-none focus:border-lemon transition-all"
              onChange={e => setCreds({...creds, password: e.target.value})}
            />
          </div>
          <button type="submit" className="w-full bg-lemon text-navy-dark font-black py-5 rounded-2xl uppercase shadow-xl hover:scale-[0.98] transition-all flex items-center justify-center gap-3 text-lg mt-6">
            <LogIn size={24}/> Enter Terminal
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;