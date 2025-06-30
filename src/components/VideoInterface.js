import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Video, VideoOff, PhoneOff } from 'lucide-react';
export const VideoInterface = ({ session, onEndCall, onMessageSent, }) => {
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);
    const [isCallActive, setIsCallActive] = useState(true);
    const [message, setMessage] = useState('');
    const videoRef = useRef(null);
    const chatContainerRef = useRef(null);
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
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };
    return (_jsxs("div", { className: "flex flex-col h-full bg-gradient-to-br from-healthcare-50 to-primary-50", children: [_jsx("div", { className: "bg-white shadow-sm border-b border-healthcare-200 p-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center", children: _jsx("span", { className: "text-white font-semibold text-sm", children: "DC" }) }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold text-healthcare-800", children: "Dr. Sarah Chen" }), _jsx("p", { className: "text-sm text-healthcare-600", children: "Healthcare Assistant" })] })] }), _jsx("div", { className: "flex items-center space-x-2", children: _jsx("div", { className: `px-3 py-1 rounded-full text-xs font-medium ${isCallActive
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'}`, children: isCallActive ? 'Connected' : 'Disconnected' }) })] }) }), _jsxs("div", { className: "flex-1 flex", children: [_jsxs("div", { className: "flex-1 relative bg-healthcare-900 flex items-center justify-center", children: [session.videoUrl ? (_jsx("video", { ref: videoRef, className: "w-full h-full object-cover rounded-lg", autoPlay: true, muted: !isAudioEnabled, style: { display: isVideoEnabled ? 'block' : 'none' } })) : (_jsxs("div", { className: "text-center text-white", children: [_jsx("div", { className: "w-32 h-32 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4", children: _jsx("span", { className: "text-4xl font-bold", children: "DC" }) }), _jsx("h3", { className: "text-xl font-semibold mb-2", children: "Dr. Sarah Chen" }), _jsx("p", { className: "text-healthcare-300", children: "Connecting to video..." })] })), _jsx("div", { className: "absolute bottom-6 left-1/2 transform -translate-x-1/2", children: _jsxs("div", { className: "flex items-center space-x-4 bg-black bg-opacity-50 rounded-full px-6 py-3", children: [_jsx("button", { onClick: () => setIsAudioEnabled(!isAudioEnabled), className: `p-3 rounded-full transition-colors ${isAudioEnabled
                                                ? 'bg-healthcare-600 hover:bg-healthcare-700'
                                                : 'bg-red-600 hover:bg-red-700'}`, children: isAudioEnabled ? (_jsx(Mic, { className: "w-5 h-5 text-white" })) : (_jsx(MicOff, { className: "w-5 h-5 text-white" })) }), _jsx("button", { onClick: () => setIsVideoEnabled(!isVideoEnabled), className: `p-3 rounded-full transition-colors ${isVideoEnabled
                                                ? 'bg-healthcare-600 hover:bg-healthcare-700'
                                                : 'bg-red-600 hover:bg-red-700'}`, children: isVideoEnabled ? (_jsx(Video, { className: "w-5 h-5 text-white" })) : (_jsx(VideoOff, { className: "w-5 h-5 text-white" })) }), _jsx("button", { onClick: handleEndCall, className: "p-3 rounded-full bg-red-600 hover:bg-red-700 transition-colors", children: _jsx(PhoneOff, { className: "w-5 h-5 text-white" }) })] }) })] }), session.chatEnabled && (_jsxs("div", { className: "w-80 bg-white border-l border-healthcare-200 flex flex-col", children: [_jsx("div", { className: "p-4 border-b border-healthcare-200", children: _jsx("h4", { className: "font-semibold text-healthcare-800", children: "Chat" }) }), _jsx("div", { ref: chatContainerRef, className: "flex-1 p-4 overflow-y-auto space-y-3", children: _jsxs("div", { className: "bg-healthcare-50 rounded-lg p-3", children: [_jsx("p", { className: "text-sm text-healthcare-700", children: "Hello! I'm here to help gather some information before your appointment. Feel free to ask any questions during our conversation." }), _jsx("span", { className: "text-xs text-healthcare-500 mt-1 block", children: "Dr. Sarah Chen" })] }) }), _jsx("div", { className: "p-4 border-t border-healthcare-200", children: _jsxs("div", { className: "flex space-x-2", children: [_jsx("input", { type: "text", value: message, onChange: (e) => setMessage(e.target.value), onKeyPress: handleKeyPress, placeholder: "Type a message...", className: "flex-1 px-3 py-2 border border-healthcare-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" }), _jsx("button", { onClick: handleSendMessage, disabled: !message.trim(), className: "px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors", children: "Send" })] }) })] }))] }), _jsx("div", { className: "bg-healthcare-50 border-t border-healthcare-200 px-4 py-2", children: _jsxs("div", { className: "flex items-center justify-between text-sm text-healthcare-600", children: [_jsxs("span", { children: ["Session ID: ", session.sessionId] }), _jsxs("span", { children: ["Duration: ", new Date(Date.now() - new Date(session.startTime).getTime()).toISOString().substr(14, 5)] })] }) })] }));
};
