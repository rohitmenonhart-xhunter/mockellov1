import {
  LiveKitRoom,
  RoomAudioRenderer,
  StartAudio,
} from "@livekit/components-react";
import { AnimatePresence, motion } from "framer-motion";
import { Inter } from "next/font/google";
import Head from "next/head";
import { useCallback, useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import type { GetServerSideProps } from 'next';
import { ref, set } from "firebase/database";
import { database } from "@/utils/firebase";
import { LoadingSVG } from "@/components/button/LoadingSVG";
import { ConnectionState } from "livekit-client";

import { PlaygroundConnect } from "@/components/PlaygroundConnect";
import Playground from "@/components/playground/Playground";
import { PlaygroundToast } from "@/components/toast/PlaygroundToast";
import { ConfigProvider, useConfig } from "@/hooks/useConfig";
import { ConnectionMode, ConnectionProvider, useConnection } from "@/hooks/useConnection";
import { ToastProvider, useToast } from "@/components/toast/ToasterProvider";
import { logout } from "@/utils/auth";

const themeColors = [
  "pink",
];

const inter = Inter({ subsets: ["latin"] });

export default function Test() {
  return (
    <ToastProvider>
      <ConfigProvider>
        <ConnectionProvider>
          <TestInner />
        </ConnectionProvider>
      </ConfigProvider>
    </ToastProvider>
  );
}

const calculatePerformancePercentage = (summary: string, transcriptionCount: number, totalWords: number): number => {
  // Base score from star rating
  const stars = summary.match(/★+½?(?=☆|$)/)?.[0] || '';
  const fullStars = (stars.match(/★/g) || []).length;
  const hasHalf = stars.includes('½');
  const starScore = ((fullStars + (hasHalf ? 0.5 : 0)) / 5) * 100;

  // Participation score based on transcription data
  const participationScore = Math.min(100, (transcriptionCount * 10)); // 10 points per response, max 100
  const wordScore = Math.min(100, (totalWords / 5)); // 1 point per 5 words, max 100

  // Weight the scores: 60% star rating, 20% participation, 20% word count
  const weightedScore = (starScore * 0.6) + (participationScore * 0.2) + (wordScore * 0.2);
  
  // Return rounded percentage
  return Math.round(weightedScore);
};

export function TestInner() {
  const router = useRouter();
  const { shouldConnect, wsUrl, token, mode, connect, disconnect } =
    useConnection();
  
  const {config} = useConfig();
  const { toastMessage, setToastMessage } = useToast();
  const [roomState, setRoomState] = useState<ConnectionState>(ConnectionState.Disconnected);
  
  // Security check - verify user came from landing page
  useEffect(() => {
    const validatedFromLanding = localStorage.getItem('validatedFromLanding');
    const validationTimestamp = localStorage.getItem('validationTimestamp');
    const currentTime = Date.now();
    
    // Check if validation exists and is not older than 5 minutes
    if (!validatedFromLanding || !validationTimestamp || 
        currentTime - parseInt(validationTimestamp) > 5 * 60 * 1000) {
      router.push('/landing');
      return;
    }
  }, [router]);

  // Initialize with default value for SSR
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [hasMounted, setHasMounted] = useState(false);
  const [transcriptionSummary, setTranscriptionSummary] = useState("");
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [isFeedbackSaved, setIsFeedbackSaved] = useState(false);

  // Update room state when connection changes
  useEffect(() => {
    if (shouldConnect) {
      setRoomState(ConnectionState.Connected);
    } else {
      setRoomState(ConnectionState.Disconnected);
    }
  }, [shouldConnect]);

  // Handle initial timer setup after mount
  useEffect(() => {
    setHasMounted(true);
    if (typeof window !== 'undefined') {
      const savedTime = localStorage.getItem('sessionTimeLeft');
      const savedStartTime = localStorage.getItem('sessionStartTime');
      
      if (savedTime && savedStartTime) {
        const elapsedSinceLastSave = Math.floor((Date.now() - parseInt(savedStartTime)) / 1000);
        const remainingTime = Math.max(0, parseInt(savedTime) - elapsedSinceLastSave);
        setTimeLeft(remainingTime);
      } else {
        const SESSION_DURATION = 15 * 60;
        localStorage.setItem('sessionStartTime', Date.now().toString());
        localStorage.setItem('sessionTimeLeft', SESSION_DURATION.toString());
      }
    }
  }, []);

  // Function to generate and save feedback
  const generateAndSaveFeedback = useCallback(async () => {
    console.log("Starting feedback generation...");
    
    // Check for user info and session ID first
    const userInfo = localStorage.getItem('userInfo');
    const sessionId = localStorage.getItem('sessionId');

    if (!userInfo || !sessionId) {
      console.error("Missing user info or session ID", { userInfo: !!userInfo, sessionId: !!sessionId });
      setToastMessage({
        message: "Session information not found. Please try again.",
        type: "error"
      });
      return;
    }

    const transcriptions = localStorage.getItem('transcriptions');
    if (!transcriptions) {
      console.log("No transcriptions found");
      setToastMessage({
        message: "No interview responses found. Please try again.",
        type: "error"
      });
      return;
    }

    const parsedTranscriptions = JSON.parse(transcriptions);
    if (!parsedTranscriptions || parsedTranscriptions.length === 0) {
      console.log("No valid transcriptions to process");
      setToastMessage({
        message: "No valid interview responses found. Please try again.",
        type: "error"
      });
      return;
    }

    try {
      setIsGeneratingSummary(true);
      
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transcriptions: parsedTranscriptions }),
      });

      const data = await response.json();
      if (!data.summary || data.summary.trim() === '') {
        throw new Error('No valid feedback generated');
      }

      const parsedUserInfo = JSON.parse(userInfo);
      const performancePercentage = calculatePerformancePercentage(
        data.summary,
        parsedTranscriptions.length,
        parsedTranscriptions.reduce((acc: number, curr: any) => 
          acc + (curr.message ? curr.message.split(' ').length : 0), 0)
      );

      const feedbackData = {
        sessionId: sessionId,
        registerNumber: parsedUserInfo.registerNumber,
        name: parsedUserInfo.name,
        feedback: data.summary,
        timestamp: new Date().toISOString(),
        stars: data.summary.match(/★+½?(?=☆|$)/)?.[0]?.length || 0,
        performancePercentage: performancePercentage,
        interviewDate: new Date().toLocaleDateString(),
        interviewTime: new Date().toLocaleTimeString(),
        transcriptionCount: parsedTranscriptions.length,
        totalWords: parsedTranscriptions.reduce((acc: number, curr: any) => 
          acc + (curr.message ? curr.message.split(' ').length : 0), 0)
      };

      // Save to both Firebase locations
      const sessionFeedbackRef = ref(database, `sessions/${sessionId}`);
      const studentFeedbackRef = ref(database, `interview_feedback/${parsedUserInfo.registerNumber.replace(/[.#$[\]]/g, '_')}/${sessionId}`);

      await Promise.all([
        set(sessionFeedbackRef, feedbackData),
        set(studentFeedbackRef, feedbackData)
      ]);

      console.log("Feedback saved to Firebase successfully:", feedbackData);
      setIsFeedbackSaved(true);
      
      // Redirect to completion page
      router.push('/interview-complete');
    } catch (error) {
      console.error("Error in feedback generation:", error);
      setToastMessage({
        message: error instanceof Error ? error.message : "An error occurred. Please contact support.",
        type: "error"
      });
    } finally {
      setIsGeneratingSummary(false);
    }
  }, [setToastMessage, router, setIsGeneratingSummary, setIsFeedbackSaved]);

  // Timer effect
  useEffect(() => {
    if (!hasMounted) return;
    
    const SESSION_DURATION = 15 * 60;
    const FEEDBACK_TIME = 120; // 2 minutes

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        const newTime = prevTime - 1;
        localStorage.setItem('sessionTimeLeft', newTime.toString());
        
        // Check if we've reached 2 minutes remaining
        if (newTime === FEEDBACK_TIME && !isFeedbackSaved) {
          console.log("Checking session data before feedback generation...");
          const userInfo = localStorage.getItem('userInfo');
          const sessionId = localStorage.getItem('sessionId');
          
          if (!userInfo || !sessionId) {
            console.error("Missing session data at feedback time", { userInfo: !!userInfo, sessionId: !!sessionId });
            setToastMessage({
              message: "Session data not found. Please refresh and try again.",
              type: "error"
            });
            return newTime;
          }
          
          console.log("Triggering feedback generation at 2 minutes remaining");
          disconnect();
          generateAndSaveFeedback();
        }

        if (newTime <= 1) {
          clearInterval(timer);
          localStorage.removeItem('sessionTimeLeft');
          localStorage.removeItem('sessionStartTime');
          if (!isFeedbackSaved) {
            router.push('/landing');
          }
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [
    router,
    disconnect,
    hasMounted,
    isFeedbackSaved,
    generateAndSaveFeedback,
    setToastMessage
  ]);

  // Format time for display
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleConnect = useCallback(
    async (c: boolean, mode: ConnectionMode) => {
      c ? connect(mode) : disconnect();
    },
    [connect, disconnect]
  );

  const showPG = useMemo(() => {
    if (process.env.NEXT_PUBLIC_LIVEKIT_URL) {
      return true;
    }
    if(wsUrl) {
      return true;
    }
    return false;
  }, [wsUrl])

  return (
    <>
      <Head>
        <title>{config.title}</title>
        <meta name="description" content={config.description} />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta
          property="og:image"
          content="https://livekit.io/images/og/agents-playground.png"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="relative flex flex-col justify-center px-4 items-center h-full w-full bg-black">
        <div className="fixed bottom-4 left-4 text-white bg-gray-900 px-3 py-1 rounded-md shadow-lg z-50">
          Session expires in: {formatTime(timeLeft)}
        </div>

        {/* Loading overlay */}
        {isGeneratingSummary && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9999] flex items-center justify-center">
            <div className="bg-gray-900 p-8 rounded-lg shadow-xl text-center">
              <div className="flex flex-col items-center">
                <LoadingSVG diameter={48} strokeWidth={4} />
                <p className="text-white mt-4 text-lg font-semibold">Evaluating Your Performance...</p>
                <p className="text-gray-400 mt-2">Please wait while we analyze your interview responses</p>
                <p className="text-gray-500 mt-2">This may take a few moments</p>
              </div>
            </div>
          </div>
        )}

        <AnimatePresence>
          {toastMessage && (
            <motion.div
              className="left-0 right-0 top-0 absolute z-10"
              initial={{ opacity: 0, translateY: -50 }}
              animate={{ opacity: 1, translateY: 0 }}
              exit={{ opacity: 0, translateY: -50 }}
            >
              <PlaygroundToast />
            </motion.div>
          )}
        </AnimatePresence>
        {showPG ? (
          <LiveKitRoom
            className="flex flex-col h-full w-full"
            serverUrl={wsUrl}
            token={token}
            connect={shouldConnect}
            onError={(e) => {
              setToastMessage({ message: e.message, type: "error" });
              console.error(e);
            }}
          >
            <Playground
              themeColors={themeColors}
              onConnect={(c) => {
                const m = process.env.NEXT_PUBLIC_LIVEKIT_URL ? "env" : mode;
                handleConnect(c, m);
              }}
              timeLeft={timeLeft}
            />
            <RoomAudioRenderer />
            <StartAudio label="Click to enable audio playback" />
          </LiveKitRoom>
        ) : (
          <PlaygroundConnect
            accentColor={themeColors[0]}
            onConnectClicked={(mode) => {
              handleConnect(true, mode);
            }}
          />
        )}
      </main>
    </>
  );
} 