"use client";

import { Dispatch, SetStateAction } from "react";

interface SidebarProps {
  currentView: 'list' | 'add' | 'edit' | 'preview';
  setCurrentView: Dispatch<SetStateAction<'list' | 'add' | 'edit' | 'preview'>>;
  setSelectedProduct: Dispatch<SetStateAction<any>>;
}

export function Sidebar({ currentView, setCurrentView, setSelectedProduct }: SidebarProps) {
  const menuItems = [
    { id: 'list', label: 'Product List', icon: '📋' },
    { id: 'add', label: 'Add Product', icon: '➕' },
  ];

  const handleMenuClick = (viewId: 'list' | 'add' | 'edit' | 'preview') => {
    setCurrentView(viewId);
    if (viewId === 'list' || viewId === 'add') {
      setSelectedProduct(null);
    }
  };

  return (
    <div className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-gray-200">
      <div className="p-4 md:p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
        
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.id as any)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors border ${
                currentView === item.id
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border-gray-200'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="text-sm text-gray-500 mb-2">Quick Stats</div>
          <div className="space-y-1 text-sm">
            <div className="text-gray-700">Total Products: <span className="text-gray-900 font-semibold">150</span></div>
            <div className="text-gray-700">Categories: <span className="text-gray-900 font-semibold">8</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}