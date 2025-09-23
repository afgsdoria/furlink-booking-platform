// User types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  mobileNumber: string;
  role: 'pet_owner' | 'service_provider' | 'admin';
  createdAt: string;
  updatedAt: string;
}

// Auth types
export interface SignUpData {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  mobileNumber: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

export interface LoginData {
  email: string;
  password: string;
}

// Business types
export interface BusinessRegistration {
  businessName: string;
  description: string;
  address: string;
  googleMapsLink: string;
  facilityImages: File[];
  qrCode: File;
  permits: File[];
  waiver: File;
  staff: StaffMember[];
  pricing: PricingPackage[];
  operatingHours: OperatingHours;
  acceptTerms: boolean;
}

export interface StaffMember {
  fullName: string;
  yearsOfExperience: number;
  skills: string[];
}

export interface PricingPackage {
  name: string;
  description: string;
  basePrice: number;
  addOns: AddOn[];
  extraCharges: ExtraCharge[];
}

export interface AddOn {
  name: string;
  price: number;
  description: string;
}

export interface ExtraCharge {
  name: string;
  price: number;
  description: string;
}

export interface OperatingHours {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

export interface DaySchedule {
  isOpen: boolean;
  openTime: string;
  closeTime: string;
}

// Booking types
export interface Booking {
  id: string;
  petOwnerId: string;
  serviceProviderId: string;
  petInfo: PetInfo;
  serviceType: string;
  paymentMethod: string;
  specialInstructions?: string;
  addOns: string[];
  extraCharges: string[];
  totalAmount: number;
  status: 'pending' | 'approved' | 'declined' | 'completed' | 'cancelled';
  scheduledDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface PetInfo {
  name: string;
  size: 'small' | 'medium' | 'large';
  weight: number;
  dateOfBirth: string;
  breed: string;
  behavior: string;
  vaccineBooklet: File;
  medications?: string;
  allergies?: string;
  notes?: string;
  emergencyConsent: boolean;
}

// Feedback types
export interface Feedback {
  id: string;
  bookingId: string;
  petOwnerId: string;
  serviceProviderId: string;
  petCare: number;
  serviceQuality: number;
  cleanliness: number;
  punctuality: number;
  valueForMoney: number;
  comments: string;
  createdAt: string;
}