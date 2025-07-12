
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigate } from 'react-router-dom';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';

import { TrendingUp, Shield, Zap, Eye } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { isAuthenticated, loading } = useAuth();

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-slate-300">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6
      }
    }
  };

  const formVariants = {
    hidden: { opacity: 0, x: isLogin ? -20 : 20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.5
      }
    },
    exit: { 
      opacity: 0, 
      x: isLogin ? 20 : -20,
      transition: {
        duration: 0.3
      }
    }
  };

  const features = [
    {
      icon: TrendingUp,
      title: "Real-time Tracking",
      description: "Monitor your crypto portfolio with live price updates"
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Your data is encrypted and protected with industry standards"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Instant updates and seamless trading experience"
    },
    {
      icon: Eye,
      title: "Smart Analytics",
      description: "Advanced insights to make informed investment decisions"
    }
  ];

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden flex flex-col">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col h-full"
      >
        <motion.div variants={itemVariants} className="px-4 py-3 flex-shrink-0">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="flex items-center justify-center gap-3 mb-4"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Crypto Tracker
              </h1>
            </motion.div>
          </motion.div>
        </motion.div>

        <div className="flex-1 flex items-center justify-center px-4 pb-4 min-h-0">
          <div className="grid lg:grid-cols-2 gap-6 w-full max-w-6xl items-center h-full">
            {/* Left side - Features */}
            <motion.div 
              variants={itemVariants}
              className="hidden lg:flex flex-col justify-center space-y-4 h-full overflow-hidden"
            >
              <div className="space-y-2">
                <motion.h1 
                  className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent leading-tight"
                  variants={itemVariants}
                >
                  Welcome to the Future of Crypto Trading
                </motion.h1>
                <motion.p 
                  className="text-base text-slate-300 leading-relaxed"
                  variants={itemVariants}
                >
                  Join thousands of traders who trust our platform for their cryptocurrency investments
                </motion.p>
              </div>

              <motion.div 
                className="grid gap-3 overflow-hidden"
                variants={itemVariants}
              >
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    className="flex items-start space-x-3 p-2.5 rounded-xl bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 hover:border-purple-500/50 transition-all duration-300"
                    variants={itemVariants}
                    whileHover={{ scale: 1.02, y: -2 }}
                  >
                    <div className="p-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 flex-shrink-0">
                      <feature.icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-semibold text-white mb-0.5">{feature.title}</h3>
                      <p className="text-xs text-slate-400">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right side - Auth Form */}
            <motion.div 
              variants={itemVariants}
              className="w-full max-w-md mx-auto lg:mx-0 flex flex-col justify-center h-full"
            >
              <motion.div 
                className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-5 border border-slate-700/50 shadow-2xl flex flex-col h-fit"
                whileHover={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-4 flex-shrink-0">
                  <motion.h1 
                    className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-1"
                    layout
                  >
                    {isLogin ? 'Welcome Back' : 'Join Crypto Tracker'}
                  </motion.h1>
                  <motion.p 
                    className="text-slate-400 text-xs"
                    layout
                  >
                    {isLogin 
                      ? 'Sign in to your account to continue tracking your portfolio' 
                      : 'Create an account to start tracking your crypto portfolio'
                    }
                  </motion.p>
                </div>

                <div className="flex-1 overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={isLogin ? 'login' : 'register'}
                      variants={formVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="h-full"
                    >
                      {isLogin ? <LoginForm /> : <RegisterForm />}
                    </motion.div>
                  </AnimatePresence>
                </div>

                <motion.div 
                  className="mt-4 text-center flex-shrink-0"
                  variants={itemVariants}
                >
                  <p className="text-slate-400 mb-2 text-xs">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                  </p>
                  <motion.button
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-purple-400 hover:text-purple-300 font-medium transition-colors relative overflow-hidden px-3 py-1.5 rounded-lg text-xs"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-lg"
                      initial={{ scale: 0 }}
                      whileHover={{ scale: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                    <span className="relative">
                      {isLogin ? 'Create new account' : 'Sign in instead'}
                    </span>
                  </motion.button>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <style>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Auth;
