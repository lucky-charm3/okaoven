import React from 'react';
import { useDashboardStats } from '../api/hooks';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, AlertCircle, TrendingUp, DollarSign, Activity, Loader2 } from 'lucide-react';

const Dashboard = () => {
  const { data: stats, isLoading } = useDashboardStats();
  const { user } = useAuth();

  // THE SKELETON LOADER (Zero blocking, high speed feel)
  if (isLoading) return (
    <div className="animate-pulse space-y-10">
      <div className="h-20 bg-white/5 rounded-3xl w-1/2"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => <div key={i} className="h-48 bg-white/5 rounded-[2.5rem]"></div>)}
      </div>
      <div className="h-64 bg-white/5 rounded-[2.5rem]"></div>
    </div>
  );

  return (
    <div className="animate-in fade-in duration-700">
      <div className="mb-12">
        <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-off-white">
          Live <span className="text-lemon font-light">Monitor</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <StatCard icon={<ShoppingBag className="text-lemon"/>} label="Warehouse Items" val={stats?.totalProducts} sub="Total SKU's" />
        <StatCard icon={<AlertCircle className="text-rose-500"/>} label="Low Stock" val={stats?.lowStockCount} danger={stats?.lowStockCount > 0} />
        <StatCard icon={<Activity className="text-blue-400"/>} label="Today's Sales" val={stats?.todaySalesCount} />

        {user?.role === 'MANAGER' && (
          <>
            <StatCard icon={<TrendingUp className="text-emerald-400"/>} label="Revenue" val={`${stats?.totalRevenue?.toLocaleString()} Tshs`} />
            <StatCard icon={<DollarSign className="text-lemon"/>} label="Profit" val={`${stats?.totalProfit?.toLocaleString()} Tshs`} highlight />
          </>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, val, sub, danger, highlight }) => (
  <div className={`bg-navy-muted p-8 rounded-[2.5rem] border ${highlight ? 'border-lemon/30 shadow-lemon/5' : 'border-white/5'} shadow-2xl relative overflow-hidden transition-all hover:scale-[1.02]`}>
    <div className="flex justify-between items-start mb-6">
      <div className="p-4 bg-navy-dark rounded-2xl border border-white/5 shadow-inner">{icon}</div>
    </div>
    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-1">{label}</p>
    <h3 className={`text-3xl md:text-4xl font-black tracking-tighter ${danger ? 'text-rose-500' : 'text-off-white'}`}>{val}</h3>
    <p className="text-[10px] text-gray-600 font-bold mt-3 uppercase tracking-widest">{sub}</p>
  </div>
);

export default Dashboard;