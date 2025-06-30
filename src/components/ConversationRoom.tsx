import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tavusService } from '../services/tavusService';

interface ConversationRoomProps {
  conversationUrl: string;
}

declare global {
  interface Window {
    Daily?: any;
  }
}

const DAILY_SCRIPT_ID = 'daily-js-embed-script';

function extractConversationId(url: string): string | null {
  // Tavus conversation_url is like https://tavus.daily.co/c13ca81cd950f4b6
  // The last path segment is the conversation ID
  try {
    const parts = url.split('/');
    return parts[parts.length - 1] || null;
  } catch {
    return null;
  }
}

const ConversationRoom: React.FC<ConversationRoomProps> = ({ conversationUrl }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const callFrameRef = useRef<any>(null);
  const navigate = useNavigate();
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [debugMsg, setDebugMsg] = useState('');
  const [ending, setEnding] = useState(false);
  const conversationId = extractConversationId(conversationUrl);

  // End conversation helper
  const endConversation = async () => {
    if (!conversationId) {
      setDebugMsg('No conversation ID found.');
      setEnding(true);
      setTimeout(() => {
        setEnding(false);
        window.location.reload();
      }, 2000);
      return;
    }
    setEnding(true);
    setDebugMsg('Ending conversation...');
    try {
      await tavusService.endConversation(conversationId);
      setDebugMsg('Conversation ended successfully!');
      setTimeout(() => {
        setEnding(false);
        window.location.reload();
      }, 2000);
    } catch (err) {
      setDebugMsg('Failed to end conversation.');
      setTimeout(() => {
        setEnding(false);
        window.location.reload();
      }, 2000);
    }
  };

  useEffect(() => {
    setDebugMsg('Mounting ConversationRoom...');
    // Remove any existing script
    const existingScript = document.getElementById(DAILY_SCRIPT_ID);
    if (existingScript) {
      existingScript.remove();
      setDebugMsg('Removed existing Daily script.');
    }

    // Only add the script if not already present
    const script = document.createElement('script');
    script.id = DAILY_SCRIPT_ID;
    script.src = 'https://unpkg.com/@daily-co/daily-js';
    script.async = true;
    script.onload = () => {
      setDebugMsg('Daily JS script loaded.');
      if (window.Daily && containerRef.current && !callFrameRef.current) {
        setDebugMsg('Creating Daily call frame...');
        callFrameRef.current = window.Daily.createFrame(containerRef.current, {
          showLeaveButton: true,
          iframeStyle: {
            borderRadius: 0,
            boxShadow: 'none',
            width: '100vw',
            height: '100vh',
            minWidth: '100vw',
            minHeight: '100vh',
            maxWidth: '100vw',
            maxHeight: '100vh',
            border: 'none',
          },
        });
        callFrameRef.current.join({ url: conversationUrl });
        callFrameRef.current.on('loaded', () => {
          setIframeLoaded(true);
          setDebugMsg('Daily call frame loaded.');
        });
        callFrameRef.current.on('error', (e: any) => {
          setDebugMsg('Daily call frame error: ' + JSON.stringify(e));
        });
        callFrameRef.current.on('left-meeting', () => {
          endConversation();
        });
      } else {
        setDebugMsg('Daily or containerRef not ready.');
      }
    };
    script.onerror = () => {
      setDebugMsg('Failed to load Daily JS script.');
    };
    document.body.appendChild(script);

    return () => {
      if (callFrameRef.current) {
        callFrameRef.current.destroy();
        callFrameRef.current = null;
      }
      const cleanupScript = document.getElementById(DAILY_SCRIPT_ID);
      if (cleanupScript) {
        cleanupScript.remove();
      }
    };
    // eslint-disable-next-line
  }, [conversationUrl]);

  return (
    <div className="fixed inset-0 w-screen h-screen bg-gradient-to-br from-pink-200 via-yellow-100 to-blue-200 flex flex-col items-center justify-center z-50">
      <div
        ref={containerRef}
        style={{ width: '100vw', height: '100vh', minWidth: '100vw', minHeight: '100vh', maxWidth: '100vw', maxHeight: '100vh', borderRadius: 0, boxShadow: 'none', border: 'none', overflow: 'hidden' }}
        className="flex items-center justify-center"
      />
      {/* End Call Button */}
      <button
        onClick={endConversation}
        disabled={ending}
        className="absolute top-6 right-6 z-50 px-6 py-3 bg-red-600 text-white rounded-lg font-bold shadow-lg hover:bg-red-700 transition-colors text-lg"
        style={{ opacity: ending ? 0.6 : 1, pointerEvents: ending ? 'none' : 'auto' }}
      >
        {ending ? (debugMsg === 'Ending conversation...' ? 'Ending...' : debugMsg) : 'End Call'}
      </button>
      {/* Debug info and fallback */}
      {!iframeLoaded && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white bg-opacity-80 rounded-lg px-6 py-3 shadow-lg z-50">
          <div className="text-red-600 font-bold mb-2">Video call not loaded yet.</div>
          <div className="text-xs text-gray-700 mb-2">{debugMsg}</div>
          <a
            href={conversationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600 transition-colors"
          >
            Open in New Tab (Debug)
          </a>
        </div>
      )}
      <style>{`
        @keyframes wiggle {
          0%, 100% { transform: rotate(-2deg); }
          50% { transform: rotate(2deg); }
        }
        .animate-wiggle { animation: wiggle 1.2s infinite; }
        @media (max-width: 767px) {
          .md\\:flex { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default ConversationRoom; 