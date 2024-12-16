// components/inventory/UserInventory.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Grid, List, Filter, Search, Box,
  Archive, Tag, Clock, Trash2, Eye
} from 'lucide-react';
import type { NFTAsset } from '@/types/marketplace';
import { InventoryGridItem } from './InventoryGridItem';
import { InventoryListItem } from './InventoryListItem';

export interface InventoryItem extends NFTAsset {
  equipped: boolean;
  equippableSlots: string[];
  acquired: number;
  tradeable: boolean;
}

interface InventoryStats {
  totalItems: number;
  equippedItems: number;
  tradeableItems: number;
  totalValue: string;
}

interface UserInventoryProps {
  items: InventoryItem[];
  stats: InventoryStats;
  onEquip: (item: InventoryItem, slot: string) => void;
  onUnequip: (item: InventoryItem) => void;
  onList: (item: InventoryItem) => void;
  onView: (item: InventoryItem) => void;
  onTransfer: (item: InventoryItem) => void;
}

export const UserInventory: React.FC<UserInventoryProps> = ({
  items,
  stats,
  onEquip,
  onUnequip,
  onList,
  onView,
  onTransfer
}) => {
  const [view, setView] = React.useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = React.useState<{
    type?: string[];
    equipped?: boolean;
    tradeable?: boolean;
    search: string;
  }>({
    search: ''
  });

  const filteredItems = React.useMemo(() => {
    return items.filter(item => {
      if (filter.type?.length && !filter.type.includes(item.type)) return false;
      if (filter.equipped !== undefined && item.equipped !== filter.equipped) return false;
      if (filter.tradeable !== undefined && item.tradeable !== filter.tradeable) return false;
      if (filter.search && !item.name.toLowerCase().includes(filter.search.toLowerCase())) return false;
      return true;
    });
  }, [items, filter]);

  return (
    <div className="space-y-8">
      {/* Inventory Stats */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center space-x-3 mb-2">
            <Archive className="text-purple-600" size={24} />
            <span className="text-purple-600">Total Items</span>
          </div>
          <div className="text-2xl font-bold text-purple-900">
            {stats.totalItems}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center space-x-3 mb-2">
            <Box className="text-purple-600" size={24} />
            <span className="text-purple-600">Equipped</span>
          </div>
          <div className="text-2xl font-bold text-purple-900">
            {stats.equippedItems}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center space-x-3 mb-2">
            <Tag className="text-purple-600" size={24} />
            <span className="text-purple-600">Tradeable</span>
          </div>
          <div className="text-2xl font-bold text-purple-900">
            {stats.tradeableItems}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center space-x-3 mb-2">
            <Clock className="text-purple-600" size={24} />
            <span className="text-purple-600">Total Value</span>
          </div>
          <div className="text-2xl font-bold text-purple-900">
            {stats.totalValue}
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center space-x-4 mb-6">
          {/* Search */}
          <div className="flex-1 relative">
            <input
              type="text"
              value={filter.search}
              onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
              placeholder="Search inventory..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-purple-50 border border-purple-200
                       focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <Search 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400"
              size={20}
            />
          </div>

          {/* View Toggle */}
          <div className="bg-purple-100 rounded-lg p-1">
            <button
              onClick={() => setView('grid')}
              className={`p-2 rounded-lg ${
                view === 'grid'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-purple-600'
              }`}
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-2 rounded-lg ${
                view === 'list'
                  ? 'bg-white text-purple-600 shadow-sm'
                  : 'text-purple-600'
              }`}
            >
              <List size={20} />
            </button>
          </div>

          {/* Filter Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => {}} // Open filter modal
            className="p-2 rounded-lg text-purple-600 hover:bg-purple-100"
          >
            <Filter size={20} />
          </motion.button>
        </div>

        {/* Item Grid/List */}
        {view === 'grid' ? (
          <div className="grid grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <InventoryGridItem
                key={item.id}
                item={item}
                onEquip={onEquip}
                onUnequip={onUnequip}
                onList={onList}
                onView={onView}
                onTransfer={onTransfer}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <InventoryListItem
                key={item.id}
                item={item}
                onEquip={onEquip}
                onUnequip={onUnequip}
                onList={onList}
                onView={onView}
                onTransfer={onTransfer}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};