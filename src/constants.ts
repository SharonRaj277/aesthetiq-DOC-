import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Mock Doctor
export const DOCTOR = {
  uid: 'doc_001',
  name: 'Dr. Aryan Mehta',
  specialization: 'Aesthetic Dermatologist',
  degree: 'MBBS, MD Dermatology',
  experience: 8,
  rating: 4.8,
  ratingCount: 124,
  totalConsultations: 340,
  totalEarnings: 172000,
  fee: 500,
  emergencyFee: 350,
  isOnline: true,
  clinicCity: 'Mumbai',
  about: 'Specialist in aesthetic dermatology with 8 years of experience. Expert in skin rejuvenation, anti-ageing treatments and cosmetic dentistry partnerships.',
  photoURL: null,
};

// Mock Today's Appointments
export const TODAY_APPOINTMENTS = [
  {
    id: 'appt_001',
    patientName: 'Sharon Mathew',
    patientUid: 'pat_001',
    patientAge: 28,
    patientCity: 'Mumbai',
    treatmentName: 'RF Microneedling',
    slotTime: new Date(Date.now() + 25 * 60 * 1000),
    status: 'confirmed',
    callType: 'normal',
    channelName: 'aesthetiq_001_doc_001',
    urgentFlag: false,
    riskLevel: 'low',
    skinScore: 72,
    aesthetiqScore: 84,
    dentalScore: 91,
    hasScanFindings: true,
    scanType: 'skin',
    scanSummary: 'Moderate acne detected. Fitzpatrick IV. Chemical peel blocked.',
  },
  {
    id: 'appt_002',
    patientName: 'Rahul Sharma',
    patientUid: 'pat_002',
    patientAge: 34,
    patientCity: 'Pune',
    treatmentName: 'Botox Consultation',
    slotTime: new Date(Date.now() + 3 * 60 * 60 * 1000),
    status: 'confirmed',
    callType: 'normal',
    channelName: 'aesthetiq_002_doc_001',
    urgentFlag: false,
    riskLevel: 'moderate',
    aesthetiqScore: 68,
    skinScore: 81,
    hasScanFindings: true,
    scanType: 'facial',
    scanSummary: 'Soft jawline (138° gonial angle). Chin slightly recessed.',
  },
  {
    id: 'appt_003',
    patientName: 'Priya Nair',
    patientUid: 'pat_003',
    patientAge: 42,
    patientCity: 'Chennai',
    treatmentName: 'Teeth Whitening',
    slotTime: new Date(Date.now() + 5 * 60 * 60 * 1000),
    status: 'confirmed',
    callType: 'normal',
    channelName: 'aesthetiq_003_doc_001',
    urgentFlag: false,
    riskLevel: 'low',
    dentalScore: 65,
    hasScanFindings: true,
    scanType: 'dental',
    scanSummary: 'Mild calculus buildup. Shade A3. Good candidate for whitening.',
  },
];

// Mock Emergency Request
export const EMERGENCY_REQUEST = {
  requestId: 'em_001',
  patientName: 'Vikram Singh',
  patientUid: 'pat_004',
  issueType: 'tooth_pain',
  issueLabel: '🦷 Severe Dental Pain',
  severity: 'high',
  status: 'pending',
  createdAt: new Date(Date.now() - 4 * 60 * 1000),
  channelName: 'emergency_pat_004',
  fee: 350,
};

