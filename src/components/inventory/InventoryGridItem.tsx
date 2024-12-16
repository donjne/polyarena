// components/inventory/InventoryGridItem.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, Tag, Box, Send, MoreVertical,
  CheckCircle, XCircle, AlertCircle
} from 'lucide-react';
import type { InventoryItem } from './UserInventory';

interface InventoryItemProps {
  item: InventoryItem;
  onEquip: (item: InventoryItem, slot: string) => void;
  onUnequip: (item: InventoryItem) => void;
  onList: (item: InventoryItem) => void;
  onView: (item: InventoryItem) => void;
  onTransfer: (item: InventoryItem) => void;
}

export const InventoryGridItem: React.FC<InventoryItemProps> = ({
  item,
  onEquip,
  onUnequip,
  onList,
  onView,
  onTransfer
}) => {
  const [showActions, setShowActions] = React.useState(false);
  const [selectedSlot, setSelectedSlot] = React.useState<string | null>(null);

  const actionButtonClass = "p-2 rounded-lg hover:bg-purple-100 text-purple-600 transition-colors";

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden relative group"
    >
      {/* Item Image */}
      <div className="relative aspect-square">
        <img 
          src={item.preview}
          alt={item.name}
          className="w-full h-full object-cover"
        />
        
        {/* Equipped Badge */}
        {item.equipped && (
          <div className="absolute top-2 right-2 px-2 py-1 rounded-full 
                         bg-green-100 text-green-600 text-xs font-medium
                         flex items-center space-x-1">
            <CheckCircle size={12} />
            <span>Equipped</span>
          </div>
        )}

        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100
                       flex items-center justify-center space-x-2 transition-opacity">
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={() => onView(item)}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white"
          >
            <Eye size={20} />
          </motion.button>
          {item.tradeable && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={() => onList(item)}
              className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white"
            >
              <Tag size={20} />
            </motion.button>
          )}
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={() => setShowActions(true)}
            className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white"
          >
            <MoreVertical size={20} />
          </motion.button>
        </div>
      </div>

      {/* Item Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-medium text-purple-900">{item.name}</h3>
            <div className="text-sm text-purple-600 capitalize">{item.type}</div>
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

        {/* Equip/Unequip Button */}
        {item.equippableSlots.length > 0 && (
          item.equipped ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={() => onUnequip(item)}
              className="w-full px-4 py-2 rounded-lg border-2 border-purple-600 
                       text-purple-600 font-medium hover:bg-purple-50"
            >
              Unequip
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedSlot(item.equippableSlots[0])}
              className="w-full px-4 py-2 rounded-lg bg-purple-600 
                       text-white font-medium hover:bg-purple-700"
            >
              Equip
            </motion.button>
          )
        )}
      </div>

      {/* Actions Modal */}
      <AnimatePresence>
        {showActions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-lg shadow-xl p-4 space-y-2 w-full max-w-xs"
            >
              <button
                onClick={() => onView(item)}
                className={actionButtonClass}
              >
                <div className="flex items-center space-x-2">
                  <Eye size={18} />
                  <span>View Details</span>
                </div>
              </button>

              {item.tradeable && (
                <button
                  onClick={() => onList(item)}
                  className={actionButtonClass}
                >
                  <div className="flex items-center space-x-2">
                    <Tag size={18} />
                    <span>List for Sale</span>
                  </div>
                </button>
              )}

              <button
                onClick={() => onTransfer(item)}
                className={actionButtonClass}
              >
                <div className="flex items-center space-x-2">
                  <Send size={18} />
                  <span>Transfer</span>
                </div>
              </button>

              <div className="pt-2 border-t border-purple-100">
                <button
                  onClick={() => setShowActions(false)}
                  className="w-full px-4 py-2 rounded-lg text-purple-600 hover:bg-purple-50"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Slot Selection Modal */}
        {selectedSlot && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-lg shadow-xl p-4 w-full max-w-xs"
            >
              <h4 className="font-medium text-purple-900 mb-4">Select Slot</h4>
              <div className="space-y-2">
                {item.equippableSlots.map((slot) => (
                  <motion.button
                    key={slot}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => {
                      onEquip(item, slot);
                      setSelectedSlot(null);
                    }}
                    className="w-full px-4 py-2 rounded-lg bg-purple-50 
                             text-purple-600 hover:bg-purple-100"
                  >
                    {slot}
                  </motion.button>
                ))}
              </div>
              <button
                onClick={() => setSelectedSlot(null)}
                className="w-full px-4 py-2 mt-4 rounded-lg text-purple-600 hover:bg-purple-50"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};