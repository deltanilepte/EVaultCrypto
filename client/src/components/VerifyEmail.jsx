import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, ArrowRight, RefreshCw } from 'lucide-react';
import api from '../api/axios';

const VerifyEmail = () => {
    const { token } = useParams();
    const [status, setStatus] = useState('verifying'); // verifying, success, error
    const [message, setMessage] = useState('');

    useEffect(() => {
        const verify = async () => {
            try {
                const { data } = await api.post(`/auth/verify-email/${token}`);
                setStatus('success');
                setMessage(data.message);
            } catch (error) {
                setStatus('error');
                setMessage(error.response?.data?.message || 'Verification failed');
            }
        };

        if (token) {
            verify();
        }
    }, [token]);

    return (
        <div className="h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#0F172A]">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-20%] w-[50%] h-[50%] bg-gold/15 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-gold/10 rounded-full blur-[100px] animate-pulse delay-700" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10 w-full max-w-sm px-4"
            >
                <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-gold/20 p-8 text-center">

                    {status === 'verifying' && (
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 border-4 border-gold/30 border-t-gold rounded-full animate-spin mb-4" />
                            <h2 className="text-xl font-bold text-navy mb-2">Verifying Email...</h2>
                            <p className="text-gray-500">Please wait while we verify your email address.</p>
                        </div>
                    )}

                    {status === 'success' && (
                        <div className="flex flex-col items-center">
                            <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
                            <h2 className="text-xl font-bold text-navy mb-2">Email Verified!</h2>
                            <p className="text-gray-500 mb-6">{message}</p>
                            <Link
                                to="/login"
                                className="w-full bg-navy text-white font-bold py-3 rounded-xl hover:bg-gold hover:text-navy transition-all flex items-center justify-center gap-2"
                            >
                                <span>Login Now</span>
                                <ArrowRight size={18} />
                            </Link>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="flex flex-col items-center">
                            <XCircle className="w-16 h-16 text-red-500 mb-4" />
                            <h2 className="text-xl font-bold text-navy mb-2">Verification Failed</h2>
                            <p className="text-red-500 mb-6">{message}</p>
                            <Link
                                to="/login"
                                className="text-navy font-bold hover:text-gold transition-colors"
                            >
                                Back to Login
                            </Link>
                        </div>
                    )}

                </div>
            </motion.div>
        </div>
    );
};

export default VerifyEmail;
