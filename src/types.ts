export type SupportedLanguage = 'en' | 'kn' | 'te' | 'ta' | 'ml' | 'hi';

export interface WorkLog {
  id: string;
  phone_number: string;
  latitude: number | null;
  longitude: number | null;
  message_type: 'location' | 'text';
  raw_message: string;
  estimated_wage: number;
  created_at: string;
  worker_name?: string;
  location_name?: string;
  status: 'verified' | 'pending' | 'disputed';
  verification_token: string;
}

export interface WorkerSummary {
  phoneNumber: string;
  totalDays: number;
  totalEarnings: number;
  lastActive: string;
  locations: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  isLocationPin?: boolean;
  latitude?: number;
  longitude?: number;
  locationName?: string;
}
