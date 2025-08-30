import React, { useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import Hero from '../components/Home/Hero.tsx';
import { 
  Shield, 
  Clock, 
  MapPin, 
  Users, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  Smartphone,
  ArrowRight,
  AlertCircle,
  CheckCheck,
  MessageCircle,
  Zap,
  Map as MapIcon,
  UserCheck,
  Smartphone as PhoneIcon
} from 'lucide-react';

const Home: React.FC = () => {
  const { user } = useAuth();
  const controls = useAnimation();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [controls, isInView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut'
      }
    }
  };

  const fadeInUp = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  };

  const features = [
    {
      icon: Shield,
      title: 'Anonymous Reporting',
      description: 'Report issues without revealing your identity. Your privacy is protected while helping improve transportation services.',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      hoverBg: 'hover:bg-purple-50',
      delay: 0.1
    },
    {
      icon: Clock,
      title: 'Real-time Alerts',
      description: 'Issues are immediately sent to relevant authorities including Traffic Police, Bus Stations, and Transportation Office.',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      hoverBg: 'hover:bg-blue-50',
      delay: 0.2
    },
    {
      icon: MapPin,
      title: 'Location-based Routing',
      description: 'Reports are automatically routed to the nearest authorities based on the incident location.',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      hoverBg: 'hover:bg-green-50',
      delay: 0.3
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Help create a better transportation system by reporting issues that affect everyone in the community.',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      hoverBg: 'hover:bg-amber-50',
      delay: 0.4
    },
    {
      icon: CheckCircle,
      title: 'Track Resolution',
      description: 'Monitor the status of your reports and see how authorities are addressing transportation issues.',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      hoverBg: 'hover:bg-emerald-50',
      delay: 0.5
    },
    {
      icon: Smartphone,
      title: 'Mobile Friendly',
      description: 'Report issues on the go with our responsive design that works perfectly on all devices.',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      hoverBg: 'hover:bg-indigo-50',
      delay: 0.6
    }
  ];

  const stats = [
    { 
      number: '0+', 
      label: 'Reports Submitted',
      icon: MessageCircle,
      color: 'text-blue-600',
      change: '↑ 0% from last month',
      delay: 0.1
    },
    { 
      number: '0%', 
      label: 'Resolution Rate',
      icon: CheckCheck,
      color: 'text-green-600',
      change: '↑ 0 % from last month ',
      delay: 0.2
    }
  ];

  const howItWorks = [
    {
      step: 1,
      title: 'Report an Issue',
      description: 'Fill out our simple form to describe the transportation issue. Include location details and any relevant information.',
      icon: AlertCircle,
      color: 'bg-blue-100 text-blue-600',
      delay: 0.1
    },
    {
      step: 2,
      title: 'Smart Routing',
      description: 'Our system automatically routes your report to the appropriate authorities: Traffic Police, Bus Stations, or Transportation Office.',
      icon: MapIcon,
      color: 'bg-purple-100 text-purple-600',
      delay: 0.3
    },
    {
      step: 3,
      title: 'Resolution',
      description: 'Authorities receive real-time alerts and take action to resolve the issue, improving transportation services for everyone.',
      icon: CheckCheck,
      color: 'bg-green-100 text-green-600',
      delay: 0.5
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <section ref={ref} className="py-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            animate={controls}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.6,
                  ease: 'easeOut'
                }
              }
            }}
          >
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
              variants={fadeInUp}
            >
              Why Choose Our System?
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-600 max-w-3xl mx-auto"
              variants={fadeInUp}
            >
              A comprehensive solution designed to improve public transportation through 
              real-time reporting and intelligent routing to relevant authorities.
            </motion.p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate={controls}
          >
            {features.map((feature, index) => (
              <motion.div 
                key={index} 
                className={`card p-6 rounded-xl transition-all duration-300 hover:shadow-lg ${feature.hoverBg} hover:-translate-y-1`}
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                transition={{ 
                  duration: 0.5,
                  delay: feature.delay,
                  ease: 'easeOut' 
                }}
                whileHover={{ 
                  y: -5,
                  transition: { duration: 0.2 }
                }}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className={`w-12 h-12 ${feature.bgColor} rounded-xl flex items-center justify-center`}>
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                </div>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTRtMTIgMGMwIDIuMjA5LTEuNzkxIDQtNCA0cy00LTEuNzkxLTQtNCAxLjc5MS00IDQtNCA0IDEuNzkxIDQgNG0tMTIgNmMwIDIuMjA5LTEuNzkxIDQtNCA0cy00LTEuNzkxLTQtNCAxLjc5MS00IDQtNCA0IDEuNzkxIDQgNG0xMiAwYzAgMi4yMDktMS43OTEgNC00IDRzLTQtMS43OTEtNC00IDEuNzkxLTQgNC00IDQgMS43OTEgNCA0Ii8+PC9nPjwvZz48L3N2Zz4=')]"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div 
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.6,
                  ease: 'easeOut'
                }
              }
            }}
          >
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-white mb-4"
              variants={fadeInUp}
            >
              Making a Difference
            </motion.h2>
            <motion.p 
              className="text-xl text-primary-100"
              variants={fadeInUp}
            >
              See the impact of our transportation issue reporting system
            </motion.p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 max-w-3xl mx-auto gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            {stats.map((stat, index) => (
              <motion.div 
                key={index} 
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.5,
                  delay: stat.delay,
                  ease: 'easeOut' 
                }}
                whileHover={{ 
                  y: -5,
                  transition: { duration: 0.2 }
                }}
              >
                <div className={`w-14 h-14 ${stat.color} bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <stat.icon className="w-7 h-7" />
                </div>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-primary-100 font-medium mb-1">{stat.label}</div>
                <div className="text-xs text-white/60">{stat.change}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0YzAtMi4yMDktMS43OTEtNC00LTRzLTQgMS43OTEtNCA0IDEuNzkxIDQgNCA0IDQtMS43OTEgNC00bTEyIDBjMCAyLjIwOS0xLjc5MSA0LTQgNHMtNC0xLjc5MS00LTQgMS43OTEtNCA0LTQgNCAxLjc5MSA0IDRtLTEyIDZjMCAyLjIwOS0xLjc5MSA0LTQgNHMtNC0xLjc5MS00LTQgMS43OTEtNCA0LTQgNCAxLjc5MSA0IDRtMTIgMGMwIDIuMjA5LTEuNzkxIDQtNCA0cy00LTEuNzkxLTQtNCAxLjc5MS00IDQtNCA0IDEuNzkxIDQgNCIvPjwvZz48L2c+PC9zdmc+')]"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.6,
                  ease: 'easeOut'
                }
              }
            }}
          >
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
              variants={fadeInUp}
            >
              How It Works
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-600 max-w-2xl mx-auto"
              variants={fadeInUp}
            >
              Simple steps to report and resolve transportation issues
            </motion.p>
          </motion.div>

          <div className="relative
            before:absolute before:top-0 before:bottom-0 before:left-1/2 before:-translate-x-1/2 before:w-1 before:bg-gradient-to-b before:from-primary-400 before:to-primary-600 before:rounded-full
            before:hidden md:before:block"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-12 md:gap-y-0">
              {howItWorks.map((step, index) => (
                <motion.div 
                  key={step.step} 
                  className="relative z-10"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-100px" }}
                  variants={{
                    hidden: { opacity: 0, y: 40 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: 0.6,
                        delay: step.delay,
                        ease: 'easeOut'
                      }
                    }
                  }}
                >
                  <div className={`md:${index % 2 === 0 ? 'mr-auto' : 'ml-auto'} max-w-xs md:max-w-none md:w-80 p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-shadow duration-300`}>
                    <div className={`w-16 h-16 ${step.color} rounded-full flex items-center justify-center mx-auto mb-6`}>
                      <step.icon className="w-7 h-7" />
                    </div>
                    <div className="absolute hidden -top-3 left-1/2 -translate-x-1/2 md:left-auto md:right-1/2 md:translate-x-1/2 md:top-1/2 md:-translate-y-1/2 w-10 h-10 bg-white border-4 border-primary-100 rounded-full flex items-center justify-center font-bold text-primary-600 z-20">
                      {step.step}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 text-center">{step.title}</h3>
                    <p className="text-gray-600 text-center">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 bg-gradient-to-r from-primary-600 to-primary-700 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIwOS0xLjc5MS00LTQtNHMtNCAxLjc5MS00IDQgMS43OTEgNCA0IDQgNC0xLjc5MSA0LTRtMTIgMGMwIDIuMjA5LTEuNzkxIDQtNCA0cy00LTEuNzkxLTQtNCAxLjc5MS00IDQtNCA0IDEuNzkxIDQgNG0tMTIgNmMwIDIuMjA5LTEuNzkxIDQtNCA0cy00LTEuNzkxLTQtNCAxLjc5MS00IDQtNCA0IDEuNzkxIDQgNG0xMiAwYzAgMi4yMDktMS43OTEgNC00IDRzLTQtMS43OTEtNC00IDEuNzkxLTQgNC00IDQgMS43OTEgNCA0Ii8+PC9nPjwvZz48L3N2Zz4=')]"></div>
        </div>
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full mix-blend-overlay blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full mix-blend-overlay blur-3xl"></div>
        
        <motion.div 
          className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={{
            hidden: { opacity: 0, y: 40 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.8,
                ease: 'easeOut'
              }
            }
          }}
        >
          <motion.div 
            className="inline-block mb-6"
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ 
              scale: 1, 
              opacity: 1,
              transition: { 
                delay: 0.2,
                duration: 0.5,
                type: 'spring',
                stiffness: 100
              } 
            }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium text-white/90 border border-white/20">
              <Zap className="w-4 h-4 mr-2 text-yellow-300" />
              Join our community of problem solvers
            </div>
          </motion.div>
          
          <motion.h2 
            className="text-3xl md:text-5xl font-bold text-white mb-6"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  delay: 0.1,
                  duration: 0.6,
                  ease: 'easeOut'
                }
              }
            }}
          >
            Ready to Make a Difference?
          </motion.h2>
          
          <motion.p 
            className="text-xl text-primary-100 mb-10 max-w-3xl mx-auto"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  delay: 0.2,
                  duration: 0.6,
                  ease: 'easeOut'
                }
              }
            }}
          >
            Join thousands of citizens who are helping to improve public transportation 
            by reporting issues and holding authorities accountable.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  delay: 0.3,
                  duration: 0.6,
                  ease: 'easeOut',
                  staggerChildren: 0.1
                }
              }
            }}
          >
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                to={user ? "/report" : "/report-issue"}
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-yellow-500 to-amber-600 rounded-lg hover:shadow-lg hover:shadow-yellow-500/20 transition-all duration-300"
              >
                {user ? 'Report an Issue Now' : 'Get Started for Free'}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </motion.div>
            
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                to="/about"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-transparent border-2 border-white/30 rounded-lg hover:bg-white/10 transition-all duration-300"
              >
                Learn More
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="mt-8 text-sm text-white/70"
            initial={{ opacity: 0 }}
            whileInView={{ 
              opacity: 1,
              transition: { 
                delay: 0.5,
                duration: 0.6 
              } 
            }}
            viewport={{ once: true }}
          >
            No credit card required • 100% free to use
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;