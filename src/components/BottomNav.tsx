import React from 'react';
import { Home, PlusCircle, Gift } from 'lucide-react';

interface BottomNavProps {
  onHomeClick: () => void;
  onAddClick: () => void;
  onAboutClick: () => void;
  activeTab: 'home' | 'add' | 'about';
  isDarkMode?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  onHomeClick,
  onAddClick,
  onAboutClick,
  activeTab,
  isDarkMode = true,
}) => {
  return (
    <nav 
      id="mobile-bottom-navigation"
      className={`fixed bottom-0 left-0 right-0 z-40 border-t px-3 py-2 transition-colors ${
        isDarkMode 
          ? 'bg-slate-900 border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.4)]' 
          : 'bg-white border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]'
      }`}
    >
      <div className="max-w-md mx-auto flex items-center justify-around">
        {/* 1. Home / All Displays */}
        <button
          id="bottom-nav-home"
          onClick={onHomeClick}
          className={`flex flex-col items-center justify-center py-1 px-4 rounded-xl transition-all cursor-pointer ${
            activeTab === 'home'
              ? isDarkMode 
                ? 'text-amber-400 bg-amber-500/10' 
                : 'text-amber-600 bg-amber-50'
              : isDarkMode 
                ? 'text-slate-400 hover:text-slate-200' 
                : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-xs font-semibold mt-1">সব ডিসপ্লে</span>
        </button>

        {/* 2. Add Display (Prominent Center Button) */}
        <button
          id="bottom-nav-add"
          onClick={onAddClick}
          className="flex items-center gap-1.5 py-2 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
        >
          <PlusCircle className="w-4 h-4 stroke-[2.5]" />
          <span>+ নতুন ডিসপ্লে</span>
        </button>

        {/* 3. About Button */}
        <button
          id="bottom-nav-about"
          onClick={onAboutClick}
          className={`flex flex-col items-center justify-center py-1 px-4 rounded-xl transition-all cursor-pointer ${
            activeTab === 'about'
              ? isDarkMode 
                ? 'text-amber-400 bg-amber-500/10' 
                : 'text-amber-600 bg-amber-50'
              : isDarkMode 
                ? 'text-slate-400 hover:text-slate-200' 
                : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <Gift className="w-5 h-5" />
          <span className="text-xs font-semibold mt-1">এবাউট</span>
        </button>
      </div>
    </nav>
  );
};
