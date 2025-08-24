import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  TrendingUp, 
  MessageCircle, 
  Package, 
  FolderOpen, 
  Settings 
} from 'lucide-react';

interface NavItemProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  to: string;
  isActive: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, to, isActive }) => (
  <Link
    to={to}
    className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 ${
      isActive
        ? 'text-brand-electric bg-brand-electric/10'
        : 'text-dark-400 hover:text-dark-200 hover:bg-dark-700/50'
    }`}
  >
    <Icon className={`w-6 h-6 mb-1 ${isActive ? 'text-brand-electric' : ''}`} />
    <span className="text-xs font-medium">{label}</span>
  </Link>
);

export const MobileNavigation: React.FC = () => {
  const location = useLocation();
  
  const navItems = [
    { icon: Home, label: 'Dashboard', to: '/' },
    { icon: TrendingUp, label: 'Analytics', to: '/analytics' },
    { icon: Package, label: 'Inventory', to: '/inventory' },
    { icon: MessageCircle, label: 'WhatsApp', to: '/whatsapp' },
    { icon: FolderOpen, label: 'Projects', to: '/projects' },
    { icon: Settings, label: 'Settings', to: '/settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-dark-800 border-t border-dark-600 lg:hidden">
      <div className="flex justify-around p-2">
        {navItems.map((item) => (
          <NavItem
            key={item.to}
            icon={item.icon}
            label={item.label}
            to={item.to}
            isActive={location.pathname === item.to}
          />
        ))}
      </div>
    </nav>
  );
};
