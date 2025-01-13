import { motion } from 'framer-motion';
import Head from 'next/head';
import Link from 'next/link';
import Footer from '../components/Footer';

export default function FeaturesPage() {
  return (
    <>
      <Head>
        <title>Features - Mockello</title>
        <meta name="description" content="Explore Mockello's powerful features for AI-driven candidate evaluation" />
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#BE185D] to-white">
                Features
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Discover how Mockello revolutionizes your recruitment process with cutting-edge AI technology.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {[
                {
                  title: "AI-Powered Interviews",
                  description: "Conduct intelligent interviews that adapt to candidate responses in real-time.",
                  icon: "🤖"
                },
                {
                  title: "Automated Evaluation",
                  description: "Get instant, comprehensive assessments of candidate performance.",
                  icon: "📊"
                },
                {
                  title: "Smart Analytics",
                  description: "Access detailed insights and analytics about your recruitment process.",
                  icon: "📈"
                },
                {
                  title: "Scalable Solution",
                  description: "Handle multiple interviews simultaneously without compromising quality.",
                  icon: "🚀"
                },
                {
                  title: "Custom Integration",
                  description: "Seamlessly integrate with your existing HR systems and workflows.",
                  icon: "🔄"
                },
                {
                  title: "Global Reach",
                  description: "Conduct interviews across time zones and languages effortlessly.",
                  icon: "🌍"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-gray-900/50 to-[#BE185D]/5 p-8 rounded-2xl border border-[#BE185D]/20 backdrop-blur-sm"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-center"
            >
              <Link href="/landing" className="inline-flex items-center justify-center px-8 py-4 font-semibold text-white bg-gradient-to-r from-[#BE185D] to-[#BE185D]/80 rounded-full hover:shadow-[0_0_30px_-5px_#BE185D] transition-all duration-300">
                Try Demo
              </Link>
            </motion.div>
          </div>
        </div>

        <Footer />
      </main>
    </>
  );
} 