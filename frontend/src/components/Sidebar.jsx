import { LayoutDashboard, ShoppingCart, Package, Users, BarChart3, LogOut } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, user, setLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard />, roles: ['MANAGER', 'CASHIER', 'INVENTOROR'] },
    { id: 'pos', label: 'POS Terminal', icon: <ShoppingCart />, roles: ['MANAGER', 'CASHIER'] },
    { id: 'inventory', label: 'Inventory', icon: <Package />, roles: ['MANAGER', 'INVENTOROR'] },
    { id: 'reports', label: 'Profit Reports', icon: <BarChart3 />, roles: ['MANAGER'] },
    { id: 'staff', label: 'Staff Management', icon: <Users />, roles: ['MANAGER'] },
  ];

  return (
    <div className="w-72 bg-navy-muted border-r border-white/5 p-6 flex flex-col h-screen sticky top-0">
      <div className="mb-10">
        <h1 className="text-2xl font-black text-lemon italic tracking-tighter">OKA <span className="text-off-white font-normal">OVEN</span></h1>
        <div className="text-[10px] text-gray-500 font-bold tracking-[0.2em]">PRODUCTION v1.0</div>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.filter(item => item.roles.includes(user.role)).map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl font-black text-xs uppercase transition-all 
              ${activeTab === item.id ? 'bg-lemon text-navy-dark shadow-lg shadow-lemon/10' : 'text-gray-500 hover:bg-white/5 hover:text-off-white'}`}
          >
            {item.icon} {item.label}
          </button>
        ))}
      </nav>

      <button onClick={setLogout} className="flex items-center gap-4 p-4 text-rose-500 font-bold hover:bg-rose-500/10 rounded-2xl transition-all">
        <LogOut size={20}/> Logout
      </button>
    </div>
  );
};

export default Sidebar;