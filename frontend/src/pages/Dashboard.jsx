import React from 'react';
import { useDashboardStats } from '../api/hooks';
import { useAuth } from '../context/AuthContext';
import { ShoppingBag, AlertCircle, TrendingUp, DollarSign, Activity, Loader2 } from 'lucide-react';

const Dashboard = () => {
  const { data: stats, isLoading } = useDashboardStats();
  const { user } = useAuth();

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <Loader2 className="animate-spin text-lemon" size={48}/>
      <p className="text-lemon font-black text-[10px] tracking-widest uppercase italic">Calculating Real-time Analytics...</p>
    </div>
  );

  return (
    <div className="animate-in fade-in duration-700">
      <div className="mb-12">
        <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-off-white">
          Live <span className="text-lemon font-light text-3xl md:text-5xl">Terminal Monitor</span>
        </h1>
        <p className="text-gray-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-2 ml-1">
            System Node: {user?.role} / Location: OkaOven Main
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <StatCard 
            icon={<ShoppingBag className="text-lemon"/>} 
            label="Warehouse Items" 
            val={stats?.totalProducts || 0} 
            sub="Total Unique SKU's" 
        />
        
        <StatCard 
            icon={<AlertCircle className="text-rose-500"/>} 
            label="Critical Stock" 
            val={stats?.lowStockCount || 0} 
            sub="Needs Immediate Restock" 
            danger={stats?.lowStockCount > 0} 
        />

        <StatCard 
            icon={<Activity className="text-blue-400"/>} 
            label="Today's Sales" 
            val={stats?.todaySalesCount || 0} 
            sub="Transactions Since Midnight" 
        />

        {/* FINANCIAL STATS - ONLY FOR MANAGER */}
        {user?.role === 'MANAGER' && (
          <>
            <StatCard 
                icon={<TrendingUp className="text-emerald-400"/>} 
                label="Total Revenue" 
                val={`${(stats?.totalRevenue || 0).toLocaleString()} Tshs`} 
                sub="Gross Sales Volume" 
            />
            <StatCard 
                icon={<DollarSign className="text-lemon"/>} 
                label="Net Profit" 
                val={`${(stats?.totalProfit || 0).toLocaleString()} Tshs`} 
                sub="Actual Earnings After Cost" 
                highlight
            />
          </>
        )}
      </div>

      {/* RECENT STATUS BOX */}
      <div className="bg-navy-muted rounded-[2.5rem] border border-white/5 p-8 md:p-12 shadow-2xl relative overflow-hidden group">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-lemon/5 rounded-full blur-3xl transition-all group-hover:bg-lemon/10"></div>
        <h3 className="text-xl font-black uppercase mb-6 flex items-center gap-3 text-off-white italic">
            <Activity className="text-lemon" size={20}/> Operational Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 bg-navy-dark rounded-2xl border border-white/5">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Database Sync</p>
                <p className="text-emerald-400 font-bold text-sm uppercase">Active / Optimized</p>
            </div>
            <div className="p-6 bg-navy-dark rounded-2xl border border-white/5">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Inventory Integrity</p>
                <p className="text-lemon font-bold text-sm uppercase">
                    {stats?.lowStockCount > 0 ? 'Action Required' : 'All Levels Optimal'}
                </p>
            </div>
        </div>
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