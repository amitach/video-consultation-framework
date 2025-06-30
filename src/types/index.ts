// Core Types for Healthcare Video Assistant

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  medicalRecordNumber?: string;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
}

export interface MedicalHistory {
  patientId: string;
  conditions: string[];
  medications: Medication[];
  allergies: string[];
  surgeries: Surgery[];
  familyHistory: string[];
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  prescribedDate: string;
  prescribingPhysician: string;
}

export interface Surgery {
  procedure: string;
  date: string;
  hospital: string;
  surgeon: string;
  complications?: string;
}

export interface Conversation {
  id: string;
  patientId: string;
  personaId: string;
  startTime: string;
  endTime?: string;
  status: 'active' | 'completed' | 'interrupted';
  transcript: ConversationMessage[];
  extractedData: ExtractedData;
  integrationStatus: IntegrationStatus;
}

export interface ConversationMessage {
  id: string;
  timestamp: string;
  speaker: 'patient' | 'persona';
  content: string;
  type: 'text' | 'video' | 'audio';
  metadata?: Record<string, any>;
}

export interface ExtractedData {
  patientInfo: Partial<Patient>;
  medicalHistory: Partial<MedicalHistory>;
  appointmentPreferences: AppointmentPreferences;
  symptoms: SymptomAssessment;
  consent: ConsentStatus;
}

export interface AppointmentPreferences {
  preferredDate?: string;
  preferredTime?: string;
  appointmentType: 'consultation' | 'follow-up' | 'emergency' | 'routine';
  department?: string;
  physician?: string;
  notes?: string;
}

export interface SymptomAssessment {
  primarySymptoms: string[];
  duration: string;
  severity: 1 | 2 | 3 | 4 | 5;
  triggers?: string[];
  relievingFactors?: string[];
  associatedSymptoms?: string[];
}

export interface ConsentStatus {
  hipaaConsent: boolean;
  treatmentConsent: boolean;
  dataProcessingConsent: boolean;
  communicationConsent: boolean;
  consentTimestamp?: string;
}

export interface IntegrationStatus {
  ehrIntegration: 'pending' | 'success' | 'failed';
  crmIntegration: 'pending' | 'success' | 'failed';
  insuranceVerification: 'pending' | 'success' | 'failed';
  appointmentScheduling: 'pending' | 'success' | 'failed';
  lastSyncTimestamp?: string;
  errors?: string[];
}

// Tavus Integration Types
export interface TavusPersona {
  id: string;
  name: string;
  description: string;
  replicaId: string;
  conversationConfig: ConversationConfig;
  status: 'active' | 'inactive' | 'training';
}

export interface ConversationConfig {
  maxDuration: number;
  language: string;
  voice: string;
  personality: PersonalityTraits;
  medicalSpecialty?: string;
  conversationFlow: ConversationFlow[];
}

export interface PersonalityTraits {
  empathy: number;
  professionalism: number;
  patience: number;
  clarity: number;
  warmth: number;
}

export interface ConversationFlow {
  id: string;
  stage: string;
  prompts: string[];
  expectedResponses: string[];
  nextStages: string[];
  dataExtractionRules: DataExtractionRule[];
}

export interface DataExtractionRule {
  field: string;
  pattern: string;
  validation: string;
  required: boolean;
}

// Pica Integration Types
export interface PicaConnection {
  id: string;
  platform: string;
  status: 'connected' | 'disconnected' | 'error';
  credentials: Record<string, string>;
  lastSync: string;
}

export interface PicaAction {
  id: string;
  platform: string;
  action: string;
  parameters: Record<string, any>;
  status: 'pending' | 'executing' | 'completed' | 'failed';
  result?: any;
  error?: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface ConversationSession {
  sessionId: string;
  patientId: string;
  personaId: string;
  status: 'initializing' | 'active' | 'paused' | 'completed';
  videoUrl?: string;
  chatEnabled: boolean;
  startTime: string;
  metadata: Record<string, any>;
}