import React, { useState, useEffect, useRef } from 'react';
import { SCENARIOS } from './constants';
import { ConnectionState, Scenario, TranscriptItem } from './types';
import ScenarioCard from './components/ScenarioCard';
import Visualizer from './components/Visualizer';
import { GeminiLiveService } from './services/geminiLiveService';

const App: React.FC = () => {
  const [activeScenario, setActiveScenario] = useState<Scenario>(SCENARIOS[0]);
  const [connectionState, setConnectionState] = useState<ConnectionState>(ConnectionState.DISCONNECTED);
  const [transcripts, setTranscripts] = useState<TranscriptItem[]>([]);
  const [audioAmplitude, setAudioAmplitude] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const liveServiceRef = useRef<GeminiLiveService | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll transcript
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transcripts]);

  const handleStart = async () => {
    if (!process.env.API_KEY) {
        setErrorMsg("API Key is missing in environment variables.");
        return;
    }

    setConnectionState(ConnectionState.CONNECTING);
    setErrorMsg(null);
    setTranscripts([]); // Clear previous conversation on new start

    const service = new GeminiLiveService({
      apiKey: process.env.API_KEY,
      scenarioContext: activeScenario.promptContext,
      onTranscript: (text, isUser) => {
        setTranscripts(prev => {
           // Prevent duplicate rapid-fire updates if needed, but streaming usually partials
           // For simplicity in this demo, we append complete thoughts or handle continuous stream visuals
           // A more complex implementation handles 'turnComplete' for cleaner bubbles.
           // Here we just append.
           
           // Simple debouncing/grouping logic:
           const last = prev[prev.length - 1];
           if (last && last.isUser === isUser && (Date.now() - last.timestamp < 2000)) {
              // Update last message
              return prev.map((item, idx) => idx === prev.length -1 ? {...item, text: item.text + text} : item);
           }
           
           return [...prev, {
             id: Date.now().toString(),
             text,
             isUser,
             timestamp: Date.now()
           }];
        });
      },
      onAudioData: (amp) => {
        setAudioAmplitude(amp);
      },
      onError: (err) => {
        setConnectionState(ConnectionState.ERROR);
        setErrorMsg(err.message);
        liveServiceRef.current = null;
      },
      onClose: () => {
        setConnectionState(ConnectionState.DISCONNECTED);
        setAudioAmplitude(0);
        liveServiceRef.current = null;
      }
    });

    liveServiceRef.current = service;
    await service.connect();
    setConnectionState(ConnectionState.CONNECTED);
  };

  const handleStop = async () => {
    if (liveServiceRef.current) {
      await liveServiceRef.current.disconnect();
      liveServiceRef.current = null;
    }
    setConnectionState(ConnectionState.DISCONNECTED);
    setAudioAmplitude(0);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col items-center p-4 sm:p-6">
      
      {/* Header */}
      <header className="w-full max-w-4xl flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-2xl">
            🦜
          </div>
          <div>
            <h1 className="text-2xl font-bold text-indigo-900 tracking-tight">Koko English</h1>
            <p className="text-sm text-slate-500">Fun AI Tutor for Kids</p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2 ${
          connectionState === ConnectionState.CONNECTED ? 'bg-green-100 text-green-700' : 
          connectionState === ConnectionState.CONNECTING ? 'bg-yellow-100 text-yellow-700' :
          'bg-slate-200 text-slate-500'
        }`}>
          <div className={`w-2 h-2 rounded-full ${
             connectionState === ConnectionState.CONNECTED ? 'bg-green-500 animate-pulse' : 
             connectionState === ConnectionState.CONNECTING ? 'bg-yellow-500' : 'bg-slate-400'
          }`} />
          {connectionState === ConnectionState.CONNECTED ? 'Talking' : 
           connectionState === ConnectionState.CONNECTING ? 'Connecting...' : 'Ready'}
        </div>
      </header>

      {/* Main Content Grid */}
      <main className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Scenarios */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="text-lg font-bold text-slate-700 px-2">Choose a Topic</h2>
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
            {SCENARIOS.map(scenario => (
              <ScenarioCard
                key={scenario.id}
                scenario={scenario}
                isSelected={activeScenario.id === scenario.id}
                onClick={() => setActiveScenario(scenario)}
                disabled={connectionState !== ConnectionState.DISCONNECTED}
              />
            ))}
          </div>
        </div>

        {/* Middle/Right Column: Interaction Area */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Visualizer & Controls Box */}
          <div className="bg-white rounded-[2rem] shadow-xl p-6 flex flex-col items-center justify-center relative overflow-hidden min-h-[300px]">
             {/* Background Blob decoration */}
             <div className={`absolute inset-0 opacity-10 transition-colors duration-500 ${activeScenario.color}`} />
             
             <div className="w-64 h-64 relative z-10">
                <Visualizer 
                  isActive={connectionState === ConnectionState.CONNECTED} 
                  amplitude={audioAmplitude}
                  color={activeScenario.color}
                />
             </div>

             {/* Error Message */}
             {errorMsg && (
               <div className="absolute top-4 bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm font-medium z-20">
                 {errorMsg}
               </div>
             )}

             {/* Main Action Button */}
             <div className="mt-6 z-20">
                {connectionState === ConnectionState.DISCONNECTED ? (
                  <button
                    onClick={handleStart}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-bold py-4 px-10 rounded-full shadow-lg transform transition active:scale-95 flex items-center gap-2"
                  >
                    <span>🎙️</span> Start Talking
                  </button>
                ) : (
                  <button
                    onClick={handleStop}
                    className="bg-red-500 hover:bg-red-600 text-white text-lg font-bold py-4 px-10 rounded-full shadow-lg transform transition active:scale-95 flex items-center gap-2"
                  >
                     <span>🛑</span> Stop
                  </button>
                )}
             </div>
          </div>

          {/* Transcript / Hints Area */}
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 border-2 border-white shadow-sm flex-1 flex flex-col h-[300px]">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Conversation</h3>
            
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
              {transcripts.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center opacity-60">
                  <div className="text-4xl mb-2">💬</div>
                  <p>Select a topic and press Start<br/>to talk to Koko!</p>
                </div>
              ) : (
                transcripts.map((item) => (
                  <div 
                    key={item.id} 
                    className={`flex ${item.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`
                      max-w-[80%] px-5 py-3 rounded-2xl text-lg leading-relaxed shadow-sm
                      ${item.isUser 
                        ? 'bg-indigo-100 text-indigo-900 rounded-tr-none' 
                        : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'}
                    `}>
                      {item.text}
                    </div>
                  </div>
                ))
              )}
              <div ref={transcriptEndRef} />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;
