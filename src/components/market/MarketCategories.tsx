// components/MarketCategories.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, TrendingUp, DollarSign, Gamepad, Globe, 
  Tv, Briefcase, Music, Film, Award, ChevronRight
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { MarketCategoryGroup } from '@/types/market';

interface CategoryInfo {
  icon: React.ElementType;
  description: string;
  gradient: string;
  accentColor: string;
  subcategories: Array<{
    name: string;
    count: number;
  }>;
}

const categoryInfo: Record<string, CategoryInfo> = {
  'POPULAR MARKETS': {
    icon: Star,
    description: 'Trending and most active prediction markets',
    gradient: 'from-amber-600 to-orange-600',
    accentColor: 'bg-amber-500',
    subcategories: [
      { name: 'Trending Now', count: 12 },
      { name: 'Most Active', count: 8 },
      { name: 'New Arrivals', count: 15 }
    ]
  },
  'FINANCIAL MARKETS': {
    icon: DollarSign,
    description: 'Crypto, stocks, and DeFi predictions',
    gradient: 'from-emerald-600 to-teal-600',
    accentColor: 'bg-emerald-500',
    subcategories: [
      { name: 'Cryptocurrency', count: 24 },
      { name: 'DeFi Protocols', count: 16 },
      { name: 'Stock Markets', count: 18 }
    ]
  },
  'SPORTS & GAMING': {
    icon: Gamepad,
    description: 'Sports matches and esports tournaments',
    gradient: 'from-blue-600 to-indigo-600',
    accentColor: 'bg-blue-500',
    subcategories: [
      { name: 'Football', count: 20 },
      { name: 'Basketball', count: 15 },
      { name: 'Esports', count: 12 }
    ]
  }
  // Add more categories as needed
};

// Enhanced animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

// Custom tooltip content with animations
function TooltipCustomContent({ category }: { category: CategoryInfo & { title: string } }) {
  return (
    <div className="p-4 max-w-xs space-y-3">
      <div className="flex items-center space-x-2 mb-2">
        <category.icon size={18} className="text-white" />
        <h3 className="font-semibold text-white">{category.description}</h3>
      </div>
      <div className="space-y-2">
        {category.subcategories.map((sub, index) => (
          <motion.div
            key={sub.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between text-sm bg-white/10 rounded-lg px-3 py-2"
          >
            <span className="text-white/90">{sub.name}</span>
            <span className="text-white/60">{sub.count}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

interface MarketCategoriesProps {
  categories: MarketCategoryGroup[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

export function MarketCategories({
  categories,
  selectedCategory,
  onSelectCategory
}: MarketCategoriesProps) {
  const mainCategories = categories.map(category => ({
    id: category.title.toLowerCase().replace(/\s+/g, '-'),
    title: category.title,
    count: category.markets.length,
    highlighted: category.highlighted,
    ...categoryInfo[category.title]
  }));

  return (
    <TooltipProvider>
      <motion.div 
        className="w-full overflow-x-auto hide-scrollbar -mx-4 px-4"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <div className="min-w-max">
          <div className="flex space-x-4">
            <AnimatePresence mode="wait">
              {mainCategories.map((category) => (
                <motion.div
                  key={category.id}
                  variants={itemVariants}
                  layout
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.button
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onSelectCategory(
                          selectedCategory === category.id ? null : category.id
                        )}
                        className={cn(
                          "px-6 py-3 rounded-lg flex items-center space-x-2 font-['Orbitron']",
                          "whitespace-nowrap transition-all duration-300",
                          "hover:shadow-lg hover:shadow-purple-500/10",
                          selectedCategory === category.id
                            ? `bg-gradient-to-r ${category.gradient} text-white shadow-lg`
                            : category.highlighted 
                              ? 'bg-white text-purple-600 shadow-md'
                              : 'bg-white/50 text-purple-600 hover:bg-white'
                        )}
                      >
                        <category.icon 
                          size={20} 
                          className={cn(
                            "transition-transform duration-300",
                            selectedCategory === category.id ? 'text-white' : 'text-purple-600'
                          )}
                        />
                        <span>{category.title}</span>
                        <motion.span 
                          layout
                          className={cn(
                            "px-2 py-0.5 text-xs rounded-full transition-colors duration-300",
                            selectedCategory === category.id
                              ? 'bg-white/20 text-white'
                              : 'bg-purple-100 text-purple-600'
                          )}
                        >
                          {category.count}
                        </motion.span>
                      </motion.button>
                    </TooltipTrigger>
                    <TooltipContent 
                      side="bottom"
                      className={cn(
                        "bg-gradient-to-br shadow-xl",
                        category.gradient
                      )}
                      sideOffset={8}
                    >
                      <TooltipCustomContent category={category} />
                    </TooltipContent>
                  </Tooltip>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </TooltipProvider>
  );
}