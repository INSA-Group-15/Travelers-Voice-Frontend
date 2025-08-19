import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  MapPin,
  Users
} from 'lucide-react';
import { DashboardStats as DashboardStatsType } from '../../types';

interface DashboardStatsProps {
  stats: DashboardStatsType;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => {
  const statusColors = {
    pending: '#f59e0b',
    resolved: '#10b981',
    urgent: '#ef4444',
    in_progress: '#3b82f6'
  };

  const typeColors = {
    overpriced_fare: '#ef4444',
    poor_service: '#f59e0b',
    gas_station: '#3b82f6',
    traffic_accident: '#8b5cf6'
  };

  const statusData = [
    { name: 'Pending', value: stats.pendingReports, color: statusColors.pending },
    { name: 'Resolved', value: stats.resolvedReports, color: statusColors.resolved },
    { name: 'Urgent', value: stats.urgentReports, color: statusColors.urgent },
  ];

  const typeData = Object.entries(stats.reportsByType).map(([type, count]) => ({
    name: type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    value: count,
    color: typeColors[type as keyof typeof typeColors] || '#6b7280'
  }));

  const locationData = Object.entries(stats.reportsByLocation).map(([location, count]) => ({
    name: location.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
    value: count
  }));

  const timeData = [
    { day: 'Mon', reports: 12 },
    { day: 'Tue', reports: 19 },
    { day: 'Wed', reports: 15 },
    { day: 'Thu', reports: 22 },
    { day: 'Fri', reports: 28 },
    { day: 'Sat', reports: 18 },
    { day: 'Sun', reports: 14 },
  ];

  const statCards = [
    {
      title: 'Total Reports',
      value: stats.totalReports,
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Pending',
      value: stats.pendingReports,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: 'Resolved',
      value: stats.resolvedReports,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Urgent',
      value: stats.urgentReports,
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.title} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Status Distribution */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center space-x-4 mt-4">
            {statusData.map((item) => (
              <div key={item.name} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm text-gray-600">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Issue Types */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Reports by Issue Type</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={typeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Weekly Trend */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Report Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={timeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="reports" 
              stroke="#3b82f6" 
              strokeWidth={3}
              dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Location Distribution */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Reports by Location</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={locationData} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={120} />
            <Tooltip />
            <Bar dataKey="value" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card text-center">
          <div className="text-3xl font-bold text-primary-600 mb-2">
            {stats.averageResolutionTime.toFixed(1)}h
          </div>
          <p className="text-sm text-gray-600">Average Resolution Time</p>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {((stats.resolvedReports / stats.totalReports) * 100).toFixed(1)}%
          </div>
          <p className="text-sm text-gray-600">Resolution Rate</p>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {Object.keys(stats.reportsByLocation).length}
          </div>
          <p className="text-sm text-gray-600">Active Locations</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;