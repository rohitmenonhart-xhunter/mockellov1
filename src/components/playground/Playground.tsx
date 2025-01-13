"use client";

import { LoadingSVG } from "@/components/button/LoadingSVG";
import { ChatMessageType } from "@/components/chat/ChatTile";
import { ColorPicker } from "@/components/colorPicker/ColorPicker";
import { AudioInputTile } from "@/components/config/AudioInputTile";
import { ConfigurationPanelItem } from "@/components/config/ConfigurationPanelItem";
import { NameValueRow } from "@/components/config/NameValueRow";
import { PlaygroundHeader } from "@/components/playground/PlaygroundHeader";
import { RegistrationForm } from "@/components/playground/RegistrationForm";
import {
  PlaygroundTab,
  PlaygroundTabbedTile,
  PlaygroundTile,
} from "@/components/playground/PlaygroundTile";
import { useConfig } from "@/hooks/useConfig";
import { TranscriptionTile } from "@/transcriptions/TranscriptionTile";
import {
  BarVisualizer,
  VideoTrack,
  useConnectionState,
  useDataChannel,
  useLocalParticipant,
  useRoomInfo,
  useTracks,
  useVoiceAssistant,
} from "@livekit/components-react";
import { ConnectionState, LocalParticipant, Track } from "livekit-client";
import { QRCodeSVG } from "qrcode.react";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import tailwindTheme from "../../lib/tailwindTheme.preval";
import { database } from "@/utils/firebase";
import { ref, set } from "firebase/database";
import { useToast } from "@/components/toast/ToasterProvider";

export interface PlaygroundMeta {
  name: string;
  value: string;
}

export interface PlaygroundProps {
  logo?: ReactNode;
  themeColors: string[];
  onConnect: (connect: boolean, opts?: { token: string; url: string }) => void;
  timeLeft?: number;
}

const headerHeight = 56;

// Add type definition for mobile tabs
interface MobileTab {
  title: string;
  content: React.ReactNode;
}

