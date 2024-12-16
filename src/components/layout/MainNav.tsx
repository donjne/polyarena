// components/layout/MainNav.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Home, ShoppingBag, Gamepad, 
  Trophy, User, Wallet
} from 'lucide-react';

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/marketplace', label: 'Marketplace', icon: ShoppingBag },
  { href: '/arenas', label: 'Arenas', icon: Gamepad },
  { href: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  { href: '/profile', label: 'Profile', icon: User }
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b border-purple-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-['Russo_One'] bg-gradient-to-r from-purple-600 to-blue-600 
                             text-transparent bg-clip-text">
                POLYARENA
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2
                  ${pathname === item.href
                    ? 'bg-purple-100 text-purple-600'
                    : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                  }`}
              >
                <item.icon size={20} />
                <span>{item.label}</span>
              </Link>
            ))}

            <motion.button
              whileHover={{ scale: 1.05 }}
              className="px-4 py-2 rounded-lg bg-purple-600 text-white flex items-center space-x-2"
            >
              <Wallet size={20} />
              <span>Connect</span>
            </motion.button>
          </div>
        </div>
      </div>
    </nav>
  );
}