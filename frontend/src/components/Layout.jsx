import React, { useState } from 'react';
import { useLocation, useNavigate, Outlet, Link } from 'react-router-dom';
import { 
  LayoutDashboard, ShoppingCart, Package, Users, 
  BarChart3, LogOut, Menu, X, UserCircle, ChevronRight 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ConfirmModal from './ConfirmModal';

const Layout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20}/>, roles: ['MANAGER', 'CASHIER', 'INVENTOROR'] },
    { path: '/pos', label: 'POS Terminal', icon: <ShoppingCart size={20}/>, roles: ['MANAGER', 'CASHIER'] },
    { path: '/inventory', label: 'Inventory', icon: <Package size={20}/>, roles: ['MANAGER', 'INVENTOROR'] },
    { path: '/reports', label: 'Profit Reports', icon: <BarChart3 size={20}/>, roles: ['MANAGER'] },
    { path: '/staff', label: 'Staff Management', icon: <Users size={20}/>, roles: ['MANAGER'] },
    { path: '/account', label: 'My Profile', icon: <UserCircle size={20}/>, roles: ['MANAGER', 'CASHIER', 'INVENTOROR'] },
  ];

  const userRole = user?.role || '';

  return (
    <div className="flex h-screen w-screen bg-navy-dark overflow-hidden font-sans">
      
      {/* LOGOUT CONFIRMATION MODAL */}
      <ConfirmModal 
        isOpen={showLogoutModal}
        title="Sign Out?"
        message="Are you sure you want to terminate your current session? You will need to re-authenticate to access the terminal."
        onConfirm={logout}
        onCancel={() => setShowLogoutModal(false)}
        type="warning"
      />

      {/* MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-[60] md:hidden backdrop-blur-sm transition-opacity" 
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* SIDEBAR */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-[70] w-72 bg-navy-muted border-r border-white/5 p-6 
        transform transition-transform duration-300 ease-in-out flex flex-col
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-3">
            <div className="bg-lemon p-2 rounded-xl shadow-lg shadow-lemon/20">
               <ShoppingCart size={20} className="text-navy-dark" />
            </div>
            <h1 className="text-2xl font-black text-lemon italic tracking-tighter uppercase">
              Oka<span className="text-off-white font-light">Oven</span>
            </h1>
          </div>
          <button className="md:hidden text-lemon" onClick={() => setSidebarOpen(false)}><X /></button>
        </div>

        <nav className="space-y-2 flex-1 overflow-y-auto pr-2 scrollbar-hide">
          {menuItems
            .filter(item => item.roles.includes(userRole))
            .map(item => (
            <Link 
              key={item.path} 
              to={item.path} 
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center justify-between p-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all group
                ${location.pathname === item.path 
                  ? 'bg-lemon text-navy-dark shadow-xl shadow-lemon/20' 
                  : 'text-gray-500 hover:bg-white/5 hover:text-off-white'}`}
            >
              <div className="flex items-center gap-4">
                {item.icon}
                {item.label}
              </div>
              {location.pathname === item.path && <ChevronRight size={14} />}
            </Link>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-white/5">
            <div className="flex items-center gap-3 mb-6 px-2 bg-white/5 p-4 rounded-2xl border border-white/5">
                <UserCircle className="text-lemon" size={32} />
                <div className="overflow-hidden">
                    <p className="text-off-white text-xs font-black truncate uppercase">{user?.fullName || 'User'}</p>
                    <p className="text-lemon text-[8px] font-black uppercase tracking-widest">{userRole}</p>
                </div>
            </div>
            <button 
              onClick={() => setShowLogoutModal(true)} 
              className="w-full flex items-center gap-4 p-4 text-rose-500 font-black text-[10px] uppercase tracking-widest hover:bg-rose-500/10 rounded-2xl transition-all"
            >
              <LogOut size={18}/> Logout System
            </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        
        {/* MOBILE HEADER */}
        <header className="md:hidden bg-navy-muted p-4 border-b border-white/5 flex justify-between items-center z-50">
          <h1 className="text-lemon font-black uppercase italic tracking-tighter">OkaOven</h1>
          <button onClick={() => setSidebarOpen(true)} className="text-lemon p-2 bg-white/5 rounded-xl border border-white/10">
            <Menu size={24}/>
          </button>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-10 lg:p-14 relative scroll-smooth bg-navy-dark">
           <div className="absolute top-0 right-0 w-full h-full pointer-events-none overflow-hidden -z-10">
              <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-lemon/5 blur-[120px] rounded-full"></div>
              <div className="absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] bg-blue-500/5 blur-[100px] rounded-full"></div>
           </div>

           <div className="max-w-7xl mx-auto h-full">
              <Outlet /> 
           </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;