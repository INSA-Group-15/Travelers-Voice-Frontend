import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { 
  AlertTriangle, 
  DollarSign, 
  Bus, 
  Droplets, 
  Car, 
  MapPin, 
  Upload, 
  Send,
  Phone,
  Mail
} from 'lucide-react';
import { IssueReport } from '../../types';

interface IssueReportFormData {
  type: string;
  title: string;
  description: string;
  location: string;
  priority: string;
  contactInfo: {
    phone?: string;
    email?: string;
  };
  shareLocation: boolean;
}

const IssueReportForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<IssueReportFormData>({
    defaultValues: {
      type: '',
      title: '',
      description: '',
      location: '',
      priority: 'medium',
      shareLocation: false,
      contactInfo: {
        phone: '',
        email: ''
      }
    }
  });

  const issueTypes = [
    { value: 'overpriced_fare', label: 'Overpriced Fare', icon: DollarSign, color: 'text-red-500' },
    { value: 'poor_service', label: 'Poor Service', icon: Bus, color: 'text-yellow-500' },
    { value: 'gas_station', label: 'Gas Station Issue', icon: Droplets, color: 'text-blue-500' },
    { value: 'traffic_accident', label: 'Traffic Accident', icon: Car, color: 'text-red-600' },
  ];

  const priorityLevels = [
    { value: 'low', label: 'Low', color: 'bg-green-100 text-green-800' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800' },
    { value: 'critical', label: 'Critical', color: 'bg-red-100 text-red-800' },
  ];

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          toast.success('Location captured successfully!');
        },
        (error) => {
          toast.error('Unable to get location. Please enter manually.');
        }
      );
    } else {
      toast.error('Geolocation is not supported by this browser.');
    }
  };

  const onSubmit = async (data: IssueReportFormData) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const report: Partial<IssueReport> = {
        type: data.type as any,
        title: data.title,
        description: data.description,
        status: 'pending',
        priority: data.priority as any,
        reportedBy: 'Anonymous',
        reportedAt: new Date(),
        contactInfo: data.contactInfo,
        location: data.shareLocation && currentLocation ? {
          latitude: currentLocation.lat,
          longitude: currentLocation.lng,
          address: data.location
        } : undefined
      };

      // Store in localStorage for demo
      const existingReports = JSON.parse(localStorage.getItem('transport_reports') || '[]');
      existingReports.push({ ...report, id: Date.now().toString() });
      localStorage.setItem('transport_reports', JSON.stringify(existingReports));

      toast.success('Report submitted successfully! Authorities have been notified.');
      reset();
      setCurrentLocation(null);
    } catch (error) {
      toast.error('Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Report Transportation Issue</h2>
          <p className="text-gray-600">Help improve public transportation by reporting issues anonymously</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Issue Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              What type of issue are you reporting?
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {issueTypes.map((type) => (
                <label
                  key={type.value}
                  className={`relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    watch('type') === type.value
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    value={type.value}
                    {...register('type', { required: 'Please select an issue type' })}
                    className="sr-only"
                  />
                  <type.icon className={`w-6 h-6 mr-3 ${type.color}`} />
                  <span className="font-medium">{type.label}</span>
                </label>
              ))}
            </div>
            {errors.type && (
              <p className="mt-2 text-sm text-red-600">{errors.type.message}</p>
            )}
          </div>

          {/* Title and Description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brief Title *
              </label>
              <input
                type="text"
                {...register('title', { 
                  required: 'Title is required',
                  minLength: { value: 5, message: 'Title must be at least 5 characters' }
                })}
                className="input-field"
                placeholder="e.g., Driver charging extra fare"
              />
              {errors.title && (
                <p className="mt-2 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority Level
              </label>
              <select {...register('priority')} className="input-field">
                {priorityLevels.map((priority) => (
                  <option key={priority.value} value={priority.value}>
                    {priority.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Detailed Description *
            </label>
            <textarea
              {...register('description', { 
                required: 'Description is required',
                minLength: { value: 20, message: 'Description must be at least 20 characters' }
              })}
              rows={4}
              className="input-field"
              placeholder="Please provide detailed information about the issue..."
            />
            {errors.description && (
              <p className="mt-2 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          {/* Location */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location Information
              </label>
              <div className="flex space-x-4">
                <input
                  type="text"
                  {...register('location')}
                  className="input-field flex-1"
                  placeholder="e.g., Downtown Bus Station, Central Market"
                />
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Get Location</span>
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                {...register('shareLocation')}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <label className="text-sm text-gray-700">
                Share my current location (optional)
              </label>
            </div>

            {currentLocation && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-green-800">
                    Location captured: {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Contact Information (Optional) */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information (Optional)</h3>
            <p className="text-sm text-gray-600 mb-4">
              Provide your contact details if you'd like to be updated about the resolution of your report.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    {...register('contactInfo.phone')}
                    className="input-field pl-10"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    {...register('contactInfo.email')}
                    className="input-field pl-10"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary flex items-center space-x-2 px-8 py-3 text-lg"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Submit Report</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IssueReportForm; 