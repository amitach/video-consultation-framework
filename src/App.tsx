import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, useParams } from 'react-router-dom';
import { PersonaSetup } from './components/PersonaSetup';
import { Dashboard } from './components/Dashboard';
import ConversationRoom from './components/ConversationRoom';
import { TavusPersona, Conversation, ConversationSession, ExtractedData } from './types';
import { tavusService } from './services/tavusService';
import { picaService } from './services/picaService';
import { dataExtractionService } from './services/dataExtractionService';
import { v4 as uuidv4 } from 'uuid';

function HomePage() {
  const [persona, setPersona] = useState<TavusPersona | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [showDashboard, setShowDashboard] = useState(false);

  useEffect(() => {
    const savedPersona = localStorage.getItem('healthcare-persona');
    const savedConversations = localStorage.getItem('healthcare-conversations');
    if (savedPersona) {
      setPersona(JSON.parse(savedPersona));
      setShowDashboard(true);
    }
    if (savedConversations) {
      setConversations(JSON.parse(savedConversations));
    }
  }, []);

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
    setShowDashboard(true);
  };

  const handleStartConversation = async () => {
    if (!persona) return;
    try {
      // Create a new conversation session (real Tavus API call here)
      const patientId = `patient-${Date.now()}`;
      const session = await tavusService.mockConversationSession(persona.id, patientId);
      // In real use, get the conversationUrl from Tavus API
      if (session && session.videoUrl) {
        window.location.href = `/conversation/${encodeURIComponent(session.videoUrl)}`;
      } else {
        alert('Failed to get conversation URL.');
      }
    } catch (error) {
      console.error('Failed to start conversation:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-healthcare-50 to-primary-50">
      <div className="container mx-auto px-4 py-8">
        {showDashboard && persona ? (
          <Dashboard
            persona={persona}
            conversations={conversations}
            onStartConversation={handleStartConversation}
          />
        ) : (
          <PersonaSetup onPersonaCreated={handlePersonaCreated} />
        )}
      </div>
    </div>
  );
}

function ConversationPage() {
  const params = useParams();
  const conversationUrl = params.conversationUrl;
  if (!conversationUrl) return <div>Invalid conversation URL</div>;
  return <ConversationRoom conversationUrl={decodeURIComponent(conversationUrl)} />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/conversation/:conversationUrl" element={<ConversationPage />} />
    </Routes>
  );
}