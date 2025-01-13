import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function ReschedulePage() {
  const router = useRouter();

  useEffect(() => {
    // Clear any remaining interview data
    localStorage.removeItem('userInfo');
    localStorage.removeItem('transcriptions');
    localStorage.removeItem('interviewSummary');
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-xl p-8">
        <div className="text-center">
          <div className="mb-6">
            <svg className="mx-auto h-12 w-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-4">
            Good Decision!
          </h2>
          
          <div className="space-y-4 text-gray-300">
            <p>
              Thank you for choosing to reschedule your interview. This was a professional decision that shows your commitment to presenting yourself well.
            </p>
            
            <div className="bg-gray-700 p-4 rounded-lg my-6">
              <p className="text-green-400 font-semibold mb-2">✓ Your Performance Score is Protected</p>
              <p className="text-sm">
                By rescheduling instead of proceeding with informal attire, your performance metrics will not be affected. This shows good judgment!
              </p>
            </div>
            
            <div className="text-left bg-gray-700 p-4 rounded-lg">
              <p className="font-semibold mb-2">For Your Next Interview:</p>
              <ul className="list-disc list-inside text-sm space-y-2">
                <li>Please ensure you are in formal attire</li>
                <li>For men: A plain formal shirt is recommended</li>
                <li>For women: Churidar, Kurti (with or without shawl) is appropriate</li>
                <li>Being well-dressed contributes 7-9% to your overall performance score</li>
                <li>Professional attire shows your commitment to the interview process</li>
              </ul>
            </div>
          </div>

          <div className="mt-8">
            <button
              onClick={() => router.push('/')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 