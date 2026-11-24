import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Utensils,
  HeartHandshake,
  ArrowRight,
  AlertCircle,
  Mail,
  Leaf,
  ShieldCheck,
  Building2,
  Phone,
  MapPin,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState('donor'); // 'donor' or 'receiver'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Common Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
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
  const [organizationId, setOrganizationId] = useState('');
  const [orgTypeReceiver, setOrgTypeReceiver] = useState('NGO');
  const [contactPerson, setContactPerson] = useState('');
  const [requiredCapacity, setRequiredCapacity] = useState(40);
  const [dietaryPreference, setDietaryPreference] = useState('Both');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (role === 'receiver' && (!organizationId || !organizationId.trim())) {
        setError('Official Organization ID / NGO Registration Number is compulsory for receivers.');
        setLoading(false);
        return;
      }

      const payload = {
        full_name: fullName,
        email: email.trim().toLowerCase(),
        password: 'password123', // Automatically assigned standard default password for email sign-in
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
              organization_id: organizationId.trim(),
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
    <div className="min-h-[90vh] flex items-center justify-center p-4 sm:p-6 lg:p-10 animate-fade-in font-sans">
      <div className="w-full max-w-5xl bg-white rounded-3xl border border-[#123C2D]/10 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        {/* Left Side: Brand & Community Impact Showcase */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#123C2D] via-[#16865B] to-[#0B261D] p-8 sm:p-10 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#42B883]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-inner">
                <Leaf className="w-6 h-6 text-[#E8F5ED]" />
              </div>
              <div>
                <span className="font-heading text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
                  FoodBridge <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#E8F5ED]/20 text-[#E8F5ED] border border-white/30">AI</span>
                </span>
                <p className="text-[11px] text-[#E8F5ED]/80 font-medium">
                  Join the Zero Food Waste Movement
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-white leading-snug">
                One Platform.<br />
                <span className="text-[#42B883]">Two Vital Roles.</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#E8F5ED]/85 leading-relaxed">
                Connect your organization to real-time redistribution logistics. Eliminate food waste and deliver wholesome meals where they are needed most.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-1">
                <div className="flex items-center gap-2 text-white font-heading font-bold text-xs">
                  <Utensils className="w-4 h-4 text-[#42B883]" />
                  <span>For Food Donors</span>
                </div>
                <p className="text-[11px] text-[#E8F5ED]/80 leading-relaxed">
                  List surplus batches within 60 seconds. Our AI algorithm finds the closest shelter to prevent spoilage.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-1">
                <div className="flex items-center gap-2 text-white font-heading font-bold text-xs">
                  <HeartHandshake className="w-4 h-4 text-[#E9A23B]" />
                  <span>For Food Receivers</span>
                </div>
                <p className="text-[11px] text-[#E8F5ED]/80 leading-relaxed">
                  Browse edible surplus tailored to your capacity, request meals, and coordinate volunteer van pickups.
                </p>
              </div>
            </div>
          </div>

          <div className="relative pt-6 border-t border-white/10 text-[11px] text-[#E8F5ED]/60 flex items-center justify-between">
            <span>FSSAI Hygiene Standards</span>
            <span className="font-mono text-[#42B883] font-bold">100% Verified</span>
          </div>
        </div>

        {/* Right Side: Registration Form */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center bg-white">
          <div className="max-w-xl w-full mx-auto space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8F5ED] text-[#123C2D] text-[11px] font-heading font-extrabold border border-[#16865B]/20 mb-2">
                <Sparkles className="w-3 h-3 text-[#16865B]" />
                <span>Account Registration</span>
              </div>
              <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-[#123C2D] tracking-tight">
                Create Your Account
              </h1>
              <p className="text-xs text-[#718078] mt-1">
                Choose your role to configure your verified organization profile.
              </p>
            </div>

            {/* TWO PRIMARY OPTIONS: SIGN UP IN DONOR'S ACCOUNT OR RECEIVER'S ACCOUNT */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-heading font-extrabold text-[#202B25] uppercase tracking-wider">
                  Select Registration Option:
                </span>
                <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                  role === 'donor'
                    ? 'bg-[#E8F5ED] text-[#123C2D] border border-[#16865B]/20'
                    : 'bg-[#FEF7EC] text-[#9A6217] border border-[#E9A23B]/30'
                }`}>
                  Selected: {role === 'donor' ? "Donor's Account" : "Receiver's Account"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5 p-1.5 bg-[#F8FAF7] rounded-2xl border border-[#123C2D]/12">
                <button
                  type="button"
                  onClick={() => { setRole('donor'); setError(''); }}
                  className={`py-3 px-3 rounded-xl text-xs font-heading font-extrabold transition-all flex flex-col sm:flex-row items-center justify-center gap-2 cursor-pointer ${
                    role === 'donor'
                      ? 'bg-[#123C2D] text-white shadow-md shadow-[#123C2D]/20 scale-[1.01]'
                      : 'text-[#718078] hover:text-[#123C2D] hover:bg-white/70'
                  }`}
                >
                  <Utensils className={`w-4 h-4 shrink-0 ${role === 'donor' ? 'text-[#42B883]' : 'text-[#16865B]'}`} />
                  <div className="text-center sm:text-left leading-tight">
                    <div className="text-xs font-bold">Sign Up in Donor's Account</div>
                    <div className={`text-[10px] font-normal ${role === 'donor' ? 'text-[#E8F5ED]/80' : 'text-[#718078]'}`}>
                      Kitchens & Canteens
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => { setRole('receiver'); setError(''); }}
                  className={`py-3 px-3 rounded-xl text-xs font-heading font-extrabold transition-all flex flex-col sm:flex-row items-center justify-center gap-2 cursor-pointer ${
                    role === 'receiver'
                      ? 'bg-[#123C2D] text-white shadow-md shadow-[#123C2D]/20 scale-[1.01]'
                      : 'text-[#718078] hover:text-[#123C2D] hover:bg-white/70'
                  }`}
                >
                  <HeartHandshake className={`w-4 h-4 shrink-0 ${role === 'receiver' ? 'text-[#E9A23B]' : 'text-[#9A6217]'}`} />
                  <div className="text-center sm:text-left leading-tight">
                    <div className="text-xs font-bold">Sign Up in Receiver's Account</div>
                    <div className={`text-[10px] font-normal ${role === 'receiver' ? 'text-[#E8F5ED]/80' : 'text-[#718078]'}`}>
                      Shelters & NGOs
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs font-medium flex items-start gap-2.5 animate-fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-bold">{error}</p>
                  {error.includes('Cannot connect') && (
                    <p className="text-[11px] text-rose-700 font-mono bg-white p-2 rounded-lg border border-rose-200">
                      💡 Tip: Run <code>python -m uvicorn app.main:app --reload --port 8000</code> in your terminal.
                    </p>
                  )}
                </div>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              autoComplete="off"
              noValidate
              data-lpignore="true"
              data-form-type="other"
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-heading font-bold text-[#202B25] uppercase tracking-wider mb-1.5">
                    {role === 'donor' ? 'Donor / Contact Name *' : 'Manager Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    name="fb_contact_name_field"
                    autoComplete="new-off"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck="false"
                    data-lpignore="true"
                    data-form-type="other"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Ramesh Hegde"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#123C2D]/12 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#16865B]/25 focus:border-[#16865B] bg-[#F8FAF7]/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-heading font-bold text-[#202B25] uppercase tracking-wider mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="text"
                    inputMode="email"
                    required
                    name="fb_org_contact_email_addr"
                    autoComplete="new-off"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck="false"
                    data-lpignore="true"
                    data-form-type="other"
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
                    name="fb_contact_tele_num"
                    autoComplete="new-off"
                    data-lpignore="true"
                    data-form-type="other"
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
                    name="fb_select_locality"
                    autoComplete="new-off"
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
                  name="fb_street_landmark_addr"
                  autoComplete="new-off"
                  data-lpignore="true"
                  data-form-type="other"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street, Building, Landmark"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#123C2D]/12 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-[#16865B]/25 focus:border-[#16865B] bg-[#F8FAF7]/50"
                />
              </div>

              {/* Conditional Donor Fields */}
              {role === 'donor' && (
                <div className="space-y-4 pt-3 border-t border-[#123C2D]/8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-heading font-bold text-[#202B25] uppercase tracking-wider mb-1.5">
                        Kitchen / Establishment Type
                      </label>
                      <select
                        value={orgTypeDonor}
                        name="fb_donor_estab_type"
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
                        name="fb_fssai_lic_reg_val"
                        autoComplete="new-off"
                        data-lpignore="true"
                        data-form-type="other"
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
              {role === 'receiver' && (
                <div className="space-y-4 pt-3 border-t border-[#123C2D]/8">
                  {/* Mandatory Organization ID */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-heading font-bold text-[#123C2D] uppercase tracking-wider flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-[#16865B]" />
                        <span>Organization ID / NGO Reg No. * (Compulsory)</span>
                      </label>
                      <span className="text-[10px] font-mono font-bold text-[#16865B] bg-[#E8F5ED] px-2.5 py-0.5 rounded-full border border-[#16865B]/20">
                        Statutory Check
                      </span>
                    </div>
                    <input
                      type="text"
                      required
                      name="fb_receiver_org_id_compulsory"
                      autoComplete="new-off"
                      data-lpignore="true"
                      data-form-type="other"
                      value={organizationId}
                      onChange={(e) => setOrganizationId(e.target.value)}
                      placeholder="e.g. NGO-KA-2024-8921 or DARPAN-ID"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#16865B]/30 text-xs sm:text-sm bg-[#E8F5ED]/20 font-mono focus:ring-2 focus:ring-[#16865B]"
                    />
                    <p className="text-[11px] text-[#718078] mt-1">
                      Mandatory registration number to verify legitimate NGO / shelter status before receiving food allocations.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-heading font-bold text-[#202B25] uppercase tracking-wider mb-1.5">
                        Organization / Shelter Name *
                      </label>
                      <input
                        type="text"
                        required
                        name="fb_receiver_org_name_val"
                        autoComplete="new-off"
                        data-lpignore="true"
                        data-form-type="other"
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
                        name="fb_receiver_type_sel"
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
                        name="fb_receiver_cap_num"
                        autoComplete="new-off"
                        data-lpignore="true"
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
                        name="fb_receiver_diet_sel"
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

              {/* Password notice card */}
              <div className="p-3 bg-[#E8F5ED]/80 border border-[#16865B]/20 rounded-2xl text-[#123C2D] text-xs flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#16865B] shrink-0" />
                <p className="leading-snug">
                  <strong>Password-Free Registration:</strong> No password entry required here. Sign in later on the Login page using your email and default password <code className="font-mono font-bold bg-white px-1.5 py-0.5 rounded border border-[#16865B]/30 text-[#123C2D]">password123</code>.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-full bg-[#123C2D] hover:bg-[#16865B] text-white font-heading font-extrabold text-sm shadow-md shadow-[#123C2D]/20 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50 mt-2"
              >
                {loading ? 'Creating Account...' : `Sign Up in ${role === 'donor' ? "Donor's Account" : "Receiver's Account"}`}
                <ArrowRight className="w-4 h-4 text-[#E8F5ED]" />
              </button>
            </form>

            <div className="text-center pt-4 border-t border-gray-100 text-xs text-[#718078]">
              Already registered?{' '}
              <Link to={`/login?role=${role}`} className="text-[#16865B] font-heading font-bold hover:underline">
                Sign In to {role === 'donor' ? "Donor's Account" : "Receiver's Account"} →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
