import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Mic, MicOff, Video, VideoOff, Phone, PhoneOff } from 'lucide-react';
import { ConversationSession } from '../types';

interface VideoInterfaceProps {
  session: ConversationSession;
  onEndCall: () => void;
  onMessageSent: (message: string) => void;
}

export const VideoInterface: React.FC<VideoInterfaceProps> = ({
  session,
  onEndCall,
  onMessageSent,
}) => {
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isCallActive, setIsCallActive] = useState(true);
  const [message, setMessage] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize video stream (mock implementation)
    if (videoRef.current && session.videoUrl) {
      // In a real implementation, this would connect to the Tavus video stream
      videoRef.current.src = session.videoUrl;
    }
  }, [session.videoUrl]);

  const handleEndCall = () => {
    setIsCallActive(false);
    onEndCall();
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      onMessageSent(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-healthcare-50 to-primary-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-healthcare-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">DC</span>
            </div>
            <div>
              <h3 className="font-semibold text-healthcare-800">Dr. Sarah Chen</h3>
              <p className="text-sm text-healthcare-600">Healthcare Assistant</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
              isCallActive 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {isCallActive ? 'Connected' : 'Disconnected'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Video Section */}
        <div className="flex-1 relative bg-healthcare-900 flex items-center justify-center">
          {session.videoUrl ? (
            <video
              ref={videoRef}
              className="w-full h-full object-cover rounded-lg"
              autoPlay
              muted={!isAudioEnabled}
              style={{ display: isVideoEnabled ? 'block' : 'none' }}
            />
          ) : (
            <div className="text-center text-white">
              <div className="w-32 h-32 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl font-bold">DC</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Dr. Sarah Chen</h3>
              <p className="text-healthcare-300">Connecting to video...</p>
            </div>
          )}

          {/* Video Controls Overlay */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center space-x-4 bg-black bg-opacity-50 rounded-full px-6 py-3">
              <button
                onClick={() => setIsAudioEnabled(!isAudioEnabled)}
                className={`p-3 rounded-full transition-colors ${
                  isAudioEnabled 
                    ? 'bg-healthcare-600 hover:bg-healthcare-700' 
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {isAudioEnabled ? (
                  <Mic className="w-5 h-5 text-white" />
                ) : (
                  <MicOff className="w-5 h-5 text-white" />
                )}
              </button>

              <button
                onClick={() => setIsVideoEnabled(!isVideoEnabled)}
                className={`p-3 rounded-full transition-colors ${
                  isVideoEnabled 
                    ? 'bg-healthcare-600 hover:bg-healthcare-700' 
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {isVideoEnabled ? (
                  <Video className="w-5 h-5 text-white" />
                ) : (
                  <VideoOff className="w-5 h-5 text-white" />
                )}
              </button>

              <button
                onClick={handleEndCall}
                className="p-3 rounded-full bg-red-600 hover:bg-red-700 transition-colors"
              >
                <PhoneOff className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>

        {/* Chat Section */}
        {session.chatEnabled && (
          <div className="w-80 bg-white border-l border-healthcare-200 flex flex-col">
            <div className="p-4 border-b border-healthcare-200">
              <h4 className="font-semibold text-healthcare-800">Chat</h4>
            </div>

            <div 
              ref={chatContainerRef}
              className="flex-1 p-4 overflow-y-auto space-y-3"
            >
              {/* Sample chat messages */}
              <div className="bg-healthcare-50 rounded-lg p-3">
                <p className="text-sm text-healthcare-700">
                  Hello! I'm here to help gather some information before your appointment. 
                  Feel free to ask any questions during our conversation.
                </p>
                <span className="text-xs text-healthcare-500 mt-1 block">Dr. Sarah Chen</span>
              </div>
            </div>

            <div className="p-4 border-t border-healthcare-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 border border-healthcare-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="bg-healthcare-50 border-t border-healthcare-200 px-4 py-2">
        <div className="flex items-center justify-between text-sm text-healthcare-600">
          <span>Session ID: {session.sessionId}</span>
          <span>Duration: {new Date(Date.now() - new Date(session.startTime).getTime()).toISOString().substr(14, 5)}</span>
        </div>
      </div>
    </div>
  );
};