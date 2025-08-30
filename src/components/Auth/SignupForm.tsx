import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Shield, Bus, Building, Eye, EyeOff, User, Phone } from "lucide-react";
import { apiService } from "../../services/api.ts";

interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
  role: "traffic_police" | "bus_station_manager";
  username: string;
  phoneNumber?: string;
  // Additional fields based on role
  licenceId?: string; // For traffic police
  location?: string; // For bus station managers
}

const SignupForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignupFormData>({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      role: "traffic_police",
      username: "",
      phoneNumber: "",
    },
  });

  const roles = [
    {
      value: "traffic_police" as const,
      label: "Traffic Police",
      icon: Shield,
      description: "View and manage assigned alerts",
      fields: ["licenceId", "phoneNumber", "location"],
    },
    {
      value: "bus_station_manager" as const,
      label: "Bus Station Manager",
      icon: Bus,
      description: "Track reports for your location",
      fields: ["phoneNumber", "location"],
    },
    {
      value: "transportation_office" as const,
      label: "Transportation Office",
      icon: Building,
      description: "Full dashboard access and analytics",
      fields: ["phoneNumber"],
    },
  ];

  const selectedRole = watch("role");

  const onSubmit = async (data: SignupFormData) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);
    try {
      const signupData = {
        email: data.email,
        password: data.password,
        role: data.role,
        username: data.username,
        phoneNumber: data.phoneNumber,
        ...(data.licenceId && { licenceId: data.licenceId }),
        ...(data.location && { location: data.location }),
      };

      await apiService.register(signupData);
      toast.success("Account created successfully. Please log in.");
      navigate("/login");
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Failed to create account. Please try again.");
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
          <h2 className="text-3xl font-bold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign up to access the Transport Issue Report system
          </p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select your role *
              </label>
              <div className="space-y-3">
                {roles.map((role) => (
                  <label
                    key={role.value}
                    className={`relative p-4 border-2 rounded-lg cursor-pointer transition-colors block ${
                      selectedRole === role.value
                        ? "border-primary-500 bg-primary-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <role.icon className="w-5 h-5 text-primary-600" />
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          {role.label}
                        </div>
                        <div className="text-sm text-gray-500">
                          {role.description}
                        </div>
                      </div>
                      <input
                        type="radio"
                        value={role.value}
                        {...register("role", {
                          required: "Please select a role",
                        })}
                        className="sr-only"
                      />
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  {...register("username", {
                    required: "Username is required",
                    minLength: {
                      value: 3,
                      message: "Username must be at least 3 characters",
                    },
                  })}
                  className="input-field pl-10"
                  placeholder="Enter username"
                />
              </div>
              {errors.username && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.username.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                className="input-field"
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="tel"
                  {...register("phoneNumber")}
                  className="input-field pl-10"
                  placeholder="+251 9XXXXXXXX"
                />
              </div>
            </div>

            {/* Licence ID - Only for Traffic Police */}
            {selectedRole === "traffic_police" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Licence ID *
                </label>
                <input
                  type="text"
                  {...register("licenceId", {
                    required: "Licence ID is required for traffic police",
                  })}
                  className="input-field"
                  placeholder="Enter your licence ID"
                />
                {errors.licenceId && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.licenceId.message}
                  </p>
                )}
              </div>
            )}

            {/* Location - For Traffic Police and Bus Station Managers */}
            {(selectedRole === "traffic_police" ||
              selectedRole === "bus_station_manager") && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  type="text"
                  {...register("location", {
                    required: "Location is required",
                  })}
                  className="input-field"
                  placeholder={
                    selectedRole === "traffic_police"
                      ? "e.g., Downtown District"
                      : "e.g., Central Bus Station"
                  }
                />
                {errors.location && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.location.message}
                  </p>
                )}
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "At least 6 characters" },
                  })}
                  className="input-field pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password *
              </label>
              <input
                type="password"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                })}
                className="input-field"
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex justify-center items-center"
            >
              {isLoading ? "Creating account..." : "Sign Up"}
            </button>

            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
