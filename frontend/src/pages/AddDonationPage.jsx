import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Utensils,
  PlusCircle,
  Calendar,
  Clock,
  MapPin,
  Phone,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Package,
  Layers
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { SafetyBanner } from '../components/SafetyBanner';

export const AddDonationPage = () => {
  const { user, showToast } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form Fields
  const [foodName, setFoodName] = useState('');
  const [category, setCategory] = useState('Cooked Meals');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [quantityUnit, setQuantityUnit] = useState('Meals');
  const [dietaryType, setDietaryType] = useState('Vegetarian');

  const toLocalISOString = (date) => {
    const pad = (n) => String(n).padStart(2, '0');
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const nowStr = toLocalISOString(new Date());
  const inFourHoursStr = toLocalISOString(new Date(Date.now() + 4 * 3600 * 1000));

  const [prepTime, setPrepTime] = useState(nowStr);
  const [consumptionDeadline, setConsumptionDeadline] = useState(inFourHoursStr);
  const [storageCondition, setStorageCondition] = useState('Hot Holding');
  const [allergenInfo, setAllergenInfo] = useState('None reported');
  const [pickupLocation, setPickupLocation] = useState(user?.address || 'MIT Campus Food Court, Manipal');
  const [availablePickupTime, setAvailablePickupTime] = useState('Immediate pickup (Within next 2 hours)');
  const [donorContact, setDonorContact] = useState(user?.phone || '+91 98450 12345');
  const [imageUrl, setImageUrl] = useState('');

  const sampleImages = {
    'Cooked Meals': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
    'Rice and Grains': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
    'Fruits': 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=600&auto=format&fit=crop&q=80',
    'Vegetables': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80',
    'Bakery Items': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
    'Packaged Food': 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&auto=format&fit=crop&q=80',
    'Other': 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&auto=format&fit=crop&q=80',
  };

  const handleCategoryChange = (e) => {
    const newCat = e.target.value;
    setCategory(newCat);
    if (!imageUrl || Object.values(sampleImages).includes(imageUrl)) {
      setImageUrl(sampleImages[newCat] || sampleImages['Other']);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const deadlineDate = new Date(consumptionDeadline);
    if (deadlineDate <= new Date()) {
      setError('Food Safety Requirement: Consumption deadline must be a future time.');
      return;
    }

    if (!quantity || parseFloat(quantity) <= 0) {
      setError('Quantity must be greater than zero.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        food_name: foodName,
        category,
        description,
        quantity: parseFloat(quantity),
        quantity_unit: quantityUnit,
        dietary_type: dietaryType,
        prep_time: new Date(prepTime).toISOString(),
        consumption_deadline: deadlineDate.toISOString(),
        storage_condition: storageCondition,
        allergen_info: allergenInfo,
        pickup_location: pickupLocation,
        available_pickup_time: availablePickupTime,
        donor_contact: donorContact,
        image_url: imageUrl || sampleImages[category] || sampleImages['Other'],
      };

      const result = await api.createDonation(payload);
      showToast('Food donation listed successfully! AI matching is now active.', 'success');
      navigate(`/matching?donationId=${result.id}`);
    } catch (err) {
      setError(err.message || 'Failed to submit food donation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/donor-dashboard"
          className="inline-flex items-center gap-2 text-xs font-heading font-bold text-[#718078] hover:text-[#123C2D] transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Donor Dashboard</span>
        </Link>
        <span className="text-xs font-heading font-extrabold text-[#123C2D] bg-[#E8F5ED] px-3.5 py-1 rounded-full border border-[#16865B]/20">
          Zero Food Waste Initiative
        </span>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#123C2D]/8 shadow-[0_4px_24px_-4px_rgba(18,60,45,0.04)] space-y-8">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#123C2D] tracking-tight">
            List Surplus Food Donation
          </h1>
          <p className="text-xs sm:text-sm text-[#718078] mt-1">
            Provide food details accurately so the AI matching engine can locate nearby orphanages and community shelters.
          </p>
        </div>

        <SafetyBanner />

        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs font-medium flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. Basic Food Info */}
          <div className="space-y-4">
            <h3 className="font-heading text-xs font-extrabold text-[#123C2D] uppercase tracking-wider flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#E8F5ED] text-[#123C2D] flex items-center justify-center font-mono text-[10px]">1</span>
              <span>Food Item Specifications</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-heading font-bold text-[#202B25] uppercase tracking-wider mb-1.5">
                  Food Item Name *
                </label>
                <input
                  type="text"
                  required
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  placeholder="e.g. Fresh Steamed Basmati Rice & Mixed Dal Curry"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#123C2D]/12 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#16865B]/25 focus:border-[#16865B] bg-[#F8FAF7]/50"
                />
              </div>

              <div>
                <label className="block text-xs font-heading font-bold text-[#202B25] uppercase tracking-wider mb-1.5">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={handleCategoryChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#123C2D]/12 text-xs sm:text-sm bg-[#F8FAF7]/50 cursor-pointer"
                >
                  <option value="Cooked Meals">Cooked Meals</option>
                  <option value="Rice and Grains">Rice and Grains</option>
                  <option value="Fruits">Fruits</option>
                  <option value="Vegetables">Vegetables</option>
                  <option value="Bakery Items">Bakery Items</option>
                  <option value="Packaged Food">Packaged Food</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-heading font-bold text-[#202B25] uppercase tracking-wider mb-1.5">
                  Dietary Type *
                </label>
                <select
                  value={dietaryType}
                  onChange={(e) => setDietaryType(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#123C2D]/12 text-xs sm:text-sm bg-[#F8FAF7]/50 cursor-pointer"
                >
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Non-Vegetarian">Non-Vegetarian</option>
                  <option value="Vegan">Vegan</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-heading font-bold text-[#202B25] uppercase tracking-wider mb-1.5">
                  Description / Preparation Highlights
                </label>
                <textarea
                  rows="2"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Prepared cleanly for lunch buffet, packed hygienically in thermal containers..."
                  className="w-full px-4 py-2.5 rounded-xl border border-[#123C2D]/12 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#16865B]/25 focus:border-[#16865B] bg-[#F8FAF7]/50"
                />
              </div>
            </div>
          </div>

          {/* 2. Quantity & Units */}
          <div className="space-y-4 pt-4 border-t border-[#123C2D]/8">
            <h3 className="font-heading text-xs font-extrabold text-[#123C2D] uppercase tracking-wider flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#E8F5ED] text-[#123C2D] flex items-center justify-center font-mono text-[10px]">2</span>
              <span>Portion Volume</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-heading font-bold text-[#202B25] uppercase tracking-wider mb-1.5">
                  Quantity Available *
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="1"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="e.g. 45"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#123C2D]/12 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#16865B]/25 focus:border-[#16865B] bg-[#F8FAF7]/50 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-heading font-bold text-[#202B25] uppercase tracking-wider mb-1.5">
                  Unit Measurement *
                </label>
                <select
                  value={quantityUnit}
                  onChange={(e) => setQuantityUnit(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#123C2D]/12 text-xs sm:text-sm bg-[#F8FAF7]/50 cursor-pointer"
                >
                  <option value="Meals">Meals / Portions</option>
                  <option value="Packets">Packets</option>
                  <option value="Kg">Kilograms (Kg)</option>
                </select>
              </div>
            </div>
          </div>

          {/* 3. Safe Window & Hygiene */}
          <div className="space-y-4 pt-4 border-t border-[#123C2D]/8">
            <h3 className="font-heading text-xs font-extrabold text-[#123C2D] uppercase tracking-wider flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#E8F5ED] text-[#123C2D] flex items-center justify-center font-mono text-[10px]">3</span>
              <span>Food Safety & Consumption Timeline</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-heading font-bold text-[#202B25] uppercase tracking-wider mb-1.5">
                  Preparation Timestamp *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={prepTime}
                  onChange={(e) => setPrepTime(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#123C2D]/12 text-xs sm:text-sm bg-[#F8FAF7]/50"
                />
              </div>

              <div>
                <label className="block text-xs font-heading font-bold text-[#202B25] uppercase tracking-wider mb-1.5">
                  Safe Consumption Deadline *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={consumptionDeadline}
                  onChange={(e) => setConsumptionDeadline(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#123C2D]/12 text-xs sm:text-sm bg-[#F8FAF7]/50"
                />
              </div>

              <div>
                <label className="block text-xs font-heading font-bold text-[#202B25] uppercase tracking-wider mb-1.5">
                  Storage Condition *
                </label>
                <select
                  value={storageCondition}
                  onChange={(e) => setStorageCondition(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#123C2D]/12 text-xs sm:text-sm bg-[#F8FAF7]/50 cursor-pointer"
                >
                  <option value="Hot Holding">Hot Holding (&gt; 60°C)</option>
                  <option value="Refrigerated">Refrigerated (&lt; 5°C)</option>
                  <option value="Room Temperature">Room Temperature (Dry)</option>
                  <option value="Frozen">Frozen (&lt; -18°C)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-heading font-bold text-[#202B25] uppercase tracking-wider mb-1.5">
                  Allergen Warnings
                </label>
                <input
                  type="text"
                  value={allergenInfo}
                  onChange={(e) => setAllergenInfo(e.target.value)}
                  placeholder="e.g. Contains dairy and peanuts"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#123C2D]/12 text-xs sm:text-sm bg-[#F8FAF7]/50"
                />
              </div>
            </div>
          </div>

          {/* 4. Pickup Logistics */}
          <div className="space-y-4 pt-4 border-t border-[#123C2D]/8">
            <h3 className="font-heading text-xs font-extrabold text-[#123C2D] uppercase tracking-wider flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#E8F5ED] text-[#123C2D] flex items-center justify-center font-mono text-[10px]">4</span>
              <span>Pickup & Handover Logistics</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-heading font-bold text-[#202B25] uppercase tracking-wider mb-1.5">
                  Pickup Location & Landmark *
                </label>
                <input
                  type="text"
                  required
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  placeholder="Building, Road, Landmark, Town"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#123C2D]/12 text-xs sm:text-sm bg-[#F8FAF7]/50"
                />
              </div>

              <div>
                <label className="block text-xs font-heading font-bold text-[#202B25] uppercase tracking-wider mb-1.5">
                  Pickup Window Hours *
                </label>
                <input
                  type="text"
                  required
                  value={availablePickupTime}
                  onChange={(e) => setAvailablePickupTime(e.target.value)}
                  placeholder="e.g. Immediate pickup (within 2 hours)"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#123C2D]/12 text-xs sm:text-sm bg-[#F8FAF7]/50"
                />
              </div>

              <div>
                <label className="block text-xs font-heading font-bold text-[#202B25] uppercase tracking-wider mb-1.5">
                  Donor Contact Phone *
                </label>
                <input
                  type="tel"
                  required
                  value={donorContact}
                  onChange={(e) => setDonorContact(e.target.value)}
                  placeholder="+91 98450 12345"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#123C2D]/12 text-xs sm:text-sm bg-[#F8FAF7]/50"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-end gap-3">
            <Link
              to="/donor-dashboard"
              className="w-full sm:w-auto px-6 py-3 rounded-full text-[#718078] hover:bg-gray-100 font-heading font-bold text-xs text-center transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#123C2D] hover:bg-[#16865B] text-white font-heading font-extrabold text-xs sm:text-sm shadow-md shadow-[#123C2D]/20 hover:shadow-lg transition-all duration-200 cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Submitting to AI Engine...' : 'Publish Surplus Donation Batch'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
