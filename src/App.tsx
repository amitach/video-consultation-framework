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

function ZiggyHomePage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-yellow-100 to-blue-200 flex flex-col items-center justify-center text-center px-4">
      <div className="max-w-2xl w-full">
        <div className="flex flex-col items-center mb-8">
          <div className="animate-bounce w-32 h-32 rounded-full bg-gradient-to-tr from-pink-500 via-yellow-400 to-blue-500 flex items-center justify-center shadow-2xl mb-6 border-8 border-white">
            <span className="text-6xl font-extrabold text-white drop-shadow-lg">😂</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-yellow-500 to-blue-600 mb-4 drop-shadow-lg">
            Meet Ziggy
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-2">Your AI Comedy Sidekick</h2>
          <p className="text-lg md:text-xl text-blue-800 mb-6 font-medium">
            Ready to turn your day around? Ziggy is the world's first AI assistant who's always in the mood for a laugh, a joke, or a little bit of mischief. Need a pick-me-up, a witty comeback, or just want to chat with the funniest bot in town? Ziggy's got you covered!
          </p>
        </div>
        <button
          onClick={() => navigate('/dashboard')}
          className="w-full py-4 px-8 rounded-xl bg-gradient-to-r from-pink-500 via-yellow-400 to-blue-500 text-white text-2xl font-bold shadow-lg hover:scale-105 transition-transform duration-200 animate-wiggle"
        >
          Start Laughing with Ziggy
        </button>
        <div className="mt-10 text-blue-700 text-sm opacity-80">
          <span className="font-semibold">Ziggy</span> is powered by cutting-edge AI and a questionable sense of humor. Proceed at your own risk! 😂
        </div>
      </div>
      <style>{`
        @keyframes wiggle {
          0%, 100% { transform: rotate(-2deg); }
          50% { transform: rotate(2deg); }
        }
        .animate-wiggle { animation: wiggle 1.2s infinite; }
      `}</style>
    </div>
  );
}

function DashboardAutoStart() {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function startConversation() {
      setLoading(true);
      setError(null);
      try {
        // Call Tavus API to create a Ziggy conversation
        const response = await fetch('https://tavusapi.com/v2/conversations', {
          method: 'POST',
          headers: {
            'x-api-key': import.meta.env.VITE_TAVUS_API_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            replica_id: import.meta.env.VITE_TAVUS_REPLICA_ID,
            persona_id: import.meta.env.VITE_TAVUS_PERSONA_ID,
          }),
        });
        const data = await response.json();
        if (data.conversation_url) {
          setTimeout(() => {
            navigate(`/conversation/${encodeURIComponent(data.conversation_url)}`);
          }, 1200);
        } else if (data.message && data.message.includes('maximum concurrent conversations')) {
          setError('You have reached the maximum number of active video calls. Please end an existing call before starting a new one.');
          setLoading(false);
        } else {
          setError('Failed to start Ziggy conversation.');
          setLoading(false);
        }
      } catch (e) {
        setError('Ziggy tripped over a banana peel! Try again.');
        setLoading(false);
      }
    }
    startConversation();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-200 via-yellow-100 to-blue-200 text-center">
      <div className="max-w-lg w-full">
        <div className="flex flex-col items-center mb-8">
          <span className="ziggy-emoji">😂</span>
          <h2 className="text-3xl md:text-4xl font-extrabold ziggy-gradient mb-2">Launching Ziggy...</h2>
          <p className="text-lg text-blue-800 font-medium mb-4">Warming up the punchlines and prepping the virtual stage!</p>
        </div>
        {loading && (
          <div className="w-full flex justify-center">
            <svg className="animate-spin h-12 w-12 text-pink-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
          </div>
        )}
        {error && <div className="text-red-600 font-bold mt-4">{error}</div>}
      </div>
    </div>
  );
}

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
      <Route path="/" element={<ZiggyHomePage />} />
      <Route path="/dashboard" element={<DashboardAutoStart />} />
      <Route path="/conversation/:conversationUrl" element={<ConversationPage />} />
    </Routes>
  );
}