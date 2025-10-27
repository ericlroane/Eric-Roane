// We are defining a serializable AppUser interface and no longer exporting the complex
// Firebase User object directly. This is the key fix for the "circular structure" error.
export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string;
  bio: string;
  createdAt: string; // Changed from Date to string for serialization safety
}

export interface Vehicle {
  id: string; // Firestore document ID
  ownerId: string;
  make: string;
  model: string;
  year: number;
  vin: string;
  price: number;
  status: 'Available' | 'Sold' | 'Pending';
  createdAt: string;
}

export interface Customer {
    id: string; // Firestore document ID
    ownerId: string;
    name: string;
    email: string;
    phone: string;
    status: 'New Lead' | 'Contacted' | 'Appointment Set' | 'Sold' | 'Lost';
    notes: string;
    createdAt: string;
}

export interface Sale {
  id: string; // Firestore document ID
  ownerId: string;
  vehicleId: string;
  customerId: string;
  salePrice: number;
  saleDate: string;
  notes?: string;
  createdAt: string;
  // Denormalized data for easier display
  vehicleInfo: {
    make: string;
    model: string;
    year: number;
  };
  customerInfo: {
    name: string;
  };
}


export interface SentimentAnalysis {
  overallSentiment: string;
  sentimentShifts: string[];
}

export interface KeywordTopics {
  topics: string[];
  competitorMentions: string[];
  financingQuestions: string[];
}

export interface PerformanceScorecard {
  talkToListenRatio: string;
  pace: string;
  fillerWords: number;
  appointmentAttempts: number;
  overallScore: number;
  feedback: string;
}

export interface DealRiskAlert {
  isAtRisk: boolean;
  reason: string;
  suggestion: string;
}

export interface AnalysisResult {
  sentimentAnalysis: SentimentAnalysis;
  keywordTopics: KeywordTopics;
  performanceScorecard: PerformanceScorecard;
  dealRiskAlert: DealRiskAlert;
}

export interface CallAnalysis {
  id: string; // Firestore document ID
  ownerId: string;
  callTitle: string;
  transcript: string;
  analysisResult: AnalysisResult;
  createdAt: string;
}
