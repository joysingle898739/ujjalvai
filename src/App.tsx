import { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Search, 
  PlusCircle, 
  SlidersHorizontal, 
  Sparkles, 
  Check, 
  AlertCircle,
  PackageSearch,
  ArrowUpDown,
  Trash2,
  X,
  Heart,
  Gift,
  Smartphone
} from 'lucide-react';
import { DisplayItem, SortOption } from './types';
import { 
  loadDisplaysFromStorage, 
  saveDisplaysToStorage, 
  getPrivacyModeFromStorage, 
  savePrivacyModeToStorage,
  getThemeFromStorage,
  saveThemeToStorage,
  normalizeSearchQuery 
} from './utils/storage';
import { Navbar } from './components/Navbar';
import { StatsCards } from './components/StatsCards';
import { DisplayCard } from './components/DisplayCard';
import { SpecialSearchModal } from './components/SpecialSearchModal';
import { AddEditModal } from './components/AddEditModal';
import { BackupModal } from './components/BackupModal';
import { BottomNav } from './components/BottomNav';
import { AboutModal } from './components/AboutModal';
import { ApkDownloadModal } from './components/ApkDownloadModal';

export default function App() {
  // 1. Core State with Mobile Storage Synchronization
  const [displays, setDisplays] = useState<DisplayItem[]>(() => loadDisplaysFromStorage());
  const [isPrivacyMode, setIsPrivacyMode] = useState<boolean>(() => getPrivacyModeFromStorage());
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => getThemeFromStorage());
  
  // 2. Filter & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'inStock' | 'outOfStock'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('latest');
  const [activeBottomNav, setActiveBottomNav] = useState<'home' | 'add' | 'about'>('home');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // 3. Modals State
  const [isSpecialSearchOpen, setIsSpecialSearchOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isApkModalOpen, setIsApkModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<DisplayItem | null>(null);
  const [initialModelForAdd, setInitialModelForAdd] = useState('');
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);
  const [highlightedId, setHighlightedId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; modelName: string } | null>(null);

  // 4. Toast Notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);
  const toastTimeoutRef = useRef<number | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToast({ message, type });
    toastTimeoutRef.current = window.setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // Shortcut Ctrl+K to focus search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Save displays to localStorage whenever they change
  useEffect(() => {
    saveDisplaysToStorage(displays);
  }, [displays]);

  // Synchronize Theme (Dark / Light)
  useEffect(() => {
    saveThemeToStorage(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    showToast(next ? 'ডার্ক মোড চালু হয়েছে' : 'সাদা মোড চালু হয়েছে', 'info');
  };

  // Save privacy mode preference
  const togglePrivacyMode = () => {
    const next = !isPrivacyMode;
    setIsPrivacyMode(next);
    savePrivacyModeToStorage(next);
    showToast(next ? 'কেনা দাম গোপন করা হয়েছে (কাস্টমার মোড)' : 'কেনা দাম দৃশ্যমান করা হয়েছে', 'info');
  };

  // Keyboard shortcut Ctrl+K or / to open Special Search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey && e.key === 'k') || (e.key === '/' && document.activeElement?.tagName !== 'INPUT')) {
        e.preventDefault();
        setIsSpecialSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handlers for Stock update
  const handleUpdateStock = (id: string, delta: number) => {
    setDisplays((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = Math.max(0, item.stockQuantity + delta);
          return {
            ...item,
            stockQuantity: newQty,
            updatedAt: new Date().toISOString(),
          };
        }
        return item;
      })
    );
    if (delta > 0) {
      showToast('স্টক ১ পিস বাড়ানো হয়েছে', 'success');
    } else {
      showToast('১টি বিক্রি হিসেবে স্টক কমানো হয়েছে', 'info');
    }
  };

  // Save new or edited display item
  const handleSaveDisplay = (
    itemData: Omit<DisplayItem, 'id' | 'createdAt' | 'updatedAt'>,
    editId?: string
  ) => {
    if (editId) {
      // Update
      setDisplays((prev) =>
        prev.map((d) =>
          d.id === editId
            ? {
                ...d,
                ...itemData,
                updatedAt: new Date().toISOString(),
              }
            : d
        )
      );
      showToast(`"${itemData.model}" এর তথ্য আপডেট হয়েছে!`, 'success');
    } else {
      // Create new
      const newItem: DisplayItem = {
        ...itemData,
        id: `disp-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setDisplays((prev) => [newItem, ...prev]);
      showToast(`নতুন ডিসপ্লে "${itemData.model}" সেভ হয়েছে!`, 'success');
    }
    setEditItem(null);
    setInitialModelForAdd('');
  };

  // Open Edit Modal
  const handleEdit = (item: DisplayItem) => {
    setEditItem(item);
    setIsAddModalOpen(true);
  };

  // Delete Display Item
  const confirmDelete = () => {
    if (!deleteConfirm) return;
    setDisplays((prev) => prev.filter((d) => d.id !== deleteConfirm.id));
    showToast(`"${deleteConfirm.modelName}" লিস্ট থেকে মুছে ফেলা হয়েছে`, 'info');
    setDeleteConfirm(null);
  };

  // Restore list from backup file
  const handleRestoreDisplays = (restoredList: DisplayItem[]) => {
    setDisplays(restoredList);
    showToast(`${restoredList.length} টি ডিসপ্লের রেকর্ড রিস্টোর করা হয়েছে`, 'success');
  };

  // Reset to Home View (scroll top, clear filters)
  const handleHomeClick = () => {
    setActiveBottomNav('home');
    setSearchQuery('');
    setSelectedBrand('all');
    setStockFilter('all');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToast('হোম পেজে ফিরে এসেছেন', 'info');
  };

  // Scroll to and highlight card when selected from Special Search
  const handleSelectDisplay = (item: DisplayItem) => {
    setHighlightedId(item.id);
    setSelectedBrand('all');
    setStockFilter('all');
    setSearchQuery('');
    
    setTimeout(() => {
      const element = document.getElementById(`display-card-${item.id}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);

    setTimeout(() => {
      setHighlightedId(null);
    }, 3000);
  };

  // Computed summary metrics
  const totalModels = displays.length;
  const totalUnitsInStock = useMemo(
    () => displays.reduce((sum, d) => sum + d.stockQuantity, 0),
    [displays]
  );
  const totalCostCapital = useMemo(
    () => displays.reduce((sum, d) => sum + (d.costPrice * d.stockQuantity), 0),
    [displays]
  );
  const outOfStockCount = useMemo(
    () => displays.filter((d) => d.stockQuantity === 0).length,
    [displays]
  );

  // Available brands in the current inventory
  const availableBrands = useMemo(() => {
    return Array.from(new Set(displays.map((d) => d.brand)));
  }, [displays]);

  // Filtered & sorted displays for the main view
  const filteredDisplays = useMemo(() => {
    const normSearch = normalizeSearchQuery(searchQuery);

    const filtered = displays.filter((item) => {
      // Brand filter
      if (selectedBrand !== 'all' && item.brand !== selectedBrand) {
        return false;
      }

      // Stock status filter
      if (stockFilter === 'inStock' && item.stockQuantity <= 0) return false;
      if (stockFilter === 'outOfStock' && item.stockQuantity > 0) return false;

      // Text search filter
      if (normSearch) {
        const normModel = normalizeSearchQuery(item.model);
        const normBrand = normalizeSearchQuery(item.brand);
        const normQuality = normalizeSearchQuery(item.quality);
        const normBox = normalizeSearchQuery(item.boxLocation);
        const normNotes = normalizeSearchQuery(item.notes || '');

        const matches =
          normModel.includes(normSearch) ||
          normBrand.includes(normSearch) ||
          normQuality.includes(normSearch) ||
          normBox.includes(normSearch) ||
          normNotes.includes(normSearch);

        if (!matches) return false;
      }

      return true;
    });

    // Sorting
    return filtered.sort((a, b) => {
      if (sortBy === 'latest') {
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      }
      if (sortBy === 'nameAsc') {
        return a.model.localeCompare(b.model);
      }
      if (sortBy === 'priceLow') {
        return a.costPrice - b.costPrice;
      }
      if (sortBy === 'priceHigh') {
        return b.costPrice - a.costPrice;
      }
      if (sortBy === 'stockHigh') {
        return b.stockQuantity - a.stockQuantity;
      }
      if (sortBy === 'stockLow') {
        return a.stockQuantity - b.stockQuantity;
      }
      return 0;
    });
  }, [displays, searchQuery, selectedBrand, stockFilter, sortBy]);

  return (
    <div className={`min-h-screen flex flex-col font-sans pb-24 transition-colors ${
      isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'
    }`}>
      
      {/* 1. Header Navbar with Dark / White mode button */}
      <Navbar
        onOpenAddModal={() => {
          setEditItem(null);
          setInitialModelForAdd('');
          setIsAddModalOpen(true);
        }}
        onOpenBackupModal={() => setIsBackupModalOpen(true)}
        isPrivacyMode={isPrivacyMode}
        onTogglePrivacyMode={togglePrivacyMode}
        totalDisplays={totalUnitsInStock}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 w-full flex-1">
        
        {/* 2. Key Inventory Stats */}
        <StatsCards
          totalModels={totalModels}
          totalUnitsInStock={totalUnitsInStock}
          totalCostCapital={totalCostCapital}
          outOfStockCount={outOfStockCount}
          isPrivacyMode={isPrivacyMode}
          onFilterOutOfStock={() => {
            setStockFilter(stockFilter === 'outOfStock' ? 'all' : 'outOfStock');
          }}
          selectedFilter={stockFilter}
          isDarkMode={isDarkMode}
        />

        {/* 3. Main Search & Add Section - Prominent & Sober */}
        <div className={`rounded-2xl p-3 sm:p-4 my-3 border shadow-sm space-y-3 transition-colors ${
          isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          
          {/* Fast Search Input & Add Display Button */}
          <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
            {/* Live Model Search Input */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-amber-500" />
              </div>
              <input
                ref={searchInputRef}
                id="main-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="মডেলের নাম বা নম্বর লিখুন (যেমন: A50, Y20, Note 10, C25)..."
                className={`w-full pl-11 pr-10 py-2.5 sm:py-3 border rounded-xl text-sm sm:text-base font-medium focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-colors ${
                  isDarkMode 
                    ? 'bg-slate-950 border-slate-700 text-white placeholder-slate-400' 
                    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-500'
                }`}
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  title="সার্চ মুছুন"
                  className={`absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer ${
                    isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Prominent Add New Display Button */}
            <button
              id="main-add-display-btn"
              type="button"
              onClick={() => {
                setEditItem(null);
                setInitialModelForAdd(searchQuery);
                setIsAddModalOpen(true);
              }}
              className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 flex-shrink-0"
            >
              <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
              <span>+ নতুন ডিসপ্লে ও দাম লিখুন</span>
            </button>
          </div>

          {/* Search Result Feedback Indicator */}
          {searchQuery && (
            <div className={`pt-2 border-t flex items-center justify-between text-xs ${
              isDarkMode ? 'border-slate-800' : 'border-slate-200'
            }`}>
              <span className={`font-medium ${isDarkMode ? 'text-amber-300' : 'text-amber-800'}`}>
                🔍 <strong>&quot;{searchQuery}&quot;</strong> দিয়ে {filteredDisplays.length} টি ডিসপ্লে পাওয়া গেছে
              </span>
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className={`underline cursor-pointer ${
                  isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                সব ডিসপ্লে দেখুন (X)
              </button>
            </div>
          )}

          {/* Controls: Stock Filter & Sort */}
          <div className="flex items-center justify-between gap-2 flex-wrap pt-0.5">
            {/* Stock Filter Pills */}
            <div className={`flex items-center p-1 rounded-xl border text-xs ${
              isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
            }`}>
              <button
                onClick={() => setStockFilter('all')}
                className={`px-3 py-1.5 rounded-lg font-medium cursor-pointer transition-colors ${
                  stockFilter === 'all'
                    ? isDarkMode 
                      ? 'bg-slate-800 text-white font-bold' 
                      : 'bg-white text-slate-900 font-bold shadow-xs'
                    : isDarkMode 
                      ? 'text-slate-400 hover:text-slate-200' 
                      : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                সব ({displays.length})
              </button>
              <button
                onClick={() => setStockFilter('inStock')}
                className={`px-3 py-1.5 rounded-lg font-medium cursor-pointer transition-colors ${
                  stockFilter === 'inStock'
                    ? isDarkMode 
                      ? 'bg-emerald-500/20 text-emerald-300 font-bold' 
                      : 'bg-emerald-100 text-emerald-800 font-bold'
                    : isDarkMode 
                      ? 'text-slate-400 hover:text-slate-200' 
                      : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                দোকানে আছে ({displays.filter(d => d.stockQuantity > 0).length})
              </button>
              <button
                onClick={() => setStockFilter('outOfStock')}
                className={`px-3 py-1.5 rounded-lg font-medium cursor-pointer transition-colors ${
                  stockFilter === 'outOfStock'
                    ? isDarkMode 
                      ? 'bg-rose-500/20 text-rose-300 font-bold' 
                      : 'bg-rose-100 text-rose-800 font-bold'
                    : isDarkMode 
                      ? 'text-slate-400 hover:text-slate-200' 
                      : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                স্টক শেষ ({outOfStockCount})
              </button>
            </div>

            {/* Sort By Dropdown */}
            <div className="relative flex items-center">
              <div className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-xl text-xs ${
                isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-white border-slate-300 text-slate-700 shadow-xs'
              }`}>
                <ArrowUpDown className="w-3.5 h-3.5 text-amber-500" />
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  aria-label="ডিসপ্লে সাজানোর নিয়ম"
                  className={`bg-transparent text-xs focus:outline-none cursor-pointer pr-1 font-medium ${
                    isDarkMode ? 'text-white' : 'text-slate-800'
                  }`}
                >
                  <option value="latest" className={isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}>নতুন এন্ট্রি আগে</option>
                  <option value="nameAsc" className={isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}>মডেল নাম (A-Z)</option>
                  <option value="priceLow" className={isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}>কেনা দাম (কম থেকে বেশি)</option>
                  <option value="priceHigh" className={isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}>কেনা দাম (বেশি থেকে কম)</option>
                  <option value="stockHigh" className={isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}>স্টক বেশি আগে</option>
                  <option value="stockLow" className={isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}>স্টক কম আগে</option>
                </select>
              </div>
            </div>
          </div>

          {/* Brand Filter Horizontal Scroll Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-0.5 scrollbar-none text-xs">
            <span className={`text-[11px] font-semibold mr-1 flex items-center gap-1 ${
              isDarkMode ? 'text-slate-400' : 'text-slate-500'
            }`}>
              <SlidersHorizontal className="w-3 h-3" />
              ব্র্যান্ড:
            </span>
            <button
              onClick={() => setSelectedBrand('all')}
              className={`px-3 py-1.5 rounded-lg font-bold whitespace-nowrap cursor-pointer transition-all ${
                selectedBrand === 'all'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : isDarkMode
                    ? 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-300 shadow-xs'
              }`}
            >
              সব ব্র্যান্ড
            </button>
            {availableBrands.map((b) => (
              <button
                key={b}
                onClick={() => setSelectedBrand(b)}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap cursor-pointer transition-all ${
                  selectedBrand === b
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : isDarkMode
                      ? 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                      : 'bg-white text-slate-700 hover:text-slate-900 border border-slate-300 shadow-xs'
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Display Cards Grid */}
        <div className="my-4">
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className={`text-xs sm:text-sm font-bold ${
              isDarkMode ? 'text-slate-300' : 'text-slate-700'
            }`}>
              ডিসপ্লে তালিকা ({filteredDisplays.length} টি পাওয়া গেছে)
            </h3>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className={`text-xs font-semibold hover:underline cursor-pointer ${
                  isDarkMode ? 'text-amber-400' : 'text-amber-700'
                }`}
              >
                সার্চ মুছুন
              </button>
            )}
          </div>

          {filteredDisplays.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {filteredDisplays.map((item) => (
                <DisplayCard
                  key={item.id}
                  item={item}
                  isPrivacyMode={isPrivacyMode}
                  onUpdateStock={handleUpdateStock}
                  onEdit={handleEdit}
                  onDelete={(id, modelName) => setDeleteConfirm({ id, modelName })}
                  isHighlighted={highlightedId === item.id}
                  isDarkMode={isDarkMode}
                />
              ))}
            </div>
          ) : (
            /* Friendly Empty State with Direct Add Action */
            <div className={`border rounded-2xl p-6 sm:p-8 text-center my-4 transition-colors ${
              isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className={`w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-3 ${
                isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'
              }`}>
                <PackageSearch className="w-6 h-6" />
              </div>
              <h4 className={`text-base font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                কোনো ডিসপ্লে পাওয়া যায়নি
              </h4>
              <p className={`text-xs sm:text-sm max-w-sm mx-auto mb-4 ${
                isDarkMode ? 'text-slate-400' : 'text-slate-500'
              }`}>
                {searchQuery
                  ? `"${searchQuery}" নামে কোনো ডিসপ্লে লিস্টে নেই। আপনি চাইলে এখনই এটি যোগ করে আসল কেনা দাম লিখে রাখতে পারেন।`
                  : 'বর্তমান ফিল্টারে কোনো ডিসপ্লে নেই।'}
              </p>
              <button
                onClick={() => {
                  setEditItem(null);
                  setInitialModelForAdd(searchQuery);
                  setIsAddModalOpen(true);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-amber-500/20 cursor-pointer active:scale-95 transition-all"
              >
                <PlusCircle className="w-4 h-4 stroke-[2.5]" />
                <span>{searchQuery ? `"${searchQuery}" ডিসপ্লে যোগ করুন` : 'নতুন ডিসপ্লে যোগ করুন'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Gift & Dedication Banner at bottom */}
        <div 
          onClick={() => setIsAboutModalOpen(true)}
          className={`my-8 p-4 rounded-3xl border text-center cursor-pointer transition-all shadow-md group ${
            isDarkMode 
              ? 'bg-gradient-to-r from-amber-500/10 via-slate-900 to-rose-500/10 border-amber-500/30 hover:border-amber-400' 
              : 'bg-white border-amber-300 hover:border-amber-400 shadow-sm'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 text-amber-500 text-xs font-bold mb-1.5 group-hover:scale-105 transition-transform">
            <Gift className="w-3.5 h-3.5 text-amber-500" />
            <span>জয়ের পক্ষ থেকে উজ্জ্বল ভাইয়ের গিফট</span>
            <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" />
          </div>
          <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            উজ্জ্বল ভাইয়ের দোকানের দ্রুত ও নিখুঁত ডিসপ্লে অনুসন্ধানের জন্য নিবেদিত
          </p>
        </div>

      </main>

      {/* Persistent Bottom Navigation (হোম, নতুন মাল, এবাউট) */}
      <BottomNav
        activeTab={activeBottomNav}
        onHomeClick={handleHomeClick}
        onAddClick={() => {
          setActiveBottomNav('add');
          setEditItem(null);
          setInitialModelForAdd('');
          setIsAddModalOpen(true);
        }}
        onAboutClick={() => {
          setActiveBottomNav('about');
          setIsAboutModalOpen(true);
        }}
        isDarkMode={isDarkMode}
      />

      {/* Special Quick Search Modal */}
      <SpecialSearchModal
        isOpen={isSpecialSearchOpen}
        onClose={() => {
          setIsSpecialSearchOpen(false);
          setActiveBottomNav('home');
        }}
        displays={displays}
        isPrivacyMode={isPrivacyMode}
        onTogglePrivacyMode={togglePrivacyMode}
        onUpdateStock={handleUpdateStock}
        onOpenAddModalWithModel={(modelName) => {
          setEditItem(null);
          setInitialModelForAdd(modelName);
          setIsAddModalOpen(true);
        }}
        onSelectDisplay={handleSelectDisplay}
      />

      {/* Add / Edit Display Modal */}
      <AddEditModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditItem(null);
          setInitialModelForAdd('');
          setActiveBottomNav('home');
        }}
        onSave={handleSaveDisplay}
        editItem={editItem}
        initialModelName={initialModelForAdd}
      />

      {/* About Modal (জয়ের পক্ষ থেকে উজ্জ্বল ভাইয়ের গিফট) */}
      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={() => {
          setIsAboutModalOpen(false);
          setActiveBottomNav('home');
        }}
        totalDisplays={displays.length}
      />

      {/* Phone Storage Backup & Restore Modal */}
      <BackupModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        displays={displays}
        onRestoreDisplays={handleRestoreDisplays}
      />

      {/* Android APK & Mobile Installation Modal */}
      <ApkDownloadModal
        isOpen={isApkModalOpen}
        onClose={() => {
          setIsApkModalOpen(false);
          setActiveBottomNav('home');
        }}
      />

      {/* Delete Confirmation Dialog */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in">
          <div className={`w-full max-w-sm border rounded-2xl p-5 shadow-2xl ${
            isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
              isDarkMode ? 'bg-rose-500/15 text-rose-400' : 'bg-rose-100 text-rose-600'
            }`}>
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className={`text-base font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              ডিসপ্লেটি মুছে ফেলতে চান?
            </h3>
            <p className={`text-sm mb-5 leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              আপনি কি নিশ্চিত যে <strong className={`underline ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>&quot;{deleteConfirm.modelName}&quot;</strong> ডিসপ্লেটি খাতা থেকে মুছে ফেলবেন? এটি মুছে দিলে দোকানে আর দেখাবে না।
            </p>
            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold cursor-pointer ${
                  isDarkMode 
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                }`}
              >
                না, থাক
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-900/30 cursor-pointer"
              >
                হ্যাঁ, মুছে ফেলুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-3 duration-200">
          <div className={`px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs sm:text-sm font-semibold border ${
            isDarkMode 
              ? toast.type === 'success'
                ? 'bg-slate-900 border-emerald-500/50 text-emerald-300 shadow-emerald-950/40'
                : toast.type === 'error'
                  ? 'bg-slate-900 border-rose-500/50 text-rose-300 shadow-rose-950/40'
                  : 'bg-slate-900 border-amber-500/50 text-amber-300 shadow-amber-950/40'
              : toast.type === 'success'
                ? 'bg-white border-emerald-400 text-emerald-800 shadow-md'
                : toast.type === 'error'
                  ? 'bg-white border-rose-400 text-rose-800 shadow-md'
                  : 'bg-white border-amber-400 text-amber-800 shadow-md'
          }`}>
            {toast.type === 'success' ? (
              <Check className={`w-4 h-4 flex-shrink-0 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />
            ) : (
              <AlertCircle className={`w-4 h-4 flex-shrink-0 ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`} />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

    </div>
  );
}
