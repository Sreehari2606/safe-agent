import { useState } from 'react';
import {
  Phone, AlertTriangle, Shield, Heart, ChevronRight,
  MapPin, Clock, AlertOctagon, CheckCircle, X
} from 'lucide-react';

const EMERGENCY_CONTACTS = [
  { name: 'Police', number: '100', desc: 'Law enforcement', color: 'blue', emoji: '👮' },
  { name: 'Ambulance', number: '108', desc: 'Medical emergency', color: 'red', emoji: '🚑' },
  { name: 'Fire Brigade', number: '101', desc: 'Fire & rescue', color: 'orange', emoji: '🚒' },
  { name: 'Unified Emergency', number: '112', desc: 'All emergencies (India)', color: 'purple', emoji: '🆘' },
  { name: 'Swiggy Support', number: '1800-208-9999', desc: 'Delivery helpline (DEMO)', color: 'swiggy', emoji: '🛵' },
  { name: 'Road Helpline', number: '1033', desc: 'National Highways helpline', color: 'green', emoji: '🛣️' },
];

const COLOR_CLASSES = {
  blue: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
  red: 'bg-red-500/10 border-red-500/20 text-red-400',
  orange: 'bg-orange-500/10 border-orange-500/20 text-orange-400',
  purple: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
  swiggy: 'bg-swiggy-orange/10 border-swiggy-orange/20 text-swiggy-orange',
  green: 'bg-green-500/10 border-green-500/20 text-green-400',
};

const SAFETY_STEPS = [
  { icon: '1️⃣', step: 'Stay calm and assess the situation.' },
  { icon: '2️⃣', step: 'Move to a safe area away from traffic or hazards.' },
  { icon: '3️⃣', step: 'Call 112 (or relevant emergency number) immediately.' },
  { icon: '4️⃣', step: 'Share your location using the GPS coordinates below.' },
  { icon: '5️⃣', step: 'Contact Swiggy support to pause your deliveries.' },
  { icon: '6️⃣', step: 'Do not move an injured person unless in immediate danger.' },
  { icon: '7️⃣', step: 'Stay on the line with emergency services until help arrives.' },
];

