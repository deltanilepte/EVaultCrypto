import React, { useState, useEffect } from 'react';
import { Menu, X, Zap, Activity, Map, MessageSquareQuote, HelpCircle, ChevronRight, LogIn, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import eVault_Logo from '../../public/evaultbg.png';

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Features', icon: Zap },
        { name: 'How it works', icon: Activity },
        { name: 'Roadmap', icon: Map },
        { name: 'Testimonials', icon: MessageSquareQuote },
        { name: 'FAQ', icon: HelpCircle }
    ];

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                    ? 'glass-panel py-4 shadow-lg'
                    : 'bg-transparent py-5'
                    }`}
            >
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex flex-col items-center -mt-2 sm:-mt-10">
                        <img
                            src={eVault_Logo}
                            alt="eVault_Logo"
                            className="block h-28 md:h-32 w-auto"
                        />

                        <p className="text-xs z-10 font-bold text-[#D4AF37] -mt-8 sm:-mt-10 text-center leading-none">
                            Don't Just Hold... EARN!!!!
                        </p>
                    </div>


                    {/* Desktop Nav - Centered */}
                    <nav className="hidden md:flex items-center gap-10 absolute left-1/2 -translate-x-1/2">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={`#${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                                className="text-gray-600 font-bold hover:text-[#D4AF37] transition-colors text-xs uppercase tracking-[0.2em]"
                            >
                                {link.name}
                            </a>
                        ))}
                    </nav>

                    {/* Auth Buttons */}
                    <div className="hidden md:flex items-center gap-3">
                        <Link to="/login">
                            <button className="text-navy font-bold py-2.5 px-6 rounded-lg hover:text-[#D4AF37] transition-all">
                                Login
                            </button>
                        </Link>
                        <Link to="/register">
                            <button className="bg-gradient-to-r from-navy to-navy-light hover:bg-[#e8d69a] hover:scale-105 text-black border font-bold py-2.5 px-6 rounded-lg transition-all shadow-lg shadow-navy/20 hover:shadow-gold/30">
                                Sign Up
                            </button>
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden text-gray-900 pl-4"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? null : <Menu size={28} />}
                    </button>
                </div>
            </header>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden fixed inset-0 bg-white shadow-xl z-[100] overflow-y-auto"
                    >
                        <div className="p-6 flex flex-col min-h-screen">
                            {/* Mobile Menu Header with Close Button */}
                            <div className="flex items-center justify-between mb-8">
                                <div className="w-8"></div> {/* Spacer for centering if needed, or remove */}
                                <button
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="p-2 -mr-2 text-gray-900 rounded-full hover:bg-gray-100 transition-colors"
                                >
                                    <X size={32} />
                                </button>
                            </div>
                            <div className="flex flex-col gap-2">
                                {navLinks.map((link) => (
                                    <a
                                        key={link.name}
                                        href={`#${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                                        className="group flex items-center justify-between p-4 rounded-xl hover:bg-gold/5 transition-all duration-300 border border-transparent hover:border-gold/20"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 rounded-lg bg-gray-50 group-hover:bg-gold/10 transition-colors text-gray-600 group-hover:text-gold">
                                                <link.icon size={20} />
                                            </div>
                                            <span className="text-gray-900 font-bold text-lg tracking-wide group-hover:text-gold transition-colors">
                                                {link.name}
                                            </span>
                                        </div>
                                        <ChevronRight size={18} className="text-gray-300 group-hover:text-gold transform group-hover:translate-x-1 transition-all" />
                                    </a>
                                ))}
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-2 gap-4">
                                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                    <button className="flex items-center justify-center gap-2 border-2 border-[#0F172A] text-[#0F172A] font-bold py-3.5 rounded-xl w-full hover:bg-[#0F172A] hover:text-white transition-all duration-300 group">
                                        <LogIn size={18} className="group-hover:scale-110 transition-transform" />
                                        Login
                                    </button>
                                </Link>
                                <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>
                                    <button className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#0F172A] to-[#1E293B] text-white font-bold py-3.5 rounded-xl w-full shadow-lg shadow-[#0F172A]/20 hover:shadow-[#0F172A]/40 hover:-translate-y-0.5 transition-all duration-300 group">
                                        <UserPlus size={18} className="group-hover:scale-110 transition-transform" />
                                        Sign Up
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Header;
