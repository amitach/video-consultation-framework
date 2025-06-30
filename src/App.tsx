import React, { useState, useEffect } from 'react';
import { PersonaSetup } from './components/PersonaSetup';
import { Dashboard } from './components/Dashboard';
import { VideoInterface } from './components/VideoInterface';
import { TavusPersona, Conversation, ConversationSession, ExtractedData } from './types';
import { tavusService } from './services/tavusService';
import { picaService } from './services/picaService';
import { dataExtractionService } from './services/dataExtractionService';
import { v4 as uuidv4 } from 'uuid';

type AppState = 'setup' | 'dashboard' | 'conversation';

function App() {
  const [appState, setAppState] = useState<AppState>('setup');
  const [persona, setPersona] = useState<TavusPersona | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentSession, setCurrentSession] = useState<ConversationSession | null>(null);

  // Load existing persona from localStorage on mount
  useEffect(() => {
    const savedPersona = localStorage.getItem('healthcare-persona');
    const savedConversations = localStorage.getItem('healthcare-conversations');
    
    if (savedPersona) {
      setPersona(JSON.parse(savedPersona));
      setAppState('dashboard');
    }
    
    if (savedConversations) {
      setConversations(JSON.parse(savedConversations));
    }
  }, []);

  // Save data to localStorage when it changes
  useEffect(() => {
    if (persona) {
      localStorage.setItem('healthcare-persona', JSON.stringify(persona));
    }
  }, [persona]);

  useEffect(() => {
    localStorage.setItem('healthcare-conversations', JSON.stringify(conversations));
  }, [conversations]);

  const handlePersonaCreated = (newPersona: TavusPersona) => {
    setPersona(newPersona);
    setAppState('dashboard');
  };

  const handleStartConversation = async () => {
    if (!persona) return;

    try {
      // Create a new conversation session
      const patientId = `patient-${Date.now()}`;
      
      // In development, use mock session
      const session = await tavusService.mockConversationSession(persona.id, patientId);
      
      setCurrentSession(session);
      setAppState('conversation');

      // Initialize conversation record
      const newConversation: Conversation = {
        id: uuidv4(),
        patientId,
        personaId: persona.id,
        startTime: new Date().toISOString(),
        status: 'active',
        transcript: [],
        extractedData: {
          patientInfo: {},
          medicalHistory: {
            patientId,
            conditions: [],
            medications: [],
            allergies: [],
            surgeries: [],
            familyHistory: [],
          },
          appointmentPreferences: {
            appointmentType: 'consultation',
          },
          symptoms: {
            primarySymptoms: [],
            duration: '',
            severity: 1,
          },
          consent: {
            hipaaConsent: false,
            treatmentConsent: false,
            dataProcessingConsent: false,
            communicationConsent: false,
          },
        },
        integrationStatus: {
          ehrIntegration: 'pending',
          crmIntegration: 'pending',
          insuranceVerification: 'pending',
          appointmentScheduling: 'pending',
        },
      };

      setConversations(prev => [newConversation, ...prev]);
    } catch (error) {
      console.error('Failed to start conversation:', error);
    }
  };

  const handleEndCall = async () => {
    if (!currentSession) return;

    try {
      // Find the current conversation
      const conversationIndex = conversations.findIndex(
        c => c.patientId === currentSession.patientId && c.status === 'active'
      );

      if (conversationIndex !== -1) {
        const updatedConversations = [...conversations];
        const conversation = updatedConversations[conversationIndex];
        
        // Update conversation status
        conversation.status = 'completed';
        conversation.endTime = new Date().toISOString();

        // Simulate data integration
        setTimeout(async () => {
          try {
            // Mock EHR integration
            const ehrResult = await picaService.mockEHRSync(conversation.extractedData);
            if (ehrResult.success) {
              conversation.integrationStatus.ehrIntegration = 'success';
            }

            // Mock CRM integration
            const crmResult = await picaService.mockCRMSync(conversation.extractedData);
            if (crmResult.success) {
              conversation.integrationStatus.crmIntegration = 'success';
            }

            conversation.integrationStatus.lastSyncTimestamp = new Date().toISOString();
            setConversations([...updatedConversations]);
          } catch (error) {
            console.error('Integration failed:', error);
            conversation.integrationStatus.ehrIntegration = 'failed';
            conversation.integrationStatus.crmIntegration = 'failed';
            setConversations([...updatedConversations]);
          }
        }, 2000);

        setConversations(updatedConversations);
      }

      // End Tavus session
      await tavusService.endConversation(currentSession.sessionId);
      
      setCurrentSession(null);
      setAppState('dashboard');
    } catch (error) {
      console.error('Failed to end conversation:', error);
    }
  };

  const handleMessageSent = (message: string) => {
    if (!currentSession) return;

    // Find current conversation and add message
    const conversationIndex = conversations.findIndex(
      c => c.patientId === currentSession.patientId && c.status === 'active'
    );

    if (conversationIndex !== -1) {
      const updatedConversations = [...conversations];
      const conversation = updatedConversations[conversationIndex];
      
      // Add patient message
      const patientMessage = {
        id: uuidv4(),
        timestamp: new Date().toISOString(),
        speaker: 'patient' as const,
        content: message,
        type: 'text' as const,
      };

      conversation.transcript.push(patientMessage);

      // Extract data from the message
      conversation.extractedData = dataExtractionService.extractFromMessage(
        patientMessage,
        conversation.extractedData
      );

      setConversations(updatedConversations);

      // Simulate persona response (in real implementation, this would come from Tavus)
      setTimeout(() => {
        const personaResponse = {
          id: uuidv4(),
          timestamp: new Date().toISOString(),
          speaker: 'persona' as const,
          content: generatePersonaResponse(message, conversation.extractedData),
          type: 'text' as const,
        };

        conversation.transcript.push(personaResponse);
        setConversations([...updatedConversations]);
      }, 1000);
    }
  };

  const generatePersonaResponse = (patientMessage: string, extractedData: ExtractedData): string => {
    // Simple response generation based on context
    const lowerMessage = patientMessage.toLowerCase();
    
    if (lowerMessage.includes('pain') || lowerMessage.includes('hurt')) {
      return "I understand you're experiencing pain. Can you help me understand the severity on a scale of 1 to 10, and how long you've been feeling this way?";
    }
    
    if (lowerMessage.includes('medication') || lowerMessage.includes('taking')) {
      return "Thank you for sharing that information about your medications. Are there any allergies to medications that I should be aware of?";
    }
    
    if (lowerMessage.includes('insurance')) {
      return "I've noted your insurance information. We'll verify your coverage and benefits before your appointment. Is there anything specific about your coverage you'd like me to check?";
    }
    
    if (!extractedData.patientInfo.firstName) {
      return "Thank you for that information. To get started, could you please tell me your full name?";
    }
    
    return "Thank you for sharing that with me. This information will be very helpful for your healthcare team. Is there anything else you'd like to add about your current health concerns?";
  };

  const renderCurrentView = () => {
    switch (appState) {
      case 'setup':
        return <PersonaSetup onPersonaCreated={handlePersonaCreated} />;
      
      case 'dashboard':
        return persona ? (
          <Dashboard
            persona={persona}
            conversations={conversations}
            onStartConversation={handleStartConversation}
          />
        ) : null;
      
      case 'conversation':
        return currentSession ? (
          <VideoInterface
            session={currentSession}
            onEndCall={handleEndCall}
            onMessageSent={handleMessageSent}
          />
        ) : null;
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-healthcare-50 to-primary-50">
      {appState === 'conversation' ? (
        <div className="h-screen">
          {renderCurrentView()}
        </div>
      ) : (
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          {appState === 'dashboard' && (
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-healthcare-800">
                    Healthcare Video Assistant
                  </h1>
                  <p className="text-healthcare-600 mt-1">
                    AI-powered patient consultation and data integration platform
                  </p>
                </div>
                <button
                  onClick={() => {
                    setPersona(null);
                    setAppState('setup');
                    localStorage.removeItem('healthcare-persona');
                  }}
                  className="text-healthcare-600 hover:text-healthcare-800 text-sm"
                >
                  Create New Persona
                </button>
              </div>
            </div>
          )}
          
          {renderCurrentView()}
        </div>
      )}
    </div>
  );
}

export default App;