function SOSModal({ onClose }) {
  const [step, setStep] = useState('confirm'); // confirm | sending | done

  const handleSOS = () => {
    setStep('sending');
    setTimeout(() => setStep('done'), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="card max-w-md w-full p-6 border-red-500/30">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-white text-lg flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-red-400" />
            SOS Demo
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === 'confirm' && (
          <>
            <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 mb-5">
              <p className="text-yellow-300 text-sm font-semibold mb-1">⚠️ DEMO ONLY</p>
              <p className="text-yellow-200/80 text-xs leading-relaxed">
                This is a demonstration. <strong>No actual emergency alert will be sent.</strong>
                In a real emergency, call <strong>112</strong> immediately.
              </p>
            </div>
            <p className="text-gray-300 text-sm mb-5">
              In the full version, pressing SOS would send your GPS location and emergency 
              notification to your registered emergency contacts and Swiggy support.
            </p>
            <div className="flex gap-3">
              <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
              <button onClick={handleSOS} className="btn-danger flex-1 flex items-center justify-center gap-2">
                <AlertOctagon className="w-4 h-4" /> Demo SOS
              </button>
            </div>
          </>
        )}

        {step === 'sending' && (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center mx-auto mb-4 sos-pulse">
              <AlertOctagon className="w-8 h-8 text-red-400" />
            </div>
            <p className="text-white font-semibold">Simulating SOS...</p>
            <p className="text-gray-400 text-sm mt-1">Sending demo alert to contacts</p>
          </div>
        )}

        {step === 'done' && (
          <div className="text-center py-6">
            <div className="w-16 h-16 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
            <p className="text-white font-semibold">Demo SOS Sent!</p>
            <p className="text-gray-400 text-sm mt-1">In production, your location would be shared with emergency contacts.</p>
            <div className="mt-4 p-3 bg-navy-800 rounded-xl text-xs text-left space-y-1">
              <p className="text-green-400">✓ Location shared: Bengaluru, Karnataka</p>
              <p className="text-green-400">✓ Alert sent to: Emergency Contact 1</p>
              <p className="text-green-400">✓ Swiggy support notified</p>
              <p className="text-yellow-400">⚠ This was a demo – no real alert was sent</p>
            </div>
            <button onClick={onClose} className="btn-primary w-full mt-4">Close</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Emergency() {
  const [showSOS, setShowSOS] = useState(false);

  return (
    <div className="p-4 lg:p-6 max-w-5xl mx-auto space-y-6">
      {showSOS && <SOSModal onClose={() => setShowSOS(false)} />}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Phone className="w-6 h-6 text-red-400" />
          Emergency Assistance
        </h1>
        <p className="text-gray-400 text-sm mt-1">Emergency contacts and safety protocols for delivery partners.</p>
      </div>

      {/* SOS Button */}
      <div className="card p-6 border-red-500/20 bg-red-500/5">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <button
            onClick={() => setShowSOS(true)}
            className="w-28 h-28 rounded-full bg-red-600 hover:bg-red-700 border-4 border-red-400/50 
              flex flex-col items-center justify-center shadow-2xl transition-all duration-200 
              active:scale-95 sos-pulse shrink-0"
          >
            <AlertOctagon className="w-8 h-8 text-white" />
            <span className="text-white font-black text-lg mt-1">SOS</span>
          </button>
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Emergency SOS</h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              Press the SOS button to trigger a demo emergency alert. 
              <strong className="text-yellow-400"> In production</strong>, this would send your GPS location 
              to your emergency contacts and Swiggy support.
            </p>
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <AlertTriangle className="w-3.5 h-3.5 text-yellow-400" />
              <span className="text-xs text-yellow-300 font-medium">DEMO – Does NOT contact emergency services</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Emergency Contacts */}
        <div>
          <h2 className="section-title mb-4 flex items-center gap-2">
            <Phone className="w-4 h-4 text-swiggy-orange" />
            Emergency Contacts
          </h2>
          <div className="space-y-3">
            {EMERGENCY_CONTACTS.map(({ name, number, desc, color, emoji }) => (
              <div
                key={name}
                className={`card p-4 flex items-center gap-4 border ${COLOR_CLASSES[color]}`}
              >
                <span className="text-2xl shrink-0">{emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-white text-sm">{name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-black ${COLOR_CLASSES[color].split(' ').pop()}`}>{number}</p>
                  <p className="text-xs text-gray-500">Dial now</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Safety Protocol */}
        <div>
          <h2 className="section-title mb-4 flex items-center gap-2">
            <Shield className="w-4 h-4 text-swiggy-orange" />
            Emergency Protocol
          </h2>
          <div className="card p-5">
            <div className="space-y-3">
              {SAFETY_STEPS.map(({ icon, step }) => (
                <div key={step} className="flex items-start gap-3">
                  <span className="text-lg shrink-0">{icon}</span>
                  <p className="text-sm text-gray-300 leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* First Aid */}
          <div className="card p-5 mt-4 border-red-500/20 bg-red-500/5">
            <h3 className="font-semibold text-white flex items-center gap-2 mb-3">
              <Heart className="w-4 h-4 text-red-400" />
              Basic First Aid Reminders
            </h3>
            <ul className="space-y-2 text-xs text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-red-400 shrink-0 mt-0.5">•</span>
                <span>For bleeding: apply firm pressure with a clean cloth. Do not remove it.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 shrink-0 mt-0.5">•</span>
                <span>For fractures: immobilise the limb. Do not try to straighten it.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 shrink-0 mt-0.5">•</span>
                <span>For unconscious person: check breathing and place in recovery position if breathing.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 shrink-0 mt-0.5">•</span>
                <span>Always call for professional help. First aid is a bridge until help arrives.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="card p-4 border-yellow-500/20 bg-yellow-500/5">
        <p className="text-xs text-yellow-300 text-center">
          ⚠️ <strong>Important:</strong> This is a demonstration application. 
          The SOS button does NOT contact real emergency services. In an emergency, dial <strong>112</strong>.
          Emergency contact numbers shown are real India helplines.
        </p>
      </div>
    </div>
  );
}

