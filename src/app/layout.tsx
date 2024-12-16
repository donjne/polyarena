// app/layout.tsx
import React from 'react';
import { Inter, Orbitron, Russo_One } from 'next/font/google';
import type { Metadata } from 'next';
import "./globals.css";
import { SolanaProviders } from './providers'
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });
const orbitron = Orbitron({ subsets: ['latin'], variable: '--font-orbitron' });
const russoOne = Russo_One({ 
  subsets: ['latin'], 
  variable: '--font-russo-one',
  weight: '400'
});

export const metadata: Metadata = {
  title: 'PolyArena | Gamified Prediction Markets',
  description: 'Compete in prediction markets with NFT avatars and rewards'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${orbitron.variable} ${russoOne.variable}`}>
      <SolanaProviders>
      <Toaster position="top-right" />
        {children}
      </SolanaProviders>
      </body>
    </html>
  );
}