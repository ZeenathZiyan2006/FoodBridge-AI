import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Utensils, HeartHandshake, ArrowRight, AlertCircle, Check, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState('donor'); // 'donor' or 'receiver'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Common Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [locationName, setLocationName] = useState('Manipal');
  const [address, setAddress] = useState('');

  // Donor-Specific Fields
  const [orgTypeDonor, setOrgTypeDonor] = useState('Restaurant');
  const [fssaiLicense, setFssaiLicense] = useState('');
  const [operatingHours, setOperatingHours] = useState('9:00 AM - 10:00 PM');
  const [description, setDescription] = useState('');

  // Receiver-Specific Fields
  const [orgName, setOrgName] = useState('');
  const [orgTypeReceiver, setOrgTypeReceiver] = useState('NGO');
  const [contactPerson, setContactPerson] = useState('');
  const [requiredCapacity, setRequiredCapacity] = useState(40);
  const [dietaryPreference, setDietaryPreference] = useState('Both');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        full_name: fullName,
        email,
        password,
        role,
        phone,
        location_name: locationName,
        address,
        ...(role === 'donor'
          ? {
              organization_type: orgTypeDonor,
              fssai_license: fssaiLicense,
              operating_hours: operatingHours,
              description,
            }
          : {
              organization_name: orgName || fullName,
              organization_type: orgTypeReceiver,
              contact_person: contactPerson || fullName,
              required_capacity_meals: parseInt(requiredCapacity) || 40,
              dietary_preference: dietaryPreference,
            }),
      };

      const user = await register(payload);
      if (user.role === 'donor') navigate('/donor-dashboard');
      else navigate('/receiver-dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-7 bg-white p-8 sm:p-10 rounded-2xl border border-gray-200/80 shadow-lg shadow-gray-200/40">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#14532D] text-white shadow-md shadow-[#14532D]/20 mb-2">
            <Sparkles className="w-6 h-6 text-emerald-300" />
          </div>
          <h2 className="font-heading text-2xl font-extrabold text-gray-900 tracking-tight">
            Register on FoodBridge AI
          </h2>
          <p className="text-xs text-gray-500">
            Join the smart food redistribution network for sustainability and zero food waste.
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-gray-100/80 rounded-xl border border-gray-200/60">
          <button
            type="button"
            onClick={() => setRole('donor')}
            className={`py-2.5 px-4 rounded-lg text-xs font-heading font-bold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
              role === 'donor'
                ? 'bg-white text-[#14532D] shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Utensils className="w-4 h-4 text-[#14532D]" />
            <span>I am a Food Donor</span>
          </button>

          <button
            type="button"
            onClick={() => setRole('receiver')}
            className={`py-2.5 px-4 rounded-lg text-xs font-heading font-bold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
              role === 'receiver'
                ? 'bg-white text-[#14532D] shadow-xs'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <HeartHandshake className="w-4 h-4 text-teal-700" />
            <span>I am a Food Receiver (NGO/Shelter)</span>
          </button>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Registration Form with autocomplete disabled to prevent Windows Security PIN prompt */}
        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1 font-heading">
                {role === 'donor' ? 'Donor / Contact Name *' : 'Account Manager Name *'}
              </label>
              <input
                type="text"
                required
                autoComplete="off"
                name="foodbridge_contact_name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Ramesh Hegde"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1 font-heading">
                Email Address *
              </label>
              <input
                type="email"
                required
                autoComplete="off"
                name="foodbridge_user_email"
                data-lpignore="true"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contact@example.org"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1 font-heading">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  name="foodbridge_user_pwd"
                  data-lpignore="true"
                  data-form-type="other"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1 font-heading">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98450 12345"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] transition"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1 font-heading">
                City / Locality *
              </label>
              <select
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] bg-white transition"
              >
                <option value="Manipal">Manipal</option>
                <option value="Udupi">Udupi</option>
                <option value="Santhekatte">Santhekatte</option>
                <option value="Malpe">Malpe</option>
                <option value="Brahmavar">Brahmavar</option>
                <option value="Karkala">Karkala</option>
                <option value="Mangalore">Mangalore</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1 font-heading">
                Complete Street Address *
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street, Landmark, Building"
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] transition"
              />
            </div>
          </div>

          {/* Conditional Donor Fields */}
          {role === 'donor' && (
            <div className="space-y-4 pt-3 border-t border-gray-100">
              <h4 className="font-heading text-xs font-bold text-[#14532D] uppercase tracking-wider">
                Donor Profile Specifications
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1 font-heading">
                    Organization Type
                  </label>
                  <select
                    value={orgTypeDonor}
                    onChange={(e) => setOrgTypeDonor(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] bg-white transition"
                  >
                    <option value="Restaurant">Restaurant</option>
                    <option value="College Canteen">College Canteen</option>
                    <option value="Hotel">Hotel</option>
                    <option value="Hostel">Hostel Mess</option>
                    <option value="Event Organizer">Event Organizer / Caterer</option>
                    <option value="Supermarket">Supermarket</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1 font-heading">
                    FSSAI License / Registration No.
                  </label>
                  <input
                    type="text"
                    value={fssaiLicense}
                    onChange={(e) => setFssaiLicense(e.target.value)}
                    placeholder="e.g. FSSAI-11223344556677"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1 font-heading">
                  Operating Hours
                </label>
                <input
                  type="text"
                  value={operatingHours}
                  onChange={(e) => setOperatingHours(e.target.value)}
                  placeholder="e.g. 8:00 AM - 10:30 PM"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] transition"
                />
              </div>
            </div>
          )}

          {/* Conditional Receiver Fields */}
          {role === 'receiver' && (
            <div className="space-y-4 pt-3 border-t border-gray-100">
              <h4 className="font-heading text-xs font-bold text-[#14532D] uppercase tracking-wider">
                Receiver Organization Details
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1 font-heading">
                    Organization / Shelter Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    placeholder="e.g. Hope Children's Home"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1 font-heading">
                    Organization Type
                  </label>
                  <select
                    value={orgTypeReceiver}
                    onChange={(e) => setOrgTypeReceiver(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] bg-white transition"
                  >
                    <option value="NGO">Registered NGO</option>
                    <option value="Orphanage">Orphanage / Children's Home</option>
                    <option value="Shelter">Destitute Shelter</option>
                    <option value="Community Kitchen">Community Soup Kitchen</option>
                    <option value="Food Bank">Food Bank</option>
                    <option value="Old Age Home">Old Age Home</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1 font-heading">
                    Required Daily Meal Capacity *
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="500"
                    required
                    value={requiredCapacity}
                    onChange={(e) => setRequiredCapacity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] transition"
                  />
                  <p className="text-[11px] text-gray-400 mt-1">Used by AI algorithm for quantity compatibility.</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1 font-heading">
                    Dietary Requirements *
                  </label>
                  <select
                    value={dietaryPreference}
                    onChange={(e) => setDietaryPreference(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-[#16A34A]/20 focus:border-[#16A34A] bg-white transition"
                  >
                    <option value="Both">Both Vegetarian & Non-Vegetarian</option>
                    <option value="Vegetarian">Strictly Vegetarian Only</option>
                    <option value="Vegan">Vegan Only</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-[#14532D] hover:bg-[#166534] text-white font-heading font-bold text-sm shadow-md shadow-[#14532D]/20 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer active:scale-95"
            >
              {loading ? 'Creating Account...' : `Register as ${role === 'donor' ? 'Food Donor' : 'Receiver'}`}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        <div className="text-center pt-2 border-t border-gray-100">
          <p className="text-xs text-gray-500">
            Already registered?{' '}
            <Link to="/login" className="font-heading font-bold text-[#14532D] hover:text-[#16A34A] transition">
              Sign In here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
