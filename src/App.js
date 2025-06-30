import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { PersonaSetup } from './components/PersonaSetup';
import { Dashboard } from './components/Dashboard';
import ConversationRoom from './components/ConversationRoom';
function ZiggyHomePage() {
    const navigate = useNavigate();
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-br from-pink-200 via-yellow-100 to-blue-200 flex flex-col justify-between items-center text-center px-4 relative", children: [_jsxs("div", { className: "w-full flex-1 flex flex-col justify-center items-center", children: [_jsx("div", { className: "max-w-2xl w-full", children: _jsxs("div", { className: "flex flex-col items-center mb-4 md:mb-6", children: [_jsxs("div", { className: "relative flex flex-col items-center mb-4", children: [_jsx("div", { className: "w-32 h-32 rounded-full bg-gradient-to-tr from-pink-500 via-yellow-400 to-blue-500 flex items-center justify-center shadow-2xl border-8 border-white mb-2", children: _jsx("span", { className: "text-6xl font-extrabold text-white drop-shadow-lg", children: "\uD83D\uDE02" }) }), _jsx("div", { className: "absolute bottom-0 right-0 w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-blue-200", children: _jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 32 32", className: "w-8 h-8 text-blue-500", children: [_jsx("rect", { x: "4", y: "8", width: "16", height: "16", rx: "4", fill: "#3b82f6" }), _jsx("rect", { x: "4", y: "8", width: "16", height: "16", rx: "4", fill: "#3b82f6" }), _jsx("rect", { x: "4", y: "8", width: "16", height: "16", rx: "4", fill: "#3b82f6" }), _jsx("path", { d: "M20 14l6-4v12l-6-4v-4z", fill: "#fbbf24" })] }) })] }), _jsx("h1", { className: "text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-yellow-500 to-blue-600 mb-2 drop-shadow-lg", children: "Meet Ziggy" }), _jsx("h2", { className: "text-xl md:text-2xl font-bold text-blue-900 mb-1", children: "Your AI Video Call Sidekick" }), _jsx("p", { className: "text-base md:text-lg text-blue-800 mb-2 font-medium", children: "Talk face-to-face with Ziggy, the world's first AI you can actually video call! Ask questions, share a laugh, or just chat\u2014Ziggy responds in real time, just like a real person." }), _jsx("p", { className: "text-sm text-blue-700 mb-2", children: "Click below to start a live video conversation with your AI assistant. No downloads, no waiting\u2014just instant, interactive fun!" })] }) }), _jsxs("div", { className: "w-full max-w-3xl mx-auto mb-4 md:mb-0", children: [_jsxs("div", { className: "flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6", children: [_jsxs("div", { className: "flex flex-col items-center bg-white rounded-2xl shadow-lg p-4 md:p-6 w-full md:w-1/3 border border-blue-100", children: [_jsx("div", { className: "w-14 h-14 rounded-full bg-blue-200 flex items-center justify-center mb-2", children: _jsx("span", { className: "text-2xl", children: "\uD83E\uDDD1\u200D\uD83D\uDCBB" }) }), _jsx("div", { className: "font-bold text-blue-900 mb-1", children: "You" }), _jsx("div", { className: "text-blue-600 text-xs md:text-sm", children: "Ask anything, share a story, or just say hi!" })] }), _jsx("div", { className: "hidden md:flex flex-col items-center", children: _jsx("div", { className: "bg-gradient-to-r from-pink-200 via-yellow-100 to-blue-200 rounded-full px-4 py-2 md:px-6 md:py-3 shadow text-blue-900 font-semibold text-base md:text-lg border border-blue-100", children: _jsx("span", { children: "\uD83D\uDCAC Real-time Video Chat" }) }) }), _jsxs("div", { className: "flex flex-col items-center bg-white rounded-2xl shadow-lg p-4 md:p-6 w-full md:w-1/3 border border-pink-100", children: [_jsxs("div", { className: "w-14 h-14 rounded-full bg-pink-200 flex items-center justify-center mb-2 relative", children: [_jsx("span", { className: "text-2xl", children: "\uD83D\uDE02" }), _jsx("span", { className: "absolute bottom-0 right-0 w-5 h-5 bg-white rounded-full flex items-center justify-center border-2 border-pink-200", children: _jsxs("svg", { xmlns: 'http://www.w3.org/2000/svg', fill: 'none', viewBox: '0 0 24 24', className: 'w-3 h-3 text-pink-500', children: [_jsx("rect", { x: '3', y: '6', width: '12', height: '12', rx: '3', fill: '#ec4899' }), _jsx("path", { d: 'M15 10l5-3.5v10L15 13v-3z', fill: '#fde68a' })] }) })] }), _jsx("div", { className: "font-bold text-pink-900 mb-1", children: "Ziggy" }), _jsx("div", { className: "text-pink-600 text-xs md:text-sm", children: "Your AI video call sidekick\u2014funny, smart, and always ready to chat!" })] })] }), _jsx("div", { className: "flex md:hidden justify-center mt-2", children: _jsx("div", { className: "bg-gradient-to-r from-pink-200 via-yellow-100 to-blue-200 rounded-full px-4 py-2 shadow text-blue-900 font-semibold text-sm border border-blue-100", children: _jsx("span", { children: "\uD83D\uDCAC Real-time Video Chat" }) }) })] })] }), _jsx("div", { className: "w-full px-0 md:px-0 mb-2 md:mb-4", children: _jsx("button", { onClick: () => navigate('/dashboard'), className: "w-full py-4 px-8 rounded-xl bg-gradient-to-r from-pink-500 via-yellow-400 to-blue-500 text-white text-2xl font-bold shadow-lg hover:scale-105 transition-transform duration-200 animate-wiggle pointer-events-auto", children: "Start Laughing with Ziggy" }) }), _jsx("a", { href: "https://bolt.new/", target: "_blank", rel: "noopener noreferrer", "aria-label": "Built with Bolt.new", className: "fixed bottom-4 right-4 z-50", style: { width: '56px', height: '56px' }, children: _jsx("img", { src: "https://raw.githubusercontent.com/kickiniteasy/bolt-hackathon-badge/main/src/public/bolt-badge/black_circle_360x360/black_circle_360x360.svg", alt: "Built with Bolt.new", style: { width: '100%', height: '100%' } }) }), _jsx("style", { children: `
        @keyframes wiggle {
          0%, 100% { transform: rotate(-2deg); }
          50% { transform: rotate(2deg); }
        }
        .animate-wiggle { animation: wiggle 1.2s infinite; }
        @media (max-width: 767px) {
          .bolt-badge { width: 40px !important; height: 40px !important; }
        }
      ` })] }));
}
function DashboardAutoStart() {
    const navigate = useNavigate();
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const hasStartedRef = React.useRef(false);
    React.useEffect(() => {
        if (hasStartedRef.current)
            return;
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
                }
                else if (data.message && data.message.includes('maximum concurrent conversations')) {
                    setError('You have reached the maximum number of active video calls. Please end an existing call before starting a new one.');
                    setLoading(false);
                }
                else {
                    setError('Failed to start Ziggy conversation. Please try again later.');
                    setLoading(false);
                }
            }
            catch (e) {
                setError('Network error. Please try again.');
                setLoading(false);
            }
        }
        startConversation();
    }, [navigate]);
    return (_jsx("div", { className: "min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-200 via-yellow-100 to-blue-200 text-center", children: _jsxs("div", { className: "max-w-lg w-full", children: [_jsxs("div", { className: "flex flex-col items-center mb-8", children: [_jsx("span", { className: "ziggy-emoji", children: "\uD83D\uDE02" }), _jsx("h2", { className: "text-3xl md:text-4xl font-extrabold ziggy-gradient mb-2", children: "Launching Ziggy..." }), _jsx("p", { className: "text-lg text-blue-800 font-medium mb-4", children: "Warming up the punchlines and prepping the virtual stage!" })] }), loading && (_jsx("div", { className: "w-full flex justify-center", children: _jsxs("svg", { className: "animate-spin h-12 w-12 text-pink-500", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [_jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), _jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8v8z" })] }) })), error && (_jsxs("div", { className: "bg-red-50 border border-red-200 rounded-lg p-4 mt-4", children: [_jsx("div", { className: "text-red-600 font-bold mb-2", children: error }), _jsx("button", { onClick: () => window.location.reload(), className: "mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors", children: "Try Again" })] }))] }) }));
}
function HomePage() {
    const [persona, setPersona] = useState(null);
    const [conversations, setConversations] = useState([]);
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
    const handlePersonaCreated = (newPersona) => {
        setPersona(newPersona);
        setShowDashboard(true);
    };
    const handleStartConversation = () => {
        window.location.href = '/dashboard';
    };
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-healthcare-50 to-primary-50", children: _jsx("div", { className: "container mx-auto px-4 py-8", children: showDashboard && persona ? (_jsx(Dashboard, { persona: persona, conversations: conversations, onStartConversation: handleStartConversation })) : (_jsx(PersonaSetup, { onPersonaCreated: handlePersonaCreated })) }) }));
}
function ConversationPage() {
    const params = useParams();
    const conversationUrl = params.conversationUrl;
    if (!conversationUrl)
        return _jsx("div", { children: "Invalid conversation URL" });
    return _jsx(ConversationRoom, { conversationUrl: decodeURIComponent(conversationUrl) });
}
export default function App() {
    return (_jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(ZiggyHomePage, {}) }), _jsx(Route, { path: "/dashboard", element: _jsx(DashboardAutoStart, {}) }), _jsx(Route, { path: "/conversation/:conversationUrl", element: _jsx(ConversationPage, {}) })] }));
}
