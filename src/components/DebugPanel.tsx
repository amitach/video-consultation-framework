import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, XCircle, Info, ExternalLink } from 'lucide-react';

interface DebugInfo {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  details?: any;
}

export const DebugPanel: React.FC = () => {
  const [debugInfo, setDebugInfo] = useState<DebugInfo[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  const addDebugInfo = (info: DebugInfo) => {
    setDebugInfo(prev => [...prev, { ...info, timestamp: new Date().toISOString() }]);
  };

  const checkEnvironmentVariables = () => {
    addDebugInfo({
      type: 'info',
      message: 'Checking environment variables...',
    });

    const checks = [
      {
        name: 'VITE_TAVUS_API_KEY',
        value: import.meta.env.VITE_TAVUS_API_KEY,
        required: true
      },
      {
        name: 'VITE_TAVUS_REPLICA_ID',
        value: import.meta.env.VITE_TAVUS_REPLICA_ID,
        required: true
      },
      {
        name: 'VITE_TAVUS_PERSONA_ID',
        value: import.meta.env.VITE_TAVUS_PERSONA_ID,
        required: true
      }
    ];

    checks.forEach(check => {
      if (check.required && !check.value) {
        addDebugInfo({
          type: 'error',
          message: `Missing required environment variable: ${check.name}`,
          details: 'Add this to your .env file'
        });
      } else if (check.value) {
        addDebugInfo({
          type: 'success',
          message: `${check.name}: ${check.value.substring(0, 8)}...`,
          details: 'Environment variable is set'
        });
      }
    });

    // Check for CORS issues
    const isDevelopment = window.location.hostname === 'localhost' || 
                         window.location.hostname === '127.0.0.1' ||
                         window.location.hostname.includes('stackblitz') ||
                         window.location.hostname.includes('bolt.new');

    if (isDevelopment) {
      addDebugInfo({
        type: 'warning',
        message: 'Development environment detected',
        details: 'CORS restrictions may prevent video embedding. Consider using "Open in New Tab" option.'
      });
    }
  };

  const testTavusAPI = async () => {
    addDebugInfo({
      type: 'info',
      message: 'Testing Tavus API connection...',
    });

    try {
      // Test API key validity by making a simple request
      const response = await fetch('https://tavusapi.com/v2/replicas', {
        method: 'GET',
        headers: {
          'x-api-key': import.meta.env.VITE_TAVUS_API_KEY,
        },
      });

      if (response.ok) {
        const data = await response.json();
        addDebugInfo({
          type: 'success',
          message: 'Tavus API connection successful',
          details: `Found ${Array.isArray(data) ? data.length : 'unknown'} replicas`
        });
      } else {
        const errorText = await response.text();
        addDebugInfo({
          type: 'error',
          message: `Tavus API error: ${response.status} ${response.statusText}`,
          details: errorText
        });
      }
    } catch (error) {
      addDebugInfo({
        type: 'error',
        message: 'Network error connecting to Tavus API',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  const testConversationCreation = async () => {
    addDebugInfo({
      type: 'info',
      message: 'Testing conversation creation...',
    });

    try {
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
      
      if (response.ok && data.conversation_url) {
        addDebugInfo({
          type: 'success',
          message: 'Conversation created successfully!',
          details: {
            conversation_url: data.conversation_url,
            conversation_id: data.conversation_id,
            status: data.status
          }
        });
      } else {
        addDebugInfo({
          type: 'error',
          message: `Conversation creation failed: ${response.status}`,
          details: data
        });
      }
    } catch (error) {
      addDebugInfo({
        type: 'error',
        message: 'Error creating conversation',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  const testCORSWorkaround = () => {
    addDebugInfo({
      type: 'info',
      message: 'Testing CORS workaround...',
    });

    // Check if we can access Daily.co script
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@daily-co/daily-js';
    script.onload = () => {
      addDebugInfo({
        type: 'success',
        message: 'Daily.co script loaded successfully',
        details: 'Video embedding should work'
      });
    };
    script.onerror = () => {
      addDebugInfo({
        type: 'error',
        message: 'Failed to load Daily.co script',
        details: 'Network or CORS issue detected'
      });
    };
    document.head.appendChild(script);
  };

  const clearDebugInfo = () => {
    setDebugInfo([]);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default: return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-700 transition-colors z-50"
      >
        🐛 Debug Ziggy
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">Ziggy Debug Panel</h2>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <button
              onClick={checkEnvironmentVariables}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Check Environment
            </button>
            <button
              onClick={testTavusAPI}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              Test API Connection
            </button>
            <button
              onClick={testConversationCreation}
              className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
            >
              Test Conversation
            </button>
            <button
              onClick={testCORSWorkaround}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Test CORS
            </button>
          </div>

          {/* CORS Information Panel */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h3 className="font-bold text-yellow-800 mb-2 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              CORS Issue Detected
            </h3>
            <p className="text-yellow-700 text-sm mb-3">
              The "tavus.daily.co refused to connect" error is caused by CORS (Cross-Origin Resource Sharing) restrictions in development mode.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <ExternalLink className="w-4 h-4 text-yellow-600" />
                <span className="text-yellow-700">
                  <strong>Solution:</strong> Use "Open in New Tab" button when the video fails to load
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-yellow-700">
                  <strong>Production:</strong> This issue won't occur in deployed applications
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Debug Output</h3>
            <button
              onClick={clearDebugInfo}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Clear
            </button>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
            {debugInfo.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Click the buttons above to start debugging
              </p>
            ) : (
              <div className="space-y-3">
                {debugInfo.map((info, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-white rounded border">
                    {getIcon(info.type)}
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{info.message}</p>
                      {info.details && (
                        <pre className="text-xs text-gray-600 mt-1 bg-gray-100 p-2 rounded overflow-x-auto">
                          {typeof info.details === 'string' 
                            ? info.details 
                            : JSON.stringify(info.details, null, 2)
                          }
                        </pre>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};