// components/inventory/InventoryListItem.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, Tag, Box, Send, Clock, 
  CheckCircle, ChevronRight, Shield 
} from 'lucide-react';
import type { InventoryItem } from './UserInventory';

interface InventoryListItemProps {
  item: InventoryItem;
  onEquip: (item: InventoryItem, slot: string) => void;
  onUnequip: (item: InventoryItem) => void;
  onList: (item: InventoryItem) => void;
  onView: (item: InventoryItem) => void;
  onTransfer: (item: InventoryItem) => void;
}

export const InventoryListItem: React.FC<InventoryListItemProps> = ({
  item,
  onEquip,
  onUnequip,
  onList,
  onView,
  onTransfer
}) => {
  const [showSlotSelect, setShowSlotSelect] = React.useState(false);

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-center p-4">
        {/* Item Preview */}
        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
          <img
            src={item.preview}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Item Info */}
        <div className="ml-4 flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium text-purple-900 truncate">{item.name}</h3>
              <div className="flex items-center space-x-2 text-sm text-purple-600">
                <span className="capitalize">{item.type}</span>
                {item.equipped && (
                  <>
                    <span>•</span>
                    <div className="flex items-center space-x-1 text-green-600">
                      <CheckCircle size={14} />
                      <span>Equipped</span>
                    </div>
                  </>
                )}
              </div>
            </div>
            {item.rarity && (
              <span className={`px-2 py-1 rounded-full text-xs font-medium
                ${item.rarity === 'legendary' ? 'bg-yellow-100 text-yellow-800' :
                  item.rarity === 'epic' ? 'bg-purple-100 text-purple-800' :
                  item.rarity === 'rare' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                {item.rarity}
              </span>
            )}
          </div>
        </div>

        {/* Acquisition Info */}
        <div className="flex items-center space-x-6 ml-6">
          <div className="text-right">
            <div className="text-sm text-purple-600">Acquired</div>
            <div className="font-medium text-purple-900">
              {new Date(item.acquired).toLocaleDateString()}
            </div>
          </div>

          {/* Attributes Summary */}
          <div className="flex items-center space-x-4 px-6 border-l border-r border-purple-100">
            {item.tradeable && (
              <div className="flex items-center space-x-1 text-purple-600">
                <Tag size={16} />
                <span className="text-sm">Tradeable</span>
              </div>
            )}
            {item.equippableSlots.length > 0 && (
              <div className="flex items-center space-x-1 text-purple-600">
                <Box size={16} />
                <span className="text-sm">{item.equippableSlots.length} slots</span>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={() => onView(item)}
              className="p-2 rounded-lg text-purple-600 hover:bg-purple-100"
              title="View Details"
            >
              <Eye size={20} />
            </motion.button>

            {item.tradeable && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={() => onList(item)}
                className="p-2 rounded-lg text-purple-600 hover:bg-purple-100"
                title="List for Sale"
              >
                <Tag size={20} />
              </motion.button>
            )}

            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={() => onTransfer(item)}
              className="p-2 rounded-lg text-purple-600 hover:bg-purple-100"
              title="Transfer Item"
            >
              <Send size={20} />
            </motion.button>

            {item.equippableSlots.length > 0 && (
              item.equipped ? (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => onUnequip(item)}
                  className="px-4 py-2 rounded-lg border-2 border-purple-600 
                           text-purple-600 font-medium hover:bg-purple-50"
                >
                  Unequip
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setShowSlotSelect(!showSlotSelect)}
                  className="px-4 py-2 rounded-lg bg-purple-600 
                           text-white font-medium hover:bg-purple-700"
                >
                  Equip
                </motion.button>
              )
            )}
          </div>
        </div>
      </div>

      {/* Slot Selection */}
      <AnimatePresence>
        {showSlotSelect && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-purple-100"
          >
            <div className="p-4 bg-purple-50">
              <div className="text-sm font-medium text-purple-900 mb-3">
                Select Slot to Equip
              </div>
              <div className="grid grid-cols-4 gap-3">
                {item.equippableSlots.map((slot) => (
                  <motion.button
                    key={slot}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => {
                      onEquip(item, slot);
                      setShowSlotSelect(false);
                    }}
                    className="px-4 py-2 rounded-lg bg-white text-purple-600 
                             hover:bg-purple-100 border border-purple-200"
                  >
                    {slot}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};