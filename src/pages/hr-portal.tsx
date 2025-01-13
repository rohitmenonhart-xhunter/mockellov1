import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { getDatabase, ref, get } from 'firebase/database';
import { initializeApp } from 'firebase/app';

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

export default function HRPortal() {
  const router = useRouter();
  const [profile, setProfile] = useState<HRProfile>({
    name: '',
    dob: '',
    phone: '',
    company: '',
    hiringRoles: []
  });
  const [authKey, setAuthKey] = useState('');
  const [newRole, setNewRole] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const addHiringRole = () => {
    if (newRole.trim()) {
      setProfile(prev => ({
        ...prev,
        hiringRoles: [...prev.hiringRoles, newRole.trim()]
      }));
      setNewRole('');
    }
  };

  const removeHiringRole = (index: number) => {
    setProfile(prev => ({
      ...prev,
      hiringRoles: prev.hiringRoles.filter((_, i) => i !== index)
    }));
  };

  const validateKey = async (key: string): Promise<boolean> => {
    try {
      const keysRef = ref(database, 'hr_auth_keys');
      const snapshot = await get(keysRef);
      
      if (snapshot.exists()) {
        const keys = snapshot.val();
        return Object.values(keys).some((k: any) => 
          k.value === key && k.active === true
        );
      }
      return false;
    } catch (error) {
      console.error('Error validating key:', error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Validate required fields
      if (!profile.name || !profile.dob || !profile.phone || !profile.company) {
        setError('Please fill in all required fields');
        return;
      }

      // Validate auth key
      if (!authKey) {
        setError('Please enter your authentication key');
        return;
      }

      const isValidKey = await validateKey(authKey);
      if (!isValidKey) {
        setError('Invalid or inactive authentication key');
        return;
      }

      // Store profile and auth key in localStorage
      localStorage.setItem('hrProfile', JSON.stringify(profile));
      localStorage.setItem('hrAuthKey', authKey);

      // Redirect to dashboard
      router.push('/hr-dashboard');
    } catch (error) {
      console.error('Error during registration:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>HR Portal - Mockello</title>
        <meta name="description" content="HR registration portal for Mockello" />
      </Head>

      <main className="bg-black min-h-screen text-white">
        {/* Background Effects */}
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#BE185D_0%,_transparent_25%)] opacity-20 animate-pulse"></div>
          <div className="absolute inset-0 bg-black bg-opacity-90"></div>
        </div>

        <div className="relative container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-xl mx-auto"
          >
            <h1 className="text-3xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#BE185D] to-white">
              HR Registration
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-black/30 p-6 rounded-xl border border-[#BE185D]/20">
                <h2 className="text-xl font-semibold text-[#BE185D] mb-6">Personal Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-gray-300 mb-2">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 bg-black/50 border border-[#BE185D]/20 rounded-lg focus:outline-none focus:border-[#BE185D] transition-colors text-white"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="dob" className="block text-gray-300 mb-2">Date of Birth</label>
                    <input
                      type="date"
                      id="dob"
                      value={profile.dob}
                      onChange={(e) => setProfile(prev => ({ ...prev, dob: e.target.value }))}
                      className="w-full px-4 py-3 bg-black/50 border border-[#BE185D]/20 rounded-lg focus:outline-none focus:border-[#BE185D] transition-colors text-white"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-gray-300 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                      className="w-full px-4 py-3 bg-black/50 border border-[#BE185D]/20 rounded-lg focus:outline-none focus:border-[#BE185D] transition-colors text-white"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-gray-300 mb-2">Company Name</label>
                    <input
                      type="text"
                      id="company"
                      value={profile.company}
                      onChange={(e) => setProfile(prev => ({ ...prev, company: e.target.value }))}
                      className="w-full px-4 py-3 bg-black/50 border border-[#BE185D]/20 rounded-lg focus:outline-none focus:border-[#BE185D] transition-colors text-white"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="bg-black/30 p-6 rounded-xl border border-[#BE185D]/20">
                <h2 className="text-xl font-semibold text-[#BE185D] mb-6">Hiring Roles</h2>
                
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                      placeholder="Add a hiring role"
                      className="flex-1 px-4 py-3 bg-black/50 border border-[#BE185D]/20 rounded-lg focus:outline-none focus:border-[#BE185D] transition-colors text-white placeholder-gray-500"
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
                    {profile.hiringRoles.map((role, index) => (
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
              </div>

              <div className="bg-black/30 p-6 rounded-xl border border-[#BE185D]/20">
                <h2 className="text-xl font-semibold text-[#BE185D] mb-6">Authentication</h2>
                
                <div>
                  <label htmlFor="authKey" className="block text-gray-300 mb-2">Authentication Key</label>
                  <input
                    type="text"
                    id="authKey"
                    value={authKey}
                    onChange={(e) => setAuthKey(e.target.value)}
                    placeholder="Enter your authentication key"
                    className="w-full px-4 py-3 bg-black/50 border border-[#BE185D]/20 rounded-lg focus:outline-none focus:border-[#BE185D] transition-colors text-white placeholder-gray-500"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-8 py-4 bg-gradient-to-r from-[#BE185D] to-[#BE185D]/80 text-white rounded-full hover:shadow-[0_0_30px_-5px_#BE185D] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Validating...
                  </div>
                ) : (
                  'Access Dashboard'
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </main>
    </>
  );
} 