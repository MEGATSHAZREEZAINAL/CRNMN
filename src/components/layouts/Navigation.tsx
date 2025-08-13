import React from 'react';

interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  badge?: string | number;
  color?: string;
  isNew?: boolean;
  isHot?: boolean;
}

interface NavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeSection, onSectionChange }) => {
  const navigationItems: NavigationItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📊',
      badge: 'Live',
      color: 'blue',
    },
    {
      id: 'social-media',
      label: 'Social Media',
      icon: '📱',
      badge: 'AI',
      color: 'purple',
    },
    {
      id: 'viral-prediction',
      label: 'Viral Prediction',
      icon: '🚀',
      badge: 'GUARANTEE',
      color: 'red',
      isNew: true,
      isHot: true,
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: '📈',
      badge: 12,
      color: 'green',
    },
    {
      id: 'team',
      label: 'Team',
      icon: '👥',
      badge: 5,
      color: 'indigo',
    },
    {
      id: 'ecommerce',
      label: 'E-commerce',
      icon: '🛒',
      badge: 'PRO',
      color: 'yellow',
    },
  ];

  const getItemClasses = (item: NavigationItem) => {
    const isActive = activeSection === item.id;
    const baseClasses =
      'relative group flex items-center px-4 py-3 rounded-lg font-medium transition-all duration-200 cursor-pointer';

    if (isActive) {
      switch (item.color) {
        case 'red':
          return `${baseClasses} bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg transform scale-105`;
        case 'purple':
          return `${baseClasses} bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg transform scale-105`;
        case 'blue':
          return `${baseClasses} bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg transform scale-105`;
        case 'green':
          return `${baseClasses} bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg transform scale-105`;
        case 'indigo':
          return `${baseClasses} bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg transform scale-105`;
        case 'yellow':
          return `${baseClasses} bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg transform scale-105`;
        default:
          return `${baseClasses} bg-gray-800 text-white shadow-lg transform scale-105`;
      }
    }

    return `${baseClasses} text-gray-300 hover:bg-gray-700 hover:text-white hover:transform hover:scale-102`;
  };

  const getBadgeClasses = (item: NavigationItem, isActive: boolean) => {
    if (item.isHot) {
      return 'bg-red-500 text-white animate-pulse font-bold';
    }
    if (item.isNew) {
      return 'bg-green-500 text-white animate-bounce';
    }
    if (isActive) {
      return 'bg-white bg-opacity-20 text-white';
    }

    switch (item.color) {
      case 'red':
        return 'bg-red-100 text-red-800';
      case 'purple':
        return 'bg-purple-100 text-purple-800';
      case 'blue':
        return 'bg-blue-100 text-blue-800';
      case 'green':
        return 'bg-green-100 text-green-800';
      case 'indigo':
        return 'bg-indigo-100 text-indigo-800';
      case 'yellow':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <nav className="bg-gray-800 text-white w-64 min-h-screen p-4">
      {/* Logo/Header */}
      <div className="mb-8 text-center">
        <div className="text-2xl font-bold mb-2">🌽 CORNMAN</div>
        <div className="text-sm text-gray-300">Strategic HQ</div>
        <div className="text-xs text-yellow-400 font-medium mt-1">🚀 VIRAL EDITION</div>
      </div>

      {/* Special Viral Alert */}
      <div className="mb-6 p-3 bg-gradient-to-r from-red-500 to-pink-600 rounded-lg text-center">
        <div className="text-sm font-bold animate-pulse">🔥 NEW FEATURE! 🔥</div>
        <div className="text-xs mt-1 opacity-90">World's First Viral Guarantee System!</div>
        <button
          onClick={() => onSectionChange('viral-prediction')}
          className="mt-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-3 py-1 rounded-full text-xs font-medium transition-all"
        >
          Try Now! 🚀
        </button>
      </div>

      {/* Navigation Items */}
      <div className="space-y-2">
        {navigationItems.map((item) => (
          <div
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            className={getItemClasses(item)}
          >
            {/* Icon */}
            <span className="text-xl mr-3">{item.icon}</span>

            {/* Label */}
            <span className="flex-1">{item.label}</span>

            {/* Badge */}
            {item.badge && (
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getBadgeClasses(item, activeSection === item.id)}`}
              >
                {item.badge}
              </span>
            )}

            {/* Hot/New indicators */}
            {item.isHot && (
              <div className="absolute -top-1 -right-1">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                <div className="absolute top-0 w-3 h-3 bg-red-500 rounded-full"></div>
              </div>
            )}

            {item.isNew && (
              <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                NEW
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom Section */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-gray-700 rounded-lg p-3 text-center">
          <div className="text-xs text-gray-300 mb-2">🎯 Viral Status</div>
          <div className="text-lg font-bold text-green-400">95% Success Rate</div>
          <div className="text-xs text-gray-400">Guaranteed viral content!</div>
        </div>

        <div className="mt-4 text-center">
          <div className="text-xs text-gray-400">Powered by CORNMAN AI™</div>
          <div className="text-xs text-yellow-400 font-medium">🇲🇾 Made in Malaysia</div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
