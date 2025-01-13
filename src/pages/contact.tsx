import { motion } from 'framer-motion';
import Head from 'next/head';
import Link from 'next/link';
import Footer from '../components/Footer';

export default function ContactPage() {
  return (
    <>
      <Head>
        <title>Contact Us - Mockello</title>
        <meta name="description" content="Get in touch with Mockello - We're here to help transform your recruitment process" />
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
          <div className="container mx-auto max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#BE185D] to-white">
                Get in Touch
              </h1>
              <p className="text-xl text-gray-300">
                We&apos;re excited to hear from you! Our team is ready to assist you with any questions about our AI-powered recruitment platform.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-gray-900/50 to-[#BE185D]/5 p-12 rounded-2xl border border-[#BE185D]/20 backdrop-blur-sm"
            >
              <div className="space-y-8">
                <div className="text-center">
                  <p className="text-xl text-gray-300 mb-8">
                    Reach out to us through any of these channels, and we&apos;ll respond within 24 hours:
                  </p>
                  
                  <div className="space-y-6">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      className="flex items-center justify-center gap-4 text-xl"
                    >
                      <span className="text-[#BE185D] text-2xl">📞</span>
                      <a href="tel:+917550000805" className="text-white hover:text-[#BE185D] transition-colors">
                        +91 755 000 0805
                      </a>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 }}
                      className="flex items-center justify-center gap-4 text-xl"
                    >
                      <span className="text-[#BE185D] text-2xl">✉️</span>
                      <a href="mailto:contactrohitmenon@gmail.com" className="text-white hover:text-[#BE185D] transition-colors">
                        contactrohitmenon@gmail.com
                      </a>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-center mt-12 text-gray-300"
            >
              <p className="text-lg">
                Whether you&apos;re interested in our services or need support, we&apos;re here to help.
              </p>
            </motion.div>
          </div>
        </div>

        <Footer />
      </main>
    </>
  );
} 