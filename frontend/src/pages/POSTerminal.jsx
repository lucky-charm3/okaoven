import React, { useState, useEffect, useRef } from 'react';
import { useProducts } from '../api/hooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../api/axios';
import { ShoppingCart, Search, ScanBarcode, Trash2, CheckCircle, PackageSearch, CreditCard } from 'lucide-react';
import { toast } from 'react-hot-toast';
import ConfirmModal from '../components/ConfirmModal';

const POSTerminal = () => {
  const queryClient = useQueryClient();
  const { data: products } = useProducts();
  const [cart, setCart] = useState([]);
  const [barcodeInput, setBarcodeInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const barcodeRef = useRef(null);

  // Auto-focus on barcode scanner input on load
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
    toast.success(`${product.name} ADDED`, { position: 'bottom-center' });
  };

  const handleBarcodeScan = (e) => {
    e.preventDefault();
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
      queryClient.invalidateQueries(['products']);
      queryClient.invalidateQueries(['dashboardStats']);
      queryClient.invalidateQueries(['salesReport']); 
      
      setCart([]);
      setShowCheckoutModal(false);
      toast.success("SALE COMPLETED SUCCESSFULLY", {
        duration: 5000,
        icon: '✅'
      });
    },
    onError: () => toast.error("TRANSACTION FAILED")
  });

  const total = cart.reduce((sum, i) => sum + (i.sellingPrice * i.qty), 0);
  const filteredProducts = products?.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())) || [];

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-140px)] animate-in fade-in duration-500">
      <ConfirmModal 
        isOpen={showCheckoutModal}
        title="Finalize Transaction?"
        message={`Charge customer ${total.toLocaleString()} Tshs for ${cart.length} items? This will update stock levels immediately.`}
        onConfirm={() => checkoutMutation.mutate({
            totalAmount: total,
            items: cart.map(i => ({ productName: i.name, quantity: i.qty, priceAtSale: i.sellingPrice }))
        })}
        onCancel={() => setShowCheckoutModal(false)}
        type="warning"
      />

      {/* LEFT: Product Discovery */}
      <div className="flex-1 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row gap-4">
            <form onSubmit={handleBarcodeScan} className="flex-1 relative group">
                <ScanBarcode className="absolute left-4 top-1/2 -translate-y-1/2 text-lemon group-focus-within:animate-pulse" size={20}/>
                <input 
                    ref={barcodeRef}
                    value={barcodeInput}
                    onChange={(e) => setBarcodeInput(e.target.value)}
                    placeholder="SCAN BARCODE..." 
                    className="w-full bg-navy-muted border border-white/5 p-4 pl-12 rounded-2xl outline-none focus:border-lemon text-off-white font-black tracking-[0.2em] text-xs uppercase"
                />
            </form>
            <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18}/>
                <input 
                    placeholder="MANUAL SEARCH..." 
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-navy-muted border border-white/5 p-4 pl-12 rounded-2xl outline-none focus:border-white/20 text-off-white font-bold text-xs uppercase"
                />
            </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 scrollbar-hide">
            {filteredProducts.map(p => (
                <button key={p.id} onClick={() => addToCart(p)} className="bg-navy-muted border border-white/5 p-6 rounded-[2rem] flex flex-col justify-between h-40 hover:border-lemon transition-all text-left relative group overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity"><PackageSearch size={40}/></div>
                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{p.category}</span>
                    <p className="text-sm font-black text-off-white uppercase leading-tight line-clamp-2">{p.name}</p>
                    <div className="flex justify-between items-end">
                        <span className="text-lg font-black text-lemon tracking-tighter">{p.sellingPrice.toLocaleString()} <span className="text-[8px] uppercase">Tshs</span></span>
                        <span className={`text-[8px] font-black uppercase ${p.stockQuantity < 10 ? 'text-rose-500':'text-gray-500'}`}>{p.stockQuantity} Left</span>
                    </div>
                </button>
            ))}
        </div>
      </div>

      {/* RIGHT: Cart & Checkout */}
      <div className="w-full lg:w-[450px] bg-lemon rounded-[3rem] p-8 md:p-12 text-navy-dark flex flex-col shadow-2xl relative overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-40 h-40 bg-navy-dark/5 rounded-full blur-3xl"></div>
        
        <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-8 flex items-center justify-between">
            Terminal <ShoppingCart size={28}/>
        </h2>

        <div className="flex-1 overflow-y-auto pr-2 space-y-6 mb-8 custom-scrollbar-dark">
            {cart.length > 0 ? cart.map((item) => (
                <div key={item.id} className="flex justify-between items-start border-b border-navy-dark/10 pb-4 animate-in slide-in-from-right duration-300">
                    <div>
                        <p className="font-black text-xs uppercase leading-tight">{item.name}</p>
                        <p className="text-[10px] font-bold opacity-60 italic mt-1">{item.qty} units x {item.sellingPrice.toLocaleString()} Tshs</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <p className="font-black text-lg">{(item.qty * item.sellingPrice).toLocaleString()}</p>
                        <button onClick={() => setCart(cart.filter(i => i.id !== item.id))} className="text-navy-dark/40 hover:text-rose-600"><Trash2 size={16}/></button>
                    </div>
                </div>
            )) : (
                <div className="h-full flex flex-col items-center justify-center opacity-30 gap-4">
                    <ScanBarcode size={64} className="animate-pulse" />
                    <p className="font-black text-xs uppercase tracking-widest">Awaiting Input...</p>
                </div>
            )}
        </div>

        <div className="pt-8 border-t-4 border-navy-dark/10">
            <div className="flex justify-between items-end mb-8">
                <span className="text-xs font-black uppercase opacity-60">Total Bill</span>
                <span className="text-5xl font-black tracking-tighter leading-none">{total.toLocaleString()} <span className="text-xs">Tshs</span></span>
            </div>
            <button 
                disabled={cart.length === 0 || checkoutMutation.isPending}
                onClick={() => setShowCheckoutModal(true)}
                className="w-full bg-navy-dark text-lemon py-6 rounded-2xl font-black uppercase tracking-[0.2em] shadow-2xl flex items-center justify-center gap-3 hover:scale-95 transition-all disabled:opacity-30"
            >
                {checkoutMutation.isPending ? <Loader2 className="animate-spin"/> : <CreditCard />} Process Sale
            </button>
        </div>
      </div>
    </div>
  );
};

export default POSTerminal;