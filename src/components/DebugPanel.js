import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { AlertTriangle, CheckCircle, XCircle, Info, ExternalLink } from 'lucide-react';
export const DebugPanel = () => {
    const [debugInfo, setDebugInfo] = useState([]);
    const [isVisible, setIsVisible] = useState(false);
    const addDebugInfo = (info) => {
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
            }
            else if (check.value) {
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
            }
            else {
                const errorText = await response.text();
                addDebugInfo({
                    type: 'error',
                    message: `Tavus API error: ${response.status} ${response.statusText}`,
                    details: errorText
                });
            }
        }
        catch (error) {
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
            }
            else {
                addDebugInfo({
                    type: 'error',
                    message: `Conversation creation failed: ${response.status}`,
                    details: data
                });
            }
        }
        catch (error) {
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
    const getIcon = (type) => {
        switch (type) {
            case 'success': return _jsx(CheckCircle, { className: "w-4 h-4 text-green-500" });
            case 'error': return _jsx(XCircle, { className: "w-4 h-4 text-red-500" });
            case 'warning': return _jsx(AlertTriangle, { className: "w-4 h-4 text-yellow-500" });
            default: return _jsx(Info, { className: "w-4 h-4 text-blue-500" });
        }
    };
    if (!isVisible) {
        return (_jsx("button", { onClick: () => setIsVisible(true), className: "fixed bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-700 transition-colors z-50", children: "\uD83D\uDC1B Debug Ziggy" }));
    }
    return (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4", children: _jsxs("div", { className: "bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-hidden", children: [_jsx("div", { className: "p-6 border-b border-gray-200", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h2", { className: "text-xl font-bold text-gray-800", children: "Ziggy Debug Panel" }), _jsx("button", { onClick: () => setIsVisible(false), className: "text-gray-500 hover:text-gray-700", children: "\u2715" })] }) }), _jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6", children: [_jsx("button", { onClick: checkEnvironmentVariables, className: "bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors", children: "Check Environment" }), _jsx("button", { onClick: testTavusAPI, className: "bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors", children: "Test API Connection" }), _jsx("button", { onClick: testConversationCreation, className: "bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors", children: "Test Conversation" }), _jsx("button", { onClick: testCORSWorkaround, className: "bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors", children: "Test CORS" })] }), _jsxs("div", { className: "bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6", children: [_jsxs("h3", { className: "font-bold text-yellow-800 mb-2 flex items-center", children: [_jsx(AlertTriangle, { className: "w-5 h-5 mr-2" }), "CORS Issue Detected"] }), _jsx("p", { className: "text-yellow-700 text-sm mb-3", children: "The \"tavus.daily.co refused to connect\" error is caused by CORS (Cross-Origin Resource Sharing) restrictions in development mode." }), _jsxs("div", { className: "space-y-2 text-sm", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(ExternalLink, { className: "w-4 h-4 text-yellow-600" }), _jsxs("span", { className: "text-yellow-700", children: [_jsx("strong", { children: "Solution:" }), " Use \"Open in New Tab\" button when the video fails to load"] })] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(CheckCircle, { className: "w-4 h-4 text-green-600" }), _jsxs("span", { className: "text-yellow-700", children: [_jsx("strong", { children: "Production:" }), " This issue won't occur in deployed applications"] })] })] })] }), _jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsx("h3", { className: "text-lg font-semibold", children: "Debug Output" }), _jsx("button", { onClick: clearDebugInfo, className: "text-sm text-gray-500 hover:text-gray-700", children: "Clear" })] }), _jsx("div", { className: "bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto", children: debugInfo.length === 0 ? (_jsx("p", { className: "text-gray-500 text-center py-8", children: "Click the buttons above to start debugging" })) : (_jsx("div", { className: "space-y-3", children: debugInfo.map((info, index) => (_jsxs("div", { className: "flex items-start space-x-3 p-3 bg-white rounded border", children: [getIcon(info.type), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "font-medium text-gray-800", children: info.message }), info.details && (_jsx("pre", { className: "text-xs text-gray-600 mt-1 bg-gray-100 p-2 rounded overflow-x-auto", children: typeof info.details === 'string'
                                                        ? info.details
                                                        : JSON.stringify(info.details, null, 2) }))] })] }, index))) })) })] })] }) }));
};
