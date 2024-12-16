// components/monitoring/LogsTab.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, AlertCircle, Filter, Download,
  Search, Clock, RefreshCw, ChevronDown,
  Info, AlertTriangle, CheckCircle
} from 'lucide-react';

interface LogEvent {
  id: string;
  timestamp: number;
  type: 'info' | 'warning' | 'error' | 'success';
  category: 'system' | 'oracle' | 'prediction' | 'user' | 'security';
  message: string;
  details?: Record<string, any>;
  source: string;
  hash?: string;
}

interface LogFilter {
  types: LogEvent['type'][];
  categories: LogEvent['category'][];
  startTime?: number;
  endTime?: number;
  searchQuery: string;
}

interface LogsTabProps {
  logs: LogEvent[];
  onRefresh: () => Promise<void>;
  onExport: (filter: LogFilter) => Promise<void>;
  onFilter: (filter: LogFilter) => void;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export const LogsTab: React.FC<LogsTabProps> = ({
  logs,
  onRefresh,
  onExport,
  onFilter,
  autoRefresh = true,
  refreshInterval = 5000
}) => {
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [showFilters, setShowFilters] = React.useState(false);
  const [selectedLog, setSelectedLog] = React.useState<LogEvent | null>(null);
  const [filter, setFilter] = React.useState<LogFilter>({
    types: [],
    categories: [],
    searchQuery: ''
  });

  React.useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        handleRefresh();
      }, refreshInterval);

      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval]);

  const handleRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleFilterChange = (newFilter: Partial<LogFilter>) => {
    const updatedFilter = { ...filter, ...newFilter };
    setFilter(updatedFilter);
    onFilter(updatedFilter);
  };

  const getEventIcon = (type: LogEvent['type']) => {
    switch (type) {
      case 'info':
        return <Info size={20} className="text-blue-500" />;
      case 'warning':
        return <AlertTriangle size={20} className="text-yellow-500" />;
      case 'error':
        return <AlertCircle size={20} className="text-red-500" />;
      case 'success':
        return <CheckCircle size={20} className="text-green-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="bg-white rounded-xl p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                value={filter.searchQuery}
                onChange={(e) => handleFilterChange({ searchQuery: e.target.value })}
                placeholder="Search logs..."
                className="w-64 pl-10 pr-4 py-2 rounded-lg bg-purple-50 border border-purple-200
                         focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <Search 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400"
                size={20}
              />
            </div>

            {/* Filter Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2
                ${showFilters 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-purple-100 text-purple-600'
                }`}
            >
              <Filter size={20} />
              <span>Filters</span>
            </motion.button>
          </div>

          <div className="flex items-center space-x-4">
            {/* Export */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => onExport(filter)}
              className="px-4 py-2 rounded-lg bg-purple-100 text-purple-600 
                       hover:bg-purple-200 flex items-center space-x-2"
            >
              <Download size={20} />
              <span>Export</span>
            </motion.button>

            {/* Refresh */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 rounded-lg text-purple-600 hover:bg-purple-100"
            >
              <RefreshCw 
                className={isRefreshing ? 'animate-spin' : ''} 
                size={20}
              />
            </motion.button>
          </div>
        </div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4 pt-4 border-t border-purple-100"
            >
              <div className="grid grid-cols-3 gap-6">
                {/* Event Types */}
                <div>
                  <label className="block text-sm font-medium text-purple-900 mb-2">
                    Event Types
                  </label>
                  <div className="space-y-2">
                    {['info', 'warning', 'error', 'success'].map((type) => (
                      <label key={type} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={filter.types.includes(type as LogEvent['type'])}
                          onChange={(e) => {
                            const types = e.target.checked
                              ? [...filter.types, type as LogEvent['type']]
                              : filter.types.filter(t => t !== type);
                            handleFilterChange({ types });
                          }}
                          className="rounded border-purple-300 text-purple-600 
                                   focus:ring-purple-500"
                        />
                        <span className="capitalize">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <label className="block text-sm font-medium text-purple-900 mb-2">
                    Categories
                  </label>
                  <div className="space-y-2">
                    {['system', 'oracle', 'prediction', 'user', 'security'].map((category) => (
                      <label key={category} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={filter.categories.includes(category as LogEvent['category'])}
                          onChange={(e) => {
                            const categories = e.target.checked
                              ? [...filter.categories, category as LogEvent['category']]
                              : filter.categories.filter(c => c !== category);
                            handleFilterChange({ categories });
                          }}
                          className="rounded border-purple-300 text-purple-600 
                                   focus:ring-purple-500"
                        />
                        <span className="capitalize">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Time Range */}
                <div>
                  <label className="block text-sm font-medium text-purple-900 mb-2">
                    Time Range
                  </label>
                  <div className="space-y-4">
                    <input
                      type="datetime-local"
                      value={filter.startTime 
                        ? new Date(filter.startTime).toISOString().slice(0, 16) 
                        : ''
                      }
                      onChange={(e) => handleFilterChange({
                        startTime: e.target.value ? new Date(e.target.value).getTime() : undefined
                      })}
                      className="w-full px-4 py-2 rounded-lg bg-purple-50 border border-purple-200
                               focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <input
                      type="datetime-local"
                      value={filter.endTime
                        ? new Date(filter.endTime).toISOString().slice(0, 16)
                        : ''
                      }
                      onChange={(e) => handleFilterChange({
                        endTime: e.target.value ? new Date(e.target.value).getTime() : undefined
                      })}
                      className="w-full px-4 py-2 rounded-lg bg-purple-50 border border-purple-200
                               focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Logs List */}
      <div className="space-y-4">
        {logs.map((log) => (
          <motion.div
            key={log.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-white rounded-xl p-4 shadow-lg cursor-pointer
              ${selectedLog?.id === log.id ? 'ring-2 ring-purple-500' : ''}`}
            onClick={() => setSelectedLog(selectedLog?.id === log.id ? null : log)}
          >
            <div className="flex items-start space-x-4">
              {getEventIcon(log.type)}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-purple-900">{log.message}</span>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-purple-600">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                    <span className="px-2 py-1 rounded-full text-xs font-medium
                                 bg-purple-100 text-purple-600 capitalize">
                      {log.category}
                    </span>
                  </div>
                </div>

                {selectedLog?.id === log.id && log.details && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    className="mt-4 pt-4 border-t border-purple-100"
                  >
                    <pre className="text-sm text-purple-600 overflow-x-auto">
                      {JSON.stringify(log.details, null, 2)}
                    </pre>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};