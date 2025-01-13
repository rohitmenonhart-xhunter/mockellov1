import { motion } from 'framer-motion';
import Head from 'next/head';
import Link from 'next/link';
import { useEffect } from 'react';

export default function InterviewComplete() {
  // Clear session data on mount
  useEffect(() => {
    localStorage.removeItem('transcriptions');
    localStorage.removeItem('sessionTimeLeft');
    localStorage.removeItem('sessionStartTime');
  }, []);

  return (
    <>
      <Head>
        <title>Interview Complete - Mockello</title>
        <meta name="description" content="Your interview has been completed successfully" />
      </Head>

      <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
        {/* Background Effects */}
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#BE185D_0%,_transparent_25%)] opacity-20 animate-pulse"></div>
          <div className="absolute inset-0 bg-black bg-opacity-90"></div>
        </div>

        <motion.div 
          className="relative z-10 max-w-2xl w-full bg-gray-900/50 backdrop-blur-lg p-8 rounded-lg shadow-xl text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="w-20 h-20 bg-green-500 rounded-full mx-auto mb-6 flex items-center justify-center"
          >
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </motion.div>

          <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-white bg-clip-text text-transparent">
            Interview Completed Successfully!
          </h1>

          <p className="text-gray-300 mb-6 text-lg">
            Thank you for completing your interview with Mockello. Your responses have been recorded and will be reviewed by our HR team.
          </p>

          <div className="bg-gray-800/50 p-6 rounded-lg mb-8">
            <h2 className="text-xl font-semibold mb-4 text-pink-400">What's Next?</h2>
            <ul className="text-left text-gray-300 space-y-3">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                Your interview performance will be evaluated by our HR team
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                If selected, you will be contacted for a live HR interview
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                The results will be communicated through your registered contact details
              </li>
            </ul>
          </div>

          <Link 
            href="/"
            className="inline-block bg-pink-600 hover:bg-pink-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            Return to Home
          </Link>
        </motion.div>
      </main>
    </>
  );
} 