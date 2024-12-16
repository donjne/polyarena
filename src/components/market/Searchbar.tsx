// components/market/SearchBar.tsx
import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => (
  <div className="p-3 border-b border-purple-100">
    <div className="relative">
      <Search className="absolute left-3 top-2.5 text-purple-400" size={20} />
      <input
        type="text"
        placeholder="Search markets..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-4 py-2 rounded-lg bg-purple-50 border border-purple-100
                 focus:outline-none focus:ring-2 focus:ring-purple-500/30 placeholder-purple-300"
      />
    </div>
  </div>
);