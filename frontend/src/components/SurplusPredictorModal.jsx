import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  X,
  TrendingUp,
  Clock,
  Calendar,
  Building2,
  Utensils,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Info,
  ShieldCheck,
  PackageCheck
} from 'lucide-react';
import { api } from '../services/api';

export const SurplusPredictorModal = ({ isOpen, onClose, defaultEstablishment = 'College Canteen' }) => {
  const navigate = useNavigate();

  const [establishmentType, setEstablishmentType] = useState(defaultEstablishment);
  const [dayOfWeek, setDayOfWeek] = useState('Friday');
  const [mealType, setMealType] = useState('Lunch');
  const [preparedMeals, setPreparedMeals] = useState(300);
  const [eventFactor, setEventFactor] = useState('Normal Day');

  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await api.predictSurplus({
        establishment_type: establishmentType,
        day_of_week: dayOfWeek,
        meal_type: mealType,
        prepared_meals: parseInt(preparedMeals) || 200,
        event_factor: eventFactor,
      });
      setPrediction(data);
    } catch (err) {
      setError(err.message || 'Failed to generate surplus prediction');
    } finally {
      setLoading(false);
    }
  };

  const handlePrefillDonation = () => {
    if (!prediction) return;
    onClose();
    // Navigate to Add Donation with query parameters pre-filling estimated values
    const query = new URLSearchParams({
      predictedQty: prediction.predicted_surplus_meals.toString(),
      predictedUnit: 'Meals',
      prepCategory: 'Cooked Meals',
      mealTitle: `${establishmentType} ${mealType} Surplus Batch`,
      notes: `AI Predicted surplus (${prediction.surplus_percentage}% of ${preparedMeals} prep volume) on ${dayOfWeek} under ${eventFactor} conditions.`
    }).toString();
    navigate(`/add-donation?${query}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#202B25]/50 backdrop-blur-xs animate-fade-in font-sans">
      <div className="w-full max-w-2xl bg-white rounded-3xl border border-[#123C2D]/12 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#123C2D] to-[#16865B] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <Sparkles className="w-5 h-5 text-[#E9A23B]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-heading font-extrabold text-base sm:text-lg">
                  AI Surplus Food Predictor
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/20 font-bold uppercase tracking-wider text-white">
                  Predictive ML
                </span>
              </div>
              <p className="text-xs text-[#E8F5ED]/80">
                Forecast expected canteen, restaurant, or hostel surplus before food is prepared.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handlePredict} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-heading font-bold text-[#202B25] uppercase tracking-wider mb-1.5">
                  Establishment Type
                </label>
                <select
                  value={establishmentType}
                  onChange={(e) => setEstablishmentType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#123C2D]/12 text-xs bg-[#F8FAF7]/50 font-medium cursor-pointer"
                >
                  <option value="College Canteen">College Canteen</option>
                  <option value="Hostel Mess">Hostel Mess</option>
                  <option value="Restaurant">Restaurant</option>
                  <option value="Hotel Banquet">Hotel Banquet / Buffet</option>
                  <option value="Corporate Cafeteria">Corporate Cafeteria</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-heading font-bold text-[#202B25] uppercase tracking-wider mb-1.5">
                  Day of the Week
                </label>
                <select
                  value={dayOfWeek}
                  onChange={(e) => setDayOfWeek(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#123C2D]/12 text-xs bg-[#F8FAF7]/50 font-medium cursor-pointer"
                >
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday (Pre-Weekend Shift)</option>
                  <option value="Saturday">Saturday (Weekend Outing)</option>
                  <option value="Sunday">Sunday (High Variance)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-heading font-bold text-[#202B25] uppercase tracking-wider mb-1.5">
                  Meal Service
                </label>
                <select
                  value={mealType}
                  onChange={(e) => setMealType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#123C2D]/12 text-xs bg-[#F8FAF7]/50 font-medium cursor-pointer"
                >
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch (Peak Bulk)</option>
                  <option value="Dinner">Dinner</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-heading font-bold text-[#202B25] uppercase tracking-wider mb-1.5">
                  Prepared Meals Count
                </label>
                <input
                  type="number"
                  min="20"
                  max="5000"
                  required
                  value={preparedMeals}
                  onChange={(e) => setPreparedMeals(e.target.value)}
                  placeholder="e.g. 300"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#123C2D]/12 text-xs bg-[#F8FAF7]/50 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-heading font-bold text-[#202B25] uppercase tracking-wider mb-1.5">
                Special Context / Campus Factor
              </label>
              <select
                value={eventFactor}
                onChange={(e) => setEventFactor(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#123C2D]/12 text-xs bg-[#F8FAF7]/50 font-medium cursor-pointer"
              >
                <option value="Normal Day">Normal Academic / Operating Day</option>
                <option value="Exam Week">Exam Week (Irregular attendance dips)</option>
                <option value="Campus Fest / Event">Campus Fest / Special Event (Low hall turnout)</option>
                <option value="Weekend Outing">Weekend Student Outing</option>
                <option value="Heavy Rain / Weather">Heavy Rain / Monsoon Weather</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-full bg-[#123C2D] hover:bg-[#16865B] text-white font-heading font-extrabold text-xs sm:text-sm shadow-md shadow-[#123C2D]/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-[#E9A23B]" />
              <span>{loading ? 'Analyzing Historical Waste Factors...' : 'Run Surplus Prediction Algorithm'}</span>
            </button>
          </form>

          {/* Prediction Output Results */}
          {prediction && (
            <div className="space-y-4 pt-4 border-t border-gray-100 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#718078]">
                  Forecast Result: {prediction.establishment_type} • {prediction.day_of_week} ({prediction.meal_type})
                </span>
                <span className="text-[10px] font-mono font-bold text-[#16865B] bg-[#E8F5ED] px-2.5 py-0.5 rounded-full border border-[#16865B]/20">
                  Confidence: {prediction.confidence_score}%
                </span>
              </div>

              {/* 3 Metric Highlight Tiles */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 bg-[#E8F5ED] rounded-2xl border border-[#16865B]/20 text-center">
                  <span className="text-[10px] font-mono font-bold text-[#718078] uppercase">Est. Surplus</span>
                  <p className="font-heading font-extrabold text-xl text-[#123C2D] mt-0.5">
                    {prediction.predicted_surplus_meals}
                  </p>
                  <span className="text-[10px] text-[#16865B] font-medium">Meals (~{prediction.predicted_surplus_kg} kg)</span>
                </div>

                <div className="p-3.5 bg-[#FEF7EC] rounded-2xl border border-[#E9A23B]/30 text-center">
                  <span className="text-[10px] font-mono font-bold text-[#718078] uppercase">Surplus Rate</span>
                  <p className="font-heading font-extrabold text-xl text-[#9A6217] mt-0.5">
                    {prediction.surplus_percentage}%
                  </p>
                  <span className="text-[10px] text-[#9A6217] font-medium">of {prediction.prepared_meals} Prepared</span>
                </div>

                <div className="p-3.5 bg-white rounded-2xl border border-gray-200 text-center">
                  <span className="text-[10px] font-mono font-bold text-[#718078] uppercase">Risk Tier</span>
                  <p className={`font-heading font-extrabold text-base mt-1 ${
                    prediction.risk_level === 'High' ? 'text-amber-600' : 'text-[#16865B]'
                  }`}>
                    {prediction.risk_level} Risk
                  </p>
                  <span className="text-[10px] text-[#718078] font-medium">Actionable</span>
                </div>
              </div>

              {/* Category Breakdown */}
              <div className="space-y-2 bg-[#F8FAF7] p-3.5 rounded-2xl border border-gray-100">
                <p className="font-heading text-xs font-bold text-[#202B25] uppercase tracking-wider">
                  Predicted Surplus Food Distribution:
                </p>
                <div className="space-y-1.5">
                  {prediction.top_surplus_categories?.map((cat, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <span className="text-[#202B25] font-medium">{cat.category}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-[#16865B] h-full rounded-full"
                            style={{ width: `${cat.percentage}%` }}
                          />
                        </div>
                        <span className="font-mono text-[11px] font-bold text-[#123C2D] w-12 text-right">
                          {cat.expected_meals} meals
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actionable Recommendations */}
              <div className="space-y-1.5 p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl text-xs text-[#123C2D]">
                <p className="font-heading font-bold text-[11px] uppercase tracking-wider text-[#16865B] flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#16865B]" />
                  <span>Proactive AI Mitigations:</span>
                </p>
                <ul className="space-y-1 text-[11px] list-disc list-inside text-[#202B25]">
                  {prediction.actionable_recommendations?.map((rec, i) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </div>

              {/* Action CTA */}
              <button
                type="button"
                onClick={handlePrefillDonation}
                className="w-full py-3 px-4 rounded-full bg-[#123C2D] hover:bg-[#16865B] text-white font-heading font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <PackageCheck className="w-4 h-4 text-[#42B883]" />
                <span>Pre-fill Surplus Donation Listing with {prediction.predicted_surplus_meals} Meals →</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
