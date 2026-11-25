import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Shield,
  Utensils,
  HeartHandshake,
  Eye,
  EyeOff,
  CheckCircle2,
  Leaf,
  ShieldCheck,
  KeyRound,
  UserPlus,
  Phone,
  MapPin,
  Building2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Role Selection: 'donor' or 'receiver' (Two distinct options)
  const initialRole = searchParams.get('role') === 'receiver' ? 'receiver' : 'donor';
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'signin';

  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [authMode, setAuthMode] = useState(initialMode); // 'signin' or 'signup'

  // Common credentials fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Sign-Up Specific Fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [locationName, setLocationName] = useState('Manipal');
  const [address, setAddress] = useState('');

  // Donor-Specific Registration Fields
  const [orgTypeDonor, setOrgTypeDonor] = useState('Restaurant');
  const [fssaiLicense, setFssaiLicense] = useState('');
  const [operatingHours, setOperatingHours] = useState('9:00 AM - 10:00 PM');
  const [description, setDescription] = useState('');

  // Receiver-Specific Registration Fields
  const [orgName, setOrgName] = useState('');
  const [organizationId, setOrganizationId] = useState('');
  const [orgTypeReceiver, setOrgTypeReceiver] = useState('NGO');
  const [contactPerson, setContactPerson] = useState('');
  const [requiredCapacity, setRequiredCapacity] = useState(40);
  const [dietaryPreference, setDietaryPreference] = useState('Both');

  // Handle Standard Sign In
  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login({ email: email.trim().toLowerCase(), password });

      // Direct to authorized dashboard based on account role
      if (user.role === 'donor') {
        navigate('/donor-dashboard');
      } else if (user.role === 'receiver') {
        navigate('/receiver-dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Incorrect email or password. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Sign Up (Registration)
  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (selectedRole === 'receiver' && (!organizationId || !organizationId.trim())) {
        setError('Official Organization ID / NGO Registration Number is compulsory for receivers.');
        setLoading(false);
        return;
      }

      const payload = {
        full_name: fullName,
        email: email.trim().toLowerCase(),
        password: password || 'password123',
        role: selectedRole,
        phone,
        location_name: locationName,
        address,
        ...(selectedRole === 'donor'
          ? {
              organization_type: orgTypeDonor,
              fssai_license: fssaiLicense,
              operating_hours: operatingHours,
              description,
            }
          : {
              organization_name: orgName || fullName,
              organization_id: organizationId.trim(),
              organization_type: orgTypeReceiver,
              contact_person: contactPerson || fullName,
              required_capacity_meals: parseInt(requiredCapacity) || 40,
              dietary_preference: dietaryPreference,
            }),
      };

      const user = await register(payload);
      if (user.role === 'donor') {
        navigate('/donor-dashboard');
      } else {
        navigate('/receiver-dashboard');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[88vh] flex items-center justify-center p-4 sm:p-6 lg:p-10 animate-fade-in font-sans">
      <div className="w-full max-w-5xl bg-white rounded-3xl border border-[#123C2D]/10 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Side: Premium Nature Green Brand Showcase */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#123C2D] via-[#16865B] to-[#0B261D] p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#42B883]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#E9A23B]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Brand Header */}
          <div className="relative space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-inner">
                <Leaf className="w-6 h-6 text-[#E8F5ED]" />
              </div>
              <div>
                <span className="font-heading text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
                  FoodBridge <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#E8F5ED]/20 text-[#E8F5ED] border border-white/30">AI</span>
                </span>
                <p className="text-[11px] text-[#E8F5ED]/80 font-medium">
                  Smart Surplus Food Redistribution
                </p>
              </div>
            </div>

            <div className="pt-6 space-y-2">
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-white leading-snug">
                Zero Hunger.<br />
                <span className="text-[#42B883]">Zero Food Waste.</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#E8F5ED]/85 leading-relaxed font-normal">
                Connecting commercial kitchens, college canteens, and caterers with local NGOs and shelters through verified, algorithmic matchmaking.
              </p>
            </div>
          </div>

          {/* Security & RBAC Assurances */}
          <div className="relative my-8 space-y-3 bg-white/10 backdrop-blur-md rounded-2xl p-4.5 border border-white/15 text-xs">
            <div className="flex items-center gap-2 text-[#42B883] font-heading font-bold text-[11px] uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-[#42B883]" />
              <span>Platform Security Protocol</span>
            </div>

            <div className="space-y-2 text-[#E8F5ED]/90 text-[11px]">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#42B883] shrink-0 mt-0.5" />
                <span>
                  <strong>Role Segregation (RBAC)</strong>: Donor and Receiver dashboards are isolated to ensure audit integrity.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#42B883] shrink-0 mt-0.5" />
                <span>
                  <strong>Encrypted Authentication</strong>: Secure tokens with PBKDF2 password hashing.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#42B883] shrink-0 mt-0.5" />
                <span>
                  <strong>FSSAI Food Safety</strong>: Only active, edible food listings are permitted.
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Footer Quote */}
          <div className="relative pt-2 border-t border-white/10 text-[11px] text-[#E8F5ED]/60 flex items-center justify-between">
            <span>FoodBridge AI Sustainability Platform</span>
            <span className="font-mono text-[#42B883] font-bold">2026 Edition</span>
          </div>
        </div>

        {/* Right Side: Professional Clean Form */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-xl w-full mx-auto space-y-5">
            {/* Mode Switcher Tabs: Sign In vs Sign Up */}
            <div className="grid grid-cols-2 p-1 bg-[#F8FAF7] rounded-full border border-[#123C2D]/8 text-xs font-heading font-bold">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signin');
                  setError('');
                }}
                className={`py-2 px-2.5 rounded-full transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  authMode === 'signin'
                    ? 'bg-[#123C2D] text-white shadow-xs'
                    : 'text-[#718078] hover:text-[#123C2D]'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthMode('signup');
                  setError('');
                }}
                className={`py-2 px-2.5 rounded-full transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  authMode === 'signup'
                    ? 'bg-[#123C2D] text-white shadow-xs'
                    : 'text-[#718078] hover:text-[#123C2D]'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Sign Up (New)</span>
              </button>
            </div>

            {/* Header Titles */}
            <div className="space-y-1.5 pt-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F5ED] text-[#123C2D] text-[11px] font-heading font-extrabold border border-[#16865B]/20">
                <KeyRound className="w-3 h-3 text-[#16865B]" />
                <span>
                  {authMode === 'signup'
                    ? `Create ${selectedRole === 'donor' ? 'Food Donor' : 'Receiver Shelter'} Account`
                    : 'Secure Account Access'}
                </span>
              </div>

              <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#123C2D] tracking-tight">
                {authMode === 'signup'
                  ? `Sign Up for ${selectedRole === 'donor' ? "Donor's Account" : "Receiver's Account"}`
                  : 'Sign In to Your Account'}
              </h1>

              <p className="text-xs text-[#718078]">
                {authMode === 'signup'
                  ? (selectedRole === 'donor'
                      ? 'For commercial kitchens, college canteens, restaurants, and caterers donating surplus meals.'
                      : 'For verified NGOs, shelters, orphanages, and community care homes receiving surplus meals.')
                  : 'Enter your credentials to access your dashboard. The system automatically routes you to your authorized workspace.'}
              </p>
            </div>

            {/* SELECT ACCOUNT ROLE - ONLY SHOWN IN SIGN UP MODE */}
            {authMode === 'signup' && (
              <div className="space-y-2 pt-1 animate-fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-heading font-extrabold text-[#202B25] uppercase tracking-wider">
                    Select Account Type:
                  </span>
                  <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    selectedRole === 'donor'
                      ? 'bg-[#E8F5ED] text-[#123C2D] border border-[#16865B]/20'
                      : 'bg-[#FEF7EC] text-[#9A6217] border border-[#E9A23B]/30'
                  }`}>
                    {selectedRole === 'donor' ? 'Food Donor' : 'Receiver Shelter'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2.5 p-1.5 bg-[#F8FAF7] rounded-2xl border border-[#123C2D]/12">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRole('donor');
                      setError('');
                    }}
                    className={`py-3 px-3 rounded-xl text-xs font-heading font-extrabold transition-all flex flex-col sm:flex-row items-center justify-center gap-2 cursor-pointer ${
                      selectedRole === 'donor'
                        ? 'bg-[#123C2D] text-white shadow-md shadow-[#123C2D]/20 scale-[1.01]'
                        : 'text-[#718078] hover:text-[#123C2D] hover:bg-white/70'
                    }`}
                  >
                    <Utensils className={`w-4 h-4 shrink-0 ${selectedRole === 'donor' ? 'text-[#42B883]' : 'text-[#16865B]'}`} />
                    <div className="text-center sm:text-left leading-tight">
                      <div className="text-xs font-bold">Donor's Account</div>
                      <div className={`text-[10px] font-normal ${selectedRole === 'donor' ? 'text-[#E8F5ED]/80' : 'text-[#718078]'}`}>
                        Donate Surplus Food
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedRole('receiver');
                      setError('');
                    }}
                    className={`py-3 px-3 rounded-xl text-xs font-heading font-extrabold transition-all flex flex-col sm:flex-row items-center justify-center gap-2 cursor-pointer ${
                      selectedRole === 'receiver'
                        ? 'bg-[#123C2D] text-white shadow-md shadow-[#123C2D]/20 scale-[1.01]'
                        : 'text-[#718078] hover:text-[#123C2D] hover:bg-white/70'
                    }`}
                  >
                    <HeartHandshake className={`w-4 h-4 shrink-0 ${selectedRole === 'receiver' ? 'text-[#E9A23B]' : 'text-[#9A6217]'}`} />
                    <div className="text-center sm:text-left leading-tight">
                      <div className="text-xs font-bold">Receiver's Account</div>
                      <div className={`text-[10px] font-normal ${selectedRole === 'receiver' ? 'text-[#E8F5ED]/80' : 'text-[#718078]'}`}>
                        Shelters & NGOs
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Error Notification */}
            {error && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs font-medium flex items-start gap-2.5 animate-fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                <div className="space-y-1">
                  <span className="leading-snug">{error}</span>
                  {authMode === 'signin' && error.includes('Incorrect email or password') && (
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode('signup');
                          setError('');
                        }}
                        className="text-[11px] text-[#16865B] font-bold underline cursor-pointer"
                      >
                        Don't have an account yet? Click here to Sign Up in {selectedRole === 'donor' ? "Donor's" : "Receiver's"} Account →
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* MODE 1: SIGN IN FORM */}
            {authMode === 'signin' && (
              <form onSubmit={handleSignIn} autoComplete="off" className="space-y-4 animate-fade-in">
                {/* Email Address */}
                <div>
                  <label className="block text-xs font-heading font-bold text-[#202B25] uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#718078]">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="email"
                      required
                      autoComplete="off"
                      name="foodbridge_login_email"
                      data-lpignore="true"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. donor.manipal@foodbridge.ai or receiver.hope@foodbridge.ai"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#123C2D]/12 text-xs sm:text-sm text-[#202B25] placeholder-[#718078]/60 focus:outline-hidden focus:ring-2 focus:ring-[#16865B]/25 focus:border-[#16865B] transition bg-[#F8FAF7]/50"
                    />
                  </div>
                </div>

                {/* Password with Show/Hide Toggle */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-heading font-bold text-[#202B25] uppercase tracking-wider">
                      Password
                    </label>
                    <span className="text-[11px] text-[#16865B] font-medium">
                      Default: password123
                    </span>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#718078]">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoComplete="new-off"
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck="false"
                      name="foodbridge_login_pwd_val"
                      data-lpignore="true"
                      data-form-type="other"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password (e.g. password123)"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#123C2D]/12 text-xs sm:text-sm text-[#202B25] placeholder-[#718078]/60 focus:outline-hidden focus:ring-2 focus:ring-[#16865B]/25 focus:border-[#16865B] transition bg-[#F8FAF7]/50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#718078] hover:text-[#123C2D] cursor-pointer"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-[#123C2D]/20 text-[#16865B] focus:ring-[#16865B]"
                    />
                    <span className="text-xs text-[#718078] font-medium">Remember session</span>
                  </label>

                  <span className="text-xs text-[#16865B] font-medium font-heading">
                    Verified Connection
                  </span>
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-full bg-[#123C2D] hover:bg-[#16865B] text-white font-heading font-extrabold text-sm shadow-md shadow-[#123C2D]/20 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50"
                >
                  {loading ? (
                    <span>Verifying Credentials...</span>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <ArrowRight className="w-4 h-4 text-[#E8F5ED]" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* MODE 2: SIGN UP (REGISTRATION) FORM */}
            {authMode === 'signup' && (
              <form onSubmit={handleSignUp} autoComplete="off" className="space-y-4 animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-heading font-bold text-[#202B25] uppercase tracking-wider mb-1.5">
                      {selectedRole === 'donor' ? 'Donor / Contact Name *' : 'Manager Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      name="fb_reg_name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder={selectedRole === 'donor' ? 'e.g. Ramesh Hegde' : 'e.g. Sister Jacintha'}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#123C2D]/12 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#16865B]/25 focus:border-[#16865B] bg-[#F8FAF7]/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-heading font-bold text-[#202B25] uppercase tracking-wider mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      name="fb_reg_email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="contact@example.org"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#123C2D]/12 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#16865B]/25 focus:border-[#16865B] bg-[#F8FAF7]/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-heading font-bold text-[#202B25] uppercase tracking-wider mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      type="text"
                      inputMode="tel"
                      required
                      name="fb_reg_phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98450 12345"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#123C2D]/12 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#16865B]/25 focus:border-[#16865B] bg-[#F8FAF7]/50"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-heading font-bold text-[#202B25] uppercase tracking-wider mb-1.5">
                      City / Locality *
                    </label>
                    <select
                      value={locationName}
                      name="fb_reg_locality"
                      onChange={(e) => setLocationName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#123C2D]/12 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#16865B]/25 focus:border-[#16865B] bg-[#F8FAF7]/50 cursor-pointer"
                    >
                      <option value="Manipal">Manipal</option>
                      <option value="Udupi">Udupi</option>
                      <option value="Santhekatte">Santhekatte</option>
                      <option value="Malpe">Malpe</option>
                      <option value="Brahmavar">Brahmavar</option>
                      <option value="Karkala">Karkala</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-heading font-bold text-[#202B25] uppercase tracking-wider mb-1.5">
                    Address / Landmark *
                  </label>
                  <input
                    type="text"
                    required
                    name="fb_reg_address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Street, Building, Landmark"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#123C2D]/12 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#16865B]/25 focus:border-[#16865B] bg-[#F8FAF7]/50"
                  />
                </div>

                {/* Conditional Donor Fields */}
                {selectedRole === 'donor' && (
                  <div className="space-y-4 pt-2 border-t border-[#123C2D]/8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-heading font-bold text-[#202B25] uppercase tracking-wider mb-1.5">
                          Kitchen / Establishment Type
                        </label>
                        <select
                          value={orgTypeDonor}
                          name="fb_reg_donor_type"
                          onChange={(e) => setOrgTypeDonor(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#123C2D]/12 text-xs sm:text-sm bg-[#F8FAF7]/50 cursor-pointer"
                        >
                          <option value="Restaurant">Restaurant</option>
                          <option value="College Canteen">College Canteen</option>
                          <option value="Hostel Mess">Hostel Mess</option>
                          <option value="Hotel Banquet">Hotel Banquet</option>
                          <option value="Corporate Cafeteria">Corporate Cafeteria</option>
                          <option value="Bakery">Bakery</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-heading font-bold text-[#202B25] uppercase tracking-wider mb-1.5">
                          FSSAI License / Registration No.
                        </label>
                        <input
                          type="text"
                          name="fb_reg_fssai"
                          value={fssaiLicense}
                          onChange={(e) => setFssaiLicense(e.target.value)}
                          placeholder="e.g. 11223344556677"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#123C2D]/12 text-xs sm:text-sm bg-[#F8FAF7]/50"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Conditional Receiver Fields */}
                {selectedRole === 'receiver' && (
                  <div className="space-y-4 pt-2 border-t border-[#123C2D]/8">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-heading font-bold text-[#123C2D] uppercase tracking-wider flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-[#16865B]" />
                          <span>Organization ID / NGO Reg No. * (Compulsory)</span>
                        </label>
                        <span className="text-[10px] font-mono font-bold text-[#16865B] bg-[#E8F5ED] px-2 py-0.5 rounded-full border border-[#16865B]/20">
                          Verification Check
                        </span>
                      </div>
                      <input
                        type="text"
                        required
                        name="fb_reg_org_id"
                        value={organizationId}
                        onChange={(e) => setOrganizationId(e.target.value)}
                        placeholder="e.g. NGO-KA-2024-8921 or DARPAN-ID"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#16865B]/30 text-xs sm:text-sm bg-[#E8F5ED]/20 font-mono focus:ring-2 focus:ring-[#16865B]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-heading font-bold text-[#202B25] uppercase tracking-wider mb-1.5">
                          Organization / Shelter Name *
                        </label>
                        <input
                          type="text"
                          required
                          name="fb_reg_org_name"
                          value={orgName}
                          onChange={(e) => setOrgName(e.target.value)}
                          placeholder="e.g. Hope Children's Home"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#123C2D]/12 text-xs sm:text-sm bg-[#F8FAF7]/50"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-heading font-bold text-[#202B25] uppercase tracking-wider mb-1.5">
                          Organization Type
                        </label>
                        <select
                          value={orgTypeReceiver}
                          name="fb_reg_receiver_type"
                          onChange={(e) => setOrgTypeReceiver(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#123C2D]/12 text-xs sm:text-sm bg-[#F8FAF7]/50 cursor-pointer"
                        >
                          <option value="NGO">NGO</option>
                          <option value="Orphanage">Orphanage</option>
                          <option value="Elderly Care Home">Elderly Care Home</option>
                          <option value="Community Shelter">Community Shelter</option>
                          <option value="Rehabilitation Center">Rehabilitation Center</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-heading font-bold text-[#202B25] uppercase tracking-wider mb-1.5">
                          Meal Intake Capacity (Beneficiaries)
                        </label>
                        <input
                          type="number"
                          min="5"
                          max="500"
                          name="fb_reg_capacity"
                          value={requiredCapacity}
                          onChange={(e) => setRequiredCapacity(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#123C2D]/12 text-xs sm:text-sm bg-[#F8FAF7]/50 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-heading font-bold text-[#202B25] uppercase tracking-wider mb-1.5">
                          Dietary Intake Preference
                        </label>
                        <select
                          value={dietaryPreference}
                          name="fb_reg_dietary"
                          onChange={(e) => setDietaryPreference(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#123C2D]/12 text-xs sm:text-sm bg-[#F8FAF7]/50 cursor-pointer"
                        >
                          <option value="Vegetarian">Strict Vegetarian</option>
                          <option value="Both">Both Veg & Non-Veg</option>
                          <option value="Vegan">Vegan</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Password Notice */}
                <div className="p-3 bg-[#E8F5ED]/80 border border-[#16865B]/20 rounded-2xl text-[#123C2D] text-xs flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#16865B] shrink-0" />
                  <p className="leading-snug">
                    Standard sign-in default password: <code className="font-mono font-bold bg-white px-1.5 py-0.5 rounded border border-[#16865B]/30 text-[#123C2D]">password123</code>.
                  </p>
                </div>

                {/* Submit Register CTA */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 rounded-full bg-[#123C2D] hover:bg-[#16865B] text-white font-heading font-extrabold text-sm shadow-md shadow-[#123C2D]/20 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50"
                >
                  {loading ? 'Creating Account...' : `Sign Up in ${selectedRole === 'donor' ? "Donor's Account" : "Receiver's Account"}`}
                  <ArrowRight className="w-4 h-4 text-[#E8F5ED]" />
                </button>

                {/* Switch to Sign In */}
                <div className="text-center pt-3 text-xs text-[#718078]">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('signin');
                      setError('');
                    }}
                    className="text-[#16865B] font-heading font-bold hover:underline cursor-pointer"
                  >
                    Sign in to {selectedRole === 'donor' ? "Donor's Account" : "Receiver's Account"} →
                  </button>
                </div>
              </form>
            )}

            {/* Bottom Quick Switch Note */}
            <div className="text-center pt-3 border-t border-gray-100 text-xs text-[#718078]">
              {authMode === 'signup' ? (
                <span>
                  Already registered?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('signin');
                      setError('');
                    }}
                    className="text-[#16865B] font-heading font-bold hover:underline cursor-pointer"
                  >
                    Sign In to Your Account →
                  </button>
                </span>
              ) : (
                <span>
                  Don't have an account yet?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('signup');
                      setError('');
                    }}
                    className="text-[#16865B] font-heading font-bold hover:underline cursor-pointer"
                  >
                    Create an Account (Sign Up) →
                  </button>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
