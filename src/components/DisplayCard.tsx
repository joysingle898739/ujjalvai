import React from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  MapPin, 
  Edit3, 
  Trash2, 
  Plus, 
  Minus, 
  Coins
} from 'lucide-react';
import { DisplayItem } from '../types';
import { formatTaka } from '../utils/storage';

interface DisplayCardProps {
  item: DisplayItem;
  isPrivacyMode: boolean;
  onUpdateStock: (id: string, delta: number) => void;
  onEdit: (item: DisplayItem) => void;
  onDelete: (id: string, modelName: string) => void;
  isHighlighted?: boolean;
  isDarkMode?: boolean;
}

export const DisplayCard: React.FC<DisplayCardProps> = ({
  item,
  isPrivacyMode,
  onUpdateStock,
  onEdit,
  onDelete,
  isHighlighted = false,
  isDarkMode = true,
}) => {
  const inStock = item.stockQuantity > 0;

  return (
    <div
      id={`display-card-${item.id}`}
      className={`rounded-2xl border transition-all duration-150 flex flex-col justify-between overflow-hidden relative shadow-sm ${
        isHighlighted
          ? 'ring-2 ring-amber-400 border-amber-400 ' + (isDarkMode ? 'bg-slate-900' : 'bg-amber-50/40')
          : inStock
            ? isDarkMode
              ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
              : 'bg-white border-slate-200 hover:border-slate-300'
            : isDarkMode
              ? 'bg-slate-900/90 border-rose-950/60 hover:border-rose-900/80'
              : 'bg-rose-50/40 border-rose-200 hover:border-rose-300'
      }`}
    >
      {/* Card Header & Details */}
      <div className="p-4">
        {/* Brand, Quality & Stock Availability Badge */}
        <div className="flex items-center justify-between gap-1.5 mb-2">
          <div className="flex items-center gap-1.5">
            <span className={`text-xs font-bold px-2 py-0.5 rounded-lg border ${
              isDarkMode 
                ? 'bg-slate-800 text-slate-200 border-slate-700' 
                : 'bg-slate-100 text-slate-800 border-slate-200'
            }`}>
              {item.brand}
            </span>
            <span className={`text-[11px] font-medium px-2 py-0.5 rounded-lg ${
              isDarkMode ? 'bg-slate-800/80 text-slate-300' : 'bg-slate-100 text-slate-600'
            }`}>
              {item.quality}
            </span>
          </div>

          {/* Stock Availability Badge */}
          {inStock ? (
            <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex-shrink-0 border ${
              isDarkMode 
                ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' 
                : 'text-emerald-700 bg-emerald-50 border-emerald-200'
            }`}>
              <CheckCircle2 className="w-3.5 h-3.5" />
              দোকানে আছে
            </span>
          ) : (
            <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex-shrink-0 border ${
              isDarkMode 
                ? 'text-rose-400 bg-rose-500/10 border-rose-500/20' 
                : 'text-rose-700 bg-rose-50 border-rose-200'
            }`}>
              <XCircle className="w-3.5 h-3.5" />
              স্টক শেষ (০)
            </span>
          )}
        </div>

        {/* Model Name - Big, Clear & High Contrast */}
        <h3 className={`text-base sm:text-lg font-bold tracking-tight leading-snug ${
          isDarkMode ? 'text-white' : 'text-slate-900'
        }`}>
          {item.model}
        </h3>

        {/* Box Location & Stock Quantity */}
        <div className="mt-2.5 flex items-center gap-2 text-xs">
          <div className={`flex items-center gap-1.5 font-medium px-2.5 py-1 rounded-lg border ${
            isDarkMode 
              ? 'text-cyan-300 bg-slate-950 border-slate-800' 
              : 'text-cyan-800 bg-cyan-50 border-cyan-200'
          }`}>
            <MapPin className={`w-3.5 h-3.5 flex-shrink-0 ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`} />
            <span>বক্স: <strong className={isDarkMode ? 'text-white' : 'text-slate-900'}>{item.boxLocation || 'বক্স-০১'}</strong></span>
          </div>
          
          <div className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium border ${
            isDarkMode 
              ? 'text-slate-300 bg-slate-950 border-slate-800' 
              : 'text-slate-700 bg-slate-100 border-slate-200'
          }`}>
            <span>স্টকে: <strong className={inStock ? (isDarkMode ? 'text-emerald-400' : 'text-emerald-600') + ' font-bold' : (isDarkMode ? 'text-rose-400' : 'text-rose-600') + ' font-bold'}>{item.stockQuantity} পিস</strong></span>
          </div>
        </div>

        {item.notes && (
          <p className={`text-xs mt-2 p-2 rounded-lg border ${
            isDarkMode 
              ? 'text-slate-400 bg-slate-950/60 border-slate-800/80' 
              : 'text-slate-600 bg-slate-50 border-slate-200'
          }`}>
            {item.notes}
          </p>
        )}

        {/* Original Buy Price Box (আসল কেনা দাম) */}
        <div className={`mt-3 p-3 rounded-xl border flex items-center justify-between ${
          isDarkMode 
            ? 'bg-slate-950 border-slate-800' 
            : 'bg-amber-50/70 border-amber-200'
        }`}>
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
              isDarkMode ? 'bg-amber-500/15 text-amber-400' : 'bg-amber-100 text-amber-600'
            }`}>
              <Coins className="w-4 h-4" />
            </div>
            <div>
              <span className={`block text-[11px] font-bold ${
                isDarkMode ? 'text-amber-300' : 'text-amber-900'
              }`}>
                আসল কেনা দাম
              </span>
              <span className={`text-[10px] ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                (দোকানের খরচ)
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className={`text-xl sm:text-2xl font-black font-mono-num tracking-tight ${
              isDarkMode ? 'text-amber-400' : 'text-amber-600'
            }`}>
              {isPrivacyMode ? '••••••' : formatTaka(item.costPrice)}
            </span>
          </div>
        </div>
      </div>

      {/* Card Action Footer: 1-Tap Stock Stepper + Edit / Delete */}
      <div className={`px-3.5 py-2.5 border-t flex items-center justify-between gap-2 ${
        isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
      }`}>
        {/* Quick Stock Stepper */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onUpdateStock(item.id, -1)}
            disabled={item.stockQuantity <= 0}
            title="১টি বিক্রি হলো (স্টক -১)"
            className={`h-8 px-2 rounded-lg border flex items-center gap-1 text-xs font-semibold transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer active:scale-95 ${
              isDarkMode 
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' 
                : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300 shadow-xs'
            }`}
          >
            <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="hidden sm:inline">বিক্রি</span>
          </button>
          
          <div className={`px-2 py-1 rounded-lg border text-center min-w-[50px] ${
            isDarkMode 
              ? 'bg-slate-900 border-slate-800' 
              : 'bg-white border-slate-300'
          }`}>
            <span className={`text-xs sm:text-sm font-bold font-mono-num ${
              inStock 
                ? isDarkMode ? 'text-white' : 'text-slate-900' 
                : isDarkMode ? 'text-rose-400' : 'text-rose-600'
            }`}>
              {item.stockQuantity}
            </span>
            <span className={`text-[10px] ml-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>টি</span>
          </div>

          <button
            type="button"
            onClick={() => onUpdateStock(item.id, 1)}
            title="স্টক ১টি বাড়ান (+১)"
            className={`h-8 px-2 rounded-lg border flex items-center gap-1 text-xs font-semibold transition-all cursor-pointer active:scale-95 ${
              isDarkMode 
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' 
                : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300 shadow-xs'
            }`}
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="hidden sm:inline">যোগ</span>
          </button>
        </div>

        {/* Explicit Edit & Delete Actions */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onEdit(item)}
            title="ডিসপ্লে তথ্য পরিবর্তন করুন"
            className={`h-8 px-2.5 rounded-lg transition-all cursor-pointer active:scale-95 border flex items-center gap-1 text-xs font-medium ${
              isDarkMode 
                ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' 
                : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-300 shadow-xs'
            }`}
          >
            <Edit3 className={`w-3.5 h-3.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`} />
            <span className="hidden sm:inline">এডিট</span>
          </button>
          
          <button
            type="button"
            onClick={() => onDelete(item.id, item.model)}
            title="তালিকা থেকে এই মডেলটি ডিলিট করুন"
            className={`h-8 px-2.5 rounded-lg border transition-all cursor-pointer active:scale-95 flex items-center gap-1 text-xs font-bold ${
              isDarkMode 
                ? 'bg-rose-950/60 hover:bg-rose-900/90 text-rose-300 border-rose-800/60' 
                : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>মুছুন</span>
          </button>
        </div>
      </div>
    </div>
  );
};
