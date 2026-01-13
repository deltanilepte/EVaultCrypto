import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, Circle, Zap, Target, Rocket, Globe, Shield, Star, Crown, Trophy, Gem, ArrowRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const roadmapData = [
    {
        date: "Nov 2024",
        title: "Concept & Research",
        description: "Market analysis and architectural design of the high-yield protocol.",
        status: "completed"
    },
    {
        date: "Jan 2025",
        title: "Smart Contract Audit",
        description: "Security verification and optimization of the core staking contracts.",
        status: "completed"
    },
    {
        date: "Mar 2025",
        title: "Beta Launch",
        description: "Early access release for community testing and feedback.",
        status: "active"
    },
    {
        date: "Apr 2025",
        title: "Official Platform Launch",
        description: "Public release with full features and enhanced yield farming algorithms.",
        status: "upcoming"
    },
    {
        date: "Q2 2025",
        title: "Ecosystem Expansion",
        description: "Mobile app launch and cross-chain bridge integration.",
        status: "upcoming"
    }
];

const Roadmap = () => {
    const navigate = useNavigate();
    const [width, setWidth] = useState(0);
    const carouselRef = useRef();

    useEffect(() => {
        if (carouselRef.current) {
            setWidth(carouselRef.current.scrollWidth - carouselRef.current.offsetWidth);
        }
    }, []);

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed': return <CheckCircle size={16} className="text-[#D4AF37]" />;
            case 'active': return <Zap size={16} className="text-[#FFD700] animate-pulse" />;
            case 'upcoming': return <Circle size={16} className="text-gray-300" />;
            default: return <Circle size={16} />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'bg-[#FFF8E1] border-[#FFD700] text-[#B8860B]';
            case 'active': return 'bg-[#D4AF37]/10 border-[#D4AF37]/30 text-[#D4AF37]';
            case 'upcoming': return 'bg-gray-100 border-gray-200 text-gray-600';
            default: return 'bg-gray-100 border-gray-200';
        }
    };

    const getIcon = (index) => {
        const icons = [<Target size={20} />, <Shield size={20} />, <Rocket size={20} />, <Globe size={20} />, <Gem size={20} />];
        return icons[index] || <Star size={20} />;
    };

    return (
        <section id="roadmap" className="py-16 relative overflow-hidden bg-gradient-to-b from-white to-gray-50">

            <div className="container mx-auto relative z-10 px-4">
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block px-4 py-1.5 rounded-full border border-[#D4AF37]/40 bg-gradient-to-r from-[#D4AF37]/10 to-[#FFD700]/10 text-[#B8860B] font-bold text-xs uppercase tracking-widest mb-6"
                    >
                        <Crown size={12} className="inline mr-2" />
                        Strategic Journey
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-black text-[#0F172A] mb-6 tracking-tight"
                    >
                        The Golden Journey of <span className="text-gradient-gold">eVault</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed"
                    >
                        Swipe through our strategic roadmap to see how we're revolutionizing decentralized finance.
                    </motion.p>
                </div>

                {/* Slider Container */}
                <motion.div ref={carouselRef} className="cursor-grab overflow-hidden active:cursor-grabbing pb-10">
                    <motion.div
                        drag="x"
                        dragConstraints={{ right: 0, left: -width }}
                        className="flex gap-8"
                    >
                        {roadmapData.map((item, index) => (
                            <motion.div
                                key={index}
                                className={`relative min-w-[280px] xs:min-w-[300px] sm:min-w-[350px] md:min-w-[400px] flex-shrink-0 bg-gradient-to-br from-white to-[#FFFBF5] p-5 sm:p-8 rounded-3xl shadow-xl border-2 ${item.status === 'completed' ? 'border-[#FFEBB2] shadow-[#D4AF37]/10' : item.status === 'active' ? 'border-[#FFD700]/40 shadow-[#FFD700]/20' : 'border-gray-100'} hover:shadow-2xl transition-all duration-300 group`}
                            >
                                {/* Connector Line (Visual) */}
                                <div className="absolute top-1/2 -right-10 w-10 h-1 bg-[#D4AF37]/20 hidden md:block last:hidden"></div>

                                {/* Status Badge */}
                                <div className="absolute top-6 right-6">
                                    <div className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider border flex items-center gap-2 ${getStatusColor(item.status)}`}>
                                        {getStatusIcon(item.status)}
                                        {item.status}
                                    </div>
                                </div>

                                {/* Icon */}
                                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mb-6 shadow-lg ${item.status === 'completed' ? 'bg-gradient-to-br from-[#D4AF37] to-[#B8860B] text-white' : item.status === 'active' ? 'bg-gradient-to-br from-[#FFD700] to-[#D4AF37] text-white animate-pulse-gold' : 'bg-gray-100 text-gray-400'}`}>
                                    {getIcon(index)}
                                </div>

                                {/* Date */}
                                <div className="flex items-center gap-2 text-[#B8860B] font-bold mb-2 sm:mb-3 text-sm">
                                    <Clock size={16} />
                                    <span>{item.date}</span>
                                </div>

                                {/* Title */}
                                <h3 className="text-xl sm:text-2xl font-bold text-[#0F172A] mb-2 sm:mb-3 group-hover:text-[#D4AF37] transition-colors">{item.title}</h3>

                                {/* Description */}
                                <p className="text-sm sm:text-base text-gray-500 leading-relaxed">{item.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mt-12 pt-8 border-t border-gray-200/50"
                >
                    <button onClick={() => navigate('/login')} className="inline-flex items-center gap-4 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white font-bold shadow-2xl hover:shadow-[0_25px_50px_-12px_rgba(212,175,55,0.4)] hover:-translate-y-1 transition-all duration-300 group">
                        <span className="text-lg">Join The Golden Journey</span>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FFD700] to-[#D4AF37] flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Rocket size={18} className="text-[#0F172A]" />
                        </div>
                    </button>

                    {/* Golden Stats */}
                    <div className="flex justify-center gap-8 mt-8">
                        <div className="text-center">
                            <div className="text-2xl font-black text-[#B8860B]">5+</div>
                            <div className="text-sm text-gray-500">Strategic Milestones</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-black text-[#B8860B]">100%</div>
                            <div className="text-sm text-gray-500">On Track</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-black text-[#B8860B]">24/7</div>
                            <div className="text-sm text-gray-500">Development</div>
                        </div>
                    </div>
                </motion.div>
            </div>

            <style jsx>{`
                .text-gradient-gold {
                    background: linear-gradient(135deg, #D4AF37 0%, #FFD700 50%, #DAA520 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }
                @keyframes pulse-gold {
                    0%, 100% { 
                        box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.7),
                                    0 0 0 0 rgba(255, 215, 0, 0.5);
                    }
                    50% { 
                        box-shadow: 0 0 0 10px rgba(212, 175, 55, 0),
                                    0 0 0 20px rgba(255, 215, 0, 0);
                    }
                }
                .animate-pulse-gold {
                    animation: pulse-gold 2s infinite;
                }
            `}</style>
        </section>
    );
};

export default Roadmap;