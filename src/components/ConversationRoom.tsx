import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface ConversationRoomProps {
  conversationUrl: string;
}

declare global {
  interface Window {
    Daily?: any;
  }
}

const DAILY_SCRIPT_ID = 'daily-js-embed-script';

const ConversationRoom: React.FC<ConversationRoomProps> = ({ conversationUrl }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const callFrameRef = useRef<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Remove any existing script
    const existingScript = document.getElementById(DAILY_SCRIPT_ID);
    if (existingScript) {
      existingScript.remove();
    }

    // Only add the script if not already present
    const script = document.createElement('script');
    script.id = DAILY_SCRIPT_ID;
    script.src = 'https://unpkg.com/@daily-co/daily-js';
    script.async = true;
    script.onload = () => {
      if (window.Daily && containerRef.current && !callFrameRef.current) {
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
        callFrameRef.current.on('left-meeting', () => {
          navigate('/');
        });
      }
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
  }, [conversationUrl, navigate]);

  return (
    <div className="fixed inset-0 w-screen h-screen bg-gradient-to-br from-pink-200 via-yellow-100 to-blue-200 flex flex-col items-center justify-center z-50">
      <div
        ref={containerRef}
        style={{ width: '100vw', height: '100vh', minWidth: '100vw', minHeight: '100vh', maxWidth: '100vw', maxHeight: '100vh', borderRadius: 0, boxShadow: 'none', border: 'none', overflow: 'hidden' }}
        className="flex items-center justify-center"
      />
      {/* No header, no open in new tab, no external links */}
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