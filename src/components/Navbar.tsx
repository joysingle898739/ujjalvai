import React from 'react';
import { 
  Smartphone, 
  PlusCircle, 
  Eye, 
  EyeOff, 
  HardDriveDownload,
  PackageCheck,
  Moon,
  Sun
} from 'lucide-react';

interface NavbarProps {
  onOpenAddModal: () => void;
  onOpenBackupModal: () => void;
  isPrivacyMode: boolean;
  onTogglePrivacyMode: () => void;
  totalDisplays: number;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAddModal,
  onOpenBackupModal,
  isPrivacyMode,
  onTogglePrivacyMode,
  totalDisplays,
  isDarkMode,
  onToggleTheme,
}) => {
  return (
    <header className={`sticky top-0 z-30 border-b transition-colors ${
      isDarkMode 
        ? 'bg-slate-900 border-slate-800 shadow-md' 
        : 'bg-white border-slate-200 shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Shop Branding */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold flex-shrink-0 shadow-sm">
              <Smartphone className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="truncate">
              <div className="flex items-center gap-2">
                <h1 className={`text-base sm:text-lg font-bold tracking-tight truncate ${
                  isDarkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  উজ্জ্বল ভাইয়ের দোকান
                </h1>
                <span className={`hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                  isDarkMode 
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' 
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}>
                  <PackageCheck className="w-3 h-3" />
                  স্টক: {totalDisplays} টি
                </span>
              </div>
              <p className={`text-[11px] sm:text-xs truncate ${
                isDarkMode ? 'text-slate-400' : 'text-slate-500'
              }`}>
                মোবাইল ডিসপ্লে স্টক ও আসল কেনা দামের ডিজিটাল খাতা
              </p>
            </div>
          </div>

          {/* Quick Action Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            
            {/* Dark Mode & White Mode Toggle (ডার্ক মোড ও সাদা মোড ছোট বাটন) */}
            <div 
              id="theme-toggle-group"
              className={`flex items-center p-0.5 rounded-xl border text-[11px] font-bold transition-all ${
                isDarkMode 
                  ? 'bg-slate-800 border-slate-700' 
                  : 'bg-slate-100 border-slate-300'
              }`}
            >
              <button
                type="button"
                id="theme-dark-btn"
                onClick={() => !isDarkMode && onToggleTheme()}
                className={`flex items-center gap-1 px-2 py-1.5 rounded-lg transition-all cursor-pointer ${
                  isDarkMode 
                    ? 'bg-slate-950 text-amber-400 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="ডার্ক মোড (কালো)"
              >
                <Moon className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">ডার্ক</span>
              </button>
              <button
                type="button"
                id="theme-light-btn"
                onClick={() => isDarkMode && onToggleTheme()}
                className={`flex items-center gap-1 px-2 py-1.5 rounded-lg transition-all cursor-pointer ${
                  !isDarkMode 
                    ? 'bg-white text-slate-900 shadow-sm border border-slate-200' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="সাদা মোড (আলো)"
              >
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden xs:inline">সাদা</span>
              </button>
            </div>

            {/* Privacy Mode Toggle (কেনা দাম লুকানো / দেখানো) */}
            <button
              id="privacy-toggle-btn"
              onClick={onTogglePrivacyMode}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                isPrivacyMode 
                  ? isDarkMode
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 hover:bg-amber-500/25' 
                    : 'bg-amber-100 border-amber-300 text-amber-900 hover:bg-amber-200'
                  : isDarkMode
                    ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750 hover:text-white'
                    : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
              }`}
              title={isPrivacyMode ? "কাস্টমার মোড: কেনা দাম গোপন আছে" : "কেনা দাম দেখা যাচ্ছে"}
            >
              {isPrivacyMode ? (
                <>
                  <EyeOff className="w-4 h-4 text-amber-500" />
                  <span className="hidden sm:inline">দাম লুকানো</span>
                </>
              ) : (
                <>
                  <Eye className={`w-4 h-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                  <span className="hidden sm:inline">দাম দৃশ্যমান</span>
                </>
              )}
            </button>

            {/* Mobile Storage Backup Modal Button */}
            <button
              id="backup-storage-btn"
              onClick={onOpenBackupModal}
              className={`p-2 sm:px-3 sm:py-2 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 text-xs sm:text-sm font-medium ${
                isDarkMode
                  ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-750'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
              }`}
              title="ফোনের স্টোরেজ ব্যাকআপ ও রিস্টোর"
            >
              <HardDriveDownload className="w-4 h-4 text-cyan-500" />
              <span className="hidden md:inline">ব্যাকআপ</span>
            </button>

            {/* Add New Display Button - Prominent */}
            <button
              id="add-display-btn"
              onClick={onOpenAddModal}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 stroke-[2.5]" />
              <span>+ নতুন ডিসপ্লে</span>
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
