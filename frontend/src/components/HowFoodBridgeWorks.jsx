import React, { useState } from 'react';
import {
  Utensils,
  Sparkles,
  Bell,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  Clock,
  MapPin,
  Truck,
  Leaf,
  Droplets,
  HeartHandshake,
  Users
} from 'lucide-react';

export const HowFoodBridgeWorks = () => {
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    {
      step: 1,
      title: 'Donor posts food',
      icon: Utensils,
      color: '#16865B',
      summary: 'A college canteen lists 40 meal portions, their preparation time, location and consumption deadline.',
      exampleDetails: {
        establishment: 'MIT Food Court Canteen, Manipal',
        item: '40 Portions of Steamed Rice & Dal Makhani',
        prepTime: 'Today at 12:45 PM',
        storage: 'Thermal Holding (> 65°C)',
        deadline: 'Safe Consumption within 4.5 Hours',
        location: 'Food Court Counter 2, MIT Campus'
      }
    },
    {
      step: 2,
      title: 'AI ranks suitable receivers',
      icon: Sparkles,
      color: '#E9A23B',
      summary: 'The system compares nearby verified organizations based on distance, required quantity, availability and urgency.',
      exampleDetails: {
        algorithm: 'Multi-Factor Geodesic Optimization',
        factors: [
          'Location Proximity (40%): Hope Orphanage is only 0.57 km away',
          'Capacity Absorption (25%): 40 portions matches shelter demand (40 meals)',
          'Urgency Window (25%): 4.5 hours safe window prioritized for immediate dispatch',
          'Dietary Verification (10%): 100% vegetarian match confirmed'
        ],
        topCandidate: 'Hope Children’s Orphanage & Care Home (94% Match Score)'
      }
    },
    {
      step: 3,
      title: 'Receiver gets an alert',
      icon: Bell,
      color: '#123C2D',
      summary: 'The best-ranked eligible receivers are notified and can request the food. The donor confirms the allocation.',
      exampleDetails: {
        alertChannel: 'Instant Push & In-App Proximity Notification',
        message: '🚨 Fresh Cooked Meals Available 0.57 km away from Hope Shelter!',
        action: 'Shelter coordinator requests 40 portions',
        approval: 'Canteen manager accepts allocation with 1-click confirmation'
      }
    },
    {
      step: 4,
      title: 'Pickup is confirmed',
      icon: Truck,
      color: '#16865B',
      summary: 'The receiver collects the food, and the donation status is updated.',
      exampleDetails: {
        logistics: 'Volunteer collection van arrives at 1:20 PM',
        verification: 'Digital handover inspection and temperature check verified',
        lifecycleUpdate: 'Status updated from "Accepted" to "Ready for Pickup" to "Collected"',
        auditLog: 'Handover timestamp recorded with zero missed pickup penalties'
      }
    },
    {
      step: 5,
      title: 'Impact is recorded',
      icon: TrendingUp,
      color: '#42B883',
      summary: 'The dashboard updates the amount of food redistributed and its estimated environmental impact.',
      exampleDetails: {
        mealsRedistributed: '+40 Meals Provided to Children',
        peopleFed: '40 Vulnerable Community Members Fed',
        co2Prevented: '100 kg CO₂e Methane & Emissions Averted',
        waterConserved: '14,000 Liters of Embedded Agricultural Water Saved',
        landfillDiversion: '100% Organic Waste Diverted from Municipal Landfills'
      }
    }
  ];

  const current = steps.find((s) => s.step === activeStep) || steps[0];

  return (
    <section className="bg-white rounded-3xl p-6 sm:p-10 border border-[#123C2D]/8 shadow-[0_4px_24px_-4px_rgba(18,60,45,0.04)] space-y-8 font-sans">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E8F5ED] text-[#123C2D] text-xs font-heading font-extrabold border border-[#16865B]/20 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#E9A23B]" />
            <span>ALGORITHMIC REDISTRIBUTION ARCHITECTURE</span>
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#123C2D] tracking-tight mt-2">
            Example of How Your AI System Works
          </h2>
          <p className="text-xs sm:text-sm text-[#718078] mt-1 max-w-2xl">
            From the moment surplus food is recorded at a college canteen to doorstep distribution at a local care shelter.
          </p>
        </div>

        {/* Live Step Progress Pill */}
        <span className="text-xs font-mono font-bold text-[#16865B] bg-[#E8F5ED] px-3.5 py-1.5 rounded-full border border-[#16865B]/20 self-start md:self-auto">
          Active Step: {activeStep} of 5
        </span>
      </div>

      {/* 5-Step Interactive Navigation Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 p-1.5 bg-[#F8FAF7] rounded-2xl border border-gray-200">
        {steps.map((s) => {
          const Icon = s.icon;
          const isActive = activeStep === s.step;
          return (
            <button
              key={s.step}
              type="button"
              onClick={() => setActiveStep(s.step)}
              className={`p-3 rounded-xl transition-all flex flex-col items-center text-center gap-1.5 cursor-pointer ${
                isActive
                  ? 'bg-[#123C2D] text-white shadow-md shadow-[#123C2D]/20 scale-[1.02]'
                  : 'text-[#718078] hover:text-[#123C2D] hover:bg-white/80'
              }`}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono font-bold ${
                isActive ? 'bg-[#42B883] text-[#123C2D]' : 'bg-gray-200 text-[#718078]'
              }`}>
                {s.step}
              </div>
              <span className="font-heading font-extrabold text-[11px] leading-tight line-clamp-1">
                {s.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* Step Detail Card with Simulated Real-Time System Example */}
      <div className="p-6 sm:p-8 bg-[#F8FAF7] rounded-3xl border border-[#123C2D]/10 space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200/80">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#123C2D] text-white flex items-center justify-center shadow-xs">
              <current.icon className="w-5 h-5 text-[#42B883]" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase font-bold text-[#16865B]">
                Step {current.step} Workflow
              </span>
              <h3 className="font-heading font-extrabold text-xl text-[#123C2D]">
                {current.title}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeStep > 1 && (
              <button
                type="button"
                onClick={() => setActiveStep((prev) => Math.max(1, prev - 1))}
                className="px-3 py-1.5 rounded-full border border-gray-300 text-xs font-bold text-[#718078] hover:bg-white"
              >
                ← Prev
              </button>
            )}
            {activeStep < 5 && (
              <button
                type="button"
                onClick={() => setActiveStep((prev) => Math.min(5, prev + 1))}
                className="px-4 py-1.5 rounded-full bg-[#123C2D] text-white text-xs font-bold flex items-center gap-1 shadow-xs hover:bg-[#16865B]"
              >
                <span>Next Step</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        <p className="text-sm text-[#202B25] font-medium leading-relaxed bg-white p-4 rounded-2xl border border-gray-200/60 shadow-2xs">
          <strong>Process Overview:</strong> {current.summary}
        </p>

        {/* Realistic Scenario Demonstration Box */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-heading font-bold text-[#718078] uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#16865B]" />
              <span>Live Scenario Demonstration (Canteen-to-Shelter):</span>
            </span>
            <span className="text-[10px] font-mono text-[#16865B] font-bold bg-[#E8F5ED] px-2 py-0.5 rounded-md border border-[#16865B]/20">
              Verified Pipeline
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#123C2D]/8 shadow-2xs space-y-3">
            {activeStep === 1 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 bg-[#F8FAF7] rounded-xl border border-gray-100">
                  <span className="text-[10px] text-[#718078] font-mono block">Donor Kitchen:</span>
                  <span className="font-heading font-bold text-[#202B25]">{current.exampleDetails.establishment}</span>
                </div>
                <div className="p-2.5 bg-[#F8FAF7] rounded-xl border border-gray-100">
                  <span className="text-[10px] text-[#718078] font-mono block">Surplus Portions:</span>
                  <span className="font-heading font-bold text-[#16865B]">{current.exampleDetails.item}</span>
                </div>
                <div className="p-2.5 bg-[#F8FAF7] rounded-xl border border-gray-100">
                  <span className="text-[10px] text-[#718078] font-mono block">Preparation & Storage:</span>
                  <span className="font-medium text-[#202B25]">{current.exampleDetails.prepTime} • {current.exampleDetails.storage}</span>
                </div>
                <div className="p-2.5 bg-[#F8FAF7] rounded-xl border border-gray-100">
                  <span className="text-[10px] text-[#718078] font-mono block">Consumption Deadline:</span>
                  <span className="font-heading font-bold text-[#9A6217]">{current.exampleDetails.deadline}</span>
                </div>
              </div>
            )}

            {activeStep === 2 && (
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-[#E8F5ED] rounded-xl border border-[#16865B]/20 text-[#123C2D]">
                  <span className="font-heading font-extrabold text-xs block">AI Weighted Compatibility Score:</span>
                  <span className="font-heading font-black text-lg text-[#16865B]">{current.exampleDetails.topCandidate}</span>
                </div>
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono font-bold uppercase text-[#718078]">Factor Evaluation Matrix:</span>
                  {current.exampleDetails.factors.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 text-[11px] text-[#202B25]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#16865B] shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeStep === 3 && (
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-[#FEF7EC] rounded-xl border border-[#E9A23B]/30 text-[#9A6217] space-y-1">
                  <span className="font-heading font-bold text-xs flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5 text-[#E9A23B] animate-pulse" />
                    <span>{current.exampleDetails.alertChannel}</span>
                  </span>
                  <p className="font-mono text-[11px] text-[#202B25] bg-white p-2 rounded-lg border border-[#E9A23B]/20">
                    "{current.exampleDetails.message}"
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2.5 bg-[#F8FAF7] rounded-xl border border-gray-100">
                    <span className="text-[#718078] block">Receiver Response:</span>
                    <strong className="text-[#202B25]">{current.exampleDetails.action}</strong>
                  </div>
                  <div className="p-2.5 bg-[#F8FAF7] rounded-xl border border-gray-100">
                    <span className="text-[#718078] block">Donor Action:</span>
                    <strong className="text-[#16865B]">{current.exampleDetails.approval}</strong>
                  </div>
                </div>
              </div>
            )}

            {activeStep === 4 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-[#F8FAF7] rounded-xl border border-gray-100 space-y-0.5">
                  <span className="text-[10px] font-mono text-[#718078]">Volunteer Transit:</span>
                  <p className="font-heading font-bold text-[#202B25]">{current.exampleDetails.logistics}</p>
                </div>
                <div className="p-3 bg-[#F8FAF7] rounded-xl border border-gray-100 space-y-0.5">
                  <span className="text-[10px] font-mono text-[#718078]">Quality Verification:</span>
                  <p className="font-heading font-bold text-[#16865B]">{current.exampleDetails.verification}</p>
                </div>
                <div className="p-3 bg-[#F8FAF7] rounded-xl border border-gray-100 space-y-0.5 sm:col-span-2">
                  <span className="text-[10px] font-mono text-[#718078]">Lifecycle Audit Update:</span>
                  <p className="font-medium text-[#202B25]">{current.exampleDetails.lifecycleUpdate}</p>
                </div>
              </div>
            )}

            {activeStep === 5 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                <div className="p-3 bg-[#E8F5ED] rounded-xl border border-[#16865B]/20">
                  <span className="text-[9px] font-mono text-[#718078] block uppercase">Meals Delivered</span>
                  <span className="font-heading font-black text-lg text-[#123C2D]">40 Meals</span>
                  <span className="text-[9px] text-[#16865B] block">40 People Fed</span>
                </div>
                <div className="p-3 bg-[#E8F5ED] rounded-xl border border-[#16865B]/20">
                  <span className="text-[9px] font-mono text-[#718078] block uppercase">CO₂e Prevented</span>
                  <span className="font-heading font-black text-lg text-[#16865B]">100 kg</span>
                  <span className="text-[9px] text-[#718078] block">Methane Avoided</span>
                </div>
                <div className="p-3 bg-[#E8F5ED] rounded-xl border border-[#16865B]/20">
                  <span className="text-[9px] font-mono text-[#718078] block uppercase">Water Conserved</span>
                  <span className="font-heading font-black text-lg text-[#123C2D]">14,000 L</span>
                  <span className="text-[9px] text-[#718078] block">Virtual Water</span>
                </div>
                <div className="p-3 bg-[#FEF7EC] rounded-xl border border-[#E9A23B]/30">
                  <span className="text-[9px] font-mono text-[#718078] block uppercase">Landfill Decay</span>
                  <span className="font-heading font-black text-lg text-[#9A6217]">0% Decay</span>
                  <span className="text-[9px] text-[#9A6217] block">Zero Waste</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
