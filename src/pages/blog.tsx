import { motion } from 'framer-motion';
import Head from 'next/head';
import Link from 'next/link';
import Footer from '../components/Footer';

export default function BlogPage() {
  return (
    <>
      <Head>
        <title>Blog - Mockello</title>
        <meta name="description" content="Insights and articles about AI-powered recruitment and candidate evaluation" />
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
          <div className="container mx-auto max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#BE185D] to-white">
                Blog
              </h1>
            </motion.div>

            {/* Blog Post */}
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-gray-900/50 to-[#BE185D]/5 p-8 rounded-2xl border border-[#BE185D]/20 backdrop-blur-sm mb-16"
            >
              <h2 className="text-3xl font-bold mb-4">
                The Benefits of AI-Powered Candidate Evaluation Before HR Rounds
              </h2>
              <div className="text-gray-400 mb-8">
                <span className="text-[#BE185D]">Published on:</span> January 15, 2025
              </div>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 mb-6">
                  In today&apos;s competitive job market, finding the right talent efficiently is crucial. 
                  Implementing AI-powered candidate evaluation before traditional HR rounds has revolutionized 
                  the recruitment process, offering numerous benefits for both employers and candidates.
                </p>

                <h3 className="text-2xl font-semibold mb-4 text-[#BE185D]">1. Time and Cost Efficiency</h3>
                <p className="text-gray-300 mb-6">
                  By conducting AI-powered evaluations first, companies can efficiently screen a large number 
                  of candidates without dedicating extensive HR resources. This automated pre-screening 
                  reduces the time spent on initial evaluations by up to 75%.
                </p>

                <h3 className="text-2xl font-semibold mb-4 text-[#BE185D]">2. Objective Assessment</h3>
                <p className="text-gray-300 mb-6">
                  AI-driven evaluations provide consistent and unbiased assessments of candidates&apos; skills, 
                  ensuring fair treatment and reducing human bias in the initial screening process. This 
                  leads to a more diverse and qualified candidate pool.
                </p>

                <h3 className="text-2xl font-semibold mb-4 text-[#BE185D]">3. Comprehensive Skill Evaluation</h3>
                <p className="text-gray-300 mb-6">
                  Our AI system can evaluate multiple aspects simultaneously - technical skills, communication 
                  abilities, problem-solving capabilities, and more. This provides HR teams with rich data 
                  before conducting personal interviews.
                </p>

                <h3 className="text-2xl font-semibold mb-4 text-[#BE185D]">4. Better Candidate Experience</h3>
                <p className="text-gray-300 mb-6">
                  Candidates receive immediate feedback and fair evaluation, improving their overall 
                  experience. The process is convenient, accessible, and respects their time by ensuring 
                  they move forward only if there&apos;s a good fit.
                </p>
                <p className="text-gray-300 mb-6">
                  We&apos;ll respond within 24 hours
                </p>

                <h3 className="text-2xl font-semibold mb-4 text-[#BE185D]">5. Data-Driven Decision Making</h3>
                <p className="text-gray-300 mb-6">
                  HR teams can make more informed decisions based on quantifiable data from AI evaluations. 
                  This leads to better quality of hire and reduced turnover rates in the long term.
                </p>

                <h3 className="text-2xl font-semibold mb-4 text-[#BE185D]">Conclusion</h3>
                <p className="text-gray-300">
                  Implementing AI-powered candidate evaluation before HR rounds not only streamlines the 
                  recruitment process but also improves its quality and fairness. Companies that adopt 
                  this approach gain a competitive advantage in attracting and selecting top talent.
                </p>
              </div>
            </motion.article>
          </div>
        </div>

        <Footer />
      </main>
    </>
  );
} 