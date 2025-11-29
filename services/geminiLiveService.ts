import { GoogleGenAI, LiveServerMessage, Modality } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { createPcmBlob, decode, decodeAudioData, downsampleTo16k } from "./audioUtils";

interface GeminiLiveConfig {
  apiKey: string;
  scenarioContext: string;
  onTranscript: (text: string, isUser: boolean) => void;
  onAudioData: (amplitude: number) => void;
  onError: (error: Error) => void;
  onClose: () => void;
}

export class GeminiLiveService {
  private ai: GoogleGenAI;
  private inputAudioContext: AudioContext | null = null;
  private outputAudioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private scriptProcessor: ScriptProcessorNode | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private nextStartTime: number = 0;
  private config: GeminiLiveConfig;
  private sessionPromise: Promise<any> | null = null;

  constructor(config: GeminiLiveConfig) {
    this.config = config;
    this.ai = new GoogleGenAI({ apiKey: config.apiKey });
  }

  async connect() {
    try {
      // Try to get 16000Hz, but browser might provide native rate (e.g. 48000Hz)
      this.inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      this.outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      this.mediaStream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          channelCount: 1,
          sampleRate: 16000 
        } 
      });
      
      const outputNode = this.outputAudioContext.createGain();
      outputNode.connect(this.outputAudioContext.destination);

      this.sessionPromise = this.ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: SYSTEM_INSTRUCTION + `\n\nCURRENT CONTEXT: ${this.config.scenarioContext}`,
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
          },
          inputAudioTranscription: {}, 
          outputAudioTranscription: {}, 
        },
        callbacks: {
          onopen: () => {
            console.log('Gemini Live Connection Opened');
            this.startAudioInputStream();
          },
          onmessage: async (message: LiveServerMessage) => {
            this.handleMessage(message, outputNode);
          },
          onerror: (e: ErrorEvent) => {
            console.error('Gemini Live Error', e);
            this.config.onError(new Error("Connection error occurred."));
          },
          onclose: (e: CloseEvent) => {
            console.log('Gemini Live Connection Closed');
            this.config.onClose();
          },
        },
      });
      
    } catch (error) {
      console.error("Failed to connect:", error);
      this.config.onError(error instanceof Error ? error : new Error("Failed to connect"));
    }
  }

  private startAudioInputStream() {
    if (!this.inputAudioContext || !this.mediaStream || !this.sessionPromise) return;

    this.sourceNode = this.inputAudioContext.createMediaStreamSource(this.mediaStream);
    // Buffer size of 4096 gives enough data chunks. 
    // At 16k, this is ~256ms. At 48k, this is ~85ms.
    this.scriptProcessor = this.inputAudioContext.createScriptProcessor(4096, 1, 1);

    this.scriptProcessor.onaudioprocess = (e) => {
      let inputData = e.inputBuffer.getChannelData(0);
      
      // CRITICAL: Ensure we are sending 16kHz data
      if (this.inputAudioContext && this.inputAudioContext.sampleRate !== 16000) {
        inputData = downsampleTo16k(inputData, this.inputAudioContext.sampleRate);
      }
      
      // Calculate amplitude for visualizer (using the processed data)
      let sum = 0;
      for (let i = 0; i < inputData.length; i++) {
        sum += inputData[i] * inputData[i];
      }
      const rms = Math.sqrt(sum / inputData.length);
      this.config.onAudioData(rms);

      const pcmBlob = createPcmBlob(inputData);
      
      this.sessionPromise?.then((session) => {
        session.sendRealtimeInput({ media: pcmBlob });
      });
    };

    this.sourceNode.connect(this.scriptProcessor);
    this.scriptProcessor.connect(this.inputAudioContext.destination);
  }

  private async handleMessage(message: LiveServerMessage, outputNode: GainNode) {
    // 1. Handle Transcripts
    if (message.serverContent?.outputTranscription?.text) {
      this.config.onTranscript(message.serverContent.outputTranscription.text, false);
    }
    if (message.serverContent?.inputTranscription?.text) {
      this.config.onTranscript(message.serverContent.inputTranscription.text, true);
    }
    
    // 2. Handle Audio Output
    const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
    if (base64Audio && this.outputAudioContext) {
      // Audio Visuals for AI
      this.config.onAudioData(0.5); 

      // Sync playback time
      this.nextStartTime = Math.max(this.nextStartTime, this.outputAudioContext.currentTime);
      
      const audioBuffer = await decodeAudioData(
        decode(base64Audio),
        this.outputAudioContext,
        24000,
        1
      );

      const source = this.outputAudioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(outputNode);
      source.start(this.nextStartTime);
      this.nextStartTime += audioBuffer.duration;
    }

    // 3. Handle Interruption
    if (message.serverContent?.interrupted) {
        this.nextStartTime = 0;
    }
  }

  async disconnect() {
    // Stop recording
    if (this.sourceNode) {
        this.sourceNode.disconnect();
        this.sourceNode = null;
    }
    if (this.scriptProcessor) {
        this.scriptProcessor.disconnect();
        this.scriptProcessor = null;
    }
    if (this.mediaStream) {
        this.mediaStream.getTracks().forEach(track => track.stop());
        this.mediaStream = null;
    }
    
    // Close session to stop billing and release backend resources
    if (this.sessionPromise) {
      try {
        const session = await this.sessionPromise;
        session.close();
      } catch (e) {
        console.warn("Failed to close session properly", e);
      }
      this.sessionPromise = null;
    }

    // Close contexts
    if (this.inputAudioContext) {
        await this.inputAudioContext.close();
        this.inputAudioContext = null;
    }
    if (this.outputAudioContext) {
        await this.outputAudioContext.close();
        this.outputAudioContext = null;
    }
  }
}