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
  const [showWaitlistForm, setShowWaitlistForm] = React.useState(false);
  const [showAbout, setShowAbout] = React.useState(false);
  const [showPricing, setShowPricing] = React.useState(false);
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background with animated gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-orange-900/20"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]"></div>
      
      {/* Navigation */}
      <nav className="relative z-10 flex justify-between items-center p-6 lg:p-8">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-orange-500 rounded-full flex items-center justify-center">
            <span className="text-xl font-bold">🎭</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-orange-400 bg-clip-text text-transparent">ZIGGY</span>
        </div>
        <div className="hidden md:flex space-x-2 text-sm">
          <a href="#features" className="px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 no-underline">Features</a>
          <button onClick={() => setShowPricing(true)} className="px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 bg-transparent border-none cursor-pointer font-inherit">Pricing</button>
          <a href="#demo" className="px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 no-underline">Demo</a>
          <button onClick={() => setShowAbout(true)} className="px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 bg-transparent border-none cursor-pointer font-inherit">About</button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 lg:px-8 pt-4 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Content */}
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-500/15 to-orange-500/15 border border-yellow-500/30 rounded-full px-4 py-2 text-sm">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
                  <span className="text-yellow-300 font-semibold">FREE BETA ACCESS</span>
                </div>
                
                <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                  Meet <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">Ziggy</span>
                </h1>
                
                <h2 className="text-xl lg:text-2xl text-gray-300 font-light">
                  Your AI Standup Comedian Who Never Runs Out of Material
                </h2>
                
                <p className="text-lg text-gray-400 leading-relaxed max-w-xl">
                  Experience the future of comedy with Ziggy - an AI comedian you can actually video call. 
                  Real-time conversations, personalized jokes, and interactive entertainment like never before.
                </p>
                
                <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-4 max-w-xl">
                  <div className="flex items-start space-x-3">
                    <span className="text-xl">🎉</span>
                    <div>
                      <p className="text-yellow-300 font-semibold text-sm mb-1">Limited Time: Completely FREE!</p>
                      <p className="text-gray-300 text-sm">Try Ziggy now while we're in beta. When we launch officially, this will be a premium experience. Get unlimited access today!</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature Pills */}
              <div className="flex flex-wrap gap-3">
                <span className="inline-flex items-center px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full text-sm text-purple-300">
                  🎤 Live Video Calls
                </span>
                <span className="inline-flex items-center px-4 py-2 bg-orange-500/10 border border-orange-500/20 rounded-full text-sm text-orange-300">
                  🤖 AI-Powered Comedy
                </span>
                <span className="inline-flex items-center px-4 py-2 bg-pink-500/10 border border-pink-500/20 rounded-full text-sm text-pink-300">
                  ⚡ Instant Connection
                </span>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col gap-4 pt-2">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-orange-600 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25"
                >
                  <span className="relative z-10">Try Ziggy Free - Limited Time!</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-orange-500 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
                </button>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <button 
                    onClick={() => setShowPricing(true)}
                    className="flex-1 px-6 py-3 bg-white/10 border border-white/30 rounded-xl font-medium text-sm transition-all duration-300 hover:bg-white/20 hover:border-white/40 text-white"
                  >
                    <span className="flex items-center justify-center space-x-2">
                      <span>💎</span>
                      <span>View Premium Plans</span>
                    </span>
                  </button>
                  
                  <button 
                    onClick={() => setShowWaitlistForm(true)}
                    className="flex-1 px-6 py-3 bg-white/5 border border-white/20 rounded-xl font-medium text-sm transition-all duration-300 hover:bg-white/10 hover:border-white/30 text-gray-300"
                  >
                    <span className="flex items-center justify-center space-x-2">
                      <span>🚀</span>
                      <span>Early Access Waitlist</span>
                    </span>
                  </button>
                </div>
                
                <p className="text-xs text-gray-500 text-center">Start free • Upgrade anytime • Cancel whenever</p>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center space-x-6 pt-8 border-t border-gray-800">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-300">AI Powered</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span className="text-sm text-gray-300">Instant Setup</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span className="text-sm text-gray-300">Always Available</span>
                </div>
              </div>
            </div>

            {/* Right Column - Visual */}
            <div className="relative">
              {/* Main Character Display */}
              <div className="relative mx-auto w-80 h-80 lg:w-96 lg:h-96">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-orange-500/30 rounded-full blur-3xl"></div>
                
                {/* Character Circle */}
                <div className="relative w-full h-full bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 rounded-full flex items-center justify-center shadow-2xl">
                  <div className="w-4/5 h-4/5 bg-black/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    <span className="text-8xl animate-bounce">😂</span>
                  </div>
                  
                  {/* Floating Elements */}
                  <div className="absolute top-4 right-4 w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  
                  <div className="absolute bottom-8 left-4 w-8 h-8 bg-green-400/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Floating Comedy Bubbles */}
              <div className="absolute top-12 left-8 bg-white/10 backdrop-blur-sm rounded-2xl p-3 animate-float">
                <span className="text-2xl">🎭</span>
              </div>
              <div className="absolute bottom-12 right-8 bg-white/10 backdrop-blur-sm rounded-2xl p-3 animate-float-delayed">
                <span className="text-2xl">🎪</span>
              </div>
              <div className="absolute top-1/2 -right-4 bg-white/10 backdrop-blur-sm rounded-2xl p-3 animate-float-slow">
                <span className="text-2xl">🎨</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 px-6 lg:px-8 py-20 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl lg:text-4xl font-bold mb-4">Why Choose Ziggy?</h3>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Experience comedy like never before with cutting-edge AI technology
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4 p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-2xl">
                🎥
              </div>
              <h4 className="text-xl font-semibold">Live Video Interaction</h4>
              <p className="text-gray-400">Face-to-face conversations with real-time responses and expressions</p>
            </div>

            <div className="text-center space-y-4 p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-2xl">
                🧠
              </div>
              <h4 className="text-xl font-semibold">Personalized Comedy</h4>
              <p className="text-gray-400">Jokes and stories tailored to your interests and conversation style</p>
            </div>

            <div className="text-center space-y-4 p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-2xl">
                ⚡
              </div>
              <h4 className="text-xl font-semibold">Instant Access</h4>
              <p className="text-gray-400">No downloads, no setup - just click and start laughing immediately</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {/* Removed */}

      {/* Demo Section */}
      <section id="demo" className="relative z-10 px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl lg:text-4xl font-bold mb-8">Try These Sample Prompts</h3>
          
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-6 text-left">
              <div className="flex items-start space-x-3">
                <span className="text-2xl">🎭</span>
                <div>
                  <h4 className="font-semibold mb-2 text-purple-300">Comedy Roast</h4>
                  <p className="text-gray-300">"Give me a one minute roast about Ryan Breslow, the CEO of Bolt.new"</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-2xl p-6 text-left">
              <div className="flex items-start space-x-3">
                <span className="text-2xl">💻</span>
                <div>
                  <h4 className="font-semibold mb-2 text-orange-300">Tech Humor</h4>
                  <p className="text-gray-300">"Tell me a funny story about modern technology and social media"</p>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/dashboard')}
            className="group relative px-12 py-6 bg-gradient-to-r from-purple-600 to-orange-600 rounded-2xl font-bold text-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25"
          >
            <span className="relative z-10">Start Your Comedy Session Now</span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-orange-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
          </button>
        </div>
      </section>

      {/* Upcoming Features Section */}
      <section className="relative z-10 px-6 lg:px-8 py-20 bg-gradient-to-r from-purple-900/10 to-orange-900/10 border-y border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500/20 to-orange-500/20 border border-purple-500/30 rounded-full px-4 py-2 text-sm mb-6">
              <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
              <span className="text-purple-300">Coming Soon</span>
            </div>
            <h3 className="text-3xl lg:text-5xl font-bold mb-4">
              Next Level <span className="bg-gradient-to-r from-purple-400 to-orange-400 bg-clip-text text-transparent">Personalization</span>
            </h3>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto">
              The future of comedy is personal. Connect your data and watch Ziggy create material that's uniquely yours.
            </p>
          </div>

          {/* Flow Design */}
          <div className="relative">
            {/* Connection Line */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500/30 via-orange-500/30 to-purple-500/30 transform -translate-y-1/2"></div>
            
            <div className="grid lg:grid-cols-3 gap-8 relative">
              {/* Step 1 - Connect */}
              <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center hover:bg-white/10 transition-colors">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-r from-purple-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  1
                </div>
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center">
                  <svg className="w-10 h-10 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold mb-4 text-white">Connect Your Data</h4>
                <p className="text-gray-400 mb-6">Securely link your calendar, email, or social media for personalized content</p>
                
                {/* Data Source Options */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-white/5 rounded-lg p-3 border border-white/10">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
                        <span className="text-xs text-white">📅</span>
                      </div>
                      <span className="text-sm text-gray-300">Google Calendar</span>
                    </div>
                    <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                  </div>
                  <div className="flex items-center justify-between bg-white/5 rounded-lg p-3 border border-white/10">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-red-500 rounded flex items-center justify-center">
                        <span className="text-xs text-white">📧</span>
                      </div>
                      <span className="text-sm text-gray-300">Email Insights</span>
                    </div>
                    <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                  </div>
                  <div className="flex items-center justify-between bg-white/5 rounded-lg p-3 border border-white/10">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center">
                        <span className="text-xs text-white">💬</span>
                      </div>
                      <span className="text-sm text-gray-300">Social Media</span>
                    </div>
                    <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Step 2 - Analyze */}
              <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center hover:bg-white/10 transition-colors">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  2
                </div>
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-2xl flex items-center justify-center">
                  <svg className="w-10 h-10 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold mb-4 text-white">AI Analysis</h4>
                <p className="text-gray-400 mb-6">Ziggy analyzes your patterns, habits, and quirks to understand your unique story</p>
                
                {/* Analysis Indicators */}
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg p-4 border border-orange-500/20">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
                      <span className="text-sm font-semibold text-orange-300">Personality Mapping</span>
                    </div>
                    <p className="text-xs text-gray-400">Understanding your communication style and humor preferences</p>
                  </div>
                  <div className="bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-lg p-4 border border-red-500/20">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                      <span className="text-sm font-semibold text-red-300">Pattern Recognition</span>
                    </div>
                    <p className="text-xs text-gray-400">Finding funny moments and recurring themes in your life</p>
                  </div>
                </div>
              </div>

              {/* Step 3 - Perform */}
              <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center hover:bg-white/10 transition-colors">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  3
                </div>
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center">
                  <svg className="w-10 h-10 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 6v12a2 2 0 002 2h8a2 2 0 002-2V10m-4 6h.01" />
                  </svg>
                </div>
                <h4 className="text-xl font-bold mb-4 text-white">Personalized Comedy</h4>
                <p className="text-gray-400 mb-6">Experience custom-tailored jokes, stories, and roasts based on your real life</p>
                
                {/* Example Output */}
                <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 rounded-lg p-4 border border-pink-500/20 text-left">
                  <div className="flex items-start space-x-3">
                    <span className="text-lg">🎤</span>
                    <div>
                      <p className="text-sm text-pink-300 font-semibold mb-1">Custom Roast Example:</p>
                      <p className="text-xs text-gray-300 italic">"I see you have 47 Zoom meetings this week... Are you trying to set a world record for 'most times saying you're on mute'?"</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Privacy Notice */}
          <div className="mt-12 text-center">
            <div className="inline-flex items-center space-x-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2 text-sm">
              <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="text-green-300">100% Privacy Protected - Your data stays secure and is never stored permanently</span>
            </div>
          </div>

          {/* Early Access CTA */}
          <div className="text-center mt-8">
            <button 
              onClick={() => setShowWaitlistForm(true)}
              className="group relative px-8 py-4 bg-gradient-to-r from-purple-600/50 to-orange-600/50 border border-purple-500/30 rounded-xl font-semibold text-lg transition-all duration-300 hover:bg-gradient-to-r hover:from-purple-600 hover:to-orange-600 hover:border-purple-500"
            >
              <span className="relative z-10">Join Early Access Waitlist</span>
            </button>
            <p className="text-xs text-gray-500 mt-2">Be the first to experience hyper-personalized AI comedy</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 lg:px-8 py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p>&copy; 2025 Ziggy AI Comedy. Experience the future of entertainment.</p>
          <div className="mt-4">
            <a 
              href="https://devpost.com/software/ziggy-the-ai-standup-comedian" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors text-sm"
            >
              <span>🏆</span>
              <span>Support us on Devpost</span>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </footer>

      {/* Waitlist Form Modal */}
      {showWaitlistForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-white/20">
              <h3 className="text-xl font-bold text-white">Join Early Access Waitlist</h3>
              <button 
                onClick={() => setShowWaitlistForm(false)}
                className="w-10 h-10 bg-red-500/80 hover:bg-red-500 rounded-full flex items-center justify-center transition-colors shadow-lg border-2 border-white/30"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <iframe 
                src="https://docs.google.com/forms/d/e/1FAIpQLSdA5cX9OVspVqJZRILqk_HZvsnwjd4C9xC7A6-1kNWk29n2SQ/viewform?embedded=true" 
                width="100%" 
                height="800" 
                frameBorder="0" 
                marginHeight={0} 
                marginWidth={0}
                className="rounded-lg"
              >
                Loading…
              </iframe>
            </div>
          </div>
        </div>
      )}

      {/* Pricing Modal */}
      {showPricing && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-white/20">
              <h3 className="text-2xl font-bold text-white">Choose Your Comedy Experience</h3>
              <button 
                onClick={() => setShowPricing(false)}
                className="w-10 h-10 bg-red-500/80 hover:bg-red-500 rounded-full flex items-center justify-center transition-colors shadow-lg border-2 border-white/30"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-8 overflow-y-auto max-h-[calc(90vh-120px)]">
              
              {/* Current Free Access */}
              <div className="text-center mb-12 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-6">
                <div className="inline-flex items-center space-x-2 bg-green-500/20 border border-green-500/30 rounded-full px-4 py-2 text-sm mb-4">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  <span className="text-green-300 font-semibold">LIMITED TIME BETA</span>
                </div>
                <h4 className="text-xl font-bold text-white mb-2">All Premium Features Currently FREE!</h4>
                <p className="text-gray-300 text-sm">Get unlimited access to everything while we're in beta. When we launch, these will be premium features.</p>
              </div>

              {/* Pricing Tiers */}
              <div className="grid lg:grid-cols-4 gap-6 mb-12">
                
                {/* Free Tier */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 relative">
                  <div className="text-center mb-6">
                    <h4 className="text-lg font-bold text-white mb-2">Ziggy Free</h4>
                    <div className="text-3xl font-bold text-gray-300 mb-1">$0</div>
                    <div className="text-sm text-gray-400">Forever</div>
                  </div>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center space-x-3">
                      <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                      <span className="text-sm text-gray-300">5 minutes daily</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                      <span className="text-sm text-gray-300">Basic comedy content</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                      <span className="text-sm text-gray-300">Standard jokes & stories</span>
                    </li>
                  </ul>
                  <button className="w-full py-3 border border-gray-600 rounded-xl font-medium text-sm text-gray-300 bg-gray-800 cursor-default" disabled>
                    Current Plan
                  </button>
                </div>

                {/* Personalized Comedy Pro */}
                <div className="bg-gradient-to-b from-purple-500/10 to-pink-500/10 border-2 border-purple-500/30 rounded-2xl p-6 relative opacity-60 pointer-events-none">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full">COMING SOON</span>
                  </div>
                  <div className="text-center mb-6">
                    <h4 className="text-lg font-bold text-white mb-2">Comedy Pro</h4>
                    <div className="text-3xl font-bold text-purple-300 mb-1">$9.99</div>
                    <div className="text-sm text-gray-400">per month</div>
                  </div>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center space-x-3">
                      <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                      <span className="text-sm text-gray-300">Unlimited sessions</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                      <span className="text-sm text-gray-300">Personalized humor from your data</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                      <span className="text-sm text-gray-300">Custom roasts & life-based jokes</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                      <span className="text-sm text-gray-300">Daily comedy briefings</span>
                    </li>
                  </ul>
                  <button className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-medium text-sm text-white opacity-80 cursor-not-allowed" disabled>
                    Coming Soon
                  </button>
                </div>

                {/* Social Comedy Plus */}
                <div className="bg-gradient-to-b from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-2xl p-6 relative opacity-60 pointer-events-none">
                  <div className="text-center mb-6">
                    <h4 className="text-lg font-bold text-white mb-2">Social Plus</h4>
                    <div className="text-3xl font-bold text-orange-300 mb-1">$19.99</div>
                    <div className="text-sm text-gray-400">per month</div>
                  </div>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center space-x-3">
                      <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                      <span className="text-sm text-gray-300">Everything in Pro</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                      <span className="text-sm text-gray-300">Group sessions (up to 8 friends)</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                      <span className="text-sm text-gray-300">Comedy battles & competitions</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                      <span className="text-sm text-gray-300">Shareable comedy clips</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <span className="w-2 h-2 bg-orange-400 rounded-full"></span>
                      <span className="text-sm text-gray-300">Multiple comedian personalities</span>
                    </li>
                  </ul>
                  <button className="w-full py-3 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl font-medium text-sm text-white opacity-80 cursor-not-allowed" disabled>
                    Coming Soon
                  </button>
                </div>

                {/* Professional Entertainment */}
                <div className="bg-gradient-to-b from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-6 relative opacity-60 pointer-events-none">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">COMING SOON</span>
                  </div>
                  <div className="text-center mb-6">
                    <h4 className="text-lg font-bold text-white mb-2">Professional</h4>
                    <div className="text-3xl font-bold text-blue-300 mb-1">$49.99</div>
                    <div className="text-sm text-gray-400">per month</div>
                  </div>
                  <ul className="space-y-3 mb-6">
                    <li className="flex items-center space-x-3">
                      <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                      <span className="text-sm text-gray-300">Everything in Social Plus</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                      <span className="text-sm text-gray-300">Corporate event integration</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                      <span className="text-sm text-gray-300">Brand-specific humor</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                      <span className="text-sm text-gray-300">Analytics dashboard</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                      <span className="text-sm text-gray-300">White-label options</span>
                    </li>
                  </ul>
                  <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl font-medium text-sm text-white opacity-80 cursor-not-allowed" disabled>
                    Coming Soon
                  </button>
                </div>
              </div>

              {/* Special Features */}
              <div className="mb-8">
                <h4 className="text-2xl font-bold text-white text-center mb-8">Premium Add-Ons</h4>
                <div className="grid md:grid-cols-2 gap-6">
                  
                  {/* Special Occasions */}
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <span className="text-2xl">🎉</span>
                      <h5 className="text-lg font-bold text-white">Special Occasions</h5>
                    </div>
                    <p className="text-gray-400 text-sm mb-4">Custom comedy for life's special moments</p>
                    <ul className="space-y-2 mb-4">
                      <li className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">Birthday Roasts</span>
                        <span className="text-sm text-yellow-400 font-medium">$4.99</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">Anniversary Specials</span>
                        <span className="text-sm text-yellow-400 font-medium">$6.99</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">Work Presentations</span>
                        <span className="text-sm text-yellow-400 font-medium">$9.99</span>
                      </li>
                    </ul>
                  </div>

                  {/* Creator Studio */}
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <span className="text-2xl">🎬</span>
                      <h5 className="text-lg font-bold text-white">Creator Studio</h5>
                    </div>
                    <p className="text-gray-400 text-sm mb-4">Become a better comedian yourself</p>
                    <ul className="space-y-2 mb-4">
                      <li className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">Comedy Writing Assistant</span>
                        <span className="text-sm text-purple-400 font-medium">$99.99/mo</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">Practice Partner</span>
                        <span className="text-sm text-purple-400 font-medium">Included</span>
                      </li>
                      <li className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">Voice Cloning</span>
                        <span className="text-sm text-purple-400 font-medium">Included</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Enterprise Solutions */}
              <div className="text-center bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-8">
                <h4 className="text-xl font-bold text-white mb-4">Enterprise Solutions</h4>
                <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                  Transform your workplace culture with AI-powered comedy. Perfect for team building, 
                  presentations, and corporate events.
                </p>
                <div className="flex flex-wrap justify-center gap-4 mb-6">
                  <span className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-300 text-sm">Slack Integration</span>
                  <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-300 text-sm">Teams Integration</span>
                  <span className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-green-300 text-sm">Custom Branding</span>
                  <span className="px-3 py-1 bg-orange-500/20 border border-orange-500/30 rounded-full text-orange-300 text-sm">Analytics</span>
                </div>
                <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold text-white hover:from-blue-500 hover:to-purple-500 transition-colors">
                  Contact Enterprise Sales
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* About Modal */}
      {showAbout && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-white/20">
              <h3 className="text-2xl font-bold text-white">About Ziggy</h3>
              <button 
                onClick={() => setShowAbout(false)}
                className="w-10 h-10 bg-red-500/80 hover:bg-red-500 rounded-full flex items-center justify-center transition-colors shadow-lg border-2 border-white/30"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-8 overflow-y-auto max-h-[calc(90vh-120px)]">
              {/* Project Description */}
              <div className="text-center mb-12">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-purple-500 to-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-4xl">🎭</span>
                </div>
                <h4 className="text-xl font-bold text-white mb-4">Revolutionizing AI Entertainment</h4>
                <p className="text-gray-300 text-lg leading-relaxed max-w-3xl mx-auto">
                  Ziggy represents the next frontier in AI-powered entertainment. Built with cutting-edge video calling technology 
                  and advanced neural networks for comedy generation, we're creating experiences that blur the line between artificial and authentic humor.
                </p>
              </div>

              {/* Team Section */}
              <div className="mb-8">
                <h4 className="text-2xl font-bold text-white text-center mb-8">Meet the Creators</h4>
                
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  {/* Amit Acharya */}
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-colors">
                    <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-3xl font-bold text-white">
                      AA
                    </div>
                    <h5 className="text-xl font-bold text-white mb-2">Amit Acharya</h5>
                    <p className="text-purple-300 text-sm mb-3 font-medium">Co-Founder & Product Engineer</p>
                    <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                      Full-stack engineer with expertise in AI integration and real-time video technologies. 
                      Bridges technical implementation with product vision to create seamless user experiences.
                    </p>
                    <a 
                      href="https://github.com/amitach" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-lg text-purple-300 hover:bg-purple-500/30 transition-colors text-sm"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                      </svg>
                      <span>@amitach</span>
                    </a>
                  </div>

                  {/* Rahul Acharya */}
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-colors">
                    <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-3xl font-bold text-white">
                      RA
                    </div>
                    <h5 className="text-xl font-bold text-white mb-2">Rahul Acharya</h5>
                    <p className="text-orange-300 text-sm mb-3 font-medium">Co-Founder & AI Engineer</p>
                    <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                      AI engineer and researcher focused on natural language processing and conversational AI systems. 
                      Dedicated to building AI interactions that feel genuinely human and entertaining.
                    </p>
                    <a 
                      href="https://github.com/llk23r" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 px-4 py-2 bg-orange-500/20 border border-orange-500/30 rounded-lg text-orange-300 hover:bg-orange-500/30 transition-colors text-sm"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                      </svg>
                      <span>@llk23r</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Technology Stack */}
              <div className="text-center mb-8">
                <h4 className="text-xl font-bold text-white mb-6">Built With</h4>
                <div className="flex flex-wrap justify-center gap-3">
                  <span className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-300 text-sm">React</span>
                  <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-300 text-sm">TypeScript</span>
                  <span className="px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-green-300 text-sm">WebRTC</span>
                  <span className="px-3 py-1 bg-red-500/20 border border-red-500/30 rounded-full text-red-300 text-sm">Daily.co</span>
                  <span className="px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full text-yellow-300 text-sm">Tailwind CSS</span>
                  <span className="px-3 py-1 bg-pink-500/20 border border-pink-500/30 rounded-full text-pink-300 text-sm">Vite</span>
                </div>
              </div>

              {/* Devpost CTA */}
              <div className="text-center bg-gradient-to-r from-purple-500/10 to-orange-500/10 border border-purple-500/20 rounded-2xl p-6">
                <div className="mb-4">
                  <span className="text-3xl mb-3 block">🏆</span>
                  <h4 className="text-xl font-bold text-white mb-2">Love Ziggy? Show Your Support!</h4>
                  <p className="text-gray-300 text-sm mb-4">
                    We're competing in hackathons to bring you the best AI comedy experience. Your support means the world to us!
                  </p>
                </div>
                <a 
                  href="https://devpost.com/software/ziggy-the-ai-standup-comedian" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group inline-flex items-center space-x-3 px-6 py-3 bg-gradient-to-r from-purple-600 to-orange-600 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                  <span>★ Like Our Devpost Project</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
                <p className="text-xs text-gray-400 mt-3">
                  Takes 2 seconds • Helps us reach more comedy lovers • Completely free to like!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bolt.new badge */}
      <a
        href="https://bolt.new/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Built with Bolt.new"
        className="fixed bottom-4 right-4 z-50 w-12 h-12 md:w-14 md:h-14"
      >
        <img
          src="https://raw.githubusercontent.com/kickiniteasy/bolt-hackathon-badge/main/src/public/bolt-badge/black_circle_360x360/black_circle_360x360.svg"
          alt="Built with Bolt.new"
          className="w-full h-full"
        />
      </a>

      {/* Floating CTA Button - Bottom Right, above Bolt badge, mobile clean */}
      <div className="fixed z-50 right-4 bottom-24 sm:bottom-24 w-auto">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-3 bg-[#f8f8d8] text-[#181c1f] font-bold text-sm sm:text-base rounded-full shadow hover:bg-[#fffbe6] transition-all duration-200 focus:outline-none mb-2 sm:mb-0"
          style={{ minWidth: '0' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <rect x="4" y="8" width="16" height="10" rx="4" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M20 14l2 1.5V8.5L20 10" stroke="currentColor" strokeWidth="2" />
          </svg>
          <span className="truncate block">Talk to Ziggy Now!</span>          
        </button>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 4s ease-in-out infinite 1s;
        }
        
        .animate-float-slow {
          animation: float-slow 5s ease-in-out infinite 2s;
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 via-black to-orange-900 text-center text-white">
      <div className="max-w-lg w-full">
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-6">
            <div className="w-32 h-32 bg-gradient-to-r from-purple-500 to-orange-500 rounded-full flex items-center justify-center animate-pulse">
              <span className="text-6xl">😂</span>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-orange-500/30 rounded-full blur-2xl"></div>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-purple-400 to-orange-400 bg-clip-text text-transparent mb-2">
            Launching Ziggy...
          </h2>
          <p className="text-lg text-gray-300 font-medium mb-4">
            Warming up the punchlines and prepping the virtual stage!
          </p>
        </div>
        {loading && (
          <div className="w-full flex justify-center">
            <svg className="animate-spin h-12 w-12 text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
            </svg>
          </div>
        )}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mt-4">
            <div className="text-red-400 font-bold mb-2">{error}</div>
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