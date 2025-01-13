import { motion } from 'framer-motion';
import Head from 'next/head';
import Link from 'next/link';
import Footer from '../components/Footer';

export default function CareersPage() {
  const jobListings = [
    {
      title: "Frontend Developer Intern",
      department: "Engineering",
      location: "Remote",
      type: "Internship",
      description: "Join our team to learn and build modern web applications using React, Next.js, and TypeScript.",
      formLink: "https://forms.google.com/frontend-dev"
    },
    {
      title: "Backend Developer Intern",
      department: "Engineering",
      location: "Remote",
      type: "Internship",
      description: "Learn to develop robust backend systems using Python and modern frameworks.",
      formLink: "https://forms.google.com/backend-dev"
    },
    {
      title: "UI/UX Design Intern",
      department: "Design",
      location: "Remote",
      type: "Internship",
      description: "Learn to create beautiful and intuitive user interfaces for our recruitment platform.",
      formLink: "https://forms.google.com/design-team"
    },
    {
      title: "Social Media Marketing Intern",
      department: "Marketing",
      location: "Remote",
      type: "Internship",
      description: "Learn to drive social media presence and engagement across platforms.",
      formLink: "https://forms.google.com/social-media"
    },
    {
      title: "Software Development Intern",
      department: "Engineering",
      location: "Remote",
      type: "Internship",
      description: "Learn and contribute to our tech stack while gaining real-world experience.",
      formLink: "https://forms.google.com/internship"
    }
  ];

  const values = [
    {
      title: "Innovation First",
      description: "We push the boundaries of what's possible with AI and recruitment technology.",
      icon: "💡"
    },
    {
      title: "User-Centric",
      description: "Every decision we make starts with our users' needs and experiences.",
      icon: "👥"
    },
    {
      title: "Diversity & Inclusion",
      description: "We believe diverse teams build better products and create better outcomes.",
      icon: "🌈"
    },
    {
      title: "Continuous Learning",
      description: "We invest in our team's growth and encourage experimentation.",
      icon: "📚"
    }
  ];

  return (
    <>
      <Head>
        <title>Careers - Mockello</title>
        <meta name="description" content="Join Mockello in revolutionizing the recruitment industry through AI innovation" />
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
                Join Our Team
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                We&apos;re always looking for talented individuals to join our team.
              </p>
            </motion.div>

            {/* Values Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-32"
            >
              <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
              <div className="grid md:grid-cols-4 gap-8">
                {values.map((value, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="bg-gradient-to-br from-gray-900/50 to-[#BE185D]/5 p-8 rounded-2xl border border-[#BE185D]/20 backdrop-blur-sm text-center"
                  >
                    <div className="text-4xl mb-4">{value.icon}</div>
                    <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                    <p className="text-gray-400">{value.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Job Listings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mb-32"
            >
              <h2 className="text-3xl font-bold text-center mb-12">Open Positions</h2>
              <div className="space-y-6">
                {jobListings.map((job, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="bg-gradient-to-br from-gray-900/50 to-[#BE185D]/5 p-6 rounded-2xl border border-[#BE185D]/20 backdrop-blur-sm hover:border-[#BE185D]/40 transition-all duration-300"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                        <div className="flex flex-wrap gap-3">
                          <span className="text-[#BE185D] text-sm">{job.department}</span>
                          <span className="text-gray-400 text-sm">•</span>
                          <span className="text-gray-400 text-sm">{job.location}</span>
                          <span className="text-gray-400 text-sm">•</span>
                          <span className="text-gray-400 text-sm">{job.type}</span>
                        </div>
                        <p className="text-gray-300 mt-3">{job.description}</p>
                      </div>
                      <Link
                        href={job.formLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center px-6 py-3 font-semibold text-[#BE185D] border border-[#BE185D] rounded-full hover:bg-[#BE185D] hover:text-white transition-all duration-300 whitespace-nowrap"
                      >
                        Apply Now
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Benefits Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="text-center mb-20"
            >
              <h2 className="text-3xl font-bold mb-12">Why Work at Mockello?</h2>
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    title: "Competitive Package",
                    description: "Competitive salary, equity, and comprehensive benefits package",
                    icon: "💰"
                  },
                  {
                    title: "Remote-First",
                    description: "Work from anywhere in the world with flexible hours",
                    icon: "🌍"
                  },
                  {
                    title: "Growth Opportunities",
                    description: "Professional development budget and mentorship programs",
                    icon: "📈"
                  }
                ].map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 + index * 0.1 }}
                    className="bg-gradient-to-br from-gray-900/50 to-[#BE185D]/5 p-8 rounded-2xl border border-[#BE185D]/20 backdrop-blur-sm"
                  >
                    <div className="text-4xl mb-4">{benefit.icon}</div>
                    <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                    <p className="text-gray-400">{benefit.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        <Footer />
      </main>
    </>
  );
} 