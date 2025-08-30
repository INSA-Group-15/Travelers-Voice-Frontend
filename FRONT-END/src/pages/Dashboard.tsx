import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { 
  Filter, 
  Search, 
  Calendar, 
  MapPin,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { IssueReport, DashboardStats as DashboardStatsType } from '../types';
import DashboardStats from '../components/Dashboard/DashboardStats.tsx';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [recentReports, setRecentReports] = useState<IssueReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState<DashboardStatsType | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockReports: IssueReport[] = [
        {
          id: '1',
          type: 'overpriced_fare',
          title: 'Driver charging 50% extra fare',
          description: 'Bus driver at Downtown Station charging $5 instead of $3.50 for standard fare.',
          status: 'pending',
          priority: 'high',
          reportedBy: 'Anonymous',
          reportedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          location: {
            startStation: 'Downtown Bus Station',
            endStation: 'Central Market'
          }
        },
        {
          id: '2',
          type: 'poor_service',
          title: 'Bus delayed by 45 minutes',
          description: 'Route 15 bus has been delayed for 45 minutes with no explanation or updates.',
          status: 'in_progress',
          priority: 'medium',
          reportedBy: 'Anonymous',
          reportedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
          location: {
            startStation: 'Central Station',
            endStation: 'Uptown Terminal'
          }
        },
        {
          id: '3',
          type: 'gas_station',
          title: 'Gas station out of fuel',
          description: 'The gas station at North Terminal has been out of fuel for 2 days.',
          status: 'resolved',
          priority: 'high',
          reportedBy: 'Anonymous',
          reportedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
          location: {
            startStation: 'North Terminal',
            endStation: 'East Station'
          }
        },
        {
          id: '4',
          type: 'traffic_accident',
          title: 'Minor collision at intersection',
          description: 'Two buses had a minor collision at the intersection near South Terminal.',
          status: 'urgent',
          priority: 'critical',
          reportedBy: 'Anonymous',
          reportedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
          location: {
            startStation: 'South Terminal',
            endStation: 'West Station'
          }
        }
      ];

      // Generate dashboard stats
      const generateDashboardStats = (reports: IssueReport[]): DashboardStatsType => {
        // Count reports by status
        const pendingReports = reports.filter(r => r.status === 'pending').length;
        const resolvedReports = reports.filter(r => r.status === 'resolved').length;
        const urgentReports = reports.filter(r => r.status === 'urgent').length;
        
        // Count reports by type
        const reportsByType: Record<string, number> = {};
        reports.forEach(report => {
          reportsByType[report.type] = (reportsByType[report.type] || 0) + 1;
        });
        
        // Count reports by location (using route: startStation to endStation)
        const reportsByLocation: Record<string, number> = {};
        reports.forEach(report => {
          if (report.location) {
            const routeKey = `${report.location.startStation} to ${report.location.endStation}`;
            reportsByLocation[routeKey] = (reportsByLocation[routeKey] || 0) + 1;
          }
        });
        
        return {
          totalReports: reports.length,
          pendingReports,
          resolvedReports,
          urgentReports,
          reportsByType,
          reportsByLocation,
          averageResolutionTime: 24.5 // Mock value in hours
        };
      };

      const stats = generateDashboardStats(mockReports);
      
      setRecentReports(mockReports);
      setDashboardStats(stats);
      setIsLoading(false);
    };

    loadDashboardData();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'in_progress':
        return <AlertTriangle className="w-4 h-4 text-blue-600" />;
      case 'resolved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'urgent':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'critical':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: string) => {
    return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const filteredReports = recentReports
    .filter(report =>
      searchTerm === '' ||
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(report =>
      statusFilter === 'all' || report.status === statusFilter
    );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}
          </h1>
          <p className="text-gray-600">
            {user?.role === 'transportation_office' && 'Full dashboard access and analytics'}
            {user?.role === 'traffic_police' && 'View and manage assigned alerts'}
            {user?.role === 'bus_station_manager' && 'Track reports for your location'}
          </p>
        </div>

        {dashboardStats && <DashboardStats stats={dashboardStats} />}

        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Reports</h2>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search reports..."
                  className="input-field pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <select
                  className="input-field pl-10 appearance-none bg-white"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {filteredReports.length > 0 ? (
              filteredReports.map((report) => (
              <div key={report.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      {getStatusIcon(report.status)}
                      <h3 className="font-semibold text-gray-900">{report.title}</h3>
                      <span className={`status-badge ${getPriorityColor(report.priority)}`}>
                        {report.priority}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{report.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{report.location ? `${report.location.startStation} to ${report.location.endStation}` : 'Route not specified'}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{report.reportedAt.toLocaleDateString()}</span>
                      </div>
                      <span className="text-primary-600 font-medium">
                        {getTypeLabel(report.type)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                      View Details
                    </button>
                    {report.status === 'pending' && (
                      <button className="btn-primary text-sm px-3 py-1">
                        Assign
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
            ) : (
              <div className="text-center py-12">
                <Search className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No reports found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your search or filter to find what you're looking for.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;