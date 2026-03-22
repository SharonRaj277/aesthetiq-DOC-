import React, { useState, useEffect, createContext, useContext, useRef, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, Navigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Home, Users, Calendar, User, Bell, Search, Video, Phone, Check, X, AlertCircle, ArrowLeft, MoreVertical, Download, Plus, Star, DollarSign, LogOut, ShieldCheck, MapPin, GraduationCap, MessageSquare, Mail, Lock, Eye, EyeOff, Camera, ZoomIn, ZoomOut } from 'lucide-react';
import Cropper from 'react-easy-crop';
import { cn, DOCTOR, TODAY_APPOINTMENTS, EMERGENCY_REQUEST, PATIENTS, TRANSACTIONS, AVAILABLE_SLOTS, NOTIFICATIONS, getAvatarGradient } from './constants';

// --- CONTEXT ---

interface DoctorContextType {
  profilePic: string | null;
  setProfilePic: (url: string | null) => void;
}

const DoctorContext = createContext<DoctorContextType | undefined>(undefined);

const DoctorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profilePic, setProfilePic] = useState<string | null>(null);

  return (
    <DoctorContext.Provider value={{ profilePic, setProfilePic }}>
      {children}
    </DoctorContext.Provider>
  );
};

const useDoctor = () => {
  const context = useContext(DoctorContext);
  if (context === undefined) {
    throw new Error('useDoctor must be used within a DoctorProvider');
  }
  return context;
};

// --- HELPERS ---

const getCroppedImg = async (imageSrc: string, pixelCrop: any): Promise<string | null> => {
  const image = new Image();
  image.src = imageSrc;
  await new Promise((resolve) => (image.onload = resolve));

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) return null;

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return canvas.toDataURL('image/jpeg');
};

// --- COMPONENTS ---

const DoctorTabBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const tabs = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Patients', path: '/patients', icon: Users },
    { name: 'Schedule', path: '/schedule', icon: Calendar },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  const activeIndex = tabs.findIndex(tab => location.pathname === tab.path);
  const activeTab = activeIndex === -1 ? 0 : activeIndex;

  // Only show tab bar on main tab routes and emergency screen
  const showTabBar = activeIndex !== -1 || location.pathname.startsWith('/emergency/');
  if (!showTabBar) return null;

  return (
    <div className="absolute bottom-4 left-4 right-4 h-[72px] bg-white rounded-[36px] shadow-premium border border-primary/5 flex items-center px-2 z-50">
      <div className="relative flex w-full h-full items-center">
        {/* Active Pill Background */}
        <motion.div
          className="absolute h-12 w-12 bg-gradient-to-r from-primary to-primary-light rounded-full top-1/2 -translate-y-1/2 z-0"
          initial={false}
          animate={{
            left: `calc(${activeTab * 25}% + (25% - 48px) / 2)`,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
        
        {tabs.map((tab, idx) => {
          const isActive = location.pathname === tab.path;
          const Icon = tab.icon;
          
          return (
            <button
              key={tab.name}
              onClick={() => navigate(tab.path)}
              className="relative flex-1 flex items-center justify-center h-full z-10 transition-colors"
            >
              <div className={cn(
                "flex items-center justify-center",
                isActive ? "text-white" : "text-text-muted"
              )}>
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              {tab.name === 'Dashboard' && !isActive && (
                <div className="absolute top-4 right-6 w-4 h-4 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-[8px] text-white font-bold">
                  3
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// --- SCREENS ---

const LoginScreen = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-full bg-[#0D0A1A] relative overflow-y-auto flex flex-col px-8 py-12">
      {/* Decorative Circles */}
      <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-primary/15 rounded-full blur-[80px]" />
      <div className="absolute top-[-50px] right-[-50px] w-[200px] h-[200px] bg-primary-light/10 rounded-full blur-[60px]" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[250px] h-[250px] bg-primary/12 rounded-full blur-[80px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="text-primary-light text-3xl mb-2">✦</div>
          <h1 className="text-4xl font-bold text-white italic">AesthetiQ</h1>
          <p className="text-[11px] text-primary-light tracking-[0.2em] uppercase mt-1">Doctor Portal</p>
        </div>

        <div className="h-[1px] bg-white/10 w-full my-10" />

        <h2 className="text-2xl font-bold text-white text-center mb-2">Welcome Back</h2>
        <p className="text-sm text-white/50 text-center mb-8">Sign in to your doctor account</p>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="text-[11px] text-white/60 uppercase tracking-wider mb-2 block">Email Address</label>
            <div className="h-14 bg-white/8 rounded-2xl border border-white/15 flex items-center px-4 focus-within:border-primary-light transition-colors">
              <Mail className="text-white/40 mr-3" size={20} />
              <input
                type="email"
                placeholder="doctor@aesthetiq.com"
                className="bg-transparent flex-1 text-white text-[15px] outline-none placeholder:text-white/30"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] text-white/60 uppercase tracking-wider mb-2 block">Password</label>
            <div className="h-14 bg-white/8 rounded-2xl border border-white/15 flex items-center px-4 focus-within:border-primary-light transition-colors">
              <Lock className="text-white/40 mr-3" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="bg-transparent flex-1 text-white text-[15px] outline-none placeholder:text-white/30"
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-white/40 ml-2">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <button type="button" className="text-[13px] text-primary-light mt-2 float-right">Forgot Password?</button>
          </div>

          <button
            disabled={loading}
            className="w-full btn-primary mt-8 relative overflow-hidden"
          >
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
              />
            ) : "Sign In"}
          </button>
        </form>

        <p className="text-[11px] text-white/30 text-center mt-8 leading-relaxed">
          Doctor access only. Patient app available<br />on App Store & Play Store.
        </p>
      </motion.div>
    </div>
  );
};

// --- MAIN APP WRAPPER ---

export default function App() {
  return (
    <DoctorProvider>
      <Router>
      <div className="max-w-[430px] mx-auto h-screen bg-background relative shadow-2xl overflow-hidden">
        <div className="absolute inset-0 overflow-y-auto overflow-x-hidden">
          <Routes>
            <Route path="/" element={<LoginScreen />} />
            <Route path="/dashboard" element={<DashboardScreen />} />
            <Route path="/patients" element={<PatientsScreen />} />
            <Route path="/schedule" element={<ScheduleScreen />} />
            <Route path="/profile" element={<ProfileScreen />} />
            <Route path="/patient/:id" element={<PatientProfileScreen />} />
            <Route path="/scan/:id" element={<PatientScanReportScreen />} />
            <Route path="/call/:id" element={<CallScreen />} />
            <Route path="/emergency/:id" element={<EmergencyCallScreen />} />
            <Route path="/notes/:id" element={<WriteNotesScreen />} />
            <Route path="/plan/:id" element={<CreatePlanScreen />} />
            <Route path="/earnings" element={<EarningsScreen />} />
            <Route path="/notifications" element={<NotificationsScreen />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
        <DoctorTabBar />
        <SaveScheduleButton />
      </div>
    </Router>
    </DoctorProvider>
  );
}

const SaveScheduleButton = () => {
  const location = useLocation();
  const [saved, setSaved] = useState(false);
  
  if (location.pathname !== '/schedule') return null;
  
  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };
  
  return (
    <div className="absolute bottom-24 left-5 right-5 z-40">
      <button 
        onClick={handleSave}
        className={cn(
          "w-full h-14 rounded-2xl font-bold transition-all flex items-center justify-center gap-2",
          saved ? "bg-green-500 text-white" : "bg-primary text-white shadow-lg shadow-primary/20"
        )}
      >
        {saved ? (
          <>
            <Check size={20} />
            Schedule Saved
          </>
        ) : "Save Schedule"}
      </button>
    </div>
  );
};

// --- PLACEHOLDER SCREENS (To be expanded) ---

const DashboardScreen = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [showEmergency, setShowEmergency] = useState(true);
  const navigate = useNavigate();
  const { profilePic } = useDoctor();

  return (
    <div className="pb-48">
      {/* Header */}
      <div className="pt-10 px-5 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white font-bold text-lg overflow-hidden">
              {profilePic ? (
                <img src={profilePic} alt="Doctor" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                'A'
              )}
            </div>
            <div className={cn(
              "absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white",
              isOnline ? "bg-green-500" : "bg-gray-400"
            )} />
          </div>
          <div>
            <h3 className="text-sm text-text-secondary">Good morning, Dr. Aryan 👋</h3>
            <p className="text-[11px] text-text-muted">Aesthetic Dermatologist</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsOnline(!isOnline)}
            className={cn(
              "h-8 px-3 rounded-full border flex items-center gap-2 transition-all",
              isOnline ? "bg-green-50 border-green-200 text-green-600" : "bg-gray-50 border-gray-200 text-gray-500"
            )}
          >
            <div className={cn("w-2 h-2 rounded-full", isOnline ? "bg-green-500 animate-pulse" : "bg-gray-400")} />
            <span className="text-xs font-bold">{isOnline ? 'Online' : 'Offline'}</span>
          </button>
          <button 
            onClick={() => navigate('/notifications')}
            className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <Bell size={24} className="text-text-secondary" />
            <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white" />
          </button>
        </div>
      </div>

      {/* Emergency Banner */}
      <AnimatePresence>
        {showEmergency && isOnline && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-4 mb-4"
          >
            <div className="bg-gradient-to-r from-red-600 via-red-500 to-red-400 rounded-2xl p-4 flex items-center shadow-lg shadow-red-500/20">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                <span className="text-lg">🚨</span>
              </div>
              <div className="flex-1 ml-3">
                <h4 className="text-sm font-bold text-white">1 Emergency Request Waiting</h4>
                <p className="text-[11px] text-white/80">🦷 Severe Dental Pain · Vikram S. · 4 min ago</p>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => navigate('/emergency/em_001')}
                  className="bg-white px-4 py-1.5 rounded-full text-red-500 text-xs font-bold"
                >
                  Accept
                </button>
                <button onClick={() => setShowEmergency(false)} className="text-white/60 p-1">
                  <X size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-3 px-4 mb-6">
        <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 relative overflow-hidden">
          <Calendar className="absolute top-3 right-3 text-primary/20" size={24} />
          <span className="text-3xl font-bold text-primary">3</span>
          <p className="text-xs text-text-muted mt-1">Today's Schedule</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-4 relative shadow-sm">
          <Users className="absolute top-3 right-3 text-gray-200" size={24} />
          <span className="text-3xl font-bold text-text-primary">11</span>
          <p className="text-xs text-text-muted mt-1">This Week</p>
        </div>
        <button 
          onClick={() => navigate('/earnings')}
          className="bg-amber-50 border border-amber-100 rounded-2xl p-4 relative text-left"
        >
          <DollarSign className="absolute top-3 right-3 text-amber-200" size={24} />
          <span className="text-2xl font-bold text-amber-600">₹1,600</span>
          <p className="text-xs text-text-muted mt-1">Pending Payout</p>
        </button>
        <div className="bg-green-50 border border-green-100 rounded-2xl p-4 relative">
          <Star className="absolute top-3 right-3 text-green-200" size={24} />
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-text-primary">4.8</span>
            <span className="text-lg">⭐</span>
          </div>
          <p className="text-[11px] text-text-muted mt-1">124 reviews</p>
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Today's Schedule</h3>
          <span className="text-xs text-text-muted">3 appointments</span>
        </div>

        <div className="space-y-3">
          {TODAY_APPOINTMENTS.map((appt, i) => (
            <motion.div
              key={appt.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="bg-primary/10 px-3 py-1 rounded-lg text-primary text-xs font-bold">
                  {appt.slotTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <div className="bg-gray-100 px-3 py-1 rounded-full text-text-secondary text-[10px]">
                  {appt.treatmentName}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-full bg-gradient-to-br flex items-center justify-center text-white font-bold",
                  getAvatarGradient(appt.patientName).join(' ')
                )}>
                  {appt.patientName[0]}
                </div>
                <div className="flex-1">
                  <h4 className="text-[15px] font-bold">{appt.patientName}</h4>
                  <p className="text-xs text-text-muted">{appt.patientAge}y · {appt.patientCity}</p>
                </div>
                {appt.hasScanFindings && (
                  <div className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-bold",
                    appt.scanType === 'skin' ? "bg-pink-100 text-pink-700" : 
                    appt.scanType === 'facial' ? "bg-primary/10 text-primary" : "bg-blue-100 text-blue-700"
                  )}>
                    {appt.scanType === 'skin' ? '🧖 Skin' : appt.scanType === 'facial' ? '✨ Facial' : '🦷 Dental'}
                  </div>
                )}
              </div>

              <div className="h-[1px] bg-gray-50 w-full my-4" />

              <div className="flex gap-3">
                <button 
                  onClick={() => navigate(`/patient/${appt.patientUid}`)}
                  className="flex-1 h-10 rounded-full border-[1.5px] border-primary bg-white text-primary text-xs font-bold"
                >
                  View Patient
                </button>
                <button 
                  onClick={() => navigate(`/call/${appt.id}`)}
                  className="flex-1 h-10 rounded-full bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-bold flex items-center justify-center gap-2"
                >
                  <Video size={16} />
                  Join Call
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const PatientsScreen = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'active'>('all');

  const filteredPatients = PATIENTS.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         patient.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || patient.hasActivePlan;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-5 pb-48 min-h-full">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold">My Patients</h1>
        <button className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
          <Plus size={20} />
        </button>
      </div>
      <p className="text-sm text-text-muted mb-6">{filteredPatients.length} patients found</p>

      <div className="h-12 bg-white rounded-full border border-gray-200 flex items-center px-4 mb-6 shadow-sm focus-within:border-primary/30 transition-all">
        <Search size={20} className="text-text-muted mr-2" />
        <input 
          type="text" 
          placeholder="Search by name or city..." 
          className="bg-transparent flex-1 outline-none text-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} className="text-text-muted hover:text-primary">
            <X size={16} />
          </button>
        )}
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
        <button 
          onClick={() => setFilter('all')}
          className={cn(
            "px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all",
            filter === 'all' ? "bg-primary text-white shadow-md shadow-primary/20" : "bg-white text-text-muted border border-gray-100"
          )}
        >
          All Patients
        </button>
        <button 
          onClick={() => setFilter('active')}
          className={cn(
            "px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all",
            filter === 'active' ? "bg-primary text-white shadow-md shadow-primary/20" : "bg-white text-text-muted border border-gray-100"
          )}
        >
          Active Plans
        </button>
      </div>

      <div className="space-y-3">
        {filteredPatients.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users size={32} className="text-gray-300" />
            </div>
            <p className="text-sm text-text-muted">No patients match your search</p>
          </div>
        ) : (
          filteredPatients.map(patient => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={patient.uid}
              onClick={() => navigate(`/patient/${patient.uid}`)}
              className="glass-card p-4 flex flex-col cursor-pointer hover:border-primary/20 transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={cn(
                  "w-14 h-14 rounded-full bg-gradient-to-br flex items-center justify-center text-white font-bold text-xl",
                  getAvatarGradient(patient.name).join(' ')
                )}>
                  {patient.name[0]}
                </div>
                <div className="flex-1">
                  <h4 className="text-base font-bold">{patient.name}</h4>
                  <p className="text-xs text-text-muted">{patient.age}y · {patient.city}</p>
                  {patient.hasActivePlan && (
                    <p className="text-[11px] text-primary mt-1 font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                      {patient.planName}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-[11px] text-text-muted">{patient.totalVisits} visits</p>
                  <p className="text-[10px] text-primary font-bold mt-1 uppercase tracking-wider">View Profile</p>
                </div>
              </div>
              
              <div className="h-[1px] bg-gray-50 w-full mb-4" />

              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <div className="bg-primary/5 px-2 py-1 rounded-full text-[10px] font-bold text-primary">✨ {patient.aesthetiqScore}</div>
                  <div className="bg-pink-50 px-2 py-1 rounded-full text-[10px] font-bold text-pink-600">🧖 {patient.skinScore}</div>
                  <div className="bg-blue-50 px-2 py-1 rounded-full text-[10px] font-bold text-blue-600">🦷 {patient.dentalScore}</div>
                </div>
                <span className="text-xs text-primary font-bold">View Profile →</span>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

const ScheduleScreen = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [slots, setSlots] = useState<Record<string, string[]>>({
    [new Date().toDateString()]: ['09:00', '09:15', '09:30', '10:00', '10:15', '10:30', '11:00', '14:00', '14:30']
  });
  const [isAdding, setIsAdding] = useState(false);
  const [newTime, setNewTime] = useState('10:00');
  
  const dates = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  const dateKey = selectedDate.toDateString();
  const currentSlots = slots[dateKey] || [];

  const handleAddSlot = () => {
    if (!newTime) return;
    setSlots(prev => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), newTime].sort()
    }));
    setIsAdding(false);
  };

  const handleRemoveSlot = (time: string) => {
    setSlots(prev => ({
      ...prev,
      [dateKey]: prev[dateKey].filter(t => t !== time)
    }));
  };

  return (
    <div className="pb-56 min-h-full">
      <div className="p-5">
        <h1 className="text-2xl font-bold mb-1">My Schedule</h1>
        <p className="text-sm text-text-muted">Set your available time slots</p>
      </div>

      <div className="flex overflow-x-auto px-5 gap-3 no-scrollbar mb-8">
        {dates.map((date, i) => {
          const isSelected = date.toDateString() === selectedDate.toDateString();
          return (
            <button
              key={i}
              onClick={() => setSelectedDate(date)}
              className={cn(
                "flex-shrink-0 w-14 py-3 rounded-2xl flex flex-col items-center transition-all",
                isSelected ? "bg-primary text-white shadow-lg shadow-primary/30" : "bg-white text-text-muted border border-gray-100"
              )}
            >
              <span className="text-[10px] uppercase mb-1">{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
              <span className="text-lg font-bold">{date.getDate()}</span>
              {!isSelected && <div className="w-1 h-1 bg-primary rounded-full mt-1" />}
            </button>
          );
        })}
      </div>

      <div className="px-5">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-bold">{selectedDate.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</h3>
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-primary/10 px-4 py-1.5 rounded-full text-primary text-xs font-bold"
          >
            + Add
          </button>
        </div>

        {currentSlots.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
            <p className="text-xs text-text-muted">No slots added for this day</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {currentSlots.map((time, i) => {
              const isBooked = i % 4 === 0 && i !== 0; // Just for visual variety
              return (
                <div
                  key={time}
                  className={cn(
                    "h-11 rounded-2xl flex items-center justify-center text-xs font-bold border transition-all relative group",
                    isBooked ? "bg-blue-50 border-blue-200 text-blue-700" : "bg-white border-primary text-primary"
                  )}
                >
                  {time}
                  {isBooked && <div className="ml-2 w-1.5 h-1.5 bg-blue-500 rounded-full" />}
                  
                  <button 
                    onClick={() => handleRemoveSlot(time)}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-[8px] opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Slot Modal */}
      {isAdding && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-end sm:items-center justify-center p-4">
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="bg-white w-full max-w-sm rounded-[32px] p-6 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">Add Time Slot</h3>
              <button onClick={() => setIsAdding(false)} className="text-text-muted"><X size={20} /></button>
            </div>
            
            <div className="mb-8">
              <label className="text-xs font-bold text-text-muted uppercase mb-2 block">Select Time</label>
              <input 
                type="time" 
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="w-full h-14 bg-gray-50 rounded-2xl px-4 text-lg font-bold outline-none focus:ring-2 ring-primary/20"
              />
            </div>

            <button 
              onClick={handleAddSlot}
              className="w-full h-14 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/20"
            >
              Add Slot
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

const ProfileScreen = () => {
  const navigate = useNavigate();
  const { profilePic, setProfilePic } = useDoctor();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageToCrop(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveCrop = async () => {
    if (imageToCrop && croppedAreaPixels) {
      try {
        const croppedImage = await getCroppedImg(imageToCrop, croppedAreaPixels);
        setProfilePic(croppedImage);
        setImageToCrop(null);
        setZoom(1);
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div className="pb-48">
      <div className="bg-dark-bg h-[240px] relative flex flex-col items-center justify-center pt-10">
        <div className="relative group">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary-light border-4 border-white/10 flex items-center justify-center text-white text-3xl font-bold mb-3 overflow-hidden">
            {profilePic ? (
              <img src={profilePic} alt="Doctor" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            ) : (
              'A'
            )}
          </div>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-2 right-0 w-8 h-8 bg-primary rounded-full border-2 border-white flex items-center justify-center text-white shadow-lg active:scale-90 transition-transform"
          >
            <Camera size={16} />
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
        </div>
        <h2 className="text-xl font-bold text-white">Dr. Aryan Mehta</h2>
        <p className="text-sm text-white/70">Aesthetic Dermatologist · Mumbai</p>
        
        <div className="mt-3 bg-green-500/20 border border-green-500/30 px-4 py-1 rounded-full flex items-center gap-2">
          <ShieldCheck size={14} className="text-green-500" />
          <span className="text-[10px] text-green-500 font-bold uppercase tracking-wider">Verified Practitioner</span>
        </div>
      </div>

      {/* Image Cropper Modal */}
      <AnimatePresence>
        {imageToCrop && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-[100] flex flex-col"
          >
            <div className="p-5 flex items-center justify-between text-white relative z-10">
              <button onClick={() => setImageToCrop(null)} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10">
                <X size={20} />
              </button>
              <h3 className="font-bold">Edit Profile Picture</h3>
              <button onClick={handleSaveCrop} className="px-5 h-10 bg-primary rounded-full font-bold text-sm">
                Save
              </button>
            </div>

            <div className="flex-1 relative bg-black">
              <Cropper
                image={imageToCrop}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                cropShape="round"
                showGrid={false}
              />
            </div>

            <div className="p-8 bg-black/80 backdrop-blur-md relative z-10">
              <div className="flex items-center gap-4 mb-2">
                <ZoomOut size={16} className="text-white/50" />
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  aria-labelledby="Zoom"
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="flex-1 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <ZoomIn size={16} className="text-white/50" />
              </div>
              <p className="text-[10px] text-white/40 text-center uppercase tracking-widest font-bold">Pinch or slide to zoom · Drag to move</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-around py-6 bg-white border-b border-gray-50">
        <div className="text-center">
          <p className="text-lg font-bold">340</p>
          <p className="text-[10px] text-text-muted uppercase">Consults</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold">4.8 ⭐</p>
          <p className="text-[10px] text-text-muted uppercase">Rating</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold">8 Yrs</p>
          <p className="text-[10px] text-text-muted uppercase">Exp</p>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="glass-card p-5">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold">About</h4>
            <button className="text-xs text-primary font-bold">Edit</button>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed mb-4">
            {DOCTOR.about}
          </p>
          <div className="space-y-3 pt-3 border-t border-gray-50">
            <div className="flex items-center gap-3 text-xs">
              <GraduationCap size={16} className="text-primary" />
              <span>MBBS, MD Dermatology</span>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <MapPin size={16} className="text-primary" />
              <span>Mumbai, Maharashtra</span>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <MessageSquare size={16} className="text-primary" />
              <span>English, Hindi, Marathi</span>
            </div>
          </div>
        </div>

        <div className="glass-card p-5">
          <h4 className="text-sm font-bold mb-4">Specializations</h4>
          <div className="flex flex-wrap gap-2">
            {['RF Microneedling', 'Botox', 'Chemical Peels', 'Fillers', 'Skin Analysis'].map(s => (
              <div key={s} className="px-3 py-1.5 rounded-full border border-primary/20 text-[10px] text-primary font-bold">
                {s}
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card overflow-hidden">
          {[
            { icon: DollarSign, label: 'My Earnings', path: '/earnings' },
            { icon: Calendar, label: 'Set Availability', path: '/schedule' },
            { icon: Star, label: 'My Reviews', path: '#' },
            { icon: Bell, label: 'Notifications', path: '/notifications' },
          ].map((item, i) => (
            <button 
              key={i}
              onClick={() => item.path !== '#' && navigate(item.path)}
              className="w-full flex items-center justify-between p-4 border-b border-gray-50 last:border-0"
            >
              <div className="flex items-center gap-3">
                <item.icon size={18} className="text-text-secondary" />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
              <span className="text-gray-300">→</span>
            </button>
          ))}
        </div>

        <button 
          onClick={() => navigate('/')}
          className="w-full h-14 rounded-[28px] border-[1.5px] border-red-500 text-red-500 font-bold flex items-center justify-center gap-2 mt-4"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  );
};

const PatientProfileScreen = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('Scans');
  
  const patient = PATIENTS.find(p => p.uid === id) || PATIENTS[0];

  return (
    <div className="min-h-full bg-background pb-32">
      <div className="sticky top-0 z-50 bg-background p-5 flex items-center justify-between border-b border-gray-100 shadow-sm transition-all h-[80px]">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center border border-gray-100">
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <h3 className="text-lg font-bold text-[#1E293B]">Patient Profile</h3>
        <div className="w-10" />
      </div>

      <div className="px-5 sticky top-[80px] z-40 bg-background py-4 shadow-sm">
        <div className="bg-gradient-to-br from-[#F5F3FF] to-[#EFF6FF] rounded-3xl p-6 border border-white shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -mr-16 -mt-16 blur-2xl" />
          
          <div className="flex flex-row items-center gap-6 relative z-10">
            <div className={cn(
              "w-20 h-20 rounded-full border-4 border-white shadow-xl flex items-center justify-center text-white text-2xl font-bold shrink-0 ring-4 ring-white/50",
              getAvatarGradient(patient.name).join(' ')
            )}>
              {patient.name[0]}
            </div>
            
            <div className="flex-1">
              <h2 className="text-xl font-bold text-[#1E293B]">{patient.name}</h2>
              <p className="text-xs text-gray-500 mt-0.5 font-medium">{patient.age}y · {patient.city}</p>
              
              <div className="flex flex-wrap gap-2 mt-3">
                <div className="bg-[#F5F3FF] px-2.5 py-1 rounded-full text-[10px] font-bold text-[#7C3AED] border border-white shadow-sm flex items-center gap-1">
                  <span>✨</span> {patient.aesthetiqScore}
                </div>
                <div className="bg-[#FFF1F2] px-2.5 py-1 rounded-full text-[10px] font-bold text-[#E11D48] border border-white shadow-sm flex items-center gap-1">
                  <span>🧖</span> {patient.skinScore}
                </div>
                <div className="bg-[#F0F9FF] px-2.5 py-1 rounded-full text-[10px] font-bold text-[#0284C7] border border-white shadow-sm flex items-center gap-1">
                  <span>🦷</span> {patient.dentalScore}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="sticky top-[236px] z-30 bg-background px-5 py-2 border-b border-gray-100 shadow-sm">
        <div className="flex border-b border-gray-100">
          {['Scans', 'Reports', 'History'].map((tab) => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)}
              className={cn(
                "flex-1 py-3 text-sm font-bold relative transition-colors",
                activeTab === tab ? "text-[#7C3AED]" : "text-gray-400"
              )}
            >
              {tab}
              {activeTab === tab && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7C3AED]" 
                />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 space-y-4 pt-4">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={16} className="text-amber-600" />
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Upcoming Consultation</span>
          </div>
          <p className="text-sm font-bold">RF Microneedling</p>
          <p className="text-xs text-amber-700 mt-1">Today · 10:30 AM</p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="space-y-3"
          >
            {activeTab === 'Scans' && (
              <>
                {[1, 2].map(i => (
                  <div 
                    key={i}
                    onClick={() => navigate(`/scan/${patient.uid}_scan_${i}`)}
                    className="glass-card p-4 flex items-center gap-4 cursor-pointer hover:border-primary/20"
                  >
                    <div className="w-12 h-12 rounded-xl bg-pink-50 flex items-center justify-center text-pink-500">
                      <Search size={24} />
                    </div>
                    <div className="flex-1">
                      <h5 className="text-sm font-bold">Skin Scan Analysis</h5>
                      <p className="text-[11px] text-text-muted">{18 - i} Mar 2026 · Score: {72 - i * 2}</p>
                    </div>
                    <div className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-1 rounded">Tier 3</div>
                  </div>
                ))}
              </>
            )}

            {activeTab === 'Reports' && (
              <div className="text-center py-10">
                <p className="text-xs text-text-muted">No medical reports available yet.</p>
              </div>
            )}

            {activeTab === 'History' && (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="glass-card p-4 border-l-4 border-l-primary">
                    <p className="text-xs font-bold text-text-muted mb-1">1{i} Feb 2026</p>
                    <h5 className="text-sm font-bold">General Consultation</h5>
                    <p className="text-[11px] text-text-secondary mt-1">Patient reported mild dryness and sensitivity.</p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

const PatientScanReportScreen = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const patientUid = id?.split('_')[0];

  return (
    <div className="min-h-full bg-background pb-32">
      <div className="p-5 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="w-10 h-10 glass-card flex items-center justify-center">
          <ArrowLeft size={20} />
        </button>
        <h3 className="text-lg font-bold">Scan Report</h3>
      </div>

      <div className="px-5">
        <div className="bg-pink-500 rounded-3xl p-6 text-white mb-6 relative overflow-hidden">
          <div className="absolute top-[-20px] right-[-20px] w-32 h-32 bg-white/10 rounded-full" />
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Search size={20} />
              </div>
              <div>
                <h4 className="font-bold">Skin Analysis</h4>
                <p className="text-xs text-white/70">18 Mar 2026</p>
              </div>
            </div>
            <div className="text-3xl font-bold">72</div>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white w-[72%]" />
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6">
          <h5 className="text-sm font-bold text-amber-800 flex items-center gap-2 mb-2">
            <AlertCircle size={16} />
            Tier 3 — Moderate Concern
          </h5>
          <p className="text-xs text-amber-700 leading-relaxed">
            Moderate acne detected primarily on the chin and jawline region, consistent with hormonal pattern.
          </p>
        </div>

        <div className="glass-card p-5 mb-6">
          <h5 className="text-sm font-bold mb-3">AI Analysis</h5>
          <p className="text-xs text-text-secondary leading-relaxed">
            Post-inflammatory hyperpigmentation present from previous breakouts. Fitzpatrick Type IV noted. Moderate papular acne — chin/jawline distribution.
          </p>
        </div>

        <h5 className="text-sm font-bold mb-4">Patient Photos</h5>
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="aspect-square bg-gray-200 rounded-xl flex items-center justify-center text-gray-400">
              <User size={24} />
            </div>
          ))}
        </div>

        <button className="w-full btn-primary flex items-center justify-center gap-2">
          <Download size={20} />
          Download Full Report
        </button>
      </div>

      <div className="fixed bottom-6 left-0 right-0 px-6 z-40 flex justify-center">
        <div className="bg-white/80 backdrop-blur-xl h-[76px] rounded-[38px] px-3 flex gap-3 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-white/50 items-center">
          <button 
            onClick={() => navigate(`/notes/${patientUid}`)} 
            className="h-14 px-6 rounded-full bg-[#7C3AED] text-white font-bold text-sm shadow-lg shadow-purple-500/30 active:scale-95 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <MessageSquare size={18} />
            Write Notes
          </button>
          <button 
            onClick={() => navigate(`/plan/${patientUid}`)} 
            className="h-14 px-6 rounded-full bg-[#111827] text-white font-bold text-sm shadow-lg shadow-black/20 active:scale-95 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <Plus size={18} />
            Create Plan
          </button>
        </div>
      </div>
    </div>
  );
};

const CallScreen = () => {
  const navigate = useNavigate();
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-full bg-dark-bg relative overflow-hidden">
      {/* Remote Video Placeholder */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center text-white text-4xl font-bold mb-4">
          S
        </div>
        <p className="text-white/60 text-sm">Sharon Mathew joined</p>
      </div>

      {/* Doctor PiP */}
      <div className="absolute bottom-40 right-4 w-28 h-40 bg-primary-dark rounded-2xl border-2 border-white/20 overflow-hidden shadow-2xl">
        <div className="absolute inset-0 flex items-center justify-center text-white/20">
          <User size={40} />
        </div>
        <div className="absolute bottom-2 left-0 right-0 text-center">
          <span className="text-[10px] text-white font-bold bg-black/40 px-2 py-0.5 rounded">Dr. Aryan</span>
        </div>
      </div>

      {/* Top Overlay */}
      <div className="absolute top-0 left-0 right-0 p-6 pt-12 bg-gradient-to-b from-black/60 to-transparent">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-bold">Sharon Mathew</h3>
          <div className="bg-white/10 px-3 py-1 rounded-full text-white text-xs font-bold">
            {formatTime(timer)}
          </div>
        </div>
        <div className="mt-3 bg-amber-500/20 border border-amber-500/30 px-3 py-1.5 rounded-full inline-flex items-center gap-2">
          <span className="text-[10px] text-amber-500 font-bold uppercase">🧖 Skin — Tier 3 concern</span>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-8 pb-12 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-around">
        <button className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-white">
          <Home size={24} />
        </button>
        <button className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-white">
          <Video size={24} />
        </button>
        <button 
          onClick={() => navigate('/notes/appt_001')}
          className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center text-white shadow-lg shadow-red-500/40"
        >
          <Phone size={28} className="rotate-[135deg]" />
        </button>
        <button className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-white">
          <MessageSquare size={24} />
        </button>
        <button className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center text-white">
          <Users size={24} />
        </button>
      </div>
    </div>
  );
};

const EmergencyCallScreen = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-full bg-red-950 flex flex-col items-center py-12 pb-32 p-6 text-center overflow-y-auto">
      <div className="text-6xl mb-6 animate-bounce">🚨</div>
      <h1 className="text-3xl font-bold text-white mb-2">Emergency Request</h1>
      <p className="text-red-200 mb-10">Vikram Singh · Severe Dental Pain</p>

      <div className="w-full glass-card bg-white/10 border-white/20 p-6 mb-10">
        <div className="w-20 h-20 rounded-full bg-red-500/20 mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
          V
        </div>
        <h3 className="text-white font-bold text-lg">Vikram Singh</h3>
        <p className="text-red-300 text-sm mb-4">🦷 Severe Dental Pain</p>
        <div className="bg-red-500/30 border border-red-500/50 px-4 py-1.5 rounded-full inline-block">
          <span className="text-xs text-red-100 font-bold uppercase">High Severity</span>
        </div>
      </div>

      <div className="w-full space-y-4">
        <button 
          onClick={() => navigate('/call/em_001')}
          className="w-full h-14 rounded-[28px] bg-white text-red-600 font-bold text-lg shadow-xl"
        >
          Accept & Join Call
        </button>
        <button 
          onClick={() => navigate(-1)}
          className="w-full h-12 rounded-[24px] border border-white/30 text-white/60 font-medium"
        >
          Pass to Another Doctor
        </button>
      </div>
    </div>
  );
};

const WriteNotesScreen = () => {
  const navigate = useNavigate();
  const [decision, setDecision] = useState<string | null>(null);

  return (
    <div className="min-h-full bg-white">
      <div className="p-5 flex items-center justify-between border-b border-gray-50">
        <button onClick={() => navigate(-1)} className="text-text-muted">Cancel</button>
        <h3 className="text-lg font-bold">Consultation Notes</h3>
        <button 
          disabled={!decision}
          onClick={() => navigate('/dashboard')}
          className="text-primary font-bold disabled:opacity-30"
        >
          Done
        </button>
      </div>

      <div className="p-5 space-y-8">
        <div>
          <h4 className="text-sm font-bold mb-4">1. Your Decision</h4>
          <div className="space-y-3">
            {[
              { id: 'approved', label: 'Approved to Proceed', icon: '✅', color: 'green' },
              { id: 'modified', label: 'Modified Plan', icon: '⚠️', color: 'amber' },
              { id: 'not_suitable', label: 'Not Suitable', icon: '❌', color: 'red' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setDecision(item.id)}
                className={cn(
                  "w-full p-4 rounded-2xl border-[1.5px] flex items-center gap-4 transition-all",
                  decision === item.id 
                    ? `bg-${item.color}-50 border-${item.color}-500 shadow-sm` 
                    : "bg-white border-gray-100"
                )}
              >
                <span className="text-2xl">{item.icon}</span>
                <span className={cn("flex-1 text-left font-bold", decision === item.id ? `text-${item.color}-700` : "text-text-primary")}>
                  {item.label}
                </span>
                {decision === item.id && <Check size={20} className={`text-${item.color}-500`} />}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-bold mb-3">2. Clinical Notes</h4>
          <textarea 
            placeholder="Write your clinical observations..."
            className="w-full h-32 bg-gray-50 rounded-2xl p-4 text-sm outline-none focus:ring-2 ring-primary/20"
          />
        </div>

        <div>
          <h4 className="text-sm font-bold mb-3">3. Diagnosis</h4>
          <textarea 
            placeholder="Enter diagnosis..."
            className="w-full h-24 bg-gray-50 rounded-2xl p-4 text-sm outline-none focus:ring-2 ring-primary/20"
          />
        </div>
      </div>
    </div>
  );
};

const CreatePlanScreen = () => {
  const navigate = useNavigate();
  const [planName, setPlanName] = useState('');
  const [treatmentType, setTreatmentType] = useState('Skin');
  const [phases, setPhases] = useState([{ id: 1, name: '', duration: '', instructions: '' }]);
  const [isCreating, setIsCreating] = useState(false);

  const addPhase = () => {
    setPhases([...phases, { id: phases.length + 1, name: '', duration: '', instructions: '' }]);
  };

  const removePhase = (id: number) => {
    if (phases.length === 1) return;
    setPhases(phases.filter(p => p.id !== id));
  };

  const handleCreate = () => {
    setIsCreating(true);
    setTimeout(() => {
      setIsCreating(false);
      navigate(-1);
    }, 1500);
  };

  return (
    <div className="min-h-full bg-white pb-20">
      <div className="p-5 flex items-center justify-between border-b border-gray-50 sticky top-0 bg-white z-10">
        <button onClick={() => navigate(-1)} className="text-text-muted">Cancel</button>
        <h3 className="text-lg font-bold">Create Treatment Plan</h3>
        <button 
          onClick={handleCreate}
          disabled={!planName || isCreating}
          className="text-primary font-bold disabled:opacity-30"
        >
          {isCreating ? "..." : "Create"}
        </button>
      </div>

      <div className="p-5 space-y-6">
        <div>
          <label className="text-xs font-bold text-text-muted uppercase mb-2 block">Plan Name</label>
          <input 
            type="text" 
            value={planName}
            onChange={(e) => setPlanName(e.target.value)}
            placeholder="e.g. RF Microneedling Programme"
            className="w-full h-12 bg-gray-50 rounded-xl px-4 text-sm outline-none focus:ring-2 ring-primary/20"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-text-muted uppercase mb-2 block">Treatment Type</label>
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {['Skin', 'Dental', 'Aesthetic', 'Other'].map((t) => (
              <button 
                key={t} 
                onClick={() => setTreatmentType(t)}
                className={cn(
                  "px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all",
                  treatmentType === t ? "bg-primary text-white shadow-md shadow-primary/20" : "bg-gray-100 text-text-muted"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-sm font-bold mb-4">Treatment Phases</h4>
          <div className="space-y-4">
            {phases.map((phase, index) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={phase.id} 
                className="bg-gray-50 rounded-2xl p-4 border border-dashed border-gray-300 relative"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-1 rounded">Phase {index + 1}</span>
                  {phases.length > 1 && (
                    <button onClick={() => removePhase(phase.id)} className="text-red-500 text-[10px] font-bold">Remove</button>
                  )}
                </div>
                <input type="text" placeholder="Phase name" className="w-full bg-transparent border-b border-gray-200 py-2 text-sm mb-3 outline-none focus:border-primary/30" />
                <input type="text" placeholder="Duration (e.g. 2 weeks)" className="w-full bg-transparent border-b border-gray-200 py-2 text-sm mb-3 outline-none focus:border-primary/30" />
                <textarea placeholder="Instructions" className="w-full bg-transparent py-2 text-sm outline-none h-20 resize-none" />
              </motion.div>
            ))}
          </div>
          
          <button 
            onClick={addPhase}
            className="w-full h-12 border-2 border-dashed border-primary/30 rounded-2xl mt-4 text-primary text-sm font-bold flex items-center justify-center gap-2 hover:bg-primary/5 transition-all"
          >
            <Plus size={18} />
            Add Another Phase
          </button>
        </div>
      </div>

      {isCreating && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-[100] flex items-center justify-center">
          <div className="text-center">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full mx-auto mb-4"
            />
            <p className="text-sm font-bold text-primary">Creating Plan...</p>
          </div>
        </div>
      )}
    </div>
  );
};

const EarningsScreen = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-full bg-background">
      <div className="p-5 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="w-10 h-10 glass-card flex items-center justify-center">
          <ArrowLeft size={20} />
        </button>
        <h3 className="text-lg font-bold">My Earnings</h3>
      </div>

      <div className="px-5">
        <div className="glass-card p-6 mb-6">
          <p className="text-xs text-text-muted mb-1">Total Earned</p>
          <h2 className="text-3xl font-bold text-green-600 mb-6">₹1,72,000</h2>
          
          <div className="grid grid-cols-3 gap-2 pt-6 border-t border-gray-50">
            <div className="text-center">
              <p className="text-sm font-bold text-amber-600">₹1,600</p>
              <p className="text-[9px] text-text-muted uppercase">Pending</p>
            </div>
            <div className="text-center border-x border-gray-50">
              <p className="text-sm font-bold text-primary">₹3,200</p>
              <p className="text-[9px] text-text-muted uppercase">This Month</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-bold">124</p>
              <p className="text-[9px] text-text-muted uppercase">Consults</p>
            </div>
          </div>
          <p className="text-[10px] text-text-muted text-center mt-6">Next payout: Friday, 28 Mar</p>
        </div>

        <h4 className="text-sm font-bold mb-4">Recent Transactions</h4>
        <div className="space-y-3">
          {TRANSACTIONS.map(tx => (
            <div key={tx.txId} className="glass-card p-4 flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-full bg-gradient-to-br flex items-center justify-center text-white font-bold",
                getAvatarGradient(tx.patientName).join(' ')
              )}>
                {tx.patientName[0]}
              </div>
              <div className="flex-1">
                <h5 className="text-sm font-bold">{tx.patientName}</h5>
                <p className="text-[10px] text-text-muted">{tx.treatmentName}</p>
              </div>
              <div className="text-right">
                <p className={cn("text-sm font-bold", tx.status === 'paid' ? "text-green-600" : "text-amber-600")}>
                  ₹{tx.doctorEarning}
                </p>
                <span className={cn(
                  "text-[8px] font-bold uppercase px-1.5 py-0.5 rounded",
                  tx.status === 'paid' ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                )}>
                  {tx.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const NotificationsScreen = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-full bg-background">
      <div className="p-5 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="w-10 h-10 glass-card flex items-center justify-center">
          <ArrowLeft size={20} />
        </button>
        <h3 className="text-lg font-bold">Notifications</h3>
      </div>

      <div className="px-5 space-y-3">
        {NOTIFICATIONS.map(notif => (
          <div 
            key={notif.id} 
            className={cn(
              "glass-card p-4 flex gap-4 relative overflow-hidden",
              !notif.isRead && "border-l-4 border-l-primary bg-primary/5"
            )}
          >
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
              notif.type === 'emergency' ? "bg-red-100 text-red-600" :
              notif.type === 'appointment' ? "bg-blue-100 text-blue-600" :
              notif.type === 'payment' ? "bg-green-100 text-green-600" :
              "bg-amber-100 text-amber-600"
            )}>
              {notif.type === 'emergency' ? <AlertCircle size={20} /> :
               notif.type === 'appointment' ? <Calendar size={20} /> :
               notif.type === 'payment' ? <DollarSign size={20} /> :
               <Star size={20} />}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h5 className="text-sm font-bold">{notif.title}</h5>
                <span className="text-[10px] text-text-muted">{notif.time}</span>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">{notif.message}</p>
            </div>
            {!notif.isRead && (
              <div className="absolute top-4 right-4 w-2 h-2 bg-primary rounded-full" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
