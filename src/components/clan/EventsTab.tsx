// components/clan/EventsTab.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, Calendar, Users2, 
  Timer, Target, Shield, Star 
} from 'lucide-react';
import { Clan } from '@/types/community';

interface ClanEvent {
  id: string;
  name: string;
  type: 'tournament' | 'challenge' | 'practice';
  startTime: number;
  endTime: number;
  participants: {
    required: number;
    registered: number;
  };
  prize?: {
    amount: string;
    currency: string;
  };
  status: 'upcoming' | 'active' | 'completed';
  requirements?: {
    minLevel: number;
    minWinRate: number;
  };
}

interface EventsTabProps {
  clan: Clan;
  events: ClanEvent[];
  onCreateEvent: () => void;
  onJoinEvent: (eventId: string) => void;
  onCancelEvent: (eventId: string) => void;
}

export const EventsTab: React.FC<EventsTabProps> = ({
  clan,
  events,
  onCreateEvent,
  onJoinEvent,
  onCancelEvent
}) => {
  const [activeFilter, setActiveFilter] = React.useState<ClanEvent['status']>('upcoming');

  const filteredEvents = React.useMemo(() => {
    return events.filter(event => event.status === activeFilter);
  }, [events, activeFilter]);

  const formatTimeRemaining = (timestamp: number): string => {
    const diff = timestamp - Date.now();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Trophy className="text-purple-600" size={24} />
          <h2 className="text-xl font-bold text-purple-900">Clan Events</h2>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={onCreateEvent}
          className="px-6 py-2 rounded-lg bg-purple-600 text-white font-medium
                   hover:bg-purple-700 transition-colors flex items-center space-x-2"
        >
          <Calendar size={20} />
          <span>Create Event</span>
        </motion.button>
      </div>

      {/* Filters */}
      <div className="flex space-x-4">
        {(['upcoming', 'active', 'completed'] as const).map((status) => (
          <motion.button
            key={status}
            whileHover={{ scale: 1.05 }}
            onClick={() => setActiveFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors
              ${activeFilter === status
                ? 'bg-purple-600 text-white'
                : 'bg-purple-100 text-purple-600 hover:bg-purple-200'
              }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </motion.button>
        ))}
      </div>

      {/* Events List */}
      <div className="grid grid-cols-2 gap-6">
        {filteredEvents.map((event) => (
          <motion.div
            key={event.id}
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            {/* Event Header */}
            <div className={`p-4 text-white ${
              event.type === 'tournament' ? 'bg-purple-600' :
              event.type === 'challenge' ? 'bg-blue-600' : 'bg-green-600'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {event.type === 'tournament' && <Trophy size={20} />}
                  {event.type === 'challenge' && <Target size={20} />}
                  {event.type === 'practice' && <Shield size={20} />}
                  <span className="font-medium capitalize">{event.type}</span>
                </div>
                {event.prize && (
                  <div className="flex items-center space-x-1">
                    <Star size={16} />
                    <span>{event.prize.amount} {event.prize.currency}</span>
                  </div>
                )}
              </div>
              <h3 className="text-lg font-bold">{event.name}</h3>
            </div>

            {/* Event Details */}
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-purple-600 mb-1">Time</div>
                  <div className="flex items-center space-x-2">
                    <Timer size={16} className="text-purple-600" />
                    <span className="font-medium text-purple-900">
                      {formatTimeRemaining(event.startTime)}
                    </span>
                  </div>
                </div>
                
                <div>
                  <div className="text-sm text-purple-600 mb-1">Participants</div>
                  <div className="flex items-center space-x-2">
                    <Users2 size={16} className="text-purple-600" />
                    <span className="font-medium text-purple-900">
                      {event.participants.registered}/{event.participants.required}
                    </span>
                  </div>
                </div>
              </div>

              {event.requirements && (
                <div className="text-sm">
                  <div className="text-purple-600 mb-1">Requirements</div>
                  <div className="flex items-center justify-between text-purple-900">
                    <span>Level {event.requirements.minLevel}+</span>
                    <span>{event.requirements.minWinRate}% Win Rate</span>
                  </div>
                </div>
              )}

              {/* Action Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={() => event.status === 'upcoming' 
                  ? onJoinEvent(event.id)
                  : onCancelEvent(event.id)
                }
                className={`w-full py-2 rounded-lg font-medium transition-colors
                  ${event.status === 'upcoming'
                    ? 'bg-purple-600 text-white hover:bg-purple-700'
                    : 'bg-red-100 text-red-600 hover:bg-red-200'
                  }`}
              >
                {event.status === 'upcoming' ? 'Join Event' : 'Cancel Event'}
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};