// Mock Patients List
export const PATIENTS = [
  {
    uid: 'pat_001',
    name: 'Sharon Mathew',
    age: 28,
    city: 'Mumbai',
    photoURL: null,
    aesthetiqScore: 84,
    skinScore: 72,
    dentalScore: 91,
    lastVisit: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    hasActivePlan: true,
    planName: 'RF Microneedling Programme',
    totalVisits: 4,
  },
  {
    uid: 'pat_002',
    name: 'Rahul Sharma',
    age: 34,
    city: 'Pune',
    photoURL: null,
    aesthetiqScore: 68,
    skinScore: 81,
    dentalScore: 78,
    lastVisit: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    hasActivePlan: false,
    totalVisits: 2,
  },
  {
    uid: 'pat_003',
    name: 'Priya Nair',
    age: 42,
    city: 'Chennai',
    photoURL: null,
    aesthetiqScore: 76,
    skinScore: 69,
    dentalScore: 65,
    lastVisit: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    hasActivePlan: true,
    planName: 'Dental Restoration Plan',
    totalVisits: 6,
  },
  {
    uid: 'pat_005',
    name: 'Ananya Desai',
    age: 25,
    city: 'Bangalore',
    photoURL: null,
    aesthetiqScore: 91,
    skinScore: 85,
    dentalScore: 88,
    lastVisit: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
    hasActivePlan: false,
    totalVisits: 1,
  },
  {
    uid: 'pat_006',
    name: 'Karthik Rajan',
    age: 38,
    city: 'Hyderabad',
    photoURL: null,
    aesthetiqScore: 62,
    skinScore: 58,
    dentalScore: 74,
    lastVisit: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    hasActivePlan: true,
    planName: 'Acne Treatment Programme',
    totalVisits: 8,
  },
];

// Mock Transactions
export const TRANSACTIONS = [
  {
    txId: 'tx_001',
    patientName: 'Sharon Mathew',
    treatmentName: 'RF Microneedling',
    amount: 1500,
    platformFee: 300,
    doctorEarning: 1200,
    status: 'pending',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    txId: 'tx_002',
    patientName: 'Rahul Sharma',
    treatmentName: 'Botox Consultation',
    amount: 500,
    platformFee: 100,
    doctorEarning: 400,
    status: 'pending',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    txId: 'tx_003',
    patientName: 'Priya Nair',
    treatmentName: 'Teeth Whitening',
    amount: 2000,
    platformFee: 400,
    doctorEarning: 1600,
    status: 'paid',
    paidAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
  },
  {
    txId: 'tx_004',
    patientName: 'Ananya Desai',
    treatmentName: 'Skin Analysis Consultation',
    amount: 500,
    platformFee: 100,
    doctorEarning: 400,
    status: 'paid',
    paidAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
  },
];

export const AVAILABLE_SLOTS = (() => {
  const slots = [];
  const times = [
    '09:00', '09:15', '09:30',
    '10:00', '10:15', '10:30',
    '11:00', '14:00', '14:30',
    '15:00', '15:30', '16:00',
  ];
  for (let d = 0; d < 14; d++) {
    const date = new Date();
    date.setDate(date.getDate() + d);
    const dateStr = date.toISOString().slice(0, 10);
    if (d === 3 || d === 7) continue;
    times.forEach(time => {
      slots.push({
        date: dateStr,
        time,
        status: Math.random() > 0.7 ? 'booked' : 'available',
        slotDuration: 15,
      });
    });
  }
  return slots;
})();

export const getAvatarGradient = (name: string) => {
  const colors = [
    ['from-[#7C3AED]', 'to-[#A855F7]'],
    ['from-[#0EA5E9]', 'to-[#38BDF8]'],
    ['from-[#EC4899]', 'to-[#F472B6]'],
    ['from-[#22C55E]', 'to-[#4ADE80]'],
    ['from-[#F59E0B]', 'to-[#FBBF24]'],
    ['from-[#EF4444]', 'to-[#F87171]'],
  ];
  const idx = name.charCodeAt(0) % colors.length;
  return colors[idx];
};

export const NOTIFICATIONS = [
  {
    id: 'notif_001',
    title: 'New Emergency Request',
    message: 'Vikram Singh has requested an emergency dental consultation.',
    time: '4 mins ago',
    type: 'emergency',
    isRead: false,
  },
  {
    id: 'notif_002',
    title: 'Appointment Confirmed',
    message: 'Rahul Sharma has confirmed the Botox consultation for 2:00 PM.',
    time: '1 hour ago',
    type: 'appointment',
    isRead: true,
  },
  {
    id: 'notif_003',
    title: 'Payment Received',
    message: '₹1,600 has been credited to your account for Priya Nair\'s treatment.',
    time: '3 hours ago',
    type: 'payment',
    isRead: true,
  },
  {
    id: 'notif_004',
    title: 'New Patient Review',
    message: 'Sharon Mathew left a 5-star review: "Excellent treatment and care!"',
    time: 'Yesterday',
    type: 'review',
    isRead: true,
  },
];
