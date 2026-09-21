import React from 'react';
import { Layers, ShoppingBag, Banknote, AlertTriangle } from 'lucide-react';
import { formatTaka } from '../utils/storage';

interface StatsCardsProps {
  totalModels: number;
  totalUnitsInStock: number;
  totalCostCapital: number;
  outOfStockCount: number;
  isPrivacyMode: boolean;
  onFilterOutOfStock: () => void;
  selectedFilter: string;
  isDarkMode?: boolean;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  totalModels,
  totalUnitsInStock,
  totalCostCapital,
  outOfStockCount,
  isPrivacyMode,
  onFilterOutOfStock,
  selectedFilter,
  isDarkMode = true,
}) => {
  const cardBg = isDarkMode 
    ? 'bg-slate-900 border-slate-800' 
    : 'bg-white border-slate-200 shadow-sm';
  const labelColor = isDarkMode ? 'text-slate-400' : 'text-slate-500';
  const numColor = isDarkMode ? 'text-white' : 'text-slate-900';
  const iconBg = isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600';

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 my-3">
      {/* 1. Total Models */}
      <div 
        id="stat-total-models" 
        className={`${cardBg} border rounded-2xl p-3 sm:p-4 relative overflow-hidden transition-colors`}
      >
        <div className="flex items-center justify-between">
          <span className={`text-xs sm:text-sm font-medium ${labelColor}`}>মোট ডিসপ্লে মডেল</span>
          <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center`}>
            <Layers className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className={`text-xl sm:text-2xl font-bold font-mono-num ${numColor}`}>{totalModels}</span>
          <span className={`text-xs ${labelColor}`}>টি মডেল</span>
        </div>
      </div>

      {/* 2. Total In-Stock Units */}
      <div 
        id="stat-total-units" 
        className={`${cardBg} border rounded-2xl p-3 sm:p-4 relative overflow-hidden transition-colors`}
      >
        <div className="flex items-center justify-between">
          <span className={`text-xs sm:text-sm font-medium ${labelColor}`}>দোকানে মজুদ সংখ্যা</span>
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            isDarkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600'
          }`}>
            <ShoppingBag className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className={`text-xl sm:text-2xl font-bold font-mono-num ${
            isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
          }`}>{totalUnitsInStock}</span>
          <span className={`text-xs ${labelColor}`}>পিস ডিসপ্লে</span>
        </div>
      </div>

      {/* 3. Total Cost Capital */}
      <div 
        id="stat-total-capital" 
        className={`${cardBg} border rounded-2xl p-3 sm:p-4 relative overflow-hidden transition-colors`}
      >
        <div className="flex items-center justify-between">
          <span className={`text-xs sm:text-sm font-medium ${labelColor}`}>মোট কেনা মূলধন</span>
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            isDarkMode ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-50 text-amber-600'
          }`}>
            <Banknote className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className={`text-lg sm:text-2xl font-bold font-mono-num ${
            isDarkMode ? 'text-amber-400' : 'text-amber-600'
          }`}>
            {isPrivacyMode ? '••••••' : formatTaka(totalCostCapital)}
          </span>
        </div>
      </div>

      {/* 4. Out of Stock alert (clickable filter) */}
      <button 
        id="stat-out-of-stock"
        onClick={onFilterOutOfStock}
        className={`text-left rounded-2xl p-3 sm:p-4 relative overflow-hidden transition-all cursor-pointer border ${
          selectedFilter === 'outOfStock'
            ? isDarkMode
              ? 'bg-rose-500/15 border-rose-500/60 shadow-md shadow-rose-950/20'
              : 'bg-rose-100 border-rose-300 shadow-sm'
            : outOfStockCount > 0
              ? isDarkMode
                ? 'bg-slate-900 border-rose-900/50 hover:border-rose-700/60'
                : 'bg-rose-50/50 border-rose-200 hover:border-rose-300'
              : isDarkMode
                ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
                : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className={`text-xs sm:text-sm font-medium ${labelColor}`}>স্টক শেষ (০ পিস)</span>
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            outOfStockCount > 0 
              ? isDarkMode ? 'bg-rose-500/15 text-rose-400' : 'bg-rose-100 text-rose-600'
              : iconBg
          }`}>
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className={`text-xl sm:text-2xl font-bold font-mono-num ${
            outOfStockCount > 0 
              ? isDarkMode ? 'text-rose-400' : 'text-rose-600'
              : numColor
          }`}>
            {outOfStockCount}
          </span>
          <span className={`text-xs ${labelColor}`}>টি আনতে হবে</span>
        </div>
      </button>
    </div>
  );
};
