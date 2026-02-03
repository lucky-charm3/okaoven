import React, { useState, useEffect, useRef } from 'react';
import { useProducts } from '../api/hooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../api/axios';
import { ShoppingCart, Search, ScanBarcode, Trash2, CreditCard, PackageSearch, Loader2, Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import ConfirmModal from '../components/ConfirmModal';

const POSTerminal = () => {
  const queryClient = useQueryClient();
  const { data: products = [] } = useProducts();
  const [cart, setCart] = useState([]);
  const [barcodeInput, setBarcodeInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const barcodeRef = useRef(null);

  useEffect(() => { barcodeRef.current?.focus(); }, []);

  const addToCart = (product) => {
    if (product.stockQuantity <= 0) {
      toast.error(`STOCK DEPLETED: ${product.name}`);
      return;
    }
    const existing = cart.find(i => i.id === product.id);
    if (existing && existing.qty >= product.stockQuantity) {
        toast.error("MAX STOCK REACHED");
        return;
    }
    if (existing) {
      setCart(cart.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
    toast.success(`${product.name.toUpperCase()} ADDED`, { position: 'bottom-center' });
  };

  const handleBarcodeScan = (e) => {
    e.preventDefault(); // CRITICAL: PREVENTS BLANK PAGE REFRESH
    const product = products?.find(p => p.barcode === barcodeInput);
    if (product) {
      addToCart(product);
      setBarcodeInput('');
    } else {
      toast.error("BARCODE NOT RECOGNIZED");
      setBarcodeInput('');
    }
  };

  const checkoutMutation = useMutation({
    mutationFn: (saleData) => axios.post('/sales/process', saleData),
    onSuccess: () => {
      queryClient.invalidateQueries(['products', 'dashboardStats', 'salesReport']);
      setCart([]);
      setShowCheckoutModal(false);
      toast.success("TRANSACTION COMPLETE", { icon: '💰' });
      barcodeRef.current?.focus();
    },
    onError: () => toast.error("TRANSACTION FAILED")
  });

  const total = cart.reduce((sum, i) => sum + (i.sellingPrice * i.qty), 0);
  const filteredProducts = products?.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.barcode.includes(searchTerm)) || [];

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-140px)] animate-in fade-in duration-500">
      <ConfirmModal 
        isOpen={showCheckoutModal}
        title="Charge Customer?"
        message={`Finalizing bill for ${total.toLocaleString()} Tshs. Stock will be deducted immediately.`}
        onConfirm={() => checkoutMutation.mutate({
            totalAmount: total,
            items: cart.map(i => ({ productName: i.name, quantity: i.qty, priceAtSale: i.sellingPrice }))
        })}
        onCancel={() => setShowCheckoutModal(false)}
        type="warning"
      />

      <div className="flex-1 flex flex-col gap-6 overflow-hidden">
        <div className="flex flex-col sm:flex-row gap-4">
            {/* Barcode Search */}
            <form onSubmit={handleBarcodeScan} className="flex-1 relative group">
                <ScanBarcode className="absolute left-4 top-1/2 -translate-y-1/2 text-lemon" size={20}/>
                <input 
                    ref={barcodeRef}
                    value={barcodeInput}
                    onChange={(e) => setBarcodeInput(e.target.value)}
                    placeholder="SCAN BARCODE..." 
                    className="w-full bg-navy-muted border border-white/5 p-4 pl-12 rounded-2xl outline-none focus:border-lemon text-off-white font-black tracking-widest text-xs uppercase"
                />
            </form>
            {/* Manual Search */}
            <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18}/>
                <input 
                    placeholder="MANUAL PRODUCT SEARCH..." 
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-navy-muted border border-white/5 p-4 pl-12 rounded-2xl outline-none focus:border-white/20 text-off-white font-bold text-xs uppercase"
                />
            </div>
        </div>

        {/* Manual Grid */}
        <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 scrollbar-hide">
            {filteredProducts.map(p => (
                <button key={p.id} onClick={() => addToCart(p)} className="bg-navy-muted border border-white/5 p-6 rounded-[2rem] flex flex-col justify-between h-44 hover:border-lemon transition-all text-left group">
                    <div className="flex justify-between items-start">
                         <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">{p.category}</span>
                         <Plus size={16} className="text-lemon opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-sm font-black text-off-white uppercase leading-tight line-clamp-2">{p.name}</p>
                    <div className="flex flex-col gap-1">
                        <span className="text-lg font-black text-lemon tracking-tighter">{p.sellingPrice.toLocaleString()} <span className="text-[8px] uppercase font-bold text-gray-500">Tshs</span></span>
                        <span className={`text-[8px] font-black uppercase ${p.stockQuantity < 10 ? 'text-rose-500 animate-pulse':'text-gray-500'}`}>{p.stockQuantity} Left</span>
                    </div>
                </button>
            ))}
        </div>
      </div>

      {/* Cart Panel */}
      <div className="w-full lg:w-[450px] bg-lemon rounded-[3rem] p-8 md:p-12 text-navy-dark flex flex-col shadow-3xl relative overflow-hidden">
        <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-8 flex items-center justify-between border-b-4 border-navy-dark/10 pb-4">
            Cart <ShoppingCart size={28}/>
        </h2>

        <div className="flex-1 overflow-y-auto pr-2 space-y-6 mb-8 custom-scrollbar-dark">
            {cart.length > 0 ? cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center bg-navy-dark/5 p-4 rounded-2xl animate-in slide-in-from-right duration-300">
                    <div className="flex-1">
                        <p className="font-black text-[11px] uppercase leading-tight truncate w-40">{item.name}</p>
                        <p className="text-[9px] font-bold opacity-60 mt-1">{item.qty} units x {item.sellingPrice.toLocaleString()} Tshs</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <p className="font-black text-base">{(item.qty * item.sellingPrice).toLocaleString()}</p>
                        <button onClick={() => setCart(cart.filter(i => i.id !== item.id))} className="text-rose-600 hover:scale-110 transition-transform"><Trash2 size={16}/></button>
                    </div>
                </div>
            )) : (
                <div className="h-full flex flex-col items-center justify-center opacity-30 gap-4">
                    <ScanBarcode size={64} className="animate-pulse" />
                    <p className="font-black text-xs uppercase tracking-widest">Awaiting Items...</p>
                </div>
            )}
        </div>

        <div className="pt-8 border-t-4 border-navy-dark mt-auto">
            <div className="flex justify-between items-end mb-8">
                <span className="text-xs font-black uppercase opacity-60">Total Bill</span>
                <span className="text-5xl font-black tracking-tighter leading-none">{total.toLocaleString()} <span className="text-xs">Tshs</span></span>
            </div>
            <button 
                disabled={cart.length === 0 || checkoutMutation.isPending}
                onClick={() => setShowCheckoutModal(true)}
                className="w-full bg-navy-dark text-lemon py-6 rounded-2xl font-black uppercase tracking-[0.2em] shadow-2xl flex items-center justify-center gap-3 hover:scale-95 transition-all disabled:opacity-30"
            >
                {checkoutMutation.isPending ? <Loader2 className="animate-spin" size={24}/> : <><CreditCard size={20}/> Checkout</>}
            </button>
        </div>
      </div>
    </div>
  );
};

export default POSTerminal;