const API_BASE_URL = "http://localhost:3000/api";

export interface ReportSubmissionData {
  type: string;
  description: string;
  startingStation: string;
  destinationStation: string;
  locationRegion?: string;
  locationCity?: string;
  dateTime: string;
  submittedByRole: string;
}

export interface LoginData {
  email: string;
  password: string;
  role: string;
}

export interface SignupData extends LoginData {
  username: string;
  phoneNumber?: string;
  licenceId?: string;
  location?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    role: string;
    username?: string;
  };
}

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem("accessToken");

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  private mapFrontendRoleToApiRole(
    frontendRole: string
  ): "admin" | "user" | "bus-station" {
    switch (frontendRole) {
      case "traffic_police":
        return "user";
      case "bus_station_manager":
        return "bus-station";
      case "transportation_office":
        return "admin";
      default:
        return "user";
    }
  }

  // Authentication endpoints
  async login(data: LoginData): Promise<AuthResponse> {
    const apiRole = this.mapFrontendRoleToApiRole(data.role);
    const endpoint = `/auth/${apiRole}/login`;
    return this.request<AuthResponse>(endpoint, {
      method: "POST",
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      }),
    });
  }

  async register(data: SignupData): Promise<AuthResponse> {
    const apiRole = this.mapFrontendRoleToApiRole(data.role);
    const endpoint = `/auth/${apiRole}/register`;
    console.log(data);
    return this.request<AuthResponse>(endpoint, {
      method: "POST",
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        username: data.username,
        phoneNumber: data.phoneNumber,
        licenceId: data.licenceId,
        location: data.location,
        role: data.role, // Send the role for proper validation
      }),
    });
  }

  async refreshToken(): Promise<AuthResponse> {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    return this.request<AuthResponse>("/auth/refresh-token", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    });
  }

  // Report endpoints
  async submitReport(data: ReportSubmissionData): Promise<any> {
    return this.request("/reports", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async submitReportWithAttachments(formData: FormData): Promise<any> {
    const url = `${this.baseURL}/reports`;
    const token = localStorage.getItem("accessToken");

    const config: RequestInit = {
      method: "POST",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  async getReports(filters?: any): Promise<any[]> {
    const queryParams = filters
      ? `?${new URLSearchParams(filters).toString()}`
      : "";
    return this.request<any[]>(`/reports${queryParams}`);
  }

  async getReport(id: string): Promise<any> {
    return this.request<any>(`/reports/${id}`);
  }

  async updateReport(
    id: string,
    data: Partial<ReportSubmissionData>
  ): Promise<any> {
    return this.request(`/reports/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteReport(id: string): Promise<void> {
    return this.request(`/reports/${id}`, {
      method: "DELETE",
    });
  }

  async assignReport(
    reportId: string,
    assigneeId: string,
    assigneeType: "user" | "station"
  ): Promise<any> {
    return this.request(`/reports/${reportId}/assign`, {
      method: "POST",
      body: JSON.stringify({
        assigneeId,
        assigneeType,
      }),
    });
  }

  // Admin endpoints
  async getUsers(): Promise<any[]> {
    return this.request<any[]>("/admin/users");
  }

  async getBusStations(): Promise<any[]> {
    return this.request<any[]>("/admin/bus-stations");
  }

  async getStats(): Promise<any> {
    return this.request<any>("/admin/stats");
  }

  async updateUserStatus(userId: string, status: string): Promise<any> {
    return this.request(`/admin/users/${userId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  }

  async updateBusStationStatus(
    stationId: string,
    status: string
  ): Promise<any> {
    return this.request(`/admin/bus-stations/${stationId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  }
}

export const apiService = new ApiService();
export default apiService;
