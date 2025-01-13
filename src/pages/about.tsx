import { motion } from 'framer-motion';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Footer from '../components/Footer';

export default function AboutPage() {
  return (
    <>
      <Head>
        <title>About - Mockello</title>
        <meta name="description" content="Learn about Mockello's mission to transform recruitment through AI innovation" />
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
            </div>
          </div>
        </nav>

        {/* Content */}
        <div className="relative pt-32 px-4">
          <div className="container mx-auto">
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-20"
            >
              <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#BE185D] to-white">
                About Mockello
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                We&apos;re on a mission to revolutionize the recruitment industry through artificial intelligence and innovation.
              </p>
            </motion.div>

            {/* Mission Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-32"
            >
              <div className="space-y-6 max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold text-[#BE185D]">Our Mission</h2>
                <p className="text-gray-300 leading-relaxed">
                  At Mockello, we believe that recruitment should be efficient, fair, and accessible to all. Our AI-powered platform is designed to eliminate bias, reduce costs, and help companies find the best talent quickly and effectively.
                </p>
              </div>
            </motion.div>

            {/* Team Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-32"
              id="team"
            >
              <h2 className="text-3xl font-bold text-center mb-12">Our Leadership Team</h2>
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {[
                  {
                    name: "C Rohit",
                    roles: ["CEO", "CTO", "CFO", "Product Head"],
                    bio: "Visionary leader and technical mastermind driving Mockello's mission to revolutionize recruitment through AI innovation. Leading multiple aspects of the company from technology and product development to financial strategy."
                  },
                  {
                    name: "Prem Kumar",
                    roles: ["Managing Officer (Field)"],
                    bio: "Expert in field operations and client success management, ensuring smooth deployment and customer satisfaction."
                  }
                ].map((member, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="bg-gradient-to-br from-gray-900/50 to-[#BE185D]/5 p-8 rounded-2xl border border-[#BE185D]/20 backdrop-blur-sm"
                  >
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#BE185D] to-[#BE185D]/50 mx-auto mb-6 flex items-center justify-center text-white text-2xl font-bold">
                      {member.name.charAt(0)}
                    </div>
                    <h3 className="text-xl font-semibold text-center mb-2">{member.name}</h3>
                    <div className="flex flex-wrap justify-center gap-2 mb-4">
                      {member.roles.map((role, i) => (
                        <span key={i} className="text-[#BE185D] text-center px-3 py-1 bg-[#BE185D]/10 rounded-full">
                          {role}
                        </span>
                      ))}
                    </div>
                    <p className="text-gray-400 text-center">{member.bio}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* CTA Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-center"
            >
              <h2 className="text-3xl font-bold mb-6">Join Us in Transforming Recruitment</h2>
              <Link
                href="/careers"
                className="inline-flex items-center justify-center px-8 py-4 font-semibold text-white bg-gradient-to-r from-[#BE185D] to-[#BE185D]/80 rounded-full hover:shadow-[0_0_30px_-5px_#BE185D] transition-all duration-300"
              >
                View Career Opportunities
              </Link>
            </motion.div>
          </div>
        </div>

        <Footer />
      </main>
    </>
  );
} 