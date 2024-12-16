'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { ClanDashboard } from '@/components/clan/ClanDashboard';
import { EventsTab } from '@/components/clan/EventsTab';
import { SettingsTab } from '@/components/clan/SettingsTab';
import type { Clan } from '@/types/community';
import type { UserProfile } from '@/types/user';
import type { ClanEvent } from '@/types/community'; // We'll need to create this type

// Extended Clan type to include missing fields
interface ExtendedClan extends Clan {
  rank?: number;
  verified?: boolean;
  stats: {
    totalWins: number;
    averageRank: number;
    activePlayers: number;
    winRate: number; // Added missing field
  };
}

export default function ClanDetailPage() {
  const { clanId } = useParams();
  const [clan, setClan] = React.useState<ExtendedClan | null>(null);
  const [members, setMembers] = React.useState<UserProfile[]>([]);
  const [events, setEvents] = React.useState<ClanEvent[]>([]);
  const [currentUserRole, setCurrentUserRole] = React.useState<'owner' | 'admin' | 'member'>('member');
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [activeTab, setActiveTab] = React.useState<'overview' | 'events' | 'settings'>('overview');

  // Fetch clan data
  React.useEffect(() => {
    const fetchClanData = async () => {
      try {
        setIsLoading(true);
        // TODO: Replace with actual API calls
        const response = await fetch(`/api/clans/${clanId}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch clan data');
        }
        
        setClan(data.clan);
        setMembers(data.members);
        setEvents(data.events);
        setCurrentUserRole(data.currentUserRole);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    if (clanId) {
      fetchClanData();
    }
  }, [clanId]);

  // Event handlers
  const handleInviteMember = async (address: string) => {
    try {
      const response = await fetch(`/api/clans/${clanId}/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address })
      });
      
      if (!response.ok) {
        throw new Error('Failed to invite member');
      }
      
      // Refresh member list
      const updatedMembers = await fetch(`/api/clans/${clanId}/members`).then(res => res.json());
      setMembers(updatedMembers);
    } catch (err) {
      console.error('Error inviting member:', err);
    }
  };

  const handleRemoveMember = async (address: string) => {
    try {
      const response = await fetch(`/api/clans/${clanId}/members/${address}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to remove member');
      }
      
      setMembers(members.filter(member => member.address !== address));
    } catch (err) {
      console.error('Error removing member:', err);
    }
  };

  const handlePromoteMember = async (address: string) => {
    try {
      const response = await fetch(`/api/clans/${clanId}/members/${address}/promote`, {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error('Failed to promote member');
      }
      
      // Refresh member list to get updated roles
      const updatedMembers = await fetch(`/api/clans/${clanId}/members`).then(res => res.json());
      setMembers(updatedMembers);
    } catch (err) {
      console.error('Error promoting member:', err);
    }
  };

  const handleUpdateSettings = async (settings: Partial<ExtendedClan>) => {
    try {
      const response = await fetch(`/api/clans/${clanId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update settings');
      }
      
      setClan(prevClan => ({ ...prevClan!, ...settings }));
      return true;
    } catch (err) {
      console.error('Error updating settings:', err);
      return false;
    }
  };

  const handleCreateEvent = async () => {
    // TODO: Implement event creation logic
    console.log('Create event');
  };

  const handleJoinEvent = async (eventId: string) => {
    try {
      const response = await fetch(`/api/clans/${clanId}/events/${eventId}/join`, {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error('Failed to join event');
      }
      
      // Refresh events list
      const updatedEvents = await fetch(`/api/clans/${clanId}/events`).then(res => res.json());
      setEvents(updatedEvents);
    } catch (err) {
      console.error('Error joining event:', err);
    }
  };

  const handleCancelEvent = async (eventId: string) => {
    try {
      const response = await fetch(`/api/clans/${clanId}/events/${eventId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Failed to cancel event');
      }
      
      setEvents(events.filter(event => event.id !== eventId));
    } catch (err) {
      console.error('Error canceling event:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600" />
      </div>
    );
  }

  if (error || !clan) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h2 className="text-2xl font-bold text-purple-900 mb-4">
          {error || 'Clan not found'}
        </h2>
        <p className="text-purple-600">
          Please check the URL and try again
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {activeTab === 'overview' && (
        <ClanDashboard
          clan={clan}
          members={members}
          onInviteMember={handleInviteMember}
          onRemoveMember={handleRemoveMember}
          onPromoteMember={handlePromoteMember}
          onUpdateSettings={handleUpdateSettings}
          onCreateEvent={handleCreateEvent}
        />
      )}

      {activeTab === 'events' && (
        <EventsTab
          clan={clan}
          events={events}
          onCreateEvent={handleCreateEvent}
          onJoinEvent={handleJoinEvent}
          onCancelEvent={handleCancelEvent}
        />
      )}

      {activeTab === 'settings' && (
        <SettingsTab
          clan={clan}
          onUpdateSettings={handleUpdateSettings}
          onUpdateBranding={async (file: File) => {
            // TODO: Implement branding update logic
            return '';
          }}
          currentUserRole={currentUserRole}
        />
      )}
    </div>
  );
}