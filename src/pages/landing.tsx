import { motion } from 'framer-motion';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Inter } from 'next/font/google';
import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, query, orderByChild, equalTo } from 'firebase/database';
import Image from 'next/image';

const inter = Inter({ subsets: ['latin'] });

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCuWTdQuHs_l6rvfzaxvY4y-Uzn0EARRwM",
  authDomain: "athentication-3c73e.firebaseapp.com",
  databaseURL: "https://athentication-3c73e-default-rtdb.firebaseio.com",
  projectId: "athentication-3c73e",
  storageBucket: "athentication-3c73e.firebasestorage.app",
  messagingSenderId: "218346867452",
  appId: "1:218346867452:web:58a57b37f6b6a42ec72579",
  measurementId: "G-3GBM5TSMLS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const fadeInUp = {
  initial: { 
    opacity: 0, 
    y: 20 
  },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6
    }
  }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

interface SessionInfo {
  sessionId: string;
  role: string;
  createdAt?: string;
  hrName?: string;
  company?: string;
}

const getRoomNumber = (role: string): string => {
  const roleRoomMap: { [key: string]: string } = {
    'Fullstack developer': '001',
    'DevOps': '002',
    'Frontend developer': '003',
    'Backend developer': '004',
    'Software Engineer': '005',
    'Data Engineer': '006',
    'Machine Learning Engineer': '007',
    'Cloud Engineer': '008',
    'System Administrator': '009',
    'QA Engineer': '010',
    'Electronics Engineer': '011',
    'Electrical Engineer': '012',
    'Mechanical Engineer': '013',
    'Civil Engineer': '014',
    'Product Manager': '015',
    'Project Manager': '016',
    'UI/UX Designer': '017',
    'Database Administrator': '018',
    'Security Engineer': '019',
    'Network Engineer': '020'
  };

  return roleRoomMap[role] || '999'; // Default room if role not found
};

