import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext.tsx';
import { 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  Shield, 
  Bus, 
  Building,
  AlertCircle
} from 'lucide-react';

interface LoginFormData {
  email: string;
  password: string;
  role: string;
}

const LoginForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const { register, handleSubmit, formState: { errors }, watch } = useForm<LoginFormData>({
    defaultValues: {
      email: '',
      password: '',
      role: ''
    }
  });

  const roles = [
    {
      value: 'traffic_police',
      label: 'Traffic Police',
      icon: Shield,
      description: 'View and manage assigned alerts',
      demoEmail: 'police@transport.gov',
      demoPassword: 'password123'
    },
    {
      value: 'bus_station_manager',
      label: 'Bus Station Manager',
      icon: Bus,
      description: 'Track reports for your location',
      demoEmail: 'manager@busstation.com',
      demoPassword: 'password123'
    },
    {
      value: 'transportation_office',
      label: 'Transportation Office',
      icon: Building,
      description: 'Full dashboard access and analytics',
      demoEmail: 'admin@transport.gov',
      demoPassword: 'password123'
    }
  ];

  const selectedRole = watch('role');
  const currentRole = roles.find(role => role.value === selectedRole);

  const fillDemoCredentials = (role: typeof roles[0]) => {
    const form = document.querySelector('form') as HTMLFormElement;
    if (form) {
      const emailInput = form.querySelector('input[name="email"]') as HTMLInputElement;
      const passwordInput = form.querySelector('input[name="password"]') as HTMLInputElement;
      const roleInput = form.querySelector('select[name="role"]') as HTMLSelectElement;
      
      if (emailInput && passwordInput && roleInput) {
        emailInput.value = role.demoEmail;
        passwordInput.value = role.demoPassword;
        roleInput.value = role.value;
        
        // Trigger form validation
        emailInput.dispatchEvent(new Event('input', { bubbles: true }));
        passwordInput.dispatchEvent(new Event('input', { bubbles: true }));
        roleInput.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
  };

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    
    try {
      const success = await login(data.email, data.password, data.role);
      
      if (success) {
        toast.success('Login successful!');
        navigate('/dashboard');
      } else {
        toast.error('Invalid credentials. Please try again.');
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Sign in to your account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Access the Transport Issue Report system
          </p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select your role
              </label>
              <div className="space-y-3">
                {roles.map((role) => (
                  <div
                    key={role.value}
                    className={`relative p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      selectedRole === role.value
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => {
                      const roleSelect = document.querySelector('select[name="role"]') as HTMLSelectElement;
                      if (roleSelect) {
                        roleSelect.value = role.value;
                        roleSelect.dispatchEvent(new Event('change', { bubbles: true }));
                      }
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <role.icon className="w-5 h-5 text-primary-600" />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{role.label}</div>
                        <div className="text-sm text-gray-500">{role.description}</div>
                      </div>
                    </div>

                

                  </div>
                ))}
              </div>
              <select
                {...register('role', { required: 'Please select a role' })}
                className="sr-only"
              >
                <option value="">Select Role</option>
                {roles.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
              {errors.role && (
                <p className="mt-2 text-sm text-red-600">{errors.role.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  className="input-field pl-10"
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' }
                  })}
                  className="input-field pl-10 pr-10"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* Demo Credentials Info */}
            {currentRole && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">Demo Credentials for {currentRole.label}:</p>
                    <p className="mt-1">
                      Email: <code className="bg-blue-100 px-1 rounded">{currentRole.demoEmail}</code><br />
                      Password: <code className="bg-blue-100 px-1 rounded">{currentRole.demoPassword}</code>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-3 text-lg"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing in...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              New to Travelers' Voice?{' '}
              <Link to="/learn-more" className="font-medium text-primary-600 hover:text-primary-500">
                Learn more
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;