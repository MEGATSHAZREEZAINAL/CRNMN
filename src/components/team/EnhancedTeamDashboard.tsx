import React, { useState, useEffect } from 'react';
import { useTeam } from '../../contexts/TeamContext';
import {
  Users,
  UserPlus,
  MessageSquare,
  Bell,
  CheckCircle,
  Clock,
  TrendingUp,
  Award,
} from 'lucide-react';

const EnhancedTeamDashboard: React.FC = () => {
  const {
    members,
    tasks,
    notifications,
    performance,
    loading,
    error,
    refreshAll,
    refreshMembers,
    refreshTasks,
    refreshNotifications,
    loadPerformanceData,
    getUnreadNotificationsCount,
    getActiveTasks,
  } = useTeam();
  
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-500 bg-red-50';
      case 'high':
        return 'text-orange-500 bg-orange-50';
      case 'medium':
        return 'text-yellow-500 bg-yellow-50';
      case 'low':
        return 'text-green-500 bg-green-50';
      default:
        return 'text-gray-500 bg-gray-50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-500 bg-green-50';
      case 'in-progress':
        return 'text-blue-500 bg-blue-50';
      case 'review':
        return 'text-purple-500 bg-purple-50';
      case 'todo':
        return 'text-gray-500 bg-gray-50';
      default:
        return 'text-gray-500 bg-gray-50';
    }
  };

  if (loading && (!members.length && !tasks.length)) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin w-8 h-8 border-2 border-brand-electric border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Team Data</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => refreshAll()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const completedTasks = tasks.filter((task) => task.status === 'completed').length;
  const activeTasks = getActiveTasks().length;
  const unreadNotifications = getUnreadNotificationsCount();
  const overdueTasks = tasks.filter(
    (task) => task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed',
  ).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Enhanced Team Management</h1>
          <p className="text-dark-300 font-mono">Collaboration & Performance Hub</p>
        </div>
        <button className="bg-brand-electric text-dark-900 px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors flex items-center gap-2">
          <UserPlus className="w-4 h-4" />
          Invite Member
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <span className="text-2xl font-bold text-white">{members.length}</span>
          </div>
          <h3 className="text-dark-300 font-medium">Team Members</h3>
          <p className="text-sm text-dark-400 mt-1">
            Active: {members.filter((m) => m.status === 'active').length}
          </p>
        </div>

        <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-400" />
            </div>
            <span className="text-2xl font-bold text-white">{completedTasks}</span>
          </div>
          <h3 className="text-dark-300 font-medium">Completed Tasks</h3>
          <p className="text-sm text-dark-400 mt-1">This month</p>
        </div>

        <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-yellow-500/20 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-400" />
            </div>
            <span className="text-2xl font-bold text-white">{activeTasks}</span>
          </div>
          <h3 className="text-dark-300 font-medium">Active Tasks</h3>
          <p className="text-sm text-dark-400 mt-1">In progress</p>
        </div>

        <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <Bell className="w-6 h-6 text-red-400" />
            </div>
            <span className="text-2xl font-bold text-white">{overdueTasks}</span>
          </div>
          <h3 className="text-dark-300 font-medium">Overdue Tasks</h3>
          <p className="text-sm text-dark-400 mt-1">Need attention</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-dark-800 rounded-lg p-1 border border-dark-700">
        {[
          { id: 'overview', label: 'Overview', icon: TrendingUp },
          { id: 'members', label: 'Team Members', icon: Users },
          { id: 'tasks', label: 'Tasks', icon: CheckCircle },
          { id: 'chat', label: 'Team Chat', icon: MessageSquare },
          { id: 'performance', label: 'Performance', icon: Award },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-brand-electric text-dark-900'
                : 'text-dark-300 hover:text-white hover:bg-dark-700'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {tab.id === 'notifications' && unreadNotifications > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadNotifications}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-dark-800 rounded-xl border border-dark-700">
        {activeTab === 'overview' && (
          <div className="p-6 space-y-6">
            <h2 className="text-xl font-semibold text-white">Team Overview</h2>

            {/* Recent Activity */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Recent Activity</h3>
              <div className="space-y-3">
                {tasks.slice(0, 3).map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 bg-dark-700 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full ${task.status === 'completed' ? 'bg-green-400' : 'bg-blue-400'}`}
                      ></div>
                      <div>
                        <p className="text-white font-medium">{task.title}</p>
                        <p className="text-sm text-dark-300">
                          Assigned to {task.assignedTo.length} member
                          {task.assignedTo.length > 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}
                    >
                      {task.status.replace('-', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Team Performance Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Team Efficiency</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-dark-300">Task Completion Rate</span>
                    <span className="text-white font-medium">
                      {tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-dark-600 rounded-full h-2">
                    <div
                      className="bg-green-400 h-2 rounded-full"
                      style={{ width: `${tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'members' && (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Team Members</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {members.map((member) => (
                <div key={member.id} className="p-4 bg-dark-700 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-brand-electric to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-dark-900">
                        {member.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{member.name}</h3>
                      <p className="text-sm text-dark-300">{member.email}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-dark-300">Role</span>
                      <span className="text-white capitalize">{member.role}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dark-300">Department</span>
                      <span className="text-white">{member.department}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dark-300">Status</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          member.status === 'active'
                            ? 'text-green-400 bg-green-400/20'
                            : 'text-gray-400 bg-gray-400/20'
                        }`}
                      >
                        {member.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Team Tasks</h2>
            <div className="space-y-4">
              {tasks.map((task) => (
                <div key={task.id} className="p-4 bg-dark-700 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-white font-medium mb-2">{task.title}</h3>
                      <p className="text-dark-300 text-sm mb-3">{task.description}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span
                          className={`px-2 py-1 rounded-full font-medium ${getPriorityColor(task.priority)}`}
                        >
                          {task.priority}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full font-medium ${getStatusColor(task.status)}`}
                        >
                          {task.status.replace('-', ' ')}
                        </span>
                        {task.dueDate && (
                          <span className="text-dark-300">
                            Due: {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-dark-300">
                      Assigned to {task.assignedTo.length} team member
                      {task.assignedTo.length > 1 ? 's' : ''}
                    </div>
                    {task.tags && (
                      <div className="flex gap-2">
                        {task.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-dark-600 text-dark-300 rounded text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Team Chat</h2>
            <div className="bg-dark-700 rounded-lg p-4">
              <p className="text-center text-dark-300 py-8">
                Team chat feature will be implemented in the next phase
              </p>
            </div>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Team Performance</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {performance.map((perf) => {
                const member = members.find((m) => m.id === perf.memberId);
                return (
                  <div key={perf.memberId} className="p-4 bg-dark-700 rounded-lg">
                    <h3 className="text-white font-medium mb-4">
                      {member?.name || 'Unknown Member'}
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-dark-300">Tasks Completed</span>
                        <span className="text-white">
                          {perf.tasksCompleted}/{perf.tasksAssigned}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-dark-300">On-time Completion</span>
                        <span className="text-white">{perf.onTimeCompletion}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-dark-300">Avg. Completion Time</span>
                        <span className="text-white">{perf.avgCompletionTime}h</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-dark-300">Collaboration Score</span>
                        <span className="text-white">{perf.collaborationScore}/100</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedTeamDashboard;