import { motion } from 'framer-motion';
import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, push, get, onValue } from 'firebase/database';

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

interface HRProfile {
  name: string;
  dob: string;
  phone: string;
  company: string;
  hiringRoles: string[];
}

interface Session {
  id: string;
  createdAt: string;
  studentEmails: string[];
  emailsSent: boolean;
  role: string;
}

interface FeedbackData {
  feedback: string;
  interviewDate: string;
  interviewTime: string;
  name: string;
  performancePercentage: number;
  registerNumber: string;
  sessionId: string;
  stars: number;
  timestamp: string;
  totalWords: number;
  transcriptionCount: number;
  email?: string;
}

export default function HRDashboard() {
  const router = useRouter();
  const [profile, setProfile] = useState<HRProfile | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedProfile, setEditedProfile] = useState<HRProfile | null>(null);
  const [newRole, setNewRole] = useState('');
  const [sessions, setSessions] = useState<Session[]>([]);
  const [latestSession, setLatestSession] = useState<Session | null>(null);
  const [latestFeedback, setLatestFeedback] = useState<FeedbackData | null>(null);
  const [newEmail, setNewEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [sendingEmails, setSendingEmails] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [showRoleSelection, setShowRoleSelection] = useState(false);
  const [showPreviousSessions, setShowPreviousSessions] = useState(false);
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);
  const [sessionFeedbacks, setSessionFeedbacks] = useState<{[key: string]: FeedbackData[]}>({});
  const [selectedCandidates, setSelectedCandidates] = useState<{[key: string]: Set<string>}>({});
  const [showVenueModal, setShowVenueModal] = useState(false);
  const [processingSession, setProcessingSession] = useState<string | null>(null);
  const [tempEmails, setTempEmails] = useState<string[]>([]);
  const [isValidating, setIsValidating] = useState(true);
  const [authKey, setAuthKey] = useState<string | null>(null);

  const availableRoles = [
    'Fullstack developer',
    'DevOps',
    'Frontend developer',
    'Backend developer',
    'Software Engineer',
    'Data Engineer',
    'Machine Learning Engineer',
    'Cloud Engineer',
    'System Administrator',
    'QA Engineer',
    'Electronics Engineer',
    'Electrical Engineer',
    'Mechanical Engineer',
    'Civil Engineer',
    'Product Manager',
    'Project Manager',
    'UI/UX Designer',
    'Database Administrator',
    'Security Engineer',
    'Network Engineer'
  ];

  useEffect(() => {
    // Initialize sessions from localStorage
    const savedSessions = localStorage.getItem('hrSessions');
    if (savedSessions) {
      const parsedSessions = JSON.parse(savedSessions);
      const sessions = parsedSessions.map((session: any) => ({
        ...session,
        studentEmails: session.studentEmails || [],
        emailsSent: session.emailsSent || false
      }));
      setSessions(sessions);
      
      // Fetch feedback for all sessions
      sessions.forEach((session: Session) => {
        fetchLatestFeedback(session.id);
      });
    }

    // Check if HR is authenticated
    const storedProfile = localStorage.getItem('hrProfile');
    const storedKey = localStorage.getItem('hrAuthKey');
    
    if (!storedProfile || !storedKey) {
      router.push('/hr-portal');
      return;
    }

    // Validate the auth key against Firebase
    const validateKey = async () => {
      setIsValidating(true);
      try {
        const keysRef = ref(database, 'hr_auth_keys');
        const snapshot = await get(keysRef);
        
        if (snapshot.exists()) {
          const keys = snapshot.val();
          const isValidKey = Object.values(keys).some((key: any) => 
            key.value === storedKey && key.active === true
          );

          if (!isValidKey) {
            // Invalid or inactive key, redirect to login
            localStorage.removeItem('hrProfile');
            localStorage.removeItem('hrAuthKey');
            router.push('/hr-portal');
            return;
          }

          // Key is valid, set up the profile
          const parsedProfile = JSON.parse(storedProfile);
          setProfile(parsedProfile);
          setEditedProfile(parsedProfile);
          setAuthKey(storedKey);
        } else {
          // No keys exist, redirect to login
          localStorage.removeItem('hrProfile');
          localStorage.removeItem('hrAuthKey');
          router.push('/hr-portal');
        }
      } catch (error) {
        console.error('Error validating key:', error);
        router.push('/hr-portal');
      } finally {
        setIsValidating(false);
      }
    };

    validateKey();
  }, [router]);

  useEffect(() => {
    // Save sessions to localStorage whenever they change
    localStorage.setItem('hrSessions', JSON.stringify(sessions));
  }, [sessions]);

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (editedProfile) {
      localStorage.setItem('hrProfile', JSON.stringify(editedProfile));
      setProfile(editedProfile);
      setIsEditingProfile(false);
    }
  };

  const addHiringRole = () => {
    if (newRole.trim() && editedProfile) {
      setEditedProfile(prev => ({
        ...prev!,
        hiringRoles: [...prev!.hiringRoles, newRole.trim()]
      }));
      setNewRole('');
    }
  };

  const removeHiringRole = (index: number) => {
    if (editedProfile) {
      setEditedProfile(prev => ({
        ...prev!,
        hiringRoles: prev!.hiringRoles.filter((_, i) => i !== index)
      }));
    }
  };

  const generateSessionId = (profile: HRProfile) => {
    const now = new Date();
    const hrName = profile.name.toLowerCase().replace(/\s+/g, '');
    const time = now.getHours().toString().padStart(2, '0') + now.getMinutes().toString().padStart(2, '0');
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const year = now.getFullYear().toString();
    const randomNum = Math.floor(Math.random() * 90 + 10); // 2-digit random number
    const reversedDob = profile.dob.split('-').reverse().join('');
    
    return `${hrName}${time}${month}${year}${randomNum}${reversedDob}`;
  };

  const fetchLatestFeedback = async (sessionId: string) => {
    setIsLoadingFeedback(true);
    try {
      const feedbackRef = ref(database, 'interview_feedback');
      // Set up real-time listener
      onValue(feedbackRef, (snapshot) => {
        if (snapshot.exists()) {
          const feedbacks: FeedbackData[] = [];
          
          snapshot.forEach((registerSnapshot) => {
            registerSnapshot.forEach((sessionSnapshot) => {
              const data = sessionSnapshot.val();
              if (data.sessionId === sessionId) {
                feedbacks.push(data);
              }
            });
          });

          // Sort feedbacks by performance percentage in descending order
          const sortedFeedbacks = feedbacks.sort((a, b) => b.performancePercentage - a.performancePercentage);
          
          if (sortedFeedbacks.length > 0) {
            setSessionFeedbacks(prev => ({
              ...prev,
              [sessionId]: sortedFeedbacks
            }));
          }
        }
      });
    } catch (error) {
      console.error('Error fetching feedback:', error);
    } finally {
      setIsLoadingFeedback(false);
    }
  };

  const createSession = async (emails: string[]) => {
    if (!selectedRole) {
      alert('Please select a role first');
      return;
    }

    if (profile) {
      const sessionId = generateSessionId(profile);
      const newSession = {
        id: sessionId,
        createdAt: new Date().toISOString(),
        studentEmails: emails,
        emailsSent: false,
        role: selectedRole
      };
      
      try {
        // Save to Firebase under keys/variable/sessionid
        const sessionRef = ref(database, 'keys/variable/sessionid');
        const newSessionRef = push(sessionRef);
        await set(newSessionRef, {
          sessionId: sessionId,
          createdAt: newSession.createdAt,
          hrName: profile.name,
          company: profile.company,
          role: selectedRole
        });

        // Update local state
        setSessions(prev => [...prev, newSession]);
        setLatestSession(newSession);
        setSelectedRole('');

        // Send invitations immediately
        await sendInvitations(newSession);

        // Set up periodic feedback checking for the new session
        const checkInterval = setInterval(async () => {
          await fetchLatestFeedback(sessionId);
        }, 30000); // Check every 30 seconds

        // Clear interval after 1 hour
        setTimeout(() => {
          clearInterval(checkInterval);
        }, 60 * 60 * 1000);

      } catch (error) {
        console.error('Error saving session to Firebase:', error);
        alert('Failed to create session. Please try again.');
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const addEmailToSession = (sessionId: string) => {
    if (!newEmail.trim()) {
      setEmailError('Email cannot be empty');
      return;
    }
    if (!validateEmail(newEmail)) {
      setEmailError('Please enter a valid email');
      return;
    }

    setSessions(prev => prev.map(session => {
      if (session.id === sessionId) {
        if (session.studentEmails.includes(newEmail)) {
          setEmailError('Email already added');
          return session;
        }
        return {
          ...session,
          studentEmails: [...session.studentEmails, newEmail.trim()]
        };
      }
      return session;
    }));
    setNewEmail('');
    setEmailError('');
  };

  const removeEmailFromSession = (sessionId: string, email: string) => {
    setSessions(prev => prev.map(session => {
      if (session.id === sessionId) {
        return {
          ...session,
          studentEmails: session.studentEmails.filter(e => e !== email)
        };
      }
      return session;
    }));
  };

  const sendInvitations = async (session: Session) => {
    setSendingEmails(true);
    try {
      const landingPageUrl = `${window.location.origin}/landing`;
      
      const subject = encodeURIComponent(`Interview Invitation - ${profile?.company} - AI-Based Assessment`);
      const body = encodeURIComponent(
`Dear Candidate,

Thank you for your interest in joining ${profile?.company}. We are excited to invite you to participate in our innovative AI-based interview assessment.

Interview Details:
- Platform: Mockello AI Interview System
- Session Code: ${session.id}
- Role: ${session.role}
- Duration: 15-20 minutes
- Deadline: Within 48 hours

Getting Started:
1. Visit our interview platform: ${landingPageUrl}
2. Enter the session code: ${session.id}
3. Complete your registration
4. Begin the interview process

Technical Requirements:
- Stable internet connection
- Working webcam and microphone
- Quiet environment
- Chrome/Firefox browser (latest version)

Important Guidelines:
- Ensure good lighting and clear audio
- Dress professionally
- Have your resume handy for reference
- Complete the interview in one sitting
- Answer all questions thoroughly and professionally

If you encounter any technical issues, please contact our support team immediately.

We look forward to your participation.

Best regards,
${profile?.name}
${profile?.company}
`);

      // Send emails to all students in the session using a single mailto link
      const allEmails = session.studentEmails.join(',');
      window.location.href = `mailto:${allEmails}?subject=${subject}&body=${body}`;
      
      // Mark session as emails sent
      setSessions(prev => prev.map(s => {
        if (s.id === session.id) {
          return { ...s, emailsSent: true };
        }
        return s;
      }));

      // Show success message
      alert('Email client opened with all recipients. Please send the email to complete the process.');
      
    } catch (error) {
      console.error('Failed to send emails:', error);
      alert('Failed to send emails. Please try again.');
    } finally {
      setSendingEmails(false);
    }
  };

  const toggleCandidateSelection = (sessionId: string, item: string) => {
    setSelectedCandidates(prev => {
      const sessionSelections = prev[sessionId] || new Set();
      const newSelections = new Set(sessionSelections);
      
      if (newSelections.has(item)) {
        newSelections.delete(item);
      } else {
        newSelections.add(item);
      }
      
      return {
        ...prev,
        [sessionId]: newSelections
      };
    });
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const value = e.target.value;
    setEmailError('');
    setNewEmail(value);
  };

  const sendQualificationEmails = async (session: Session) => {
    setProcessingSession(session.id);
    try {
      const selectedRegs = selectedCandidates[session.id] || new Set();
      const feedbacks = sessionFeedbacks[session.id] || [];
      
      // Separate qualified and non-qualified candidates
      const qualifiedCandidates = feedbacks.filter(f => selectedRegs.has(f.registerNumber));
      const nonQualifiedCandidates = feedbacks.filter(f => !selectedRegs.has(f.registerNumber));
      
      // Send emails to qualified candidates
      for (const candidate of qualifiedCandidates) {
        if (candidate.email) {
          const subject = encodeURIComponent(`Congratulations! Qualified for Next Round - Mockello Interview`);
          const body = encodeURIComponent(
`Dear ${candidate.name},

Congratulations! We are pleased to inform you that you have been selected to proceed to the next round of interviews with ${profile?.company}.

Best regards,
${profile?.name}
${profile?.company}`
          );
          window.location.href = `mailto:${candidate.email}?subject=${subject}&body=${body}`;
          // Add a small delay between emails
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      // Send emails to non-qualified candidates
      for (const candidate of nonQualifiedCandidates) {
        if (candidate.email) {
          const subject = encodeURIComponent(`Interview Results - Mockello`);
          const body = encodeURIComponent(
`Dear ${candidate.name},

Thank you for participating in the interview process with ${profile?.company}.

While we were impressed with your profile, we regret to inform you that we will not be moving forward with your application at this time.

We wish you the best in your future endeavors.

Best regards,
${profile?.name}
${profile?.company}`
          );
          window.location.href = `mailto:${candidate.email}?subject=${subject}&body=${body}`;
          // Add a small delay between emails
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
      
      alert('All emails have been processed. Please check your email client.');
    } catch (error) {
      console.error('Error sending qualification emails:', error);
      alert('Failed to send some emails. Please try again.');
    } finally {
      setProcessingSession(null);
      setShowVenueModal(false);
    }
  };

  const FeedbackCard = ({ feedback, rank }: { feedback: FeedbackData; rank: number }) => {
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const isSelected = selectedCandidates[feedback.sessionId]?.has(feedback.registerNumber) || false;

    // Filter out sensitive information from feedback
    const filteredFeedback = feedback.feedback
      .split('\n')
      .filter(line => 
        !line.toLowerCase().includes('hiring recommendation') && 
        !line.toLowerCase().includes('physical presentation') &&
        !line.toLowerCase().includes('recommendation:') &&
        !line.toLowerCase().includes('appearance:') &&
        !line.toLowerCase().includes('attire:') &&
        !line.toLowerCase().includes('dress code:')
      )
      .join('\n');

    return (
      <>
        <div 
          className={`mt-4 p-4 bg-black/30 border ${
            isSelected ? 'border-[#BE185D]' : 'border-[#BE185D]/20'
          } rounded-xl transition-all duration-300 hover:border-[#BE185D]/40`}
        >
          <div className="grid grid-cols-8 gap-4 items-center">
            <div className="text-center">
              <div className={`text-lg font-bold ${
                rank === 1 ? 'text-yellow-500' :
                rank === 2 ? 'text-gray-400' :
                rank === 3 ? 'text-amber-700' :
                'text-gray-600'
              }`}>
                #{rank}
              </div>
            </div>
            <div className="col-span-2">
              <p className="text-white font-medium">{feedback.name}</p>
              <p className="text-gray-400 text-sm">{feedback.registerNumber}</p>
            </div>
            <div className="text-center">
              <p className="text-[#BE185D] font-bold text-xl">{feedback.performancePercentage}%</p>
              <p className="text-gray-400 text-xs">Performance</p>
            </div>
            <div className="text-center">
              <p className="text-white font-medium">{feedback.transcriptionCount}</p>
              <p className="text-gray-400 text-xs">Responses</p>
            </div>
            <div className="text-center">
              <p className="text-white font-medium">{feedback.totalWords}</p>
              <p className="text-gray-400 text-xs">Words</p>
            </div>
            <div className="text-center">
              <button
                onClick={() => setShowFeedbackModal(true)}
                className="px-3 py-1 bg-[#BE185D]/20 text-[#BE185D] rounded-lg hover:bg-[#BE185D]/30 transition-colors text-sm"
              >
                View Feedback
              </button>
            </div>
            <div className="text-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleCandidateSelection(feedback.sessionId, feedback.registerNumber);
                }}
                className={`p-2 rounded-full transition-colors ${
                  isSelected 
                    ? 'bg-[#BE185D] text-white' 
                    : 'bg-[#BE185D]/20 text-[#BE185D] hover:bg-[#BE185D]/30'
                }`}
              >
                {isSelected ? '✓' : ''}
              </button>
            </div>
          </div>
        </div>

        {/* Feedback Modal */}
        {showFeedbackModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-black/90 p-8 rounded-2xl border border-[#BE185D]/20 max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden flex flex-col"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-[#BE185D] mb-1">{feedback.name}</h2>
                  <p className="text-gray-400">{feedback.registerNumber}</p>
                </div>
                <div className="text-3xl font-bold text-[#BE185D]">
                  {feedback.performancePercentage}%
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-black/20 p-4 rounded-lg border border-[#BE185D]/10">
                  <p className="text-gray-400 text-sm">Total Responses</p>
                  <p className="text-2xl font-bold text-white">{feedback.transcriptionCount}</p>
                </div>
                <div className="bg-black/20 p-4 rounded-lg border border-[#BE185D]/10">
                  <p className="text-gray-400 text-sm">Words Spoken</p>
                  <p className="text-2xl font-bold text-white">{feedback.totalWords}</p>
                </div>
                <div className="bg-black/20 p-4 rounded-lg border border-[#BE185D]/10">
                  <p className="text-gray-400 text-sm">Interview Date</p>
                  <p className="text-lg font-bold text-white">{feedback.interviewDate}</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="bg-black/20 p-6 rounded-xl border border-[#BE185D]/10">
                  <h3 className="text-lg font-semibold text-[#BE185D] mb-4">Feedback Summary</h3>
                  <p className="text-white whitespace-pre-line">{filteredFeedback}</p>
                </div>
              </div>

              <div className="flex justify-end mt-6 pt-4 border-t border-[#BE185D]/10">
                <button
                  onClick={() => setShowFeedbackModal(false)}
                  className="px-6 py-3 text-gray-400 hover:text-white transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </>
    );
  };

  const SessionCard = ({ session }: { session: Session }) => {
    const feedbacks = sessionFeedbacks[session.id] || [];
    const selectedCount = (selectedCandidates[session.id] || new Set()).size;

    return (
      <div className="flex flex-col gap-6 relative">
        {/* Session Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-black/30 p-4 rounded-xl border border-[#BE185D]/20">
          <div>
            <div className="font-mono text-lg text-white break-all">
              {session.id}
            </div>
            <div className="text-sm text-[#BE185D] mt-1">
              Role: {session.role}
            </div>
          </div>
          <button
            onClick={() => navigator.clipboard.writeText(session.id)}
            className="px-4 py-2 bg-[#BE185D]/20 text-[#BE185D] rounded-lg hover:bg-[#BE185D]/30 transition-colors whitespace-nowrap"
          >
            Copy ID
          </button>
        </div>

        {/* Email Selection Section */}
        <div className="bg-black/30 p-4 rounded-xl border border-[#BE185D]/20">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-[#BE185D]">Email Recipients</h3>
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  const allEmails = session.studentEmails;
                  const currentSelected = selectedCandidates[session.id] || new Set();
                  
                  if (currentSelected.size === allEmails.length) {
                    setSelectedCandidates(prev => ({
                      ...prev,
                      [session.id]: new Set()
                    }));
                  } else {
                    setSelectedCandidates(prev => ({
                      ...prev,
                      [session.id]: new Set(allEmails)
                    }));
                  }
                }}
                className="px-3 py-1.5 bg-[#BE185D]/20 text-[#BE185D] rounded-lg hover:bg-[#BE185D]/30 transition-colors text-sm"
              >
                {selectedCount === session.studentEmails.length ? 'Unselect All' : 'Select All'}
              </button>
              <div className="text-sm text-gray-400">
                {selectedCount} of {session.studentEmails.length}
              </div>
            </div>
          </div>

          <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
            {session.studentEmails.map((email) => {
              const feedback = feedbacks.find(f => f.email === email);
              return (
                <div 
                  key={email}
                  className={`p-3 rounded-lg border ${
                    selectedCandidates[session.id]?.has(email)
                      ? 'border-[#BE185D] bg-[#BE185D]/10'
                      : 'border-[#BE185D]/20 bg-black/20'
                  } flex items-center justify-between transition-all duration-200`}
                >
                  <div className="flex items-center gap-3">
                    {feedback?.registerNumber && (
                      <span className="text-[#BE185D] text-sm font-mono">{feedback.registerNumber}</span>
                    )}
                    <span className="text-white">{email}</span>
                  </div>
                  <button
                    onClick={() => toggleCandidateSelection(session.id, email)}
                    className={`p-2 rounded-full transition-colors ${
                      selectedCandidates[session.id]?.has(email)
                        ? 'bg-[#BE185D] text-white'
                        : 'bg-[#BE185D]/20 text-[#BE185D] hover:bg-[#BE185D]/30'
                    }`}
                  >
                    {selectedCandidates[session.id]?.has(email) ? '✓' : ''}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Interview Results Section */}
        <div className="bg-black/30 p-4 rounded-xl border border-[#BE185D]/20">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-[#BE185D]">Interview Results</h3>
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  const allRegs = feedbacks.map(f => f.registerNumber);
                  const currentSelected = selectedCandidates[session.id] || new Set();
                  
                  if (currentSelected.size === allRegs.length) {
                    setSelectedCandidates(prev => ({
                      ...prev,
                      [session.id]: new Set()
                    }));
                  } else {
                    setSelectedCandidates(prev => ({
                      ...prev,
                      [session.id]: new Set(allRegs)
                    }));
                  }
                }}
                className="px-3 py-1.5 bg-[#BE185D]/20 text-[#BE185D] rounded-lg hover:bg-[#BE185D]/30 transition-colors text-sm"
              >
                {selectedCount === feedbacks.length ? 'Unselect All' : 'Select All'}
              </button>
              <div className="text-sm text-gray-400">
                {selectedCount} of {feedbacks.length}
              </div>
            </div>
          </div>
          
          <div className="space-y-2 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
            {isLoadingFeedback ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#BE185D]"></div>
              </div>
            ) : feedbacks.length > 0 ? (
              feedbacks.map((feedback, index) => (
                <FeedbackCard 
                  key={feedback.registerNumber} 
                  feedback={feedback}
                  rank={index + 1}
                />
              ))
            ) : (
              <div className="text-center py-6 text-gray-400">
                No feedback available
              </div>
            )}
          </div>
        </div>

        {/* Fixed Email Send Section */}
        {selectedCount > 0 && (
          <div className="mt-4 bg-black/30 p-4 rounded-xl border border-[#BE185D]/20 backdrop-blur-sm sticky bottom-4">
            <div className="flex justify-end">
              <button
                onClick={() => {
                  const selectedEmails = Array.from(selectedCandidates[session.id] || new Set())
                    .map(item => {
                      if (item.includes('@')) return item;
                      const feedback = feedbacks.find(f => f.registerNumber === item);
                      return feedback?.email;
                    })
                    .filter(Boolean)
                    .join(',');

                  const selectedStudents = feedbacks
                    .filter(f => selectedCandidates[session.id]?.has(f.registerNumber))
                    .map(f => `${f.name} (${f.registerNumber})`)
                    .join('\n');

                  const subject = encodeURIComponent(`Next Round Interview Details - ${profile?.company}`);
                  const body = encodeURIComponent(
`Dear Candidate,

We hope this email finds you well. We are pleased to inform you that based on your performance in the initial Candidate evaluation interview round with Mockello, you have been selected to proceed to the next stage of our interview process.

Selected Candidates:
${selectedStudents}

We will be conducting the next round of interviews shortly and we request you to report to the following venue:
-enter venue here

Important Notes:
- Please carry a copy of your resume
- Bring valid government-issued photo identification
- Arrive at least 15 minutes before your scheduled time
- Dress code: Professional attire

If you have any questions or need to reschedule, please respond to this email at your earliest convenience.

Best regards,
${profile?.name}
${profile?.company}
`);
                  window.location.href = `mailto:${selectedEmails}?subject=${subject}&body=${body}`;
                }}
                className="px-6 py-3 bg-[#BE185D] text-white rounded-lg hover:bg-[#BE185D]/80 transition-colors whitespace-nowrap"
              >
                Send Emails to Selected Recipients
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const clearAllSessions = async () => {
    if (window.confirm('Are you sure you want to delete all session data? This action cannot be undone.')) {
      try {
        // Clear from Firebase
        const sessionRef = ref(database, 'keys/variable/sessionid');
        const feedbackRef = ref(database, 'interview_feedback');
        
        await set(sessionRef, null);  // Delete all session IDs
        await set(feedbackRef, null); // Delete all feedback data
        
        // Clear from local storage
        localStorage.removeItem('hrSessions');
        
        // Clear from state
        setSessions([]);
        setSessionFeedbacks({});
        setSelectedCandidates({});
        setLatestSession(null);
        
        alert('All session data has been successfully cleared.');
      } catch (error) {
        console.error('Error clearing sessions:', error);
        alert('Failed to clear some data. Please try again.');
      }
    }
  };

  // Add loading state while validating
  if (isValidating) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#BE185D] mb-4"></div>
          <p className="text-gray-400">Validating credentials...</p>
        </div>
      </div>
    );
  }

  if (!profile || !authKey) return null;

  return (
    <>
      <Head>
        <title>HR Dashboard - Mockello</title>
        <meta name="description" content="Manage your recruitment process with Mockello" />
      </Head>

      <main className="bg-black min-h-screen text-white overflow-hidden">
        {/* Background Effects */}
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#BE185D_0%,_transparent_25%)] opacity-20 animate-pulse"></div>
          <div className="absolute inset-0 bg-black bg-opacity-90"></div>
        </div>

        {/* Navbar */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-md border-b border-[#BE185D]/10">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-2xl font-bold">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#BE185D] to-white">Mockello</span>
              </Link>
              <div className="flex items-center gap-6">
                <button
                  onClick={clearAllSessions}
                  className="px-4 py-2 bg-red-600/20 text-red-500 rounded-lg hover:bg-red-600/30 transition-colors"
                >
                  Clear All Sessions
                </button>
                <button
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  className="text-[#BE185D] hover:text-white transition-colors"
                >
                  {isEditingProfile ? 'Cancel Edit' : 'Edit Profile'}
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Content */}
        <div className="relative pt-32 px-4">
          <div className="container mx-auto max-w-4xl">
            {/* Session Creation Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-gray-900/50 to-[#BE185D]/5 p-8 rounded-2xl border border-[#BE185D]/20 backdrop-blur-sm mb-8"
            >
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#BE185D] to-white">
                  Interview Sessions
                </h1>
                <button
                  onClick={() => setShowRoleSelection(true)}
                  className="px-6 py-3 bg-gradient-to-r from-[#BE185D] to-[#BE185D]/80 text-white rounded-full hover:shadow-[0_0_30px_-5px_#BE185D] transition-all duration-300"
                >
                  Create Interview Session
                </button>
              </div>

              {/* Session History */}
              <div className="space-y-4">
                {/* Newest Session */}
                {sessions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 rounded-xl bg-[#BE185D]/10 border-[#BE185D]/30 border"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-[#BE185D]">Latest Session</h3>
                      <div className="text-sm text-gray-400">
                        {formatDate(sessions[sessions.length - 1].createdAt)}
                      </div>
                    </div>
                    <SessionCard session={sessions[sessions.length - 1]} />
                  </motion.div>
                )}

                {/* Previous Sessions Dropdown */}
                {sessions.length > 1 && (
                  <div className="mt-8">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mb-4"
                    >
                      <button
                        onClick={() => setShowPreviousSessions(!showPreviousSessions)}
                        className="flex items-center justify-between w-full px-6 py-4 bg-black/30 border border-[#BE185D]/10 rounded-xl hover:border-[#BE185D]/30 transition-all duration-300"
                      >
                        <span className="text-lg font-semibold text-gray-300">Previous Sessions</span>
                        <span className={`transform transition-transform duration-300 ${showPreviousSessions ? 'rotate-180' : ''}`}>
                          ▼
                        </span>
                      </button>
                    </motion.div>

                    {showPreviousSessions && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4"
                      >
                        {sessions.slice(0, -1).reverse().map((session, index) => (
                          <motion.div
                            key={session.id}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="p-6 rounded-xl bg-black/30 border border-[#BE185D]/10"
                          >
                            <SessionCard session={session} />
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </div>
                )}

                {sessions.length === 0 && (
                  <div className="text-center text-gray-400 py-8">
                    No sessions created yet. Click the button above to create your first session.
                  </div>
                )}
              </div>
            </motion.div>

            {/* Profile Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-gray-900/50 to-[#BE185D]/5 p-8 rounded-2xl border border-[#BE185D]/20 backdrop-blur-sm mb-8"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#BE185D] to-white">
                  Profile Information
                </h2>
                <button
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  className="px-4 py-2 text-[#BE185D] hover:text-white transition-colors"
                >
                  {isEditingProfile ? 'Cancel Edit' : 'Edit Profile'}
                </button>
              </div>

              {isEditingProfile && editedProfile ? (
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-gray-300 mb-2">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      value={editedProfile.name}
                      onChange={(e) => setEditedProfile(prev => ({ ...prev!, name: e.target.value }))}
                      className="w-full px-4 py-3 bg-black/50 border border-[#BE185D]/20 rounded-lg focus:outline-none focus:border-[#BE185D] transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="dob" className="block text-gray-300 mb-2">Date of Birth</label>
                    <input
                      type="date"
                      id="dob"
                      value={editedProfile.dob}
                      onChange={(e) => setEditedProfile(prev => ({ ...prev!, dob: e.target.value }))}
                      className="w-full px-4 py-3 bg-black/50 border border-[#BE185D]/20 rounded-lg focus:outline-none focus:border-[#BE185D] transition-colors text-gray-300"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-gray-300 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      value={editedProfile.phone}
                      onChange={(e) => setEditedProfile(prev => ({ ...prev!, phone: e.target.value }))}
                      className="w-full px-4 py-3 bg-black/50 border border-[#BE185D]/20 rounded-lg focus:outline-none focus:border-[#BE185D] transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="company" className="block text-gray-300 mb-2">Company Name</label>
                    <input
                      type="text"
                      id="company"
                      value={editedProfile.company}
                      onChange={(e) => setEditedProfile(prev => ({ ...prev!, company: e.target.value }))}
                      className="w-full px-4 py-3 bg-black/50 border border-[#BE185D]/20 rounded-lg focus:outline-none focus:border-[#BE185D] transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 mb-2">Hiring Roles</label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={newRole}
                        onChange={(e) => setNewRole(e.target.value)}
                        className="flex-1 px-4 py-3 bg-black/50 border border-[#BE185D]/20 rounded-lg focus:outline-none focus:border-[#BE185D] transition-colors"
                        placeholder="Add a role"
                      />
                      <button
                        type="button"
                        onClick={addHiringRole}
                        className="px-4 py-2 bg-[#BE185D]/20 text-[#BE185D] rounded-lg hover:bg-[#BE185D]/30 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {editedProfile.hiringRoles.map((role, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-[#BE185D]/10 text-[#BE185D] rounded-full flex items-center gap-2"
                        >
                          {role}
                          <button
                            type="button"
                            onClick={() => removeHiringRole(index)}
                            className="text-[#BE185D] hover:text-white transition-colors"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full px-8 py-4 bg-gradient-to-r from-[#BE185D] to-[#BE185D]/80 text-white rounded-full hover:shadow-[0_0_30px_-5px_#BE185D] transition-all duration-300"
                  >
                    Save Changes
                  </button>
                </form>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-semibold text-[#BE185D] mb-2">Profile Information</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-400">Full Name</p>
                        <p className="text-white">{profile.name}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Date of Birth</p>
                        <p className="text-white">{profile.dob}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Phone Number</p>
                        <p className="text-white">{profile.phone}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Company</p>
                        <p className="text-white">{profile.company}</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-[#BE185D] mb-2">Hiring Roles</h2>
                    <div className="flex flex-wrap gap-2">
                      {profile.hiringRoles.map((role, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-[#BE185D]/10 text-[#BE185D] rounded-full"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </main>

      {/* Role Selection Modal */}
      {showRoleSelection && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-black/90 p-8 rounded-2xl border border-[#BE185D]/20 max-w-md w-full mx-4 relative"
          >
            <h2 className="text-2xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#BE185D] to-white">
              Select Interview Role
            </h2>
            
            {/* Email Input Section */}
            {selectedRole && (
              <>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-[#BE185D] mb-4">Add Participant Emails</h3>
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <input
                        type="email"
                        value={newEmail}
                        onChange={handleEmailChange}
                        placeholder="Enter email address"
                        className="flex-1 px-4 py-3 bg-black/50 border border-[#BE185D]/20 rounded-lg focus:outline-none focus:border-[#BE185D] transition-colors text-white placeholder-gray-500"
                      />
                      <button
                        onClick={() => {
                          if (newEmail && !emailError) {
                            setNewEmail('');
                            setEmailError('');
                            setTempEmails(prev => [...prev, newEmail]);
                          }
                        }}
                        className="px-4 py-2 bg-[#BE185D]/20 text-[#BE185D] rounded-lg hover:bg-[#BE185D]/30 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                    {emailError && (
                      <p className="text-red-500 text-sm">{emailError}</p>
                    )}
                  </div>
                  
                  {/* Added Emails List */}
                  <div className="mt-4 max-h-[200px] overflow-y-auto custom-scrollbar">
                    {tempEmails.map((email, index) => (
                      <div key={index} className="flex items-center justify-between py-2 px-3 bg-black/20 rounded-lg mb-2">
                        <span className="text-gray-300">{email}</span>
                        <button
                          onClick={() => setTempEmails(prev => prev.filter((_, i) => i !== index))}
                          className="text-[#BE185D] hover:text-white transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Create and Send Invitations Button */}
                <button
                  onClick={() => {
                    if (tempEmails.length > 0) {
                      createSession(tempEmails);
                      setTempEmails([]);
                      setShowRoleSelection(false);
                    } else {
                      alert('Please add at least one email address');
                    }
                  }}
                  className="w-full px-6 py-3 bg-[#BE185D] text-white rounded-lg hover:bg-[#BE185D]/80 transition-colors"
                >
                  Create Session & Send Invitations
                </button>
              </>
            )}

            {/* Role Selection List */}
            {!selectedRole && (
              <>
                <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
                  <div className="space-y-3 pr-2">
                    {availableRoles.map((role) => (
                      <button
                        key={role}
                        onClick={() => setSelectedRole(role)}
                        className={`w-full px-6 py-4 rounded-xl border text-left ${
                          selectedRole === role
                            ? 'bg-[#BE185D] border-[#BE185D] text-white'
                            : 'border-[#BE185D]/20 hover:border-[#BE185D] text-gray-300 hover:text-white'
                        } transition-all duration-300`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            <button
              onClick={() => {
                setShowRoleSelection(false);
                setSelectedRole('');
                setTempEmails([]);
              }}
              className="w-full px-6 py-3 mt-6 text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
          </motion.div>
        </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(190, 24, 93, 0.1);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(190, 24, 93, 0.3);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(190, 24, 93, 0.5);
        }
      `}</style>
    </>
  );
} 