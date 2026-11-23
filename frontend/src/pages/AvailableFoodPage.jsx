import React, { useState, useEffect } from 'react';
import { Search, Filter, Sparkles, Layers, ArrowLeft, SlidersHorizontal, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';
import { FoodCard } from '../components/FoodCard';
import { SafetyBanner } from '../components/SafetyBanner';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const AvailableFoodPage = () => {
  const { user, showToast } = useAuth();
  const { t } = useLanguage();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  const [dietary, setDietary] = useState('All');
  const [location, setLocation] = useState('All');
  const [urgency, setUrgency] = useState('All');
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'urgency', 'quantity'

  const loadDonations = async () => {
    setLoading(true);
    try {
      const data = await api.getDonations({
        category,
        dietary_type: dietary,
        location,
        search: searchTerm,
        urgency,
        status: 'Available',
        only_available: true,
      });

      // Strictly display food that is currently 'Available' AND unexpired (hours_left > 0) AND has available quantity > 0
      const freshAndEdible = (data || []).filter((d) => {
        const isAvail = d.status?.toLowerCase() === 'available';
        const hasTime = (d.hours_left !== undefined && d.hours_left !== null) ? d.hours_left > 0 : true;
        const rem = (d.remaining_quantity !== null && d.remaining_quantity !== undefined) ? d.remaining_quantity : d.quantity;
        const hasQty = rem > 0;
        return isAvail && hasTime && hasQty;
      });

      setDonations(freshAndEdible);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDonations();
  }, [category, dietary, location, urgency]);

  const handleSearch = (e) => {
    e.preventDefault();
    loadDonations();
  };

  const handleResetFilters = () => {
    setCategory('All');
    setDietary('All');
    setLocation('All');
    setUrgency('All');
    setSearchTerm('');
    setSortBy('newest');
  };

  // Sort logic
  const sortedDonations = [...donations].sort((a, b) => {
    if (sortBy === 'urgency') {
      return (a.hours_left || 99) - (b.hours_left || 99);
    }
    if (sortBy === 'quantity') {
      return b.quantity - a.quantity;
    }
    return new Date(b.created_at) - new Date(a.created_at);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F5ED] text-[#123C2D] text-xs font-heading font-extrabold border border-[#16865B]/20 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#16865B] animate-pulse" />
            <span>Active Surplus Catalog</span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-[#123C2D] tracking-tight mt-2">
            {t('available_title')}
          </h1>
          <p className="text-xs sm:text-sm text-[#718078] mt-1 max-w-2xl">
            {t('available_subtitle')}
          </p>
        </div>

        {/* Live Filter Counter Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#123C2D]/10 shadow-xs self-start md:self-auto">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16865B] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#16865B]"></span>
          </span>
          <span className="text-xs font-heading font-extrabold text-[#123C2D]">
            {sortedDonations.length} Active Batches
          </span>
          <span className="text-[#123C2D]/20">|</span>
          <span className="text-[11px] font-medium text-[#718078]">
            FSSAI Verified
          </span>
        </div>
      </div>

      <SafetyBanner />

      {/* Modern Filter and Search Control Bar */}
      <div className="bg-white p-6 rounded-3xl border border-[#123C2D]/8 shadow-[0_4px_24px_-4px_rgba(18,60,45,0.04)] space-y-4">
        {/* Search Input Row */}
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-4 top-3.5 text-[#718078]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by food dish, ingredient, donor canteen, or landmark..."
              className="w-full pl-11 pr-4 py-3 text-xs sm:text-sm rounded-full border border-[#123C2D]/12 focus:outline-hidden focus:ring-2 focus:ring-[#16865B]/25 focus:border-[#16865B] bg-[#F8FAF7]/50 transition-all placeholder:text-[#718078]/70"
            />
          </div>
          <button
            type="submit"
            className="px-7 py-3 rounded-full bg-[#123C2D] hover:bg-[#16865B] text-white text-xs font-heading font-bold shadow-md shadow-[#123C2D]/15 transition-all cursor-pointer"
          >
            Search Food
          </button>
        </form>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2 text-xs">
          <div>
            <label className="block text-[10px] font-heading font-bold text-[#718078] uppercase tracking-wider mb-1.5">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#123C2D]/10 text-xs bg-white text-[#202B25] font-medium focus:ring-1 focus:ring-[#16865B] cursor-pointer"
            >
              <option value="All">All Categories</option>
              <option value="Cooked Meals">Cooked Meals</option>
              <option value="Rice and Grains">Rice and Grains</option>
              <option value="Fruits">Fruits</option>
              <option value="Vegetables">Vegetables</option>
              <option value="Bakery Items">Bakery Items</option>
              <option value="Packaged Food">Packaged Food</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-heading font-bold text-[#718078] uppercase tracking-wider mb-1.5">
              Dietary Type
            </label>
            <select
              value={dietary}
              onChange={(e) => setDietary(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#123C2D]/10 text-xs bg-white text-[#202B25] font-medium focus:ring-1 focus:ring-[#16865B] cursor-pointer"
            >
              <option value="All">All Diets</option>
              <option value="Vegetarian">Vegetarian</option>
              <option value="Non-Vegetarian">Non-Vegetarian</option>
              <option value="Vegan">Vegan</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-heading font-bold text-[#718078] uppercase tracking-wider mb-1.5">
              Locality
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#123C2D]/10 text-xs bg-white text-[#202B25] font-medium focus:ring-1 focus:ring-[#16865B] cursor-pointer"
            >
              <option value="All">All Localities</option>
              <option value="Manipal">Manipal</option>
              <option value="Udupi">Udupi</option>
              <option value="Santhekatte">Santhekatte</option>
              <option value="Malpe">Malpe</option>
              <option value="Brahmavar">Brahmavar</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-heading font-bold text-[#718078] uppercase tracking-wider mb-1.5">
              Urgency Window
            </label>
            <select
              value={urgency}
              onChange={(e) => setUrgency(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#123C2D]/10 text-xs bg-white text-[#202B25] font-medium focus:ring-1 focus:ring-[#16865B] cursor-pointer"
            >
              <option value="All">All Deadlines</option>
              <option value="Urgent">Critical (&lt; 5 hrs)</option>
              <option value="Normal">Normal (&gt; 5 hrs)</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-heading font-bold text-[#718078] uppercase tracking-wider mb-1.5">
              Sort Order
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-[#123C2D]/10 text-xs bg-white text-[#202B25] font-medium focus:ring-1 focus:ring-[#16865B] cursor-pointer"
            >
              <option value="newest">Recently Listed</option>
              <option value="urgency">Urgent / Expiring First</option>
              <option value="quantity">Largest Quantity</option>
            </select>
          </div>
        </div>
      </div>

      {/* Food Listings Grid */}
      {loading ? (
        <div className="py-24 text-center text-[#718078] text-sm space-y-3">
          <div className="inline-block w-8 h-8 border-3 border-[#16865B] border-t-transparent rounded-full animate-spin" />
          <p>Loading available surplus food listings...</p>
        </div>
      ) : sortedDonations.length === 0 ? (
        <div className="bg-white rounded-3xl p-14 text-center space-y-4 border border-[#123C2D]/8 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-[#E8F5ED] text-[#123C2D] flex items-center justify-center mx-auto">
            <Layers className="w-7 h-7 text-[#16865B]" />
          </div>
          <h3 className="font-heading text-lg font-bold text-[#123C2D]">No Matching Food Found</h3>
          <p className="text-xs text-[#718078] max-w-sm mx-auto leading-relaxed">
            There are currently no active food listings matching your selected filters. Try broadening your criteria.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-6 py-2.5 rounded-full bg-[#123C2D] hover:bg-[#16865B] text-white text-xs font-heading font-bold transition-all shadow-xs cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedDonations.map((d) => (
            <FoodCard key={d.id} donation={d} />
          ))}
        </div>
      )}
    </div>
  );
};
