import { motion } from 'framer-motion';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 }
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function MainLandingPage() {
  return (
    <>
      <Head>
        <title>Mockello - AI-Powered Candidate Evaluation Platform</title>
        <meta name="description" content="Transform your hiring process with Mockello - The most advanced AI-powered candidate evaluation platform that saves time and costs in recruitment" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="bg-black min-h-screen text-white overflow-hidden">
        {/* Enhanced Animated Background */}
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#BE185D_0%,_transparent_25%)] opacity-20 animate-pulse"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_#BE185D_0%,_transparent_25%)] opacity-10 animate-pulse delay-75"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,_#BE185D_0%,_transparent_25%)] opacity-10 animate-pulse delay-150"></div>
          <div className="absolute inset-0 bg-black bg-opacity-90"></div>
          
          {/* Animated Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#BE185D1A_1px,transparent_1px),linear-gradient(to_bottom,#BE185D1A_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        </div>

        {/* Navbar */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-md border-b border-[#BE185D]/10">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-2xl font-bold"
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#BE185D] to-white">Mockello</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-6"
              >
                <Link href="/landing" className="text-white/80 hover:text-white transition-colors">
                  Try Demo
                </Link>
                <Link href="/contact" className="px-4 py-2 rounded-full border border-[#BE185D] text-[#BE185D] hover:bg-[#BE185D] hover:text-white transition-all">
                  Contact Us
                </Link>
              </motion.div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="relative min-h-screen flex items-center justify-center pt-20">
          {/* Interview Environment Animations */}
          <div className="absolute inset-0 pointer-events-none z-20">
            {/* Animated Interview Cards */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-48 h-32 rounded-lg"
                style={{
                  background: 'linear-gradient(45deg, rgba(190,24,93,0.1) 0%, rgba(190,24,93,0.05) 100%)',
                  border: '1px solid rgba(190,24,93,0.2)',
                  backdropFilter: 'blur(4px)',
                  top: i < 3 ? '25%' : '65%',
                  left: `${15 + (i % 3) * 35}%`,
                  zIndex: 3 - (i % 3)
                }}
                initial={{ 
                  opacity: 0,
                  y: -50,
                  scale: 0.8
                }}
                animate={{ 
                  opacity: [0.3, 0.5, 0.3],
                  y: [-20, 0, -20],
                  scale: [0.8, 1, 0.8]
                }}
                transition={{
                  duration: 6,
                  delay: i * 0.8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                {/* Card Content Lines */}
                <div className="p-4 space-y-2">
                  <motion.div 
                    className="h-2 w-3/4 bg-[#BE185D]/20 rounded"
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <motion.div 
                    className="h-2 w-1/2 bg-[#BE185D]/20 rounded"
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 2, delay: 0.3, repeat: Infinity }}
                  />
                </div>
              </motion.div>
            ))}
              </div>

          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-[#BE185D]/20 z-10"></div>
          {/* Enhanced Animated Background with Shooting Stars */}
          <motion.div 
            className="absolute inset-0 opacity-30"
            animate={{
              background: [
                'radial-gradient(circle at 50% 50%, #BE185D 0%, transparent 50%)',
                'radial-gradient(circle at 60% 40%, #BE185D 0%, transparent 50%)',
                'radial-gradient(circle at 40% 60%, #BE185D 0%, transparent 50%)',
                'radial-gradient(circle at 50% 50%, #BE185D 0%, transparent 50%)'
              ]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />
          <div className="container mx-auto px-4 z-20 text-center relative">
            <motion.div
              initial="initial"
              animate="animate"
              variants={stagger}
              className="relative"
            >
              {/* Shooting Stars Animation */}
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-[2px] h-[2px] bg-white"
                  initial={{ 
                    top: `${Math.random() * -20}%`,
                    left: `${Math.random() * 100}%`,
                    opacity: 0,
                    scale: 0
                  }}
                  animate={{ 
                    top: '120%',
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.8,
                    ease: "linear"
                  }}
                  style={{
                    boxShadow: '0 0 20px 2px #BE185D'
                  }}
                />
              ))}
              
              <motion.h1 
                variants={fadeInUp}
                transition={{ duration: 0.6 }}
                className="text-7xl md:text-8xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#BE185D] to-white relative"
              >
                Mockello
                {/* Animated Underline */}
                <motion.div 
                  className="absolute -bottom-2 left-1/2 h-1 bg-[#BE185D]"
                  initial={{ width: 0, x: '-50%' }}
                  animate={{ width: '60%' }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </motion.h1>

              <motion.p 
                variants={fadeInUp}
                transition={{ duration: 0.6 }}
                className="text-2xl md:text-3xl mb-8 text-gray-300 font-light"
              >
                Revolutionize Your Recruitment Process with 
                <motion.span 
                  className="text-[#BE185D] font-semibold inline-block mx-2"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.8, 1, 0.8]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    repeatDelay: 1.5,
                    ease: "easeInOut"
                  }}
                > AI-Driven</motion.span> Evaluation
              </motion.p>

              {/* Virtual Interview Room Animation */}
              <motion.div
                className="absolute -z-10 w-[200%] h-[200%] left-[-50%] top-[-50%]"
                style={{
                  background: 'radial-gradient(circle at center, transparent 30%, #000 70%)',
                  opacity: 0.4
                }}
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 360]
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />

              <motion.div 
                variants={fadeInUp}
                transition={{ duration: 0.6 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12"
              >
                <Link href="/hr-portal" className="group relative inline-flex items-center justify-center px-8 py-4 font-semibold tracking-wide text-white transition-all duration-500 ease-in-out transform bg-gradient-to-r from-[#BE185D] to-[#BE185D]/80 rounded-full hover:scale-105 hover:shadow-[0_0_30px_-5px_#BE185D] overflow-hidden">
                  <span className="absolute w-0 h-0 transition-all duration-500 ease-in-out bg-white rounded-full group-hover:w-80 group-hover:h-80 opacity-10"></span>
                  <span className="relative">HR Portal</span>
                </Link>
                <Link href="/student-portal" className="group inline-flex items-center justify-center px-8 py-4 font-semibold tracking-wide text-[#BE185D] transition-all duration-300 ease-in-out transform border border-[#BE185D] rounded-full hover:bg-[#BE185D] hover:text-white">
                  Student Portal
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Value Proposition Section */}
        <section className="relative py-32 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black to-[#BE185D]/10"></div>
          <div className="container mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-20"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Why Choose <span className="text-[#BE185D]">Mockello</span>?
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-transparent via-[#BE185D] to-transparent mx-auto"></div>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "90% Time Savings",
                  description: "Deploy just one HR representative instead of ten. Focus only on top-ranked candidates, dramatically reducing recruitment time.",
                  icon: "⚡"
                },
                {
                  title: "Cost Efficiency",
                  description: "Minimize travel expenses and recruitment team size. Perfect for bulk hiring and campus recruitment drives.",
                  icon: "💰"
                },
                {
                  title: "Objective Evaluation",
                  description: "AI-driven assessments ensure unbiased, consistent candidate evaluations across communication, confidence, and competencies.",
                  icon: "⚖️"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.5 }}
                  whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                  className="group relative bg-gradient-to-br from-gray-900/50 to-[#BE185D]/5 p-8 rounded-2xl border border-[#BE185D]/10 backdrop-blur-sm hover:border-[#BE185D]/30 transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[#BE185D]/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <div className="text-4xl mb-6 transform group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                    <h3 className="text-2xl font-semibold mb-4 text-white group-hover:text-[#BE185D] transition-colors duration-300">{feature.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{feature.description}</p>
            </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Integration Section */}
        <section className="relative py-32 px-4">
          <div className="absolute inset-0 bg-gradient-to-r from-black to-[#BE185D]/10"></div>
          <div className="container mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-20"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Seamless <span className="text-[#BE185D]">Integration</span>
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-transparent via-[#BE185D] to-transparent mx-auto"></div>
            </motion.div>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <h3 className="text-3xl font-semibold mb-8">Works With Your Existing Systems</h3>
                <ul className="space-y-6">
                  {[
                    "Integrates with popular Applicant Tracking Systems (ATS)",
                    "Handles large volumes of candidates simultaneously",
                    "Generates comprehensive rankings and feedback reports",
                    "Efficient user management and workflow automation"
                  ].map((item, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start group"
                    >
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#BE185D]/10 border border-[#BE185D]/30 flex items-center justify-center mr-4 group-hover:bg-[#BE185D]/20 transition-all duration-300">
                        <span className="text-[#BE185D]">✓</span>
                      </span>
                      <span className="text-gray-300">{item}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="relative bg-gradient-to-br from-gray-900/50 to-[#BE185D]/5 p-8 rounded-2xl border border-[#BE185D]/20 backdrop-blur-sm"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[#BE185D]/5 rounded-2xl"></div>
                <div className="relative">
                  <h3 className="text-3xl font-semibold mb-8">How It Works</h3>
                  <ol className="space-y-6">
                    {[
                      "Integrate Mockello with your recruitment process",
                      "Candidates complete AI-driven evaluation interviews",
                      "Review rankings and detailed feedback reports",
                      "Focus live HR interviews on top-ranked candidates"
                    ].map((step, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start group"
                      >
                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#BE185D] flex items-center justify-center mr-4 shadow-lg shadow-[#BE185D]/20 group-hover:shadow-[#BE185D]/40 transition-all duration-300">
                          {index + 1}
                        </span>
                        <span className="text-gray-300 pt-1">{step}</span>
                      </motion.li>
                    ))}
                  </ol>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="relative py-32 px-4">
          <div className="absolute inset-0 bg-gradient-to-b from-[#BE185D]/5 to-black"></div>
          <div className="container mx-auto relative z-10">
            <div className="grid md:grid-cols-3 gap-12">
              {[
                { number: "70%", label: "Reduction in Recruitment Time" },
                { number: "90%", label: "Cost Savings in Campus Drives" },
                { number: "100%", label: "Objective Evaluation" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#BE185D]/10 to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                  <div className="relative bg-gradient-to-br from-gray-900/50 to-[#BE185D]/5 p-8 rounded-2xl border border-[#BE185D]/20 backdrop-blur-sm text-center">
                    <div className="text-6xl font-bold text-[#BE185D] mb-4">{stat.number}</div>
                    <div className="text-xl text-gray-300">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Ready to Transform Section with Modern Design */}
        <section className="relative py-32 px-4 overflow-hidden">
          {/* Modern Background Effects */}
          <div className="absolute inset-0">
            {/* Gradient Mesh Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(190,24,93,0.1)_0%,transparent_50%)] animate-pulse"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(190,24,93,0.15)_0%,transparent_30%)]"></div>
            
            {/* Glass Effect Cards */}
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                className="absolute w-64 h-64 rounded-full"
                style={{
                  background: 'radial-gradient(circle at center, rgba(190,24,93,0.1) 0%, transparent 70%)',
                  filter: 'blur(40px)',
                  top: '20%',
                  left: '10%'
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <motion.div
                className="absolute w-64 h-64 rounded-full"
                style={{
                  background: 'radial-gradient(circle at center, rgba(190,24,93,0.1) 0%, transparent 70%)',
                  filter: 'blur(40px)',
                  bottom: '20%',
                  right: '10%'
                }}
                animate={{
                  scale: [1.2, 1, 1.2],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{
                  duration: 8,
                  delay: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </div>
          </div>

          {/* Content */}
          <div className="container mx-auto relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <motion.h2 
                className="text-5xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white via-[#BE185D] to-white"
                animate={{
                  backgroundPosition: ['200% 0', '-200% 0']
                }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                Ready to Transform Your Recruitment?
              </motion.h2>
              <p className="text-xl mb-12 text-gray-200 max-w-3xl mx-auto leading-relaxed backdrop-blur-sm">
                Join forward-thinking companies using Mockello to streamline their recruitment process, reduce costs, and identify top talent efficiently.
              </p>
              <Link href="/landing" className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold tracking-wide text-white transition-all duration-500 ease-in-out transform bg-gradient-to-r from-[#BE185D] to-[#BE185D]/80 rounded-full hover:scale-105 hover:shadow-[0_0_30px_-5px_#BE185D] overflow-hidden">
                <span className="absolute w-0 h-0 transition-all duration-500 ease-in-out bg-white rounded-full group-hover:w-80 group-hover:h-80 opacity-10"></span>
                <span className="relative">Get Started Now</span>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Enhanced Footer with Animated Border and Gradient */}
        <footer className="relative bg-black py-12 px-4 overflow-hidden">
          {/* Animated Border */}
          <motion.div 
            className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#BE185D] to-transparent"
            animate={{
              backgroundPosition: ['200% 0', '-200% 0'],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
          
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#BE185D] to-white">Mockello</h3>
                <p className="text-gray-400">Transforming recruitment through AI innovation</p>
              </motion.div>
              
              {/* Staggered Animation for Footer Links */}
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h4 className="text-lg font-semibold text-white">Product</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <Link href="/features" className="hover:text-[#BE185D] transition-colors">
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link href="/pricing" className="hover:text-[#BE185D] transition-colors">
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <Link href="/landing" className="hover:text-[#BE185D] transition-colors">
                      Demo
                    </Link>
                  </li>
                </ul>
              </motion.div>

              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <h4 className="text-lg font-semibold text-white">Company</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <Link href="/about" className="hover:text-[#BE185D] transition-colors">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link href="/about#team" className="hover:text-[#BE185D] transition-colors">
                      Team
                    </Link>
                  </li>
                  <li>
                    <Link href="/careers" className="hover:text-[#BE185D] transition-colors">
                      Careers
                    </Link>
                  </li>
                </ul>
              </motion.div>

              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h4 className="text-lg font-semibold text-white">Resources</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <Link href="/blog" className="hover:text-[#BE185D] transition-colors">
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="hover:text-[#BE185D] transition-colors">
                      Support
                    </Link>
                  </li>
                </ul>
              </motion.div>
            </div>
            
            {/* Animated Copyright Section */}
            <motion.div 
              className="mt-12 pt-8 border-t border-[#BE185D]/20 text-center text-gray-400"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <p>© 2025 Mockello. All rights reserved.</p>
            </motion.div>
          </div>
        </footer>
      </main>
    </>
  );
}