import React, { useState } from 'react';
import { useProducts } from '../api/hooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../api/axios';
import { Plus, Trash2, ArrowLeft, Loader2, Package, Search, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import ConfirmModal from '../components/ConfirmModal';

const Inventory = () => {
  const queryClient = useQueryClient();
  const { data: products, isLoading: isFetching } = useProducts();
  const [view, setView] = useState('list');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [form, setForm] = useState({ 
    name: '', barcode: '', purchasePrice: '', 
    sellingPrice: '', stockQuantity: '', category: '' 
  });

  // MUTATION: ADD PRODUCT
  const addMutation = useMutation({
    mutationFn: (newP) => axios.post('/products', newP),
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
      toast.success("STOCK RECORD CREATED");
      setView('list');
      setForm({ name: '', barcode: '', purchasePrice: '', sellingPrice: '', stockQuantity: '', category: '' });
    },
    onError: () => toast.error("FAILED TO SAVE RECORD")
  });

  // MUTATION: DELETE PRODUCT
  const deleteMutation = useMutation({
    mutationFn: (id) => axios.delete(`/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['products']);
      toast.success("RECORD PERMANENTLY DELETED");
      setDeleteTarget(null);
    },
    onError: () => toast.error("DELETE OPERATION FAILED")
  });

  const filteredProducts = products?.filter(p => 
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.barcode?.includes(searchTerm)
  ) || [];

  if (isFetching) return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <Loader2 className="animate-spin text-lemon" size={48}/>
      <span className="text-lemon font-black uppercase text-[10px] tracking-[0.3em]">Syncing Inventory Data...</span>
    </div>
  );

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* DELETE CONFIRMATION MODAL */}
      <ConfirmModal 
        isOpen={!!deleteTarget}
        title="Destroy Stock Record?"
        message="Warning: This action will permanently delete this item from the warehouse database. This cannot be undone."
        onConfirm={() => deleteMutation.mutate(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
      />

      {view === 'add' ? (
        <div className="max-w-2xl mx-auto">
          <button 
            onClick={() => setView('list')} 
            className="flex items-center gap-2 text-lemon mb-6 font-black uppercase text-[10px] tracking-widest hover:text-off-white transition-colors"
          >
            <ArrowLeft size={14}/> Return to list
          </button>
          
          <h2 className="text-3xl md:text-5xl font-black mb-10 text-off-white tracking-tighter uppercase italic">
            New <span className="text-lemon font-light">Stock</span>
          </h2>

          <form 
            onSubmit={(e) => { e.preventDefault(); addMutation.mutate(form); }} 
            className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-navy-muted p-8 md:p-12 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden"
          >
             {addMutation.isPending && (
                <div className="absolute inset-0 bg-navy-dark/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-4">
                    <Loader2 className="animate-spin text-lemon" size={40} />
                    <span className="text-lemon font-black uppercase text-xs tracking-widest animate-pulse">Writing to Vault...</span>
                </div>
             )}

             <div className="md:col-span-2">
                <label className="text-[10px] font-black text-lemon uppercase tracking-widest ml-1 opacity-50">Product Description</label>
                <input required className="w-full bg-navy-dark p-5 rounded-2xl border border-white/10 outline-none focus:border-lemon text-off-white mt-2 transition-all" onChange={e => setForm({...form, name: e.target.value})}/>
             </div>

             <div>
                <label className="text-[10px] font-black text-lemon uppercase tracking-widest ml-1 opacity-50">Barcode ID</label>
                <input required className="w-full bg-navy-dark p-5 rounded-2xl border border-white/10 outline-none focus:border-lemon text-off-white mt-2" onChange={e => setForm({...form, barcode: e.target.value})}/>
             </div>

             <div>
                <label className="text-[10px] font-black text-lemon uppercase tracking-widest ml-1 opacity-50">Category</label>
                <input className="w-full bg-navy-dark p-5 rounded-2xl border border-white/10 outline-none focus:border-lemon text-off-white mt-2" onChange={e => setForm({...form, category: e.target.value})}/>
             </div>

             <div>
                <label className="text-[10px] font-black text-lemon uppercase tracking-widest ml-1 opacity-50">Purchase Cost ($)</label>
                <input type="number" step="0.01" required className="w-full bg-navy-dark p-5 rounded-2xl border border-white/10 outline-none focus:border-lemon text-off-white mt-2" onChange={e => setForm({...form, purchasePrice: e.target.value})}/>
             </div>

             <div>
                <label className="text-[10px] font-black text-lemon uppercase tracking-widest ml-1 opacity-50">Retail Price ($)</label>
                <input type="number" step="0.01" required className="w-full bg-navy-dark p-5 rounded-2xl border border-white/10 outline-none focus:border-lemon text-off-white mt-2" onChange={e => setForm({...form, sellingPrice: e.target.value})}/>
             </div>

             <div className="md:col-span-2">
                <label className="text-[10px] font-black text-lemon uppercase tracking-widest ml-1 opacity-50">Initial Stock Quantity</label>
                <input type="number" required className="w-full bg-navy-dark p-5 rounded-2xl border border-white/10 outline-none focus:border-lemon text-off-white mt-2" onChange={e => setForm({...form, stockQuantity: e.target.value})}/>
             </div>

             <button 
              disabled={addMutation.isPending} 
              className="md:col-span-2 bg-lemon text-navy-dark py-6 rounded-2xl font-black uppercase text-lg shadow-xl shadow-lemon/10 disabled:opacity-50 hover:bg-white transition-all mt-4"
             >
                Commit to Inventory
             </button>
          </form>
        </div>
      ) : (
        <div className="space-y-8 h-full flex flex-col">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div>
              <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-off-white">
                Stock <span className="text-lemon font-light">Vault</span>
              </h2>
              <p className="text-gray-500 font-bold uppercase text-[10px] tracking-widest mt-2 ml-1">Live Warehouse Monitoring</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <div className="relative group flex-1 sm:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-lemon transition-colors" size={18}/>
                <input 
                  type="text" 
                  placeholder="SEARCH BARCODE OR NAME..."
                  className="w-full bg-navy-muted border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-xs font-black uppercase tracking-widest outline-none focus:border-lemon/50 transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button 
                onClick={() => setView('add')} 
                className="bg-lemon text-navy-dark px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-white transition-all shadow-xl shadow-lemon/20 uppercase text-xs tracking-widest"
              >
                <Plus size={20}/> New Entry
              </button>
            </div>
          </div>

          <div className="bg-navy-muted rounded-[2.5rem] border border-white/5 p-4 md:p-8 lg:p-12 shadow-2xl relative flex-1 overflow-hidden flex flex-col">
            {deleteMutation.isPending && (
                <div className="absolute inset-0 bg-navy-dark/40 backdrop-blur-[2px] z-10 rounded-[2.5rem] flex items-center justify-center">
                    <div className="bg-navy-dark p-6 rounded-2xl flex items-center gap-4 border border-rose-500/50 shadow-2xl shadow-rose-500/20">
                      <Loader2 className="animate-spin text-rose-500" />
                      <span className="text-rose-500 font-black uppercase text-[10px] tracking-widest">Wiping Record...</span>
                    </div>
                </div>
            )}

            <div className="overflow-x-auto scrollbar-hide">
              <table className="w-full text-left min-w-[800px]">
                <thead className="text-lemon text-[10px] font-black uppercase tracking-[0.3em] border-b border-white/5">
                  <tr>
                    <th className="pb-8 pl-4">Product Details</th>
                    <th className="pb-8">Category</th>
                    <th className="pb-8 text-center">Stock Level</th>
                    <th className="pb-8">Price Unit</th>
                    <th className="pb-8 text-right pr-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-bold">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map(p => (
                      <tr key={p.id} className="hover:bg-white/5 transition-all group">
                        <td className="py-6 pl-4">
                            <div className="text-off-white text-base">{p.name}</div>
                            <div className="text-[10px] text-gray-600 font-mono tracking-tighter uppercase">{p.barcode}</div>
                        </td>
                        <td className="py-6">
                            <span className="text-gray-400 uppercase text-[10px] tracking-widest">{p.category || 'General'}</span>
                        </td>
                        <td className="py-6 text-center">
                            <div className="flex flex-col items-center gap-1">
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black ${p.stockQuantity < 10 ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-400'}`}>
                                    {p.stockQuantity} UNITS
                                </span>
                                {p.stockQuantity < 10 && <span className="text-[8px] text-rose-500 animate-pulse uppercase">Restock Needed</span>}
                            </div>
                        </td>
                        <td className="py-6">
                            <span className="text-lemon font-black text-2xl tracking-tighter">Tshs{p.sellingPrice?.toFixed(2)}</span>
                        </td>
                        <td className="py-6 text-right pr-4">
                            <button 
                              onClick={() => setDeleteTarget(p.id)} 
                              className="text-rose-500/30 hover:text-rose-500 p-3 bg-rose-500/5 hover:bg-rose-500/10 rounded-xl transition-all group-hover:scale-110"
                            >
                                <Trash2 size={20}/>
                            </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="py-32 text-center">
                         <div className="flex flex-col items-center gap-4 opacity-20">
                            <Package size={64} />
                            <p className="font-black uppercase tracking-[0.4em] text-xs">No Records Found</p>
                         </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;