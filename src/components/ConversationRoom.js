import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { tavusService } from '../services/tavusService';
const DAILY_SCRIPT_ID = 'daily-js-embed-script';
function extractConversationId(url) {
    // Tavus conversation_url is like https://tavus.daily.co/c13ca81cd950f4b6
    // The last path segment is the conversation ID
    try {
        const parts = url.split('/');
        return parts[parts.length - 1] || null;
    }
    catch {
        return null;
    }
}
const ConversationRoom = ({ conversationUrl }) => {
    const containerRef = useRef(null);
    const callFrameRef = useRef(null);
    const navigate = useNavigate();
    const [iframeLoaded, setIframeLoaded] = useState(false);
    const [debugMsg, setDebugMsg] = useState('');
    const [ending, setEnding] = useState(false);
    const conversationId = extractConversationId(conversationUrl);
    // End call handler
    const handleEndCall = async () => {
        if (callFrameRef.current) {
            setEnding(true);
            setDebugMsg('Ending conversation...');
            // First call Tavus API to end the conversation
            if (conversationId) {
                try {
                    const result = await tavusService.endConversation(conversationId);
                    if (result.success) {
                        setDebugMsg('Conversation ended successfully');
                    }
                    else {
                        console.warn('Failed to end conversation via Tavus API:', result.error);
                        setDebugMsg('Warning: Could not end conversation properly');
                    }
                }
                catch (error) {
                    console.error('Error ending conversation:', error);
                    setDebugMsg('Warning: Could not end conversation properly');
                }
            }
            // Then leave the Daily frame
            callFrameRef.current.leave();
            setDebugMsg('Leaving meeting...');
        }
    };
    useEffect(() => {
        setDebugMsg('Initializing Ziggy conversation...');
        // Check if we're in development mode
        // const isDevelopment = window.location.hostname === 'localhost' || 
        //                      window.location.hostname === '127.0.0.1' ||
        //                      window.location.hostname.includes('stackblitz') ||
        //                      window.location.hostname.includes('bolt.new');
        // if (isDevelopment) {
        //   setDebugMsg('Development mode detected - CORS restrictions may apply');
        //   // Show fallback after a short delay to allow for potential success
        //   setTimeout(() => {
        //     if (!iframeLoaded) {
        //       setShowFallback(true);
        //       setDebugMsg('CORS restriction detected - using fallback mode');
        //     }
        //   }, 3000);
        // }
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
                        url: conversationUrl
                    });
                    // Set up event listeners
                    callFrameRef.current.on('loaded', () => {
                        setIframeLoaded(true);
                        setDebugMsg('Ziggy is ready to chat!');
                    });
                    callFrameRef.current.on('error', (e) => {
                        console.error('Daily call frame error:', e);
                        setDebugMsg(`Connection error: ${e.errorMsg || 'Unknown error'}`);
                    });
                    callFrameRef.current.on('left-meeting', async () => {
                        setDebugMsg('Left the conversation');
                        // Ensure Tavus conversation is ended if not already done
                        if (conversationId && !ending) {
                            try {
                                await tavusService.endConversation(conversationId);
                            }
                            catch (error) {
                                console.warn('Failed to end conversation on leave:', error);
                            }
                        }
                        navigate('/');
                    });
                    // Join the conversation
                    callFrameRef.current.join({ url: conversationUrl })
                        .then(() => {
                        setDebugMsg('Successfully joined conversation');
                    })
                        .catch((error) => {
                        console.error('Failed to join conversation:', error);
                        setDebugMsg(`Failed to join: ${error.message || 'Unknown error'}`);
                    });
                }
                catch (error) {
                    console.error('Error creating Daily frame:', error);
                    setDebugMsg('Failed to create video interface');
                }
            }
            else {
                setDebugMsg('Daily or container not ready.');
            }
        };
        script.onerror = () => {
            setDebugMsg('Failed to load Daily JS script.');
        };
        document.body.appendChild(script);
        return () => {
            if (callFrameRef.current) {
                try {
                    callFrameRef.current.destroy();
                }
                catch (e) {
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
    return (_jsxs("div", { className: "fixed inset-0 w-screen h-screen bg-gradient-to-br from-pink-200 via-yellow-100 to-blue-200 flex flex-col items-center justify-center z-50", children: [!iframeLoaded && (_jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-gradient-to-br from-pink-200 via-yellow-100 to-blue-200 z-10", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "animate-bounce mb-4", children: _jsx("span", { className: "text-6xl", children: "\uD83D\uDE02" }) }), _jsx("h2", { className: "text-2xl font-bold text-gray-800 mb-2", children: "Ziggy is getting ready..." }), _jsx("p", { className: "text-gray-600 mb-4", children: debugMsg }), _jsx("div", { className: "flex justify-center", children: _jsxs("svg", { className: "animate-spin h-8 w-8 text-pink-500", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [_jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), _jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8v8z" })] }) })] }) })), _jsx("div", { ref: containerRef, className: "w-full h-full", style: {
                    display: iframeLoaded ? 'block' : 'none',
                    minHeight: '100vh',
                    minWidth: '100vw'
                } }), _jsx("button", { onClick: handleEndCall, disabled: ending, className: "absolute top-6 right-6 z-50 px-6 py-3 bg-red-600 text-white rounded-lg font-bold shadow-lg hover:bg-red-700 transition-colors", style: { opacity: ending ? 0.6 : 1, pointerEvents: ending ? 'none' : 'auto' }, children: ending ? (debugMsg === 'Ending conversation...' ? 'Ending...' : debugMsg) : 'End Call' })] }));
};
export default ConversationRoom;
