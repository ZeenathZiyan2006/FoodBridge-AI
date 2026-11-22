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
  ShieldCheck
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

  const nowStr = new Date().toISOString().slice(0, 16);
  const inFourHoursStr = new Date(Date.now() + 4 * 3600 * 1000).toISOString().slice(0, 16);

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
      setError('Food Safety Error: Consumption deadline must be a future time.');
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

  const handleSaveDraft = () => {
    showToast('Donation draft saved locally.', 'info');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/donor-dashboard"
          className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#14532D] transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Donor Dashboard</span>
        </Link>
        <span className="text-xs font-bold text-[#14532D] bg-[#ECFDF5] px-3 py-1 rounded-full border border-[#16A34A]/20">
          Zero Food Waste Initiative
        </span>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-gray-200/80 shadow-xs space-y-8">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#1F2937] tracking-tight">
            List Surplus Food Donation
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
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
            <h3 className="font-heading text-xs font-bold text-[#14532D] uppercase tracking-wider">
              1. Food Item Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Food Item Name *
                </label>
                <input
                  type="text"
                  required
                  value={foodName}
                  onChange={(e) => setFoodName(e.target.value)}
                  placeholder="e.g. Fresh Vegetable Biryani with Raita & Salad"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Food Category *
                </label>
                <select
                  value={category}
                  onChange={handleCategoryChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] bg-white text-gray-800"
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
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Dietary Classification *
                </label>
                <select
                  value={dietaryType}
                  onChange={(e) => setDietaryType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] bg-white text-gray-800"
                >
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Non-Vegetarian">Non-Vegetarian</option>
                  <option value="Vegan">Vegan</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Food Description & Ingredients
                </label>
                <textarea
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe dishes, ingredients, freshness condition, and portion size..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A]"
                />
              </div>
            </div>
          </div>

          {/* 2. Quantity & Units */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h3 className="font-heading text-xs font-bold text-[#14532D] uppercase tracking-wider">
              2. Quantity & Capacity
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Quantity Available *
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="1"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="e.g. 35"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Measurement Unit *
                </label>
                <select
                  value={quantityUnit}
                  onChange={(e) => setQuantityUnit(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] bg-white text-gray-800"
                >
                  <option value="Meals">Meals (Portions)</option>
                  <option value="Kg">Kilograms (Kg)</option>
                  <option value="Packets">Packets / Boxes</option>
                </select>
              </div>
            </div>
          </div>

          {/* 3. Safety & Deadlines */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h3 className="font-heading text-xs font-bold text-[#14532D] uppercase tracking-wider">
              3. Food Safety, Urgency & Deadlines
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Preparation Date & Time *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={prepTime}
                  onChange={(e) => setPrepTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Consumption Deadline * (Food Safety Cutoff)
                </label>
                <input
                  type="datetime-local"
                  required
                  value={consumptionDeadline}
                  onChange={(e) => setConsumptionDeadline(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#F59E0B]/50 text-xs focus:outline-hidden focus:ring-2 focus:ring-[#F59E0B]/20 focus:border-[#F59E0B] bg-[#FFFBEB]"
                />
                <p className="text-[11px] text-[#92400E] mt-1">
                  ⚡ Items approaching deadline are automatically promoted as Urgent by the AI engine.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Storage Condition *
                </label>
                <select
                  value={storageCondition}
                  onChange={(e) => setStorageCondition(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] bg-white text-gray-800"
                >
                  <option value="Hot Holding">Hot Holding (&gt; 65°C)</option>
                  <option value="Refrigerated">Refrigerated (&lt; 4°C)</option>
                  <option value="Frozen">Deep Frozen (&lt; -18°C)</option>
                  <option value="Room Temperature">Room Temperature (Dry Pantry)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Allergen Information
                </label>
                <input
                  type="text"
                  value={allergenInfo}
                  onChange={(e) => setAllergenInfo(e.target.value)}
                  placeholder="e.g. Contains Dairy, Gluten, Peanuts"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A]"
                />
              </div>
            </div>
          </div>

          {/* 4. Pickup Logistics */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h3 className="font-heading text-xs font-bold text-[#14532D] uppercase tracking-wider">
              4. Pickup Logistics & Donor Contact
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Pickup Location & Landmark *
                </label>
                <input
                  type="text"
                  required
                  value={pickupLocation}
                  onChange={(e) => setPickupLocation(e.target.value)}
                  placeholder="e.g. MIT Campus Food Court Counter 3, Manipal"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Available Pickup Window
                </label>
                <input
                  type="text"
                  value={availablePickupTime}
                  onChange={(e) => setAvailablePickupTime(e.target.value)}
                  placeholder="e.g. 2:30 PM - 5:00 PM"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Donor Phone / Contact *
                </label>
                <input
                  type="text"
                  required
                  value={donorContact}
                  onChange={(e) => setDonorContact(e.target.value)}
                  placeholder="+91 98450 12345"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                  Food Image URL (Optional)
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A]"
                />
                <p className="text-[11px] text-gray-400 mt-1">
                  Leave blank to auto-assign a high-quality illustration based on category.
                </p>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/donor-dashboard')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 text-xs font-bold hover:bg-gray-50 transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSaveDraft}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-[#16A34A]/30 text-[#14532D] bg-[#ECFDF5] text-xs font-bold hover:bg-[#d1fae5] transition cursor-pointer"
            >
              Save Draft
            </button>

            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-7 py-2.5 rounded-xl bg-[#14532D] hover:bg-[#0f3d21] text-white text-xs font-bold shadow-2xs transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#ECFDF5]" />
              <span>{loading ? 'Submitting & Activating AI...' : 'Submit Donation & Match'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
