import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Footer() {
  return (
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
            <Link href="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#BE185D] to-white">
              Mockello
            </Link>
            <p className="text-gray-400">Transforming recruitment through AI innovation</p>
          </motion.div>
          
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
              <li className="flex items-center gap-2">
                <span className="text-[#BE185D]">📞</span>
                <a href="tel:+917550000805" className="hover:text-[#BE185D] transition-colors">
                  +91 755 000 0805
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#BE185D]">✉️</span>
                <a href="mailto:contactrohitmenon@gmail.com" className="hover:text-[#BE185D] transition-colors">
                  contactrohitmenon@gmail.com
                </a>
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
  );
} 