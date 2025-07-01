import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, useParams } from 'react-router-dom';
import { PersonaSetup } from './components/PersonaSetup';
import { Dashboard } from './components/Dashboard';
import ConversationRoom from './components/ConversationRoom';
import { TavusPersona, Conversation } from './types';
import { tavusService } from './services/tavusService';
import { picaService } from './services/picaService';
import { dataExtractionService } from './services/dataExtractionService';
import { v4 as uuidv4 } from 'uuid';

function ZiggyHomePage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-yellow-100 to-blue-200 flex flex-col justify-between items-center text-center px-4 relative">
      <div className="w-full flex-1 flex flex-col justify-center items-center">
        <div className="max-w-2xl w-full">
          <div className="flex flex-col items-center mb-4 md:mb-6">
            <div className="relative flex flex-col items-center mb-4">
              <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-pink-500 via-yellow-400 to-blue-500 flex items-center justify-center shadow-2xl border-8 border-white mb-2">
                <span className="text-6xl font-extrabold text-white drop-shadow-lg">😂</span>
              </div>
              <div className="absolute bottom-0 right-0 w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-blue-200">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 32 32" className="w-8 h-8 text-blue-500">
                  <rect x="4" y="8" width="16" height="16" rx="4" fill="#3b82f6"/>
                  <rect x="4" y="8" width="16" height="16" rx="4" fill="#3b82f6"/>
                  <rect x="4" y="8" width="16" height="16" rx="4" fill="#3b82f6"/>
                  <path d="M20 14l6-4v12l-6-4v-4z" fill="#fbbf24"/>
                </svg>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-yellow-500 to-blue-600 mb-2 drop-shadow-lg">
              Meet Ziggy
            </h1>
            <h2 className="text-xl md:text-2xl font-bold text-blue-900 mb-1">
              Your AI Video Call Sidekick
            </h2>
            <p className="text-base md:text-lg text-blue-800 mb-2 font-medium">
              Talk face-to-face with Ziggy, an incredibly fun AI you can actually video call! Ask questions, share a laugh, or just chat—Ziggy responds in real time, just like a real person.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <span className="px-3 py-1 bg-white/50 rounded-full text-sm text-blue-800 font-medium border border-blue-200">
                "Give me a one minute piece on Ryan Breslow, the CEO of Bolt.new" 🎭
              </span>
              <span className="px-3 py-1 bg-white/50 rounded-full text-sm text-blue-800 font-medium border border-blue-200">
                "Tell me a funny story about technology" 😄
              </span>
            </div>
            <p className="text-sm text-blue-700 mb-2">
              Click below to start a live video conversation with your AI assistant. No downloads, no waiting—just instant, interactive fun!
            </p>
          </div>
        </div>
        {/* Video Call Experience Section */}
        <div className="w-full max-w-3xl mx-auto mb-4 md:mb-0">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6">
            {/* User Card */}
            <div className="flex flex-col items-center bg-white rounded-2xl shadow-lg p-4 md:p-6 w-full md:w-1/3 border border-blue-100">
              <div className="w-14 h-14 rounded-full bg-blue-200 flex items-center justify-center mb-2">
                <span className="text-2xl">🧑‍💻</span>
              </div>
              <div className="font-bold text-blue-900 mb-1">You</div>
              <div className="text-blue-600 text-xs md:text-sm">Ask anything, share a story, or just say hi!</div>
            </div>
            {/* Chat Bubble */}
            <div className="hidden md:flex flex-col items-center">
              <div className="bg-gradient-to-r from-pink-200 via-yellow-100 to-blue-200 rounded-full px-4 py-2 md:px-6 md:py-3 shadow text-blue-900 font-semibold text-base md:text-lg border border-blue-100">
                <span>💬 Real-time Video Chat</span>
              </div>
            </div>
            {/* Ziggy Card */}
            <div className="flex flex-col items-center bg-white rounded-2xl shadow-lg p-4 md:p-6 w-full md:w-1/3 border border-pink-100">
              <div className="w-14 h-14 rounded-full bg-pink-200 flex items-center justify-center mb-2 relative">
                <span className="text-2xl">😂</span>
                <span className="absolute bottom-0 right-0 w-5 h-5 bg-white rounded-full flex items-center justify-center border-2 border-pink-200">
                  <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' className='w-3 h-3 text-pink-500'><rect x='3' y='6' width='12' height='12' rx='3' fill='#ec4899'/><path d='M15 10l5-3.5v10L15 13v-3z' fill='#fde68a'/></svg>
                </span>
              </div>
              <div className="font-bold text-pink-900 mb-1">Ziggy</div>
              <div className="text-pink-600 text-xs md:text-sm">Your AI video call sidekick—funny, smart, and always ready to chat!</div>
            </div>
          </div>
          {/* Mobile chat bubble */}
          <div className="flex md:hidden justify-center mt-2">
            <div className="bg-gradient-to-r from-pink-200 via-yellow-100 to-blue-200 rounded-full px-4 py-2 shadow text-blue-900 font-semibold text-sm border border-blue-100">
              <span>💬 Real-time Video Chat</span>
            </div>
          </div>
        </div>
      </div>
      {/* Start Button always at the bottom of the fold */}
      <div className="w-full px-0 md:px-0 mb-2 md:mb-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="w-full py-4 px-8 rounded-xl bg-gradient-to-r from-pink-500 via-yellow-400 to-blue-500 text-white text-2xl font-bold shadow-lg hover:scale-105 transition-transform duration-200 animate-wiggle pointer-events-auto"
        >
          Start Laughing with Ziggy
        </button>
      </div>
      {/* Bolt.new badge bottom right */}
      <a
        href="https://bolt.new/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Built with Bolt.new"
        className="fixed bottom-4 right-4 z-50"
        style={{ width: '56px', height: '56px' }}
      >
        <img
          src="https://raw.githubusercontent.com/kickiniteasy/bolt-hackathon-badge/main/src/public/bolt-badge/black_circle_360x360/black_circle_360x360.svg"
          alt="Built with Bolt.new"
          style={{ width: '100%', height: '100%' }}
        />
      </a>
      <style>{`
        @keyframes wiggle {
          0%, 100% { transform: rotate(-2deg); }
          50% { transform: rotate(2deg); }
        }
        .animate-wiggle { animation: wiggle 1.2s infinite; }
        @media (max-width: 767px) {
          .bolt-badge { width: 40px !important; height: 40px !important; }
        }
      `}</style>
    </div>
  );
}

function DashboardAutoStart() {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const hasStartedRef = React.useRef(false);

  React.useEffect(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;
    async function startConversation() {
      setLoading(true);
      setError(null);

      // Check environment variables (but do not expose them)
      const apiKey = import.meta.env.VITE_TAVUS_API_KEY;
      const replicaId = import.meta.env.VITE_TAVUS_REPLICA_ID;
      const personaId = import.meta.env.VITE_TAVUS_PERSONA_ID;

      if (!apiKey || !replicaId || !personaId) {
        setError('Missing required configuration. Please contact support.');
        setLoading(false);
        return;
      }

      try {
        const requestBody = {
          replica_id: replicaId,
          persona_id: personaId,
        };

        const response = await fetch('https://tavusapi.com/v2/conversations', {
          method: 'POST',
          headers: {
            'x-api-key': apiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
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
          setError('Failed to start Ziggy conversation. Please try again later.');
          setLoading(false);
        }
      } catch (e) {
        setError('Network error. Please try again.');
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
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
            <div className="text-red-600 font-bold mb-2">{error}</div>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
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

  const handleStartConversation = () => {
    window.location.href = '/dashboard';
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