export default function Playground({
  logo,
  themeColors,
  onConnect,
  timeLeft = 0,
}: PlaygroundProps) {
  const [isDressCodeVerified, setIsDressCodeVerified] = useState(false);
  const [isDressCodeChecking, setIsDressCodeChecking] = useState(false);
  const [dressCodeMessage, setDressCodeMessage] = useState('');
  const [showDressCodeModal, setShowDressCodeModal] = useState(false);
  const [userInfo, setUserInfo] = useState<{ registerNumber: string; name: string; sessionId: string } | null>(null);
  const [showRegistration, setShowRegistration] = useState(true);
  const [transcripts, setTranscripts] = useState<ChatMessageType[]>([]);
  const [transcriptionSummary, setTranscriptionSummary] = useState("");
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [generationTime, setGenerationTime] = useState(0);
  const [dressCodeFeedback, setDressCodeFeedback] = useState<{
    currentAttire: string;
  } | null>(null);
  const [lastAIResponseTime, setLastAIResponseTime] = useState<number | null>(null);
  const [responseTimes, setResponseTimes] = useState<Array<{ aiMessage: string, responseTime: number }>>([]);

  const { config, setUserSettings } = useConfig();
  const { setToastMessage } = useToast();
  const { name } = useRoomInfo();
  const { localParticipant } = useLocalParticipant();
  const roomState = useConnectionState();

  const tracks = useTracks();
  const localTracks = tracks.filter(
    ({ participant }) => participant instanceof LocalParticipant
  );
  const localVideoTrack = localTracks.find(
    ({ source }) => source === Track.Source.Camera
  );
  const localMicTrack = localTracks.find(
    ({ source }) => source === Track.Source.Microphone
  );

  // Add state for native camera stream
  const [nativeVideoStream, setNativeVideoStream] = useState<MediaStream | null>(null);

  // Function to get native camera feed
  const startNativeCamera = async (): Promise<MediaStream> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      setNativeVideoStream(stream);
      return stream;
    } catch (error) {
      console.error('Error accessing camera:', error);
      throw new Error('Could not access camera. Please ensure camera permissions are granted.');
    }
  };

  // Function to stop native camera
  const stopNativeCamera = useCallback(() => {
    if (nativeVideoStream) {
      nativeVideoStream.getTracks().forEach(track => track.stop());
      setNativeVideoStream(null);
    }
  }, [nativeVideoStream]);

  // Cleanup native camera on unmount
  useEffect(() => {
    return () => {
      stopNativeCamera();
    };
  }, [stopNativeCamera]);

  // Add function to add system note to transcriptions
  const addSystemNote = useCallback((note: string) => {
    const systemNote = {
      name: "System",
      message: note,
      timestamp: new Date().getTime(),
      isSelf: false,
    };
    
    console.log("Adding system note:", systemNote); // Debug log
    
    setTranscripts(prevTranscripts => {
      const updatedTranscripts = [...prevTranscripts, systemNote];
      console.log("Updated transcripts:", updatedTranscripts); // Debug log
      localStorage.setItem('transcriptions', JSON.stringify(updatedTranscripts));
      return updatedTranscripts;
    });
  }, []);

  const verifyDressCode = useCallback(async () => {
    try {
      setIsDressCodeChecking(true);
      setShowDressCodeModal(true);

      // Start native camera
      const stream = await startNativeCamera();
      
      // Create video element for preview
      const video = document.createElement('video');
      video.srcObject = stream;
      video.autoplay = true;
      
      // Wait for video to be ready
      await new Promise<void>((resolve) => {
        video.onloadedmetadata = () => {
          video.play().then(() => resolve());
        };
      });

      // Give the camera a moment to adjust exposure/focus
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create a canvas to capture the frame
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error("Could not get canvas context");
      }
      
      // Capture the frame
      ctx.drawImage(video, 0, 0);

      // Convert the canvas to base64 image
      const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);

      // Send to our API
      const response = await fetch('/api/verify-dress-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          imageUrl: imageDataUrl,
          dressCodeStandards: {
            male: [
              "formal shirt",
              "business shirt",
              "dress shirt",
              "button-up shirt",
              "button-down shirt"
            ],
            female: [
              "churidar",
              "kurti",
              "chudithar",
              "formal suit",
              "business suit",
              "formal dress",
              "saree",
              "salwar"
            ],
            informal: [
              "polo",
              "polo shirt",
              "t-shirt",
              "tshirt",
              "casual shirt",
              "casual wear",
              "casual dress",
              "jeans",
              "casual pants"
            ]
          }
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.details || data.error || `Server error: ${response.status}`);
      }
      
      setDressCodeFeedback({
        currentAttire: data.currentAttire,
      });

      if (data.isFormal) {
        setIsDressCodeVerified(true);
        setDressCodeMessage("Your attire meets formal standards. You may proceed with the interview.");
        // Add formal dress code directly to transcriptions
        setTranscripts(prevTranscripts => {
          const updatedTranscripts = [...prevTranscripts, {
            name: "HR Assistant",
            message: `Dress Code Assessment: The candidate is in formal attire - ${data.currentAttire}. This meets our professional standards.`,
            timestamp: new Date().getTime(),
            isSelf: false
          }];
          localStorage.setItem('transcriptions', JSON.stringify(updatedTranscripts));
          return updatedTranscripts;
        });
        // Stop native camera before connecting to LiveKit
        stopNativeCamera();
        setTimeout(() => {
          setShowDressCodeModal(false);
          onConnect(true);
        }, 3000);
      } else {
        setDressCodeMessage("We would recommend you to be in formals.");
        // Add informal dress code directly to transcriptions
        setTranscripts(prevTranscripts => {
          const recommendationsText = data.recommendations ? 
            `\nRecommendations: ${data.recommendations}` : '';
          const updatedTranscripts = [...prevTranscripts, {
            name: "HR Assistant",
            message: `Dress Code Assessment: The candidate is in informal attire - ${data.currentAttire}. ${recommendationsText}`,
            timestamp: new Date().getTime(),
            isSelf: false
          }];
          localStorage.setItem('transcriptions', JSON.stringify(updatedTranscripts));
          return updatedTranscripts;
        });
      }
    } catch (error) {
      console.error('Error verifying dress code:', error);
      stopNativeCamera();
      setToastMessage({
        message: error instanceof Error ? `Failed to verify dress code: ${error.message}` : "Failed to verify dress code. Please try again.",
        type: "error"
      });
      setTimeout(() => {
        setShowDressCodeModal(false);
      }, 3000);
    } finally {
      setIsDressCodeChecking(false);
    }
  }, [onConnect, setToastMessage, stopNativeCamera]);

  const handleRegistrationSubmit = (data: { registerNumber: string; name: string; sessionId: string }) => {
    setUserInfo(data);
    // Save user info and session ID to localStorage
    localStorage.setItem('userInfo', JSON.stringify(data));
    localStorage.setItem('sessionId', data.sessionId);
    setShowRegistration(false);
  };

  // Remove localStorage persistence on mount
  useEffect(() => {
    setShowRegistration(true);
  }, []);

  const downloadFeedback = useCallback(() => {
    if (transcriptionSummary && userInfo) {
      const fileName = `${userInfo.registerNumber}_${userInfo.name.replace(/\s+/g, '_')}_Interview_Feedback.txt`;
      const blob = new Blob([transcriptionSummary], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  }, [transcriptionSummary, userInfo]);

  const voiceAssistant = useVoiceAssistant();

  const onDataReceived = useCallback(
    (msg: any) => {
      if (msg.topic === "transcription") {
        const decoded = JSON.parse(
          new TextDecoder("utf-8").decode(msg.payload)
        );
        let timestamp = new Date().getTime();
        if ("timestamp" in decoded && decoded.timestamp > 0) {
          timestamp = decoded.timestamp;
        }

        // Calculate response time if this is a user message and we have a last AI response time
        if (lastAIResponseTime) {
          const responseTime = (timestamp - lastAIResponseTime) / 1000; // Convert to seconds
          setResponseTimes(prev => {
            const newTimes = [...prev];
            if (lastAIResponseTime) {
              newTimes.push({
                aiMessage: transcripts[transcripts.length - 1]?.message || '',
                responseTime: (timestamp - lastAIResponseTime) / 1000
              });
            }
            return newTimes;
          });
          setLastAIResponseTime(null); // Reset for next interaction
        }

        // This is always a user message since HR messages come through TranscriptionTile
        const newTranscript = {
          name: "You",
          message: decoded.text,
          timestamp: timestamp,
          isSelf: true,
        };
        
        // Update transcripts state
        setTranscripts(prevTranscripts => {
          const updatedTranscripts = [...prevTranscripts, newTranscript];
          localStorage.setItem('transcriptions', JSON.stringify(updatedTranscripts));
          localStorage.setItem('responseTimes', JSON.stringify(responseTimes));
          return updatedTranscripts;
        });
      }
    },
    [lastAIResponseTime, transcripts, responseTimes]
  );

  // Add effect to track AI responses from TranscriptionTile
  useEffect(() => {
    if (transcripts.length > 0) {
      const lastMessage = transcripts[transcripts.length - 1];
      if (lastMessage.name === "HR Assistant" && !lastMessage.isSelf) {
        setLastAIResponseTime(lastMessage.timestamp);
      }
    }
  }, [transcripts]);

  // Function to save feedback to Firebase
  const saveFeedbackToFirebase = useCallback(async (feedback: string) => {
    if (!userInfo) return;

    try {
      const feedbackRef = ref(database, `interview_feedback/${userInfo.registerNumber.replace(/[.#$[\]]/g, '_')}`);
      const feedbackData = {
        sessionId: userInfo.sessionId,
        registerNumber: userInfo.registerNumber,
        name: userInfo.name,
        feedback: feedback,
        timestamp: new Date().toISOString(),
        stars: feedback.match(/★+½?(?=☆|$)/)?.[0]?.length || 0,
        interviewDate: new Date().toLocaleDateString(),
        interviewTime: new Date().toLocaleTimeString(),
      };

      await set(feedbackRef, feedbackData);
      
      console.log("Feedback saved to Firebase:", feedbackData);
      setToastMessage({
        message: "Interview feedback saved successfully!",
        type: "success"
      });
    } catch (error) {
      console.error("Error saving feedback to Firebase:", error);
      setToastMessage({
        message: "Failed to save interview feedback",
        type: "error"
      });
    }
  }, [userInfo]);

  // Modify handleSummarization to include response times
  const handleSummarization = useCallback(async () => {
    console.log("Starting summarization...");
    const storedTranscripts = localStorage.getItem('transcriptions');
    const storedResponseTimes = localStorage.getItem('responseTimes');
    const allTranscripts = storedTranscripts ? JSON.parse(storedTranscripts) : transcripts;
    const allResponseTimes = storedResponseTimes ? JSON.parse(storedResponseTimes) : responseTimes;
    
    // Get dress code information from transcripts
    const dressCodeNote = allTranscripts.find(
      (transcript: ChatMessageType) => 
      transcript.name === "HR Assistant" && 
      transcript.message.includes("Dress Code Assessment:")
    );
    
    console.log("All transcripts for summarization:", allTranscripts);
    console.log("Response times:", allResponseTimes);
    console.log("Dress code note:", dressCodeNote);
    
    if (allTranscripts && allTranscripts.length > 0) {
      try {
        setIsGeneratingSummary(true);
        const response = await fetch('/api/summarize', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            transcriptions: allTranscripts,
            responseTimes: allResponseTimes,
            dressCode: {
              note: dressCodeNote?.message || "Candidate was in formal attire",
              wasInformal: dressCodeNote?.message.includes("informal attire"),
              standards: {
                male: ["formal shirt", "business shirt", "dress shirt"],
                female: ["churidar", "kurti", "chudithar", "formal suit", "saree", "salwar"]
              },
              weightage: {
                min: 7,
                max: 9
              }
            }
          }),
        });
        
        console.log("Got response from API:", response);
        const data = await response.json();
        console.log("Summary data:", data);
        
        if (data.summary) {
          console.log("Setting summary in state and localStorage");
          setTranscriptionSummary(data.summary);
          localStorage.setItem('interviewSummary', data.summary);
          
          // Save to Firebase
          await saveFeedbackToFirebase(data.summary);
          
          setToastMessage({ 
            message: "HR Interview Feedback Generated! Check the summary below.", 
            type: "success" 
          });
        }
        return data.summary;
      } catch (error) {
        console.error('Error in summarization:', error);
        setToastMessage({ 
          message: "Failed to generate interview feedback", 
          type: "error" 
        });
        return null;
      } finally {
        setIsGeneratingSummary(false);
      }
    } else {
      console.log("No transcripts available for summarization");
      return null;
    }
  }, [transcripts, setToastMessage, saveFeedbackToFirebase]);

  // Modify the handleDisconnect function
  const handleDisconnect = useCallback(async () => {
    if (roomState === ConnectionState.Connected) {
      console.log("Currently connected, generating summary before disconnect");
      setIsGeneratingSummary(true);
      
      try {
        await localParticipant.setMicrophoneEnabled(false);
        console.log("Microphone disabled");

        const storedTranscripts = localStorage.getItem('transcriptions');
        console.log("Stored transcripts:", storedTranscripts);
        console.log("Current transcripts in state:", transcripts);
        
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const summary = await handleSummarization();
        console.log("Summary generated:", summary);
        
        if (summary) {
          setTranscriptionSummary(summary);
        }
      } finally {
        setIsGeneratingSummary(false);
        onConnect(false);
      }
    } else {
      // When connecting, first verify dress code
      verifyDressCode();
    }
  }, [roomState, handleSummarization, onConnect, transcripts, localParticipant, verifyDressCode]);

  // Modify the connection effect
  useEffect(() => {
    if (roomState === ConnectionState.Connected) {
      // Enable camera and mic when connected
      localParticipant.setCameraEnabled(true);
      localParticipant.setMicrophoneEnabled(config.settings.inputs.mic);
    } else if (roomState === ConnectionState.Disconnected) {
      // Don't remove transcriptions immediately to allow summary generation
      setTimeout(() => {
        localStorage.removeItem('transcriptions');
      }, 1000);
    }
  }, [config, localParticipant, roomState]);

  // Add new effect to enable camera on mount
  useEffect(() => {
    const enableCamera = async () => {
      try {
        // Request camera permissions early
        await navigator.mediaDevices.getUserMedia({ video: true });
        
        if (localParticipant) {
          await localParticipant.setCameraEnabled(true);
          console.log('Camera enabled on mount');
        }
      } catch (error) {
        console.error('Error enabling camera on mount:', error);
      }
    };

    // Enable camera when component mounts and we have a localParticipant
    if (localParticipant) {
      enableCamera();
    }
  }, [localParticipant]);

  // Effect to sync transcripts with localStorage
  useEffect(() => {
    if (transcripts.length > 0) {
      localStorage.setItem('transcriptions', JSON.stringify(transcripts));
    }
  }, [transcripts]);

  // Load transcripts from localStorage on mount
  useEffect(() => {
    const savedTranscripts = localStorage.getItem('transcriptions');
    if (savedTranscripts) {
      try {
        const parsed = JSON.parse(savedTranscripts);
        if (Array.isArray(parsed)) {
          setTranscripts(parsed);
        }
      } catch (e) {
        console.error('Error parsing saved transcripts:', e);
      }
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      localStorage.removeItem('transcriptions');
      localStorage.removeItem('interviewSummary');
    };
  }, []);

  const agentVideoTrack = tracks.find(
    (trackRef) =>
      trackRef.publication.kind === Track.Kind.Video &&
      trackRef.participant.isAgent
  );

  const videoTileContent = useMemo(() => {
    const videoFitClassName = `object-${config.video_fit || "cover"}`;

    const disconnectedContent = (
      <div className="flex items-center justify-center text-gray-700 text-center w-full h-full">
        No video track. Connect to get started.
      </div>
    );

    const loadingContent = (
      <div className="flex flex-col items-center justify-center gap-2 text-gray-700 text-center h-full w-full">
        <LoadingSVG />
        Waiting for video track
      </div>
    );

    const videoContent = (
      <VideoTrack
        trackRef={agentVideoTrack}
        className={`absolute top-1/2 -translate-y-1/2 ${videoFitClassName} object-position-center w-full h-full`}
      />
    );

    let content = null;
    if (roomState === ConnectionState.Disconnected) {
      content = disconnectedContent;
    } else if (agentVideoTrack) {
      content = videoContent;
    } else {
      content = loadingContent;
    }

    return (
      <div className="flex flex-col w-full grow text-gray-950 bg-black rounded-sm border border-gray-800 relative">
        {content}
      </div>
    );
  }, [agentVideoTrack, config.video_fit, roomState]);

  useEffect(() => {
    document.body.style.setProperty(
      "--lk-theme-color",
      // @ts-ignore
      tailwindTheme.colors[config.settings.theme_color]["500"]
    );
    document.body.style.setProperty(
      "--lk-drop-shadow",
      `var(--lk-theme-color) 0px 0px 18px`
    );
  }, [config.settings.theme_color]);

  const audioTileContent = useMemo(() => {
    const disconnectedContent = (
      <div className="flex flex-col items-center justify-center gap-2 text-gray-700 text-center w-full">
        No audio track. Connect to get started.
      </div>
    );

    const waitingContent = (
      <div className="flex flex-col items-center gap-2 text-gray-700 text-center w-full">
        <LoadingSVG />
        Waiting for audio track
      </div>
    );

    const visualizerContent = (
      <div
        className={`flex items-center justify-center w-full h-48 [--lk-va-bar-width:30px] [--lk-va-bar-gap:20px] [--lk-fg:var(--lk-theme-color)]`}
      >
        <BarVisualizer
          state={voiceAssistant.state}
          trackRef={voiceAssistant.audioTrack}
          barCount={5}
          options={{ minHeight: 20 }}
        />
      </div>
    );

    if (roomState === ConnectionState.Disconnected) {
      return disconnectedContent;
    }

    if (!voiceAssistant.audioTrack) {
      return waitingContent;
    }

    return visualizerContent;
  }, [
    voiceAssistant.audioTrack,
    roomState,
    voiceAssistant.state,
  ]);

  const chatTileContent = useMemo(() => {
    if (voiceAssistant.audioTrack) {
      return (
        <TranscriptionTile
          agentAudioTrack={voiceAssistant.audioTrack}
          accentColor={config.settings.theme_color}
          onTranscriptionUpdate={(messages) => {
            // Update transcripts state and localStorage
            setTranscripts(messages);
            localStorage.setItem('transcriptions', JSON.stringify(messages));
            console.log("Updated transcripts from TranscriptionTile:", messages);
          }}
        />
      );
    }
    return <></>;
  }, [config.settings.theme_color, voiceAssistant.audioTrack]);

  const settingsTileContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4 h-full w-full items-start overflow-y-auto">
        {config.description && (
          <ConfigurationPanelItem title="Description">
            {config.description}
          </ConfigurationPanelItem>
        )}

        <ConfigurationPanelItem title="Settings">
          {localParticipant && (
            <div className="flex flex-col gap-2">
              <NameValueRow
                name="Room"
                value={name}
                valueColor={`${config.settings.theme_color}-500`}
              />
              <NameValueRow
                name="Participant"
                value={localParticipant.identity}
              />
            </div>
          )}
        </ConfigurationPanelItem>
        <ConfigurationPanelItem title="Status">
          <div className="flex flex-col gap-2">
            <NameValueRow
              name="Room connected"
              value={
                roomState === ConnectionState.Connecting ? (
                  <LoadingSVG diameter={16} strokeWidth={2} />
                ) : (
                  roomState.toUpperCase()
                )
              }
              valueColor={
                roomState === ConnectionState.Connected
                  ? `${config.settings.theme_color}-500`
                  : "gray-500"
              }
            />
            <NameValueRow
              name="Agent connected"
              value={
                voiceAssistant.agent ? (
                  "TRUE"
                ) : roomState === ConnectionState.Connected ? (
                  <LoadingSVG diameter={12} strokeWidth={2} />
                ) : (
                  "FALSE"
                )
              }
              valueColor={
                voiceAssistant.agent
                  ? `${config.settings.theme_color}-500`
                  : "gray-500"
              }
            />
          </div>
        </ConfigurationPanelItem>
        {localVideoTrack && (
          <ConfigurationPanelItem
            title="Camera"
            deviceSelectorKind="videoinput"
          >
            <div className="relative">
              <VideoTrack
                className="rounded-sm border border-gray-800 opacity-70 w-full"
                trackRef={localVideoTrack}
              />
            </div>
          </ConfigurationPanelItem>
        )}
        {localMicTrack && (
          <ConfigurationPanelItem
            title="Microphone"
            deviceSelectorKind="audioinput"
          >
            <AudioInputTile trackRef={localMicTrack} />
          </ConfigurationPanelItem>
        )}
        <div className="w-full">
          <ConfigurationPanelItem title="Color">
            <ColorPicker
              colors={themeColors}
              selectedColor={config.settings.theme_color}
              onSelect={(color) => {
                const userSettings = { ...config.settings };
                userSettings.theme_color = color;
                setUserSettings(userSettings);
              }}
            />
          </ConfigurationPanelItem>
        </div>
        {config.show_qr && (
          <div className="w-full">
            <ConfigurationPanelItem title="QR Code">
              <QRCodeSVG value={window.location.href} width="128" />
            </ConfigurationPanelItem>
          </div>
        )}
      </div>
    );
  }, [
    config.description,
    config.settings,
    config.show_qr,
    localParticipant,
    name,
    roomState,
    localVideoTrack,
    localMicTrack,
    themeColors,
    setUserSettings,
    voiceAssistant.agent,
  ]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(window.location.href);
    setToastMessage({
      message: 'Link copied to clipboard!',
      type: 'success'
    });
  }, [setToastMessage]);

  const handleResponseTimeUpdate = useCallback(() => {
    setResponseTimes(prev => {
      const newTimes = [...prev];
      return [...responseTimes, ...newTimes];
    });
  }, [responseTimes]);

  const mobileTabs = useMemo<MobileTab[]>(() => [], []);

  // Add summary to mobile tabs
  useEffect(() => {
    if (transcriptionSummary && mobileTabs.length === 0) {
      mobileTabs.push({
        title: "Summary",
        content: (
          <PlaygroundTile
            title="HR Interview Feedback"
            className="w-full h-full grow"
            childrenClassName="justify-center"
          >
            <div className="p-4 text-white">
              <p className="text-sm whitespace-pre-line">{transcriptionSummary}</p>
            </div>
          </PlaygroundTile>
        ),
      });
    }
  }, [transcriptionSummary, mobileTabs]);

  // Add timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isGeneratingSummary) {
      setGenerationTime(0);
      timer = setInterval(() => {
        setGenerationTime(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isGeneratingSummary]);

  // Format time for loading display
  const formatGenerationTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Add auto-disconnect timer
  useEffect(() => {
    let disconnectTimer: NodeJS.Timeout;
    if (roomState === ConnectionState.Connected) {
      // Set timer for 10 minutes (600000 milliseconds)
      disconnectTimer = setTimeout(() => {
        console.log("Auto-disconnecting after 10 minutes");
        handleDisconnect();
      }, 600000);
    }
    return () => {
      if (disconnectTimer) clearTimeout(disconnectTimer);
    };
  }, [roomState, handleDisconnect]);

  // Add the dress code verification modal
  const dressCodeModal = showDressCodeModal && (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center">
      <div className="bg-gray-900 p-8 rounded-lg shadow-xl text-center max-w-md w-full mx-4">
        <div className="flex flex-col items-center">
          {isDressCodeChecking ? (
            <>
              {nativeVideoStream && (
                <div className="relative w-full aspect-video mb-4 rounded-lg overflow-hidden">
                  <video
                    autoPlay
                    playsInline
                    muted
                    ref={video => {
                      if (video && nativeVideoStream) {
                        video.srcObject = nativeVideoStream;
                      }
                    }}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <LoadingSVG diameter={48} strokeWidth={4} />
              <p className="text-white mt-4 text-lg font-semibold">Verifying Dress Code...</p>
              <p className="text-gray-400 mt-2">Please wait while we check your attire</p>
            </>
          ) : (
            <>
              <p className="text-white mt-4 text-lg font-semibold">
                {isDressCodeVerified ? "Dress Code Verified!" : "Dress Code Check"}
              </p>
              <p className="text-gray-400 mt-4 mb-2">{dressCodeMessage}</p>
              
              {dressCodeFeedback && (
                <div className="text-left w-full mt-4">
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <p className="text-gray-300 text-sm mb-2">
                      <span className="font-semibold">Current Attire:</span><br/>
                      {dressCodeFeedback.currentAttire}
                    </p>
                  </div>
                </div>
              )}

              {!isDressCodeVerified && dressCodeFeedback && (
                <div className="mt-6 flex gap-4">
                  <button
                    onClick={async () => {
                      // First add the note
                      const note = `Note: User is in informal dress code - ${dressCodeFeedback.currentAttire}`;
                      console.log("Adding informal attire note:", note); // Debug log
                      await addSystemNote(note);
                      
                      // Then proceed with other actions
                      stopNativeCamera();
                      setShowDressCodeModal(false);
                      onConnect(true);
                    }}
                    className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                  >
                    Continue Anyway
                  </button>
                  <button
                    onClick={() => {
                      // Stop camera and close modal
                      stopNativeCamera();
                      setShowDressCodeModal(false);
                      
                      // Clear all session data
                      localStorage.removeItem('userInfo');
                      localStorage.removeItem('transcriptions');
                      localStorage.removeItem('interviewSummary');
                      
                      // Show message
                      setToastMessage({
                        message: "Interview cancelled. Redirecting to reschedule page...",
                        type: "error"
                      });
                      
                      // Wait for toast to be visible before redirecting
                      setTimeout(() => {
                        // Redirect to reschedule page
                        window.location.href = '/reschedule';
                      }, 2000);
                    }}
                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                  >
                    Reschedule
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {dressCodeModal}
      {showRegistration && <RegistrationForm onSubmit={handleRegistrationSubmit} />}
      <PlaygroundHeader
        title={config.title}
        logo={logo}
        githubLink={config.github_link}
        height={headerHeight}
        accentColor={config.settings.theme_color}
        connectionState={roomState}
        onConnectClicked={handleDisconnect}
        timeLeft={timeLeft}
      />
      <div
        className={`flex gap-4 py-4 grow w-full selection:bg-${config.settings.theme_color}-900 relative`}
        style={{ height: `calc(100% - ${headerHeight}px)` }}
      >
        {/* Display summary if available */}
        {transcriptionSummary && (
          <div className="fixed top-20 left-4 right-4 text-white bg-gray-900/95 p-6 rounded-md shadow-lg max-w-2xl mx-auto z-[9999] backdrop-blur-sm max-h-[calc(100vh-120px)] overflow-y-auto">
            <div className="flex justify-between items-center mb-4 sticky top-0 bg-gray-900/95 py-2 z-10">
              <div>
                <h3 className="text-lg font-semibold">HR Interview Feedback</h3>
                <div className="text-2xl mt-2 font-mono tracking-wider" style={{ color: '#FFD700', textShadow: '0 0 5px rgba(255, 215, 0, 0.5)' }}>
                  {transcriptionSummary.match(/★+½?☆*/)?.[0] || ''}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={downloadFeedback}
                  className="text-blue-400 hover:text-blue-300 px-3 py-1 rounded border border-blue-400 hover:border-blue-300"
                >
                  Download
                </button>
                <button 
                  onClick={() => setTranscriptionSummary("")}
                  className="text-gray-400 hover:text-white px-2"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="border-t border-gray-700 pt-4 overflow-y-auto">
              <p className="text-sm whitespace-pre-line leading-relaxed">{
                // Remove the star rating line from the main text
                transcriptionSummary.replace(/[★☆½]+/, '')
              }</p>
            </div>
          </div>
        )}

        {/* Loading overlay */}
        {isGeneratingSummary && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center">
            <div className="bg-gray-900 p-8 rounded-lg shadow-xl text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="flex flex-col items-center">
                <LoadingSVG diameter={48} strokeWidth={4} />
                <p className="text-white mt-4 text-lg font-semibold">Analyzing Interview Performance...</p>
                <p className="text-gray-400 mt-2">Please wait while we evaluate your interview</p>
                <p className="text-gray-500 mt-2">Time elapsed: {formatGenerationTime(generationTime)}</p>
              </div>
            </div>
          </div>
        )}
        <div className="flex flex-col grow basis-1/2 gap-4 h-full lg:hidden">
          <PlaygroundTabbedTile
            className="h-full"
            tabs={mobileTabs}
            initialTab={mobileTabs.length - 1}
          />
        </div>
        <div
          className={`flex-col grow basis-1/2 gap-4 h-full hidden lg:${
            !config.settings.outputs.audio && !config.settings.outputs.video
              ? "hidden"
              : "flex"
          }`}
        >
          {config.settings.outputs.video && (
            <PlaygroundTile
              title="Video"
              className="w-full h-full grow"
              childrenClassName="justify-center"
            >
              {videoTileContent}
            </PlaygroundTile>
          )}
          {config.settings.outputs.audio && (
            <PlaygroundTile
              title="HR VOICE"
              className="w-full h-full grow"
              childrenClassName="justify-center"
            >
              {audioTileContent}
            </PlaygroundTile>
          )}
        </div>

        {config.settings.chat && (
          <PlaygroundTile
            title="transcriptions"
            className="h-full grow basis-1/4 hidden lg:flex"
          >
            {chatTileContent}
          </PlaygroundTile>
        )}
        <PlaygroundTile
          padding={false}
          backgroundColor="gray-950"
          className="h-full w-full basis-1/4 items-start overflow-y-auto hidden max-w-[480px] lg:flex"
          childrenClassName="h-full grow items-start"
        >
          {settingsTileContent}
        </PlaygroundTile>
      </div>
    </>
  );
}
