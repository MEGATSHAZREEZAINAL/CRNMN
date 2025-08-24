import React, { useState, useEffect } from 'react';
import { useEcommerce } from '../../contexts/EcommerceContext';
import { useConfig } from '../../contexts/ConfigContext';
import {
  ShoppingBag,
  Package,
  ShoppingCart,
  TrendingUp,
  Plus,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
} from 'lucide-react';

export const EnhancedEcommerceDashboard: React.FC = () => {
  const {
    products,
    orders,
    categories,
    dashboardStats,
    loading,
    error,
    refreshAll,
    refreshProducts,
    refreshOrders,
    refreshCategories,
    refreshDashboardStats,
    getProductById,
    getOrderById,
    getCategoryById,
  } = useEcommerce();
  
  const { getFormattedCurrency } = useConfig();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-400 bg-green-400/20';
      case 'inactive':
        return 'text-gray-400 bg-gray-400/20';
      case 'out-of-stock':
        return 'text-red-400 bg-red-400/20';
      case 'pending':
        return 'text-yellow-400 bg-yellow-400/20';
      case 'confirmed':
        return 'text-blue-400 bg-blue-400/20';
      case 'delivered':
        return 'text-green-400 bg-green-400/20';
      case 'cancelled':
        return 'text-red-400 bg-red-400/20';
      default:
        return 'text-gray-400 bg-gray-400/20';
    }
  };

  const formatCurrency = (amount: number) => {
    return getFormattedCurrency(amount);
  };

  if (loading && (!products.length && !orders.length)) {
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
          <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading E-commerce Data</h3>
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Enhanced E-Commerce Management</h1>
          <p className="text-dark-300 font-mono">Online Store Operations Hub</p>
        </div>
        <button className="bg-brand-electric text-dark-900 px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Product
        </button>
      </div>

      {/* Key Metrics */}
      {dashboardStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Package className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-2xl font-bold text-white">{dashboardStats.totalProducts}</span>
            </div>
            <h3 className="text-dark-300 font-medium">Total Products</h3>
            <p className="text-sm text-dark-400 mt-1">Active: {dashboardStats.activeProducts}</p>
          </div>

          <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-green-400" />
              </div>
              <span className="text-2xl font-bold text-white">{dashboardStats.totalOrders}</span>
            </div>
            <h3 className="text-dark-300 font-medium">Total Orders</h3>
            <p className="text-sm text-dark-400 mt-1">Pending: {dashboardStats.pendingOrders}</p>
          </div>

          <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-400" />
              </div>
              <span className="text-2xl font-bold text-white">
                {formatCurrency(dashboardStats.revenue.thisMonth)}
              </span>
            </div>
            <h3 className="text-dark-300 font-medium">Monthly Revenue</h3>
            <p className="text-sm text-dark-400 mt-1">This month</p>
          </div>

          <div className="bg-dark-800 rounded-xl p-6 border border-dark-700">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <Package className="w-6 h-6 text-red-400" />
              </div>
              <span className="text-2xl font-bold text-white">
                {dashboardStats.lowStockProducts}
              </span>
            </div>
            <h3 className="text-dark-300 font-medium">Low Stock</h3>
            <p className="text-sm text-dark-400 mt-1">Need attention</p>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex space-x-1 bg-dark-800 rounded-lg p-1 border border-dark-700">
        {[
          { id: 'overview', label: 'Overview', icon: TrendingUp },
          { id: 'products', label: 'Products', icon: Package },
          { id: 'orders', label: 'Orders', icon: ShoppingCart },
          { id: 'categories', label: 'Categories', icon: ShoppingBag },
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
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="bg-dark-800 rounded-xl border border-dark-700">
        {activeTab === 'overview' && dashboardStats && (
          <div className="p-6 space-y-6">
            <h2 className="text-xl font-semibold text-white">E-Commerce Overview</h2>

            {/* Revenue Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-white mb-4">Revenue Breakdown</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-dark-700 rounded-lg">
                    <span className="text-dark-300">Today</span>
                    <span className="text-white font-medium">
                      {formatCurrency(dashboardStats.revenue.today)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-dark-700 rounded-lg">
                    <span className="text-dark-300">This Week</span>
                    <span className="text-white font-medium">
                      {formatCurrency(dashboardStats.revenue.thisWeek)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-dark-700 rounded-lg">
                    <span className="text-dark-300">This Month</span>
                    <span className="text-white font-medium">
                      {formatCurrency(dashboardStats.revenue.thisMonth)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-dark-700 rounded-lg">
                    <span className="text-dark-300">This Year</span>
                    <span className="text-white font-medium">
                      {formatCurrency(dashboardStats.revenue.thisYear)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Products</h2>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-dark-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-dark-700 border border-dark-600 rounded-lg text-white placeholder-dark-400 focus:outline-none focus:border-brand-electric"
                  />
                </div>
                <button className="p-2 bg-dark-700 border border-dark-600 rounded-lg text-dark-300 hover:text-white hover:bg-dark-600 transition-colors">
                  <Filter className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products
                .filter(
                  (product) =>
                    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    product.sku.toLowerCase().includes(searchQuery.toLowerCase()),
                )
                .map((product) => (
                  <div
                    key={product.id}
                    className="bg-dark-700 rounded-lg p-4 border border-dark-600"
                  >
                    <div className="aspect-square bg-dark-600 rounded-lg mb-3 flex items-center justify-center">
                      <Package className="w-12 h-12 text-dark-400" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h3 className="text-white font-medium line-clamp-2">{product.name}</h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}
                        >
                          {product.status}
                        </span>
                      </div>

                      <p className="text-sm text-dark-300 line-clamp-2">{product.description}</p>

                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-white font-medium">
                            {formatCurrency(product.price)}
                          </span>
                          {product.originalPrice && (
                            <span className="text-sm text-dark-400 line-through ml-2">
                              {formatCurrency(product.originalPrice)}
                            </span>
                          )}
                        </div>
                        <span className="text-sm text-dark-300">Stock: {product.stock}</span>
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <button className="flex-1 px-3 py-2 bg-brand-electric/20 text-brand-electric rounded-lg hover:bg-brand-electric/30 transition-colors flex items-center justify-center gap-2">
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                        <button className="px-3 py-2 bg-dark-600 text-dark-300 rounded-lg hover:bg-dark-500 hover:text-white transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Orders</h2>
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-dark-700 rounded-lg p-4 border border-dark-600">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-white font-medium">{order.orderNumber}</h3>
                      <p className="text-sm text-dark-300">
                        {order.customerInfo.name} • {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-white font-medium">{formatCurrency(order.total)}</span>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}
                        >
                          {order.status}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.paymentStatus)}`}
                        >
                          {order.paymentStatus}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-sm">
                        <span className="text-dark-300">
                          {item.name} × {item.quantity}
                        </span>
                        <span className="text-white">{formatCurrency(item.total)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-dark-600">
                    <span className="text-sm text-dark-300">
                      Payment: {order.paymentMethod} • Shipping: {order.shippingMethod}
                    </span>
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1 bg-brand-electric/20 text-brand-electric rounded hover:bg-brand-electric/30 transition-colors text-sm">
                        View Details
                      </button>
                      <button className="px-3 py-1 bg-dark-600 text-dark-300 rounded hover:bg-dark-500 hover:text-white transition-colors text-sm">
                        Update Status
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="p-6">
            <h2 className="text-xl font-semibold text-white mb-6">Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="bg-dark-700 rounded-lg p-4 border border-dark-600"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-white font-medium">{category.name}</h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(category.status)}`}
                    >
                      {category.status}
                    </span>
                  </div>

                  <p className="text-sm text-dark-300 mb-3">{category.description}</p>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-dark-400">Sort Order: {category.sortOrder}</span>
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1 bg-dark-600 text-dark-300 rounded hover:bg-dark-500 hover:text-white transition-colors text-sm">
                        <Edit className="w-3 h-3" />
                      </button>
                      <button className="px-3 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors text-sm">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};