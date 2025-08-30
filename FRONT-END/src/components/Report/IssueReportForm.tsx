import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import {  
  DollarSign, 
  Bus, 
  Droplets, 
  Car, 
  MapPin, 
  Send,
  Phone,
  Mail
} from 'lucide-react';
import { IssueReport } from '../../types';

interface IssueReportFormData {
  type: string;
  title: string;
  description: string;
  startStation: string;
  endStation: string;
  priority: string;
  contactInfo: {
    phone?: string;
    email?: string;
  };
}

const IssueReportForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<IssueReportFormData>({
    defaultValues: {
      type: '',
      title: '',
      description: '',
      startStation: '',
      endStation: '',
      priority: 'medium',
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
        location: {
          startStation: data.startStation,
          endStation: data.endStation
        }
      };

      // Store in localStorage for demo
      const existingReports = JSON.parse(localStorage.getItem('transport_reports') || '[]');
      existingReports.push({ ...report, id: Date.now().toString() });
      localStorage.setItem('transport_reports', JSON.stringify(existingReports));

      toast.success('Report submitted successfully! Authorities have been notified.');
      reset();

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

          {/* Station Information */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Starting Station
              </label>
              <div className="flex space-x-4">
                <input
                  type="text"
                  {...register('startStation', { 
                    required: 'Starting station is required'
                  })}
                  className="input-field flex-1"
                  placeholder="e.g., Central Station, Downtown Terminal"
                />
              </div>
              {errors.startStation && (
                <p className="mt-2 text-sm text-red-600">{errors.startStation.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Station
              </label>
              <div className="flex space-x-4">
                <input
                  type="text"
                  {...register('endStation', { 
                    required: 'End station is required'
                  })}
                  className="input-field flex-1"
                  placeholder="e.g., North Terminal, Market Square Station"
                />
              </div>
              {errors.endStation && (
                <p className="mt-2 text-sm text-red-600">{errors.endStation.message}</p>
              )}
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