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
  const [showFallback, setShowFallback] = useState(false);
  const conversationId = extractConversationId(conversationUrl);

  // End call handler
  const handleEndCall = () => {
    if (callFrameRef.current) {
      callFrameRef.current.leave();
      setEnding(true);
      setDebugMsg('Leaving meeting...');
    }
  };

  useEffect(() => {
    setDebugMsg('Initializing Ziggy conversation...');
    
    // Check if we're in development mode
    const isDevelopment = window.location.hostname === 'localhost' || 
                         window.location.hostname === '127.0.0.1' ||
                         window.location.hostname.includes('stackblitz') ||
                         window.location.hostname.includes('bolt.new');

    if (isDevelopment) {
      setDebugMsg('Development mode detected - CORS restrictions may apply');
      // Show fallback after a short delay to allow for potential success
      setTimeout(() => {
        if (!iframeLoaded) {
          setShowFallback(true);
          setDebugMsg('CORS restriction detected - using fallback mode');
        }
      }, 3000);
    }

    // Remove any existing script
    const existingScript = document.getElementById(DAILY_SCRIPT_ID);
    if (existingScript) {
      existingScript.remove();
      setDebugMsg('Removed existing Daily script.');
    }

    // Load Daily.co script
    const script = document.createElement('script');
    script.id = DAILY_SCRIPT_ID;
    script.src = 'https://unpkg.com/@daily-co/daily-js';
    script.async = true;
    
    script.onload = () => {
      setDebugMsg('Daily JS script loaded successfully.');
      
      if (window.Daily && containerRef.current && !callFrameRef.current) {
        setDebugMsg('Creating Daily call frame...');
        
        try {
          callFrameRef.current = window.Daily.createFrame(containerRef.current, {
            showLeaveButton: true,
            iframeStyle: {
              borderRadius: 0,
              boxShadow: 'none',
              width: '100%',
              height: '100%',
              border: 'none',
            },
            // Add CORS-friendly options
            url: conversationUrl,
            theme: {
              accent: '#ec4899',
              accentText: '#ffffff',
              background: '#f8fafc',
              backgroundAccent: '#e2e8f0',
              baseText: '#1f2937',
              border: '#d1d5db',
              mainAreaBg: '#ffffff',
              mainAreaBgAccent: '#f3f4f6',
              mainAreaText: '#374151',
              supportiveText: '#6b7280'
            }
          });

          // Set up event listeners
          callFrameRef.current.on('loaded', () => {
            setIframeLoaded(true);
            setShowFallback(false);
            setDebugMsg('Ziggy is ready to chat!');
          });

          callFrameRef.current.on('error', (e: any) => {
            console.error('Daily call frame error:', e);
            setDebugMsg(`Connection error: ${e.errorMsg || 'Unknown error'}`);
            setShowFallback(true);
          });

          callFrameRef.current.on('left-meeting', () => {
            setDebugMsg('Left the conversation');
            navigate('/');
          });

          // Join the conversation
          callFrameRef.current.join({ url: conversationUrl })
            .then(() => {
              setDebugMsg('Successfully joined conversation');
            })
            .catch((error: any) => {
              console.error('Failed to join conversation:', error);
              setDebugMsg(`Failed to join: ${error.message || 'Unknown error'}`);
              setShowFallback(true);
            });

        } catch (error) {
          console.error('Error creating Daily frame:', error);
          setDebugMsg('Failed to create video interface');
          setShowFallback(true);
        }
      } else {
        setDebugMsg('Daily or container not ready.');
        setShowFallback(true);
      }
    };

    script.onerror = () => {
      setDebugMsg('Failed to load Daily JS script.');
      setShowFallback(true);
    };

    document.body.appendChild(script);

    return () => {
      if (callFrameRef.current) {
        try {
          callFrameRef.current.destroy();
        } catch (e) {
          console.warn('Error destroying call frame:', e);
        }
        callFrameRef.current = null;
      }
      const cleanupScript = document.getElementById(DAILY_SCRIPT_ID);
      if (cleanupScript) {
        cleanupScript.remove();
      }
    };
  }, [conversationUrl, navigate]);

  // Fallback UI for CORS issues
  if (showFallback) {
    return (
      <div className="fixed inset-0 w-screen h-screen bg-gradient-to-br from-pink-200 via-yellow-100 to-blue-200 flex flex-col items-center justify-center z-50">
        <div className="max-w-2xl w-full mx-auto p-8 bg-white rounded-xl shadow-2xl text-center">
          <div className="mb-6">
            <span className="text-6xl mb-4 block">😅</span>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Oops! CORS Got in the Way</h2>
            <p className="text-lg text-gray-600 mb-6">
              Ziggy is ready to chat, but your browser is being a bit overprotective. 
              This happens in development mode due to security restrictions.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h3 className="font-bold text-blue-800 mb-3">🚀 Quick Solutions:</h3>
            <div className="space-y-3 text-left">
              <div className="flex items-start space-x-3">
                <span className="text-blue-600 font-bold">1.</span>
                <div>
                  <p className="font-medium text-blue-800">Open in New Tab (Recommended)</p>
                  <p className="text-sm text-blue-600">Click the button below to chat with Ziggy directly</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <span className="text-blue-600 font-bold">2.</span>
                <div>
                  <p className="font-medium text-blue-800">Deploy to Production</p>
                  <p className="text-sm text-blue-600">CORS restrictions don't apply to deployed apps</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <a
              href={conversationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-gradient-to-r from-pink-500 via-yellow-400 to-blue-500 text-white px-8 py-4 rounded-xl font-bold text-xl hover:scale-105 transition-transform duration-200 shadow-lg"
            >
              🎭 Chat with Ziggy in New Tab
            </a>
            
            <button
              onClick={() => navigate('/')}
              className="w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              ← Back to Home
            </button>
          </div>

          <div className="mt-6 text-sm text-gray-500">
            <p><strong>Debug Info:</strong> {debugMsg}</p>
            <p className="mt-1">Conversation URL: {conversationUrl}</p>
          </div>
        </div>

        {/* End Call Button */}
        <button
          onClick={handleEndCall}
          disabled={ending}
          className="absolute top-6 right-6 z-50 px-6 py-3 bg-red-600 text-white rounded-lg font-bold shadow-lg hover:bg-red-700 transition-colors"
        >
          {ending ? 'Ending...' : 'End Call'}
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 w-screen h-screen bg-gradient-to-br from-pink-200 via-yellow-100 to-blue-200 flex flex-col items-center justify-center z-50">
      {/* Loading State */}
      {!iframeLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-pink-200 via-yellow-100 to-blue-200 z-10">
          <div className="text-center">
            <div className="animate-bounce mb-4">
              <span className="text-6xl">😂</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Ziggy is getting ready...</h2>
            <p className="text-gray-600 mb-4">{debugMsg}</p>
            <div className="flex justify-center">
              <svg className="animate-spin h-8 w-8 text-pink-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* Video Container */}
      <div
        ref={containerRef}
        className="w-full h-full"
        style={{ 
          display: iframeLoaded ? 'block' : 'none',
          minHeight: '100vh',
          minWidth: '100vw'
        }}
      />

      {/* End Call Button */}
      <button
        onClick={handleEndCall}
        disabled={ending}
        className="absolute top-6 right-6 z-50 px-6 py-3 bg-red-600 text-white rounded-lg font-bold shadow-lg hover:bg-red-700 transition-colors"
        style={{ opacity: ending ? 0.6 : 1, pointerEvents: ending ? 'none' : 'auto' }}
      >
        {ending ? (debugMsg === 'Ending conversation...' ? 'Ending...' : debugMsg) : 'End Call'}
      </button>
    </div>
  );
};

export default ConversationRoom;