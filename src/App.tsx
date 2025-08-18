import React, { Suspense, lazy, Component, ErrorInfo, ReactNode } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, AnimatePresenceProps } from 'framer-motion';
import { AuthProvider } from './context/AuthContext.tsx';
import { useAuth } from './context/AuthContext.tsx';
import { AlertCircle, Home as HomeIcon, RefreshCw } from 'lucide-react';

// Lazy load components for better performance
const Header = lazy(() => import('./components/Layout/Header.tsx'));
const Footer = lazy(() => import('./components/Layout/Footer.tsx'));
const Home = lazy(() => import('./pages/Home.tsx'));
const LoginForm = lazy(() => import('./components/Auth/LoginForm.tsx'));
const IssueReportForm = lazy(() => import('./components/Report/IssueReportForm.tsx'));
const Dashboard = lazy(() => import('./pages/Dashboard.tsx'));

// Error Boundary Component
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="max-w-md w-full text-center p-6 rounded-xl bg-white shadow-lg">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-6">
              We're sorry, but an unexpected error occurred. Please try refreshing the page or contact support if the issue persists.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center mx-auto"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Loading component
const LoadingSpinner = ({ fullScreen = true }: { fullScreen?: boolean }) => (
  <div className={`${fullScreen ? 'min-h-screen' : 'min-h-[50vh]'} flex items-center justify-center`}>
    <div className="flex flex-col items-center space-y-4">
      <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
);

// Animation variants for page transitions
const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1],
      when: 'beforeChildren',
      staggerChildren: 0.1
    } 
  },
  exit: { 
    opacity: 0, 
    y: -10,
    transition: { 
      duration: 0.2,
      ease: [0.4, 0, 1, 1]
    } 
  }
};

// Animation variants for page content
const contentVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1]
    } 
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

// Custom AnimatePresence with reduced motion support
const MotionAnimatePresence: React.FC<AnimatePresenceProps> = ({ children, ...props }) => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    return <>{children}</>;
  }
  
  return <AnimatePresence {...props}>{children}</AnimatePresence>;
};

// Protected route component with redirect and animation
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  
  if (isLoading) {
    return <LoadingSpinner fullScreen={false} />;
  }
  
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      className="flex-1 flex flex-col"
    >
      <motion.div 
        variants={contentVariants}
        className="flex-1 flex flex-col"
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

// Public route component with animation
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    initial="initial"
    animate="animate"
    exit="exit"
    variants={pageVariants}
    className="flex-1 flex flex-col"
  >
    <motion.div 
      variants={contentVariants}
      className="flex-1 flex flex-col"
    >
      {children}
    </motion.div>
  </motion.div>
);

// Main App component with animated routes and error boundary
const App: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  return (
    <ErrorBoundary>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100">
          <Suspense fallback={<LoadingSpinner />}>
            <Header />
            <main className="flex-1">
              <MotionAnimatePresence mode="wait" initial={false}>
                <Routes location={location} key={location.pathname.split('/')[1] || 'home'}>
                  <Route 
                    path="/" 
                    element={
                      <PublicRoute>
                        <Home />
                      </PublicRoute>
                    } 
                  />
                  <Route 
                    path="/login" 
                    element={
                      <PublicRoute>
                        <motion.div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                          <LoginForm />
                        </motion.div>
                      </PublicRoute>
                    } 
                  />
                  <Route 
                    path="/report-issue" 
                    element={
                      <ProtectedRoute>
                        <IssueReportForm />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/dashboard" 
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="*" 
                    element={
                      <PublicRoute>
                        <div className="flex-1 flex items-center justify-center p-4">
                          <div className="max-w-md w-full text-center p-8 bg-white rounded-xl shadow-lg">
                            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                              <HomeIcon className="w-8 h-8 text-primary-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h2>
                            <p className="text-gray-600 mb-6">
                              The page you're looking for doesn't exist or has been moved.
                            </p>
                            <button
                              onClick={() => navigate('/')}
                              className="px-6 py-2.5 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
                            >
                              Go to Homepage
                            </button>
                          </div>
                        </div>
                      </PublicRoute>
                    } 
                  />
                </Routes>
              </MotionAnimatePresence>
            </main>
            <Footer />
          </Suspense>
        </div>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
