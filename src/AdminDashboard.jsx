import React, { useState, useEffect } from 'react';
import { 
  Lock, Users, TrendingUp, Calendar, Download, Search, 
  Trash2, LogOut, RefreshCw, Mail, CheckCircle, XCircle,
  AlertCircle, BarChart3, Activity, Loader, Clock
} from 'lucide-react';

const API_URL = 'https://mindcare-backend-production.up.railway.app/api';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Dashboard data
  const [stats, setStats] = useState(null);
  const [entries, setEntries] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 });
  const [filters, setFilters] = useState({ status: 'all', search: '' });
  
  // Loading states
  const [statsLoading, setStatsLoading] = useState(false);
  const [entriesLoading, setEntriesLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);

  // Check if already authenticated
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      verifyToken(token);
    } else {
      setIsInitializing(false);
    }
  }, []);

  // Verify token
  const verifyToken = async (token) => {
    try {
      const response = await fetch(`${API_URL}/admin/verify`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setIsAuthenticated(true);
        loadDashboardData(token);
      } else {
        localStorage.removeItem('adminToken');
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error('Token verification failed:', err);
      localStorage.removeItem('adminToken');
      setIsAuthenticated(false);
    } finally {
      setIsInitializing(false);
    }
  };

  // Login handler
  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setError('');
    setLoginLoading(true);

    try {
      const response = await fetch(`${API_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('adminToken', data.data.token);
        setIsAuthenticated(true);
        setPassword('');
        loadDashboardData(data.data.token);
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Connection failed. Please check your internet and try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    setEmail('');
    setPassword('');
    setStats(null);
    setEntries([]);
  };

  // Load dashboard data
  const loadDashboardData = async (token) => {
    const authToken = token || localStorage.getItem('adminToken');
    
    // Load stats
    setStatsLoading(true);
    try {
      const statsResponse = await fetch(`${API_URL}/admin/stats`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData.data);
      } else if (statsResponse.status === 401) {
        handleLogout();
      }
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setStatsLoading(false);
    }

    // Load entries
    loadEntries(authToken);
  };

  // Load entries with pagination and filters
  const loadEntries = async (token, page = 1) => {
    const authToken = token || localStorage.getItem('adminToken');
    setEntriesLoading(true);
    
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        ...(filters.status !== 'all' && { status: filters.status }),
        ...(filters.search && { search: filters.search })
      });

      const response = await fetch(`${API_URL}/admin/entries?${params}`, {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });

      if (response.ok) {
        const data = await response.json();
        setEntries(data.data.entries);
        setPagination(data.data.pagination);
      } else if (response.status === 401) {
        handleLogout();
      }
    } catch (err) {
      console.error('Failed to load entries:', err);
    } finally {
      setEntriesLoading(false);
    }
  };

  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    loadEntries(null, 1);
  };

  // Export to CSV
  const handleExport = async () => {
    const token = localStorage.getItem('adminToken');
    const params = new URLSearchParams(filters.status !== 'all' ? { status: filters.status } : {});
    
    setExportLoading(true);
    try {
      const response = await fetch(`${API_URL}/admin/export?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `mindcare-waitlist-${Date.now()}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('Export failed. Please try again.');
      }
    } catch (err) {
      console.error('Export failed:', err);
      alert('Export failed. Please check your connection and try again.');
    } finally {
      setExportLoading(false);
    }
  };

  // Delete entry
  const handleDelete = async (id, email) => {
    if (!confirm(`Are you sure you want to delete ${email}?`)) return;
    
    const token = localStorage.getItem('adminToken');
    setDeleteLoading(id);
    
    try {
      const response = await fetch(`${API_URL}/admin/entries/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        loadEntries(token, pagination.page);
        loadDashboardData(token);
      } else {
        alert('Delete failed. Please try again.');
      }
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Delete failed. Please check your connection and try again.');
    } finally {
      setDeleteLoading(null);
    }
  };

  // Initial loading screen
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-emerald-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">MindCare Admin</h1>
            <p className="text-gray-600">Sign in to access the dashboard</p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="space-y-6">
              {error && (
                <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-2 text-red-700 animate-fade-in">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                  disabled={loginLoading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  placeholder="admin@mindcare.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                  disabled={loginLoading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  placeholder="••••••••"
                />
              </div>

              <button
                onClick={handleLogin}
                disabled={loginLoading}
                className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {loginLoading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard Screen
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">MindCare Admin</h1>
                <p className="text-sm text-gray-600">Waitlist Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => loadDashboardData()}
                disabled={statsLoading || entriesLoading}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg flex items-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`w-4 h-4 ${(statsLoading || entriesLoading) ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Grid */}
        {statsLoading && !stats ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
                <div className="w-12 h-12 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-20 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
            ))}
          </div>
        ) : stats ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                icon={Users}
                label="Total Signups"
                value={stats.overview.total}
                color="blue"
              />
              <StatCard
                icon={CheckCircle}
                label="Confirmed"
                value={stats.overview.confirmed}
                color="green"
              />
              <StatCard
                icon={TrendingUp}
                label="This Week"
                value={stats.timeStats.thisWeek}
                color="purple"
              />
              <StatCard
                icon={Calendar}
                label="Today"
                value={stats.timeStats.today}
                color="orange"
              />
            </div>

            {/* Growth Trend */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-emerald-600" />
                7-Day Growth Trend
              </h2>
              <div className="flex items-end space-x-2 h-48">
                {stats.growthTrend.map((day, idx) => {
                  const maxCount = Math.max(...stats.growthTrend.map(d => d.count), 1);
                  const height = (day.count / maxCount * 100) || 5;
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center group">
                      <div 
                        className="w-full bg-emerald-500 rounded-t-lg transition-all hover:bg-emerald-600 cursor-pointer relative"
                        style={{ height: `${height}%`, minHeight: '4px' }}
                      >
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {day.count} signup{day.count !== 1 ? 's' : ''}
                        </div>
                      </div>
                      <span className="text-xs text-gray-600 mt-2">{new Date(day.date).getDate()}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        ) : null}

        {/* Filters and Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 gap-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  onKeyPress={(e) => e.key === 'Enter' && handleFilterChange(filters)}
                  placeholder="Search by email..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 bg-white"
                />
              </div>

              <select
                value={filters.status}
                onChange={(e) => handleFilterChange({ ...filters, status: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
              >
                <option value="all">All Status</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="unsubscribed">Unsubscribed</option>
              </select>
            </div>

            <button
              onClick={handleExport}
              disabled={exportLoading}
              className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center justify-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {exportLoading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  <span>Exporting...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Export CSV</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Entries Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {entriesLoading ? (
            <div className="p-12 flex items-center justify-center">
              <div className="text-center">
                <Loader className="w-8 h-8 text-emerald-600 animate-spin mx-auto mb-3" />
                <p className="text-gray-600">Loading entries...</p>
              </div>
            </div>
          ) : entries.length === 0 ? (
            <div className="p-12 text-center">
              <Mail className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No entries found</p>
              {filters.search && (
                <p className="text-sm text-gray-500 mt-2">Try adjusting your search or filters</p>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Signup Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {entries.map((entry) => (
                      <tr key={entry._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Mail className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                            <span className="text-sm text-gray-900">{entry.email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={entry.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-600">
                            <Clock className="w-3 h-3 mr-1 text-gray-400" />
                            {new Date(entry.createdAt).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">
                          {entry.ipAddress || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleDelete(entry._id, entry.email)}
                            disabled={deleteLoading === entry._id}
                            className="text-red-600 hover:text-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Delete entry"
                          >
                            {deleteLoading === entry._id ? (
                              <Loader className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-sm text-gray-600">
                    Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} entries
                  </p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => loadEntries(null, pagination.page - 1)}
                      disabled={pagination.page === 1 || entriesLoading}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium text-gray-700"
                    >
                      Previous
                    </button>
                    <div className="flex items-center px-3 text-sm text-gray-600">
                      Page {pagination.page} of {pagination.pages}
                    </div>
                    <button
                      onClick={() => loadEntries(null, pagination.page + 1)}
                      disabled={pagination.page === pagination.pages || entriesLoading}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium text-gray-700"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

// Stat Card Component
function StatCard({ icon: Icon, label, value, color }) {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-emerald-500 to-teal-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600'
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-br ${colorClasses[color]} rounded-lg flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      <p className="text-3xl font-bold text-gray-900 mb-1">{value.toLocaleString()}</p>
      <p className="text-sm text-gray-600">{label}</p>
    </div>
  );
}

// Status Badge Component
function StatusBadge({ status }) {
  const styles = {
    confirmed: 'bg-green-100 text-green-700 border-green-200',
    pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    unsubscribed: 'bg-red-100 text-red-700 border-red-200'
  };

  const icons = {
    confirmed: CheckCircle,
    pending: AlertCircle,
    unsubscribed: XCircle
  };

  const Icon = icons[status] || AlertCircle;

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${styles[status] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
      <Icon className="w-3 h-3 mr-1" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
