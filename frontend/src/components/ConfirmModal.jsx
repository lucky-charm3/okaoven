import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, type = 'danger' }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy-dark/90 backdrop-blur-sm">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-navy-muted border border-white/10 w-full max-w-sm rounded-[2rem] p-8 shadow-3xl text-center"
          >
            <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${type === 'danger' ? 'bg-rose-500/10 text-rose-500' : 'bg-lemon/10 text-lemon'}`}>
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-xl font-black text-off-white mb-2 uppercase tracking-tighter">{title}</h3>
            <p className="text-gray-400 text-sm mb-8 font-bold leading-relaxed">{message}</p>
            <div className="flex gap-4">
              <button onClick={onCancel} className="flex-1 px-6 py-4 rounded-xl font-black text-xs uppercase text-gray-500 hover:bg-white/5 transition-all">Cancel</button>
              <button 
                onClick={onConfirm} 
                className={`flex-1 px-6 py-4 rounded-xl font-black text-xs uppercase shadow-xl transition-all ${type === 'danger' ? 'bg-rose-600 text-white hover:bg-rose-500 shadow-rose-600/20' : 'bg-lemon text-navy-dark hover:bg-white shadow-lemon/20'}`}
              >Confirm</button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;