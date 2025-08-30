import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Send, Upload, X } from "lucide-react";
import { apiService } from "../../services/api.ts";
import {
  ethiopianRegions,
  ethiopianCities,
  ethiopianBusStations,
  reportTypes,
} from "../../data/ethiopianData.ts";

interface IssueReportFormData {
  type: string;
  description: string;
  startingStation: string;
  destinationStation: string;
  locationRegion?: string;
  locationCity?: string;
  dateTime: string;
  attachments?: FileList;
}

interface FileWithPreview {
  file: File;
  preview: string;
  id: string;
}

const IssueReportForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileWithPreview[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<IssueReportFormData>({
    defaultValues: {
      type: "",
      description: "",
      startingStation: "",
      destinationStation: "",
      locationRegion: "",
      locationCity: "",
      dateTime: "",
    },
  });
  const now = new Date();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles: FileWithPreview[] = Array.from(files).map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        id: Math.random().toString(36).substr(2, 9),
      }));
      setSelectedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (id: string) => {
    setSelectedFiles((prev) => {
      const fileToRemove = prev.find((f) => f.id === id);
      if (fileToRemove) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter((f) => f.id !== id);
    });
  };

  const handleRegionChange = (region: string) => {
    setSelectedRegion(region);
    setValue("locationRegion", region);
    setValue("locationCity", ""); // Reset city when region changes
  };

  const onSubmit = async (data: IssueReportFormData) => {
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("type", data.type);
      formData.append("description", data.description);
      formData.append("startingStation", data.startingStation);
      formData.append("destinationStation", data.destinationStation);
      if (data.locationRegion) {
        formData.append("locationRegion", data.locationRegion);
      }
      if (data.locationCity) {
        formData.append("locationCity", data.locationCity);
      }
      formData.append("dateTime", new Date(now).toISOString());
      formData.append("submittedByRole", "guest");

      // Add attachments
      selectedFiles.forEach((fileObj, index) => {
        formData.append(`attachments`, fileObj.file);
      });

      // Submit to backend API
      await apiService.submitReportWithAttachments(formData);

      toast.success(
        "Report submitted successfully! Authorities have been notified."
      );

      // Clean up
      selectedFiles.forEach((fileObj) => {
        URL.revokeObjectURL(fileObj.preview);
      });
      setSelectedFiles([]);
      setSelectedRegion("");
      reset();
    } catch (error) {
      console.error("Report submission error:", error);
      toast.error("Failed to submit report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl my-20 mx-auto">
      <div className="card">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Report Transportation Issue
          </h2>
          <p className="text-gray-600">
            Help improve public transportation by reporting issues anonymously
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Issue Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              What type of issue are you reporting? *
            </label>
            <select
              {...register("type", {
                required: "Please select an issue type",
              })}
              className="input-field"
            >
              <option value="">Select issue type...</option>
              {reportTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label} - {type.description}
                </option>
              ))}
            </select>
            {errors.type && (
              <p className="mt-2 text-sm text-red-600">{errors.type.message}</p>
            )}
          </div>

          {/* Date/Time */}
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Incident Date & Time *
            </label>
            <input
              type="datetime-local"
              {...register("dateTime", {
                required: "Date and time is required",
              })}
              className="input-field"
            />
            {errors.dateTime && (
              <p className="mt-2 text-sm text-red-600">
                {errors.dateTime.message}
              </p>
            )}
          </div> */}

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Detailed Description *
            </label>
            <textarea
              {...register("description", {
                required: "Description is required",
                minLength: {
                  value: 20,
                  message: "Description must be at least 20 characters",
                },
              })}
              rows={4}
              className="input-field"
              placeholder="Please provide detailed information about the issue..."
            />
            {errors.description && (
              <p className="mt-2 text-sm text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Location Information */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Starting Station *
              </label>
              <select
                {...register("startingStation", {
                  required: "Starting station is required",
                })}
                className="input-field"
              >
                <option value="">Select starting station...</option>
                {ethiopianBusStations.map((station) => (
                  <option key={station} value={station}>
                    {station}
                  </option>
                ))}
              </select>
              {errors.startingStation && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.startingStation.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Destination Station *
              </label>
              <select
                {...register("destinationStation", {
                  required: "Destination station is required",
                })}
                className="input-field"
              >
                <option value="">Select destination station...</option>
                {ethiopianBusStations.map((station) => (
                  <option key={station} value={station}>
                    {station}
                  </option>
                ))}
              </select>
              {errors.destinationStation && (
                <p className="mt-2 text-sm text-red-600">
                  {errors.destinationStation.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Region
                </label>
                <select
                  value={selectedRegion}
                  onChange={(e) => handleRegionChange(e.target.value)}
                  className="input-field"
                >
                  <option value="">Select region...</option>
                  {ethiopianRegions.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <select
                  {...register("locationCity")}
                  className="input-field"
                  disabled={!selectedRegion}
                >
                  <option value="">Select city...</option>
                  {selectedRegion &&
                    ethiopianCities[
                      selectedRegion as keyof typeof ethiopianCities
                    ]?.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>

          {/* File Attachments */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Attachments (Optional)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                multiple
                accept="image/*,video/*,.pdf"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <Upload className="w-8 h-8 text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">
                  Click to upload files (Images, Videos, PDFs)
                </span>
                <span className="text-xs text-gray-500 mt-1">
                  Maximum 5 files, 10MB each
                </span>
              </label>
            </div>

            {/* File Preview */}
            {selectedFiles.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Selected Files:
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {selectedFiles.map((fileObj) => (
                    <div
                      key={fileObj.id}
                      className="relative border rounded-lg p-2"
                    >
                      {fileObj.file.type.startsWith("image/") ? (
                        <img
                          src={fileObj.preview}
                          alt={fileObj.file.name}
                          className="w-full h-20 object-cover rounded"
                        />
                      ) : (
                        <div className="w-full h-20 bg-gray-100 rounded flex items-center justify-center">
                          <span className="text-xs text-gray-500">
                            {fileObj.file.type.includes("pdf") ? "PDF" : "File"}
                          </span>
                        </div>
                      )}
                      <p className="text-xs text-gray-600 mt-1 truncate">
                        {fileObj.file.name}
                      </p>
                      <button
                        type="button"
                        onClick={() => removeFile(fileObj.id)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