export default function LandingPage() {
  const router = useRouter();
  const [sessionId, setSessionId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isValidated, setIsValidated] = useState(false);
  const [sessionData, setSessionData] = useState<SessionInfo | null>(null);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes in seconds
  const [showStartButton, setShowStartButton] = useState(false);
  const [roomNumber, setRoomNumber] = useState<string>('');

  // Effect for countdown timer
  useEffect(() => {
    if (isValidated && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setShowStartButton(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isValidated, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const validateSessionId = async () => {
    if (!sessionId.trim()) {
      setError('Please enter your session ID');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const sessionRef = ref(database, 'keys/variable/sessionid');
      const snapshot = await get(sessionRef);
      
      if (snapshot.exists()) {
        let found = false;
        let sessionInfo: SessionInfo = {
          sessionId: '',
          role: '',
        };
        
        snapshot.forEach((childSnapshot) => {
          const data = childSnapshot.val();
          if (data && typeof data === 'object' && 'sessionId' in data && 'role' in data) {
            sessionInfo = {
              sessionId: data.sessionId as string,
              role: data.role as string,
              createdAt: data.createdAt as string | undefined,
              hrName: data.hrName as string | undefined,
              company: data.company as string | undefined
            };
            
            if (sessionInfo.sessionId === sessionId) {
              found = true;
              localStorage.setItem('validatedFromLanding', 'true');
              localStorage.setItem('validationTimestamp', Date.now().toString());
              setSessionData(sessionInfo);
              const room = getRoomNumber(sessionInfo.role);
              setRoomNumber(room);
              setIsValidated(true);
            }
          }
        });

        if (found && sessionInfo) {
          localStorage.setItem('validatedFromLanding', 'true');
          localStorage.setItem('validationTimestamp', Date.now().toString());
          setSessionData(sessionInfo);
          const room = getRoomNumber(sessionInfo.role);
          setRoomNumber(room);
          setIsValidated(true);
        } else {
          setError('Invalid session ID. Please check and try again.');
        }
      } else {
        setError('Invalid session ID. Please check and try again.');
      }
    } catch (error) {
      console.error('Error validating session:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Always show the session ID input form unless currently validated
  if (!isValidated) {
    return (
      <div className={`min-h-screen bg-black ${inter.className}`}>
        <Head>
          <title>Session Validation - Mockello</title>
          <meta name="description" content="Enter your session ID to begin the interview" />
        </Head>

        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-[#BE185D]/20 blur-[120px] rounded-full"></div>
          <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-[#BE185D]/10 blur-[120px] rounded-full"></div>
        </div>

        <main className="container mx-auto px-4 min-h-screen flex items-center justify-center">
          <motion.div
            initial="initial"
            animate="animate"
            variants={fadeInUp}
            className="w-full max-w-md"
          >
            <div className="bg-black/40 backdrop-blur-lg p-8 rounded-2xl border border-[#BE185D]/20">
              <h1 className="text-3xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#BE185D] to-white">
                Enter Session ID
              </h1>
              
              <div className="space-y-4">
                <input
                  type="text"
                  value={sessionId}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSessionId(e.target.value)}
                  placeholder="Enter your session ID"
                  className="w-full px-4 py-3 bg-black/50 border border-[#BE185D]/20 rounded-lg focus:outline-none focus:border-[#BE185D] transition-colors text-white"
                />
                
                {error && (
                  <p className="text-red-500 text-sm text-center">{error}</p>
                )}

                <button
                  onClick={validateSessionId}
                  disabled={loading}
                  className="w-full px-6 py-3 bg-gradient-to-r from-[#BE185D] to-[#BE185D]/80 text-white rounded-lg hover:shadow-[0_0_30px_-5px_#BE185D] transition-all duration-300 disabled:opacity-50"
                >
                  {loading ? 'Validating...' : 'Continue to Interview'}
                </button>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-black ${inter.className}`}>
      <Head>
        <title>Waiting Room - Mockello</title>
        <meta name="description" content="Prepare for your HR interview assessment" />
      </Head>

      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-[#BE185D]/20 blur-[120px] rounded-full"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-[#BE185D]/10 blur-[120px] rounded-full"></div>
      </div>

      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 p-6 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold text-white"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#BE185D] to-white">Mockello</span>
          </motion.div>
        </div>
      </nav>

      <main className="container mx-auto px-4 pt-32 pb-16 relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="text-center"
        >
          {/* Waiting Room Section */}
          <motion.div variants={fadeInUp} className="relative mb-16">
            <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-[#BE185D] to-white">
              Waiting Room
            </h1>
            <motion.p variants={fadeInUp} className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              Please use this time to review the instructions and prepare for your interview.
            </motion.p>

            {/* Room Number Display */}
            <motion.div
              variants={fadeInUp}
              className="mb-8 p-6 bg-[#BE185D]/10 rounded-xl border border-[#BE185D]/30"
            >
              <h2 className="text-2xl font-bold text-[#BE185D] mb-2">Your Room Information</h2>
              <p className="text-lg text-gray-300">Role: {sessionData?.role}</p>
              <p className="text-3xl font-mono font-bold text-[#BE185D] mt-2">Room #{roomNumber}</p>
              <p className="text-sm text-gray-400 mt-2">⚠️ Please remember your room number as it will be required in the next step</p>
            </motion.div>

            {/* Timer */}
            <motion.div
              variants={fadeInUp}
              className="mb-12"
            >
              <div className="text-8xl font-bold text-[#BE185D] mb-4 font-mono">
                {formatTime(timeLeft)}
              </div>
              <p className="text-gray-400">
                {showStartButton ? "You can now start your interview" : "Time remaining until interview starts"}
              </p>
            </motion.div>

            {/* Important Instructions Box */}
            <motion.div variants={fadeInUp} className="mb-12 max-w-2xl mx-auto bg-black/40 border border-[#BE185D]/20 rounded-xl p-6 backdrop-blur-sm">
              <h3 className="text-[#BE185D] font-semibold mb-3">Before You Begin:</h3>
              <ul className="text-left text-gray-300 space-y-2">
                <li className="flex items-center">
                  <span className="mr-2">✓</span> Ensure you're in a quiet environment
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span> Check your camera and microphone
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span> Have your resume ready for reference
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span> Remember your Room Number: #{roomNumber}
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span> The interview will take approximately 15 minutes
                </li>
              </ul>
            </motion.div>

            {/* Start Interview Button */}
            {showStartButton && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <button
                  onClick={() => router.push('/test')}
                  className="px-8 py-4 bg-gradient-to-r from-[#BE185D] to-[#BE185D]/80 text-white rounded-full text-lg font-semibold shadow-lg hover:shadow-[0_0_30px_-5px_#BE185D] transition-all duration-300"
                >
                  Start Your Interview
                </button>
              </motion.div>
            )}
          </motion.div>

          {/* Tips Section */}
          <motion.div
            variants={fadeInUp}
            className="mt-12 max-w-4xl mx-auto text-center bg-black/30 rounded-2xl backdrop-blur-sm border border-[#BE185D]/10 p-8"
          >
            <h3 className="text-2xl font-bold text-[#BE185D] mb-6">Interview Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div>
                <p className="text-gray-300 mb-2">• Speak clearly and naturally</p>
                <p className="text-gray-300 mb-2">• Take your time to think before answering</p>
              </div>
              <div>
                <p className="text-gray-300 mb-2">• Be honest in your responses</p>
                <p className="text-gray-300 mb-2">• Stay focused throughout the session</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-gray-600 relative z-10">
        <p>© 2025 Mockello. All rights reserved.</p>
      </footer>
    </div>
  );
} 