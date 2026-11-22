import React, { useState, useEffect } from 'react';
import { Search, Filter, Sparkles, Layers, ArrowLeft } from 'lucide-react';
import { api } from '../services/api';
import { FoodCard } from '../components/FoodCard';
import { SafetyBanner } from '../components/SafetyBanner';

export const AvailableFoodPage = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  const [dietary, setDietary] = useState('All');
  const [location, setLocation] = useState('All');
  const [urgency, setUrgency] = useState('All');

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

      // Strict safety & availability enforcement:
      // Only display food that is currently 'Available' AND unexpired (hours_left > 0)
      const freshAndEdible = (data || []).filter((d) => {
        const isAvail = d.status?.toLowerCase() === 'available';
        const hasTime = (d.hours_left !== undefined && d.hours_left !== null) ? d.hours_left > 0 : true;
        return isAvail && hasTime;
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#064E3B] uppercase tracking-wider bg-[#ECFDF5] px-3 py-1 rounded-full border border-emerald-500/20 shadow-2xs">
            🟢 Active Surplus Feed
          </span>
          <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0F172A] tracking-tight mt-2">
            Available Surplus Food Listings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time catalog of edible, unreserved food donations from college canteens, restaurants, and catering halls ready for collection.
          </p>
        </div>

        {/* Live Filter Counter Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-white border border-emerald-500/30 shadow-xs self-start md:self-auto">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-heading font-extrabold text-[#064E3B]">
            {donations.length} Active & Edible
          </span>
          <span className="text-slate-300">|</span>
          <span className="text-[11px] font-medium text-slate-500">
            0% Waste Guaranteed
          </span>
        </div>
      </div>

      <SafetyBanner />

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-2xs space-y-4">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by food dish, ingredients, donor or pickup landmark..."
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A]"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-[#14532D] hover:bg-[#0f3d21] text-white text-xs font-bold transition cursor-pointer"
          >
            Search
          </button>
        </form>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              Food Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs bg-white text-gray-800"
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
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              Dietary Type
            </label>
            <select
              value={dietary}
              onChange={(e) => setDietary(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs bg-white text-gray-800"
            >
              <option value="All">All Dietary Types</option>
              <option value="Vegetarian">Vegetarian</option>
              <option value="Non-Vegetarian">Non-Vegetarian</option>
              <option value="Vegan">Vegan</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              Locality
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs bg-white text-gray-800"
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
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              Urgency Window
            </label>
            <select
              value={urgency}
              onChange={(e) => setUrgency(e.target.value)}
              className="w-full px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs bg-white text-gray-800"
            >
              <option value="All">All Deadlines</option>
              <option value="Urgent">Critical & Urgent (&lt; 5 hrs)</option>
              <option value="Normal">Normal (&gt; 5 hrs)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="py-24 text-center text-gray-400 text-sm">
          Loading surplus food listings...
        </div>
      ) : donations.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center space-y-3 border border-gray-200/80">
          <p className="font-heading text-base font-bold text-gray-800">No Food Matches Found</p>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Try resetting your search query or loosening your category and location filters.
          </p>
          <button
            onClick={() => {
              setCategory('All');
              setDietary('All');
              setLocation('All');
              setUrgency('All');
              setSearchTerm('');
            }}
            className="px-4 py-2 rounded-xl bg-[#14532D] text-white text-xs font-bold cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {donations.map((d) => (
            <FoodCard key={d.id} donation={d} />
          ))}
        </div>
      )}
    </div>
  );
};
