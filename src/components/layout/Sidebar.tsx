import React from 'react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  navItems: NavItem[];
  currentPage: string;
  onNavigate: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ navItems, currentPage, onNavigate }) => {
  return (
    <div className="w-64 bg-slate-900 text-white flex-shrink-0 hidden md:flex flex-col transition-all duration-300 ease-in-out">
      {/* Navigation */}
      <nav className="flex-1 pt-4">
        <ul>
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onNavigate(item.id)}
                className={`flex items-center gap-3 w-full px-6 py-3 text-left transition-colors duration-200 hover:bg-slate-800 cursor-pointer ${currentPage === item.id ? 'bg-slate-800 border-l-4 border-teal-400' : ''
                  }`}
              >
                <span className={currentPage === item.id ? 'text-teal-400' : 'text-slate-400'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-6 text-xs text-slate-500">
        <p>Version 1.0.0</p>
        <p>© 2025 xmem</p>
      </div>
    </div>
  );
};

export default Sidebar;